// Supabase Edge Function: daily-learning-resources
// Scheduled via pg_cron at 30 4 * * * UTC (10:00 AM Asia/Kolkata) or delegated by Owner server routes.
// Uses Free Tier Gemini (gemini-4-hydrogen), YouTube Data API v3, and Resend Free Tier via shared canonical pipeline.

import type { SharedTrackId } from './catalogData.ts';
import {
  buildAutomationStatusSummary,
  buildCombinedActionPlan,
  DEFAULT_APP_URL,
  DEFAULT_DAILY_RECIPIENT,
  fetchLatestAutomationRunFromSupabase,
  fetchTrackBriefFromSupabase,
  generateTrackDailyCanonical,
  getIstScheduleSnapshotCanonical,
  isSupabaseServerConfigured,
  isTrackDayCurrentlyUnlockedCanonical,
  sendDailyEmailViaResend,
  syncAutomationRunToSupabase,
  verifyCronRequest,
  type CanonicalDailyDashboardPayload,
  type PipelineEnvConfig
} from './pipeline.ts';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function getEdgeConfig(): PipelineEnvConfig {
  return {
    supabaseUrl: Deno.env.get('SUPABASE_URL')?.trim(),
    supabaseServiceRoleKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim(),
    ownerUserId: Deno.env.get('OWNER_SUPABASE_USER_ID')?.trim(),
    geminiApiKey: Deno.env.get('PREPARATION_GEMINI_KEY')?.trim(),
    youtubeApiKey: Deno.env.get('YOUTUBE_API_KEY')?.trim(),
    resendApiKey: Deno.env.get('RESEND_API_KEY')?.trim(),
    resendFromEmail: Deno.env.get('RESEND_FROM_EMAIL')?.trim(),
    dailyRecipientEmail:
      (Deno.env.get('DAILY_REPORT_RECIPIENT_EMAIL') || DEFAULT_DAILY_RECIPIENT).trim(),
    appUrl: (Deno.env.get('APP_URL') || DEFAULT_APP_URL).trim()
  };
}

export { verifyCronRequest };

function isValidTrackId(value: unknown): value is SharedTrackId {
  return value === 'main' || value === 'dsa' || value === 'azure';
}

Deno.serve(async (req) => {
  try {
    // 1. Fail-closed CRON_SECRET check (never bypasses when CRON_SECRET is empty)
    const authResult = verifyCronRequest(
      req.headers.get('Authorization'),
      Deno.env.get('CRON_SECRET')
    );
    if (!authResult.authorized) {
      return jsonResponse({ ok: false, error: authResult.error }, authResult.status);
    }

    const config = getEdgeConfig();
    if (!isSupabaseServerConfigured(config)) {
      return jsonResponse(
        {
          ok: false,
          error: 'SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or OWNER_SUPABASE_USER_ID missing.'
        },
        500
      );
    }

    let body: {
      action?: string;
      trackId?: unknown;
      dayNumber?: unknown;
      sendEmail?: boolean;
      bypassIdempotency?: boolean;
      triggerSource?: string;
    } = {};
    if (req.method === 'POST') {
      body = await req.json().catch(() => ({}));
    }

    const snapshot = getIstScheduleSnapshotCanonical();

    // Handle single-track Owner refresh delegation
    if (body.action === 'refresh_track') {
      if (!isValidTrackId(body.trackId)) {
        return jsonResponse({ ok: false, error: 'Valid trackId (main | dsa | azure) is required.' }, 400);
      }
      const parsedDay = Number(body.dayNumber);
      if (!Number.isInteger(parsedDay) || parsedDay < 1) {
        return jsonResponse({ ok: false, error: 'Valid positive integer dayNumber is required.' }, 400);
      }
      if (!isTrackDayCurrentlyUnlockedCanonical(body.trackId, parsedDay)) {
        return jsonResponse(
          {
            ok: false,
            error: `Day ${parsedDay} of ${body.trackId.toUpperCase()} is locked until 00:00 IST on its scheduled date.`
          },
          403
        );
      }

      const existingCached = await fetchTrackBriefFromSupabase(body.trackId, parsedDay, config);
      const updatedTrack = await generateTrackDailyCanonical(body.trackId, parsedDay, config, {
        forceRefresh: true,
        persistToCloud: true,
        existingCached
      });

      const [mainRes, dsaRes, azureRes, latestRun] = await Promise.all([
        body.trackId === 'main'
          ? Promise.resolve(updatedTrack)
          : snapshot.unlockedDays.main >= 1
          ? fetchTrackBriefFromSupabase('main', snapshot.unlockedDays.main, config)
          : Promise.resolve(null),
        body.trackId === 'dsa'
          ? Promise.resolve(updatedTrack)
          : snapshot.unlockedDays.dsa >= 1
          ? fetchTrackBriefFromSupabase('dsa', snapshot.unlockedDays.dsa, config)
          : Promise.resolve(null),
        body.trackId === 'azure'
          ? Promise.resolve(updatedTrack)
          : snapshot.unlockedDays.azure >= 1
          ? fetchTrackBriefFromSupabase('azure', snapshot.unlockedDays.azure, config)
          : Promise.resolve(null),
        fetchLatestAutomationRunFromSupabase(config)
      ]);

      const dashboard: CanonicalDailyDashboardPayload = {
        istDate: snapshot.istDate,
        istDateLabel: snapshot.istDateLabel,
        isPreparationStarted: snapshot.isPreparationStarted,
        unlockedDays: snapshot.unlockedDays,
        tracks: { main: mainRes, dsa: dsaRes, azure: azureRes },
        automation: buildAutomationStatusSummary(config, latestRun),
        actionPlan: buildCombinedActionPlan(mainRes, dsaRes, azureRes)
      };

      return jsonResponse({ ok: true, track: updatedTrack, dashboard });
    }

    // Default / action === 'run_daily'
    if (!snapshot.isPreparationStarted) {
      const latestRun = await fetchLatestAutomationRunFromSupabase(config);
      const dashboard: CanonicalDailyDashboardPayload = {
        istDate: snapshot.istDate,
        istDateLabel: snapshot.istDateLabel,
        isPreparationStarted: false,
        unlockedDays: snapshot.unlockedDays,
        tracks: { main: null, dsa: null, azure: null },
        automation: buildAutomationStatusSummary(config, latestRun),
        actionPlan: buildCombinedActionPlan(null, null, null)
      };
      return jsonResponse({
        ok: true,
        alreadyRanToday: false,
        message: 'Preparation schedule starts on 23 Nov 2026 00:00 IST.',
        dashboard
      });
    }

    const runKey = `daily_10am_ist_${snapshot.istDate}`;
    const existingRun = await fetchLatestAutomationRunFromSupabase(config, runKey);

    if (existingRun && existingRun.emailSent && !body.bypassIdempotency) {
      const [mainRes, dsaRes, azureRes] = await Promise.all([
        fetchTrackBriefFromSupabase('main', snapshot.unlockedDays.main, config),
        fetchTrackBriefFromSupabase('dsa', snapshot.unlockedDays.dsa, config),
        fetchTrackBriefFromSupabase('azure', snapshot.unlockedDays.azure, config)
      ]);
      const dashboard: CanonicalDailyDashboardPayload = {
        istDate: snapshot.istDate,
        istDateLabel: snapshot.istDateLabel,
        isPreparationStarted: snapshot.isPreparationStarted,
        unlockedDays: snapshot.unlockedDays,
        tracks: { main: mainRes, dsa: dsaRes, azure: azureRes },
        automation: buildAutomationStatusSummary(config, existingRun),
        actionPlan: buildCombinedActionPlan(mainRes, dsaRes, azureRes)
      };
      return jsonResponse({ ok: true, alreadyRanToday: true, run: existingRun, dashboard });
    }

    const startedAt = new Date().toISOString();
    const [cachedMain, cachedDsa, cachedAzure] = await Promise.all([
      fetchTrackBriefFromSupabase('main', snapshot.unlockedDays.main, config),
      fetchTrackBriefFromSupabase('dsa', snapshot.unlockedDays.dsa, config),
      fetchTrackBriefFromSupabase('azure', snapshot.unlockedDays.azure, config)
    ]);

    const [mainRes, dsaRes, azureRes] = await Promise.all([
      generateTrackDailyCanonical('main', snapshot.unlockedDays.main, config, {
        forceRefresh: true,
        persistToCloud: true,
        existingCached: cachedMain
      }),
      generateTrackDailyCanonical('dsa', snapshot.unlockedDays.dsa, config, {
        forceRefresh: true,
        persistToCloud: true,
        existingCached: cachedDsa
      }),
      generateTrackDailyCanonical('azure', snapshot.unlockedDays.azure, config, {
        forceRefresh: true,
        persistToCloud: true,
        existingCached: cachedAzure
      })
    ]);

    const payloadBeforeEmail: CanonicalDailyDashboardPayload = {
      istDate: snapshot.istDate,
      istDateLabel: snapshot.istDateLabel,
      isPreparationStarted: snapshot.isPreparationStarted,
      unlockedDays: snapshot.unlockedDays,
      tracks: { main: mainRes, dsa: dsaRes, azure: azureRes },
      automation: buildAutomationStatusSummary(config, existingRun),
      actionPlan: buildCombinedActionPlan(mainRes, dsaRes, azureRes)
    };

    const shouldSendEmail = body.sendEmail !== false;
    let emailSent = existingRun?.emailSent || false;
    let emailStatus = existingRun?.emailStatus || 'not_sent';
    let emailProviderId = existingRun?.emailProviderId || null;
    let emailError = existingRun?.emailError || null;

    if (shouldSendEmail && (!existingRun?.emailSent || body.bypassIdempotency)) {
      const emailResult = await sendDailyEmailViaResend(payloadBeforeEmail, config, {
        idempotencySuffix: body.bypassIdempotency ? String(Date.now()) : undefined
      });
      emailSent = emailResult.sent;
      emailStatus = emailResult.emailStatus;
      emailProviderId = emailResult.providerMessageId || null;
      emailError = emailResult.errorMessage || null;
    }

    const allUpdated =
      mainRes.status === 'updated' &&
      dsaRes.status === 'updated' &&
      azureRes.status === 'updated' &&
      (!shouldSendEmail || emailSent);

    const overallStatus: 'success' | 'partial' | 'failed' = allUpdated ? 'success' : 'partial';
    const completedAt = new Date().toISOString();
    const trackStatuses = {
      main: mainRes.status,
      dsa: dsaRes.status,
      azure: azureRes.status
    };

    await syncAutomationRunToSupabase(
      {
        runKey,
        runDate: snapshot.istDate,
        triggerSource: body.triggerSource || 'supabase_edge_10am_ist',
        overallStatus,
        trackStatuses,
        emailStatus,
        recipientEmail: payloadBeforeEmail.automation.recipientEmail,
        emailProviderId,
        errorMessage: emailError,
        startedAt,
        completedAt,
        ranAt: completedAt
      },
      config
    );

    const finalRun = await fetchLatestAutomationRunFromSupabase(config, runKey);
    const dashboard: CanonicalDailyDashboardPayload = {
      ...payloadBeforeEmail,
      automation: buildAutomationStatusSummary(config, finalRun || {
        runKey,
        runDate: snapshot.istDate,
        ranAt: completedAt,
        triggerSource: body.triggerSource || 'supabase_edge_10am_ist',
        overallStatus,
        emailSent,
        emailStatus,
        emailProviderId,
        emailError
      })
    };

    return jsonResponse({
      ok: true,
      alreadyRanToday: false,
      istDate: snapshot.istDate,
      emailStatus,
      emailProviderId,
      emailError,
      dashboard
    });
  } catch (err) {
    return jsonResponse(
      {
        ok: false,
        error: err instanceof Error ? err.message : 'Edge function failure'
      },
      500
    );
  }
});
