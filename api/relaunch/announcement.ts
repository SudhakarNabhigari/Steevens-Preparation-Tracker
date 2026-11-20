import type { IncomingMessage, ServerResponse } from 'node:http';
import { verifyOwnerAuthHeader } from '../../server/auth.ts';
import { sendOwnerRelaunchAnnouncement, type RelaunchEmailType } from '../../server/relaunchService.ts';
import { applyApiSecurityAndCorsHeaders } from '../../server/httpCors.ts';

type RequestWithBody = IncomingMessage & { body?: unknown };

export default async function handler(req: RequestWithBody, res: ServerResponse) {
  if (applyApiSecurityAndCorsHeaders(req, res, { allowMethods: 'POST, OPTIONS', noStore: true })) return;
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }
  const auth = await verifyOwnerAuthHeader(req.headers.authorization, { allowCronSecret: false });
  if (!auth.authorized) {
    res.statusCode = auth.status;
    res.end(JSON.stringify({ error: auth.error || 'Owner authentication required.' }));
    return;
  }
  const body = req.body && typeof req.body === 'object' ? req.body as { type?: unknown } : {};
  if (body.type !== 'restart') {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Only the restart announcement can be requested here.' }));
    return;
  }
  try {
    res.statusCode = 200;
    res.end(JSON.stringify(await sendOwnerRelaunchAnnouncement(body.type as RelaunchEmailType)));
  } catch (error) {
    res.statusCode = 503;
    res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Announcement send failed.' }));
  }
}
