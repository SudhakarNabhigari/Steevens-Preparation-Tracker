import { constantTimeEqual } from '../supabase/functions/daily-learning-resources/pipeline.ts';
import {
  buildSupabaseRestHeaders,
  classifySupabaseKeyFormat,
  isPlaceholderUuidValue,
  isPublicAnonKeyFormat,
  isValidUuid
} from './supabaseConfig.ts';

export type OwnerAuthErrorCode =
  | 'MISSING_TOKEN'
  | 'SERVER_CONFIG_ERROR'
  | 'INVALID_OR_EXPIRED_SESSION'
  | 'AUTH_SERVICE_UNREACHABLE'
  | 'OWNER_CONFIG_INVALID_UUID'
  | 'OWNER_UUID_MISMATCH'
  | 'OWNER_EMAIL_MISMATCH'
  | 'OWNER_REGISTRY_UNAUTHORIZED'
  | 'OWNER_REGISTRY_EMPTY'
  | 'OWNER_REGISTRY_UNREACHABLE';

export interface AuthVerificationResult {
  authorized: boolean;
  status: 200 | 401 | 403;
  authMethod?: 'owner_jwt' | 'cron_secret';
  registryVerified?: boolean;
  errorCode?: OwnerAuthErrorCode;
  email?: string;
  userId?: string;
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

export function selectVerificationApiKey(env: Record<string, string | undefined>): string {
  const serverAnon = (env.SUPABASE_ANON_KEY || '').trim();
  const viteAnon = (env.VITE_SUPABASE_ANON_KEY || '').trim();
  const serviceKey = (env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

  if (serverAnon && isPublicAnonKeyFormat(classifySupabaseKeyFormat(serverAnon))) {
    return serverAnon;
  }
  if (viteAnon && isPublicAnonKeyFormat(classifySupabaseKeyFormat(viteAnon))) {
    return viteAnon;
  }
  const serviceFormat = classifySupabaseKeyFormat(serviceKey);
  if (serviceKey && (serviceFormat === 'jwt_service_role' || serviceFormat === 'sb_secret')) {
    return serviceKey;
  }
  return serverAnon || viteAnon || serviceKey;
}

export type RegistryLookupResult =
  | { status: 'found'; ownerUserId: string }
  | { status: 'empty' }
  | { status: 'absent' }
  | { status: 'unreachable' };

export async function fetchRegisteredOwnerUserId(options: {
  supabaseUrl: string;
  serviceRoleKey: string;
  fetchImpl?: typeof fetch;
}): Promise<RegistryLookupResult> {
  const baseUrl = options.supabaseUrl.trim().replace(/\/$/, '');
  const serviceKey = options.serviceRoleKey.trim();
  const serviceKeyFmt = classifySupabaseKeyFormat(serviceKey);
  if (
    !baseUrl ||
    !serviceKey ||
    (serviceKeyFmt !== 'sb_secret' && serviceKeyFmt !== 'jwt_service_role')
  ) {
    return { status: 'unreachable' };
  }

  const fetchFn = options.fetchImpl || fetch;
  try {
    const regResp = await fetchFn(
      `${baseUrl}/rest/v1/app_owner_registry?id=eq.1&select=owner_user_id&limit=1`,
      {
        method: 'GET',
        headers: buildSupabaseRestHeaders(serviceKey),
        signal: AbortSignal.timeout(5000)
      }
    );

    if (regResp.status === 404) {
      return { status: 'absent' };
    }
    if (!regResp.ok) {
      return { status: 'unreachable' };
    }

    const rows = (await regResp.json().catch(() => null)) as Array<{
      owner_user_id?: string;
    }> | null;
    const rawId = Array.isArray(rows) ? rows[0]?.owner_user_id?.trim() : undefined;
    if (!rawId || !isValidUuid(rawId)) {
      return { status: 'empty' };
    }
    return { status: 'found', ownerUserId: rawId };
  } catch {
    return { status: 'unreachable' };
  }
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
      errorCode: 'MISSING_TOKEN',
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

  // 2. Supabase Auth JWT verification against Owner user ID / email / app_owner_registry
  const supabaseUrl = (env.SUPABASE_URL || env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '');
  const supabaseApiKey = selectVerificationApiKey(env);
  const serviceRoleKey = (env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const ownerUserId = (env.OWNER_SUPABASE_USER_ID || env.VITE_OWNER_USER_ID || '').trim();
  const ownerEmail = (env.OWNER_SUPABASE_EMAIL || env.VITE_OWNER_AUTH_EMAIL || '')
    .trim()
    .toLowerCase();

  if (!supabaseUrl || !supabaseApiKey || (!ownerUserId && !ownerEmail && !serviceRoleKey)) {
    return {
      authorized: false,
      status: 403,
      errorCode: 'SERVER_CONFIG_ERROR',
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
        errorCode: 'INVALID_OR_EXPIRED_SESSION',
        error: 'Session expired or invalid Supabase authentication token.'
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
        errorCode: 'INVALID_OR_EXPIRED_SESSION',
        error: 'Invalid authentication payload: user identity missing.'
      };
    }

    const envOwnerIsPlaceholder = isPlaceholderUuidValue(ownerUserId);
    const hasValidEnvOwnerUuid = Boolean(ownerUserId && isValidUuid(ownerUserId));

    // Reject malformed non-placeholder OWNER_SUPABASE_USER_ID values immediately
    if (ownerUserId && !envOwnerIsPlaceholder && isValidUuid(user.id) && !isValidUuid(ownerUserId)) {
      return {
        authorized: false,
        status: 403,
        errorCode: 'OWNER_CONFIG_INVALID_UUID',
        error: 'Server configuration error: OWNER_SUPABASE_USER_ID is not a valid 36-character Supabase Auth UUID.'
      };
    }

    if (ownerEmail) {
      const resolvedEmail = (user.email || '').trim().toLowerCase();
      if (!resolvedEmail || !constantTimeEqual(resolvedEmail, ownerEmail)) {
        return {
          authorized: false,
          status: 403,
          errorCode: 'OWNER_EMAIL_MISMATCH',
          error: 'Forbidden: authenticated email does not match configured Owner email.'
        };
      }
    }

    // 3. Strict Single-Owner Registry check (public.app_owner_registry) when service key is configured
    let registryVerified = false;
    const serviceKeyFmt = classifySupabaseKeyFormat(serviceRoleKey);
    const hasUsableServiceKey = Boolean(
      serviceRoleKey && (serviceKeyFmt === 'sb_secret' || serviceKeyFmt === 'jwt_service_role')
    );

    if (hasUsableServiceKey) {
      const reg = await fetchRegisteredOwnerUserId({
        supabaseUrl,
        serviceRoleKey,
        fetchImpl: fetchFn
      });

      if (reg.status === 'found') {
        if (!constantTimeEqual(reg.ownerUserId, user.id.trim())) {
          return {
            authorized: false,
            status: 403,
            errorCode: 'OWNER_REGISTRY_UNAUTHORIZED',
            error: 'Forbidden: authenticated user is not authorized in public.app_owner_registry.'
          };
        }
        registryVerified = true;
      } else if (reg.status === 'empty') {
        return {
          authorized: false,
          status: 403,
          errorCode: 'OWNER_REGISTRY_EMPTY',
          error: 'Owner authorization registry (app_owner_registry) has no registered Owner UUID.'
        };
      } else if (reg.status === 'unreachable') {
        return {
          authorized: false,
          status: 403,
          errorCode: 'OWNER_REGISTRY_UNREACHABLE',
          error: 'Unable to verify Owner authorization against public.app_owner_registry.'
        };
      } else if (reg.status === 'absent' && !hasValidEnvOwnerUuid) {
        return {
          authorized: false,
          status: 403,
          errorCode: 'OWNER_CONFIG_INVALID_UUID',
          error:
            'Server configuration error: OWNER_SUPABASE_USER_ID still contains a placeholder and public.app_owner_registry is unavailable.'
        };
      }
    }

    if (ownerUserId && !envOwnerIsPlaceholder) {
      if (!constantTimeEqual(user.id, ownerUserId)) {
        return {
          authorized: false,
          status: 403,
          errorCode: 'OWNER_UUID_MISMATCH',
          error: 'Forbidden: authenticated Supabase user UUID does not match configured Owner UUID.'
        };
      }
    } else if (!registryVerified) {
      // Fail closed when neither a valid env Owner UUID nor a verified app_owner_registry row exists
      return {
        authorized: false,
        status: 403,
        errorCode: 'OWNER_CONFIG_INVALID_UUID',
        error: envOwnerIsPlaceholder
          ? 'Server configuration error: OWNER_SUPABASE_USER_ID still contains a placeholder instead of Steeven’s 36-character Supabase Auth UUID.'
          : 'Server configuration error: OWNER_SUPABASE_USER_ID is not configured cleanly.'
      };
    }

    return {
      authorized: true,
      status: 200,
      authMethod: 'owner_jwt',
      registryVerified,
      userId: user.id,
      email: user.email
    };
  } catch {
    return {
      authorized: false,
      status: 401,
      errorCode: 'AUTH_SERVICE_UNREACHABLE',
      error: 'Unable to verify authentication token with Supabase Auth.'
    };
  }
}
