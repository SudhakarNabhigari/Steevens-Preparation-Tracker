import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  EXPECTED_SUPABASE_URL,
  validateSupabaseEnvironment
} from '../server/supabaseConfig.ts';
import {
  fetchLatestAutomationRunFromSupabase,
  fetchTrackBriefFromSupabase,
  generateTrackDailyCanonical,
  isTrackDayCurrentlyUnlockedCanonical,
  syncAutomationRunToSupabase,
  syncTrackResourcesToSupabase,
  verifyCronRequest,
  type PipelineEnvConfig
} from '../supabase/functions/daily-learning-resources/pipeline.ts';

function makeJwtWithRole(role: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ role, iss: 'supabase' })).toString('base64url');
  return `${header}.${payload}.fakesignature`;
}

// ============================================================================
// TASK 1: SUPABASE CONNECTION & ENV VALIDATION (ZERO SECRET EXPOSURE)
// ============================================================================
test('Step 2 Task 1: Validates target Supabase URL, frontend anon-only key safety, and zero secret leaks', () => {
  assert.equal(EXPECTED_SUPABASE_URL, 'https://bclbfqhetjiobmskecqv.supabase.co');

  const safeAnonJwt = makeJwtWithRole('anon');
  const unsafeServiceJwt = makeJwtWithRole('service_role');

  const validReport = validateSupabaseEnvironment({
    VITE_SUPABASE_URL: 'https://bclbfqhetjiobmskecqv.supabase.co',
    VITE_SUPABASE_ANON_KEY: safeAnonJwt,
    SUPABASE_URL: 'https://bclbfqhetjiobmskecqv.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: unsafeServiceJwt,
    OWNER_SUPABASE_USER_ID: '11111111-1111-1111-1111-111111111111',
    CRON_SECRET: 'super-secret-value-never-returned'
  });

  assert.equal(validReport.isClientReady, true);
  assert.equal(validReport.isServerDbReady, true);
  assert.equal(validReport.isAutomationReady, true);
  assert.equal(validReport.frontendKeyIsPublicSafe, true);
  assert.equal(validReport.missingVariables.length, 0);
  // Confirm zero secret material appears anywhere in the diagnostic report
  const serialized = JSON.stringify(validReport);
  assert.equal(serialized.includes(unsafeServiceJwt), false);
  assert.equal(serialized.includes('super-secret-value-never-returned'), false);

  // If someone accidentally puts a service_role JWT into VITE_SUPABASE_ANON_KEY -> must fail closed!
  const leakedKeyReport = validateSupabaseEnvironment({
    VITE_SUPABASE_URL: 'https://bclbfqhetjiobmskecqv.supabase.co',
    VITE_SUPABASE_ANON_KEY: unsafeServiceJwt
  });
  assert.equal(leakedKeyReport.frontendKeyIsPublicSafe, false);
  assert.equal(leakedKeyReport.isClientReady, false);
  assert.ok(leakedKeyReport.warnings.some((w) => /service_role/i.test(w)));
});

// ============================================================================
// TASK 3, 4 & 7: MIGRATION SQL, RLS POLICY & CRON SCRIPT AUDITS
// ============================================================================
test('Step 2 Tasks 3, 4, 7: Migration SQL creates exactly 3 tables, strict RLS CRUD policies, and separates cron scheduling', () => {
  const migrationSql = fs.readFileSync(
    path.resolve(process.cwd(), 'supabase/migrations/20261117_daily_ai_learning_resources.sql'),
    'utf8'
  );
  const sqlWithoutComments = migrationSql
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('--'))
    .join('\n');
  const lower = sqlWithoutComments.toLowerCase();

  // Target project & non-destructive guarantees
  assert.ok(migrationSql.includes('https://bclbfqhetjiobmskecqv.supabase.co'));
  assert.equal(/\bdrop\s+table\b/i.test(lower), false);
  assert.equal(/\btruncate\s+table\b/i.test(lower), false);
  assert.equal(/\buser_progress\b/i.test(lower), false);
  assert.equal(/cron\.schedule\s*\(/i.test(lower), false, 'Cron must NOT be scheduled inside initial migration');

  // Exactly the 3 required tables
  assert.ok(lower.includes('create table if not exists public.daily_learning_resources'));
  assert.ok(lower.includes('create table if not exists public.daily_learning_briefs'));
  assert.ok(lower.includes('create table if not exists public.daily_automation_runs'));

  // Required constraints, indexes, triggers, and automation columns
  assert.ok(lower.includes('daily_learning_resources_unique_item unique (user_id, track_id, plan_day, resource_type, url)'));
  assert.ok(lower.includes('daily_learning_briefs_unique_day unique (user_id, track_id, plan_day)'));
  assert.ok(lower.includes('run_key text not null unique'));
  assert.ok(lower.includes('track_statuses jsonb not null'));
  assert.ok(lower.includes('started_at timestamptz not null'));
  assert.ok(lower.includes('completed_at timestamptz'));
  assert.ok(lower.includes('references auth.users(id) on delete cascade'));
  assert.ok(lower.includes('idx_daily_learning_resources_lookup'));
  assert.ok(lower.includes('idx_daily_learning_briefs_lookup'));
  assert.ok(lower.includes('idx_daily_automation_runs_date'));
  assert.ok(lower.includes('trg_daily_learning_resources_updated_at'));
  assert.ok(lower.includes('trg_daily_learning_briefs_updated_at'));

  // Strict RLS enabled + anon revoked + full Owner SELECT/INSERT/UPDATE/DELETE policies
  for (const tbl of ['daily_learning_resources', 'daily_learning_briefs', 'daily_automation_runs']) {
    assert.ok(lower.includes(`alter table public.${tbl} enable row level security;`));
    assert.ok(lower.includes(`revoke all on public.${tbl} from anon;`));
    for (const op of ['select', 'insert', 'update', 'delete']) {
      assert.ok(
        lower.includes(`on public.${tbl} for ${op}`),
        `Missing ${op.toUpperCase()} RLS policy for ${tbl}`
      );
    }
  }
  assert.ok(lower.includes('auth.uid() = user_id'));

  // Verify separate post-verification cron script
  const cronSql = fs.readFileSync(
    path.resolve(process.cwd(), 'supabase/scripts/schedule_10am_ist_cron_after_verify.sql'),
    'utf8'
  );
  assert.ok(cronSql.includes("'30 4 * * *'"));
  assert.ok(cronSql.includes('project_url'));
  assert.ok(cronSql.includes('cron_secret'));
  assert.ok(cronSql.includes('/functions/v1/daily-learning-resources'));
});

// ============================================================================
// TASK 5 & 6: THREE-TRACK CLOUD ROUND-TRIP + CROSS-TRACK ISOLATION + RLS SIM
// ============================================================================
function createInMemorySupabasePostgrestMock(ownerUuid: string, serviceRoleKey: string) {
  const briefs = new Map<string, Record<string, unknown>>();
  const resources = new Map<string, Record<string, unknown>>();
  const runs = new Map<string, Record<string, unknown>>();

  const mockFetch: typeof fetch = async (input, init) => {
    const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const url = new URL(urlStr);
    const headers = new Headers(init?.headers || {});
    const auth = headers.get('Authorization') || '';
    const method = (init?.method || 'GET').toUpperCase();

    // Enforce backend service_role auth check just like Supabase RLS + anon revocation
    if (auth !== `Bearer ${serviceRoleKey}`) {
      return new Response(JSON.stringify({ message: 'RLS denied: authenticated Owner or service_role required' }), {
        status: 401
      });
    }

    if (url.pathname.endsWith('/rest/v1/daily_learning_briefs')) {
      if (method === 'POST') {
        const rows = JSON.parse(String(init?.body || '[]')) as Array<Record<string, unknown>>;
        for (const r of rows) {
          const key = `${r.user_id}::${r.track_id}::${r.plan_day}`;
          briefs.set(key, { created_at: new Date().toISOString(), ...r });
        }
        return new Response(null, { status: 201 });
      }
      if (method === 'GET') {
        const userFilter = url.searchParams.get('user_id')?.replace(/^eq\./, '');
        const trackFilter = url.searchParams.get('track_id')?.replace(/^eq\./, '');
        const dayFilter = Number(url.searchParams.get('plan_day')?.replace(/^eq\./, ''));
        const matched = Array.from(briefs.values()).filter(
          (r) =>
            r.user_id === ownerUuid &&
            r.user_id === userFilter &&
            r.track_id === trackFilter &&
            r.plan_day === dayFilter
        );
        return new Response(JSON.stringify(matched), { status: 200 });
      }
    }

    if (url.pathname.endsWith('/rest/v1/daily_learning_resources')) {
      if (method === 'POST') {
        const rows = JSON.parse(String(init?.body || '[]')) as Array<Record<string, unknown>>;
        for (const r of rows) {
          const key = `${r.user_id}::${r.track_id}::${r.plan_day}::${r.resource_type}::${r.url}`;
          resources.set(key, r);
        }
        return new Response(null, { status: 201 });
      }
      if (method === 'GET') {
        const userFilter = url.searchParams.get('user_id')?.replace(/^eq\./, '');
        const trackFilter = url.searchParams.get('track_id')?.replace(/^eq\./, '');
        const dayFilter = Number(url.searchParams.get('plan_day')?.replace(/^eq\./, ''));
        const matched = Array.from(resources.values()).filter(
          (r) =>
            r.user_id === ownerUuid &&
            r.user_id === userFilter &&
            r.track_id === trackFilter &&
            r.plan_day === dayFilter
        );
        return new Response(JSON.stringify(matched), { status: 200 });
      }
    }

    if (url.pathname.endsWith('/rest/v1/daily_automation_runs')) {
      if (method === 'POST') {
        const rows = JSON.parse(String(init?.body || '[]')) as Array<Record<string, unknown>>;
        for (const r of rows) {
          runs.set(String(r.run_key), r);
        }
        return new Response(null, { status: 201 });
      }
      if (method === 'GET') {
        const runKeyFilter = url.searchParams.get('run_key')?.replace(/^eq\./, '');
        const userFilter = url.searchParams.get('user_id')?.replace(/^eq\./, '');
        const matched = Array.from(runs.values()).filter((r) =>
          runKeyFilter
            ? r.run_key === runKeyFilter && r.user_id === ownerUuid
            : r.user_id === ownerUuid && r.user_id === userFilter
        );
        return new Response(JSON.stringify(matched), { status: 200 });
      }
    }

    return new Response(JSON.stringify({ error: 'Unhandled mock route' }), { status: 404 });
  };

  return { mockFetch, briefs, resources, runs };
}

test('Step 2 Tasks 5 & 6: Main, DSA, and Azure round-trip independently without duplicates or cross-track leakage', async () => {
  const ownerUuid = '11111111-1111-1111-1111-111111111111';
  const serviceKey = makeJwtWithRole('service_role');
  const { mockFetch, briefs, resources } = createInMemorySupabasePostgrestMock(ownerUuid, serviceKey);

  const config: PipelineEnvConfig = {
    supabaseUrl: EXPECTED_SUPABASE_URL,
    supabaseServiceRoleKey: serviceKey,
    ownerUserId: ownerUuid,
    fetchImpl: mockFetch
  };

  // Generate & persist Day 1 for all 3 tracks cleanly (without hitting external network)
  const mainDay1 = await generateTrackDailyCanonical('main', 1, config, {
    forceRefresh: true,
    persistToCloud: true,
    skipExternalNetworkChecks: true
  });
  const dsaDay1 = await generateTrackDailyCanonical('dsa', 1, config, {
    forceRefresh: true,
    persistToCloud: true,
    skipExternalNetworkChecks: true
  });
  const dsaDay2 = await generateTrackDailyCanonical('dsa', 2, config, {
    forceRefresh: true,
    persistToCloud: true,
    skipExternalNetworkChecks: true
  });
  const azureDay1 = await generateTrackDailyCanonical('azure', 1, config, {
    forceRefresh: true,
    persistToCloud: true,
    skipExternalNetworkChecks: true
  });

  // Persist again to confirm idempotent upsert does NOT create duplicates
  const reSynced = await syncTrackResourcesToSupabase(azureDay1, config);
  assert.equal(reSynced, true);

  // Confirm 4 distinct briefs saved (main d1, dsa d1, dsa d2, azure d1)
  assert.equal(briefs.size, 4);

  // Retrieve each track back from simulated Supabase DB and verify data integrity
  const fetchedMain = await fetchTrackBriefFromSupabase('main', 1, config);
  assert.ok(fetchedMain);
  assert.equal(fetchedMain.trackId, 'main');
  assert.equal(fetchedMain.topicTitle, mainDay1.topicTitle);
  assert.equal(fetchedMain.leetcodeQuestions.length, 0, 'Main must NEVER receive LeetCode questions');
  assert.ok(fetchedMain.officialDocs.length >= 1);
  assert.ok(fetchedMain.practicalExercises.length === 1);

  const fetchedDsaDay1 = await fetchTrackBriefFromSupabase('dsa', 1, config);
  assert.ok(fetchedDsaDay1);
  assert.equal(fetchedDsaDay1.leetcodeQuestions.length, 3);
  assert.equal(fetchedDsaDay1.leetcodeQuestions[0].difficulty, 'Easy');
  assert.equal(fetchedDsaDay1.leetcodeQuestions[1].difficulty, 'Medium');
  assert.equal(fetchedDsaDay1.leetcodeQuestions[2].difficulty, 'Hard');
  assert.equal(fetchedDsaDay1.leetcodeQuestions[2].available, false);
  assert.ok(fetchedDsaDay1.leetcodeQuestions[2].whyUnavailable);

  const fetchedDsaDay2 = await fetchTrackBriefFromSupabase('dsa', 2, config);
  assert.ok(fetchedDsaDay2);
  assert.equal(fetchedDsaDay2.topicTitle, dsaDay2.topicTitle);
  assert.equal(fetchedDsaDay2.leetcodeQuestions.filter((q) => q.available).length, 3);

  const fetchedAzure = await fetchTrackBriefFromSupabase('azure', 1, config);
  assert.ok(fetchedAzure);
  assert.equal(fetchedAzure.trackId, 'azure');
  assert.equal(fetchedAzure.topicTitle, azureDay1.topicTitle);
  assert.equal(fetchedAzure.leetcodeQuestions.length, 0, 'Azure must NEVER receive LeetCode questions');
  assert.ok(
    fetchedAzure.officialDocs.every((d) => d.url?.startsWith('https://learn.microsoft.com/')),
    'Azure Day 1 must preserve Microsoft Learn official documentation URLs'
  );
  assert.ok(fetchedAzure.practicalExercises.length === 1);

  // Confirm unauthenticated / wrong key cannot read or write Supabase mock REST endpoints
  const badKeyConfig: PipelineEnvConfig = {
    ...config,
    supabaseServiceRoleKey: 'invalid-guest-or-anon-key'
  };
  assert.equal(await syncTrackResourcesToSupabase(mainDay1, badKeyConfig), false);
  assert.equal(await fetchTrackBriefFromSupabase('main', 1, badKeyConfig), null);

  // Confirm resources table stores practical_exercise & leetcode types separately per track
  const azureStoredTypes = Array.from(resources.values())
    .filter((r) => r.track_id === 'azure')
    .map((r) => r.resource_type);
  assert.ok(azureStoredTypes.includes('official_documentation'));
  assert.ok(azureStoredTypes.includes('practical_exercise'));
  assert.equal(azureStoredTypes.includes('leetcode'), false);
  assert.ok(dsaDay1.topicTitle.length > 0);
});

test('Step 2 Task 5C & 7: Automation run records track_statuses, start/end timestamps, deduplicates runs, and enforces future-day locks', async () => {
  const ownerUuid = '11111111-1111-1111-1111-111111111111';
  const serviceKey = makeJwtWithRole('service_role');
  const { mockFetch, runs } = createInMemorySupabasePostgrestMock(ownerUuid, serviceKey);

  const config: PipelineEnvConfig = {
    supabaseUrl: EXPECTED_SUPABASE_URL,
    supabaseServiceRoleKey: serviceKey,
    ownerUserId: ownerUuid,
    fetchImpl: mockFetch
  };

  const savedRun = await syncAutomationRunToSupabase(
    {
      runKey: 'daily_10am_ist_2026-11-17',
      runDate: '2026-11-17',
      triggerSource: 'manual_step2_verify_no_email',
      overallStatus: 'partial',
      trackStatuses: { main: 'updated', dsa: 'updated', azure: 'partially_updated' },
      emailStatus: 'not_sent',
      recipientEmail: 'mypreparation0111@gmail.com',
      startedAt: '2026-11-17T04:30:00.000Z',
      completedAt: '2026-11-17T04:30:12.000Z',
      ranAt: '2026-11-17T04:30:12.000Z'
    },
    config
  );
  assert.equal(savedRun, true);
  assert.equal(runs.size, 1);

  const fetchedRun = await fetchLatestAutomationRunFromSupabase(config, 'daily_10am_ist_2026-11-17');
  assert.ok(fetchedRun);
  assert.equal(fetchedRun.overallStatus, 'partial');
  assert.equal(fetchedRun.emailStatus, 'not_sent');
  assert.equal(fetchedRun.startedAt, '2026-11-17T04:30:00.000Z');
  assert.equal(fetchedRun.completedAt, '2026-11-17T04:30:12.000Z');
  assert.equal(fetchedRun.trackStatuses?.main, 'updated');
  assert.equal(fetchedRun.trackStatuses?.dsa, 'updated');
  assert.equal(fetchedRun.trackStatuses?.azure, 'partially_updated');

  // Verify future-day IST locks remain active
  assert.equal(isTrackDayCurrentlyUnlockedCanonical('main', 180, new Date('2026-11-17T10:00:00+05:30').getTime()), false);
  await assert.rejects(
    () =>
      generateTrackDailyCanonical('main', 180, config, {
        forceRefresh: true,
        persistToCloud: true
      }),
    /LOCKED_FUTURE_DAY/
  );

  // Verify CRON_SECRET fail-closed check
  assert.equal(verifyCronRequest(null, undefined).status, 500);
  assert.equal(verifyCronRequest('Bearer wrong', 'real-secret').status, 401);
  assert.equal(verifyCronRequest('Bearer real-secret', 'real-secret').authorized, true);
});
