import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import type { AddressInfo } from 'node:net';

import { createApp } from '../server.ts';
import { verifyOwnerAuthHeader } from '../server/auth.ts';
import {
  buildDeterministicReadOnlyTrack,
  getIstScheduleSnapshotCanonical,
  LEGACY_GUEST_START_DATE_IST,
  isTrackDayCurrentlyUnlockedCanonical,
  validateDsaLeetCodeTriplet,
  verifyCronRequest
} from '../supabase/functions/daily-learning-resources/pipeline.ts';
import {
  AZURE_CURRICULUM_CONTEXTS,
  DSA_CURRICULUM_CONTEXTS,
  getSharedDsaDailyLeetCodeTriplet,
  MAIN_CURRICULUM_CONTEXTS
} from '../supabase/functions/daily-learning-resources/catalogData.ts';

import { ALL_180_DAYS } from '../src/data/syllabus.ts';
import { DSA_100_DAYS } from '../src/data/dsaSyllabus.ts';
import { AZURE_100_DAYS } from '../src/data/azureSyllabus.ts';
import {
  getUnlockedAssessmentForWeek,
  WEEKLY_ASSESSMENTS
} from '../src/data/assessments.ts';
import { isAssessmentUnlockedByIstClock } from '../src/utils/assessmentLock.ts';
import { isDayUnlockedByIstClock } from '../src/utils/dailyLock.ts';
import {
  DEFAULT_GUEST_STATE,
  DEFAULT_OWNER_STATE,
  GUEST_STORAGE_KEY,
  mergeOwnerStatesSafely,
  OWNER_STORAGE_KEY,
  SHARED_CONTENT_STORAGE_KEY
} from '../src/services/storage.ts';
import {
  getSafeCloudState,
  loadOrMigrateOwnerProgress,
  saveOwnerProgressToCloud
} from '../src/services/cloudProgress.ts';
import { getRoadmapPdfUrl } from '../src/services/roadmapPdfStorage.ts';
import { hasPdfMagicHeader } from '../src/utils/pdfLoader.ts';
import {
  computeOwnerTransitionVerifier,
  constantTimeEqual,
  verifyGuestLocalPassword,
  verifyOwnerTransitionPassword
} from '../src/utils/authCrypto.ts';

function cloneOwnerState() {
  return JSON.parse(JSON.stringify(DEFAULT_OWNER_STATE));
}

function cloneGuestState() {
  return JSON.parse(JSON.stringify(DEFAULT_GUEST_STATE));
}

// ============================================================================
// 1–4. AUTHENTICATION, JWT, & ROLE SPOOFING PREVENTION (EXPRESS + AUTH MODULE)
// ============================================================================
test('1. Missing Owner authentication is rejected (401) and body.role spoofing is ignored', async () => {
  const resMissing = await verifyOwnerAuthHeader(undefined, { allowCronSecret: true });
  assert.equal(resMissing.authorized, false);
  assert.equal(resMissing.status, 401);

  const resMalformed = await verifyOwnerAuthHeader('Basic abc123', { allowCronSecret: true });
  assert.equal(resMalformed.authorized, false);
  assert.equal(resMalformed.status, 401);

  const app = await createApp({ attachFrontend: false });
  const server = app.listen(0);
  const port = (server.address() as AddressInfo).port;
  try {
    // Even if client sends { role: 'owner' } in JSON body, without Authorization Bearer token it MUST fail closed (401)
    const refreshResp = await fetch(`http://127.0.0.1:${port}/api/daily-resources/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackId: 'main', dayNumber: 1, role: 'owner' })
    });
    assert.equal(refreshResp.status, 401);

    const runResp = await fetch(`http://127.0.0.1:${port}/api/daily-resources/run-daily`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'owner' })
    });
    assert.equal(runResp.status, 401);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test('2. Invalid and expired JWTs are rejected (401)', async () => {
  const mockInvalidJwtFetch: typeof fetch = async () =>
    new Response(JSON.stringify({ message: 'JWT expired' }), { status: 401 });

  const env = {
    SUPABASE_URL: 'https://example-project.supabase.co',
    SUPABASE_ANON_KEY: 'anon-key-placeholder',
    OWNER_SUPABASE_USER_ID: 'owner-uuid-1111'
  };

  const expiredResult = await verifyOwnerAuthHeader('Bearer expired.jwt.token', {
    allowCronSecret: false,
    env,
    fetchImpl: mockInvalidJwtFetch
  });
  assert.equal(expiredResult.authorized, false);
  assert.equal(expiredResult.status, 401);

  const app = await createApp({
    attachFrontend: false,
    verifyOwner: (header, opts) =>
      verifyOwnerAuthHeader(header, { ...opts, env, fetchImpl: mockInvalidJwtFetch })
  });
  const server = app.listen(0);
  const port = (server.address() as AddressInfo).port;
  try {
    const resp = await fetch(`http://127.0.0.1:${port}/api/daily-resources/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer expired.jwt.token'
      },
      body: JSON.stringify({ trackId: 'main', dayNumber: 1 })
    });
    assert.equal(resp.status, 401);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test('3. Guest or wrong user JWT cannot access Owner-only endpoints (403)', async () => {
  const mockGuestJwtFetch: typeof fetch = async () =>
    new Response(
      JSON.stringify({ id: 'guest-or-other-uuid-9999', email: 'other@example.com' }),
      { status: 200 }
    );

  const env = {
    SUPABASE_URL: 'https://example-project.supabase.co',
    SUPABASE_ANON_KEY: 'anon-key-placeholder',
    OWNER_SUPABASE_USER_ID: 'owner-uuid-1111'
  };

  const guestJwtResult = await verifyOwnerAuthHeader('Bearer valid.but.wrong.user.jwt', {
    allowCronSecret: true,
    env,
    fetchImpl: mockGuestJwtFetch
  });
  assert.equal(guestJwtResult.authorized, false);
  assert.equal(guestJwtResult.status, 403);

  const app = await createApp({
    attachFrontend: false,
    verifyOwner: (header, opts) =>
      verifyOwnerAuthHeader(header, { ...opts, env, fetchImpl: mockGuestJwtFetch })
  });
  const server = app.listen(0);
  const port = (server.address() as AddressInfo).port;
  try {
    const refreshResp = await fetch(`http://127.0.0.1:${port}/api/daily-resources/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer valid.but.wrong.user.jwt'
      },
      body: JSON.stringify({ trackId: 'main', dayNumber: 1, role: 'owner' })
    });
    assert.equal(refreshResp.status, 403);

    const runResp = await fetch(`http://127.0.0.1:${port}/api/daily-resources/run-daily`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer valid.but.wrong.user.jwt'
      },
      body: JSON.stringify({ role: 'owner' })
    });
    assert.equal(runResp.status, 403);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test('4. Verified Owner JWT passes verification while pre-launch progress writes remain locked', async () => {
  const mockOwnerJwtFetch: typeof fetch = async () =>
    new Response(
      JSON.stringify({ id: 'owner-uuid-1111', email: 'owner@example.com' }),
      { status: 200 }
    );

  const env = {
    SUPABASE_URL: 'https://example-project.supabase.co',
    SUPABASE_ANON_KEY: 'anon-key-placeholder',
    OWNER_SUPABASE_USER_ID: 'owner-uuid-1111'
  };

  const ownerResult = await verifyOwnerAuthHeader('Bearer valid.owner.jwt', {
    allowCronSecret: false,
    env,
    fetchImpl: mockOwnerJwtFetch
  });
  assert.equal(ownerResult.authorized, true);
  assert.equal(ownerResult.status, 200);
  assert.equal(ownerResult.authMethod, 'owner_jwt');
  assert.equal(ownerResult.userId, 'owner-uuid-1111');

  const prevVercel = process.env.VERCEL;
  process.env.VERCEL = '1';
  const app = await createApp({
    attachFrontend: false,
    verifyOwner: (header, opts) =>
      verifyOwnerAuthHeader(header, { ...opts, env, fetchImpl: mockOwnerJwtFetch })
  });
  const server = app.listen(0);
  const port = (server.address() as AddressInfo).port;
  try {
    const refreshResp = await fetch(`http://127.0.0.1:${port}/api/daily-resources/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer valid.owner.jwt'
      },
      body: JSON.stringify({ trackId: 'main', dayNumber: 1 })
    });
    assert.equal(refreshResp.status, 403, 'Owner refresh remains locked until the approved Day 1 launch.');
    const body = (await refreshResp.json()) as { error: string };
    assert.match(body.error, /locked until its scheduled IST unlock date/i);
  } finally {
    if (prevVercel === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = prevVercel;
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

// ============================================================================
// 5–6. EDGE FUNCTION CRON_SECRET FAIL-CLOSED SECURITY
// ============================================================================
test('5. Missing CRON_SECRET causes Edge Function auth check to fail closed (500)', () => {
  const missingEmpty = verifyCronRequest('Bearer anything', '');
  assert.equal(missingEmpty.authorized, false);
  assert.equal(missingEmpty.status, 500);

  const missingUndefined = verifyCronRequest(null, undefined);
  assert.equal(missingUndefined.authorized, false);
  assert.equal(missingUndefined.status, 500);
});

test('6. Incorrect CRON_SECRET is rejected (401) and matching CRON_SECRET passes (200)', () => {
  const wrongSecret = verifyCronRequest('Bearer wrong-cron-secret', 'super-secret-cron-value');
  assert.equal(wrongSecret.authorized, false);
  assert.equal(wrongSecret.status, 401);

  const missingHeader = verifyCronRequest(null, 'super-secret-cron-value');
  assert.equal(missingHeader.authorized, false);
  assert.equal(missingHeader.status, 401);

  const validSecret = verifyCronRequest('Bearer super-secret-cron-value', 'super-secret-cron-value');
  assert.equal(validSecret.authorized, true);
  assert.equal(validSecret.status, 200);
});

// ============================================================================
// 7–10. STORAGE KEYS, CREDENTIAL HYGIENE, CONFLICT MERGE, GUEST ISOLATION
// ============================================================================
test('7. Storage keys preserved, no plaintext passwords in code, and verifier hashes work', async () => {
  assert.equal(OWNER_STORAGE_KEY, 'steeven_180day_prep_owner_permanent_v3');
  assert.equal(GUEST_STORAGE_KEY, 'steeven_180day_prep_guest_sandbox_v3');
  assert.equal(SHARED_CONTENT_STORAGE_KEY, 'steeven_180day_shared_owner_content_v1');
  assert.equal(DEFAULT_OWNER_STATE.passwordHash, '');
  assert.equal(DEFAULT_GUEST_STATE.passwordHash, '');

  // Verify one-way verifier hashing & constant-time compare without embedding credentials in tests
  const sampleVerifier = await computeOwnerTransitionVerifier('sample-ephemeral-test-secret');
  assert.equal(await verifyOwnerTransitionPassword('sample-ephemeral-test-secret', sampleVerifier), true);
  assert.equal(await verifyOwnerTransitionPassword('wrong-owner-pass', sampleVerifier), false);
  assert.equal(await verifyGuestLocalPassword('wrong-guest-pass'), false);
  assert.equal(constantTimeEqual('abc', 'abc'), true);
  assert.equal(constantTimeEqual('abc', 'abd'), false);

  // Static safety check: ensure no legacy plaintext credentials exist anywhere in src/ or server/
  const filesToScan = [
    'src/services/storage.ts',
    'src/services/cloudProgress.ts',
    'src/context/AppContext.tsx',
    'src/utils/authCrypto.ts',
    'server/auth.ts',
    'server.ts'
  ];
  for (const rel of filesToScan) {
    const content = fs.readFileSync(path.resolve(process.cwd(), rel), 'utf8');
    assert.equal(content.includes('Steeven@2026'), false, `Plaintext secret leaked in ${rel}`);
    assert.equal(content.includes('Steeven2026'), false, `Plaintext secret leaked in ${rel}`);
  }
});

test('8. Newer local Owner progress is never overwritten by older cloud state and sensitive fields are stripped', () => {
  const local = cloneOwnerState();
  local.lastSavedTimestamp = '2026-11-18T12:00:00.000Z';
  local.completedTasks['1_t1'] = true;
  local.dayNotes[1] = 'Newer local note';
  local.dsaProgress.completedTasks['1_obj'] = true;
  local.azureProgress.dayNotes[1] = 'Azure local note';

  const cloudOlder = cloneOwnerState();
  cloudOlder.lastSavedTimestamp = '2026-11-18T08:00:00.000Z';
  cloudOlder.completedTasks['1_t1'] = false;
  cloudOlder.dayNotes[1] = 'Older cloud note';
  cloudOlder.dsaProgress.completedTasks['1_obj'] = false;
  cloudOlder.completedTasks['2_t1'] = true;

  const { merged, conflictDetected } = mergeOwnerStatesSafely(local, cloudOlder);
  assert.equal(conflictDetected, true);
  // Newer local timestamp preserves local edits while keeping union of cloud progress
  assert.equal(merged.completedTasks['1_t1'], true);
  assert.equal(merged.completedTasks['2_t1'], true);
  assert.equal(merged.dayNotes[1], 'Newer local note');
  assert.equal(merged.dsaProgress.completedTasks['1_obj'], true);
  assert.equal(merged.azureProgress.dayNotes[1], 'Azure local note');
  assert.equal(merged.passwordHash, '');

  // Ensure cloud export strips inline base64 PDFs, passwordHash, and authVerifier
  local.passwordHash = 'should-be-stripped';
  local.authVerifier = 'should-be-stripped';
  local.uploadedPdfs = [
    {
      id: 'pdf-inline',
      filename: 'test.pdf',
      fileSize: 100,
      fileSizeBytesFormatted: '100 B',
      uploadTimestamp: '2026-11-17T00:00:00Z',
      ownerId: 'owner',
      storagePath: 'local-upload/test.pdf',
      fileUrl: 'data:application/pdf;base64,JVBERi0xLjQ=',
      version: 1,
      isActiveRoadmap: false
    }
  ];
  const cloudSafe = getSafeCloudState(local);
  assert.equal('passwordHash' in cloudSafe, false);
  assert.equal('authVerifier' in cloudSafe, false);
  assert.equal(cloudSafe.uploadedPdfs[0].fileUrl, '');
});

test('9. Guest data can never enter Owner cloud storage', async () => {
  const guestState = cloneGuestState();
  assert.throws(() => getSafeCloudState(guestState), /Guest isolation policy/i);

  await assert.rejects(
    () => saveOwnerProgressToCloud('owner-uuid', guestState),
    /Guest isolation policy/i
  );

  await assert.rejects(
    () => loadOrMigrateOwnerProgress('owner-uuid', guestState),
    /Guest isolation policy/i
  );
});

test('10. Main (180d), DSA (100d), and Azure (100d) progress structures remain independent and compatible', () => {
  const state = cloneOwnerState();
  state.completedDays[1] = true;
  state.dsaProgress.completedDays[1] = false;
  state.azureProgress.completedDays[1] = true;
  state.dsaProgress.studyTimeSeconds[2] = 5400;
  state.azureProgress.studyTimeSeconds[2] = 3600;

  assert.equal(state.completedDays[1], true);
  assert.equal(state.dsaProgress.completedDays[1], false);
  assert.equal(state.azureProgress.completedDays[1], true);
  assert.equal(state.dsaProgress.studyTimeSeconds[2], 5400);
  assert.equal(state.azureProgress.studyTimeSeconds[2], 3600);
});

// ============================================================================
// 11–13. IST DATE LOCKS, CURRICULUM PARITY, LEETCODE TRIPLET & ROUTE LOCKS
// ============================================================================
test('11. IST day locks and 26-week assessment locks remain strictly enforced', async () => {
  const beforeStartMs = new Date('2026-11-15T23:59:59+05:30').getTime();
  const day1Ms = new Date('2026-11-16T00:00:00+05:30').getTime();
  const day2Ms = new Date('2026-11-17T00:00:00+05:30').getTime();

  assert.equal(isDayUnlockedByIstClock(1, beforeStartMs, 180), false);
  assert.equal(isDayUnlockedByIstClock(1, day1Ms, 180), true);
  assert.equal(isDayUnlockedByIstClock(2, day1Ms, 180), false);
  assert.equal(isDayUnlockedByIstClock(2, day2Ms, 180), true);
  assert.equal(isTrackDayCurrentlyUnlockedCanonical('main', 180, day2Ms), false);
  assert.equal(isTrackDayCurrentlyUnlockedCanonical('dsa', 101, day2Ms), false);

  // Assessment Week 1 unlocks Day 6 (21 Nov 2026 00:00 IST)
  assert.equal(isAssessmentUnlockedByIstClock(1, day2Ms), false);
  assert.equal(getUnlockedAssessmentForWeek(1, day2Ms), null);
  const week1UnlockMs = new Date('2026-11-21T00:00:00+05:30').getTime();
  assert.equal(isAssessmentUnlockedByIstClock(1, week1UnlockMs), true);
  assert.ok(getUnlockedAssessmentForWeek(1, week1UnlockMs));

  // Verify HTTP GET /api/daily-resources returns 403 for locked future day
  const app = await createApp({ attachFrontend: false });
  const server = app.listen(0);
  const port = (server.address() as AddressInfo).port;
  try {
    const futureDayResp = await fetch(
      `http://127.0.0.1:${port}/api/daily-resources?track=main&day=180&role=guest`
    );
    assert.equal(futureDayResp.status, 403);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test('12. Existing curriculum (180 Main, 100 DSA, 100 Azure, 26 Assessments) preserved with 100% catalog parity', () => {
  assert.equal(ALL_180_DAYS.length, 180);
  assert.equal(DSA_100_DAYS.length, 100);
  assert.equal(AZURE_100_DAYS.length, 100);
  assert.equal(WEEKLY_ASSESSMENTS.length, 26);

  assert.equal(MAIN_CURRICULUM_CONTEXTS.length, 180);
  assert.equal(DSA_CURRICULUM_CONTEXTS.length, 100);
  assert.equal(AZURE_CURRICULUM_CONTEXTS.length, 100);

  // Spot check day alignment between src/data/* and Edge/server shared catalogData.ts
  for (let i = 0; i < 180; i += 1) {
    assert.equal(MAIN_CURRICULUM_CONTEXTS[i].topic, ALL_180_DAYS[i].topic);
    assert.equal(MAIN_CURRICULUM_CONTEXTS[i].isoDate, ALL_180_DAYS[i].isoDate);
  }
  for (let i = 0; i < 100; i += 1) {
    assert.equal(DSA_CURRICULUM_CONTEXTS[i].topic, DSA_100_DAYS[i].topic);
    assert.equal(AZURE_CURRICULUM_CONTEXTS[i].topic, AZURE_100_DAYS[i].topic);
  }
});

test('13. DSA LeetCode triplet always has 3 ordered slots (Easy, Medium, Hard) and Main/Azure never get LeetCode', () => {
  for (let d = 1; d <= 100; d += 1) {
    const raw = getSharedDsaDailyLeetCodeTriplet(d);
    assert.equal(raw.length, 3);
    assert.equal(raw[0].difficulty, 'Easy');
    assert.equal(raw[1].difficulty, 'Medium');
    assert.equal(raw[2].difficulty, 'Hard');

    const validation = validateDsaLeetCodeTriplet(raw);
    if (d === 1) {
      assert.equal(raw[2].available, false);
      assert.ok(raw[2].whyUnavailable && raw[2].whyUnavailable.length > 10);
    } else {
      assert.equal(validation.questions.length, 3);
    }
  }

  const mainBrief = buildDeterministicReadOnlyTrack('main', 1, {});
  const azureBrief = buildDeterministicReadOnlyTrack('azure', 1, {});
  assert.equal(mainBrief?.leetcodeQuestions.length, 0);
  assert.equal(azureBrief?.leetcodeQuestions.length, 0);
});

// ============================================================================
// 14. ROADMAP PDF VIEWER & MAGIC HEADER VALIDATION REMAINS FUNCTIONAL
// ============================================================================
test('14. PDF magic-header validation and Roadmap PDF URL resolution remain functional', async () => {
  const validPdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]); // %PDF-1.7
  const invalidHtmlBytes = new Uint8Array([0x3c, 0x21, 0x44, 0x4f, 0x43, 0x54]); // <!DOCT
  assert.equal(hasPdfMagicHeader(validPdfBytes), true);
  assert.equal(hasPdfMagicHeader(invalidHtmlBytes), false);

  const localBundledUrl = await getRoadmapPdfUrl({
    id: 'default-roadmap',
    filename: 'Master_Plan.pdf',
    fileSize: 1024,
    fileSizeBytesFormatted: '1 KB',
    uploadTimestamp: '2026-11-16T00:00:00Z',
    ownerId: 'owner',
    storagePath: '/roadmap-default.pdf',
    fileUrl: '/roadmap-default.pdf',
    version: 1,
    isActiveRoadmap: true
  });
  assert.equal(localBundledUrl, '/roadmap-default.pdf');

  const inlineDataUrl = await getRoadmapPdfUrl({
    id: 'inline-pdf',
    filename: 'Notes.pdf',
    fileSize: 1024,
    fileSizeBytesFormatted: '1 KB',
    uploadTimestamp: '2026-11-16T00:00:00Z',
    ownerId: 'owner',
    storagePath: 'local-upload/Notes.pdf',
    fileUrl: 'data:application/pdf;base64,JVBERi0xLjQ=',
    version: 1,
    isActiveRoadmap: false
  });
  assert.equal(inlineDataUrl, 'data:application/pdf;base64,JVBERi0xLjQ=');

  // Verify IST snapshot sanity
  const snap = getIstScheduleSnapshotCanonical(new Date('2026-11-17T10:00:00+05:30').getTime(), LEGACY_GUEST_START_DATE_IST);
  assert.equal(snap.istDate, '2026-11-17');
  assert.equal(snap.istHour, 10);
  assert.equal(snap.unlockedDays.main, 2);
});
