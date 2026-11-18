import type { IncomingMessage, ServerResponse } from 'node:http';
import type { TrackId } from '../../src/types/index.ts';
import { getDailyEmailPreview } from '../../server/dailyResourcesService.ts';
import { applyApiSecurityAndCorsHeaders } from '../../server/httpCors.ts';
import { isTrackDayCurrentlyUnlockedCanonical } from '../../supabase/functions/daily-learning-resources/pipeline.ts';

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
    const reqUrl = new URL(req.url || '/api/daily-resources/email-preview', 'https://localhost');
    const rawTrack = (reqUrl.searchParams.get('track') || 'combined').trim();
    const rawDay = reqUrl.searchParams.get('day');
    const dayParam = rawDay !== null ? Number(rawDay) : undefined;
    const format = reqUrl.searchParams.get('format');

    if (rawTrack !== 'combined' && !isValidTrackId(rawTrack)) {
      return sendJson(res, 400, {
        error: 'Invalid track query parameter. Expected main, dsa, azure, or combined.'
      });
    }

    if (dayParam !== undefined) {
      if (!Number.isInteger(dayParam) || dayParam < 1) {
        return sendJson(res, 400, { error: 'Invalid day query parameter.' });
      }
      if (rawTrack === 'combined') {
        return sendJson(res, 400, {
          error: 'Day parameter requires a specific track (main, dsa, or azure).'
        });
      }
      if (!isTrackDayCurrentlyUnlockedCanonical(rawTrack, dayParam)) {
        return sendJson(res, 403, {
          error: `Day ${dayParam} of ${rawTrack.toUpperCase()} is locked until 00:00 IST on its scheduled date.`
        });
      }
    }

    const preview = await getDailyEmailPreview({
      track: rawTrack as TrackId | 'combined',
      day: dayParam
    });

    if (format === 'html') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(preview.html);
      return;
    }

    return sendJson(res, 200, {
      ok: true,
      ...preview
    });
  } catch (err) {
    return sendJson(res, 500, {
      error: err instanceof Error ? err.message : 'Failed to generate daily email preview.'
    });
  }
}
