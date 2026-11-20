import fs from 'node:fs/promises';
import path from 'node:path';
import type {
  DailyResourcesDashboardPayload,
  TrackDailyAiResources,
  TrackId
} from '../src/types/index.ts';
import { generateGroundedDailyBrief } from './geminiService.ts';
import { fetchRegisteredOwnerUserId } from './auth.ts';
import { isPlaceholderUuidValue, isValidUuid } from './supabaseConfig.ts';
import {
  buildAutomationStatusSummary,
  buildCombinedActionPlan,
  buildDailyEmailContent,
  buildDeterministicReadOnlyTrack,
  DEFAULT_APP_URL,
  DEFAULT_DAILY_RECIPIENT,
  fetchLatestAutomationRunFromSupabase,
  fetchTrackBriefFromSupabase,
  generateTrackDailyCanonical,
  getIstScheduleSnapshotCanonical,
  LEGACY_GUEST_START_DATE_IST,
  isSupabaseServerConfigured,
  isTrackDayCurrentlyUnlockedCanonical,
  sendDailyEmailViaResend,
  syncAutomationRunToSupabase,
  type CanonicalAutomationRunRecord,
  type CanonicalCacheStore,
  type CanonicalDailyDashboardPayload,
  type PipelineEnvConfig
} from '../supabase/functions/daily-learning-resources/pipeline.ts';

const CACHE_DIR = path.resolve(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'daily_resources.json');

let memoryStore: CanonicalCacheStore | null = null;
let writeQueue: Promise<void> = Promise.resolve();
let activeDailyRunPromise: Promise<{
  payload: DailyResourcesDashboardPayload;
  alreadyRanToday: boolean;
}> | null = null;
let schedulerStarted = false;

export function isEphemeralServerlessRuntime(): boolean {
  return process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
}

export function getServerPipelineConfig(): PipelineEnvConfig {
  return {
    supabaseUrl: (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim(),
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || '',
    ownerUserId: (process.env.OWNER_SUPABASE_USER_ID || process.env.VITE_OWNER_USER_ID || '').trim(),
    geminiApiKey: process.env.PREPARATION_GEMINI_KEY?.trim(),
    youtubeApiKey: process.env.YOUTUBE_API_KEY?.trim(),
    resendApiKey: process.env.RESEND_API_KEY?.trim(),
    resendFromEmail: process.env.RESEND_FROM_EMAIL?.trim(),
    dailyRecipientEmail:
      (process.env.DAILY_REPORT_RECIPIENT_EMAIL || DEFAULT_DAILY_RECIPIENT).trim() ||
      DEFAULT_DAILY_RECIPIENT,
    appUrl: (process.env.APP_URL || DEFAULT_APP_URL).trim() || DEFAULT_APP_URL,
    geminiCaller: generateGroundedDailyBrief
  };
}

let cachedRegistryOwnerId: { ownerUserId: string; fetchedAt: number } | null = null;

export async function getResolvedServerPipelineConfig(): Promise<PipelineEnvConfig> {
  const base = getServerPipelineConfig();
  const rawOwnerId = (base.ownerUserId || '').trim();
  if (rawOwnerId && isValidUuid(rawOwnerId)) {
    return base;
  }

  if (
    (!rawOwnerId || isPlaceholderUuidValue(rawOwnerId)) &&
    base.supabaseUrl &&
    base.supabaseServiceRoleKey
  ) {
    if (cachedRegistryOwnerId && Date.now() - cachedRegistryOwnerId.fetchedAt < 60_000) {
      return { ...base, ownerUserId: cachedRegistryOwnerId.ownerUserId };
    }
    const lookup = await fetchRegisteredOwnerUserId({
      supabaseUrl: base.supabaseUrl,
      serviceRoleKey: base.supabaseServiceRoleKey
    });
    if (lookup.status === 'found') {
      cachedRegistryOwnerId = { ownerUserId: lookup.ownerUserId, fetchedAt: Date.now() };
      return { ...base, ownerUserId: lookup.ownerUserId };
    }
  }

  return base;
}

export async function getDailyEmailPreview(options?: {
  track?: TrackId | 'combined';
  day?: number;
}): Promise<{
  mode: TrackId | 'combined';
  subject: string;
  html: string;
  text: string;
  appUrl: string;
  istDate: string;
  istDateLabel: string;
  unlockedDays: DailyResourcesDashboardPayload['unlockedDays'];
}> {
  const mode: TrackId | 'combined' = options?.track || 'combined';
  const trackArg: TrackId | undefined = mode === 'combined' ? undefined : mode;

  const dashboard = await getDailyResourcesDashboard({
    track: trackArg,
    day: trackArg ? options?.day : undefined
  });

  const config = await getResolvedServerPipelineConfig();
  const rendered = buildDailyEmailContent(
    dashboard as unknown as CanonicalDailyDashboardPayload,
    config.appUrl,
    { track: trackArg }
  );

  return {
    mode,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    appUrl: rendered.appUrl,
    istDate: dashboard.istDate,
    istDateLabel: dashboard.istDateLabel,
    unlockedDays: dashboard.unlockedDays
  };
}

function getCacheKey(trackId: TrackId, dayNumber: number): string {
  return `${trackId}_day_${dayNumber}`;
}

async function readLocalDevStore(): Promise<CanonicalCacheStore> {
  if (isEphemeralServerlessRuntime()) {
    return { resourcesByKey: {}, automationRuns: {} };
  }
  if (memoryStore) return memoryStore;
  try {
    const raw = await fs.readFile(CACHE_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<CanonicalCacheStore>;
    memoryStore = {
      resourcesByKey: parsed.resourcesByKey || {},
      automationRuns: parsed.automationRuns || {}
    };
  } catch {
    memoryStore = { resourcesByKey: {}, automationRuns: {} };
  }
  return memoryStore;
}

async function persistLocalDevStore(store: CanonicalCacheStore): Promise<void> {
  if (isEphemeralServerlessRuntime()) return;
  memoryStore = store;
  writeQueue = writeQueue.then(async () => {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(CACHE_FILE, JSON.stringify(store, null, 2), 'utf8');
  });
  await writeQueue;
}

async function tryDelegateToSupabaseEdgeFunction(body: Record<string, unknown>): Promise<{
  delegated: boolean;
  data?: {
    ok?: boolean;
    track?: TrackDailyAiResources;
    dashboard?: DailyResourcesDashboardPayload;
    alreadyRanToday?: boolean;
  };
}> {
  const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '')
    .trim()
    .replace(/\/$/, '');
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!supabaseUrl || !cronSecret) {
    return { delegated: false };
  }

  try {
    const resp = await fetch(`${supabaseUrl}/functions/v1/daily-learning-resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cronSecret}`
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000)
    });
    if (!resp.ok) {
      return { delegated: false };
    }
    const json = (await resp.json().catch(() => null)) as {
      ok?: boolean;
      track?: TrackDailyAiResources;
      dashboard?: DailyResourcesDashboardPayload;
      alreadyRanToday?: boolean;
    } | null;
    if (!json || json.ok === false) return { delegated: false };
    return { delegated: true, data: json };
  } catch {
    return { delegated: false };
  }
}

export async function generateTrackDailyResources(
  trackId: TrackId,
  dayNumber: number,
  options?: { forceRefresh?: boolean; persistToCloud?: boolean; role?: 'owner' | 'guest' }
): Promise<TrackDailyAiResources> {
  const scheduleStartIsoIst = options?.role === 'guest' ? LEGACY_GUEST_START_DATE_IST : undefined;
  if (!isTrackDayCurrentlyUnlockedCanonical(trackId, dayNumber, Date.now(), scheduleStartIsoIst)) {
    throw new Error(
      `LOCKED_FUTURE_DAY: ${trackId.toUpperCase()} Day ${dayNumber} unlocks at 00:00 IST on its scheduled date.`
    );
  }

  const config = await getResolvedServerPipelineConfig();
  const ephemeral = isEphemeralServerlessRuntime();

  // In production/Vercel with Supabase Edge Function ready, delegate Owner refresh directly to Edge
  if (ephemeral && options?.forceRefresh && options?.persistToCloud !== false) {
    const delegated = await tryDelegateToSupabaseEdgeFunction({
      action: 'refresh_track',
      trackId,
      dayNumber
    });
    if (delegated.delegated && delegated.data?.track) {
      return delegated.data.track;
    }
  }

  const key = getCacheKey(trackId, dayNumber);
  const store = await readLocalDevStore();
  const expectedPlanDate = buildDeterministicReadOnlyTrack(trackId, dayNumber, config, undefined, scheduleStartIsoIst)?.planDate;
  const existingCached =
    (isSupabaseServerConfigured(config)
      ? await fetchTrackBriefFromSupabase(trackId, dayNumber, config, options?.role || 'owner')
      : null) || store.resourcesByKey[key] || null;
  const currentCycleCached = existingCached?.planDate === expectedPlanDate ? existingCached : null;

  const result = (await generateTrackDailyCanonical(trackId, dayNumber, config, {
    forceRefresh: options?.forceRefresh,
    persistToCloud: options?.persistToCloud,
    existingCached: currentCycleCached,
    scheduleStartIsoIst,
    role: options?.role || 'owner'
  })) as TrackDailyAiResources;

  if (!ephemeral) {
    store.resourcesByKey[key] = result;
    await persistLocalDevStore(store);
  }

  return result;
}

export async function getDailyResourcesDashboard(options?: {
  track?: TrackId;
  day?: number;
  forceRefresh?: boolean;
  role?: 'owner' | 'guest';
}): Promise<DailyResourcesDashboardPayload> {
  const scheduleStartIsoIst = options?.role === 'guest' ? LEGACY_GUEST_START_DATE_IST : undefined;
  const snapshot = getIstScheduleSnapshotCanonical(Date.now(), scheduleStartIsoIst);
  const config = await getResolvedServerPipelineConfig();
  const ephemeral = isEphemeralServerlessRuntime();
  const sbConfigured = isSupabaseServerConfigured(config);

  const mainDay = options?.track === 'main' && options.day ? options.day : snapshot.unlockedDays.main;
  const dsaDay = options?.track === 'dsa' && options.day ? options.day : snapshot.unlockedDays.dsa;
  const azureDay = options?.track === 'azure' && options.day ? options.day : snapshot.unlockedDays.azure;

  const resolveTrackForGet = async (
    trackId: TrackId,
    dayNumber: number
  ): Promise<TrackDailyAiResources | null> => {
    if (!snapshot.isPreparationStarted || dayNumber < 1) return null;

    if (ephemeral) {
      // Production / Vercel GET: read Supabase first, otherwise deterministic read-only view (zero file cache / zero server mutations)
      if (sbConfigured && !(options?.forceRefresh && options?.track === trackId)) {
        const fromDb = await fetchTrackBriefFromSupabase(trackId, dayNumber, config, options?.role || 'owner');
        const expectedPlanDate = buildDeterministicReadOnlyTrack(trackId, dayNumber, config, undefined, scheduleStartIsoIst)?.planDate;
        if (fromDb?.planDate === expectedPlanDate) return fromDb as TrackDailyAiResources;
      }
      return buildDeterministicReadOnlyTrack(trackId, dayNumber, config, undefined, scheduleStartIsoIst) as TrackDailyAiResources | null;
    }

    // Local dev mode: use shared canonical pipeline + local cache
    return generateTrackDailyResources(trackId, dayNumber, {
      forceRefresh: options?.forceRefresh && options?.track === trackId,
      persistToCloud: false,
      role: options?.role || 'owner'
    });
  };

  let mainRes: TrackDailyAiResources | null = null;
  let dsaRes: TrackDailyAiResources | null = null;
  let azureRes: TrackDailyAiResources | null = null;
  if (ephemeral) {
    [mainRes, dsaRes, azureRes] = await Promise.all([
      resolveTrackForGet('main', mainDay),
      resolveTrackForGet('dsa', dsaDay),
      resolveTrackForGet('azure', azureDay)
    ]);
  } else {
    mainRes = await resolveTrackForGet('main', mainDay);
    dsaRes = await resolveTrackForGet('dsa', dsaDay);
    azureRes = await resolveTrackForGet('azure', azureDay);
  }

  let latestRun: CanonicalAutomationRunRecord | null = null;
  if (sbConfigured) {
    latestRun = await fetchLatestAutomationRunFromSupabase(config);
  }
  if (!latestRun && !ephemeral) {
    const store = await readLocalDevStore();
    latestRun =
      Object.values(store.automationRuns).sort((a, b) => b.ranAt.localeCompare(a.ranAt))[0] || null;
  }

  return {
    istDate: snapshot.istDate,
    istDateLabel: snapshot.istDateLabel,
    isPreparationStarted: snapshot.isPreparationStarted,
    unlockedDays: snapshot.unlockedDays,
    tracks: {
      main: mainRes,
      dsa: dsaRes,
      azure: azureRes
    },
    automation: buildAutomationStatusSummary(config, latestRun),
    actionPlan: buildCombinedActionPlan(mainRes, dsaRes, azureRes)
  };
}

export async function runDailyAutomationJob(options?: {
  triggerSource?: string;
  sendEmail?: boolean;
  bypassIdempotency?: boolean;
}): Promise<{
  payload: DailyResourcesDashboardPayload;
  alreadyRanToday: boolean;
}> {
  if (activeDailyRunPromise) {
    return activeDailyRunPromise;
  }

  activeDailyRunPromise = (async () => {
    const triggerSource = options?.triggerSource || 'manual_owner';
    const shouldSendEmail = options?.sendEmail !== false;
    const config = await getResolvedServerPipelineConfig();
    const ephemeral = isEphemeralServerlessRuntime();
    const sbConfigured = isSupabaseServerConfigured(config);
    const snapshot = getIstScheduleSnapshotCanonical();

    if (ephemeral) {
      const delegated = await tryDelegateToSupabaseEdgeFunction({
        action: 'run_daily',
        triggerSource,
        sendEmail: shouldSendEmail,
        bypassIdempotency: Boolean(options?.bypassIdempotency)
      });
      if (delegated.delegated && delegated.data?.dashboard) {
        return {
          payload: delegated.data.dashboard,
          alreadyRanToday: Boolean(delegated.data.alreadyRanToday)
        };
      }
    }

    const runKey = `daily_10am_ist_${snapshot.istDate}`;
    const store = await readLocalDevStore();
    const existingRun =
      (sbConfigured ? await fetchLatestAutomationRunFromSupabase(config, runKey) : null) ||
      store.automationRuns[runKey] ||
      null;

    if (existingRun && existingRun.emailSent && !options?.bypassIdempotency) {
      const currentPayload = await getDailyResourcesDashboard();
      return { payload: currentPayload, alreadyRanToday: true };
    }

    if (!snapshot.isPreparationStarted) {
      const currentPayload = await getDailyResourcesDashboard();
      return { payload: currentPayload, alreadyRanToday: false };
    }

    const startedAt = new Date().toISOString();
    const [mainRes, dsaRes, azureRes] = await Promise.all([
      generateTrackDailyResources('main', snapshot.unlockedDays.main, {
        forceRefresh: true,
        persistToCloud: true
      }),
      generateTrackDailyResources('dsa', snapshot.unlockedDays.dsa, {
        forceRefresh: true,
        persistToCloud: true
      }),
      generateTrackDailyResources('azure', snapshot.unlockedDays.azure, {
        forceRefresh: true,
        persistToCloud: true
      })
    ]);

    const dashboardBeforeEmail = await getDailyResourcesDashboard();
    dashboardBeforeEmail.tracks = { main: mainRes, dsa: dsaRes, azure: azureRes };
    dashboardBeforeEmail.actionPlan = buildCombinedActionPlan(mainRes, dsaRes, azureRes);

    let emailSent = existingRun?.emailSent || false;
    let emailStatus = existingRun?.emailStatus || 'not_sent';
    let emailProviderId = existingRun?.emailProviderId || null;
    let emailError = existingRun?.emailError || null;

    if (shouldSendEmail && (!existingRun?.emailSent || options?.bypassIdempotency)) {
      const emailResult = await sendDailyEmailViaResend(dashboardBeforeEmail, config, {
        idempotencySuffix: options?.bypassIdempotency ? String(Date.now()) : undefined
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

    if (!ephemeral) {
      const freshStore = await readLocalDevStore();
      freshStore.automationRuns[runKey] = {
        runKey,
        runDate: snapshot.istDate,
        ranAt: completedAt,
        startedAt,
        completedAt,
        triggerSource,
        overallStatus,
        trackStatuses,
        emailSent,
        emailStatus,
        emailProviderId,
        emailError
      };
      await persistLocalDevStore(freshStore);
    }

    await syncAutomationRunToSupabase(
      {
        runKey,
        runDate: snapshot.istDate,
        triggerSource,
        overallStatus,
        trackStatuses,
        emailStatus,
        recipientEmail: dashboardBeforeEmail.automation.recipientEmail,
        emailProviderId,
        errorMessage: emailError,
        startedAt,
        completedAt,
        ranAt: completedAt
      },
      config
    );

    const finalPayload = await getDailyResourcesDashboard();
    finalPayload.tracks = { main: mainRes, dsa: dsaRes, azure: azureRes };
    finalPayload.actionPlan = buildCombinedActionPlan(mainRes, dsaRes, azureRes);
    return { payload: finalPayload, alreadyRanToday: false };
  })();

  try {
    return await activeDailyRunPromise;
  } finally {
    activeDailyRunPromise = null;
  }
}

export function startDaily10AmIstScheduler(): void {
  // Never spawn in-process setInterval timers inside production/serverless runtimes;
  // production scheduling uses Supabase pg_cron at 04:30 UTC (10:00 AM IST).
  if (isEphemeralServerlessRuntime()) return;
  if (schedulerStarted) return;
  schedulerStarted = true;

  const checkAndTrigger = async () => {
    try {
      const snapshot = getIstScheduleSnapshotCanonical();
      if (!snapshot.isPreparationStarted) return;

      if (snapshot.istHour === 10 && snapshot.istMinute <= 15) {
        const store = await readLocalDevStore();
        const runKey = `daily_10am_ist_${snapshot.istDate}`;
        if (!store.automationRuns[runKey]) {
          await runDailyAutomationJob({
            triggerSource: 'cron_10am_ist',
            sendEmail: true
          });
        }
      }
    } catch {
      // Resilient scheduler loop in local dev
    }
  };

  setInterval(checkAndTrigger, 30 * 1000);
}
