import type { IncomingMessage, ServerResponse } from 'node:http';
import { verifyOwnerAuthHeader } from '../../server/auth.ts';
import { applyApiSecurityAndCorsHeaders } from '../../server/httpCors.ts';

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
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
    const auth = await verifyOwnerAuthHeader(req.headers.authorization, {
      allowCronSecret: false
    });
    if (!auth.authorized) {
      return sendJson(res, auth.status, {
        authorized: false,
        errorCode: auth.errorCode || 'UNAUTHORIZED',
        error: auth.error || 'Owner authentication failed.'
      });
    }

    return sendJson(res, 200, {
      authorized: true,
      authMethod: auth.authMethod,
      registryVerified: Boolean(auth.registryVerified)
    });
  } catch {
    return sendJson(res, 500, {
      authorized: false,
      errorCode: 'AUTH_SERVICE_UNREACHABLE',
      error: 'Unable to verify Owner session.'
    });
  }
}
