import type { IncomingMessage, ServerResponse } from 'node:http';
import { verifyCronRequest } from '../../supabase/functions/daily-learning-resources/pipeline.ts';
import { sendOwnerRelaunchAnnouncement } from '../../server/relaunchService.ts';
import { applyApiSecurityAndCorsHeaders } from '../../server/httpCors.ts';
import type { RelaunchEmailType } from '../../server/relaunchService.ts';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (applyApiSecurityAndCorsHeaders(req, res, { allowMethods: 'GET, POST, OPTIONS', noStore: true })) return;
  res.setHeader('Content-Type', 'application/json');
  const auth = verifyCronRequest(req.headers.authorization, process.env.CRON_SECRET);
  if (!auth.authorized) {
    res.statusCode = auth.status;
    res.end(JSON.stringify({ error: auth.error }));
    return;
  }
  try {
    const reqUrl = new URL(req.url || '/api/relaunch/cron', 'https://localhost');
    const typeParam = reqUrl.searchParams.get('type') || 'launch';
    if (typeParam !== 'restart' && typeParam !== 'launch') {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Expected type=restart or type=launch.' }));
      return;
    }
    const result = await sendOwnerRelaunchAnnouncement(typeParam as RelaunchEmailType);
    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true, ...result }));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Relaunch cron execution failed.';
    const beforeLaunch = message.includes('not available before');
    res.statusCode = beforeLaunch ? 200 : 503;
    res.end(JSON.stringify({ ok: beforeLaunch, error: beforeLaunch ? undefined : message }));
  }
}
