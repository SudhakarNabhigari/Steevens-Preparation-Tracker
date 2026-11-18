import type { IncomingMessage, ServerResponse } from 'node:http';
import type { TrackId } from '../../src/types/index.ts';
import { verifyOwnerAuthHeader } from '../../server/auth.ts';
import {
  generateTrackDailyResources,
  getDailyResourcesDashboard
} from '../../server/dailyResourcesService.ts';
import { isTrackDayCurrentlyUnlockedCanonical } from '../../supabase/functions/daily-learning-resources/pipeline.ts';

function isValidTrackId(value: unknown): value is TrackId {
  return value === 'main' || value === 'dsa' || value === 'azure';
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

async function readJsonBody(req: IncomingMessage & { body?: unknown }): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === 'object') {
    return req.body as Record<string, unknown>;
  }
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse
) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const auth = await verifyOwnerAuthHeader(req.headers.authorization, { allowCronSecret: false });
    if (!auth.authorized) {
      return sendJson(res, auth.status, { error: auth.error });
    }

    const body = await readJsonBody(req);
    const { trackId, dayNumber } = body;

    if (!isValidTrackId(trackId)) {
      return sendJson(res, 400, { error: 'Valid trackId (main | dsa | azure) is required.' });
    }

    const parsedDay = Number(dayNumber);
    if (!Number.isInteger(parsedDay) || parsedDay < 1) {
      return sendJson(res, 400, { error: 'Valid positive integer dayNumber is required.' });
    }

    if (!isTrackDayCurrentlyUnlockedCanonical(trackId, parsedDay)) {
      return sendJson(res, 403, {
        error: `Day ${parsedDay} of ${trackId.toUpperCase()} is locked until its scheduled IST unlock date.`
      });
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

    return sendJson(res, 200, {
      ok: true,
      track: updatedTrack,
      dashboard
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Refresh failed.';
    return sendJson(res, msg.startsWith('LOCKED_FUTURE_DAY') ? 403 : 500, { error: msg });
  }
}
