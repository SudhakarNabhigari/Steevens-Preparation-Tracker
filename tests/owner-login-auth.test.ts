import test from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';

import { createApp } from '../server.ts';
import { verifyOwnerAuthHeader, selectVerificationApiKey } from '../server/auth.ts';
import {
  isPlaceholderUuidValue as isServerPlaceholderUuid,
  validateSupabaseEnvironment
} from '../server/supabaseConfig.ts';
import {
  classifySupabaseAuthError,
  isPlaceholderUuidValue as isClientPlaceholderUuid,
  verifyOwnerSessionWithServer
} from '../src/lib/supabase.ts';

const SAMPLE_OWNER_UUID = '11111111-2222-4333-8444-555555555555';
const SAMPLE_OTHER_UUID = '99999999-8888-4777-8666-555555555555';
const SAMPLE_OWNER_EMAIL = 'mypreparation0111@gmail.com';
const SAMPLE_URL = 'https://bclbfqhetjiobmskecqv.supabase.co';
const SAMPLE_PUBLISHABLE_KEY = 'sb_publishable_test_public_key_example_12345';
const SAMPLE_SERVICE_KEY = 'sb_secret_test_service_key_example_67890';

test('1. Placeholder UUID detection flags template values on both frontend and backend', () => {
  assert.equal(isClientPlaceholderUuid('your-owner-auth-user-uuid'), true);
  assert.equal(isServerPlaceholderUuid('your-owner-auth-user-uuid'), true);
  assert.equal(isClientPlaceholderUuid(SAMPLE_OWNER_UUID), false);
  assert.equal(isServerPlaceholderUuid(SAMPLE_OWNER_UUID), false);

  const report = validateSupabaseEnvironment({
    VITE_SUPABASE_URL: SAMPLE_URL,
    VITE_SUPABASE_ANON_KEY: SAMPLE_PUBLISHABLE_KEY,
    VITE_OWNER_USER_ID: 'your-owner-auth-user-uuid',
    VITE_OWNER_AUTH_EMAIL: SAMPLE_OWNER_EMAIL,
    SUPABASE_URL: SAMPLE_URL,
    SUPABASE_ANON_KEY: 'invalid-short-non-matching-key',
    SUPABASE_SERVICE_ROLE_KEY: SAMPLE_SERVICE_KEY,
    OWNER_SUPABASE_USER_ID: 'your-owner-auth-user-uuid',
    OWNER_SUPABASE_EMAIL: SAMPLE_OWNER_EMAIL,
    CRON_SECRET: 'cron-secret-with-at-least-24-chars'
  });

  assert.equal(report.ownerUserIdIsValidUuid, false);
  assert.equal(report.viteOwnerUserIdIsValidUuid, false);
  assert.equal(report.isServerDbReady, false);
  assert.ok(report.warnings.some((w) => w.includes('OWNER_SUPABASE_USER_ID') && w.includes('placeholder')));
  assert.ok(report.warnings.some((w) => w.includes('VITE_OWNER_USER_ID') && w.includes('placeholder')));
  assert.ok(report.warnings.some((w) => w.includes('SUPABASE_ANON_KEY format is unrecognized')));
});

test('2. selectVerificationApiKey prefers valid public anon/publishable key over corrupted SUPABASE_ANON_KEY', () => {
  const pickedVite = selectVerificationApiKey({
    SUPABASE_ANON_KEY: 'corrupted-35-char-non-publishable-k',
    VITE_SUPABASE_ANON_KEY: SAMPLE_PUBLISHABLE_KEY,
    SUPABASE_SERVICE_ROLE_KEY: SAMPLE_SERVICE_KEY
  });
  assert.equal(pickedVite, SAMPLE_PUBLISHABLE_KEY);

  const pickedServer = selectVerificationApiKey({
    SUPABASE_ANON_KEY: SAMPLE_PUBLISHABLE_KEY,
    VITE_SUPABASE_ANON_KEY: 'sb_publishable_other',
    SUPABASE_SERVICE_ROLE_KEY: SAMPLE_SERVICE_KEY
  });
  assert.equal(pickedServer, SAMPLE_PUBLISHABLE_KEY);
});

test('3. POST /api/auth/verify-owner enforces Bearer JWT, Owner UUID, Email, and app_owner_registry', async () => {
  // Missing token -> 401 MISSING_TOKEN
  const appDefault = await createApp({ attachFrontend: false });
  const serverDefault = appDefault.listen(0);
  const portDefault = (serverDefault.address() as AddressInfo).port;
  try {
    const missingResp = await fetch(`http://127.0.0.1:${portDefault}/api/auth/verify-owner`, {
      method: 'POST'
    });
    assert.equal(missingResp.status, 401);
    const missingBody = (await missingResp.json()) as { authorized: boolean; errorCode: string };
    assert.equal(missingBody.authorized, false);
    assert.equal(missingBody.errorCode, 'MISSING_TOKEN');
  } finally {
    await new Promise<void>((resolve) => serverDefault.close(() => resolve()));
  }

  // Case A: placeholder OWNER_SUPABASE_USER_ID on server -> 403 OWNER_CONFIG_INVALID_UUID
  const mockOwnerAuthFetch: typeof fetch = async (input) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (url.endsWith('/auth/v1/user')) {
      return new Response(
        JSON.stringify({ id: SAMPLE_OWNER_UUID, email: SAMPLE_OWNER_EMAIL }),
        { status: 200 }
      );
    }
    if (url.includes('/rest/v1/app_owner_registry')) {
      return new Response(JSON.stringify([{ owner_user_id: SAMPLE_OWNER_UUID }]), { status: 200 });
    }
    return new Response('Not found', { status: 404 });
  };

  const placeholderRes = await verifyOwnerAuthHeader('Bearer valid.owner.jwt', {
    allowCronSecret: false,
    env: {
      SUPABASE_URL: SAMPLE_URL,
      SUPABASE_ANON_KEY: SAMPLE_PUBLISHABLE_KEY,
      OWNER_SUPABASE_USER_ID: 'your-owner-auth-user-uuid',
      OWNER_SUPABASE_EMAIL: SAMPLE_OWNER_EMAIL
    },
    fetchImpl: mockOwnerAuthFetch
  });
  assert.equal(placeholderRes.authorized, false);
  assert.equal(placeholderRes.status, 403);
  assert.equal(placeholderRes.errorCode, 'OWNER_CONFIG_INVALID_UUID');

  // Case B: UUID mismatch -> 403 OWNER_UUID_MISMATCH
  const mismatchRes = await verifyOwnerAuthHeader('Bearer other.user.jwt', {
    allowCronSecret: false,
    env: {
      SUPABASE_URL: SAMPLE_URL,
      SUPABASE_ANON_KEY: SAMPLE_PUBLISHABLE_KEY,
      OWNER_SUPABASE_USER_ID: SAMPLE_OTHER_UUID,
      OWNER_SUPABASE_EMAIL: SAMPLE_OWNER_EMAIL
    },
    fetchImpl: mockOwnerAuthFetch
  });
  assert.equal(mismatchRes.authorized, false);
  assert.equal(mismatchRes.status, 403);
  assert.equal(mismatchRes.errorCode, 'OWNER_UUID_MISMATCH');

  // Case C: Email mismatch -> 403 OWNER_EMAIL_MISMATCH
  const emailMismatchRes = await verifyOwnerAuthHeader('Bearer valid.owner.jwt', {
    allowCronSecret: false,
    env: {
      SUPABASE_URL: SAMPLE_URL,
      SUPABASE_ANON_KEY: SAMPLE_PUBLISHABLE_KEY,
      OWNER_SUPABASE_USER_ID: SAMPLE_OWNER_UUID,
      OWNER_SUPABASE_EMAIL: 'someoneelse@example.com'
    },
    fetchImpl: mockOwnerAuthFetch
  });
  assert.equal(emailMismatchRes.authorized, false);
  assert.equal(emailMismatchRes.status, 403);
  assert.equal(emailMismatchRes.errorCode, 'OWNER_EMAIL_MISMATCH');

  // Case D: Registry unauthorized -> 403 OWNER_REGISTRY_UNAUTHORIZED
  const registryUnauthorizedFetch: typeof fetch = async (input) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (url.endsWith('/auth/v1/user')) {
      return new Response(
        JSON.stringify({ id: SAMPLE_OWNER_UUID, email: SAMPLE_OWNER_EMAIL }),
        { status: 200 }
      );
    }
    return new Response(JSON.stringify([{ owner_user_id: SAMPLE_OTHER_UUID }]), { status: 200 });
  };
  const regDeniedRes = await verifyOwnerAuthHeader('Bearer valid.owner.jwt', {
    allowCronSecret: false,
    env: {
      SUPABASE_URL: SAMPLE_URL,
      SUPABASE_ANON_KEY: SAMPLE_PUBLISHABLE_KEY,
      SUPABASE_SERVICE_ROLE_KEY: SAMPLE_SERVICE_KEY,
      OWNER_SUPABASE_USER_ID: SAMPLE_OWNER_UUID,
      OWNER_SUPABASE_EMAIL: SAMPLE_OWNER_EMAIL
    },
    fetchImpl: registryUnauthorizedFetch
  });
  assert.equal(regDeniedRes.authorized, false);
  assert.equal(regDeniedRes.status, 403);
  assert.equal(regDeniedRes.errorCode, 'OWNER_REGISTRY_UNAUTHORIZED');

  // Case E: Registry empty -> 403 OWNER_REGISTRY_EMPTY
  const registryEmptyFetch: typeof fetch = async (input) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (url.endsWith('/auth/v1/user')) {
      return new Response(
        JSON.stringify({ id: SAMPLE_OWNER_UUID, email: SAMPLE_OWNER_EMAIL }),
        { status: 200 }
      );
    }
    return new Response(JSON.stringify([]), { status: 200 });
  };
  const regEmptyRes = await verifyOwnerAuthHeader('Bearer valid.owner.jwt', {
    allowCronSecret: false,
    env: {
      SUPABASE_URL: SAMPLE_URL,
      SUPABASE_ANON_KEY: SAMPLE_PUBLISHABLE_KEY,
      SUPABASE_SERVICE_ROLE_KEY: SAMPLE_SERVICE_KEY,
      OWNER_SUPABASE_USER_ID: SAMPLE_OWNER_UUID,
      OWNER_SUPABASE_EMAIL: SAMPLE_OWNER_EMAIL
    },
    fetchImpl: registryEmptyFetch
  });
  assert.equal(regEmptyRes.authorized, false);
  assert.equal(regEmptyRes.status, 403);
  assert.equal(regEmptyRes.errorCode, 'OWNER_REGISTRY_EMPTY');

  // Case F: HTTP POST /api/auth/verify-owner succeeds (200) when JWT, UUID, email, and registry all match
  const validEnv = {
    SUPABASE_URL: SAMPLE_URL,
    SUPABASE_ANON_KEY: SAMPLE_PUBLISHABLE_KEY,
    SUPABASE_SERVICE_ROLE_KEY: SAMPLE_SERVICE_KEY,
    OWNER_SUPABASE_USER_ID: SAMPLE_OWNER_UUID,
    OWNER_SUPABASE_EMAIL: SAMPLE_OWNER_EMAIL
  };
  const appVerified = await createApp({
    attachFrontend: false,
    verifyOwner: (header, opts) =>
      verifyOwnerAuthHeader(header, { ...opts, env: validEnv, fetchImpl: mockOwnerAuthFetch })
  });
  const serverVerified = appVerified.listen(0);
  const portVerified = (serverVerified.address() as AddressInfo).port;
  try {
    const okResp = await fetch(`http://127.0.0.1:${portVerified}/api/auth/verify-owner`, {
      method: 'POST',
      headers: { Authorization: 'Bearer valid.owner.jwt' }
    });
    assert.equal(okResp.status, 200);
    const okBody = (await okResp.json()) as {
      authorized: boolean;
      authMethod: string;
      registryVerified: boolean;
    };
    assert.equal(okBody.authorized, true);
    assert.equal(okBody.authMethod, 'owner_jwt');
    assert.equal(okBody.registryVerified, true);
  } finally {
    await new Promise<void>((resolve) => serverVerified.close(() => resolve()));
  }
  // Case G: Placeholder OWNER_SUPABASE_USER_ID + valid SUPABASE_SERVICE_ROLE_KEY + matching app_owner_registry -> 200
  const placeholderWithRegistryOk = await verifyOwnerAuthHeader('Bearer valid.owner.jwt', {
    allowCronSecret: false,
    env: {
      SUPABASE_URL: SAMPLE_URL,
      SUPABASE_ANON_KEY: SAMPLE_PUBLISHABLE_KEY,
      SUPABASE_SERVICE_ROLE_KEY: SAMPLE_SERVICE_KEY,
      OWNER_SUPABASE_USER_ID: 'your-owner-auth-user-uuid',
      OWNER_SUPABASE_EMAIL: SAMPLE_OWNER_EMAIL
    },
    fetchImpl: mockOwnerAuthFetch
  });
  assert.equal(placeholderWithRegistryOk.authorized, true);
  assert.equal(placeholderWithRegistryOk.status, 200);
  assert.equal(placeholderWithRegistryOk.registryVerified, true);
  assert.equal(placeholderWithRegistryOk.userId, SAMPLE_OWNER_UUID);

  // Case H: Placeholder OWNER_SUPABASE_USER_ID + mismatched app_owner_registry -> 403 OWNER_REGISTRY_UNAUTHORIZED
  const placeholderWithRegistryMismatch = await verifyOwnerAuthHeader('Bearer valid.owner.jwt', {
    allowCronSecret: false,
    env: {
      SUPABASE_URL: SAMPLE_URL,
      SUPABASE_ANON_KEY: SAMPLE_PUBLISHABLE_KEY,
      SUPABASE_SERVICE_ROLE_KEY: SAMPLE_SERVICE_KEY,
      OWNER_SUPABASE_USER_ID: 'your-owner-auth-user-uuid',
      OWNER_SUPABASE_EMAIL: SAMPLE_OWNER_EMAIL
    },
    fetchImpl: registryUnauthorizedFetch
  });
  assert.equal(placeholderWithRegistryMismatch.authorized, false);
  assert.equal(placeholderWithRegistryMismatch.status, 403);
  assert.equal(placeholderWithRegistryMismatch.errorCode, 'OWNER_REGISTRY_UNAUTHORIZED');

  // Case I: Placeholder OWNER_SUPABASE_USER_ID + absent (404) app_owner_registry -> 403 OWNER_CONFIG_INVALID_UUID
  const registryAbsentFetch: typeof fetch = async (input) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (url.endsWith('/auth/v1/user')) {
      return new Response(
        JSON.stringify({ id: SAMPLE_OWNER_UUID, email: SAMPLE_OWNER_EMAIL }),
        { status: 200 }
      );
    }
    return new Response('Not found', { status: 404 });
  };
  const placeholderWithRegistryAbsent = await verifyOwnerAuthHeader('Bearer valid.owner.jwt', {
    allowCronSecret: false,
    env: {
      SUPABASE_URL: SAMPLE_URL,
      SUPABASE_ANON_KEY: SAMPLE_PUBLISHABLE_KEY,
      SUPABASE_SERVICE_ROLE_KEY: SAMPLE_SERVICE_KEY,
      OWNER_SUPABASE_USER_ID: 'your-owner-auth-user-uuid',
      OWNER_SUPABASE_EMAIL: SAMPLE_OWNER_EMAIL
    },
    fetchImpl: registryAbsentFetch
  });
  assert.equal(placeholderWithRegistryAbsent.authorized, false);
  assert.equal(placeholderWithRegistryAbsent.status, 403);
  assert.equal(placeholderWithRegistryAbsent.errorCode, 'OWNER_CONFIG_INVALID_UUID');
});

test('4. classifySupabaseAuthError distinguishes all failure categories clearly', () => {
  assert.match(
    classifySupabaseAuthError({ message: 'Invalid login credentials', status: 400 }),
    /Invalid email or password/i
  );
  assert.match(
    classifySupabaseAuthError({ message: 'Email not confirmed', status: 400 }),
    /not confirmed/i
  );
  assert.match(
    classifySupabaseAuthError({ message: 'Failed to fetch', status: 0 }),
    /Network error/i
  );
  assert.match(
    classifySupabaseAuthError({ message: 'Invalid API key', status: 401 }),
    /VITE_SUPABASE_ANON_KEY/i
  );
  assert.match(
    classifySupabaseAuthError({ message: 'JWT expired', status: 401 }),
    /expired/i
  );
  assert.match(
    classifySupabaseAuthError({ message: 'Too many requests', status: 429 }),
    /Too many authentication attempts/i
  );
  assert.match(
    classifySupabaseAuthError({ message: 'Internal server error', status: 503 }),
    /service error/i
  );
});

test('5. verifyOwnerSessionWithServer handles 200, 401/403, 404 fallback/strict mode, and network outage', async () => {
  const ok = await verifyOwnerSessionWithServer('token', async () =>
    new Response(JSON.stringify({ authorized: true, registryVerified: true }), { status: 200 })
  );
  assert.deepEqual(ok, { authorized: true, registryVerified: true });

  const denied = await verifyOwnerSessionWithServer('token', async () =>
    new Response(
      JSON.stringify({
        authorized: false,
        errorCode: 'OWNER_REGISTRY_UNAUTHORIZED',
        error: 'Not in registry'
      }),
      { status: 403 }
    )
  );
  assert.equal(denied.authorized, false);
  assert.equal(denied.errorCode, 'OWNER_REGISTRY_UNAUTHORIZED');
  assert.equal(denied.error, 'Not in registry');

  const staticHost = await verifyOwnerSessionWithServer('token', async () =>
    new Response('Not Found', { status: 404 })
  );
  assert.deepEqual(staticHost, { authorized: true, registryVerified: false });

  const strictStaticDenied = await verifyOwnerSessionWithServer(
    'token',
    async () => new Response('Not Found', { status: 404 }),
    { requireStrictServer: true }
  );
  assert.equal(strictStaticDenied.authorized, false);
  assert.equal(strictStaticDenied.errorCode, 'SERVER_VERIFICATION_REQUIRED');

  const offline = await verifyOwnerSessionWithServer('token', async () => {
    throw new TypeError('Failed to fetch');
  });
  assert.equal(offline.authorized, false);
  assert.equal(offline.unreachable, true);
  assert.equal(offline.errorCode, 'SERVER_UNREACHABLE');
});
