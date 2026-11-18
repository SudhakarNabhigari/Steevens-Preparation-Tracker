import type { IncomingMessage, ServerResponse } from 'node:http';
import { verifyOwnerAuthHeader } from '../../server/auth.ts';
import { runDailyAutomationJob } from '../../server/dailyResourcesService.ts';
import { applyApiSecurityAndCorsHeaders } from '../../server/httpCors.ts';

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
  if (
    applyApiSecurityAndCorsHeaders(req, res, {
      allowMethods: 'POST, OPTIONS',
      noStore: true
    })
  ) {
    return;
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const auth = await verifyOwnerAuthHeader(req.headers.authorization, { allowCronSecret: true });
    if (!auth.authorized) {
      return sendJson(res, auth.status, { error: auth.error });
    }

    const body = await readJsonBody(req);
    const result = await runDailyAutomationJob({
      triggerSource: auth.authMethod === 'cron_secret' ? 'cron_10am_ist' : 'manual_owner',
      sendEmail: body.sendEmail !== false,
      bypassIdempotency: Boolean(body.bypassIdempotency)
    });

    return sendJson(res, 200, {
      ok: true,
      alreadyRanToday: result.alreadyRanToday,
      dashboard: result.payload
    });
  } catch (err) {
    return sendJson(res, 500, {
      error: err instanceof Error ? err.message : 'Daily automation run failed.'
    });
  }
}
