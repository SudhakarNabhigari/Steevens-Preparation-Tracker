export const EXPECTED_SUPABASE_URL = 'https://bclbfqhetjiobmskecqv.supabase.co';
export const EXPECTED_OWNER_EMAIL = 'mypreparation0111@gmail.com';
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

export type SupabaseKeyFormat =
  | 'missing'
  | 'jwt_anon'
  | 'jwt_service_role'
  | 'jwt_other'
  | 'sb_publishable'
  | 'sb_secret'
  | 'unknown';

export interface SupabaseEnvValidationReport {
  expectedProjectUrl: string;
  configuredClientUrlMatchesTarget: boolean;
  configuredServerUrlMatchesTarget: boolean;
  hasViteSupabaseUrl: boolean;
  hasViteSupabaseAnonKey: boolean;
  frontendKeyIsPublicSafe: boolean;
  clientKeyFormat: SupabaseKeyFormat;
  hasServerAnonKey: boolean;
  serverAnonKeyFormat: SupabaseKeyFormat;
  serverAnonKeyPublicSafe: boolean;
  clientAndServerAnonKeysMatch: boolean;
  serverKeyFormat: SupabaseKeyFormat;
  hasServerSupabaseUrl: boolean;
  hasServerServiceRoleKey: boolean;
  serverKeyCompatible: boolean;
  hasOwnerUserId: boolean;
  ownerUserIdIsValidUuid: boolean;
  hasViteOwnerUserId: boolean;
  viteOwnerUserIdIsValidUuid: boolean;
  ownerUserIdsMatch: boolean;
  hasViteOwnerAuthEmail: boolean;
  hasServerOwnerEmail: boolean;
  ownerEmailsMatchExpected: boolean;
  hasCronSecret: boolean;
  cronSecretStrong: boolean;
  isClientReady: boolean;
  isServerDbReady: boolean;
  isAutomationReady: boolean;
  missingVariables: string[];
  missingOptionalVariables: string[];
  warnings: string[];
}

function decodeJwtRoleClaimServer(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = Buffer.from(base64, 'base64').toString('utf8');
    const payload = JSON.parse(json) as { role?: unknown };
    return typeof payload.role === 'string' ? payload.role : null;
  } catch {
    return null;
  }
}

export function classifySupabaseKeyFormat(key: string | undefined): SupabaseKeyFormat {
  const trimmed = (key || '').trim();
  if (!trimmed) return 'missing';
  if (trimmed.startsWith('sb_secret_')) return 'sb_secret';
  if (trimmed.startsWith('sb_publishable_')) return 'sb_publishable';
  const role = decodeJwtRoleClaimServer(trimmed);
  if (role === 'anon') return 'jwt_anon';
  if (role === 'service_role') return 'jwt_service_role';
  if (role) return 'jwt_other';
  return 'unknown';
}

export function isPublicAnonKeyFormat(format: SupabaseKeyFormat): boolean {
  return format === 'jwt_anon' || format === 'sb_publishable';
}

export function isSupabaseJwt(token: string | undefined): boolean {
  const trimmed = (token || '').trim();
  return Boolean(trimmed && trimmed.split('.').length === 3 && trimmed.startsWith('eyJ'));
}

export function buildSupabaseRestHeaders(
  serviceKey: string,
  extraHeaders: Record<string, string> = {}
): Record<string, string> {
  const trimmed = serviceKey.trim();
  // Legacy service_role JWTs work in both apikey and Authorization: Bearer <jwt>.
  // New sb_secret_* keys are NOT JWTs and must ONLY be passed in apikey (never as Bearer JWT).
  if (isSupabaseJwt(trimmed)) {
    return {
      apikey: trimmed,
      Authorization: `Bearer ${trimmed}`,
      ...extraHeaders
    };
  }
  return {
    apikey: trimmed,
    ...extraHeaders
  };
}

/**
 * Validates Supabase environment configuration cleanly without ever exposing or logging secret values.
 */
export function validateSupabaseEnvironment(
  env: Record<string, string | undefined> = process.env
): SupabaseEnvValidationReport {
  const viteUrl = (env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '');
  const viteAnon = (env.VITE_SUPABASE_ANON_KEY || '').trim();
  const viteOwnerEmail = (env.VITE_OWNER_AUTH_EMAIL || '').trim().toLowerCase();
  const viteOwnerUserId = (env.VITE_OWNER_USER_ID || '').trim();

  const serverUrl = (env.SUPABASE_URL || '').trim().replace(/\/$/, '');
  const serverAnon = (env.SUPABASE_ANON_KEY || '').trim();
  const serviceRoleKey = (env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const ownerUserId = (env.OWNER_SUPABASE_USER_ID || '').trim();
  const serverOwnerEmail = (env.OWNER_SUPABASE_EMAIL || '').trim().toLowerCase();
  const cronSecret = (env.CRON_SECRET || '').trim();

  const hasViteSupabaseUrl = Boolean(viteUrl);
  const hasViteSupabaseAnonKey = Boolean(viteAnon);
  const clientKeyFormat = classifySupabaseKeyFormat(viteAnon);
  const frontendKeyIsPublicSafe =
    !viteAnon || (clientKeyFormat !== 'jwt_service_role' && clientKeyFormat !== 'sb_secret');
  const clientKeyValidPublic = isPublicAnonKeyFormat(clientKeyFormat);

  const hasServerAnonKey = Boolean(serverAnon);
  const serverAnonKeyFormat = classifySupabaseKeyFormat(serverAnon);
  const serverAnonKeyPublicSafe =
    !serverAnon ||
    (serverAnonKeyFormat !== 'jwt_service_role' && serverAnonKeyFormat !== 'sb_secret');
  const clientAndServerAnonKeysMatch = Boolean(
    viteAnon && serverAnon && viteAnon === serverAnon
  );

  const hasServerSupabaseUrl = Boolean(serverUrl);
  const hasServerServiceRoleKey = Boolean(serviceRoleKey);
  const serverKeyFormat = classifySupabaseKeyFormat(serviceRoleKey);
  const serverKeyCompatible =
    serverKeyFormat === 'jwt_service_role' || serverKeyFormat === 'sb_secret';

  const hasOwnerUserId = Boolean(ownerUserId);
  const ownerUserIdIsPlaceholder = isPlaceholderUuidValue(ownerUserId);
  const ownerUserIdIsValidUuid = isValidUuid(ownerUserId);
  const hasViteOwnerUserId = Boolean(viteOwnerUserId);
  const viteOwnerUserIdIsPlaceholder = isPlaceholderUuidValue(viteOwnerUserId);
  const viteOwnerUserIdIsValidUuid = isValidUuid(viteOwnerUserId);
  const ownerUserIdsMatch = Boolean(
    ownerUserId && viteOwnerUserId && ownerUserId === viteOwnerUserId
  );

  const hasViteOwnerAuthEmail = Boolean(viteOwnerEmail);
  const hasServerOwnerEmail = Boolean(serverOwnerEmail);
  const ownerEmailsMatchExpected =
    (!viteOwnerEmail || viteOwnerEmail === EXPECTED_OWNER_EMAIL) &&
    (!serverOwnerEmail || serverOwnerEmail === EXPECTED_OWNER_EMAIL) &&
    (!viteOwnerEmail || !serverOwnerEmail || viteOwnerEmail === serverOwnerEmail);

  const hasCronSecret = Boolean(cronSecret);
  const cronSecretStrong = cronSecret.length >= 24;

  const configuredClientUrlMatchesTarget = hasViteSupabaseUrl
    ? viteUrl === EXPECTED_SUPABASE_URL
    : false;
  const configuredServerUrlMatchesTarget = hasServerSupabaseUrl
    ? serverUrl === EXPECTED_SUPABASE_URL
    : false;

  const missingVariables: string[] = [];
  if (!hasViteSupabaseUrl) missingVariables.push('VITE_SUPABASE_URL');
  if (!hasViteSupabaseAnonKey) missingVariables.push('VITE_SUPABASE_ANON_KEY');
  if (!hasServerSupabaseUrl) missingVariables.push('SUPABASE_URL');
  if (!hasServerServiceRoleKey) missingVariables.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!hasOwnerUserId) missingVariables.push('OWNER_SUPABASE_USER_ID');
  if (!hasCronSecret) missingVariables.push('CRON_SECRET');

  const missingOptionalVariables: string[] = [];
  if (!hasServerAnonKey) missingOptionalVariables.push('SUPABASE_ANON_KEY');
  if (!hasViteOwnerUserId) missingOptionalVariables.push('VITE_OWNER_USER_ID');
  if (!hasViteOwnerAuthEmail) missingOptionalVariables.push('VITE_OWNER_AUTH_EMAIL');
  if (!hasServerOwnerEmail) missingOptionalVariables.push('OWNER_SUPABASE_EMAIL');

  const warnings: string[] = [];
  if (hasViteSupabaseUrl && !configuredClientUrlMatchesTarget) {
    warnings.push(`VITE_SUPABASE_URL does not match expected project URL (${EXPECTED_SUPABASE_URL}).`);
  }
  if (hasServerSupabaseUrl && !configuredServerUrlMatchesTarget) {
    warnings.push(`SUPABASE_URL does not match expected project URL (${EXPECTED_SUPABASE_URL}).`);
  }
  if (!frontendKeyIsPublicSafe) {
    warnings.push(
      'SECURITY VIOLATION: VITE_SUPABASE_ANON_KEY contains a service_role or sb_secret credential.'
    );
  } else if (hasViteSupabaseAnonKey && !clientKeyValidPublic) {
    warnings.push(
      'VITE_SUPABASE_ANON_KEY format is neither an anon JWT nor an sb_publishable_ key.'
    );
  }
  if (hasServerAnonKey && !serverAnonKeyPublicSafe) {
    warnings.push(
      'SUPABASE_ANON_KEY contains a privileged service_role or sb_secret key instead of a public anon/publishable key.'
    );
  } else if (hasServerAnonKey && !isPublicAnonKeyFormat(serverAnonKeyFormat)) {
    warnings.push(
      'SUPABASE_ANON_KEY format is unrecognized (expected anon JWT or sb_publishable_ key matching VITE_SUPABASE_ANON_KEY).'
    );
  }
  if (hasViteSupabaseAnonKey && hasServerAnonKey && !clientAndServerAnonKeysMatch) {
    warnings.push('SUPABASE_ANON_KEY does not match VITE_SUPABASE_ANON_KEY.');
  }
  if (hasServerServiceRoleKey && !serverKeyCompatible) {
    warnings.push(
      'SUPABASE_SERVICE_ROLE_KEY format is neither a service_role JWT nor an sb_secret_ key.'
    );
  }
  if (ownerUserIdIsPlaceholder) {
    warnings.push(
      'OWNER_SUPABASE_USER_ID still contains a template placeholder instead of Steeven’s 36-character Supabase Auth UUID.'
    );
  } else if (hasOwnerUserId && !ownerUserIdIsValidUuid) {
    warnings.push(
      'OWNER_SUPABASE_USER_ID is not a valid 36-character Supabase Auth UUID.'
    );
  }
  if (viteOwnerUserIdIsPlaceholder) {
    warnings.push(
      'VITE_OWNER_USER_ID still contains a template placeholder instead of Steeven’s 36-character Supabase Auth UUID.'
    );
  } else if (hasViteOwnerUserId && !viteOwnerUserIdIsValidUuid) {
    warnings.push(
      'VITE_OWNER_USER_ID is not a valid 36-character Supabase Auth UUID.'
    );
  }
  if (hasOwnerUserId && hasViteOwnerUserId && !ownerUserIdsMatch) {
    warnings.push('VITE_OWNER_USER_ID does not match OWNER_SUPABASE_USER_ID.');
  }
  if (hasViteOwnerAuthEmail && viteOwnerEmail !== EXPECTED_OWNER_EMAIL) {
    warnings.push(`VITE_OWNER_AUTH_EMAIL does not match expected Owner email (${EXPECTED_OWNER_EMAIL}).`);
  }
  if (hasServerOwnerEmail && serverOwnerEmail !== EXPECTED_OWNER_EMAIL) {
    warnings.push(`OWNER_SUPABASE_EMAIL does not match expected Owner email (${EXPECTED_OWNER_EMAIL}).`);
  }
  if (hasCronSecret && !cronSecretStrong) {
    warnings.push('CRON_SECRET is shorter than 24 characters; use at least 24 random characters.');
  }

  const isClientReady =
    hasViteSupabaseUrl &&
    configuredClientUrlMatchesTarget &&
    hasViteSupabaseAnonKey &&
    frontendKeyIsPublicSafe &&
    clientKeyValidPublic;

  const isServerDbReady =
    hasServerSupabaseUrl &&
    configuredServerUrlMatchesTarget &&
    hasServerServiceRoleKey &&
    serverKeyCompatible &&
    hasOwnerUserId &&
    ownerUserIdIsValidUuid;

  const isAutomationReady = isServerDbReady && hasCronSecret && cronSecretStrong;

  return {
    expectedProjectUrl: EXPECTED_SUPABASE_URL,
    configuredClientUrlMatchesTarget,
    configuredServerUrlMatchesTarget,
    hasViteSupabaseUrl,
    hasViteSupabaseAnonKey,
    frontendKeyIsPublicSafe,
    clientKeyFormat,
    hasServerAnonKey,
    serverAnonKeyFormat,
    serverAnonKeyPublicSafe,
    clientAndServerAnonKeysMatch,
    serverKeyFormat,
    hasServerSupabaseUrl,
    hasServerServiceRoleKey,
    serverKeyCompatible,
    hasOwnerUserId,
    ownerUserIdIsValidUuid,
    hasViteOwnerUserId,
    viteOwnerUserIdIsValidUuid,
    ownerUserIdsMatch,
    hasViteOwnerAuthEmail,
    hasServerOwnerEmail,
    ownerEmailsMatchExpected,
    hasCronSecret,
    cronSecretStrong,
    isClientReady,
    isServerDbReady,
    isAutomationReady,
    missingVariables,
    missingOptionalVariables,
    warnings
  };
}

export interface AuthoritativeOwnerResolution {
  ownerUserId: string | null;
  source: 'env' | 'app_owner_registry' | 'invalid' | 'missing';
  hasPlaceholder: boolean;
}

export async function resolveAuthoritativeOwnerUserId(
  env: Record<string, string | undefined> = process.env,
  fetchImpl: typeof fetch = fetch
): Promise<AuthoritativeOwnerResolution> {
  const candidate = (env.OWNER_SUPABASE_USER_ID || env.VITE_OWNER_USER_ID || '').trim();
  if (isValidUuid(candidate)) {
    return {
      ownerUserId: candidate,
      source: 'env',
      hasPlaceholder: false
    };
  }

  const hasPlaceholder = isPlaceholderUuidValue(candidate);
  if (candidate && !hasPlaceholder) {
    return {
      ownerUserId: null,
      source: 'invalid',
      hasPlaceholder: false
    };
  }

  const supabaseUrl = (env.SUPABASE_URL || env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '');
  const serviceKey = (env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const serviceFmt = classifySupabaseKeyFormat(serviceKey);

  if (!supabaseUrl || (serviceFmt !== 'sb_secret' && serviceFmt !== 'jwt_service_role')) {
    return {
      ownerUserId: null,
      source: 'missing',
      hasPlaceholder
    };
  }

  try {
    const resp = await fetchImpl(
      `${supabaseUrl}/rest/v1/app_owner_registry?id=eq.1&select=owner_user_id&limit=1`,
      {
        method: 'GET',
        headers: buildSupabaseRestHeaders(serviceKey),
        signal: AbortSignal.timeout(5000)
      }
    );
    if (!resp.ok) {
      return { ownerUserId: null, source: 'missing', hasPlaceholder };
    }
    const rows = (await resp.json().catch(() => null)) as Array<{ owner_user_id?: string }> | null;
    const registryUuid = Array.isArray(rows) ? rows[0]?.owner_user_id?.trim() : undefined;
    if (isValidUuid(registryUuid)) {
      return {
        ownerUserId: registryUuid!,
        source: 'app_owner_registry',
        hasPlaceholder
      };
    }
    return { ownerUserId: null, source: 'missing', hasPlaceholder };
  } catch {
    return { ownerUserId: null, source: 'missing', hasPlaceholder };
  }
}
