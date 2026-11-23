import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import type { AddressInfo } from 'node:net';
import { createApp } from '../server.ts';
import { sendOwnerRelaunchAnnouncement } from '../server/relaunchService.ts';
import {
  APPROVED_AZURE_CHANNELS,
  APPROVED_CODING_CHANNELS,
  discoverYouTubeTutorials
} from '../supabase/functions/daily-learning-resources/pipeline.ts';
import { getSharedCurriculumDayContext } from '../supabase/functions/daily-learning-resources/catalogData.ts';

function collectSourceFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...collectSourceFiles(fullPath));
    } else if (/\.(ts|tsx)$/.test(entry)) {
      files.push(fullPath);
    }
  }
  return files;
}

test('relaunchService uses apikey-only auth headers for sb_secret_ keys, enforces claim idempotency, and sends Nov 23 Day 1 launch email', async () => {
  const prevEnv = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    OWNER_SUPABASE_USER_ID: process.env.OWNER_SUPABASE_USER_ID,
    OWNER_SUPABASE_EMAIL: process.env.OWNER_SUPABASE_EMAIL,
    DAILY_REPORT_RECIPIENT_EMAIL: process.env.DAILY_REPORT_RECIPIENT_EMAIL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL
  };
  const originalFetch = globalThis.fetch;

  const capturedSupabaseRequests: Array<{ url: string; method: string; apikey: string | null; authorization: string | null }> = [];
  const capturedEmail = {
    resendPayload: null as { from?: string; to?: string[]; subject?: string; text?: string; html?: string } | null,
    outboxPatchBody: null as Record<string, unknown> | null
  };

  try {
    process.env.SUPABASE_URL = 'https://bclbfqhetjiobmskecqv.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_test_key_never_send_as_bearer';
    process.env.OWNER_SUPABASE_USER_ID = '11111111-1111-4111-8111-111111111111';
    process.env.OWNER_SUPABASE_EMAIL = 'mypreparation0111@gmail.com';
    process.env.DAILY_REPORT_RECIPIENT_EMAIL = 'mypreparation0111@gmail.com';
    process.env.RESEND_API_KEY = 're_test_dummy_key';
    process.env.RESEND_FROM_EMAIL = 'Steeven Tracker <tracker@example.com>';

    const launchDayMs = Date.parse('2026-11-23T04:30:00Z'); // 10:00 AM IST on 23 Nov 2026
    let claimCount = 0;

    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      const headers = new Headers(init?.headers);

      if (url.startsWith('https://bclbfqhetjiobmskecqv.supabase.co/rest/v1/')) {
        capturedSupabaseRequests.push({
          url,
          method: init?.method || 'GET',
          apikey: headers.get('apikey'),
          authorization: headers.get('Authorization')
        });

        if (url.includes('/rpc/claim_owner_relaunch_email')) {
          claimCount += 1;
          return new Response(JSON.stringify(claimCount === 1), { status: 200 });
        }
        if (url.includes('/owner_relaunch_emails?email_type=eq.launch&select=generated_at')) {
          return new Response(JSON.stringify([{ generated_at: new Date(launchDayMs).toISOString() }]), { status: 200 });
        }
        if (url.includes('/owner_relaunch_emails?email_type=eq.launch')) {
          capturedEmail.outboxPatchBody = JSON.parse(String(init?.body || '{}')) as Record<string, unknown>;
          return new Response(null, { status: 204 });
        }
      }

      if (url === 'https://api.resend.com/emails') {
        capturedEmail.resendPayload = JSON.parse(String(init?.body || '{}')) as {
          from?: string;
          to?: string[];
          subject?: string;
          text?: string;
          html?: string;
        };
        return new Response(JSON.stringify({ id: 're_msg_launch_123' }), { status: 200 });
      }

      return new Response('Unexpected fetch', { status: 500 });
    }) as typeof fetch;

    const firstResult = await sendOwnerRelaunchAnnouncement('launch', launchDayMs);
    assert.deepEqual(firstResult, { sent: true, alreadySent: false, status: 'sent' });

    assert.equal(capturedSupabaseRequests.length, 3);
    for (const req of capturedSupabaseRequests) {
      assert.equal(req.apikey, 'sb_secret_test_key_never_send_as_bearer');
      assert.equal(
        req.authorization,
        null,
        `PostgREST must not receive Authorization: Bearer for sb_secret_ keys (${req.url})`
      );
    }

    assert.ok(capturedEmail.resendPayload);
    const mainDay1 = getSharedCurriculumDayContext('main', 1)!;
    const dsaDay1 = getSharedCurriculumDayContext('dsa', 1)!;
    const azureDay1 = getSharedCurriculumDayContext('azure', 1)!;

    assert.deepEqual(capturedEmail.resendPayload.to, ['mypreparation0111@gmail.com']);
    assert.match(capturedEmail.resendPayload.subject || '', /November 23, 2026/);
    assert.ok((capturedEmail.resendPayload.html || '').includes('https://my-preparation.vercel.app'));
    assert.ok((capturedEmail.resendPayload.text || '').includes(mainDay1.topic));
    assert.ok((capturedEmail.resendPayload.text || '').includes(dsaDay1.topic));
    assert.ok((capturedEmail.resendPayload.text || '').includes(azureDay1.topic));
    assert.equal((capturedEmail.resendPayload.html || '').includes('2026-11-16'), false);
    assert.equal((capturedEmail.resendPayload.html || '').includes('16 Nov'), false);
    assert.equal(capturedEmail.outboxPatchBody?.status, 'sent');
    assert.equal(capturedEmail.outboxPatchBody?.provider_message_id, 're_msg_launch_123');

    const secondResult = await sendOwnerRelaunchAnnouncement('launch', launchDayMs + 60_000);
    assert.deepEqual(secondResult, {
      sent: false,
      alreadySent: true,
      status: 'already_sent_or_in_progress'
    });
  } finally {
    globalThis.fetch = originalFetch;
    for (const [k, v] of Object.entries(prevEnv)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
});

test('YouTube approved channel lists, Telugu priority, non-coding quota detection, and missing-key isolation', async () => {
  assert.equal(APPROVED_CODING_CHANNELS.length, 6);
  assert.equal(new Set(APPROVED_CODING_CHANNELS.map((c) => c.channelId)).size, 6);
  assert.equal(APPROVED_AZURE_CHANNELS.length, 3);
  assert.equal(new Set(APPROVED_AZURE_CHANNELS.map((c) => c.channelId)).size, 3);

  const mainCtx = getSharedCurriculumDayContext('main', 1)!;
  const azureCtx = getSharedCurriculumDayContext('azure', 1)!;

  // Missing API key: Owner gets no direct video links; Guest non-coding gets search fallback links
  const ownerNoKey = await discoverYouTubeTutorials(azureCtx, undefined, fetch, 'owner');
  assert.equal(ownerNoKey.providerStatus, 'unavailable');
  assert.equal(ownerNoKey.tutorials.every((t) => t.linkKind === 'youtube_search_fallback' && !t.isVerifiedVideo), true);

  const guestNoKey = await discoverYouTubeTutorials(azureCtx, undefined, fetch, 'guest');
  assert.equal(guestNoKey.providerStatus, 'search_fallback_no_key');
  assert.equal(guestNoKey.tutorials.length, 3);

  // Telugu over English language priority + filtering shorts/short-duration/private/unrelated videos on non-coding topics
  const languageFetch: typeof fetch = async (input) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    if (url.includes('/youtube/v3/search')) {
      return new Response(
        JSON.stringify({
          items: [
            { id: { videoId: 'teluguVid11' }, snippet: { channelId: 'UCeduTelugu01' } },
            { id: { videoId: 'englishVid1' }, snippet: { channelId: 'UCeduEnglish1' } },
            { id: { videoId: 'shortVid123' }, snippet: { channelId: 'UCeduEnglish1' } },
            { id: { videoId: 'privateVid1' }, snippet: { channelId: 'UCeduEnglish1' } },
            { id: { videoId: 'unrelVid123' }, snippet: { channelId: 'UCeduEnglish1' } }
          ]
        }),
        { status: 200 }
      );
    }
    if (url.includes('/youtube/v3/videos')) {
      return new Response(
        JSON.stringify({
          items: [
            {
              id: 'englishVid1',
              snippet: {
                title: `${mainCtx.topic} ${mainCtx.objectives[0]} Full Tutorial`,
                channelTitle: 'Cloud Learning Academy',
                channelId: 'UCeduEnglish1',
                defaultAudioLanguage: 'en',
                description: `Detailed walkthrough of ${mainCtx.topic} covering ${mainCtx.objectives.join(' ')}.`
              },
              contentDetails: { duration: 'PT25M00S' },
              status: { privacyStatus: 'public' },
              statistics: { viewCount: '250000' }
            },
            {
              id: 'teluguVid11',
              snippet: {
                title: `${mainCtx.topic} ${mainCtx.objectives[0]} Telugu Tutorial`,
                channelTitle: 'Telugu Tech Learning',
                channelId: 'UCeduTelugu01',
                defaultAudioLanguage: 'te',
                description: `Complete explanation in Telugu for ${mainCtx.topic} and ${mainCtx.objectives.join(' ')}.`
              },
              contentDetails: { duration: 'PT18M30S' },
              status: { privacyStatus: 'public' },
              statistics: { viewCount: '12000' }
            },
            {
              id: 'shortVid123',
              snippet: {
                title: `${mainCtx.topic} #shorts quick clip`,
                channelTitle: 'Cloud Learning Academy',
                channelId: 'UCeduEnglish1',
                defaultAudioLanguage: 'en'
              },
              contentDetails: { duration: 'PT1M10S' },
              status: { privacyStatus: 'public' },
              statistics: { viewCount: '999999' }
            },
            {
              id: 'privateVid1',
              snippet: {
                title: `${mainCtx.topic} ${mainCtx.objectives[0]} Private Video`,
                channelTitle: 'Cloud Learning Academy',
                channelId: 'UCeduEnglish1',
                defaultAudioLanguage: 'en'
              },
              contentDetails: { duration: 'PT20M00S' },
              status: { privacyStatus: 'private' },
              statistics: { viewCount: '100' }
            },
            {
              id: 'unrelVid123',
              snippet: {
                title: 'Weekend Cooking Vlog & Travel Highlights',
                channelTitle: 'Cloud Learning Academy',
                channelId: 'UCeduEnglish1',
                defaultAudioLanguage: 'en'
              },
              contentDetails: { duration: 'PT15M00S' },
              status: { privacyStatus: 'public' },
              statistics: { viewCount: '500000' }
            }
          ]
        }),
        { status: 200 }
      );
    }
    if (url.includes('/youtube/v3/channels')) {
      return new Response(
        JSON.stringify({
          items: [
            {
              id: 'UCeduTelugu01',
              snippet: { title: 'Telugu Tech Learning', description: 'Educational software tutorials and courses.' },
              statistics: { subscriberCount: '25000', videoCount: '120' }
            },
            {
              id: 'UCeduEnglish1',
              snippet: { title: 'Cloud Learning Academy', description: 'Engineering training tutorials and courses.' },
              statistics: { subscriberCount: '120000', videoCount: '300' }
            }
          ]
        }),
        { status: 200 }
      );
    }
    return new Response(null, { status: 404 });
  };

  const discovered = await discoverYouTubeTutorials(mainCtx, 'AIzaSyFakeNonCodingKey123456', languageFetch, 'owner');
  assert.equal(discovered.providerStatus, 'youtube_api_verified');
  assert.equal(discovered.tutorials.length, 2);
  assert.equal(discovered.tutorials[0].videoId, 'teluguVid11', 'Telugu explanation must rank ahead of English even with fewer views');
  assert.equal(discovered.tutorials[1].videoId, 'englishVid1');

  // 403 quotaExceeded surfaces search_fallback_quota while keeping tutorials fail-closed ([])
  const quotaFetch: typeof fetch = async () =>
    new Response(
      JSON.stringify({
        error: {
          code: 403,
          message: 'The request cannot be completed because you have exceeded your quota.',
          errors: [{ reason: 'quotaExceeded' }]
        }
      }),
      { status: 403 }
    );
  const quotaResult = await discoverYouTubeTutorials(azureCtx, 'AIzaSyFakeQuotaKey123456', quotaFetch, 'owner');
  assert.equal(quotaResult.providerStatus, 'search_fallback_quota');
  assert.equal(quotaResult.tutorials.length, 0);
  assert.match(quotaResult.statusNote, /quota exceeded/i);
});

test('UI & Edge regression checks: zero mojibake across src/, Day 100 Mar 2027 label, ResourceLibrary groupBy sections, and Nov 23 Edge message', () => {
  const srcFiles = collectSourceFiles(path.resolve(process.cwd(), 'src'));
  const mojibakePattern = /â€”|â€“|Â·|â€¢|â€™|â€œ|\uFFFD/;
  const offenders: string[] = [];
  for (const file of srcFiles) {
    const content = readFileSync(file, 'utf8');
    if (mojibakePattern.test(content)) {
      offenders.push(path.relative(process.cwd(), file));
    }
  }
  assert.deepEqual(offenders, [], `Mojibake sequences found in: ${offenders.join(', ')}`);

  const calendarSrc = readFileSync(path.resolve(process.cwd(), 'src/components/PreparationCalendarPage.tsx'), 'utf8');
  assert.ok(calendarSrc.includes('Day 100 (Mar 2027)'));
  assert.equal(calendarSrc.includes('Day 100 (Feb 2027)'), false);

  const librarySrc = readFileSync(path.resolve(process.cwd(), 'src/components/ResourceLibraryPage.tsx'), 'utf8');
  assert.ok(librarySrc.includes('groupedResources'));
  assert.ok(librarySrc.includes("groupBy === 'list'"));
  assert.ok(librarySrc.includes('groupedResources.map'));

  const edgeIndexSrc = readFileSync(path.resolve(process.cwd(), 'supabase/functions/daily-learning-resources/index.ts'), 'utf8');
  assert.ok(edgeIndexSrc.includes('23 Nov 2026 00:00 IST'));
  assert.equal(edgeIndexSrc.includes('16 Nov 2026'), false);
});

test('ephemeral Express HTTP smoke checks across health, relaunch status, auth gates, Guest vs Owner daily resources, and email preview', async () => {
  const app = await createApp({ attachFrontend: false });
  const server = await new Promise<ReturnType<typeof app.listen>>((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });

  try {
    const { port } = server.address() as AddressInfo;
    const base = `http://127.0.0.1:${port}`;

    const healthResp = await fetch(`${base}/api/health`);
    assert.equal(healthResp.status, 200);
    const healthJson = (await healthResp.json()) as { ok: boolean; timezone: string };
    assert.equal(healthJson.ok, true);
    assert.equal(healthJson.timezone, 'Asia/Kolkata');

    const relaunchResp = await fetch(`${base}/api/relaunch/status`);
    assert.equal(relaunchResp.status, 200);
    const relaunchJson = (await relaunchResp.json()) as { unlocked: boolean; launchAtIso: string };
    assert.equal(relaunchJson.unlocked, true);
    assert.equal(relaunchJson.launchAtIso, '2026-11-23T00:00:00+05:30');

    const previewResp = await fetch(`${base}/api/daily-resources/email-preview`);
    assert.equal(previewResp.status, 200);
    const previewJson = (await previewResp.json()) as { ok: boolean; istDateLabel: string; html: string };
    assert.equal(previewJson.ok, true);
    assert.match(previewJson.istDateLabel, /23 Nov 2026/i);
    assert.equal(previewJson.html.includes('2026-11-16'), false);

    const verifyOwnerResp = await fetch(`${base}/api/auth/verify-owner`, { method: 'POST' });
    assert.equal(verifyOwnerResp.status, 401);

    const ownerDailyResp = await fetch(`${base}/api/daily-resources?role=owner`);
    assert.equal(ownerDailyResp.status, 401);

    const guestDailyResp = await fetch(`${base}/api/daily-resources?role=guest`);
    assert.equal(guestDailyResp.status, 200);
    const guestDailyJson = (await guestDailyResp.json()) as {
      tracks: { main: unknown; dsa: unknown; azure: unknown };
    };
    assert.ok(guestDailyJson.tracks.main);
    assert.ok(guestDailyJson.tracks.dsa);
    assert.ok(guestDailyJson.tracks.azure);

    const announcementResp = await fetch(`${base}/api/relaunch/announcement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'restart' })
    });
    assert.equal(announcementResp.status, 401);

    const cronResp = await fetch(`${base}/api/relaunch/cron`);
    assert.equal(cronResp.status === 401 || cronResp.status === 500, true);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
});
