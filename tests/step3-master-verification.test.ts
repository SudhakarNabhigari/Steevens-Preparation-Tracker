import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import type { AddressInfo } from 'node:net';

import {
  buildSupabaseRestHeaders,
  classifySupabaseKeyFormat,
  EXPECTED_SUPABASE_URL,
  validateSupabaseEnvironment
} from '../server/supabaseConfig.ts';
import {
  generateGroundedDailyBrief,
  type GeminiClientLike
} from '../server/geminiService.ts';
import {
  buildActualScheduleMeta,
  buildCombinedActionPlan,
  buildDailyEmailContent,
  buildDeterministicReadOnlyTrack,
  buildSupabaseRestHeadersCanonical,
  discoverYouTubeTutorials,
  FREE_TIER_GEMINI_MODEL,
  LEGACY_GUEST_START_DATE_IST,
  generateGroundedDailyBrief as generateEdgeGeminiBrief,
  generateTrackDailyCanonical,
  getIstScheduleSnapshotCanonical,
  isValidHttpsUrl,
  syncTrackResourcesToSupabase,
  type CanonicalDailyDashboardPayload,
  type PipelineEnvConfig
} from '../supabase/functions/daily-learning-resources/pipeline.ts';
import { getSharedCurriculumDayContext } from '../supabase/functions/daily-learning-resources/catalogData.ts';
import { createApp } from '../server.ts';

function makeJwtWithRole(role: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ role, iss: 'supabase' })).toString('base64url');
  return `${header}.${payload}.fakesignature`;
}

// ============================================================================
// STAGE 1 & 2: SUPABASE KEY FORMATS, CRON STRENGTH & MIGRATION PARITY
// ============================================================================
test('Stage 1 & 2: Supports sb_publishable_/sb_secret_ + legacy JWT keys, blocks weak CRON_SECRET and sb_secret_ on frontend', () => {
  assert.equal(classifySupabaseKeyFormat('sb_secret_test_123456'), 'sb_secret');
  assert.equal(classifySupabaseKeyFormat('sb_publishable_test_123456'), 'sb_publishable');
  assert.equal(classifySupabaseKeyFormat(makeJwtWithRole('anon')), 'jwt_anon');
  assert.equal(classifySupabaseKeyFormat(makeJwtWithRole('service_role')), 'jwt_service_role');

  // sb_secret_ must NEVER send Authorization: Bearer <non-jwt>, only apikey
  const secretHeaders = buildSupabaseRestHeaders('sb_secret_example_key', { Prefer: 'return=minimal' });
  assert.equal(secretHeaders.apikey, 'sb_secret_example_key');
  assert.equal('Authorization' in secretHeaders, false);

  const canonicalSecretHeaders = buildSupabaseRestHeadersCanonical('sb_secret_example_key');
  assert.equal(canonicalSecretHeaders.apikey, 'sb_secret_example_key');
  assert.equal('Authorization' in canonicalSecretHeaders, false);

  // Legacy service_role JWT sends both apikey and Authorization: Bearer
  const legacyJwt = makeJwtWithRole('service_role');
  const jwtHeaders = buildSupabaseRestHeaders(legacyJwt);
  assert.equal(jwtHeaders.apikey, legacyJwt);
  assert.equal(jwtHeaders.Authorization, `Bearer ${legacyJwt}`);

  // Validation rejects sb_secret_ in VITE_SUPABASE_ANON_KEY and warns on weak CRON_SECRET
  const leakedClientReport = validateSupabaseEnvironment({
    VITE_SUPABASE_URL: EXPECTED_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: 'sb_secret_should_never_be_in_vite',
    SUPABASE_URL: EXPECTED_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: 'sb_secret_valid_server_key',
    OWNER_SUPABASE_USER_ID: '11111111-1111-1111-1111-111111111111',
    CRON_SECRET: 'too-short'
  });
  assert.equal(leakedClientReport.frontendKeyIsPublicSafe, false);
  assert.equal(leakedClientReport.isClientReady, false);
  assert.equal(leakedClientReport.isServerDbReady, true);
  assert.equal(leakedClientReport.cronSecretStrong, false);
  assert.equal(leakedClientReport.isAutomationReady, false);

  // Check strict single-Owner RLS migration SQL (20261118)
  const rlsSql = fs.readFileSync(
    path.resolve(process.cwd(), 'supabase/migrations/20261118_strict_owner_rls_and_rich_briefs.sql'),
    'utf8'
  ).toLowerCase();
  assert.ok(rlsSql.includes('app_owner_registry'));
  assert.ok(rlsSql.includes('is_strict_steeven_owner'));
  assert.ok(rlsSql.includes('practical_examples'));
  assert.ok(rlsSql.includes('thumbnail_url'));
  assert.equal(/\bdrop\s+table\b/i.test(rlsSql), false);
});

test('Stage 2: syncTrackResourcesToSupabase works with sb_secret_ and falls back cleanly if 20261118 columns are absent', async () => {
  let sawBriefFallback = false;
  let sawResourceFallback = false;
  const seenAuthHeaders: (string | null)[] = [];

  const mockFetch: typeof fetch = async (input, init) => {
    const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const headers = new Headers(init?.headers || {});
    seenAuthHeaders.push(headers.get('Authorization'));
    assert.equal(headers.get('apikey'), 'sb_secret_test_key_only');

    const bodyText = String(init?.body || '[]');
    if (urlStr.includes('/rest/v1/daily_learning_briefs')) {
      if (bodyText.includes('practical_examples')) {
        sawBriefFallback = true;
        return new Response(JSON.stringify({ code: 'PGRST204', message: 'column practical_examples not found' }), {
          status: 400
        });
      }
      return new Response(null, { status: 201 });
    }
    if (urlStr.includes('/rest/v1/daily_learning_resources')) {
      if (bodyText.includes('thumbnail_url')) {
        sawResourceFallback = true;
        return new Response(JSON.stringify({ code: 'PGRST204', message: 'column thumbnail_url not found' }), {
          status: 400
        });
      }
      return new Response(null, { status: 201 });
    }
    return new Response(null, { status: 404 });
  };

  const track = buildDeterministicReadOnlyTrack('dsa', 1, {});
  assert.ok(track);
  const ok = await syncTrackResourcesToSupabase(track, {
    supabaseUrl: EXPECTED_SUPABASE_URL,
    supabaseServiceRoleKey: 'sb_secret_test_key_only',
    ownerUserId: '11111111-1111-1111-1111-111111111111',
    fetchImpl: mockFetch
  });
  assert.equal(ok, true);
  assert.equal(sawBriefFallback, true);
  assert.equal(sawResourceFallback, true);
  assert.ok(seenAuthHeaders.every((h) => h === null), 'sb_secret_ must never send Authorization: Bearer');
});

// ============================================================================
// STAGE 4: SERVER-SIDE @google/genai SDK & ERROR CLASSIFICATION
// ============================================================================
test('Stage 4: server/geminiService.ts uses gemini-4-hydrogen, classifies invalid/disabled/quota errors, and retries transient 5xx', async () => {
  const ctx = getSharedCurriculumDayContext('dsa', 1);
  assert.ok(ctx);

  // 1. Missing PREPARATION_GEMINI_KEY fails explicitly without using reserved GEMINI_API_KEY
  const prevPrepKey = process.env.PREPARATION_GEMINI_KEY;
  const prevReservedKey = process.env.GEMINI_API_KEY;
  delete process.env.PREPARATION_GEMINI_KEY;
  process.env.GEMINI_API_KEY = 'reserved-key-must-be-ignored';
  try {
    const missing = await generateGroundedDailyBrief(ctx, [], [], []);
    assert.equal(missing.success, false);
    assert.equal(missing.aiProviderStatus, 'missing_api_key');
    assert.ok(missing.errorMessage?.includes('PREPARATION_GEMINI_KEY'));
  } finally {
    if (prevPrepKey !== undefined) process.env.PREPARATION_GEMINI_KEY = prevPrepKey;
    if (prevReservedKey !== undefined) process.env.GEMINI_API_KEY = prevReservedKey;
    else delete process.env.GEMINI_API_KEY;
  }

  // 2. Simulated 403 PERMISSION_DENIED -> invalid_api_key
  const invalidClient: GeminiClientLike = {
    models: {
      generateContent: async () => {
        const err = new Error('PERMISSION_DENIED: API key not valid') as Error & { status: number };
        err.status = 403;
        throw err;
      }
    }
  };
  const invalidRes = await generateGroundedDailyBrief(ctx, [], [], [], 'fake-invalid-key', invalidClient);
  assert.equal(invalidRes.success, false);
  assert.equal(invalidRes.aiProviderStatus, 'invalid_api_key');

  // 3. Simulated 429 RESOURCE_EXHAUSTED -> quota_exhausted_cached
  let quotaCalls = 0;
  const quotaClient: GeminiClientLike = {
    models: {
      generateContent: async () => {
        quotaCalls += 1;
        const err = new Error('RESOURCE_EXHAUSTED: Quota exceeded') as Error & {
          status: number;
          response?: { headers: Headers };
        };
        err.status = 429;
        err.response = {
          headers: new Headers({ 'retry-after': '0' })
        };
        throw err;
      }
    }
  };
  const quotaRes = await generateGroundedDailyBrief(ctx, [], [], [], 'fake-quota-key', quotaClient);
  assert.equal(quotaRes.success, false);
  assert.equal(quotaRes.aiProviderStatus, 'quota_exhausted_cached');
  assert.equal(quotaCalls, 1, 'Hard quota exhaustion must not be retried, even with Retry-After.');

  // 4. Simulated transient 503 followed by valid JSON from gemini-4-hydrogen
  let calls = 0;
  let capturedModel = '';
  const retryingClient: GeminiClientLike = {
    models: {
      generateContent: async (params) => {
        calls += 1;
        capturedModel = params.model;
        if (calls === 1) {
          const err = new Error('Service temporarily unavailable (503)') as Error & { status: number };
          err.status = 503;
          throw err;
        }
        return {
          text: JSON.stringify({
            topicExplanation: 'Master C++ pointers, references, and Big-O basics.',
            learningObjectives: ['Understand O(1) vs O(N)'],
            practicalExamples: ['int x = 10; int& ref = x; // O(1) reference'],
            revisionNotes: ['Check compiler warnings with -Wall -Wextra'],
            commonMistakes: ['Returning a reference to a local stack variable'],
            suggestedLearningOrder: ['Docs', 'YouTube', 'C++ Practice'],
            dailyGuidance: 'Complete Day 1 C++ setup.',
            practicalExerciseSummary: 'Compile & test Big-O snippet.',
            youtubeAnnotations: []
          })
        };
      }
    }
  };
  const okRes = await generateGroundedDailyBrief(ctx, [], [], [], 'fake-working-key', retryingClient);
  assert.equal(calls, 2);
  assert.equal(capturedModel, FREE_TIER_GEMINI_MODEL);
  assert.equal(okRes.success, true);
  assert.equal(okRes.aiProviderStatus, 'gemini_generated');
  assert.ok(okRes.data?.practicalExamples[0].includes('int& ref'));
});

test('Gemini Edge request retries temporary statuses, defers long Retry-After, and shares key/model across tracks', async () => {
  const originalFetch = globalThis.fetch;
  const originalWarn = console.warn;
  const originalInfo = console.info;
  console.warn = () => {};
  console.info = () => {};
  const fakeKey = 'test-only-edge-key';
  const validOutput = JSON.stringify({
    topicExplanation: 'Grounded explanation', learningObjectives: ['Objective'],
    practicalExamples: ['Example'], revisionNotes: ['Note'], commonMistakes: ['Mistake'],
    suggestedLearningOrder: ['Docs'], dailyGuidance: 'Guidance',
    practicalExerciseSummary: 'Exercise', youtubeAnnotations: []
  });
  try {
    const ctxs = ['main', 'dsa', 'azure'].map((track) => getSharedCurriculumDayContext(track as 'main' | 'dsa' | 'azure', 1));
    assert.ok(ctxs.every(Boolean));
    for (const status of [429, 502, 503, 504]) {
      let calls = 0;
      let requestUrl = '';
      globalThis.fetch = async (input) => {
        calls += 1;
        requestUrl = String(input);
        if (calls === 1) {
          return new Response(JSON.stringify({ error: { message: 'Temporary upstream failure' } }), {
            status, headers: { 'Retry-After': '0' }
          });
        }
        return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: validOutput }] } }] }));
      };
      const result = await generateEdgeGeminiBrief(ctxs[0]!, [], [], [], fakeKey);
      assert.equal(result.success, true, `HTTP ${status} should retry a temporary response.`);
      assert.equal(calls, 2);
      const parsedUrl = new URL(requestUrl);
      assert.equal(parsedUrl.pathname, `/v1beta/models/${FREE_TIER_GEMINI_MODEL}:generateContent`);
      assert.equal(parsedUrl.searchParams.get('key'), fakeKey);
    }

    // Same configured argument and model are used for each independent track.
    for (const ctx of ctxs) {
      let requestUrl = '';
      globalThis.fetch = async (input) => {
        requestUrl = String(input);
        return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: validOutput }] } }] }));
      };
      const result = await generateEdgeGeminiBrief(ctx!, [], [], [], fakeKey);
      assert.equal(result.modelUsed, FREE_TIER_GEMINI_MODEL);
      const parsedUrl = new URL(requestUrl);
      assert.equal(parsedUrl.searchParams.get('key'), fakeKey);
      assert.equal(parsedUrl.pathname, `/v1beta/models/${FREE_TIER_GEMINI_MODEL}:generateContent`);
    }

    let quotaCalls = 0;
    globalThis.fetch = async () => {
      quotaCalls += 1;
      return new Response(JSON.stringify({ error: { message: 'Daily quota exceeded' } }), {
        status: 429, headers: { 'Retry-After': '0' }
      });
    };
    const quotaResult = await generateEdgeGeminiBrief(ctxs[1]!, [], [], [], fakeKey);
    assert.equal(quotaResult.aiProviderStatus, 'quota_exhausted_cached');
    assert.equal(quotaCalls, 1, 'Explicit quota exhaustion must not be retried.');

    let deferredCalls = 0;
    globalThis.fetch = async () => {
      deferredCalls += 1;
      return new Response(JSON.stringify({ error: { message: 'Temporary upstream failure' } }), {
        status: 503, headers: { 'Retry-After': '9' }
      });
    };
    const deferredResult = await generateEdgeGeminiBrief(ctxs[2]!, [], [], [], fakeKey);
    assert.equal(deferredResult.aiProviderStatus, 'unavailable');
    assert.equal(deferredCalls, 1, 'Do not retry before a Retry-After delay outside the bounded wait budget.');
  } finally {
    globalThis.fetch = originalFetch;
    console.warn = originalWarn;
    console.info = originalInfo;
  }
});

// ============================================================================
// STAGE 3 & 5: SYLLABUS PARITY (DAY 1 vs DAY 2) & YOUTUBE DEDUPLICATION + CACHING
// ============================================================================
test('Stage 3 & 5: Main, DSA, and Azure Day 1 vs Day 2 schedules, C++ examples, Azure docs, and YouTube dedup/cache', async () => {
  const mainD1 = buildDeterministicReadOnlyTrack('main', 1, {});
  const mainD2 = buildDeterministicReadOnlyTrack('main', 2, {});
  const dsaD1 = buildDeterministicReadOnlyTrack('dsa', 1, {});
  const dsaD2 = buildDeterministicReadOnlyTrack('dsa', 2, {});
  const azureD1 = buildDeterministicReadOnlyTrack('azure', 1, {});
  const azureD2 = buildDeterministicReadOnlyTrack('azure', 2, {});

  assert.ok(mainD1 && mainD2 && dsaD1 && dsaD2 && azureD1 && azureD2);
  assert.notEqual(mainD1.topicTitle, mainD2.topicTitle);
  assert.notEqual(dsaD1.topicTitle, dsaD2.topicTitle);
  assert.notEqual(azureD1.topicTitle, azureD2.topicTitle);

  assert.equal(mainD1.scheduleTarget, '4 Hours (240 Mins)');
  assert.equal(dsaD1.scheduleTarget, '90 Minutes');
  assert.equal(azureD1.scheduleTarget, '60 Minutes');

  // Saturday vs weekday schedule target verification on Main
  const satCtx = getSharedCurriculumDayContext('main', 6); // 21 Nov 2026 (Saturday)
  assert.ok(satCtx);
  assert.equal(satCtx.dayOfWeek, 'Saturday');
  assert.equal(buildActualScheduleMeta(satCtx).scheduleTarget, '3h Prep + 3h Weekly Exam');

  // Azure docs use learn.microsoft.com and never misclassify AZ-900 Day 3 (hybrid cloud) or Day 11 (storage) into AI Search
  assert.ok(azureD1.officialDocs.every((d) => d.url?.startsWith('https://learn.microsoft.com/')));
  const azureD3 = buildDeterministicReadOnlyTrack('azure', 3, {});
  const azureD11 = buildDeterministicReadOnlyTrack('azure', 11, {});
  const azureD58 = buildDeterministicReadOnlyTrack('azure', 58, {});
  assert.ok(azureD3 && azureD11 && azureD58);
  assert.ok(azureD3.officialDocs.some((d) => d.url?.includes('describe-cloud-concepts')));
  assert.equal(azureD3.officialDocs.some((d) => d.url?.includes('/azure/search/')), false);
  assert.equal(azureD11.officialDocs.some((d) => d.url?.includes('/azure/search/')), false);
  assert.ok(azureD58.officialDocs.some((d) => d.url?.includes('/azure/search/')));

  // DSA Day 2 has 3 available verified LeetCode URLs (Easy/Medium/Hard)
  assert.equal(dsaD2.leetcodeQuestions.length, 3);
  assert.ok(dsaD2.leetcodeQuestions.every((q) => q.available && isValidHttpsUrl(q.url)));

  // YouTube deduplication + thumbnail verification with mocked fetch
  const origFetch = globalThis.fetch;
  let searchCount = 0;
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    if (urlStr.includes('googleapis.com/youtube/v3/search')) {
      searchCount += 1;
      return new Response(
        JSON.stringify({
          items: [
            { id: { videoId: 'abc123def45' } },
            { id: { videoId: 'abc123def45' } }, // duplicate candidate
            { id: { videoId: 'xyz987uvw12' } }
          ]
        }),
        { status: 200 }
      );
    }
    if (urlStr.includes('googleapis.com/youtube/v3/videos')) {
      return new Response(
        JSON.stringify({
          items: [
            {
              id: 'abc123def45',
              snippet: {
                title: 'C++ compiler setup and first program: Hello World',
                channelTitle: 'TakeUForward',
                channelId: 'UCJskGeByzRRSvmOyZOz61ig',
                description: 'Complete C++ intro',
                thumbnails: { medium: { url: 'https://i.ytimg.com/vi/abc123def45/mqdefault.jpg' } }
              },
              contentDetails: { duration: 'PT24M10S' },
              status: { privacyStatus: 'public' }
            },
            {
              id: 'xyz987uvw12',
              snippet: {
                title: 'C++ setup and first program with compiler walkthrough',
                channelTitle: 'Code With Swaroop',
                channelId: 'UCfIrO-HaaLeXBL46Jug242g',
                description: 'Big-O analysis examples',
                thumbnails: { medium: { url: 'https://i.ytimg.com/vi/xyz987uvw12/mqdefault.jpg' } }
              },
              contentDetails: { duration: 'PT18M05S' },
              status: { privacyStatus: 'public' }
            }
          ]
        }),
        { status: 200 }
      );
    }
    return new Response(null, { status: 404 });
  }) as typeof fetch;

  try {
    const dsaCtx = getSharedCurriculumDayContext('dsa', 1)!;
    const ytRes = await discoverYouTubeTutorials(dsaCtx, 'fake-yt-api-key');
    assert.equal(ytRes.providerStatus, 'youtube_api_verified');
    assert.equal(ytRes.tutorials.length, 2);
    assert.equal(new Set(ytRes.tutorials.map((t) => t.videoId)).size, 2);
    assert.ok(ytRes.tutorials.every((t) => isValidHttpsUrl(t.thumbnailUrl)));

    // Caching avoids regenerating already-verified AI+YT resource without forceRefresh
    const cachedTrack = await generateTrackDailyCanonical(
      'dsa',
      1,
      {
        geminiApiKey: 'fake-gemini',
        youtubeApiKey: 'fake-yt',
        geminiCaller: async () => ({
          success: true,
          aiProviderStatus: 'gemini_generated',
          modelUsed: FREE_TIER_GEMINI_MODEL,
          data: {
            topicExplanation: 'Fresh',
            learningObjectives: ['Obj'],
            practicalExamples: ['Ex'],
            revisionNotes: ['Rev'],
            commonMistakes: ['Mis'],
            suggestedLearningOrder: ['Step'],
            dailyGuidance: 'Guide',
            practicalExerciseSummary: 'Summary',
            youtubeAnnotations: []
          }
        })
      },
      {
        forceRefresh: false,
        skipExternalNetworkChecks: true,
        scheduleStartIsoIst: LEGACY_GUEST_START_DATE_IST,
        existingCached: {
          ...dsaD1,
          aiProviderStatus: 'gemini_generated',
          youtubeProviderStatus: 'youtube_api_verified',
          youtubeTutorials: ytRes.tutorials,
          updatedAt: new Date().toISOString()
        }
      }
    );
    assert.equal(cachedTrack.status, 'cached');
    assert.equal(searchCount, 6, 'Should query the six approved channels once and reuse the verified cache');
  } finally {
    globalThis.fetch = origFetch;
  }
});

// ============================================================================
// STAGE 6: EMAIL TEMPLATE DESIGN PARITY + /api/daily-resources/email-preview
// ============================================================================
test('Stage 6: Renders branded Main/DSA/Azure/Combined emails + serves read-only GET /api/daily-resources/email-preview', async () => {
  const istSnapshot = getIstScheduleSnapshotCanonical(new Date('2026-11-17T10:00:00+05:30').getTime());
  const buildDashForDays = (days: { main: number; dsa: number; azure: number }): CanonicalDailyDashboardPayload => {
    const main = buildDeterministicReadOnlyTrack('main', days.main, {});
    const dsa = buildDeterministicReadOnlyTrack('dsa', days.dsa, {});
    const azure = buildDeterministicReadOnlyTrack('azure', days.azure, {});
    return {
      istDate: istSnapshot.istDate,
      istDateLabel: istSnapshot.istDateLabel,
      isPreparationStarted: true,
      unlockedDays: days,
      tracks: { main, dsa, azure },
      automation: {
        scheduleLabel: '10:00 AM IST (Daily)',
        timezone: 'Asia/Kolkata',
        recipientEmail: 'mypreparation0111@gmail.com',
        lastRunDate: null,
        lastRunAt: null,
        overallStatus: 'not_run_yet',
        emailStatus: 'awaiting_credentials',
        missingSecrets: ['PREPARATION_GEMINI_KEY'],
        geminiConfigured: false,
        youtubeConfigured: false,
        resendConfigured: false,
        resendSenderConfigured: false,
        supabaseServerConfigured: false
      },
      actionPlan: buildCombinedActionPlan(main, dsa, azure)
    };
  };

  const day1Dash = buildDashForDays({ main: 1, dsa: 1, azure: 1 });
  const day2Dash = buildDashForDays({ main: 2, dsa: 2, azure: 2 });

  const mainDay1Email = buildDailyEmailContent(day1Dash, 'https://my-preparation.vercel.app', { track: 'main' });
  const mainDay2Email = buildDailyEmailContent(day2Dash, 'https://my-preparation.vercel.app', { track: 'main' });
  const dsaDay1Email = buildDailyEmailContent(day1Dash, 'https://my-preparation.vercel.app', { track: 'dsa' });
  const dsaDay2Email = buildDailyEmailContent(day2Dash, 'https://my-preparation.vercel.app', { track: 'dsa' });
  const azureDay1Email = buildDailyEmailContent(day1Dash, 'https://my-preparation.vercel.app', { track: 'azure' });
  const combinedEmail = buildDailyEmailContent(day2Dash, 'https://my-preparation.vercel.app');

  for (const email of [mainDay1Email, mainDay2Email, dsaDay1Email, dsaDay2Email, azureDay1Email, combinedEmail]) {
    assert.ok(email.html.includes('Steeven, Today You Have This Work! 🚀'));
    assert.ok(email.html.includes('#F3EFE6'));
    assert.ok(email.html.includes('#292929'));
    assert.ok(email.html.includes('#E7826D'));
    assert.ok(email.html.includes('@media only screen and (max-width: 640px)'));
    assert.ok(email.html.includes('https://my-preparation.vercel.app'));
    assert.equal(email.html.includes('javascript:'), false);
    // Unchecked checklist items by default (never falsely marked completed)
    assert.ok(email.html.includes('>☐</span>'));
    assert.equal(email.html.includes('>☑</span>'), false);
    assert.ok(email.text.includes('  [ ] '));
    assert.equal(email.text.includes('  [x] '), false);
  }

  // Single-track isolation checks
  assert.ok(mainDay1Email.html.includes('DAY 1'));
  assert.equal(mainDay1Email.html.includes("Today's LeetCode Practice"), false);
  assert.ok(dsaDay2Email.html.includes("Today's LeetCode Practice"));
  assert.ok(dsaDay2Email.html.includes('Easy'));
  assert.ok(dsaDay2Email.html.includes('Medium'));
  assert.ok(dsaDay2Email.html.includes('Hard'));
  assert.ok(azureDay1Email.html.includes('https://learn.microsoft.com/'));
  assert.equal(azureDay1Email.html.includes("Today's LeetCode Practice"), false);

  // Combined email contains all 3 tracks
  assert.ok(combinedEmail.html.includes("Today's Combined Study Sequence"));

  // Write local preview artifacts into the agent artifact directory
  const artifactDir = path.resolve('/.aistudio/artifacts/brain/f6191890-0e40-40ba-8b25-f509d2343241');
  if (fs.existsSync('/.aistudio/artifacts')) {
    fs.mkdirSync(artifactDir, { recursive: true });
    fs.writeFileSync(path.join(artifactDir, 'email_preview_main_day1.html'), mainDay1Email.html, 'utf8');
    fs.writeFileSync(path.join(artifactDir, 'email_preview_main_day2.html'), mainDay2Email.html, 'utf8');
    fs.writeFileSync(path.join(artifactDir, 'email_preview_dsa_day1.html'), dsaDay1Email.html, 'utf8');
    fs.writeFileSync(path.join(artifactDir, 'email_preview_azure_day1.html'), azureDay1Email.html, 'utf8');
  }

  // Verify Express GET /api/daily-resources/email-preview route (read-only + 403 future day lock)
  const app = await createApp({ attachFrontend: false });
  const server = app.listen(0);
  const port = (server.address() as AddressInfo).port;
  try {
    const previewDsa = await fetch(
      `http://127.0.0.1:${port}/api/daily-resources/email-preview?track=dsa&day=1`
    );
    assert.equal(previewDsa.status, 403, 'Owner Day 1 email preview remains locked until the relaunch date.');

    const badTrack = await fetch(
      `http://127.0.0.1:${port}/api/daily-resources/email-preview?track=invalid`
    );
    assert.equal(badTrack.status, 400);

    const lockedDay = await fetch(
      `http://127.0.0.1:${port}/api/daily-resources/email-preview?track=main&day=180`
    );
    assert.equal(lockedDay.status, 403);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
