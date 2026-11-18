import type { IncomingMessage, ServerResponse } from 'node:http';
import { applyApiSecurityAndCorsHeaders } from '../server/httpCors.ts';

export default function handler(
  req: IncomingMessage,
  res: ServerResponse & { status?: (code: number) => void; json?: (body: unknown) => void }
) {
  if (applyApiSecurityAndCorsHeaders(req, res, { allowMethods: 'GET, OPTIONS' })) {
    return;
  }

  if (req.method && req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const payload = {
    ok: true,
    service: 'steeven-prep-tracker-vercel',
    timezone: 'Asia/Kolkata',
    dailyScheduleIst: '10:00 AM IST'
  };
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}
