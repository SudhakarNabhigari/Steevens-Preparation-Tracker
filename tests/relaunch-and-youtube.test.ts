import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { AddressInfo } from 'node:net';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createApp } from '../server.ts';
import statusHandler from '../api/relaunch/status.ts';
import { DEFAULT_GUEST_STATE, DEFAULT_OWNER_STATE, mergeOwnerStatesSafely } from '../src/services/storage.ts';
import { getDayLockStatus } from '../src/utils/dailyLock.ts';
import {
  createOwnerRelaunchCycle,
  OWNER_RELAUNCH_CYCLE_ID,
  OWNER_RELAUNCH_START_MS,
  OWNER_RESTART_EMAIL_EARLIEST_MS
} from '../src/utils/relaunch.ts';
import { isOfficialRelaunchStatus, OWNER_RELAUNCH_START_ISO_IST } from '../src/utils/relaunchConfig.ts';
import { getRelaunchStatus } from '../server/relaunchStatus.ts';
import { sendOwnerRelaunchAnnouncement } from '../server/relaunchService.ts';
import {
  APPROVED_AZURE_CHANNELS,
  APPROVED_CODING_CHANNELS,
  discoverYouTubeTutorials,
  generateTrackDailyCanonical,
  hasCompleteRequiredTrackResources,
  isCodingRelatedTopic,
  revalidateCachedYouTubeRows
} from '../supabase/functions/daily-learning-resources/pipeline.ts';
import { getSharedCurriculumDayContext, MAIN_CURRICULUM_CONTEXTS } from '../supabase/functions/daily-learning-resources/catalogData.ts';

test('resource completion status does not treat optional Gemini fallback as a partial track update', () => {
  const completeResources = {
    trackId: 'azure' as const,
    topicExplanation: 'Grounded explanation from the existing curriculum fallback.',
    learningObjectives: ['Understand the exact topic'],
    officialDocs: [{ id: 'doc', resourceType: 'official_documentation' as const, title: 'Official docs', description: 'Docs', sourceLabel: 'Microsoft Learn', url: 'https://learn.microsoft.com/', isVerifiedUrl: true }],
    practicalExercises: [{ id: 'exercise', resourceType: 'practical_exercise' as const, title: 'Exercise', description: 'Hands-on work', sourceLabel: 'Curriculum', isVerifiedUrl: true }],
    youtubeTutorials: [{ id: 'video', title: 'Exact Azure topic', channelName: 'Microsoft Learn', channelId: APPROVED_AZURE_CHANNELS[1].channelId, url: 'https://www.youtube.com/watch?v=verified', topicCovered: 'Exact Azure topic', explanation: 'Topic matched', whyUseful: 'Official explanation', isVerifiedVideo: true, linkKind: 'verified_video' as const }],
    youtubeProviderStatus: 'youtube_api_verified' as const,
    leetcodeQuestions: []
  };

  // The Gemini status is deliberately absent from this required-resource gate:
  // fallback remains labelled in aiProviderStatus/statusMessage by the caller.
  assert.equal(hasCompleteRequiredTrackResources(completeResources), true);
  assert.equal(hasCompleteRequiredTrackResources({
    ...completeResources,
    youtubeProviderStatus: 'unavailable',
    youtubeTutorials: []
  }), false);
  assert.equal(hasCompleteRequiredTrackResources({
    ...completeResources,
    officialDocs: [{ ...completeResources.officialDocs[0], isVerifiedUrl: false }]
  }), false);
  assert.equal(hasCompleteRequiredTrackResources({
    ...completeResources,
    trackId: 'dsa',
    leetcodeQuestions: []
  }), false);
});

test('verified required resources stay updated during Gemini outage while warning remains visible', async () => {
  const context = getSharedCurriculumDayContext('azure', 1)!;
  const videoId = 'AzTopic0001';
  const azureChannelId = APPROVED_AZURE_CHANNELS[0].channelId;
  const fetchImpl: typeof fetch = async (input) => {
    const url = new URL(String(input));
    if (url.pathname.endsWith('/search')) {
      return new Response(JSON.stringify({ items: [{ id: { videoId }, snippet: { channelId: azureChannelId } }] }), { status: 200 });
    }
    if (url.pathname.endsWith('/videos')) {
      return new Response(JSON.stringify({ items: [{
        id: videoId,
        snippet: { title: `${context.topic} explained`, description: `Official Azure explanation of ${context.topic}`, channelId: azureChannelId, channelTitle: 'Microsoft Azure', defaultAudioLanguage: 'en' },
        contentDetails: { duration: 'PT12M' },
        status: { privacyStatus: 'public' },
        statistics: { viewCount: '100000' }
      }] }), { status: 200 });
    }
    if (url.pathname.endsWith('/channels')) {
      return new Response(JSON.stringify({ items: [{ id: azureChannelId, snippet: { title: 'Microsoft Azure', description: 'Official Microsoft Azure training and technology education.' }, statistics: { subscriberCount: '1000000', videoCount: '1000' } }] }), { status: 200 });
    }
    return new Response(null, { status: 404 });
  };

  const result = await generateTrackDailyCanonical('azure', 1, {
    youtubeApiKey: 'test-key',
    fetchImpl,
    geminiCaller: async () => ({ success: false, aiProviderStatus: 'unavailable', errorMessage: 'test outage' })
  }, {
    forceRefresh: true,
    skipExternalNetworkChecks: true,
    // Use the legacy date only to exercise Day 1 generation before the actual
    // November 23 Owner unlock. The caller still runs with role=owner.
    scheduleStartIsoIst: '2026-11-16T00:00:00+05:30',
    role: 'owner'
  });

  assert.equal(result.status, 'updated');
  assert.equal(result.aiProviderStatus, 'unavailable');
  assert.equal(result.youtubeProviderStatus, 'youtube_api_verified');
  assert.match(result.statusMessage, /Gemini fallback: test outage/);
});

test('Owner relaunch archives prior progress once and resets only the active cycle', () => {
  const owner = structuredClone(DEFAULT_OWNER_STATE);
  owner.completedTasks = { '1_task-a': true };
  owner.completedDays = { 1: true };
  owner.dayNotes = { 1: 'Preserve this note in cycle history.' };
  owner.studyTimeSeconds = { 1: 3600 };
  owner.dsaProgress.completedDays = { 1: true };
  owner.azureProgress.dayNotes = { 2: 'Azure progress stays archived.' };
  owner.studyLogs = [{ id: 'legacy-log', trackId: 'main', dayNumber: 1, date: '2026-11-16', startTime: '08:00', endTime: '09:00', durationSeconds: 3600, type: 'daily_preparation', completedTasksCount: 0 }];
  owner.timerState = {
    ...owner.timerState,
    isActive: true,
    isPaused: true,
    trackId: 'azure',
    dayNumber: 12,
    targetSeconds: 2700,
    elapsedSeconds: 421,
    remainingSeconds: 2279,
    startedAtTimestamp: 1_800_000_000_000,
    pausedAtTimestamp: 1_800_000_421_000,
    type: 'assessment'
  };
  owner.trackTimerSnapshots = {
    dsa: {
      ...owner.timerState,
      trackId: 'dsa',
      dayNumber: 8,
      elapsedSeconds: 900,
      remainingSeconds: 1800
    }
  };
  const priorTimerState = structuredClone(owner.timerState);
  const priorTrackTimerSnapshots = structuredClone(owner.trackTimerSnapshots);

  const launched = createOwnerRelaunchCycle(owner, OWNER_RELAUNCH_START_MS);
  assert.equal(launched.preparationCycleId, OWNER_RELAUNCH_CYCLE_ID);
  assert.deepEqual(launched.completedTasks, {});
  assert.deepEqual(launched.dsaProgress.completedDays, {});
  assert.equal(launched.preparationCycleHistory?.length, 1);
  assert.equal(launched.preparationCycleHistory?.[0]?.main.dayNotes[1], 'Preserve this note in cycle history.');
  assert.equal(launched.preparationCycleHistory?.[0]?.dsa.completedDays[1], true);
  assert.equal(launched.preparationCycleHistory?.[0]?.azure.dayNotes[2], 'Azure progress stays archived.');
  assert.equal(launched.preparationCycleHistory?.[0]?.studyLogs[0]?.id, 'legacy-log');
  assert.deepEqual(launched.preparationCycleHistory?.[0]?.timerState, priorTimerState);
  assert.deepEqual(launched.preparationCycleHistory?.[0]?.trackTimerSnapshots, priorTrackTimerSnapshots);
  assert.equal(launched.timerState.isActive, false);
  assert.equal(launched.timerState.isPaused, false);
  assert.equal(launched.timerState.trackId, 'main');
  assert.equal(launched.timerState.dayNumber, 1);
  assert.equal(launched.timerState.elapsedSeconds, 0);
  assert.equal(launched.timerState.remainingSeconds, priorTimerState.targetSeconds);
  assert.equal(launched.timerState.startedAtTimestamp, undefined);
  assert.equal(launched.timerState.pausedAtTimestamp, undefined);
  assert.deepEqual(launched.trackTimerSnapshots, {});
  assert.equal(createOwnerRelaunchCycle(launched, OWNER_RELAUNCH_START_MS + 1), launched);

  const cloudStillOnPriorCycle = structuredClone(owner);
  cloudStillOnPriorCycle.lastSavedTimestamp = '2026-11-30T00:00:00.000Z';
  const merged = mergeOwnerStatesSafely(launched, cloudStillOnPriorCycle, OWNER_RELAUNCH_START_MS + 1).merged;
  assert.deepEqual(merged.completedDays, {}, 'a newer timestamp on the old cloud cycle cannot refill new-cycle progress');
  assert.equal(merged.activeAssessmentAttempt, null);
  assert.equal(merged.preparationCycleHistory?.length, 1);

  const guest = structuredClone(DEFAULT_GUEST_STATE);
  guest.completedDays = { 1: true };
  assert.equal(createOwnerRelaunchCycle(guest, OWNER_RELAUNCH_START_MS), guest);
  assert.deepEqual(guest.completedDays, { 1: true });
});

test('Owner and Guest retain separate Day 1 lock dates and server time is authoritative', () => {
  const beforeLaunch = OWNER_RELAUNCH_START_MS - 1;
  assert.equal(getDayLockStatus(1, beforeLaunch, 180, '2026-11-23T00:00:00+05:30').isUnlocked, false);
  assert.equal(getDayLockStatus(1, beforeLaunch, 180, '2026-11-16T00:00:00+05:30').isUnlocked, true);
  assert.match(getDayLockStatus(1, beforeLaunch, 180, '2026-11-23T00:00:00+05:30').unlockLabelIst, /23 Nov 2026/);
  assert.equal(getRelaunchStatus(beforeLaunch).unlocked, false);
  assert.equal(getRelaunchStatus(OWNER_RELAUNCH_START_MS).unlocked, true);
});

test('deployed status handler returns the validated public server clock without authentication', () => {
  const headers: Record<string, string> = {};
  let body = '';
  const req = { method: 'GET', headers: {} } as IncomingMessage;
  const res = {
    statusCode: 0,
    setHeader: (name: string, value: string) => { headers[name.toLowerCase()] = value; },
    end: (chunk?: string) => { body = chunk || ''; }
  } as unknown as ServerResponse;

  statusHandler(req, res);
  const payload: unknown = JSON.parse(body);
  assert.equal(res.statusCode, 200);
  assert.equal(headers['content-type'], 'application/json');
  assert.equal(headers['cache-control'], 'no-store, max-age=0');
  assert.equal(isOfficialRelaunchStatus(payload), true);
  assert.equal((payload as { launchAtIso: string }).launchAtIso, OWNER_RELAUNCH_START_ISO_IST);
  assert.equal((payload as { launchAt: number }).launchAt, OWNER_RELAUNCH_START_MS);
  assert.equal(isOfficialRelaunchStatus({ ...(payload as object), launchAt: OWNER_RELAUNCH_START_MS + 1 }), false);

  const wrongMethodResponse = { statusCode: 0, setHeader: () => undefined, end: (chunk?: string) => { body = chunk || ''; } } as unknown as ServerResponse;
  statusHandler({ method: 'POST', headers: {} } as IncomingMessage, wrongMethodResponse);
  assert.equal(wrongMethodResponse.statusCode, 405);
});

test('Owner daily-resource GET rejects unauthenticated role claims before loading resources', async () => {
  const app = await createApp({
    attachFrontend: false,
    verifyOwner: async (authorizationHeader) => authorizationHeader
      ? { authorized: true, status: 200, authMethod: 'owner_jwt', userId: 'test-owner' }
      : { authorized: false, status: 401, error: 'Authentication required.' }
  });
  const server = app.listen(0);
  const port = (server.address() as AddressInfo).port;
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/daily-resources?track=main&day=1&role=owner`);
    assert.equal(response.status, 401);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test('coding video discovery accepts only topic-matched, public, long videos from approved channels', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/youtube/v3/search')) {
      return new Response(JSON.stringify({ items: [{ id: { videoId: 'approv12345' } }, { id: { videoId: 'outside1234' } }] }), { status: 200 });
    }
    if (url.includes('/youtube/v3/videos')) {
      return new Response(JSON.stringify({ items: [
        {
          id: 'approv12345',
          snippet: { title: 'C++ setup and first program', channelTitle: 'takeUforward', channelId: APPROVED_CODING_CHANNELS[5].channelId, description: 'C++ compiler setup and Hello World', thumbnails: { medium: { url: 'https://i.ytimg.com/vi/approv12345/mqdefault.jpg' } } },
          contentDetails: { duration: 'PT12M' }, status: { privacyStatus: 'public' }
        },
        {
          id: 'outside1234',
          snippet: { title: 'C++ setup and first program', channelTitle: 'Other channel', channelId: 'UCnotApproved00000000000', description: 'C++ compiler setup', thumbnails: { medium: { url: 'https://i.ytimg.com/vi/outside1234/mqdefault.jpg' } } },
          contentDetails: { duration: 'PT12M' }, status: { privacyStatus: 'public' }
        }
      ] }), { status: 200 });
    }
    return new Response(null, { status: 404 });
  }) as typeof fetch;
  try {
    const ctx = getSharedCurriculumDayContext('dsa', 1)!;
    const result = await discoverYouTubeTutorials(ctx, 'fake-test-key');
    assert.equal(result.providerStatus, 'youtube_api_verified');
    assert.equal(result.tutorials.length, 1);
    assert.equal(result.tutorials[0]?.channelId, APPROVED_CODING_CHANNELS[5].channelId);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('non-coding recommendations prefer verified Telugu, then English; Azure favors official Microsoft channels', async () => {
  const originalFetch = globalThis.fetch;
  const teluguChannelId = 'UCteluguEdu000000000001';
  const englishChannelId = 'UCenglishEdu00000000001';
  const teluguVideoId = 'telvid00001';
  const englishVideoId = 'engvid00001';
  let currentContext = getSharedCurriculumDayContext('azure', 1)!;
  const candidateChannels = new Map<string, string>();
  const makeFetch = (includeTelugu: boolean): typeof fetch => async (input) => {
    const url = new URL(String(input));
    if (url.pathname.endsWith('/search')) {
      const language = url.searchParams.get('relevanceLanguage');
      const channelId = url.searchParams.get('channelId');
      if (language === 'te' && includeTelugu) {
        candidateChannels.set(teluguVideoId, teluguChannelId);
        return new Response(JSON.stringify({ items: [{ id: { videoId: teluguVideoId }, snippet: { channelId: teluguChannelId } }] }), { status: 200 });
      }
      if (language === 'en' && channelId === APPROVED_AZURE_CHANNELS[0].channelId) {
        candidateChannels.set(englishVideoId, channelId);
        return new Response(JSON.stringify({ items: [{ id: { videoId: englishVideoId }, snippet: { channelId } }] }), { status: 200 });
      }
      if (language === 'en' && !channelId) {
        candidateChannels.set(englishVideoId, englishChannelId);
        return new Response(JSON.stringify({ items: [{ id: { videoId: englishVideoId }, snippet: { channelId: englishChannelId } }] }), { status: 200 });
      }
      return new Response(JSON.stringify({ items: [] }), { status: 200 });
    }
    if (url.pathname.endsWith('/videos')) {
      const ids = (url.searchParams.get('id') || '').split(',');
      const items = ids.map((id) => {
        const channelId = candidateChannels.get(id) || '';
        const isTelugu = id === teluguVideoId;
        const channelTitle = isTelugu ? 'Trusted Telugu Cloud Learning' : channelId === englishChannelId ? 'English Learning Channel' : 'Microsoft Azure';
        return {
        id, snippet: { title: `${currentContext.topic}${isTelugu ? ' Telugu వివరణ' : ' explained'}`, channelTitle, channelId, description: `Educational ${isTelugu ? 'Telugu' : 'English'} tutorial explaining ${currentContext.topic}`, defaultAudioLanguage: isTelugu ? 'te' : 'en', thumbnails: { medium: { url: `https://i.ytimg.com/vi/${id}/mqdefault.jpg` } } },
        contentDetails: { duration: 'PT12M' }, status: { privacyStatus: 'public' }, statistics: { viewCount: '50000' }
      };
      });
      return new Response(JSON.stringify({ items }), { status: 200 });
    }
    if (url.pathname.endsWith('/channels')) {
      return new Response(JSON.stringify({ items: [
        { id: teluguChannelId, snippet: { title: 'Trusted Telugu Cloud Learning', description: 'Technology education, tutorials, training and courses.' }, statistics: { subscriberCount: '50000', videoCount: '250' } },
        { id: APPROVED_AZURE_CHANNELS[0].channelId, snippet: { title: 'Microsoft Azure', description: 'Official Microsoft Azure training and cloud technology education.' }, statistics: { subscriberCount: '1000000', videoCount: '5000' } },
        { id: englishChannelId, snippet: { title: 'English Learning Channel', description: 'Technology tutorials and education.' }, statistics: { subscriberCount: '50000', videoCount: '250' } }
      ] }), { status: 200 });
    }
    return new Response(null, { status: 404 });
  };

  try {
    globalThis.fetch = makeFetch(true);
    const azureContext = getSharedCurriculumDayContext('azure', 1)!;
    currentContext = azureContext;
    const azureTelugu = await discoverYouTubeTutorials(azureContext, 'fake-test-key');
    assert.equal(azureTelugu.tutorials[0]?.language, 'te');
    assert.equal(azureTelugu.tutorials[0]?.channelId, teluguChannelId);
    assert.ok(azureTelugu.tutorials[0]?.title.includes(azureContext.topic));

    globalThis.fetch = makeFetch(false);
    candidateChannels.clear();
    currentContext = azureContext;
    const azureEnglish = await discoverYouTubeTutorials(azureContext, 'fake-test-key');
    assert.equal(azureEnglish.tutorials[0]?.language, 'en');
    assert.equal(azureEnglish.tutorials[0]?.channelId, APPROVED_AZURE_CHANNELS[0].channelId);

    globalThis.fetch = makeFetch(true);
    const mainContext = MAIN_CURRICULUM_CONTEXTS.find((ctx) => !isCodingRelatedTopic(ctx))!;
    candidateChannels.clear();
    currentContext = mainContext;
    const mainResult = await discoverYouTubeTutorials(mainContext, 'fake-test-key');
    assert.equal(mainResult.tutorials[0]?.language, 'te');
    assert.ok(mainResult.tutorials.every((item) => item.isVerifiedVideo && item.channelId && item.url.includes(item.videoId || '')));

    const guestResult = await discoverYouTubeTutorials(mainContext, '', fetch, 'guest');
    assert.equal(guestResult.providerStatus, 'search_fallback_no_key');
    assert.equal(guestResult.tutorials.length, 3, 'Guest keeps its existing labeled search links when the API key is unavailable.');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('cached Owner YouTube recommendations are revalidated against actual video and channel metadata', async () => {
  const ctx = getSharedCurriculumDayContext('azure', 1)!;
  const videoId = 'azcache1234';
  const cached = [{
    track_id: 'azure' as const,
    plan_day: 1,
    resource_type: 'youtube',
    title: 'cached title is not trusted',
    url: `https://www.youtube.com/watch?v=${videoId}`,
    channel_or_source: 'cached channel is not trusted',
    topic_covered: ctx.topic,
    description: 'cached description',
    why_useful: 'cached metadata is not trusted',
    is_verified: true,
    language: 'en'
  }];
  const fetchForChannel = (channelId: string): typeof fetch => async (input) => {
    const url = new URL(String(input));
    if (url.pathname.endsWith('/videos')) {
      return new Response(JSON.stringify({ items: [{
        id: videoId,
        snippet: { title: `Azure ${ctx.topic} explained`, description: `Training for ${ctx.topic}`, channelId, defaultAudioLanguage: 'en' },
        contentDetails: { duration: 'PT12M' },
        status: { privacyStatus: 'public' }
      }] }), { status: 200 });
    }
    if (url.pathname.endsWith('/channels')) {
      return new Response(JSON.stringify({ items: [{
        id: channelId,
        snippet: { title: 'Microsoft Azure', description: 'Official Microsoft Azure training and cloud education.' },
        statistics: { subscriberCount: '1000000', videoCount: '5000' }
      }] }), { status: 200 });
    }
    return new Response(null, { status: 404 });
  };

  const valid = await revalidateCachedYouTubeRows(cached, ctx, 'unit-test-key', fetchForChannel(APPROVED_AZURE_CHANNELS[0].channelId), 'owner');
  assert.equal(valid.length, 1);
  assert.equal(valid[0]?.title, `Azure ${ctx.topic} explained`);
  assert.equal(valid[0]?.channel_or_source, 'Microsoft Azure');
  assert.equal(valid[0]?.channel_id, APPROVED_AZURE_CHANNELS[0].channelId);

  const missingKey = await revalidateCachedYouTubeRows(cached, ctx, undefined, fetch, 'owner');
  assert.deepEqual(missingKey, [], 'Owner cached recommendations fail closed without YouTube metadata verification.');
});

test('relaunch email claim is idempotent and retries do not send duplicate mail', async () => {
  const originalEnv = { ...process.env };
  const originalFetch = globalThis.fetch;
  Object.assign(process.env, {
    SUPABASE_URL: 'https://unit-test.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'unit-test-service-key',
    OWNER_SUPABASE_USER_ID: '00000000-0000-4000-8000-000000000001',
    DAILY_REPORT_RECIPIENT_EMAIL: 'owner@example.test',
    RESEND_API_KEY: 'unit-test-resend-key',
    RESEND_FROM_EMAIL: 'tracker@example.test',
    APP_URL: 'https://tracker.example.test'
  });
  let claimed = false;
  let claimCalls = 0;
  let resendCalls = 0;
  let sentEmail: Record<string, unknown> | null = null;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/rpc/claim_owner_relaunch_email')) {
      claimCalls += 1;
      if (claimed) return new Response('false', { status: 200 });
      claimed = true;
      return new Response('true', { status: 200 });
    }
    if (url === 'https://api.resend.com/emails') {
      resendCalls += 1;
      sentEmail = JSON.parse(String(init?.body || '{}')) as Record<string, unknown>;
      return new Response(JSON.stringify({ id: 'message-test-id' }), { status: 200 });
    }
    if (url.includes('/owner_relaunch_emails?')) {
      if (url.includes('select=generated_at')) return new Response(JSON.stringify([{ generated_at: '2026-11-21T04:30:00.000Z' }]), { status: 200 });
      return new Response(null, { status: 204 });
    }
    return new Response(null, { status: 404 });
  }) as typeof fetch;
  try {
    await assert.rejects(
      sendOwnerRelaunchAnnouncement('restart', OWNER_RESTART_EMAIL_EARLIEST_MS - 1),
      /not available before 21 November 2026 at 10:00 AM IST/
    );
    assert.equal(claimCalls, 0);
    assert.equal(resendCalls, 0);
    const first = await sendOwnerRelaunchAnnouncement('restart', OWNER_RESTART_EMAIL_EARLIEST_MS);
    const second = await sendOwnerRelaunchAnnouncement('restart', OWNER_RESTART_EMAIL_EARLIEST_MS);
    assert.equal(first.sent, true);
    assert.equal(second.alreadySent, true);
    assert.equal(claimCalls, 2);
    assert.equal(resendCalls, 1);
    const capturedEmail = sentEmail as unknown as Record<string, unknown>;
    assert.match(String(capturedEmail.text), /Steeven's Preparation Tracker is restarting/);
    assert.match(String(capturedEmail.text), /Monday, 23 November 2026 at 12:00 AM IST/);
    assert.match(String(capturedEmail.text), /Remaining Days: 1\nRemaining Hours: 14\nRemaining Minutes: 0\nRemaining Seconds: 0/);
    assert.match(String(capturedEmail.text), /snapshot.*server clock.*continues updating live/s);
    assert.equal((capturedEmail.to as string[])[0], 'owner@example.test');
    await assert.rejects(
      sendOwnerRelaunchAnnouncement('launch', OWNER_RELAUNCH_START_MS - 1),
      /not available before the official unlock/
    );
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of Object.keys(process.env)) {
      if (!(key in originalEnv)) delete process.env[key];
    }
    Object.assign(process.env, originalEnv);
  }
});

test('failed relaunch delivery retries with the original server countdown snapshot and payload', async () => {
  const originalEnv = { ...process.env };
  const originalFetch = globalThis.fetch;
  Object.assign(process.env, {
    SUPABASE_URL: 'https://unit-test.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'unit-test-service-key',
    OWNER_SUPABASE_USER_ID: '00000000-0000-4000-8000-000000000001',
    DAILY_REPORT_RECIPIENT_EMAIL: 'owner@example.test',
    RESEND_API_KEY: 'unit-test-resend-key',
    RESEND_FROM_EMAIL: 'tracker@example.test',
    APP_URL: 'https://tracker.example.test'
  });
  const resendRequests: Array<{ body: string; idempotencyKey: string | undefined }> = [];
  let resendAttempts = 0;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/rpc/claim_owner_relaunch_email')) {
      return new Response('true', { status: 200 });
    }
    if (url === 'https://api.resend.com/emails') {
      resendAttempts += 1;
      resendRequests.push({
        body: String(init?.body || ''),
        idempotencyKey: new Headers(init?.headers).get('Idempotency-Key') || undefined
      });
      return resendAttempts === 1
        ? new Response(JSON.stringify({ message: 'temporary delivery issue' }), { status: 503 })
        : new Response(JSON.stringify({ id: 'retry-message-id' }), { status: 200 });
    }
    if (url.includes('/owner_relaunch_emails?')) {
      if (url.includes('select=generated_at')) return new Response(JSON.stringify([{ generated_at: '2026-11-21T04:30:00.000Z' }]), { status: 200 });
      return new Response(null, { status: 204 });
    }
    return new Response(null, { status: 404 });
  }) as typeof fetch;
  try {
    await assert.rejects(
      sendOwnerRelaunchAnnouncement('restart', OWNER_RESTART_EMAIL_EARLIEST_MS),
      /safe retry/
    );
    const retry = await sendOwnerRelaunchAnnouncement('restart', OWNER_RESTART_EMAIL_EARLIEST_MS + 60_000);
    assert.equal(retry.sent, true);
    assert.equal(resendRequests.length, 2);
    assert.equal(resendRequests[0]?.body, resendRequests[1]?.body, 'retry must reuse the database-generated countdown snapshot');
    assert.equal(resendRequests[0]?.idempotencyKey, resendRequests[1]?.idempotencyKey);
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of Object.keys(process.env)) {
      if (!(key in originalEnv)) delete process.env[key];
    }
    Object.assign(process.env, originalEnv);
  }
});

test('Day 1 launch email is accepted only after the unlock instant and only on the launch date', async () => {
  const originalEnv = { ...process.env };
  const originalFetch = globalThis.fetch;
  Object.assign(process.env, {
    SUPABASE_URL: 'https://unit-test.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'unit-test-service-key',
    OWNER_SUPABASE_USER_ID: '00000000-0000-4000-8000-000000000001',
    DAILY_REPORT_RECIPIENT_EMAIL: 'owner@example.test',
    RESEND_API_KEY: 'unit-test-resend-key',
    RESEND_FROM_EMAIL: 'tracker@example.test',
    APP_URL: 'https://tracker.example.test'
  });
  let emailSent = false;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/rpc/claim_owner_relaunch_email')) return new Response('true', { status: 200 });
    if (url === 'https://api.resend.com/emails') {
      emailSent = true;
      return new Response(JSON.stringify({ id: 'launch-message-id' }), { status: 200 });
    }
    if (url.includes('/owner_relaunch_emails?')) {
      if (url.includes('select=generated_at')) return new Response(JSON.stringify([{ generated_at: '2026-11-23T00:00:00.000Z' }]), { status: 200 });
      return new Response(null, { status: 204 });
    }
    return new Response(null, { status: 404 });
  }) as typeof fetch;
  try {
    const launchMs = Date.parse('2026-11-23T00:00:00+05:30');
    await assert.rejects(sendOwnerRelaunchAnnouncement('launch', launchMs - 1), /not available before the official unlock/);
    assert.equal(emailSent, false);
    const result = await sendOwnerRelaunchAnnouncement('launch', launchMs);
    assert.equal(result.sent, true);
    assert.equal(emailSent, true);
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of Object.keys(process.env)) {
      if (!(key in originalEnv)) delete process.env[key];
    }
    Object.assign(process.env, originalEnv);
  }
});

test('restart and Day 1 email cron entries are separate from the existing Supabase daily schedule', () => {
  const vercelConfig = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')) as {
    crons?: Array<{ path: string; schedule: string }>;
  };
  assert.ok(vercelConfig.crons?.some((cron) => cron.path.includes('type=restart')));
  assert.ok(vercelConfig.crons?.some((cron) => cron.path.includes('type=restart') && cron.schedule === '30 4 21 11 *'));
  assert.ok(vercelConfig.crons?.some((cron) => cron.path === '/api/relaunch/cron' && cron.schedule === '30 18 22 11 *'));
});

test('relaunch migration blocks Owner identity transfers and preserves scoped write permissions', () => {
  const sql = readFileSync(new URL('../supabase/migrations/20261120_owner_relaunch_cycles_and_email_outbox.sql', import.meta.url), 'utf8');
  assert.doesNotMatch(sql, /\bchannel_id\b|drop\s+policy|drop\s+trigger/i);
  assert.match(sql, /select owner_user_id[\s\S]+from public\.app_owner_registry[\s\S]+where id = 1/i);
  assert.match(sql, /\(old\.user_id = owner_id\) is distinct from \(new\.user_id = owner_id\)/i);
  assert.match(sql, /old\.state\s*-\s*array\[/i);
  assert.match(sql, /'sharedSettings'/);
  assert.doesNotMatch(sql.match(/old\.state\s*-\s*array\[([\s\S]*?)\]/i)?.[1] || '', /completedTasks|dsaProgress|azureProgress|preparationCycleHistory/);
  assert.match(sql, /'generated_at'|generated_at timestamptz/i);
  assert.match(sql, /revoke all on function public\.guard_owner_progress_before_relaunch\(\) from public, anon, authenticated/i);
  assert.match(sql, /grant execute on function public\.guard_owner_progress_before_relaunch\(\) to service_role/i);

  const ownerId = 'owner-id';
  const guestId = 'guest-id';
  const isTransfer = (oldId: string, newId: string) => (oldId === ownerId) !== (newId === ownerId);
  assert.equal(isTransfer(ownerId, guestId), true, 'Owner identity cannot move away from its row before unlock.');
  assert.equal(isTransfer(guestId, ownerId), true, 'Owner identity cannot move onto a different row before unlock.');
  assert.equal(isTransfer(guestId, 'another-guest-id'), false, 'Guest row changes remain outside the Owner guard.');
  assert.equal(isTransfer(ownerId, ownerId), false, 'Normal updates to the existing Owner row are not identity transfers.');

  const allowedFields = new Set(['username', 'sharedSettings', 'resources']);
  const guardedState = (state: Record<string, unknown>) => Object.fromEntries(
    Object.entries(state).filter(([key]) => !allowedFields.has(key))
  );
  const before = { sharedSettings: { theme: 'old' }, resources: [], completedTasks: { day1: true } };
  assert.deepEqual(guardedState(before), guardedState({ ...before, sharedSettings: { theme: 'new' } }));
  assert.notDeepEqual(guardedState(before), guardedState({ ...before, completedTasks: {} }));
});
