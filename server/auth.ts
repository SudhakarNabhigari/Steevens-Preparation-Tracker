import { constantTimeEqual } from '../supabase/functions/daily-learning-resources/pipeline.ts';

export interface AuthVerificationResult {
  authorized: boolean;
  status: 200 | 401 | 403;
  authMethod?: 'owner_jwt' | 'cron_secret';
  userId?: string;
  email?: string;
  error?: string;
}

export interface VerifyOwnerOptions {
  allowCronSecret?: boolean;
  env?: Record<string, string | undefined>;
  fetchImpl?: typeof fetch;
}

export function extractBearerToken(authorizationHeader?: string | string[] | null): string | null {
  const raw = Array.isArray(authorizationHeader) ? authorizationHeader[0] : authorizationHeader;
  if (!raw || typeof raw !== 'string') return null;
  const match = /^Bearer\s+(.+)$/i.exec(raw.trim());
  if (!match || !match[1]) return null;
  const token = match[1].trim();
  return token.length > 0 ? token : null;
}

export async function verifyOwnerAuthHeader(
  authorizationHeader: string | string[] | null | undefined,
  options?: VerifyOwnerOptions
): Promise<AuthVerificationResult> {
  const token = extractBearerToken(authorizationHeader);
  if (!token) {
    return {
      authorized: false,
      status: 401,
      error: 'Authentication required: missing Bearer token in Authorization header.'
    };
  }

  const env = options?.env || process.env;
  const fetchFn = options?.fetchImpl || fetch;

  // 1. Optional CRON_SECRET verification (for scheduled 10:00 AM IST cron jobs only)
  const cronSecret = env.CRON_SECRET?.trim() || '';
  if (options?.allowCronSecret && cronSecret && constantTimeEqual(token, cronSecret)) {
    return {
      authorized: true,
      status: 200,
      authMethod: 'cron_secret'
    };
  }

  // 2. Supabase Auth JWT verification against Owner user ID / email
  const supabaseUrl = (env.SUPABASE_URL || env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '');
  const supabaseApiKey = (
    env.SUPABASE_ANON_KEY ||
    env.VITE_SUPABASE_ANON_KEY ||
    env.SUPABASE_SERVICE_ROLE_KEY ||
    ''
  ).trim();
  const ownerUserId = (env.OWNER_SUPABASE_USER_ID || env.VITE_OWNER_USER_ID || '').trim();
  const ownerEmail = (env.OWNER_SUPABASE_EMAIL || env.VITE_OWNER_AUTH_EMAIL || '')
    .trim()
    .toLowerCase();

  if (!supabaseUrl || !supabaseApiKey || (!ownerUserId && !ownerEmail)) {
    return {
      authorized: false,
      status: 403,
      error:
        'Owner Supabase authentication is not configured on the server (requires SUPABASE_URL, SUPABASE_ANON_KEY/VITE_SUPABASE_ANON_KEY, and OWNER_SUPABASE_USER_ID).'
    };
  }

  try {
    const resp = await fetchFn(`${supabaseUrl}/auth/v1/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: supabaseApiKey
      },
      signal: AbortSignal.timeout(5000)
    });

    if (!resp.ok) {
      return {
        authorized: false,
        status: 401,
        error: 'Invalid or expired Supabase session token.'
      };
    }

    const user = (await resp.json().catch(() => null)) as {
      id?: string;
      email?: string;
    } | null;

    if (!user?.id) {
      return {
        authorized: false,
        status: 401,
        error: 'Invalid authentication payload: user identity missing.'
      };
    }

    if (ownerUserId && !constantTimeEqual(user.id, ownerUserId)) {
      return {
        authorized: false,
        status: 403,
        error: 'Forbidden: authenticated user does not match Owner account.'
      };
    }

    if (!ownerUserId && ownerEmail) {
      const resolvedEmail = (user.email || '').trim().toLowerCase();
      if (!resolvedEmail || !constantTimeEqual(resolvedEmail, ownerEmail)) {
        return {
          authorized: false,
          status: 403,
          error: 'Forbidden: authenticated email does not match Owner account.'
        };
      }
    }

    return {
      authorized: true,
      status: 200,
      authMethod: 'owner_jwt',
      userId: user.id,
      email: user.email
    };
  } catch {
    return {
      authorized: false,
      status: 401,
      error: 'Unable to verify authentication token with Supabase Auth.'
    };
  }
}
