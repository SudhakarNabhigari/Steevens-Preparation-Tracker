import type { IncomingMessage, ServerResponse } from 'node:http';
import { getRelaunchStatus } from '../../server/relaunchService.ts';
import { applyApiSecurityAndCorsHeaders } from '../../server/httpCors.ts';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (applyApiSecurityAndCorsHeaders(req, res, { allowMethods: 'GET, OPTIONS', noStore: true })) return;
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.end(JSON.stringify(getRelaunchStatus()));
}
