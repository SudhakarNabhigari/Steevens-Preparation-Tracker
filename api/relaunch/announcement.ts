import type { IncomingMessage, ServerResponse } from 'node:http';
import { verifyOwnerAuthHeader } from '../../server/auth.ts';
import { sendOwnerRelaunchAnnouncement, type RelaunchEmailType } from '../../server/relaunchService.ts';
import { applyApiSecurityAndCorsHeaders } from '../../server/httpCors.ts';

type RequestWithBody = IncomingMessage & { body?: unknown };

async function readJsonBody(req: RequestWithBody): Promise<{ type?: unknown }> {
  if (req.body && typeof req.body === 'object') {
    return req.body as { type?: unknown };
  }
  const maxBytes = 64 * 1024;
  let totalBytes = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buf.length;
    if (totalBytes > maxBytes) {
      return {};
    }
    chunks.push(buf);
  }
  if (chunks.length === 0) return {};
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    return parsed && typeof parsed === 'object' ? (parsed as { type?: unknown }) : {};
  } catch {
    return {};
  }
}

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
  const body = await readJsonBody(req);
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
