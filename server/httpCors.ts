import type { IncomingMessage, ServerResponse } from 'node:http';

function normalizeOrigin(raw?: string | null): string | null {
  if (!raw) return null;
  try {
    const parsed = new URL(raw.trim());
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.origin;
    }
    return null;
  } catch {
    return null;
  }
}

export function resolveAllowedOrigin(
  requestOrigin: string | string[] | undefined,
  requestHost: string | string[] | undefined,
  env: Record<string, string | undefined> = process.env
): string | null {
  const originStr = Array.isArray(requestOrigin) ? requestOrigin[0] : requestOrigin;
  const normalizedOrigin = normalizeOrigin(originStr);
  if (!normalizedOrigin) return null;

  const allowedSet = new Set<string>();
  const configuredAppOrigin = normalizeOrigin(env.APP_URL);
  if (configuredAppOrigin) allowedSet.add(configuredAppOrigin);

  const hostStr = Array.isArray(requestHost) ? requestHost[0] : requestHost;
  if (hostStr) {
    const cleanHost = hostStr.trim();
    allowedSet.add(`https://${cleanHost}`);
    allowedSet.add(`http://${cleanHost}`);
  }

  if (env.NODE_ENV !== 'production') {
    allowedSet.add('http://localhost:3000');
    allowedSet.add('http://127.0.0.1:3000');
    allowedSet.add('http://0.0.0.0:3000');
  }

  return allowedSet.has(normalizedOrigin) ? normalizedOrigin : null;
}

export function applyApiSecurityAndCorsHeaders(
  req: IncomingMessage,
  res: ServerResponse,
  options?: { allowMethods?: string; noStore?: boolean }
): boolean {
  const allowedOrigin = resolveAllowedOrigin(req.headers.origin, req.headers.host);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Vary', 'Origin');

  if (options?.noStore) {
    res.setHeader('Cache-Control', 'no-store');
  }

  if (allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', options?.allowMethods || 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }

  return false;
}
