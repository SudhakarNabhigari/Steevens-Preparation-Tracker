import {
  getSharedCurriculumDayContext,
  getSharedDsaDailyLeetCodeTriplet,
  getSharedOfficialDocs,
  type SharedCurriculumDayContext,
  type SharedDailyLeetCodeQuestion,
  type SharedDailyReferenceLink,
  type SharedTrackId
} from './catalogData.ts';

export const START_DATE_IST = '2026-11-16T00:00:00+05:30';
export const DAY_MS = 24 * 60 * 60 * 1000;
export const MAIN_TRACK_MAX_DAYS = 180;
export const SUB_TRACK_MAX_DAYS = 100;
export const DEFAULT_DAILY_RECIPIENT = 'mypreparation0111@gmail.com';
export const DEFAULT_APP_URL = 'https://my-preparation.vercel.app';
export const FREE_TIER_GEMINI_MODEL = 'gemini-4-hydrogen';

export type CanonicalResourceStatus =
  | 'loading'
  | 'updated'
  | 'partially_updated'
  | 'cached'
  | 'failed'
  | 'unavailable';

export interface CanonicalYouTubeResource {
  id: string;
  title: string;
  channelName: string;
  url: string;
  videoId?: string;
  topicCovered: string;
  explanation: string;
  whyUseful: string;
  duration?: string;
  language?: string;
  isVerifiedVideo: boolean;
  linkKind: 'verified_video' | 'youtube_search_fallback';
}

export interface CanonicalTrackDailyResources {
  trackId: SharedTrackId;
  trackLabel: string;
  planDay: number;
  planDate: string;
  dateLabel: string;
  topicTitle: string;
  phaseOrModule: string;
  learningObjectives: string[];
  topicExplanation: string;
  suggestedLearningOrder: string[];
  dailyGuidance: string;
  practicalExerciseSummary: string;
  youtubeTutorials: CanonicalYouTubeResource[];
  leetcodeQuestions: SharedDailyLeetCodeQuestion[];
  officialDocs: SharedDailyReferenceLink[];
  practicalExercises: SharedDailyReferenceLink[];
  status: CanonicalResourceStatus;
  statusMessage: string;
  aiProviderStatus: 'gemini_generated' | 'quota_exhausted_cached' | 'missing_api_key' | 'unavailable';
  youtubeProviderStatus:
    | 'youtube_api_verified'
    | 'search_fallback_no_key'
    | 'search_fallback_quota'
    | 'unavailable';
  modelUsed?: string;
  generatedAt: string;
  updatedAt: string;
}

export interface CanonicalAutomationStatus {
  scheduleLabel: string;
  timezone: string;
  recipientEmail: string;
  lastRunDate: string | null;
  lastRunAt: string | null;
  overallStatus: 'success' | 'partial' | 'failed' | 'not_run_yet';
  emailStatus:
    | 'sent'
    | 'failed'
    | 'awaiting_credentials'
    | 'awaiting_sender_verification'
    | 'not_sent';
  emailProviderId?: string | null;
  emailError?: string | null;
  missingSecrets: string[];
  geminiConfigured: boolean;
  youtubeConfigured: boolean;
  resendConfigured: boolean;
  resendSenderConfigured: boolean;
  supabaseServerConfigured: boolean;
}

export interface CanonicalDailyDashboardPayload {
  istDate: string;
  istDateLabel: string;
  isPreparationStarted: boolean;
  unlockedDays: {
    main: number;
    dsa: number;
    azure: number;
  };
  tracks: {
    main: CanonicalTrackDailyResources | null;
    dsa: CanonicalTrackDailyResources | null;
    azure: CanonicalTrackDailyResources | null;
  };
  automation: CanonicalAutomationStatus;
  actionPlan: {
    studyFirst: string;
    tutorialsToWatch: string;
    leetcodeFirst: string;
    practicalExercise: string;
    sequence: string[];
  };
}

export interface CanonicalAutomationRunRecord {
  runKey: string;
  runDate: string;
  ranAt: string;
  startedAt?: string;
  completedAt?: string | null;
  triggerSource: string;
  overallStatus: 'success' | 'partial' | 'failed';
  trackStatuses?: Partial<Record<SharedTrackId, CanonicalResourceStatus>>;
  emailSent: boolean;
  emailStatus: CanonicalAutomationStatus['emailStatus'];
  emailProviderId?: string | null;
  emailError?: string | null;
}

export interface CanonicalCacheStore {
  resourcesByKey: Record<string, CanonicalTrackDailyResources>;
  automationRuns: Record<string, CanonicalAutomationRunRecord>;
}

export interface PipelineEnvConfig {
  supabaseUrl?: string;
  supabaseServiceRoleKey?: string;
  ownerUserId?: string;
  geminiApiKey?: string;
  youtubeApiKey?: string;
  resendApiKey?: string;
  resendFromEmail?: string;
  dailyRecipientEmail?: string;
  appUrl?: string;
  fetchImpl?: typeof fetch;
}

export interface IstScheduleSnapshot {
  istDate: string;
  istDateLabel: string;
  istTimeLabel: string;
  istHour: number;
  istMinute: number;
  isPreparationStarted: boolean;
  unlockedDays: {
    main: number;
    dsa: number;
    azure: number;
  };
}

export function constantTimeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  const maxLen = Math.max(aBytes.length, bBytes.length);
  let diff = aBytes.length ^ bBytes.length;
  for (let i = 0; i < maxLen; i += 1) {
    const ab = i < aBytes.length ? aBytes[i] : 0;
    const bb = i < bBytes.length ? bBytes[i] : 0;
    diff |= ab ^ bb;
  }
  return diff === 0;
}

export function verifyCronRequest(
  authHeader: string | null | undefined,
  configuredCronSecret: string | undefined
): { authorized: boolean; status: 200 | 401 | 500; error?: string } {
  const cronSecret = configuredCronSecret?.trim() || '';
  if (!cronSecret) {
    return {
      authorized: false,
      status: 500,
      error: 'CRON_SECRET is not configured on Edge Function; failing closed.'
    };
  }
  const provided = authHeader?.trim() || '';
  const expected = `Bearer ${cronSecret}`;
  if (!provided || !constantTimeEqual(provided, expected)) {
    return {
      authorized: false,
      status: 401,
      error: 'Unauthorized: invalid or missing Bearer CRON_SECRET.'
    };
  }
  return { authorized: true, status: 200 };
}

export function getUnlockedDayCountByIstClock(
  nowMs: number = Date.now(),
  maxDays: number = MAIN_TRACK_MAX_DAYS
): number {
  const startMs = new Date(START_DATE_IST).getTime();
  if (nowMs < startMs) return 0;
  const elapsedDays = Math.floor((nowMs - startMs) / DAY_MS) + 1;
  return Math.min(maxDays, Math.max(1, elapsedDays));
}

export function isTrackDayCurrentlyUnlockedCanonical(
  trackId: SharedTrackId,
  dayNumber: number,
  nowMs: number = Date.now()
): boolean {
  if (!Number.isInteger(dayNumber) || dayNumber < 1) return false;
  const maxDays = trackId === 'main' ? MAIN_TRACK_MAX_DAYS : SUB_TRACK_MAX_DAYS;
  if (dayNumber > maxDays) return false;
  return dayNumber <= getUnlockedDayCountByIstClock(nowMs, maxDays);
}

export function getIstScheduleSnapshotCanonical(nowMs: number = Date.now()): IstScheduleSnapshot {
  const dateObj = new Date(nowMs);
  const istParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(dateObj);

  const part = (type: string) => istParts.find((p) => p.type === type)?.value || '00';
  const year = part('year');
  const month = part('month');
  const day = part('day');
  const hour = Number(part('hour'));
  const minute = Number(part('minute'));
  const second = part('second');

  const istDate = `${year}-${month}-${day}`;
  const istDateLabel = dateObj.toLocaleDateString('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const mainUnlocked = getUnlockedDayCountByIstClock(nowMs, MAIN_TRACK_MAX_DAYS);
  const dsaUnlocked = getUnlockedDayCountByIstClock(nowMs, SUB_TRACK_MAX_DAYS);
  const azureUnlocked = getUnlockedDayCountByIstClock(nowMs, SUB_TRACK_MAX_DAYS);

  return {
    istDate,
    istDateLabel,
    istTimeLabel: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${second} IST`,
    istHour: hour,
    istMinute: minute,
    isPreparationStarted: mainUnlocked >= 1,
    unlockedDays: {
      main: mainUnlocked,
      dsa: dsaUnlocked,
      azure: azureUnlocked
    }
  };
}

// =========================================================================
// URL & LEETCODE VALIDATION
// =========================================================================
interface CachedUrlCheck {
  ok: boolean;
  checkedAt: number;
}
const URL_CHECK_CACHE = new Map<string, CachedUrlCheck>();
const URL_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

export function isValidHttpsUrl(url?: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function verifyPublicUrlReachable(url: string): Promise<boolean> {
  if (!isValidHttpsUrl(url)) return false;

  const existing = URL_CHECK_CACHE.get(url);
  if (existing && Date.now() - existing.checkedAt < URL_CACHE_TTL_MS) {
    return existing.ok;
  }

  try {
    const resp = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(1500)
    });
    const ok =
      (resp.status >= 200 && resp.status < 400) || resp.status === 403 || resp.status === 405;
    URL_CHECK_CACHE.set(url, { ok, checkedAt: Date.now() });
    return ok;
  } catch {
    return false;
  }
}

export async function validateOfficialDocs(
  docs: SharedDailyReferenceLink[],
  skipNetworkCheck = false
): Promise<SharedDailyReferenceLink[]> {
  return Promise.all(
    docs.map(async (doc) => {
      if (!doc.url || !isValidHttpsUrl(doc.url)) {
        return { ...doc, isVerifiedUrl: false };
      }
      if (skipNetworkCheck) {
        return { ...doc, isVerifiedUrl: doc.isVerifiedUrl };
      }
      const reachable = await verifyPublicUrlReachable(doc.url);
      return {
        ...doc,
        isVerifiedUrl: reachable || doc.isVerifiedUrl
      };
    })
  );
}

export function validateDsaLeetCodeTriplet(questions: SharedDailyLeetCodeQuestion[]): {
  valid: boolean;
  questions: SharedDailyLeetCodeQuestion[];
  warning?: string;
} {
  if (questions.length !== 3) {
    return {
      valid: false,
      questions: questions.slice(0, 3),
      warning: `Expected strictly 3 LeetCode slots (Easy, Medium, Hard), got ${questions.length}.`
    };
  }

  const [q1, q2, q3] = questions;
  const orderOk = q1.difficulty === 'Easy' && q2.difficulty === 'Medium' && q3.difficulty === 'Hard';
  if (!orderOk) {
    return {
      valid: false,
      questions,
      warning: 'LeetCode slots must appear strictly in order: Easy, Medium, Hard.'
    };
  }

  const sanitized = questions.map((q) => ({
    ...q,
    isVerified: q.available ? isValidHttpsUrl(q.url) && Boolean(q.title && q.slug) : false
  }));

  const unavailableItems = sanitized.filter((q) => !q.available);
  return {
    valid: unavailableItems.length === 0,
    questions: sanitized,
    warning:
      unavailableItems.length > 0
        ? unavailableItems.map((u) => `${u.difficulty}: ${u.whyUnavailable || 'Unavailable'}`).join(' ')
        : undefined
  };
}

// =========================================================================
// YOUTUBE DATA API v3 DISCOVERY + LABELLED SEARCH FALLBACK (NEVER INVENTS IDs)
// =========================================================================
export interface YouTubeDiscoveryResult {
  tutorials: CanonicalYouTubeResource[];
  providerStatus:
    | 'youtube_api_verified'
    | 'search_fallback_no_key'
    | 'search_fallback_quota'
    | 'unavailable';
  statusNote: string;
}

interface YouTubeSearchItem {
  id?: { videoId?: string };
}

interface YouTubeVideoItem {
  id?: string;
  snippet?: {
    title?: string;
    channelTitle?: string;
    description?: string;
    defaultAudioLanguage?: string;
    defaultLanguage?: string;
  };
  contentDetails?: { duration?: string };
  status?: { privacyStatus?: string };
}

function parseIsoDurationToSeconds(isoDuration?: string): number {
  if (!isoDuration) return 0;
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(isoDuration);
  if (!match) return 0;
  return (
    Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0)
  );
}

function formatDurationSeconds(totalSeconds: number): string | undefined {
  if (!totalSeconds || totalSeconds <= 0) return undefined;
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

function buildTrackQueryTerms(ctx: SharedCurriculumDayContext): string[] {
  const focusPreview = ctx.objectives.slice(0, 2).join(' ').slice(0, 60);
  if (ctx.trackId === 'dsa') {
    return [
      `C++ ${ctx.topic} tutorial explained with examples`,
      `DSA in C++ ${ctx.topic} ${focusPreview}`,
      `${ctx.topic} C++ coding practice walkthrough`
    ];
  }
  if (ctx.trackId === 'azure') {
    return [
      `Microsoft Azure ${ctx.topic} tutorial`,
      `Azure ${ctx.topic} hands on lab explained`,
      `${ctx.topic} AZ-900 DP-900 AI-102 Azure tutorial`
    ];
  }
  return [
    `${ctx.topic} Python FastAPI RAG tutorial`,
    `${ctx.topic} ${focusPreview} explained`,
    `${ctx.topic} production software engineering tutorial`
  ];
}

export function buildSearchFallbackTutorials(
  ctx: SharedCurriculumDayContext
): CanonicalYouTubeResource[] {
  const prefixLabel =
    ctx.trackId === 'dsa'
      ? 'C++ DSA'
      : ctx.trackId === 'azure'
      ? 'Microsoft Azure'
      : 'AI/RAG Engineering';

  const queries = buildTrackQueryTerms(ctx);
  const angles = [
    {
      label: 'Core Concepts & Walkthrough',
      topicCovered: `${ctx.topic} — core definitions, concepts, and beginner-friendly examples (${ctx.objectives[0] || ctx.topic}).`,
      whyUseful: `Builds clear conceptual understanding of "${ctx.topic}" before doing Day ${ctx.dayNumber} hands-on work.`
    },
    {
      label: 'Practical Implementation & Examples',
      topicCovered: `${ctx.topic} — step-by-step practical coding / lab walkthrough aligned with: ${ctx.practicalWork.slice(0, 120)}`,
      whyUseful: `Demonstrates practical execution patterns needed to complete today's deliverable (${ctx.deliverable.slice(0, 90)}).`
    },
    {
      label: 'Common Pitfalls & Edge Cases',
      topicCovered: `${ctx.topic} — debugging mistakes, edge cases, and interview/production checks.`,
      whyUseful: `Helps catch common bugs and verify understanding of "${ctx.topic}" cleanly.`
    }
  ];

  return angles.map((angle, idx) => {
    const query = queries[idx] || `${prefixLabel} ${ctx.topic} tutorial`;
    return {
      id: `yt_${ctx.trackId}_d${ctx.dayNumber}_search_${idx + 1}`,
      title: `YouTube Search: ${ctx.topic} (${angle.label})`,
      channelName: 'YouTube Curated Search Link (Set YOUTUBE_API_KEY for verified direct videos)',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      topicCovered: angle.topicCovered,
      explanation: `Curated YouTube search for verified tutorials covering "${ctx.topic}" (${prefixLabel} Day ${ctx.dayNumber}).`,
      whyUseful: angle.whyUseful,
      language: 'en',
      isVerifiedVideo: false,
      linkKind: 'youtube_search_fallback'
    };
  });
}

export async function discoverYouTubeTutorials(
  ctx: SharedCurriculumDayContext,
  youtubeApiKey?: string
): Promise<YouTubeDiscoveryResult> {
  const apiKey = youtubeApiKey?.trim();
  if (!apiKey) {
    return {
      tutorials: buildSearchFallbackTutorials(ctx),
      providerStatus: 'search_fallback_no_key',
      statusNote:
        'YOUTUBE_API_KEY is not configured; providing clearly labelled YouTube topic search links without inventing video IDs.'
    };
  }

  try {
    const primaryQuery = buildTrackQueryTerms(ctx)[0];
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('maxResults', '8');
    searchUrl.searchParams.set('relevanceLanguage', 'en');
    searchUrl.searchParams.set('safeSearch', 'strict');
    searchUrl.searchParams.set('q', primaryQuery);
    searchUrl.searchParams.set('key', apiKey);

    const searchResp = await fetch(searchUrl.toString(), {
      signal: AbortSignal.timeout(8000)
    });

    if (searchResp.status === 403 || searchResp.status === 429) {
      return {
        tutorials: buildSearchFallbackTutorials(ctx),
        providerStatus: 'search_fallback_quota',
        statusNote:
          'YouTube Data API free quota reached or key restricted; fell back safely to clearly labelled topic search links.'
      };
    }

    if (!searchResp.ok) {
      return {
        tutorials: buildSearchFallbackTutorials(ctx),
        providerStatus: 'search_fallback_quota',
        statusNote: `YouTube search API returned HTTP ${searchResp.status}; using labelled search links instead of unverified IDs.`
      };
    }

    const searchJson = (await searchResp.json()) as { items?: YouTubeSearchItem[] };
    const candidateIds = (searchJson.items || [])
      .map((item) => item.id?.videoId)
      .filter((id): id is string => Boolean(id && /^[a-zA-Z0-9_-]{11}$/.test(id)));

    if (candidateIds.length === 0) {
      return {
        tutorials: buildSearchFallbackTutorials(ctx),
        providerStatus: 'search_fallback_quota',
        statusNote:
          'YouTube API returned zero verifiable public video IDs for this topic; using labelled search links.'
      };
    }

    const videosUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    videosUrl.searchParams.set('part', 'snippet,contentDetails,status');
    videosUrl.searchParams.set('id', candidateIds.join(','));
    videosUrl.searchParams.set('key', apiKey);

    const videosResp = await fetch(videosUrl.toString(), {
      signal: AbortSignal.timeout(8000)
    });

    if (!videosResp.ok) {
      return {
        tutorials: buildSearchFallbackTutorials(ctx),
        providerStatus: 'search_fallback_quota',
        statusNote: `YouTube videos metadata lookup returned HTTP ${videosResp.status}.`
      };
    }

    const videosJson = (await videosResp.json()) as { items?: YouTubeVideoItem[] };
    const publicVideos = (videosJson.items || []).filter((v) => {
      if (!v.id || !v.snippet?.title || !v.snippet?.channelTitle) return false;
      if (v.status?.privacyStatus && v.status.privacyStatus !== 'public') return false;
      return true;
    });

    const sorted = [...publicVideos].sort((a, b) => {
      const durA = parseIsoDurationToSeconds(a.contentDetails?.duration);
      const durB = parseIsoDurationToSeconds(b.contentDetails?.duration);
      return (durB >= 120 ? 1 : 0) - (durA >= 120 ? 1 : 0);
    });

    const selected = sorted.slice(0, 3);
    if (selected.length === 0) {
      return {
        tutorials: buildSearchFallbackTutorials(ctx),
        providerStatus: 'search_fallback_quota',
        statusNote: 'No public YouTube videos passed verification; using labelled search links.'
      };
    }

    const tutorials: CanonicalYouTubeResource[] = selected.map((v, idx) => {
      const videoId = v.id as string;
      const durSecs = parseIsoDurationToSeconds(v.contentDetails?.duration);
      const snippetDesc = (v.snippet?.description || '').replace(/\s+/g, ' ').trim();
      const shortSnippet = snippetDesc
        ? snippetDesc.slice(0, 160)
        : `Video tutorial covering ${ctx.topic}.`;
      return {
        id: `yt_${ctx.trackId}_d${ctx.dayNumber}_${videoId}_${idx + 1}`,
        title: v.snippet?.title || `${ctx.topic} Tutorial`,
        channelName: v.snippet?.channelTitle || 'Verified YouTube Channel',
        url: `https://www.youtube.com/watch?v=${videoId}`,
        videoId,
        topicCovered: `${ctx.topic}: ${ctx.objectives[0] || shortSnippet}`,
        explanation: shortSnippet,
        whyUseful: `Directly explains "${ctx.topic}" for Day ${ctx.dayNumber} of ${ctx.trackLabel}.`,
        duration: formatDurationSeconds(durSecs),
        language: v.snippet?.defaultAudioLanguage || v.snippet?.defaultLanguage || 'en',
        isVerifiedVideo: true,
        linkKind: 'verified_video'
      };
    });

    return {
      tutorials,
      providerStatus: 'youtube_api_verified',
      statusNote: `Verified ${tutorials.length} public YouTube tutorials via YouTube Data API v3.`
    };
  } catch (err) {
    return {
      tutorials: buildSearchFallbackTutorials(ctx),
      providerStatus: 'search_fallback_quota',
      statusNote:
        err instanceof Error
          ? `YouTube verification error (${err.message}); using labelled search links.`
          : 'YouTube verification failed; using labelled search links.'
    };
  }
}

// =========================================================================
// GEMINI FREE TIER ENRICHMENT (STRICTLY gemini-4-hydrogen, ZERO PAID FALLBACKS)
// =========================================================================
export interface GeminiEnrichmentOutput {
  topicExplanation: string;
  learningObjectives: string[];
  suggestedLearningOrder: string[];
  dailyGuidance: string;
  practicalExerciseSummary: string;
  youtubeAnnotations: {
    id: string;
    topicCovered: string;
    explanation: string;
    whyUseful: string;
  }[];
}

export interface GeminiGenerationResult {
  success: boolean;
  aiProviderStatus: 'gemini_generated' | 'quota_exhausted_cached' | 'missing_api_key' | 'unavailable';
  modelUsed?: string;
  data?: GeminiEnrichmentOutput;
  errorMessage?: string;
}

function isQuotaOrRateLimitStatusOrMsg(status: number, msg: string): boolean {
  if (status === 429) return true;
  const lower = msg.toLowerCase();
  return (
    lower.includes('429') ||
    lower.includes('resource_exhausted') ||
    lower.includes('quota') ||
    lower.includes('rate limit')
  );
}

export async function generateGroundedDailyBrief(
  ctx: SharedCurriculumDayContext,
  tutorials: CanonicalYouTubeResource[],
  docs: SharedDailyReferenceLink[],
  leetcodeQuestions: SharedDailyLeetCodeQuestion[],
  geminiApiKey?: string
): Promise<GeminiGenerationResult> {
  const apiKey = geminiApiKey?.trim();
  if (!apiKey) {
    return {
      success: false,
      aiProviderStatus: 'missing_api_key',
      errorMessage: 'GEMINI_API_KEY is not configured in server environment secrets.'
    };
  }

  const promptPayload = {
    track: ctx.trackLabel,
    dayNumber: ctx.dayNumber,
    date: ctx.dateLabel,
    phaseOrModule: ctx.phaseOrModule,
    topic: ctx.topic,
    curriculumObjectives: ctx.objectives,
    practicalWork: ctx.practicalWork,
    expectedOutcome: ctx.expectedOutcome,
    deliverable: ctx.deliverable,
    youtubeTutorials: tutorials.map((t) => ({
      id: t.id,
      title: t.title,
      channelName: t.channelName,
      isVerifiedVideo: t.isVerifiedVideo,
      currentSummary: t.explanation
    })),
    officialDocs: docs.map((d) => ({ title: d.title, source: d.sourceLabel })),
    leetcodeQuestions: leetcodeQuestions.map((q) => ({
      difficulty: q.difficulty,
      available: q.available,
      title: q.title || 'Unavailable'
    }))
  };

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${FREE_TIER_GEMINI_MODEL}:generateContent?key=${encodeURIComponent(
        apiKey
      )}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'aistudio-build'
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: 'You are an engineering mentor for Steeven\'s 180-Day Preparation Tracker. Stay 100% grounded in the provided curriculum topic, subtopics, practical task, official docs, and YouTube items. Never invent URLs, video IDs, or LeetCode problems. Keep explanations concise and actionable. For every YouTube item in youtubeAnnotations, return its exact id and write an explicit topicCovered sentence naming the specific concept covered alongside a clear short explanation and whyUseful note.'
              }
            ]
          },
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text:
                    'Generate structured, concise, grounded daily study guidance for this exact preparation curriculum day:\n' +
                    JSON.stringify(promptPayload, null, 2)
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                topicExplanation: { type: 'STRING' },
                learningObjectives: { type: 'ARRAY', items: { type: 'STRING' } },
                suggestedLearningOrder: { type: 'ARRAY', items: { type: 'STRING' } },
                dailyGuidance: { type: 'STRING' },
                practicalExerciseSummary: { type: 'STRING' },
                youtubeAnnotations: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      id: { type: 'STRING' },
                      topicCovered: { type: 'STRING' },
                      explanation: { type: 'STRING' },
                      whyUseful: { type: 'STRING' }
                    },
                    required: ['id', 'topicCovered', 'explanation', 'whyUseful']
                  }
                }
              },
              required: [
                'topicExplanation',
                'learningObjectives',
                'suggestedLearningOrder',
                'dailyGuidance',
                'practicalExerciseSummary',
                'youtubeAnnotations'
              ]
            }
          }
        }),
        signal: AbortSignal.timeout(5000)
      }
    );

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      const quotaHit = isQuotaOrRateLimitStatusOrMsg(resp.status, errText);
      return {
        success: false,
        aiProviderStatus: quotaHit ? 'quota_exhausted_cached' : 'unavailable',
        errorMessage: quotaHit
          ? `Gemini free-tier quota exceeded or rate-limited (HTTP ${resp.status}). Preserving grounded curriculum brief without paid fallback.`
          : `Gemini returned HTTP ${resp.status}`
      };
    }

    const json = (await resp.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const rawText = (json?.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();
    if (!rawText) {
      return {
        success: false,
        aiProviderStatus: 'unavailable',
        errorMessage: 'Gemini returned an empty response.'
      };
    }

    const parsed = JSON.parse(rawText) as GeminiEnrichmentOutput;
    return {
      success: true,
      aiProviderStatus: 'gemini_generated',
      modelUsed: FREE_TIER_GEMINI_MODEL,
      data: parsed
    };
  } catch (err) {
    const detail = err instanceof Error ? err.message : 'Gemini API call failed.';
    const quotaHit = isQuotaOrRateLimitStatusOrMsg(0, detail);
    return {
      success: false,
      aiProviderStatus: quotaHit ? 'quota_exhausted_cached' : 'unavailable',
      errorMessage: quotaHit
        ? `Gemini free-tier quota exceeded or rate-limited (${detail}). Preserving grounded curriculum guidance without paid fallback.`
        : `Gemini generation unavailable: ${detail}`
    };
  }
}

// =========================================================================
// FALLBACK BRIEF + COMBINED ACTION PLAN + EMAIL RENDERING & DELIVERY
// =========================================================================
function buildFallbackBrief(
  ctx: SharedCurriculumDayContext,
  tutorials: CanonicalYouTubeResource[],
  docs: SharedDailyReferenceLink[],
  leetcodeQuestions: SharedDailyLeetCodeQuestion[],
  existingCached?: CanonicalTrackDailyResources
) {
  if (existingCached && existingCached.aiProviderStatus === 'gemini_generated') {
    const cachedByUrl = new Map(existingCached.youtubeTutorials.map((t) => [t.url, t]));
    const mergedTutorials = tutorials.map((t) => {
      const prev = cachedByUrl.get(t.url);
      return prev
        ? {
            ...t,
            topicCovered: prev.topicCovered,
            explanation: prev.explanation,
            whyUseful: prev.whyUseful
          }
        : t;
    });

    return {
      topicExplanation: existingCached.topicExplanation,
      learningObjectives: existingCached.learningObjectives,
      suggestedLearningOrder: existingCached.suggestedLearningOrder,
      dailyGuidance: existingCached.dailyGuidance,
      practicalExerciseSummary: existingCached.practicalExerciseSummary,
      tutorials: mergedTutorials
    };
  }

  const baseExplanation =
    ctx.trackId === 'dsa'
      ? `Today's C++ DSA focus is "${ctx.topic}" (${ctx.phaseOrModule}). Master ${ctx.objectives[0]} and implement cleanly in C++ to satisfy: ${ctx.expectedOutcome}`
      : ctx.trackId === 'azure'
      ? `Today's Azure preparation covers "${ctx.topic}" (${ctx.phaseOrModule}). Study Microsoft Learn architecture guidance to complete: ${ctx.expectedOutcome}`
      : `Today's Main Plan session focuses on "${ctx.topic}" (${ctx.phaseOrModule}). Complete the core implementation concepts so you can ship: ${ctx.deliverable}`;

  const order =
    ctx.trackId === 'dsa'
      ? [
          `Review official C++ documentation (${docs[0]?.title || 'cppreference'}) for syntax & complexity guarantees.`,
          `Watch 1–2 focused YouTube tutorials on "${ctx.topic}" before coding.`,
          leetcodeQuestions.some((q) => q.available)
            ? 'Solve today\'s LeetCode triplet in order: Easy -> Medium -> Hard.'
            : `Complete today's C++ compiler & hands-on practice tasks (${ctx.practicalWork.slice(0, 80)}).`,
          `Log your milestone deliverable: ${ctx.deliverable}`
        ]
      : [
          `Read official documentation (${docs[0]?.title || 'Reference Docs'}) for foundational clarity.`,
          `Watch today's focused YouTube tutorials covering "${ctx.topic}".`,
          `Execute the hands-on exercise: ${ctx.practicalWork}`,
          `Verify expected outcome and record study notes: ${ctx.deliverable}`
        ];

  return {
    topicExplanation: baseExplanation,
    learningObjectives: ctx.objectives.slice(0, 5),
    suggestedLearningOrder: order,
    dailyGuidance: `${ctx.expectedOutcome} Deliverable target: ${ctx.deliverable}`,
    practicalExerciseSummary: `${ctx.practicalWork} Expected output: ${ctx.deliverable}`,
    tutorials
  };
}

export function buildCombinedActionPlan(
  main: CanonicalTrackDailyResources | null,
  dsa: CanonicalTrackDailyResources | null,
  azure: CanonicalTrackDailyResources | null
) {
  const studyFirst = main
    ? `Start with Main Plan Day ${main.planDay}: ${main.topicTitle} (${main.phaseOrModule}).`
    : 'Review upcoming curriculum modules on the dashboard.';

  const ytCount =
    (main?.youtubeTutorials.length || 0) +
    (dsa?.youtubeTutorials.length || 0) +
    (azure?.youtubeTutorials.length || 0);
  const tutorialsToWatch = `Watch ${ytCount} curated topic-specific tutorials across Main, DSA, and Azure before hands-on coding.`;

  const availableLc = (dsa?.leetcodeQuestions || []).filter((q) => q.available);
  const leetcodeFirst =
    availableLc.length > 0
      ? `Solve in order: ${availableLc
          .map((q) => `${q.difficulty} (#${q.problemNumber} ${q.title})`)
          .join(' -> ')}.`
      : dsa
      ? `Complete DSA Day ${dsa.planDay} C++ setup & foundational exercises (${dsa.topicTitle}).`
      : 'DSA track starts on Day 1.';

  const practicalExercise = [
    main ? `Main: ${main.practicalExercises[0]?.description || main.practicalExerciseSummary}` : null,
    azure ? `Azure: ${azure.practicalExerciseSummary}` : null
  ]
    .filter(Boolean)
    .join(' | ');

  const sequence = [
    main
      ? `1. Main Plan (4h): Read ${main.officialDocs[0]?.title || 'official docs'} and build "${main.topicTitle}".`
      : '1. Review Main Plan schedule.',
    dsa
      ? `2. DSA in C++ (90m): Study "${dsa.topicTitle}" and tackle Easy -> Medium -> Hard LeetCode.`
      : '2. Review DSA schedule.',
    azure
      ? `3. Azure Alternate Plan (60m): Complete Microsoft Learn module for "${azure.topicTitle}".`
      : '3. Review Azure schedule.',
    '4. Log completion checkboxes and daily notes inside Steeven\'s Preparation Tracker.'
  ];

  return {
    studyFirst,
    tutorialsToWatch,
    leetcodeFirst,
    practicalExercise: practicalExercise || 'Complete daily deliverables for all unlocked tracks.',
    sequence
  };
}

function escapeHtml(text: string): string {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderYouTubeHtmlList(tutorials: CanonicalYouTubeResource[]): string {
  if (!tutorials || tutorials.length === 0) {
    return '<p style="margin:8px 0;color:#78716C;font-size:13px;">No verified tutorials available for this topic today.</p>';
  }

  return tutorials
    .map((yt, idx) => {
      const badgeText = yt.isVerifiedVideo ? 'Verified Video' : 'Topic Search Link';
      const badgeBg = yt.isVerifiedVideo ? '#ECFDF5' : '#FEF3C7';
      const badgeColor = yt.isVerifiedVideo ? '#047857' : '#92400E';
      const metaParts = [
        yt.duration ? `Duration: ${escapeHtml(yt.duration)}` : null,
        yt.language ? `Language: ${escapeHtml(yt.language.toUpperCase())}` : null
      ].filter(Boolean);

      return `
      <div style="border:1px solid #E0DCD3;border-radius:10px;padding:12px 14px;margin-bottom:10px;background:#FAF8F5;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:4px;">
          <strong style="font-size:14px;color:#292929;">${idx + 1}. ${escapeHtml(yt.title)}</strong>
          <span style="display:inline-block;padding:2px 8px;border-radius:999px;background:${badgeBg};color:${badgeColor};font-size:11px;font-weight:700;white-space:nowrap;">${badgeText}</span>
        </div>
        <div style="font-size:12px;color:#57534E;margin-bottom:6px;">
          <strong>Channel:</strong> ${escapeHtml(yt.channelName)}
          ${metaParts.length > 0 ? ` &nbsp;|&nbsp; ${metaParts.join(' &nbsp;|&nbsp; ')}` : ''}
        </div>
        <div style="font-size:12px;color:#292929;margin-bottom:4px;">
          <strong style="color:#C2410C;">Topic Covered:</strong> ${escapeHtml(yt.topicCovered)}
        </div>
        <div style="font-size:12px;color:#57534E;margin-bottom:4px;">
          <strong>Explanation:</strong> ${escapeHtml(yt.explanation)}
        </div>
        <div style="font-size:12px;color:#57534E;margin-bottom:8px;">
          <strong>Why Watch:</strong> ${escapeHtml(yt.whyUseful)}
        </div>
        <a href="${escapeHtml(yt.url)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:6px 12px;border-radius:6px;background:#292929;color:#F3EFE6;text-decoration:none;font-size:12px;font-weight:600;">
          ${yt.isVerifiedVideo ? 'Watch on YouTube' : 'Open YouTube Topic Search'} &rarr;
        </a>
      </div>`;
    })
    .join('');
}

function renderLeetCodeHtmlList(questions: SharedDailyLeetCodeQuestion[]): string {
  return questions
    .map((q) => {
      const diffColor =
        q.difficulty === 'Easy' ? '#047857' : q.difficulty === 'Medium' ? '#B45309' : '#BE123C';
      const diffBg =
        q.difficulty === 'Easy' ? '#ECFDF5' : q.difficulty === 'Medium' ? '#FFFBEB' : '#FFF1F2';

      if (!q.available) {
        return `
        <div style="border:1px solid #E0DCD3;border-radius:10px;padding:12px 14px;margin-bottom:8px;background:#FAF8F5;">
          <div style="margin-bottom:4px;">
            <span style="display:inline-block;padding:2px 8px;border-radius:6px;background:${diffBg};color:${diffColor};font-size:11px;font-weight:700;text-transform:uppercase;">${q.slot}. ${q.difficulty}</span>
            <strong style="font-size:13px;color:#57534E;margin-left:8px;">Unavailable for Today's Topic</strong>
          </div>
          <p style="margin:4px 0 0;font-size:12px;color:#78716C;">${escapeHtml(
            q.whyUnavailable || q.shortExplanation
          )}</p>
        </div>`;
      }

      return `
      <div style="border:1px solid #E0DCD3;border-radius:10px;padding:12px 14px;margin-bottom:8px;background:#FFFFFF;">
        <div style="margin-bottom:4px;">
          <span style="display:inline-block;padding:2px 8px;border-radius:6px;background:${diffBg};color:${diffColor};font-size:11px;font-weight:700;text-transform:uppercase;">${q.slot}. ${q.difficulty}</span>
          <strong style="font-size:14px;color:#292929;margin-left:8px;">${
            q.problemNumber ? `#${escapeHtml(q.problemNumber)} ` : ''
          }${escapeHtml(q.title || '')}</strong>
        </div>
        <div style="font-size:12px;color:#57534E;margin-bottom:4px;">${escapeHtml(q.shortExplanation)}</div>
        <div style="font-size:12px;color:#57534E;margin-bottom:8px;"><strong>Topic Fit:</strong> ${escapeHtml(
          q.whyMatchesTopic
        )}</div>
        ${
          q.url
            ? `<a href="${escapeHtml(q.url)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:6px 12px;border-radius:6px;background:#E7826D;color:#292929;text-decoration:none;font-size:12px;font-weight:700;">Solve on LeetCode &rarr;</a>`
            : ''
        }
      </div>`;
    })
    .join('');
}

function renderTrackSectionHtml(
  sectionLabel: string,
  track: CanonicalTrackDailyResources | null,
  includeLeetCode: boolean
): string {
  if (!track) {
    return `
    <div style="background:#FFFFFF;border:1px solid #E0DCD3;border-radius:14px;padding:20px;margin-bottom:20px;">
      <h2 style="margin:0 0 8px;font-size:16px;color:#292929;text-transform:uppercase;letter-spacing:0.5px;">${escapeHtml(
        sectionLabel
      )}</h2>
      <p style="margin:0;font-size:13px;color:#78716C;">Schedule not unlocked or completed for today's IST date.</p>
    </div>`;
  }

  const docsHtml =
    track.officialDocs.length > 0
      ? `<ul style="margin:6px 0 0;padding-left:18px;font-size:13px;color:#292929;">
          ${track.officialDocs
            .map(
              (doc) =>
                `<li style="margin-bottom:6px;">
                  <a href="${escapeHtml(doc.url || '#')}" target="_blank" rel="noopener noreferrer" style="color:#C2410C;font-weight:600;text-decoration:underline;">${escapeHtml(
                    doc.title
                  )}</a>
                  <span style="color:#78716C;font-size:12px;"> (${escapeHtml(doc.sourceLabel)})</span><br/>
                  <span style="color:#57534E;font-size:12px;">${escapeHtml(doc.description)}</span>
                </li>`
            )
            .join('')}
        </ul>`
      : '<p style="margin:4px 0;font-size:12px;color:#78716C;">Refer to today\'s syllabus deliverables.</p>';

  return `
  <div style="background:#FFFFFF;border:1px solid #E0DCD3;border-radius:14px;padding:20px;margin-bottom:20px;">
    <div style="border-bottom:1px solid #E0DCD3;padding-bottom:12px;margin-bottom:14px;">
      <div style="font-size:11px;font-weight:700;color:#E7826D;text-transform:uppercase;letter-spacing:0.8px;">${escapeHtml(
        sectionLabel
      )} &middot; DAY ${track.planDay} (${escapeHtml(track.dateLabel)})</div>
      <h2 style="margin:4px 0 4px;font-size:18px;color:#292929;">${escapeHtml(track.topicTitle)}</h2>
      <div style="font-size:12px;color:#78716C;">${escapeHtml(track.phaseOrModule)}</div>
    </div>

    <p style="margin:0 0 12px;font-size:13px;line-height:1.55;color:#292929;">
      <strong>Brief Explanation:</strong> ${escapeHtml(track.topicExplanation)}
    </p>

    <div style="margin-bottom:14px;">
      <strong style="font-size:13px;color:#292929;">Suggested Learning Order:</strong>
      <ol style="margin:6px 0 0;padding-left:20px;font-size:12px;color:#57534E;line-height:1.6;">
        ${track.suggestedLearningOrder.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}
      </ol>
    </div>

    <div style="margin-bottom:14px;">
      <strong style="font-size:13px;color:#292929;display:block;margin-bottom:8px;">YouTube Tutorials (with Exact Topic Covered):</strong>
      ${renderYouTubeHtmlList(track.youtubeTutorials)}
    </div>

    ${
      includeLeetCode
        ? `<div style="margin-bottom:14px;">
            <strong style="font-size:13px;color:#292929;display:block;margin-bottom:8px;">Today's 3 DSA LeetCode Questions (1 Easy, 1 Medium, 1 Hard):</strong>
            ${renderLeetCodeHtmlList(track.leetcodeQuestions)}
          </div>`
        : ''
    }

    <div style="margin-bottom:14px;">
      <strong style="font-size:13px;color:#292929;">Official Documentation &amp; References:</strong>
      ${docsHtml}
    </div>

    <div style="background:#FAF8F5;border-left:3px solid #E7826D;padding:10px 12px;border-radius:6px;font-size:12px;color:#292929;">
      <strong>Today's Actionable Task / Exercise:</strong> ${escapeHtml(track.practicalExerciseSummary)}
    </div>
  </div>`;
}

export function buildDailyEmailContent(
  payload: CanonicalDailyDashboardPayload,
  appUrlOverride?: string
) {
  const appUrl = (appUrlOverride || DEFAULT_APP_URL).trim() || DEFAULT_APP_URL;
  const subject = `Steeven's Daily AI Learning Resources — ${payload.istDateLabel}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#F3EFE6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#292929;">
  <div style="max-width:720px;margin:0 auto;padding:24px 16px;">
    <div style="background:#292929;color:#F3EFE6;border-radius:14px;padding:22px 24px;margin-bottom:20px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#E7826D;">
        STEEVEN'S 180-DAY PREPARATION TRACKER &middot; 10:00 AM IST BRIEF
      </div>
      <h1 style="margin:6px 0 6px;font-size:22px;color:#F3EFE6;">Daily AI Learning Resources — ${escapeHtml(
        payload.istDateLabel
      )}</h1>
      <p style="margin:0;font-size:13px;color:#C2BEB5;">
        Unlocked Schedule Days &mdash; Main Plan: Day ${payload.unlockedDays.main}/180 &middot; DSA in C++: Day ${payload.unlockedDays.dsa}/100 &middot; Azure: Day ${payload.unlockedDays.azure}/100
      </p>
    </div>

    ${renderTrackSectionHtml('Section 1: MAIN PLAN — 180 DAYS', payload.tracks.main, false)}
    ${renderTrackSectionHtml('Section 2: DSA IN C++ (100 DAYS)', payload.tracks.dsa, true)}
    ${renderTrackSectionHtml('Section 3: AZURE — ALTERNATE PLAN (100 DAYS)', payload.tracks.azure, false)}

    <div style="background:#FFFFFF;border:1px solid #E0DCD3;border-radius:14px;padding:20px;margin-bottom:20px;">
      <h2 style="margin:0 0 12px;font-size:16px;color:#292929;text-transform:uppercase;letter-spacing:0.5px;">Section 4: TODAY'S ACTION PLAN</h2>
      <ul style="margin:0 0 12px;padding-left:18px;font-size:13px;line-height:1.6;color:#292929;">
        <li><strong>What to study first:</strong> ${escapeHtml(payload.actionPlan.studyFirst)}</li>
        <li><strong>Which tutorials to watch:</strong> ${escapeHtml(payload.actionPlan.tutorialsToWatch)}</li>
        <li><strong>Which LeetCode questions to solve first:</strong> ${escapeHtml(payload.actionPlan.leetcodeFirst)}</li>
        <li><strong>Practical exercise to complete:</strong> ${escapeHtml(payload.actionPlan.practicalExercise)}</li>
      </ul>
      <strong style="font-size:13px;color:#292929;">Recommended Study Sequence:</strong>
      <ol style="margin:6px 0 0;padding-left:20px;font-size:12px;color:#57534E;line-height:1.6;">
        ${payload.actionPlan.sequence.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}
      </ol>
    </div>

    <div style="background:#292929;border-radius:14px;padding:22px;text-align:center;margin-bottom:18px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#E7826D;margin-bottom:6px;">
        Section 5: OPEN PREPARATION TRACKER
      </div>
      <p style="margin:0 0 14px;font-size:13px;color:#E0DCD3;">
        Open the Preparation Tracker to mark tasks complete, track timers, and log notes.
      </p>
      <a href="${escapeHtml(appUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 24px;border-radius:10px;background:#E7826D;color:#292929;text-decoration:none;font-size:14px;font-weight:800;">
        Open Steeven's Preparation Tracker &rarr;
      </a>
      <div style="margin-top:10px;font-size:11px;color:#A8A49C;">
        ${escapeHtml(appUrl)}
      </div>
    </div>

    <p style="text-align:center;font-size:11px;color:#78716C;margin:0;">
      Delivered automatically at 10:00 AM IST via Resend Free Tier to ${escapeHtml(
        payload.automation.recipientEmail
      )}.
    </p>
  </div>
</body>
</html>`;

  const formatTrackText = (label: string, t: CanonicalTrackDailyResources | null, showLc: boolean) => {
    if (!t) return `=== ${label} ===\nNot unlocked yet.\n`;
    const ytText = t.youtubeTutorials
      .map(
        (yt, i) =>
          `  ${i + 1}. ${yt.title} (${yt.channelName})\n     Topic Covered: ${yt.topicCovered}\n     Why Watch: ${yt.whyUseful}\n     Link: ${yt.url}`
      )
      .join('\n');
    const lcText = showLc
      ? '\nLeetCode (1 Easy, 1 Medium, 1 Hard):\n' +
        t.leetcodeQuestions
          .map((q) =>
            q.available
              ? `  ${q.slot}. [${q.difficulty}] #${q.problemNumber} ${q.title} — ${q.url}`
              : `  ${q.slot}. [${q.difficulty}] Unavailable — ${q.whyUnavailable || q.shortExplanation}`
          )
          .join('\n')
      : '';
    const docsText = t.officialDocs.map((d) => `  - ${d.title}: ${d.url}`).join('\n');
    return `=== ${label} (Day ${t.planDay} — ${t.dateLabel}) ===\nTopic: ${t.topicTitle}\nExplanation: ${t.topicExplanation}\nYouTube Tutorials:\n${ytText}${lcText}\nOfficial Docs:\n${docsText}\nActionable Task: ${t.practicalExerciseSummary}\n`;
  };

  const text = [
    subject,
    '',
    formatTrackText('SECTION 1: MAIN PLAN — 180 DAYS', payload.tracks.main, false),
    formatTrackText('SECTION 2: DSA IN C++ (100 DAYS)', payload.tracks.dsa, true),
    formatTrackText('SECTION 3: AZURE — ALTERNATE PLAN (100 DAYS)', payload.tracks.azure, false),
    "=== SECTION 4: TODAY'S ACTION PLAN ===",
    `- Study First: ${payload.actionPlan.studyFirst}`,
    `- Watch Tutorials: ${payload.actionPlan.tutorialsToWatch}`,
    `- Solve LeetCode: ${payload.actionPlan.leetcodeFirst}`,
    `- Practical Exercise: ${payload.actionPlan.practicalExercise}`,
    '',
    `=== SECTION 5: OPEN PREPARATION TRACKER ===\n${appUrl}`
  ].join('\n');

  return { subject, html, text, appUrl };
}

export interface EmailDeliveryResult {
  sent: boolean;
  emailStatus: CanonicalAutomationStatus['emailStatus'];
  recipientEmail: string;
  subject: string;
  providerMessageId?: string | null;
  errorMessage?: string | null;
}

export async function sendDailyEmailViaResend(
  payload: CanonicalDailyDashboardPayload,
  config: PipelineEnvConfig,
  options?: { idempotencySuffix?: string }
): Promise<EmailDeliveryResult> {
  const recipientEmail =
    (config.dailyRecipientEmail || DEFAULT_DAILY_RECIPIENT).trim() || DEFAULT_DAILY_RECIPIENT;
  const { subject, html, text } = buildDailyEmailContent(payload, config.appUrl);
  const apiKey = config.resendApiKey?.trim();
  const fromEmail = config.resendFromEmail?.trim();

  if (!apiKey) {
    return {
      sent: false,
      emailStatus: 'awaiting_credentials',
      recipientEmail,
      subject,
      providerMessageId: null,
      errorMessage:
        'RESEND_API_KEY is not configured. Add a Resend Free Tier API key to enable 10:00 AM IST email delivery.'
    };
  }

  if (!fromEmail) {
    return {
      sent: false,
      emailStatus: 'awaiting_sender_verification',
      recipientEmail,
      subject,
      providerMessageId: null,
      errorMessage:
        'RESEND_FROM_EMAIL is not configured. Set a Resend-verified sender address.'
    };
  }

  const idempotencyKey = options?.idempotencySuffix
    ? `steeven-daily-${payload.istDate}-${options.idempotencySuffix}`
    : `steeven-daily-${payload.istDate}`;

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [recipientEmail],
        subject,
        html,
        text
      }),
      signal: AbortSignal.timeout(10000)
    });

    const respJson = (await resp.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
    };

    if (!resp.ok) {
      const msg = respJson.message || `Resend returned HTTP ${resp.status}`;
      const isSenderIssue =
        resp.status === 403 ||
        msg.toLowerCase().includes('verify') ||
        msg.toLowerCase().includes('domain');

      return {
        sent: false,
        emailStatus: isSenderIssue ? 'awaiting_sender_verification' : 'failed',
        recipientEmail,
        subject,
        providerMessageId: null,
        errorMessage: msg
      };
    }

    if (!respJson.id) {
      return {
        sent: false,
        emailStatus: 'failed',
        recipientEmail,
        subject,
        providerMessageId: null,
        errorMessage: 'Resend did not return a confirmed message ID.'
      };
    }

    return {
      sent: true,
      emailStatus: 'sent',
      recipientEmail,
      subject,
      providerMessageId: respJson.id,
      errorMessage: null
    };
  } catch (err) {
    return {
      sent: false,
      emailStatus: 'failed',
      recipientEmail,
      subject,
      providerMessageId: null,
      errorMessage: err instanceof Error ? err.message : 'Network error sending email via Resend.'
    };
  }
}

// =========================================================================
// SUPABASE REST PERSISTENCE & READS (SHARED BY EDGE, EXPRESS, VERCEL)
// =========================================================================
export function isSupabaseServerConfigured(config: PipelineEnvConfig): boolean {
  return Boolean(
    config.supabaseUrl?.trim() &&
      config.supabaseServiceRoleKey?.trim() &&
      config.ownerUserId?.trim()
  );
}

export async function syncTrackResourcesToSupabase(
  resource: CanonicalTrackDailyResources,
  config: PipelineEnvConfig
): Promise<boolean> {
  if (!isSupabaseServerConfigured(config)) return false;

  const baseUrl = config.supabaseUrl!.trim().replace(/\/$/, '');
  const serviceKey = config.supabaseServiceRoleKey!.trim();
  const ownerUserId = config.ownerUserId!.trim();
  const fetchFn = config.fetchImpl || fetch;

  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates,return=minimal'
  };

  try {
    const briefResp = await fetchFn(
      `${baseUrl}/rest/v1/daily_learning_briefs?on_conflict=user_id,track_id,plan_day`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify([
          {
            user_id: ownerUserId,
            track_id: resource.trackId,
            plan_day: resource.planDay,
            plan_date: resource.planDate,
            topic_title: resource.topicTitle,
            phase_or_module: resource.phaseOrModule,
            topic_explanation: resource.topicExplanation,
            learning_objectives: resource.learningObjectives,
            suggested_learning_order: resource.suggestedLearningOrder,
            daily_guidance: resource.dailyGuidance,
            practical_exercise_summary: resource.practicalExerciseSummary,
            leetcode_triplet: resource.trackId === 'dsa' ? resource.leetcodeQuestions : [],
            status: resource.status,
            status_message: resource.statusMessage,
            ai_provider_status: resource.aiProviderStatus,
            youtube_provider_status: resource.youtubeProviderStatus,
            model_used: resource.modelUsed || null,
            updated_at: resource.updatedAt
          }
        ]),
        signal: AbortSignal.timeout(6000)
      }
    );

    const rawRows = [
      ...resource.youtubeTutorials.map((yt) => ({
        user_id: ownerUserId,
        track_id: resource.trackId,
        plan_day: resource.planDay,
        plan_date: resource.planDate,
        topic: resource.topicTitle,
        resource_type: 'youtube',
        title: yt.title,
        url: yt.url,
        channel_or_source: yt.channelName,
        topic_covered: yt.topicCovered,
        description: yt.explanation,
        why_useful: yt.whyUseful,
        difficulty: null,
        duration: yt.duration || null,
        language: yt.language || 'en',
        is_verified: yt.isVerifiedVideo,
        updated_at: resource.updatedAt
      })),
      ...resource.officialDocs.map((doc) => ({
        user_id: ownerUserId,
        track_id: resource.trackId,
        plan_day: resource.planDay,
        plan_date: resource.planDate,
        topic: resource.topicTitle,
        resource_type: doc.resourceType,
        title: doc.title,
        url: doc.url || '',
        channel_or_source: doc.sourceLabel,
        topic_covered: resource.topicTitle,
        description: doc.description,
        why_useful: doc.description,
        difficulty: null,
        duration: null,
        language: 'en',
        is_verified: doc.isVerifiedUrl,
        updated_at: resource.updatedAt
      })),
      ...resource.practicalExercises.map((ex, idx) => ({
        user_id: ownerUserId,
        track_id: resource.trackId,
        plan_day: resource.planDay,
        plan_date: resource.planDate,
        topic: resource.topicTitle,
        resource_type: 'practical_exercise',
        title: ex.title,
        url:
          ex.url ||
          `https://steeven-prep.local/exercises/${resource.trackId}/day-${resource.planDay}-${idx + 1}`,
        channel_or_source: ex.sourceLabel,
        topic_covered: resource.topicTitle,
        description: ex.description,
        why_useful: ex.description,
        difficulty: null,
        duration: null,
        language: 'en',
        is_verified: ex.isVerifiedUrl,
        updated_at: resource.updatedAt
      })),
      ...(resource.trackId === 'dsa'
        ? resource.leetcodeQuestions
            .filter((q) => q.available && q.url)
            .map((q) => ({
              user_id: ownerUserId,
              track_id: 'dsa',
              plan_day: resource.planDay,
              plan_date: resource.planDate,
              topic: resource.topicTitle,
              resource_type: 'leetcode',
              title: `${q.problemNumber ? `#${q.problemNumber} ` : ''}${q.title || ''}`,
              url: q.url || '',
              channel_or_source: 'LeetCode',
              topic_covered: resource.topicTitle,
              description: q.shortExplanation,
              why_useful: q.whyMatchesTopic,
              difficulty: q.difficulty,
              duration: null,
              language: 'en',
              is_verified: q.isVerified,
              updated_at: resource.updatedAt
            }))
        : [])
    ];

    const dedupMap = new Map<string, (typeof rawRows)[number]>();
    for (const row of rawRows) {
      dedupMap.set(`${row.resource_type}::${row.url}`, row);
    }
    const resourceRows = Array.from(dedupMap.values());

    let resOk = true;
    if (resourceRows.length > 0) {
      const resResp = await fetchFn(
        `${baseUrl}/rest/v1/daily_learning_resources?on_conflict=user_id,track_id,plan_day,resource_type,url`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(resourceRows),
          signal: AbortSignal.timeout(6000)
        }
      );
      resOk = resResp.ok;
    }

    return briefResp.ok && resOk;
  } catch {
    return false;
  }
}

export async function syncAutomationRunToSupabase(
  run: {
    runKey: string;
    runDate: string;
    triggerSource: string;
    overallStatus: string;
    trackStatuses?: Partial<Record<SharedTrackId, CanonicalResourceStatus>>;
    emailStatus: string;
    recipientEmail: string;
    emailProviderId?: string | null;
    errorMessage?: string | null;
    startedAt?: string;
    completedAt?: string | null;
    ranAt: string;
  },
  config: PipelineEnvConfig
): Promise<boolean> {
  if (!isSupabaseServerConfigured(config)) return false;

  const baseUrl = config.supabaseUrl!.trim().replace(/\/$/, '');
  const serviceKey = config.supabaseServiceRoleKey!.trim();
  const ownerUserId = config.ownerUserId!.trim();
  const fetchFn = config.fetchImpl || fetch;

  try {
    const resp = await fetchFn(`${baseUrl}/rest/v1/daily_automation_runs?on_conflict=run_key`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify([
        {
          run_key: run.runKey,
          user_id: ownerUserId,
          run_date: run.runDate,
          trigger_source: run.triggerSource,
          overall_status: run.overallStatus,
          track_statuses: run.trackStatuses || {},
          email_status: run.emailStatus,
          recipient_email: run.recipientEmail,
          email_provider_id: run.emailProviderId || null,
          error_message: run.errorMessage || null,
          started_at: run.startedAt || run.ranAt,
          completed_at: run.completedAt || run.ranAt,
          ran_at: run.ranAt
        }
      ]),
      signal: AbortSignal.timeout(6000)
    });
    return resp.ok;
  } catch {
    return false;
  }
}

interface SupabaseBriefRow {
  track_id: SharedTrackId;
  plan_day: number;
  plan_date: string;
  topic_title: string;
  phase_or_module: string;
  topic_explanation: string;
  learning_objectives: string[];
  suggested_learning_order: string[];
  daily_guidance: string;
  practical_exercise_summary: string;
  leetcode_triplet: SharedDailyLeetCodeQuestion[];
  status: CanonicalResourceStatus;
  status_message: string;
  ai_provider_status: CanonicalTrackDailyResources['aiProviderStatus'];
  youtube_provider_status: CanonicalTrackDailyResources['youtubeProviderStatus'];
  model_used?: string | null;
  created_at: string;
  updated_at: string;
}

interface SupabaseResourceRow {
  track_id: SharedTrackId;
  plan_day: number;
  resource_type: string;
  title: string;
  url: string;
  channel_or_source: string;
  topic_covered: string;
  description: string;
  why_useful: string;
  duration?: string | null;
  language?: string;
  is_verified: boolean;
}

interface SupabaseAutomationRunRow {
  run_key: string;
  run_date: string;
  trigger_source: string;
  overall_status: 'success' | 'partial' | 'failed';
  track_statuses?: Partial<Record<SharedTrackId, CanonicalResourceStatus>>;
  email_status: CanonicalAutomationStatus['emailStatus'];
  recipient_email: string;
  email_provider_id?: string | null;
  error_message?: string | null;
  started_at?: string;
  completed_at?: string | null;
  ran_at: string;
}

export async function fetchTrackBriefFromSupabase(
  trackId: SharedTrackId,
  dayNumber: number,
  config: PipelineEnvConfig
): Promise<CanonicalTrackDailyResources | null> {
  if (!isSupabaseServerConfigured(config)) return null;

  const ctx = getSharedCurriculumDayContext(trackId, dayNumber);
  if (!ctx) return null;

  const baseUrl = config.supabaseUrl!.trim().replace(/\/$/, '');
  const serviceKey = config.supabaseServiceRoleKey!.trim();
  const ownerUserId = config.ownerUserId!.trim();
  const fetchFn = config.fetchImpl || fetch;
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`
  };

  try {
    const [briefResp, resResp] = await Promise.all([
      fetchFn(
        `${baseUrl}/rest/v1/daily_learning_briefs?user_id=eq.${encodeURIComponent(
          ownerUserId
        )}&track_id=eq.${trackId}&plan_day=eq.${dayNumber}&limit=1`,
        { headers, signal: AbortSignal.timeout(5000) }
      ),
      fetchFn(
        `${baseUrl}/rest/v1/daily_learning_resources?user_id=eq.${encodeURIComponent(
          ownerUserId
        )}&track_id=eq.${trackId}&plan_day=eq.${dayNumber}`,
        { headers, signal: AbortSignal.timeout(5000) }
      )
    ]);

    if (!briefResp.ok) return null;
    const briefs = (await briefResp.json()) as SupabaseBriefRow[];
    const brief = briefs[0];
    if (!brief) return null;

    const resources = resResp.ok ? ((await resResp.json()) as SupabaseResourceRow[]) : [];

    const youtubeRows = resources.filter((r) => r.resource_type === 'youtube');
    const docRows = resources.filter((r) => r.resource_type === 'official_documentation');
    const exerciseRows = resources.filter((r) => r.resource_type === 'practical_exercise');

    const youtubeTutorials: CanonicalYouTubeResource[] =
      youtubeRows.length > 0
        ? youtubeRows.map((yt, idx) => {
            const videoIdMatch = /[?&]v=([a-zA-Z0-9_-]{11})/.exec(yt.url || '');
            return {
              id: `yt_${trackId}_d${dayNumber}_sb_${idx + 1}`,
              title: yt.title,
              channelName: yt.channel_or_source,
              url: yt.url,
              videoId: videoIdMatch?.[1],
              topicCovered: yt.topic_covered,
              explanation: yt.description,
              whyUseful: yt.why_useful,
              duration: yt.duration || undefined,
              language: yt.language || 'en',
              isVerifiedVideo: Boolean(yt.is_verified),
              linkKind: yt.is_verified ? 'verified_video' : 'youtube_search_fallback'
            };
          })
        : buildSearchFallbackTutorials(ctx);

    const officialDocs: SharedDailyReferenceLink[] =
      docRows.length > 0
        ? docRows.map((doc, idx) => ({
            id: `doc_${trackId}_d${dayNumber}_sb_${idx + 1}`,
            resourceType: 'official_documentation',
            title: doc.title,
            url: doc.url,
            description: doc.description,
            sourceLabel: doc.channel_or_source,
            isVerifiedUrl: Boolean(doc.is_verified)
          }))
        : getSharedOfficialDocs(trackId, dayNumber);

    const leetcodeQuestions: SharedDailyLeetCodeQuestion[] =
      trackId === 'dsa'
        ? Array.isArray(brief.leetcode_triplet) && brief.leetcode_triplet.length === 3
          ? brief.leetcode_triplet
          : validateDsaLeetCodeTriplet(getSharedDsaDailyLeetCodeTriplet(dayNumber)).questions
        : [];

    const practicalExercises: SharedDailyReferenceLink[] =
      exerciseRows.length > 0
        ? exerciseRows.map((ex, idx) => ({
            id: `exercise_${trackId}_d${dayNumber}_sb_${idx + 1}`,
            resourceType: 'practical_exercise',
            title: ex.title,
            url: ex.url,
            description: ex.description,
            sourceLabel: ex.channel_or_source,
            isVerifiedUrl: Boolean(ex.is_verified)
          }))
        : [
            {
              id: `exercise_${trackId}_d${dayNumber}`,
              resourceType: 'practical_exercise',
              title: `Day ${dayNumber} Hands-On Deliverable: ${ctx.topic}`,
              description: `${ctx.practicalWork} | Expected Deliverable: ${ctx.deliverable}`,
              sourceLabel: `${ctx.trackLabel} Curriculum`,
              isVerifiedUrl: true
            }
          ];

    return {
      trackId,
      trackLabel: ctx.trackLabel,
      planDay: dayNumber,
      planDate: ctx.isoDate,
      dateLabel: ctx.dateLabel,
      topicTitle: ctx.topic,
      phaseOrModule: brief.phase_or_module || ctx.phaseOrModule,
      learningObjectives:
        Array.isArray(brief.learning_objectives) && brief.learning_objectives.length > 0
          ? brief.learning_objectives
          : ctx.objectives,
      topicExplanation: brief.topic_explanation,
      suggestedLearningOrder: Array.isArray(brief.suggested_learning_order)
        ? brief.suggested_learning_order
        : [],
      dailyGuidance: brief.daily_guidance,
      practicalExerciseSummary: brief.practical_exercise_summary,
      youtubeTutorials,
      leetcodeQuestions,
      officialDocs,
      practicalExercises,
      status: brief.status || 'cached',
      statusMessage: brief.status_message || '',
      aiProviderStatus: brief.ai_provider_status || 'missing_api_key',
      youtubeProviderStatus: brief.youtube_provider_status || 'search_fallback_no_key',
      modelUsed: brief.model_used || undefined,
      generatedAt: brief.created_at || brief.updated_at,
      updatedAt: brief.updated_at
    };
  } catch {
    return null;
  }
}

export async function fetchLatestAutomationRunFromSupabase(
  config: PipelineEnvConfig,
  runKey?: string
): Promise<CanonicalAutomationRunRecord | null> {
  if (!isSupabaseServerConfigured(config)) return null;
  const baseUrl = config.supabaseUrl!.trim().replace(/\/$/, '');
  const serviceKey = config.supabaseServiceRoleKey!.trim();
  const ownerUserId = config.ownerUserId!.trim();
  const fetchFn = config.fetchImpl || fetch;

  try {
    const query = runKey
      ? `${baseUrl}/rest/v1/daily_automation_runs?run_key=eq.${encodeURIComponent(runKey)}&limit=1`
      : `${baseUrl}/rest/v1/daily_automation_runs?user_id=eq.${encodeURIComponent(
          ownerUserId
        )}&order=ran_at.desc&limit=1`;

    const resp = await fetchFn(query, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`
      },
      signal: AbortSignal.timeout(5000)
    });

    if (!resp.ok) return null;
    const rows = (await resp.json()) as SupabaseAutomationRunRow[];
    const r = rows[0];
    if (!r) return null;
    return {
      runKey: r.run_key,
      runDate: r.run_date,
      ranAt: r.ran_at,
      startedAt: r.started_at,
      completedAt: r.completed_at,
      triggerSource: r.trigger_source,
      overallStatus: r.overall_status,
      trackStatuses: r.track_statuses,
      emailSent: r.email_status === 'sent',
      emailStatus: r.email_status,
      emailProviderId: r.email_provider_id,
      emailError: r.error_message
    };
  } catch {
    return null;
  }
}

// =========================================================================
// CANONICAL PIPELINE ENTRYPOINTS (SHARED BY EDGE, EXPRESS & VERCEL)
// =========================================================================
export function getMissingSecretsList(config: PipelineEnvConfig): string[] {
  const missing: string[] = [];
  if (!config.geminiApiKey?.trim()) missing.push('GEMINI_API_KEY');
  if (!config.youtubeApiKey?.trim()) missing.push('YOUTUBE_API_KEY');
  if (!config.resendApiKey?.trim()) missing.push('RESEND_API_KEY');
  if (!config.resendFromEmail?.trim()) missing.push('RESEND_FROM_EMAIL');
  return missing;
}

export function buildDeterministicReadOnlyTrack(
  trackId: SharedTrackId,
  dayNumber: number,
  config: PipelineEnvConfig,
  existingCached?: CanonicalTrackDailyResources
): CanonicalTrackDailyResources | null {
  const ctx = getSharedCurriculumDayContext(trackId, dayNumber);
  if (!ctx) return null;

  const tutorials = buildSearchFallbackTutorials(ctx);
  const docs = getSharedOfficialDocs(trackId, dayNumber);

  let leetcodeQuestions: SharedDailyLeetCodeQuestion[] = [];
  let leetcodeWarning: string | undefined;
  if (trackId === 'dsa') {
    const validated = validateDsaLeetCodeTriplet(getSharedDsaDailyLeetCodeTriplet(dayNumber));
    leetcodeQuestions = validated.questions;
    leetcodeWarning = validated.warning;
  }

  const practicalExercises: SharedDailyReferenceLink[] = [
    {
      id: `exercise_${trackId}_d${dayNumber}`,
      resourceType: 'practical_exercise',
      title: `Day ${dayNumber} Hands-On Deliverable: ${ctx.topic}`,
      description: `${ctx.practicalWork} | Expected Deliverable: ${ctx.deliverable}`,
      sourceLabel: `${ctx.trackLabel} Curriculum`,
      isVerifiedUrl: true
    }
  ];

  const fallback = buildFallbackBrief(ctx, tutorials, docs, leetcodeQuestions, existingCached);
  const nowIso = new Date().toISOString();
  const hasGemini = Boolean(config.geminiApiKey?.trim());
  const statusNotes = [
    hasGemini
      ? 'Awaiting daily automation refresh for live AI & YouTube enrichment.'
      : 'Curriculum, official docs, and LeetCode loaded; GEMINI_API_KEY needed for AI enrichment.',
    'Displaying clearly labelled YouTube topic search links without inventing video IDs.'
  ];
  if (leetcodeWarning) statusNotes.push(leetcodeWarning);

  return {
    trackId,
    trackLabel: ctx.trackLabel,
    planDay: dayNumber,
    planDate: ctx.isoDate,
    dateLabel: ctx.dateLabel,
    topicTitle: ctx.topic,
    phaseOrModule: ctx.phaseOrModule,
    learningObjectives: fallback.learningObjectives,
    topicExplanation: fallback.topicExplanation,
    suggestedLearningOrder: fallback.suggestedLearningOrder,
    dailyGuidance: fallback.dailyGuidance,
    practicalExerciseSummary: fallback.practicalExerciseSummary,
    youtubeTutorials: fallback.tutorials,
    leetcodeQuestions,
    officialDocs: docs,
    practicalExercises,
    status: 'partially_updated',
    statusMessage: statusNotes.join(' '),
    aiProviderStatus: hasGemini ? 'unavailable' : 'missing_api_key',
    youtubeProviderStatus: config.youtubeApiKey?.trim()
      ? 'search_fallback_quota'
      : 'search_fallback_no_key',
    generatedAt: existingCached?.generatedAt || nowIso,
    updatedAt: nowIso
  };
}

export async function generateTrackDailyCanonical(
  trackId: SharedTrackId,
  dayNumber: number,
  config: PipelineEnvConfig,
  options?: {
    forceRefresh?: boolean;
    persistToCloud?: boolean;
    existingCached?: CanonicalTrackDailyResources | null;
    skipExternalNetworkChecks?: boolean;
  }
): Promise<CanonicalTrackDailyResources> {
  const ctx = getSharedCurriculumDayContext(trackId, dayNumber);
  if (!ctx) {
    throw new Error(`Invalid dayNumber ${dayNumber} for track "${trackId}".`);
  }

  if (!isTrackDayCurrentlyUnlockedCanonical(trackId, dayNumber)) {
    throw new Error(
      `LOCKED_FUTURE_DAY: ${ctx.trackLabel} Day ${dayNumber} unlocks on ${ctx.dateLabel} at 00:00 IST.`
    );
  }

  const existingCached = options?.existingCached || undefined;
  if (!options?.forceRefresh && existingCached) {
    const ageMs = Date.now() - new Date(existingCached.updatedAt).getTime();
    if (Number.isFinite(ageMs) && ageMs < 12 * 60 * 60 * 1000) {
      return {
        ...existingCached,
        status: existingCached.aiProviderStatus === 'gemini_generated' ? 'cached' : existingCached.status
      };
    }
  }

  const ytResult = await discoverYouTubeTutorials(ctx, config.youtubeApiKey);
  const docs = await validateOfficialDocs(
    getSharedOfficialDocs(trackId, dayNumber),
    Boolean(options?.skipExternalNetworkChecks)
  );

  let leetcodeQuestions: SharedDailyLeetCodeQuestion[] = [];
  let leetcodeWarning: string | undefined;
  if (trackId === 'dsa') {
    const validated = validateDsaLeetCodeTriplet(getSharedDsaDailyLeetCodeTriplet(dayNumber));
    leetcodeQuestions = validated.questions;
    leetcodeWarning = validated.warning;
  }

  const practicalExercises: SharedDailyReferenceLink[] = [
    {
      id: `exercise_${trackId}_d${dayNumber}`,
      resourceType: 'practical_exercise',
      title: `Day ${dayNumber} Hands-On Deliverable: ${ctx.topic}`,
      description: `${ctx.practicalWork} | Expected Deliverable: ${ctx.deliverable}`,
      sourceLabel: `${ctx.trackLabel} Curriculum`,
      isVerifiedUrl: true
    }
  ];

  const geminiResult = await generateGroundedDailyBrief(
    ctx,
    ytResult.tutorials,
    docs,
    leetcodeQuestions,
    config.geminiApiKey
  );

  let finalExplanation: string;
  let finalObjectives: string[];
  let finalOrder: string[];
  let finalGuidance: string;
  let finalExerciseSummary: string;
  let finalTutorials: CanonicalYouTubeResource[];
  let aiStatus: CanonicalTrackDailyResources['aiProviderStatus'];
  let modelUsed: string | undefined;

  if (geminiResult.success && geminiResult.data) {
    aiStatus = 'gemini_generated';
    modelUsed = geminiResult.modelUsed;
    const g = geminiResult.data;
    const annotationMap = new Map(g.youtubeAnnotations.map((a) => [a.id, a]));
    finalTutorials = ytResult.tutorials.map((t) => {
      const ann = annotationMap.get(t.id);
      return ann
        ? {
            ...t,
            topicCovered: ann.topicCovered || t.topicCovered,
            explanation: ann.explanation || t.explanation,
            whyUseful: ann.whyUseful || t.whyUseful
          }
        : t;
    });
    finalExplanation = g.topicExplanation;
    finalObjectives = g.learningObjectives.length > 0 ? g.learningObjectives : ctx.objectives;
    finalOrder = g.suggestedLearningOrder.length > 0 ? g.suggestedLearningOrder : [];
    finalGuidance = g.dailyGuidance;
    finalExerciseSummary = g.practicalExerciseSummary;
  } else {
    aiStatus = geminiResult.aiProviderStatus;
    const fallback = buildFallbackBrief(
      ctx,
      ytResult.tutorials,
      docs,
      leetcodeQuestions,
      existingCached
    );
    finalExplanation = fallback.topicExplanation;
    finalObjectives = fallback.learningObjectives;
    finalOrder = fallback.suggestedLearningOrder;
    finalGuidance = fallback.dailyGuidance;
    finalExerciseSummary = fallback.practicalExerciseSummary;
    finalTutorials = fallback.tutorials;
  }

  const fullyAiAndYtVerified =
    aiStatus === 'gemini_generated' && ytResult.providerStatus === 'youtube_api_verified';

  const statusNotes: string[] = [];
  let status: CanonicalResourceStatus = 'updated';
  if (fullyAiAndYtVerified) {
    status = 'updated';
    statusNotes.push(
      'Updated successfully with verified YouTube tutorials and Gemini Free Tier insights.'
    );
  } else {
    status = 'partially_updated';
    if (aiStatus === 'missing_api_key') {
      statusNotes.push(
        'Curriculum, official docs, and LeetCode loaded; GEMINI_API_KEY needed for AI enrichment.'
      );
    } else if (aiStatus === 'quota_exhausted_cached') {
      statusNotes.push(
        'Gemini Free Tier quota reached; displaying grounded curriculum / cached notes.'
      );
    } else if (aiStatus === 'unavailable') {
      statusNotes.push(geminiResult.errorMessage || 'Gemini enrichment temporarily unavailable.');
    }
    if (ytResult.providerStatus !== 'youtube_api_verified') {
      statusNotes.push(ytResult.statusNote);
    }
  }
  if (leetcodeWarning) statusNotes.push(leetcodeWarning);

  const nowIso = new Date().toISOString();
  const payload: CanonicalTrackDailyResources = {
    trackId,
    trackLabel: ctx.trackLabel,
    planDay: dayNumber,
    planDate: ctx.isoDate,
    dateLabel: ctx.dateLabel,
    topicTitle: ctx.topic,
    phaseOrModule: ctx.phaseOrModule,
    learningObjectives: finalObjectives,
    topicExplanation: finalExplanation,
    suggestedLearningOrder: finalOrder,
    dailyGuidance: finalGuidance,
    practicalExerciseSummary: finalExerciseSummary,
    youtubeTutorials: finalTutorials,
    leetcodeQuestions,
    officialDocs: docs,
    practicalExercises,
    status,
    statusMessage: statusNotes.join(' '),
    aiProviderStatus: aiStatus,
    youtubeProviderStatus: ytResult.providerStatus,
    modelUsed,
    generatedAt: existingCached?.generatedAt || nowIso,
    updatedAt: nowIso
  };

  if (options?.persistToCloud) {
    await syncTrackResourcesToSupabase(payload, config);
  }

  return payload;
}

export function buildAutomationStatusSummary(
  config: PipelineEnvConfig,
  latestRun: CanonicalAutomationRunRecord | null
): CanonicalAutomationStatus {
  const emailConfigured = Boolean(config.resendApiKey?.trim());
  const senderConfigured = Boolean(config.resendFromEmail?.trim());

  return {
    scheduleLabel: '10:00 AM IST (Daily)',
    timezone: 'Asia/Kolkata',
    recipientEmail:
      (config.dailyRecipientEmail || DEFAULT_DAILY_RECIPIENT).trim() || DEFAULT_DAILY_RECIPIENT,
    lastRunDate: latestRun?.runDate || null,
    lastRunAt: latestRun?.ranAt || null,
    overallStatus: latestRun?.overallStatus || 'not_run_yet',
    emailStatus: latestRun
      ? latestRun.emailStatus
      : !emailConfigured
      ? 'awaiting_credentials'
      : !senderConfigured
      ? 'awaiting_sender_verification'
      : 'not_sent',
    emailProviderId: latestRun?.emailProviderId || null,
    emailError: latestRun?.emailError || null,
    missingSecrets: getMissingSecretsList(config),
    geminiConfigured: Boolean(config.geminiApiKey?.trim()),
    youtubeConfigured: Boolean(config.youtubeApiKey?.trim()),
    resendConfigured: emailConfigured,
    resendSenderConfigured: senderConfigured,
    supabaseServerConfigured: isSupabaseServerConfigured(config)
  };
}
