export const EXPECTED_SUPABASE_URL = 'https://bclbfqhetjiobmskecqv.supabase.co';

export interface SupabaseEnvValidationReport {
  expectedProjectUrl: string;
  configuredClientUrlMatchesTarget: boolean;
  configuredServerUrlMatchesTarget: boolean;
  hasViteSupabaseUrl: boolean;
  hasViteSupabaseAnonKey: boolean;
  frontendKeyIsPublicSafe: boolean;
  hasServerSupabaseUrl: boolean;
  hasServerServiceRoleKey: boolean;
  hasOwnerUserId: boolean;
  hasCronSecret: boolean;
  isClientReady: boolean;
  isServerDbReady: boolean;
  isAutomationReady: boolean;
  missingVariables: string[];
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

/**
 * Validates Supabase environment configuration cleanly without ever exposing or logging secret values.
 */
export function validateSupabaseEnvironment(
  env: Record<string, string | undefined> = process.env
): SupabaseEnvValidationReport {
  const viteUrl = (env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '');
  const viteAnon = (env.VITE_SUPABASE_ANON_KEY || '').trim();
  const serverUrl = (env.SUPABASE_URL || '').trim().replace(/\/$/, '');
  const serviceRoleKey = (env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const ownerUserId = (env.OWNER_SUPABASE_USER_ID || '').trim();
  const cronSecret = (env.CRON_SECRET || '').trim();

  const hasViteSupabaseUrl = Boolean(viteUrl);
  const hasViteSupabaseAnonKey = Boolean(viteAnon);
  const frontendKeyRole = viteAnon ? decodeJwtRoleClaimServer(viteAnon) : null;
  const frontendKeyIsPublicSafe = !viteAnon || frontendKeyRole !== 'service_role';

  const hasServerSupabaseUrl = Boolean(serverUrl);
  const hasServerServiceRoleKey = Boolean(serviceRoleKey);
  const hasOwnerUserId = Boolean(ownerUserId);
  const hasCronSecret = Boolean(cronSecret);

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

  const warnings: string[] = [];
  if (hasViteSupabaseUrl && !configuredClientUrlMatchesTarget) {
    warnings.push(`VITE_SUPABASE_URL does not match expected project URL (${EXPECTED_SUPABASE_URL}).`);
  }
  if (hasServerSupabaseUrl && !configuredServerUrlMatchesTarget) {
    warnings.push(`SUPABASE_URL does not match expected project URL (${EXPECTED_SUPABASE_URL}).`);
  }
  if (!frontendKeyIsPublicSafe) {
    warnings.push('SECURITY VIOLATION: VITE_SUPABASE_ANON_KEY contains a service_role JWT.');
  }

  const isClientReady =
    hasViteSupabaseUrl &&
    configuredClientUrlMatchesTarget &&
    hasViteSupabaseAnonKey &&
    frontendKeyIsPublicSafe;

  const isServerDbReady =
    hasServerSupabaseUrl &&
    configuredServerUrlMatchesTarget &&
    hasServerServiceRoleKey &&
    hasOwnerUserId;

  const isAutomationReady = isServerDbReady && hasCronSecret;

  return {
    expectedProjectUrl: EXPECTED_SUPABASE_URL,
    configuredClientUrlMatchesTarget,
    configuredServerUrlMatchesTarget,
    hasViteSupabaseUrl,
    hasViteSupabaseAnonKey,
    frontendKeyIsPublicSafe,
    hasServerSupabaseUrl,
    hasServerServiceRoleKey,
    hasOwnerUserId,
    hasCronSecret,
    isClientReady,
    isServerDbReady,
    isAutomationReady,
    missingVariables,
    warnings
  };
}
