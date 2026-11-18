import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';

export const EXPECTED_SUPABASE_PROJECT_URL = 'https://bclbfqhetjiobmskecqv.supabase.co';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUuid(value: string | undefined): boolean {
  return Boolean(value && UUID_REGEX.test(value.trim()));
}

export function isPlaceholderUuidValue(value: string | undefined): boolean {
  const normalized = (value || '').trim().toLowerCase();
  if (!normalized) return false;
  return (
    normalized === 'your-owner-auth-user-uuid' ||
    normalized.includes('your-owner') ||
    normalized.includes('placeholder') ||
    normalized.includes('replace-me')
  );
}

const supabaseUrl = (import.meta.env?.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '');
const supabaseAnonKey = (import.meta.env?.VITE_SUPABASE_ANON_KEY || '').trim();

function decodeJwtRoleClaim(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    const payload = JSON.parse(json) as { role?: unknown };
    return typeof payload.role === 'string' ? payload.role : null;
  } catch {
    return null;
  }
}

export const isAnonKeySafeForClient = Boolean(
  supabaseAnonKey &&
    !supabaseAnonKey.startsWith('sb_secret_') &&
    decodeJwtRoleClaim(supabaseAnonKey) !== 'service_role'
);

export const isAnonKeyValidPublicFormat = Boolean(
  supabaseAnonKey &&
    isAnonKeySafeForClient &&
    (supabaseAnonKey.startsWith('sb_publishable_') || decodeJwtRoleClaim(supabaseAnonKey) === 'anon')
);

export const hasPartialSupabaseEnv = Boolean(supabaseUrl || supabaseAnonKey);

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey &&
    isAnonKeySafeForClient &&
    isAnonKeyValidPublicFormat
);

export const configuredOwnerEmail = (import.meta.env?.VITE_OWNER_AUTH_EMAIL || '').trim();
export const configuredOwnerUserId = (import.meta.env?.VITE_OWNER_USER_ID || '').trim();
export const isConfiguredOwnerUserIdPlaceholder = isPlaceholderUuidValue(configuredOwnerUserId);
export const isConfiguredOwnerUserIdValid =
  !configuredOwnerUserId || isValidUuid(configuredOwnerUserId);

export const requiresStrictServerOwnerVerification = Boolean(
  isConfiguredOwnerUserIdPlaceholder
);

export function isAuthorizedOwnerUser(
  user: { id?: string; email?: string | null } | null | undefined
): boolean {
  if (!user?.id) return false;
  if (configuredOwnerUserId && !isConfiguredOwnerUserIdPlaceholder) {
    if (!isValidUuid(configuredOwnerUserId) || user.id !== configuredOwnerUserId) {
      return false;
    }
  }
  if (configuredOwnerEmail) {
    const normalizedEmail = (user.email || '').trim().toLowerCase();
    if (!normalizedEmail || normalizedEmail !== configuredOwnerEmail.toLowerCase()) {
      return false;
    }
  } else if (isConfiguredOwnerUserIdPlaceholder) {
    // If VITE_OWNER_USER_ID is placeholder, require configuredOwnerEmail on client in addition to server registry check
    return false;
  }
  return true;
}

export function classifySupabaseAuthError(err: unknown): string {
  const errObj = (err && typeof err === 'object' ? err : {}) as {
    message?: string;
    code?: string;
    status?: number;
    name?: string;
  };
  const msg = (errObj.message || (typeof err === 'string' ? err : '')).trim();
  const lower = msg.toLowerCase();
  const status = typeof errObj.status === 'number' ? errObj.status : undefined;

  if (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('network request failed') ||
    lower.includes('load failed') ||
    lower.includes('econnrefused') ||
    lower.includes('timeout') ||
    status === 0
  ) {
    return 'Network error: unable to reach Supabase Authentication. Check your connection and try again.';
  }

  if (
    lower.includes('invalid login credentials') ||
    errObj.code === 'invalid_credentials'
  ) {
    return 'Invalid email or password. Please verify your Supabase Owner email and password.';
  }

  if (lower.includes('email not confirmed') || errObj.code === 'email_not_confirmed') {
    return 'Owner email address is not confirmed in Supabase Auth.';
  }

  if (lower.includes('invalid api key')) {
    return 'Configuration error: VITE_SUPABASE_ANON_KEY is invalid or does not match this Supabase project.';
  }

  if (lower.includes('jwt expired') || lower.includes('refresh_token_not_found')) {
    return 'Your Owner session has expired. Please sign in again.';
  }

  if (status === 429 || lower.includes('too many requests') || lower.includes('rate limit')) {
    return 'Too many authentication attempts. Please wait a moment and try again.';
  }

  if (status !== undefined && status >= 500) {
    return 'Supabase authentication service error. Please try again shortly.';
  }

  return 'Unable to authenticate with Supabase Auth. Please check your credentials and configuration.';
}

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function requireSupabaseClient(): SupabaseClient {
  if (!isAnonKeySafeForClient && supabaseAnonKey) {
    throw new Error('Security policy violation: service_role keys must never be configured in frontend code.');
  }
  if (!supabase) {
    throw new Error('Supabase environment variables (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) are missing.');
  }
  return supabase;
}

export async function getSupabaseOwnerSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error || !data?.session) return null;

  let activeSession = data.session;
  const expiresAtMs =
    typeof activeSession.expires_at === 'number' ? activeSession.expires_at * 1000 : null;
  if (expiresAtMs !== null && expiresAtMs <= Date.now() + 5_000) {
    const { data: refreshed, error: refreshErr } = await supabase.auth.refreshSession();
    if (refreshErr || !refreshed?.session) {
      return null;
    }
    activeSession = refreshed.session;
  }

  if (!isAuthorizedOwnerUser(activeSession.user)) {
    return null;
  }
  return activeSession;
}

export async function getOwnerAccessToken(): Promise<string | null> {
  const session = await getSupabaseOwnerSession();
  return session?.access_token || null;
}

export interface ServerOwnerVerifyResponse {
  authorized: boolean;
  registryVerified?: boolean;
  errorCode?: string;
  error?: string;
  unreachable?: boolean;
}

export async function verifyOwnerSessionWithServer(
  accessToken: string,
  fetchImpl: typeof fetch = fetch,
  options?: { requireStrictServer?: boolean }
): Promise<ServerOwnerVerifyResponse> {
  try {
    const resp = await fetchImpl('/api/auth/verify-owner', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const body = (await resp.json().catch(() => null)) as ServerOwnerVerifyResponse | null;

    if (resp.ok && body?.authorized) {
      return {
        authorized: true,
        registryVerified: Boolean(body.registryVerified)
      };
    }

    if (resp.status === 404) {
      if (options?.requireStrictServer) {
        return {
          authorized: false,
          errorCode: 'SERVER_VERIFICATION_REQUIRED',
          error:
            'Owner configuration error: VITE_OWNER_USER_ID contains a placeholder and the server verification endpoint is unavailable.'
        };
      }
      // Static hosting without API routes (only permitted when valid client UUID was verified)
      return { authorized: true, registryVerified: false };
    }

    return {
      authorized: false,
      errorCode: body?.errorCode || `HTTP_${resp.status}`,
      error:
        body?.error ||
        (resp.status === 401
          ? 'Your Owner session has expired. Please sign in again.'
          : 'Server Owner authorization failed.')
    };
  } catch {
    return {
      authorized: false,
      unreachable: true,
      errorCode: 'SERVER_UNREACHABLE',
      error: 'Network error: unable to verify Owner authorization with the application server.'
    };
  }
}