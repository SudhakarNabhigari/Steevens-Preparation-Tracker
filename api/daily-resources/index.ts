import type { IncomingMessage, ServerResponse } from 'node:http';
import type { TrackId } from '../../src/types/index.ts';
import { getDailyResourcesDashboard } from '../../server/dailyResourcesService.ts';
import { applyApiSecurityAndCorsHeaders } from '../../server/httpCors.ts';
import { verifyOwnerAuthHeader } from '../../server/auth.ts';
import { isTrackDayCurrentlyUnlockedCanonical, LEGACY_GUEST_START_DATE_IST } from '../../supabase/functions/daily-learning-resources/pipeline.ts';

function isValidTrackId(value: unknown): value is TrackId {
  return value === 'main' || value === 'dsa' || value === 'azure';
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (applyApiSecurityAndCorsHeaders(req, res, { allowMethods: 'GET, OPTIONS' })) {
    return;
  }

  if (req.method && req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const reqUrl = new URL(req.url || '/api/daily-resources', 'https://localhost');
    const rawTrack = reqUrl.searchParams.get('track') || undefined;
    const rawDay = reqUrl.searchParams.get('day');
    const role = reqUrl.searchParams.get('role') === 'guest' ? 'guest' : 'owner';
    if (role === 'owner') {
      const auth = await verifyOwnerAuthHeader(req.headers.authorization);
      if (!auth.authorized) return sendJson(res, auth.status, { error: auth.error });
    }
    const scheduleStart = role === 'guest' ? LEGACY_GUEST_START_DATE_IST : undefined;
    const dayParam = rawDay !== null ? Number(rawDay) : undefined;

    if (rawTrack !== undefined && !isValidTrackId(rawTrack)) {
      return sendJson(res, 400, {
        error: 'Invalid track query parameter. Expected main, dsa, or azure.'
      });
    }

    const validatedTrack: TrackId | undefined = rawTrack;

    if (dayParam !== undefined && validatedTrack) {
      if (!Number.isInteger(dayParam) || dayParam < 1) {
        return sendJson(res, 400, { error: 'Invalid day query parameter.' });
      }
      if (!isTrackDayCurrentlyUnlockedCanonical(validatedTrack, dayParam, Date.now(), scheduleStart)) {
        return sendJson(res, 403, {
          error: `Day ${dayParam} of ${validatedTrack.toUpperCase()} is locked until 00:00 IST on its scheduled date.`
        });
      }
    }

    const payload = await getDailyResourcesDashboard({
      track: validatedTrack,
      day: dayParam,
      role
    });
    return sendJson(res, 200, payload);
  } catch (err) {
    return sendJson(res, 500, {
      error: err instanceof Error ? err.message : 'Failed to load daily AI learning resources.'
    });
  }
}
