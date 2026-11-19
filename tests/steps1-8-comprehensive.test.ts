import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import type { AddressInfo } from 'node:net';

import { createApp } from '../server.ts';
import healthHandler from '../api/health.ts';
import verifyOwnerHandler from '../api/auth/verify-owner.ts';
import { resolveAllowedOrigin } from '../server/httpCors.ts';
import {
  buildCombinedActionPlan,
  buildDailyEmailContent,
  buildDeterministicReadOnlyTrack,
  discoverYouTubeTutorials,
  FREE_TIER_GEMINI_MODEL,
  generateTrackDailyCanonical,
  getIstScheduleSnapshotCanonical,
  isValidHttpsUrl,
  sendDailyEmailViaResend,
  verifyCronRequest,
  type CanonicalDailyDashboardPayload
} from '../supabase/functions/daily-learning-resources/pipeline.ts';
import {
  AZURE_CURRICULUM_CONTEXTS,
  DSA_CURRICULUM_CONTEXTS,
  getSharedCurriculumDayContext,
  getSharedDsaDailyLeetCodeTriplet,
  getSharedOfficialDocs,
  MAIN_CURRICULUM_CONTEXTS
} from '../supabase/functions/daily-learning-resources/catalogData.ts';
import { ALL_180_DAYS } from '../src/data/syllabus.ts';
import { DSA_100_DAYS } from '../src/data/dsaSyllabus.ts';
import { AZURE_100_DAYS } from '../src/data/azureSyllabus.ts';
import { WEEKLY_ASSESSMENTS } from '../src/data/assessments.ts';
import {
  DEFAULT_GUEST_STATE,
  DEFAULT_OWNER_STATE,
  DEFAULT_SHARED_SETTINGS,
  applySharedContentToGuestState,
  mergeOwnerStatesSafely
} from '../src/services/storage.ts';
import {
  getSafeCloudState,
  loadOrMigrateOwnerProgress,
  saveOwnerProgressToCloud
} from '../src/services/cloudProgress.ts';
import {
  applyRubricSelfReviewToSubmission,
  createEvaluatedSubmission
} from '../src/utils/assessmentScoring.ts';
import {
  TOTAL_ASSESSMENT_WEEKS,
  getWeekUnlockIsoIst,
  isAssessmentUnlockedByIstClock
} from '../src/utils/assessmentLock.ts';
import {
  getDayUnlockIsoIst,
  getUnlockedDayCountByIstClock,
  isDayUnlockedByIstClock
} from '../src/utils/dailyLock.ts';
import { hasPdfMagicHeader, resolveRoadmapPdfBlob } from '../src/utils/pdfLoader.ts';
import type { UserState } from '../src/types/index.ts';

function cloneOwnerState(): UserState {
  return JSON.parse(JSON.stringify(DEFAULT_OWNER_STATE)) as UserState;
}

function cloneGuestState(): UserState {
  return JSON.parse(JSON.stringify(DEFAULT_GUEST_STATE)) as UserState;
}

// ============================================================================
// STEP 1: PROGRESS UNMARK PERSISTENCE, CLOUD MERGE & GUEST ISOLATION
// ============================================================================
test('Step 1: Unmarking tasks/days/AI resources in newer state persists across older cloud and older local merges', async () => {
  // Case A: Newer local state explicitly unmarks (false) a previously completed task while keeping untouched older completion
  const newerLocal = cloneOwnerState();
  newerLocal.lastSavedTimestamp = '2026-11-18T14:00:00.000Z';
  newerLocal.completedTasks['1_concept'] = false; // Explicitly unmarked locally
  newerLocal.completedDays[1] = false;
  newerLocal.dsaProgress.completedTasks['dsa_1_obj'] = false;
  newerLocal.azureProgress.completedDays[1] = false;
  newerLocal.dailyAiResourceCompletions = { yt_main_d1_1: false };

  const olderCloud = cloneOwnerState();
  olderCloud.lastSavedTimestamp = '2026-11-18T08:00:00.000Z';
  olderCloud.completedTasks['1_concept'] = true;
  olderCloud.completedTasks['2_concept'] = true; // Untouched in newerLocal
  olderCloud.completedDays[1] = true;
  olderCloud.completedDays[2] = true; // Untouched in newerLocal
  olderCloud.dsaProgress.completedTasks['dsa_1_obj'] = true;
  olderCloud.dsaProgress.completedTasks['dsa_2_obj'] = true; // Untouched in newerLocal
  olderCloud.azureProgress.completedDays[1] = true;
  olderCloud.dailyAiResourceCompletions = { yt_main_d1_1: true, ex_azure_d1: true };

  const resLocalNewer = mergeOwnerStatesSafely(newerLocal, olderCloud);
  assert.equal(resLocalNewer.resolution, 'local_newer');
  assert.equal(resLocalNewer.merged.completedTasks['1_concept'], false);
  assert.equal(resLocalNewer.merged.completedTasks['2_concept'], true);
  assert.equal(resLocalNewer.merged.completedDays[1], false);
  assert.equal(resLocalNewer.merged.completedDays[2], true);
  assert.equal(resLocalNewer.merged.dsaProgress.completedTasks['dsa_1_obj'], false);
  assert.equal(resLocalNewer.merged.dsaProgress.completedTasks['dsa_2_obj'], true);
  assert.equal(resLocalNewer.merged.azureProgress.completedDays[1], false);
  assert.equal(resLocalNewer.merged.dailyAiResourceCompletions?.yt_main_d1_1, false);
  assert.equal(resLocalNewer.merged.dailyAiResourceCompletions?.ex_azure_d1, true);

  // Case B: Newer cloud state explicitly unmarks (false) while older local state still has true
  const olderLocal = cloneOwnerState();
  olderLocal.lastSavedTimestamp = '2026-11-18T08:00:00.000Z';
  olderLocal.completedTasks['1_concept'] = true;
  olderLocal.completedTasks['2_practical'] = true;

  const newerCloud = cloneOwnerState();
  newerCloud.lastSavedTimestamp = '2026-11-18T16:00:00.000Z';
  newerCloud.completedTasks['1_concept'] = false;

  const resCloudNewer = mergeOwnerStatesSafely(olderLocal, newerCloud);
  assert.equal(resCloudNewer.resolution, 'cloud_newer');
  assert.equal(resCloudNewer.merged.completedTasks['1_concept'], false);
  assert.equal(resCloudNewer.merged.completedTasks['2_practical'], true);

  // Case C: Guest isolation guard against cloud export/sync
  const guest = cloneGuestState();
  assert.throws(() => getSafeCloudState(guest), /Guest isolation policy/i);
  await assert.rejects(() => saveOwnerProgressToCloud('owner-id', guest), /Guest isolation policy/i);
  await assert.rejects(() => loadOrMigrateOwnerProgress('owner-id', guest), /Guest isolation policy/i);
});

// ============================================================================
// STEP 2: YOUTUBE SEARCH+VIDEOS DISCOVERY, PRIVACY FILTERING & SECRET REDACTION
// ============================================================================
test('Step 2: YouTube discovery verifies public videos, strips private videos, redacts secrets on 400/403, and avoids redundant calls on cache hit', async () => {
  const ctx = getSharedCurriculumDayContext('dsa', 2);
  assert.ok(ctx);

  // 1. Missing API key returns labelled search fallback without inventing video IDs
  const noKey = await discoverYouTubeTutorials(ctx, '');
  assert.equal(noKey.providerStatus, 'search_fallback_no_key');
  assert.equal(noKey.tutorials.length, 3);
  assert.ok(noKey.tutorials.every((t) => !t.isVerifiedVideo && t.url.includes('youtube.com/results?search_query=')));

  // 2. Successful 2-step lookup filters private video and keeps verified metadata
  let fetchCount = 0;
  const okYouTubeFetch: typeof fetch = async (input) => {
    fetchCount += 1;
    const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    if (urlStr.includes('/youtube/v3/search')) {
      return new Response(
        JSON.stringify({
          items: [
            { id: { videoId: 'pub12345678' } },
            { id: { videoId: 'prv87654321' } },
            { id: { videoId: 'bad_short' } } // invalid <11 chars ignored
          ]
        }),
        { status: 200 }
      );
    }
    if (urlStr.includes('/youtube/v3/videos')) {
      return new Response(
        JSON.stringify({
          items: [
            {
              id: 'pub12345678',
              snippet: {
                title: 'C++ Arrays & Prefix Sum Full Tutorial',
                channelTitle: 'Striver C++',
                description: 'Detailed walkthrough of arrays and time complexity.',
                thumbnails: { high: { url: 'https://i.ytimg.com/vi/pub12345678/hqdefault.jpg' } }
              },
              contentDetails: { duration: 'PT1H02M05S' },
              status: { privacyStatus: 'public' }
            },
            {
              id: 'prv87654321',
              snippet: {
                title: 'Private Draft Video',
                channelTitle: 'HiddenChannel'
              },
              contentDetails: { duration: 'PT10M00S' },
              status: { privacyStatus: 'private' }
            }
          ]
        }),
        { status: 200 }
      );
    }
    return new Response(null, { status: 404 });
  };

  const verified = await discoverYouTubeTutorials(ctx, 'AIzaSyFakeSecretValueForTesting123456', okYouTubeFetch);
  assert.equal(fetchCount, 2);
  assert.equal(verified.providerStatus, 'youtube_api_verified');
  assert.equal(verified.tutorials.length, 1);
  assert.equal(verified.tutorials[0].videoId, 'pub12345678');
  assert.equal(verified.tutorials[0].duration, '1:02:05');
  assert.equal(verified.tutorials[0].isVerifiedVideo, true);

  // 3. HTTP 400/403 secret redaction in error statusNote
  const errYouTubeFetch: typeof fetch = async () =>
    new Response(
      JSON.stringify({
        error: {
          code: 400,
          message: 'API key not valid: AIzaSyLeakedSecretKeyValue1234567890 on key=AIzaSyLeakedSecretKeyValue1234567890',
          errors: [{ reason: 'badRequest' }]
        }
      }),
      { status: 400 }
    );
  const redactedFallback = await discoverYouTubeTutorials(ctx, 'AIzaSyLeakedSecretKeyValue1234567890', errYouTubeFetch);
  assert.equal(redactedFallback.providerStatus, 'search_fallback_quota');
  assert.equal(redactedFallback.statusNote.includes('AIzaSyLeakedSecret'), false);
  assert.ok(redactedFallback.statusNote.includes('[REDACTED]'));

  // 4. Network rejection fallback
  const throwFetch: typeof fetch = async () => {
    throw new Error('Request failed for key=AIzaSyThrownSecretKey123456789012');
  };
  const netFallback = await discoverYouTubeTutorials(ctx, 'AIzaSyThrownSecretKey123456789012', throwFetch);
  assert.equal(netFallback.providerStatus, 'search_fallback_quota');
  assert.equal(netFallback.statusNote.includes('AIzaSyThrownSecret'), false);

  // 5. Cache hit avoids external YouTube & Gemini requests
  let shouldNotCallYt = 0;
  let shouldNotCallGemini = 0;
  const day2Deterministic = buildDeterministicReadOnlyTrack('dsa', 2, {});
  assert.ok(day2Deterministic);
  const cachedResult = await generateTrackDailyCanonical(
    'dsa',
    2,
    {
      geminiApiKey: 'fake-gemini',
      youtubeApiKey: 'fake-yt',
      fetchImpl: async () => {
        shouldNotCallYt += 1;
        return new Response(null, { status: 500 });
      },
      geminiCaller: async () => {
        shouldNotCallGemini += 1;
        return { success: false, aiProviderStatus: 'unavailable' };
      }
    },
    {
      forceRefresh: false,
      skipExternalNetworkChecks: true,
      existingCached: {
        ...day2Deterministic,
        aiProviderStatus: 'gemini_generated',
        youtubeProviderStatus: 'youtube_api_verified',
        youtubeTutorials: verified.tutorials,
        updatedAt: new Date().toISOString()
      }
    }
  );
  assert.equal(cachedResult.status, 'cached');
  assert.equal(shouldNotCallYt, 0);
  assert.equal(shouldNotCallGemini, 0);
});

// ============================================================================
// STEP 3: EXHAUSTIVE 380-DAY SYLLABUS PARITY, MICROSOFT LEARN & NO DEAD ENTRIES
// ============================================================================
test('Step 3: 380-day curriculum continuity, 100% client/Edge parity, Azure Microsoft Learn URLs, and clean catalog', () => {
  assert.equal(ALL_180_DAYS.length, 180);
  assert.equal(DSA_100_DAYS.length, 100);
  assert.equal(AZURE_100_DAYS.length, 100);
  assert.equal(WEEKLY_ASSESSMENTS.length, 26);

  assert.equal(ALL_180_DAYS[0].isoDate, '2026-11-16');
  assert.equal(ALL_180_DAYS[179].isoDate, '2027-05-14');
  assert.equal(DSA_100_DAYS[0].isoDate, '2026-11-16');
  assert.equal(DSA_100_DAYS[99].isoDate, '2027-02-23');
  assert.equal(AZURE_100_DAYS[0].isoDate, '2026-11-16');
  assert.equal(AZURE_100_DAYS[99].isoDate, '2027-02-23');

  // Verify every single day across all 3 tracks matches Edge catalogData 1:1
  for (let i = 0; i < 180; i += 1) {
    assert.equal(MAIN_CURRICULUM_CONTEXTS[i].dayNumber, i + 1);
    assert.equal(MAIN_CURRICULUM_CONTEXTS[i].isoDate, ALL_180_DAYS[i].isoDate);
    assert.equal(MAIN_CURRICULUM_CONTEXTS[i].topic, ALL_180_DAYS[i].topic);
  }
  for (let i = 0; i < 100; i += 1) {
    assert.equal(DSA_CURRICULUM_CONTEXTS[i].dayNumber, i + 1);
    assert.equal(DSA_CURRICULUM_CONTEXTS[i].isoDate, DSA_100_DAYS[i].isoDate);
    assert.equal(DSA_CURRICULUM_CONTEXTS[i].topic, DSA_100_DAYS[i].topic);

    assert.equal(AZURE_CURRICULUM_CONTEXTS[i].dayNumber, i + 1);
    assert.equal(AZURE_CURRICULUM_CONTEXTS[i].isoDate, AZURE_100_DAYS[i].isoDate);
    assert.equal(AZURE_CURRICULUM_CONTEXTS[i].topic, AZURE_100_DAYS[i].topic);

    // Every Azure day maps exclusively to verified https://learn.microsoft.com/ docs
    const azureDocs = getSharedOfficialDocs('azure', i + 1);
    assert.ok(azureDocs.length >= 1);
    for (const doc of azureDocs) {
      assert.ok(
        doc.url?.startsWith('https://learn.microsoft.com/'),
        `Azure Day ${i + 1} expected Microsoft Learn URL, got ${doc.url}`
      );
    }

    // DSA days 2..100 have 3 verified LeetCode URLs (E/M/H); Day 1 has Easy+Medium + honest unavailable Hard
    const triplet = getSharedDsaDailyLeetCodeTriplet(i + 1);
    assert.equal(triplet.length, 3);
    assert.equal(triplet[0].difficulty, 'Easy');
    assert.equal(triplet[1].difficulty, 'Medium');
    assert.equal(triplet[2].difficulty, 'Hard');
    if (i === 0) {
      assert.equal(triplet[2].available, false);
    } else {
      assert.ok(triplet.every((q) => q.available && isValidHttpsUrl(q.url) && q.url!.startsWith('https://leetcode.com/problems/')));
    }
  }

  // Ensure dead unused entries removed from client catalog as well as Edge catalog
  const clientCatalog = fs.readFileSync(
    path.resolve(process.cwd(), 'src/data/dailyLearningCatalog.ts'),
    'utf8'
  );
  assert.equal(/\bstlSetMap\b/.test(clientCatalog), false);
  assert.equal(/\bdp2d\b/.test(clientCatalog), false);
});

// ============================================================================
// STEP 4: GEMINI BRIEF ENRICHMENT, PRESERVED CACHE ON FAILURE & TRACK ISOLATION
// ============================================================================
test('Step 4: Daily AI brief enrichment handles Main/DSA/Azure independently and preserves prior Gemini brief on transient outage', async () => {
  const existingDay1 = buildDeterministicReadOnlyTrack('main', 1, {});
  assert.ok(existingDay1);

  const mockGeminiCaller = async (ctx: { topic: string; trackId: string }) => ({
    success: true,
    aiProviderStatus: 'gemini_generated' as const,
    modelUsed: FREE_TIER_GEMINI_MODEL,
    data: {
      topicExplanation: `Grounded ${ctx.trackId} brief for ${ctx.topic}`,
      learningObjectives: ['Obj 1', 'Obj 2'],
      practicalExamples: [`Concrete ${ctx.trackId} example`],
      revisionNotes: ['Revision note 1'],
      commonMistakes: ['Common mistake 1'],
      suggestedLearningOrder: ['Step 1', 'Step 2'],
      dailyGuidance: 'Stay consistent.',
      practicalExerciseSummary: 'Build & verify.',
      youtubeAnnotations: []
    }
  });

  const [mainGen, dsaGen, azureGen] = await Promise.all([
    generateTrackDailyCanonical(
      'main',
      1,
      { geminiApiKey: 'test-key', geminiCaller: mockGeminiCaller },
      { forceRefresh: true, skipExternalNetworkChecks: true }
    ),
    generateTrackDailyCanonical(
      'dsa',
      1,
      { geminiApiKey: 'test-key', geminiCaller: mockGeminiCaller },
      { forceRefresh: true, skipExternalNetworkChecks: true }
    ),
    generateTrackDailyCanonical(
      'azure',
      1,
      { geminiApiKey: 'test-key', geminiCaller: mockGeminiCaller },
      { forceRefresh: true, skipExternalNetworkChecks: true }
    )
  ]);

  assert.equal(mainGen.aiProviderStatus, 'gemini_generated');
  assert.equal(dsaGen.aiProviderStatus, 'gemini_generated');
  assert.equal(azureGen.aiProviderStatus, 'gemini_generated');
  assert.equal(mainGen.leetcodeQuestions.length, 0);
  assert.equal(dsaGen.leetcodeQuestions.length, 3);
  assert.equal(azureGen.leetcodeQuestions.length, 0);

  // Subsequent refresh preserves prior content but records that this refresh used fallback.
  const afterOutage = await generateTrackDailyCanonical(
    'main',
    1,
    {
      geminiApiKey: 'test-key',
      geminiCaller: async () => ({
        success: false,
        aiProviderStatus: 'quota_exhausted_cached',
        errorMessage: '429 RESOURCE_EXHAUSTED'
      })
    },
    {
      forceRefresh: true,
      skipExternalNetworkChecks: true,
      existingCached: mainGen
    }
  );
  assert.equal(afterOutage.aiProviderStatus, 'quota_exhausted_cached');
  assert.equal(afterOutage.topicExplanation, mainGen.topicExplanation);
  assert.equal(afterOutage.modelUsed, undefined);
});

// ============================================================================
// STEP 5: EMAIL CHECKLIST REAL KEY MATCHING & RESEND RETRY/ERROR CLASSIFICATION
// ============================================================================
test('Step 5: Email checklist respects real app task keys and sendDailyEmailViaResend retries transients with same Idempotency-Key', async () => {
  const istSnap = getIstScheduleSnapshotCanonical(new Date('2026-11-18T10:00:00+05:30').getTime());
  const main = buildDeterministicReadOnlyTrack('main', 1, {});
  const dsa = buildDeterministicReadOnlyTrack('dsa', 1, {});
  const azure = buildDeterministicReadOnlyTrack('azure', 1, {});
  assert.ok(main && dsa && azure);

  const dashboard: CanonicalDailyDashboardPayload = {
    istDate: istSnap.istDate,
    istDateLabel: istSnap.istDateLabel,
    isPreparationStarted: true,
    unlockedDays: { main: 3, dsa: 3, azure: 3 },
    tracks: { main, dsa, azure },
    automation: {
      scheduleLabel: '10:00 AM IST (Daily)',
      timezone: 'Asia/Kolkata',
      recipientEmail: 'mypreparation0111@gmail.com',
      lastRunDate: null,
      lastRunAt: null,
      overallStatus: 'not_run_yet',
      emailStatus: 'not_sent',
      missingSecrets: [],
      geminiConfigured: true,
      youtubeConfigured: true,
      resendConfigured: true,
      resendSenderConfigured: true,
      supabaseServerConfigured: true
    },
    actionPlan: buildCombinedActionPlan(main, dsa, azure)
  };

  // Real UI keys: `${day}_concept`, `yt_dsa_d1_${yt.id}`, `dsa_1_obj`, `ex_azure_d1`
  const completedChecklistMap = {
    '1_concept': true,
    dsa_1_obj: true,
    [`yt_dsa_d1_${dsa.youtubeTutorials[0]?.id || 'search_1'}`]: true,
    ex_azure_d1: true
  };

  const rendered = buildDailyEmailContent(dashboard, 'https://my-preparation.vercel.app', {
    completedChecklistMap
  });
  assert.ok(rendered.html.includes('>☑</span>'));
  assert.ok(rendered.html.includes('>☐</span>'));
  assert.ok(rendered.text.includes(`  [x] Study Main Plan Day 1: ${main.topicTitle}`));
  assert.ok(rendered.text.includes(`  [x] Study ${dsa.topicTitle} (Concepts & C++ Examples)`));

  // Missing API key -> awaiting_credentials (0 fetches)
  const missingKeyRes = await sendDailyEmailViaResend(dashboard, {
    resendFromEmail: 'tracker@example.com'
  });
  assert.equal(missingKeyRes.sent, false);
  assert.equal(missingKeyRes.emailStatus, 'awaiting_credentials');
  assert.equal(missingKeyRes.attempts, 0);

  // Missing sender -> awaiting_sender_verification (0 fetches)
  const missingSenderRes = await sendDailyEmailViaResend(dashboard, {
    resendApiKey: 're_test_1234567890'
  });
  assert.equal(missingSenderRes.sent, false);
  assert.equal(missingSenderRes.emailStatus, 'awaiting_sender_verification');
  assert.equal(missingSenderRes.attempts, 0);

  // HTTP 403 unverified domain does NOT retry & classifies as awaiting_sender_verification + redacts re_ keys
  let permanentCalls = 0;
  const senderErrorRes = await sendDailyEmailViaResend(
    dashboard,
    {
      resendApiKey: 're_secret_should_be_masked_1234',
      resendFromEmail: 'unverified@example.com'
    },
    {
      retryDelayMs: 0,
      fetchImpl: async () => {
        permanentCalls += 1;
        return new Response(
          JSON.stringify({
            message: 'Domain example.com is not verified for key re_secret_should_be_masked_1234'
          }),
          { status: 403 }
        );
      }
    }
  );
  assert.equal(permanentCalls, 1);
  assert.equal(senderErrorRes.sent, false);
  assert.equal(senderErrorRes.emailStatus, 'awaiting_sender_verification');
  assert.equal(senderErrorRes.errorMessage?.includes('re_secret_should_be_masked'), false);
  assert.ok(senderErrorRes.errorMessage?.includes('re_***'));

  // Transient 503 then 429 then 200 succeeds on attempt 3 with identical Idempotency-Key across retries
  let retryCalls = 0;
  const seenKeys: string[] = [];
  const retrySuccessRes = await sendDailyEmailViaResend(
    dashboard,
    {
      resendApiKey: 're_valid_test_key_9999',
      resendFromEmail: 'Steeven Tracker <tracker@verified.example.com>',
      dailyRecipientEmail: 'mypreparation0111@gmail.com'
    },
    {
      maxAttempts: 3,
      retryDelayMs: 0,
      fetchImpl: async (_url, init) => {
        retryCalls += 1;
        const headers = new Headers(init?.headers || {});
        seenKeys.push(headers.get('Idempotency-Key') || '');
        if (retryCalls === 1) return new Response(JSON.stringify({ message: 'Upstream timeout' }), { status: 503 });
        if (retryCalls === 2) return new Response(JSON.stringify({ message: 'Rate limited' }), { status: 429 });
        return new Response(JSON.stringify({ id: 'msg_resend_verified_123' }), { status: 200 });
      }
    }
  );
  assert.equal(retryCalls, 3);
  assert.equal(retrySuccessRes.sent, true);
  assert.equal(retrySuccessRes.emailStatus, 'sent');
  assert.equal(retrySuccessRes.attempts, 3);
  assert.equal(retrySuccessRes.providerMessageId, 'msg_resend_verified_123');
  assert.equal(seenKeys.length, 3);
  assert.equal(new Set(seenKeys).size, 1);
  assert.equal(seenKeys[0], `steeven-daily-${istSnap.istDate}`);
});

// ============================================================================
// STEP 6 & 7: CRON SCHEDULE SQL, ORIGIN-VALIDATED CORS & VERCEL / EXPRESS HANDLERS
// ============================================================================
test('Step 6 & 7: Cron SQL targets 10:00 AM IST cleanly; Express and Vercel /api routes enforce security/CORS headers', async () => {
  const cronSql = fs.readFileSync(
    path.resolve(process.cwd(), 'supabase/scripts/schedule_10am_ist_cron_after_verify.sql'),
    'utf8'
  );
  assert.ok(cronSql.includes("'30 4 * * *'")); // 04:30 UTC == 10:00 AM IST
  assert.ok(cronSql.includes('vault.decrypted_secrets'));
  assert.equal(/\bdrop\s+table\b/i.test(cronSql), false);

  const cronsVerify = verifyCronRequest('Bearer strong-cron-secret', 'strong-cron-secret');
  assert.equal(cronsVerify.authorized, true);
  assert.equal(cronsVerify.status, 200);

  // Origin resolution unit checks
  assert.equal(
    resolveAllowedOrigin('https://my-preparation.vercel.app', 'evil.com', {
      NODE_ENV: 'production',
      APP_URL: 'https://my-preparation.vercel.app'
    }),
    'https://my-preparation.vercel.app'
  );
  assert.equal(
    resolveAllowedOrigin('https://untrusted.attacker.test', 'my-preparation.vercel.app', {
      NODE_ENV: 'production',
      APP_URL: 'https://my-preparation.vercel.app'
    }),
    null
  );

  // Express CORS + OPTIONS + security headers + method validation
  const app = await createApp({ attachFrontend: false });
  const expressServer = app.listen(0);
  const expressPort = (expressServer.address() as AddressInfo).port;
  try {
    const preflight = await fetch(`http://127.0.0.1:${expressPort}/api/daily-resources`, {
      method: 'OPTIONS',
      headers: { Origin: 'http://localhost:3000' }
    });
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get('access-control-allow-origin'), 'http://localhost:3000');
    assert.equal(preflight.headers.get('x-content-type-options'), 'nosniff');

    const badOriginPreflight = await fetch(`http://127.0.0.1:${expressPort}/api/daily-resources`, {
      method: 'OPTIONS',
      headers: { Origin: 'https://evil-site.example.org' }
    });
    assert.equal(badOriginPreflight.status, 204);
    assert.equal(badOriginPreflight.headers.get('access-control-allow-origin'), null);

    const authVerify = await fetch(`http://127.0.0.1:${expressPort}/api/auth/verify-owner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert.equal(authVerify.status, 401);
    assert.equal(authVerify.headers.get('cache-control'), 'no-store');
    assert.equal(authVerify.headers.get('x-content-type-options'), 'nosniff');
  } finally {
    await new Promise<void>((resolve) => expressServer.close(() => resolve()));
  }

  // Vercel handler integration checks (/api/health and /api/auth/verify-owner)
  const vercelHealthServer = http.createServer((req, res) => healthHandler(req, res));
  const vercelAuthServer = http.createServer((req, res) => {
    void verifyOwnerHandler(req, res);
  });
  await new Promise<void>((resolve) => vercelHealthServer.listen(0, resolve));
  await new Promise<void>((resolve) => vercelAuthServer.listen(0, resolve));

  try {
    const hPort = (vercelHealthServer.address() as AddressInfo).port;
    const hGet = await fetch(`http://127.0.0.1:${hPort}/api/health`);
    assert.equal(hGet.status, 200);
    assert.equal(hGet.headers.get('x-content-type-options'), 'nosniff');

    const hPost = await fetch(`http://127.0.0.1:${hPort}/api/health`, { method: 'POST' });
    assert.equal(hPost.status, 405);

    const aPort = (vercelAuthServer.address() as AddressInfo).port;
    const aGet = await fetch(`http://127.0.0.1:${aPort}/api/auth/verify-owner`, { method: 'GET' });
    assert.equal(aGet.status, 405);
    assert.equal(aGet.headers.get('cache-control'), 'no-store');
  } finally {
    await new Promise<void>((resolve) => vercelHealthServer.close(() => resolve()));
    await new Promise<void>((resolve) => vercelAuthServer.close(() => resolve()));
  }
});

// ============================================================================
// STEP 8: WEEKLY ASSESSMENTS, RUBRIC SCORING, CALENDAR LOCKS, PDF & GUEST SANDBOX
// ============================================================================
test('Step 8: Weekly assessment locks, rubric scoring pass gate, IST day lock boundaries, PDF validation, and Guest sandbox', async () => {
  // All 26 weekly assessment unlock ISO strings strictly formatted in IST (+05:30) and ordered chronologically
  let prevUnlockMs = 0;
  for (let week = 1; week <= TOTAL_ASSESSMENT_WEEKS; week += 1) {
    const iso = getWeekUnlockIsoIst(week);
    assert.match(iso, /^\d{4}-\d{2}-\d{2}T00:00:00\+05:30$/);
    const ms = new Date(iso).getTime();
    assert.ok(ms > prevUnlockMs, `Week ${week} unlock must advance monotonically`);
    prevUnlockMs = ms;

    assert.equal(isAssessmentUnlockedByIstClock(week, ms - 1), false);
    assert.equal(isAssessmentUnlockedByIstClock(week, ms), true);
  }
  assert.equal(getDayUnlockIsoIst(1), '2026-11-16T00:00:00+05:30');
  assert.equal(getDayUnlockIsoIst(180), '2027-05-14T00:00:00+05:30');
  assert.equal(isDayUnlockedByIstClock(1, new Date('2026-11-15T23:59:59+05:30').getTime()), false);
  assert.equal(getUnlockedDayCountByIstClock(new Date('2026-11-18T10:00:00+05:30').getTime(), 180), 3);

  // Weekly assessment evaluation & written self-review rubric scoring (passThreshold = 70%)
  const week1Assessment = WEEKLY_ASSESSMENTS[0];
  assert.ok(week1Assessment);
  const initialAnswers: Record<string, string | number> = {};
  const fullWrittenReviews: Record<string, 'full' | 'partial' | 'needs_revision'> = {};
  for (const q of week1Assessment.questions) {
    if (q.type === 'mcq') {
      initialAnswers[q.id] = q.correctAnswer ?? 0;
    } else {
      initialAnswers[q.id] = 'Structured written architecture answer';
      fullWrittenReviews[q.id] = 'full';
    }
  }
  const initialSub = createEvaluatedSubmission({
    assessment: week1Assessment,
    answers: initialAnswers,
    timeSpentSeconds: 900
  });
  // Before written rubric self-review, written questions stay 'pending' (0 written points)
  assert.equal(initialSub.writtenReviewScore, 0);

  const reviewedSub = applyRubricSelfReviewToSubmission(
    initialSub,
    week1Assessment.questions,
    fullWrittenReviews
  );
  assert.equal(reviewedSub.score, reviewedSub.maxScore);
  assert.equal(reviewedSub.percentage, 100);
  assert.equal(reviewedSub.passed, true);

  // PDF magic-header + inline Data URL resolution rejection on invalid payload
  assert.equal(hasPdfMagicHeader(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d])), true);
  assert.equal(hasPdfMagicHeader(new Uint8Array([0x47, 0x49, 0x46, 0x38])), false);
  await assert.rejects(
    () =>
      resolveRoadmapPdfBlob({
        id: 'bad-pdf',
        filename: 'corrupted.pdf',
        fileSize: 10,
        fileSizeBytesFormatted: '10 B',
        uploadTimestamp: '2026-11-18T00:00:00Z',
        ownerId: 'owner',
        storagePath: 'local-upload/corrupted.pdf',
        fileUrl: 'data:application/pdf;base64,PGh0bWw+', // "<html>" base64
        version: 1,
        isActiveRoadmap: false
      }),
    /does not appear to be a valid PDF/i
  );

  // Guest sandbox shares Owner PDFs/resources/settings without leaking Owner progress
  const guestBase = cloneGuestState();
  guestBase.completedTasks = { '1_concept': true };
  const guestHydrated = applySharedContentToGuestState(guestBase, {
    uploadedPdfs: [],
    activePdfId: '',
    resources: [
      {
        id: 'shared-doc-1',
        title: 'RAG Guide',
        url: 'https://learn.microsoft.com/',
        category: 'Official Documentation',
        relatedDay: 1,
        relatedWeek: 1,
        relatedTopic: 'Azure Setup',
        shortDescription: 'Official reference',
        personalNotes: '',
        tags: ['azure'],
        dateAdded: '2026-11-18T00:00:00Z',
        isImportant: true,
        isCompleted: false
      }
    ],
    sharedSettings: { ...DEFAULT_SHARED_SETTINGS, defaultDailyGoalHours: 5 },
    updatedAt: '2026-11-18T00:00:00Z'
  });
  assert.equal(guestHydrated.role, 'guest');
  assert.equal(guestHydrated.resources.length, 1);
  assert.equal(guestHydrated.sharedSettings.defaultDailyGoalHours, 5);
  assert.equal(guestHydrated.passwordHash, '');
});
