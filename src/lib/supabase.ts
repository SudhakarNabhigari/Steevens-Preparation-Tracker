import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';

export const EXPECTED_SUPABASE_PROJECT_URL = 'https://bclbfqhetjiobmskecqv.supabase.co';

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
  supabaseAnonKey && decodeJwtRoleClaim(supabaseAnonKey) !== 'service_role'
);

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey &&
    isAnonKeySafeForClient
);

export const configuredOwnerEmail = (import.meta.env?.VITE_OWNER_AUTH_EMAIL || '').trim();
export const configuredOwnerUserId = (import.meta.env?.VITE_OWNER_USER_ID || '').trim();

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
  if (configuredOwnerUserId && data.session.user?.id !== configuredOwnerUserId) {
    return null;
  }
  return data.session;
}

export async function getOwnerAccessToken(): Promise<string | null> {
  const session = await getSupabaseOwnerSession();
  return session?.access_token || null;
}