import 'dotenv/config';
import express, { type Express } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { TrackId } from './src/types/index.ts';
import { verifyOwnerAuthHeader, type VerifyOwnerOptions } from './server/auth.ts';
import {
  generateTrackDailyResources,
  getDailyResourcesDashboard,
  isEphemeralServerlessRuntime,
  runDailyAutomationJob,
  startDaily10AmIstScheduler
} from './server/dailyResourcesService.ts';
import { isTrackDayCurrentlyUnlockedCanonical } from './supabase/functions/daily-learning-resources/pipeline.ts';

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === 'production';

function isValidTrackId(value: unknown): value is TrackId {
  return value === 'main' || value === 'dsa' || value === 'azure';
}

export interface CreateAppOptions {
  attachFrontend?: boolean;
  verifyOwner?: (
    authorizationHeader: string | string[] | null | undefined,
    options?: VerifyOwnerOptions
  ) => ReturnType<typeof verifyOwnerAuthHeader>;
}

export async function createApp(options?: CreateAppOptions): Promise<Express> {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  const verifyOwner = options?.verifyOwner || verifyOwnerAuthHeader;
  const attachFrontend = options?.attachFrontend ?? true;

  // ==========================================
  // API ROUTES (Registered BEFORE Vite / SPA fallback)
  // ==========================================
  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      service: 'steeven-prep-tracker-server',
      timezone: 'Asia/Kolkata',
      dailyScheduleIst: '10:00 AM IST'
    });
  });

  app.get('/api/daily-resources', async (req, res) => {
    try {
      const rawTrack = typeof req.query.track === 'string' ? req.query.track : undefined;
      const dayParam = typeof req.query.day === 'string' ? Number(req.query.day) : undefined;

      if (rawTrack !== undefined && !isValidTrackId(rawTrack)) {
        res.status(400).json({ error: 'Invalid track query parameter. Expected main, dsa, or azure.' });
        return;
      }

      const validatedTrack: TrackId | undefined = rawTrack;

      if (dayParam !== undefined && validatedTrack) {
        if (!Number.isInteger(dayParam) || dayParam < 1) {
          res.status(400).json({ error: 'Invalid day query parameter.' });
          return;
        }
        if (!isTrackDayCurrentlyUnlockedCanonical(validatedTrack, dayParam)) {
          res.status(403).json({
            error: `Day ${dayParam} of ${validatedTrack.toUpperCase()} is locked until 00:00 IST on its scheduled date.`
          });
          return;
        }
      }

      const payload = await getDailyResourcesDashboard({
        track: validatedTrack,
        day: dayParam
      });

      res.json(payload);
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to load daily AI learning resources.'
      });
    }
  });

  app.post('/api/daily-resources/refresh', async (req, res) => {
    try {
      // Fail-closed: strictly verify Owner JWT server-side (never trust req.body.role)
      const auth = await verifyOwner(req.headers.authorization, { allowCronSecret: false });
      if (!auth.authorized) {
        res.status(auth.status).json({ error: auth.error });
        return;
      }

      const { trackId, dayNumber } = (req.body || {}) as {
        trackId?: unknown;
        dayNumber?: unknown;
      };

      if (!isValidTrackId(trackId)) {
        res.status(400).json({ error: 'Valid trackId (main | dsa | azure) is required.' });
        return;
      }

      const parsedDay = Number(dayNumber);
      if (!Number.isInteger(parsedDay) || parsedDay < 1) {
        res.status(400).json({ error: 'Valid positive integer dayNumber is required.' });
        return;
      }

      if (!isTrackDayCurrentlyUnlockedCanonical(trackId, parsedDay)) {
        res.status(403).json({
          error: `Day ${parsedDay} of ${trackId.toUpperCase()} is locked until its scheduled IST unlock date.`
        });
        return;
      }

      const updatedTrack = await generateTrackDailyResources(trackId, parsedDay, {
        forceRefresh: true,
        persistToCloud: true
      });

      const dashboard = await getDailyResourcesDashboard({
        track: trackId,
        day: parsedDay
      });
      dashboard.tracks[trackId] = updatedTrack;

      res.json({
        ok: true,
        track: updatedTrack,
        dashboard
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Refresh failed.';
      const status = msg.startsWith('LOCKED_FUTURE_DAY') ? 403 : 500;
      res.status(status).json({ error: msg });
    }
  });

  app.post('/api/daily-resources/run-daily', async (req, res) => {
    try {
      // Fail-closed: strictly require verified Owner JWT or valid CRON_SECRET
      const auth = await verifyOwner(req.headers.authorization, { allowCronSecret: true });
      if (!auth.authorized) {
        res.status(auth.status).json({ error: auth.error });
        return;
      }

      const { sendEmail, bypassIdempotency } = (req.body || {}) as {
        sendEmail?: boolean;
        bypassIdempotency?: boolean;
      };

      const result = await runDailyAutomationJob({
        triggerSource: auth.authMethod === 'cron_secret' ? 'cron_10am_ist' : 'manual_owner',
        sendEmail: sendEmail !== false,
        bypassIdempotency: Boolean(bypassIdempotency)
      });

      res.json({
        ok: true,
        alreadyRanToday: result.alreadyRanToday,
        dashboard: result.payload
      });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Daily automation run failed.'
      });
    }
  });

  if (attachFrontend) {
    if (!IS_PROD) {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
          hmr: process.env.DISABLE_HMR !== 'true'
        },
        appType: 'spa'
      });
      app.use(vite.middlewares);
    } else {
      const distDir = path.resolve(process.cwd(), 'dist');
      app.use(express.static(distDir));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distDir, 'index.html'));
      });
    }
  }

  return app;
}

const currentFilePath = fileURLToPath(import.meta.url);
const isDirectEntryRun =
  Boolean(process.argv[1]) && path.resolve(process.argv[1]) === path.resolve(currentFilePath);

if (isDirectEntryRun && !process.env.VERCEL && process.env.DISABLE_AUTO_LISTEN !== 'true') {
  createApp({ attachFrontend: true })
    .then((app) => {
      app.listen(PORT, '0.0.0.0', () => {
        if (!isEphemeralServerlessRuntime()) {
          startDaily10AmIstScheduler();
        }
        console.log(
          `Steeven Prep Tracker server listening on http://0.0.0.0:${PORT} (${
            IS_PROD ? 'production' : 'development'
          })`
        );
      });
    })
    .catch((err) => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
}
