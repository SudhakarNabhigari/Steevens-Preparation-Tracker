import type { IncomingMessage, ServerResponse } from 'node:http';

export default function handler(
  _req: IncomingMessage,
  res: ServerResponse & { status?: (code: number) => void; json?: (body: unknown) => void }
) {
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
