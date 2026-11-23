import {
  getSharedCurriculumDayContext,
  getSharedDsaDailyLeetCodeTriplet,
  getSharedOfficialDocs,
  type SharedCurriculumDayContext,
  type SharedDailyLeetCodeQuestion,
  type SharedDailyReferenceLink,
  type SharedTrackId
} from './catalogData.ts';

export const START_DATE_IST = '2026-11-23T00:00:00+05:30';
export const LEGACY_GUEST_START_DATE_IST = '2026-11-16T00:00:00+05:30';
export const APPROVED_CODING_CHANNELS = [
  { handle: '@SwaroopTalks', channelId: 'UCjO2a5PrUrad7sA_mBXvklw' },
  { handle: '@codewithswaroop', channelId: 'UCfIrO-HaaLeXBL46Jug242g' },
  { handle: '@JennyslecturesCSIT', channelId: 'UCM-yUTYGmrNvKOCcAl21g3w' },
  { handle: '@SwaroopVITB', channelId: 'UCmFUoPicoxuJAuR2NfNdQGA' },
  { handle: '@SudhakarAtchala', channelId: 'UCDxNoaHOj2l2bFrHgCkg6Zw' },
  { handle: '@takeUforward', channelId: 'UCJskGeByzRRSvmOyZOz61ig' }
] as const;
export const APPROVED_AZURE_CHANNELS = [
  { channelId: 'UC0m-80FnNY2Qb7obvTL_2fA', channelName: 'Microsoft Azure' },
  { channelId: 'UCFs5990vNpA2C2ijzgiJ59Q', channelName: 'Microsoft Learn' },
  { channelId: 'UCpIn7ox7j7bH_OFj7tYouOQ', channelName: "John Savill's Technical Training" }
] as const;
export const DAY_MS = 24 * 60 * 60 * 1000;
export const MAIN_TRACK_MAX_DAYS = 180;
export const SUB_TRACK_MAX_DAYS = 100;
export const DEFAULT_DAILY_RECIPIENT = 'mypreparation0111@gmail.com';
export const DEFAULT_APP_URL = 'https://my-preparation.vercel.app';
export const FREE_TIER_GEMINI_MODEL = 'gemini-4-hydrogen';
const GEMINI_MAX_ATTEMPTS = 3;
const GEMINI_RETRY_BASE_MS = 400;
const GEMINI_RETRY_MAX_MS = 8000;

function retryAfterMs(value: string | null): number | undefined | null {
  if (!value) return undefined;
  const seconds = Number(value);
  const delay = Number.isFinite(seconds) && seconds >= 0
    ? seconds * 1000
    : Date.parse(value) - Date.now();
  if (!Number.isFinite(delay) || delay < 0) return undefined;
  // Do not retry earlier than the server requested. If its delay exceeds this
  // request's bounded retry budget, let this track fall back and try next run.
  return delay > GEMINI_RETRY_MAX_MS ? null : delay;
}

function isRetryableGeminiStatus(status: number): boolean {
  return status === 429 || status === 503 || status === 502 || status === 504;
}

async function waitBeforeGeminiRetry(attempt: number, retryAfter: string | null): Promise<boolean> {
  const serverDelay = retryAfterMs(retryAfter);
  if (serverDelay === null) return false;
  const exponentialDelay = Math.min(GEMINI_RETRY_BASE_MS * 2 ** (attempt - 1), GEMINI_RETRY_MAX_MS);
  const jitteredDelay = Math.floor(exponentialDelay * (0.5 + Math.random() * 0.5));
  await new Promise((resolve) => setTimeout(resolve, serverDelay ?? jitteredDelay));
  return true;
}

function isHardQuotaExhaustion(message: string): boolean {
  return /quota\s+(?:has\s+been\s+)?(?:exceeded|exhausted)|(?:exceeded|exhausted)\s+(?:the\s+)?(?:current\s+)?quota|daily\s+quota|billing\s+(?:account|plan)/i.test(message);
}

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
  channelId?: string;
  thumbnailUrl?: string;
  topicCovered: string;
  explanation: string;
  whyUseful: string;
  duration?: string;
  language?: string;
  isVerifiedVideo: boolean;
  linkKind: 'verified_video' | 'youtube_search_fallback';
}

export interface CanonicalTimetableSlot {
  duration: string;
  activity: string;
}

export interface CanonicalTrackDailyResources {
  trackId: SharedTrackId;
  trackLabel: string;
  planDay: number;
  planDate: string;
  dateLabel: string;
  dayOfWeek?: string;
  topicTitle: string;
  phaseOrModule: string;
  scheduleTarget?: string;
  studyTimetable?: CanonicalTimetableSlot[];
  learningObjectives: string[];
  topicExplanation: string;
  practicalExamples?: string[];
  revisionNotes?: string[];
  commonMistakes?: string[];
  suggestedLearningOrder: string[];
  dailyGuidance: string;
  practicalExerciseSummary: string;
  youtubeTutorials: CanonicalYouTubeResource[];
  leetcodeQuestions: SharedDailyLeetCodeQuestion[];
  officialDocs: SharedDailyReferenceLink[];
  practicalExercises: SharedDailyReferenceLink[];
  status: CanonicalResourceStatus;
  statusMessage: string;
  aiProviderStatus:
    | 'gemini_generated'
    | 'quota_exhausted_cached'
    | 'missing_api_key'
    | 'invalid_api_key'
    | 'unavailable';
  youtubeProviderStatus:
    | 'youtube_api_verified'
    | 'search_fallback_no_key'
    | 'search_fallback_quota'
    | 'unavailable';
  modelUsed?: string;
  generatedAt: string;
  updatedAt: string;
}

/**
 * A track is fully updated when its required learning resources are present
 * and verified. Gemini enrichment is optional and its provider status remains
 * visible separately; a Gemini outage alone must not mark usable resources as
 * a partial refresh. Missing/unverified docs, exercises, videos, or DSA slots
 * still keep the track partial.
 */
export function hasCompleteRequiredTrackResources(resources: Pick<
  CanonicalTrackDailyResources,
  | 'trackId'
  | 'topicExplanation'
  | 'learningObjectives'
  | 'officialDocs'
  | 'practicalExercises'
  | 'youtubeTutorials'
  | 'youtubeProviderStatus'
  | 'leetcodeQuestions'
>): boolean {
  const requiredContentPresent =
    Boolean(resources.topicExplanation.trim()) &&
    resources.learningObjectives.length > 0 &&
    resources.officialDocs.length > 0 &&
    resources.officialDocs.every((doc) => doc.isVerifiedUrl) &&
    resources.practicalExercises.length > 0 &&
    resources.practicalExercises.every((exercise) => exercise.isVerifiedUrl);
  const verifiedVideosPresent =
    resources.youtubeProviderStatus === 'youtube_api_verified' &&
    resources.youtubeTutorials.length > 0 &&
    resources.youtubeTutorials.every((video) => video.isVerifiedVideo && video.linkKind === 'verified_video');
  const dsaSlotsValid =
    resources.trackId !== 'dsa' ||
    (resources.leetcodeQuestions.length === 3 &&
      resources.leetcodeQuestions.every((question) => question.available && question.isVerified));

  return requiredContentPresent && verifiedVideosPresent && dsaSlotsValid;
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

export type GeminiCallerFn = (
  ctx: SharedCurriculumDayContext,
  tutorials: CanonicalYouTubeResource[],
  docs: SharedDailyReferenceLink[],
  leetcodeQuestions: SharedDailyLeetCodeQuestion[],
  geminiApiKey?: string
) => Promise<GeminiGenerationResult>;

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
  geminiCaller?: GeminiCallerFn;
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
  maxDays: number = MAIN_TRACK_MAX_DAYS,
  startDateIsoIst: string = START_DATE_IST
): number {
  const startMs = new Date(startDateIsoIst).getTime();
  if (nowMs < startMs) return 0;
  const elapsedDays = Math.floor((nowMs - startMs) / DAY_MS) + 1;
  return Math.min(maxDays, Math.max(1, elapsedDays));
}

export function isTrackDayCurrentlyUnlockedCanonical(
  trackId: SharedTrackId,
  dayNumber: number,
  nowMs: number = Date.now(),
  startDateIsoIst: string = START_DATE_IST
): boolean {
  if (!Number.isInteger(dayNumber) || dayNumber < 1) return false;
  const maxDays = trackId === 'main' ? MAIN_TRACK_MAX_DAYS : SUB_TRACK_MAX_DAYS;
  if (dayNumber > maxDays) return false;
  return dayNumber <= getUnlockedDayCountByIstClock(nowMs, maxDays, startDateIsoIst);
}

export function getIstScheduleSnapshotCanonical(nowMs: number = Date.now(), startDateIsoIst: string = START_DATE_IST): IstScheduleSnapshot {
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

  const mainUnlocked = getUnlockedDayCountByIstClock(nowMs, MAIN_TRACK_MAX_DAYS, startDateIsoIst);
  const dsaUnlocked = getUnlockedDayCountByIstClock(nowMs, SUB_TRACK_MAX_DAYS, startDateIsoIst);
  const azureUnlocked = getUnlockedDayCountByIstClock(nowMs, SUB_TRACK_MAX_DAYS, startDateIsoIst);

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

function getCycleCurriculumContext(trackId: SharedTrackId, dayNumber: number, startDateIsoIst: string = START_DATE_IST): SharedCurriculumDayContext | null {
  const context = getSharedCurriculumDayContext(trackId, dayNumber);
  if (!context) return null;
  const date = new Date(new Date(startDateIsoIst).getTime() + (dayNumber - 1) * DAY_MS);
  return {
    ...context,
    isoDate: date.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }),
    dateLabel: date.toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' }),
    dayOfWeek: date.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', weekday: 'long' })
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
  snippet?: { channelId?: string };
}

interface YouTubeVideoItem {
  id?: string;
  snippet?: {
    title?: string;
    channelTitle?: string;
    channelId?: string;
    description?: string;
    defaultAudioLanguage?: string;
    defaultLanguage?: string;
    tags?: string[];
    thumbnails?: {
      medium?: { url?: string };
      high?: { url?: string };
      default?: { url?: string };
    };
  };
  contentDetails?: { duration?: string };
  status?: { privacyStatus?: string };
  statistics?: { viewCount?: string };
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

export function isCodingRelatedTopic(ctx: SharedCurriculumDayContext): boolean {
  if (ctx.trackId === 'dsa') return true;
  if (ctx.trackId === 'azure') return false;
  return /\b(code|coding|program|python|javascript|typescript|sql|algorithm|data structure|fastapi|react|api|database|backend|frontend|debugging)\b/i
    .test([ctx.topic, ...ctx.objectives, ctx.practicalWork].join(' '));
}

export function buildSearchFallbackTutorials(_ctx: SharedCurriculumDayContext): CanonicalYouTubeResource[] {
  return buildTrackQueryTerms(_ctx).map((query, index) => ({
    id: `yt_${_ctx.trackId}_d${_ctx.dayNumber}_search_${index + 1}`,
    title: `Search YouTube for ${_ctx.topic}`,
    channelName: 'YouTube topic search',
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    topicCovered: _ctx.topic,
    explanation: `Search results for ${_ctx.topic} and its Day ${_ctx.dayNumber} learning objectives.`,
    whyUseful: `Topic-specific search using ${_ctx.topic} and curriculum objectives.`,
    language: index === 0 ? 'te' : 'en',
    isVerifiedVideo: false,
    linkKind: 'youtube_search_fallback'
  }));
}

function buildLegacyGuestSearchFallbackTutorials(ctx: SharedCurriculumDayContext): CanonicalYouTubeResource[] {
  return buildSearchFallbackTutorials(ctx);
}

function isLikelyShortVideo(video: YouTubeVideoItem): boolean {
  const metadata = `${video.snippet?.title || ''} ${video.snippet?.description || ''} ${(video.snippet?.tags || []).join(' ')}`;
  return /(?:^|\s)#?shorts?(?:\s|$|[.,!?])/i.test(metadata);
}

async function discoverApprovedCodingTutorials(
  ctx: SharedCurriculumDayContext,
  apiKey: string,
  fetchImpl: typeof fetch
): Promise<YouTubeDiscoveryResult> {
  const noSuitable = (statusNote: string, providerStatus: YouTubeDiscoveryResult['providerStatus'] = 'unavailable') => ({
    tutorials: [], providerStatus, statusNote
  });
  try {
    const candidateIds: string[] = [];
    for (const channel of APPROVED_CODING_CHANNELS) {
      const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
      searchUrl.searchParams.set('part', 'snippet');
      searchUrl.searchParams.set('type', 'video');
      searchUrl.searchParams.set('maxResults', '2');
      searchUrl.searchParams.set('relevanceLanguage', 'en');
      searchUrl.searchParams.set('safeSearch', 'strict');
      searchUrl.searchParams.set('channelId', channel.channelId);
      searchUrl.searchParams.set('q', `${ctx.topic} ${ctx.objectives.slice(0, 2).join(' ')}`);
      searchUrl.searchParams.set('key', apiKey);
      const searchResp = await fetchImpl(searchUrl.toString(), { signal: AbortSignal.timeout(8000) });
      if (!searchResp.ok) {
        const status = searchResp.status === 403 || searchResp.status === 429 ? 'search_fallback_quota' : 'unavailable';
        return noSuitable(`No suitable video found. Approved channel search failed with HTTP ${searchResp.status}.`, status);
      }
      const searchJson = await searchResp.json() as { items?: YouTubeSearchItem[] };
      candidateIds.push(...(searchJson.items || []).map((item) => item.id?.videoId || ''));
    }
    const uniqueIds = Array.from(new Set(candidateIds.filter((id) => /^[a-zA-Z0-9_-]{11}$/.test(id))));
    if (uniqueIds.length === 0) return noSuitable('No suitable video found from the six verified approved coding channels.');

    const videosUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    videosUrl.searchParams.set('part', 'snippet,contentDetails,status');
    videosUrl.searchParams.set('id', uniqueIds.join(','));
    videosUrl.searchParams.set('key', apiKey);
    const videosResp = await fetchImpl(videosUrl.toString(), { signal: AbortSignal.timeout(8000) });
    if (!videosResp.ok) return noSuitable(`No suitable video found. YouTube video verification returned HTTP ${videosResp.status}.`, videosResp.status === 403 || videosResp.status === 429 ? 'search_fallback_quota' : 'unavailable');
    const videosJson = await videosResp.json() as { items?: YouTubeVideoItem[] };
    const approved = (videosJson.items || []).filter((video) => {
      const channelAllowed = APPROVED_CODING_CHANNELS.some((channel) => channel.channelId === video.snippet?.channelId);
      const duration = parseIsoDurationToSeconds(video.contentDetails?.duration);
      return Boolean(
        video.id && video.snippet?.title && video.snippet.channelTitle && channelAllowed &&
        video.status?.privacyStatus === 'public' &&
        duration >= 180 && !isLikelyShortVideo(video) &&
        hasMeaningfulTopicRelevance(ctx, video.snippet.title, video.snippet.description || '')
      );
    });
    const selected = approved.slice(0, 3);
    if (selected.length === 0) return noSuitable('No suitable video found. No approved-channel result passed availability and topic checks.');
    const tutorials: CanonicalYouTubeResource[] = selected.map((video, index) => {
      const videoId = video.id!;
      const thumb = video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.high?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      return {
        id: `yt_${ctx.trackId}_d${ctx.dayNumber}_${videoId}_${index + 1}`,
        title: video.snippet!.title!,
        channelName: video.snippet!.channelTitle!,
        channelId: video.snippet!.channelId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        videoId,
        thumbnailUrl: isValidHttpsUrl(thumb) ? thumb : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        topicCovered: `${ctx.topic}: ${ctx.objectives[0] || ctx.topic}`,
        explanation: (video.snippet?.description || `Video tutorial for ${ctx.topic}.`).replace(/\s+/g, ' ').slice(0, 160),
        whyUseful: `Matches ${ctx.topic} for Day ${ctx.dayNumber} and comes from a verified approved coding channel.`,
        duration: formatDurationSeconds(parseIsoDurationToSeconds(video.contentDetails?.duration)),
        language: video.snippet?.defaultAudioLanguage || video.snippet?.defaultLanguage || 'en',
        isVerifiedVideo: true,
        linkKind: 'verified_video'
      };
    });
    return { tutorials, providerStatus: 'youtube_api_verified', statusNote: `Verified ${tutorials.length} topic-matched public videos from approved coding channels.` };
  } catch {
    return noSuitable('No suitable video found because approved-channel verification could not complete.');
  }
}

interface NonCodingSearchCandidate {
  searchChannelId?: string;
}

interface YouTubeChannelItem {
  id?: string;
  snippet?: { title?: string; description?: string };
  statistics?: { subscriberCount?: string; videoCount?: string };
}

function getTopicTerms(topic: string): string[] {
  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'from', 'what', 'how', 'into', 'about', 'using', 'introduction',
    'fundamentals', 'concepts', 'learn', 'learning', 'understand', 'explained', 'explanation',
    'tutorial', 'course', 'training', 'guide', 'overview', 'basics', 'basic', 'today'
  ]);
  const normalized = topic.toLowerCase()
    .replace(/c\+\+/g, 'cplusplus')
    .replace(/c#/g, 'csharp')
    .replace(/\.net/g, 'dotnet')
    .replace(/az-(\d+)/g, 'az$1')
    .replace(/dp-(\d+)/g, 'dp$1')
    .replace(/ai-(\d+)/g, 'ai$1');
  return [...new Set(normalized.split(/[^a-z0-9]+/).filter((term) => term.length > 2 && !stopWords.has(term)))];
}

function hasMeaningfulTopicRelevance(ctx: SharedCurriculumDayContext, title: string, description: string): boolean {
  const topicTerms = getTopicTerms(ctx.topic);
  const objectiveTerms = getTopicTerms(ctx.objectives.join(' '));
  if (topicTerms.length === 0 || objectiveTerms.length === 0) return false;

  const titleTerms = new Set(getTopicTerms(title));
  const descriptionTerms = new Set(getTopicTerms(description));
  const allTerms = new Set([...titleTerms, ...descriptionTerms]);
  const topicMatches = topicTerms.filter((term) => allTerms.has(term)).length;
  const titleTopicMatches = topicTerms.filter((term) => titleTerms.has(term)).length;
  const objectiveMatches = objectiveTerms.filter((term) => allTerms.has(term)).length;
  const titleObjectiveMatches = objectiveTerms.filter((term) => titleTerms.has(term)).length;
  return titleTopicMatches >= Math.min(2, topicTerms.length) &&
    topicMatches >= Math.min(2, topicTerms.length) &&
    objectiveMatches >= Math.min(2, objectiveTerms.length) &&
    titleObjectiveMatches >= 1 &&
    new Set([...topicTerms.filter((term) => allTerms.has(term)), ...objectiveTerms.filter((term) => allTerms.has(term))]).size >= 3;
}

function detectVideoLanguage(video: YouTubeVideoItem): string {
  const languageTag = (video.snippet?.defaultAudioLanguage || video.snippet?.defaultLanguage || '').toLowerCase();
  if (languageTag.startsWith('te')) return 'te';
  if (languageTag.startsWith('en')) return 'en';
  const text = `${video.snippet?.title || ''} ${video.snippet?.description || ''}`;
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
  return 'unknown';
}

function isEducationalChannel(channel: YouTubeChannelItem | undefined): boolean {
  if (!channel?.id || !channel.snippet?.title) return false;
  const description = channel.snippet.description || '';
  const subscribers = Number(channel.statistics?.subscriberCount || 0);
  const videos = Number(channel.statistics?.videoCount || 0);
  const educational = /learn|learning|education|educational|training|tutorial|course|technology|cloud|certification|instructor|academy|engineering/i
    .test(`${channel.snippet.title} ${description}`);
  return educational && videos >= 10 && subscribers >= 5_000;
}

function isReusableVerifiedTutorial(ctx: SharedCurriculumDayContext, tutorial: CanonicalYouTubeResource): boolean {
  if (tutorial.linkKind === 'youtube_search_fallback') return true;
  if (!tutorial.isVerifiedVideo || !tutorial.channelId || !tutorial.videoId || !isValidHttpsUrl(tutorial.url)) return false;
  if (cachedVideoId(tutorial.url) !== tutorial.videoId || parseFormattedDuration(tutorial.duration) < 180) return false;
  if (isLikelyShortVideo({ snippet: { title: tutorial.title, description: tutorial.explanation } })) return false;
  if (!hasMeaningfulTopicRelevance(ctx, tutorial.title, tutorial.explanation)) return false;
  if (isCodingRelatedTopic(ctx)) {
    return APPROVED_CODING_CHANNELS.some((channel) => channel.channelId === tutorial.channelId);
  }
  const approvedAzureChannel = ctx.trackId === 'azure' && APPROVED_AZURE_CHANNELS.some((channel) => channel.channelId === tutorial.channelId);
  const educationalChannelName = /learn|learning|education|educational|training|tutorial|course|technology|cloud|certification|instructor|academy|engineering|microsoft/i.test(tutorial.channelName);
  return (tutorial.language === 'te' || tutorial.language === 'en') && (approvedAzureChannel || educationalChannelName);
}

function reusableTutorials(ctx: SharedCurriculumDayContext, tutorials: CanonicalYouTubeResource[]): CanonicalYouTubeResource[] {
  return tutorials.filter((tutorial) => isReusableVerifiedTutorial(ctx, tutorial));
}

function cachedVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || !['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com', 'youtu.be'].includes(parsed.hostname.toLowerCase())) return null;
    if (/^\/shorts\//i.test(parsed.pathname)) return null;
    const candidate = parsed.hostname === 'youtu.be'
      ? parsed.pathname.slice(1)
      : parsed.searchParams.get('v') || parsed.pathname.match(/\/(?:shorts|embed)\/([^/?]+)/)?.[1];
    return candidate && /^[a-zA-Z0-9_-]{11}$/.test(candidate) ? candidate : null;
  } catch {
    return null;
  }
}

function parseFormattedDuration(duration?: string): number {
  if (!duration) return 0;
  const parts = duration.split(':').map(Number);
  if (parts.some((part) => !Number.isInteger(part) || part < 0) || parts.length < 2 || parts.length > 3) return 0;
  return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
}

/** Revalidate cached Owner recommendations against current YouTube metadata. The DB intentionally stores no channel_id. */
export async function revalidateCachedYouTubeRows(
  rows: SupabaseResourceRow[],
  ctx: SharedCurriculumDayContext,
  apiKey: string | undefined,
  fetchImpl: typeof fetch,
  role: 'owner' | 'guest'
): Promise<SupabaseResourceRow[]> {
  const youtubeRows = rows.filter((row) => row.resource_type === 'youtube');
  if (!apiKey?.trim() || !youtubeRows.length) return [];

  const idsByVideoId = new Map<string, SupabaseResourceRow[]>();
  for (const row of youtubeRows) {
    const videoId = cachedVideoId(row.url || '');
    if (!videoId) continue;
    idsByVideoId.set(videoId, [...(idsByVideoId.get(videoId) || []), row]);
  }
  const videoIds = [...idsByVideoId.keys()];
  if (!videoIds.length) return [];

  try {
    const videosUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    videosUrl.searchParams.set('part', 'snippet,contentDetails,status');
    videosUrl.searchParams.set('id', videoIds.join(','));
    videosUrl.searchParams.set('key', apiKey.trim());
    const videosResponse = await fetchImpl(videosUrl.toString(), { signal: AbortSignal.timeout(8000) });
    if (!videosResponse.ok) return [];
    const videos = (await videosResponse.json() as { items?: YouTubeVideoItem[] }).items || [];
    const channelIds = [...new Set(videos.map((video) => video.snippet?.channelId).filter((id): id is string => Boolean(id)))];
    if (!channelIds.length) return [];

    const channelsUrl = new URL('https://www.googleapis.com/youtube/v3/channels');
    channelsUrl.searchParams.set('part', 'snippet,statistics');
    channelsUrl.searchParams.set('id', channelIds.join(','));
    channelsUrl.searchParams.set('key', apiKey.trim());
    const channelsResponse = await fetchImpl(channelsUrl.toString(), { signal: AbortSignal.timeout(8000) });
    if (!channelsResponse.ok) return [];
    const channelItems = (await channelsResponse.json() as { items?: YouTubeChannelItem[] }).items || [];
    const channels = new Map(channelItems.filter((channel): channel is YouTubeChannelItem & { id: string } => Boolean(channel.id)).map((channel) => [channel.id, channel]));
    return videos.flatMap((video) => {
      const channelId = video.snippet?.channelId;
      const channel = channelId ? channels.get(channelId) : undefined;
      const videoId = video.id;
      if (!videoId || !channelId || !channel?.snippet?.title || video.status?.privacyStatus !== 'public') return [];
      const title = video.snippet?.title?.trim() || '';
      if (!title || !hasMeaningfulTopicRelevance(ctx, title, video.snippet?.description || '')) return [];

      const coding = isCodingRelatedTopic(ctx);
      const approvedCodingChannel = APPROVED_CODING_CHANNELS.some((approved) => approved.channelId === channelId);
      const approvedAzureChannel = ctx.trackId === 'azure' && APPROVED_AZURE_CHANNELS.some((approved) => approved.channelId === channelId);
      if (coding && !approvedCodingChannel) return [];
      if (!coding && !approvedAzureChannel && !isEducationalChannel(channel)) return [];

      const durationSeconds = parseIsoDurationToSeconds(video.contentDetails?.duration);
      if (durationSeconds < 180 || isLikelyShortVideo(video)) return [];
      const matchingRows = idsByVideoId.get(videoId) || [];
      const language = detectVideoLanguage(video);
      if (language !== 'te' && language !== 'en') return [];

      const duration = formatDurationSeconds(durationSeconds);
      return matchingRows.filter((row) => row.is_verified).map((row) => ({
        ...row,
        title,
        channel_or_source: channel.snippet?.title || row.channel_or_source || '',
        channel_id: channelId,
        description: video.snippet?.description || '',
        duration: duration || null,
        language
      }));
    });
  } catch {
    // Fail closed for Owner cached videos when current metadata cannot be verified.
    return [];
  }
}

async function discoverNonCodingTutorials(
  ctx: SharedCurriculumDayContext,
  apiKey: string,
  fetchImpl: typeof fetch
): Promise<YouTubeDiscoveryResult> {
  const noSuitable = (statusNote = 'No suitable video found.') => ({
    tutorials: [] as CanonicalYouTubeResource[],
    providerStatus: 'unavailable' as const,
    statusNote
  });
  try {
    const searchQueries: Array<{ language: 'te' | 'en'; query: string; channelId?: string }> = [
      { language: 'te', query: `${ctx.topic} ${ctx.objectives[0] || ''} Telugu explanation tutorial${ctx.trackId === 'azure' ? ' Azure' : ''}` }
    ];
    if (ctx.trackId === 'azure') {
      for (const channel of APPROVED_AZURE_CHANNELS) {
        searchQueries.push({
          language: 'en',
          query: `Azure ${ctx.topic} ${ctx.objectives[0] || ''} explanation tutorial`,
          channelId: channel.channelId
        });
      }
    } else {
      searchQueries.push({
        language: 'en',
        query: `${ctx.topic} ${ctx.objectives[0] || ''} English explanation tutorial`
      });
    }

    const candidates = new Map<string, NonCodingSearchCandidate[]>();
    for (const search of searchQueries) {
      const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
      searchUrl.searchParams.set('part', 'snippet');
      searchUrl.searchParams.set('type', 'video');
      searchUrl.searchParams.set('maxResults', '6');
      searchUrl.searchParams.set('relevanceLanguage', search.language);
      searchUrl.searchParams.set('safeSearch', 'strict');
      searchUrl.searchParams.set('q', search.query);
      if (search.channelId) searchUrl.searchParams.set('channelId', search.channelId);
      searchUrl.searchParams.set('key', apiKey);
      const response = await fetchImpl(searchUrl.toString(), { signal: AbortSignal.timeout(8000) });
      if (!response.ok) continue;
      const payload = await response.json() as { items?: YouTubeSearchItem[] };
      for (const item of payload.items || []) {
        const id = item.id?.videoId;
        if (!id || !/^[a-zA-Z0-9_-]{11}$/.test(id) || !item.snippet?.channelId) continue;
        const existing = candidates.get(id) || [];
        existing.push({ searchChannelId: item.snippet.channelId });
        candidates.set(id, existing);
      }
    }
    const candidateIds = [...candidates.keys()];
    if (!candidateIds.length) return noSuitable();

    const detailsUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    detailsUrl.searchParams.set('part', 'snippet,contentDetails,status,statistics');
    detailsUrl.searchParams.set('id', candidateIds.join(','));
    detailsUrl.searchParams.set('key', apiKey);
    const detailsResp = await fetchImpl(detailsUrl.toString(), { signal: AbortSignal.timeout(8000) });
    if (!detailsResp.ok) return noSuitable();
    const details = await detailsResp.json() as { items?: YouTubeVideoItem[] };
    const channelIds = [...new Set((details.items || []).map((video) => video.snippet?.channelId).filter((id): id is string => Boolean(id)))];
    if (!channelIds.length) return noSuitable();

    const channelsUrl = new URL('https://www.googleapis.com/youtube/v3/channels');
    channelsUrl.searchParams.set('part', 'snippet,statistics');
    channelsUrl.searchParams.set('id', channelIds.join(','));
    channelsUrl.searchParams.set('key', apiKey);
    const channelsResp = await fetchImpl(channelsUrl.toString(), { signal: AbortSignal.timeout(8000) });
    if (!channelsResp.ok) return noSuitable();
    const channelPayload = await channelsResp.json() as { items?: YouTubeChannelItem[] };
    const channels = new Map((channelPayload.items || []).filter((channel): channel is YouTubeChannelItem & { id: string } => Boolean(channel.id)).map((channel) => [channel.id, channel]));
    const verified = (details.items || []).flatMap((video) => {
      const videoId = video.id;
      const channelId = video.snippet?.channelId;
      const title = video.snippet?.title?.trim();
      const channel = channelId ? channels.get(channelId) : undefined;
      const candidateSources = videoId ? candidates.get(videoId) || [] : [];
      const exactSearchMatch = candidateSources.some((source) => source.searchChannelId === channelId);
      const trustedAzureChannel = ctx.trackId === 'azure' && APPROVED_AZURE_CHANNELS.some((approved) => approved.channelId === channelId);
      const trustedChannel = trustedAzureChannel || isEducationalChannel(channel);
      const durationSeconds = parseIsoDurationToSeconds(video.contentDetails?.duration);
      const description = video.snippet?.description || '';
      const topicRelevant = title && hasMeaningfulTopicRelevance(ctx, title, description);
      if (!videoId || !channelId || !title || !channel?.snippet?.title || !exactSearchMatch || !trustedChannel || !topicRelevant || durationSeconds < 180 || isLikelyShortVideo(video) || video.status?.privacyStatus !== 'public') return [];
      const language = detectVideoLanguage(video);
      if (language !== 'te' && language !== 'en') return [];
      const languageRank = language === 'te' ? 0 : 1;
      const channelRank = trustedAzureChannel ? 0 : 1;
      const views = Number(video.statistics?.viewCount || 0);
      const thumb = video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.default?.url;
      const tutorial: CanonicalYouTubeResource = {
        id: `yt_${ctx.trackId}_d${ctx.dayNumber}_${videoId}`,
        title,
        channelName: channel.snippet.title,
        channelId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        videoId,
        thumbnailUrl: thumb && isValidHttpsUrl(thumb) ? thumb : undefined,
        topicCovered: ctx.topic,
        explanation: (video.snippet?.description || `Verified video covering ${ctx.topic}.`).replace(/\s+/g, ' ').slice(0, 180),
        whyUseful: `Verified non-coding video: public tutorial matched to ${ctx.topic} and its objectives; language: ${language === 'te' ? 'Telugu' : 'English'}.`,
        duration: formatDurationSeconds(durationSeconds),
        language,
        isVerifiedVideo: true,
        linkKind: 'verified_video' as const
      };
      return [{ tutorial, languageRank, channelRank, views, relevance: getTopicTerms(`${title} ${description}`).length }];
    });

    verified.sort((a, b) => a.languageRank - b.languageRank || a.channelRank - b.channelRank || b.relevance - a.relevance || b.views - a.views);
    const selected = verified.slice(0, 3).map((item) => item.tutorial);
    return selected.length
      ? { tutorials: selected, providerStatus: 'youtube_api_verified', statusNote: `Verified ${selected.length} topic-matched public non-coding videos with channel and language checks.` }
      : noSuitable();
  } catch {
    return noSuitable();
  }
}

async function discoverLegacyGuestNonCodingTutorials(
  ctx: SharedCurriculumDayContext,
  apiKey: string,
  fetchImpl: typeof fetch
): Promise<YouTubeDiscoveryResult> {
  return discoverNonCodingTutorials(ctx, apiKey, fetchImpl);
}
export async function discoverYouTubeTutorials(
  ctx: SharedCurriculumDayContext,
  youtubeApiKey?: string,
  fetchImpl: typeof fetch = fetch,
  role: 'owner' | 'guest' = 'owner'
): Promise<YouTubeDiscoveryResult> {
  const apiKey = youtubeApiKey?.trim().replace(/^["']|["']$/g, '').trim();
  if (!apiKey) {
    if (role === 'guest' && !isCodingRelatedTopic(ctx)) {
      return {
        tutorials: buildLegacyGuestSearchFallbackTutorials(ctx),
        providerStatus: 'search_fallback_no_key',
        statusNote: 'YouTube API key is unavailable; preserving Guest topic search links.'
      };
    }
    return {
      tutorials: buildSearchFallbackTutorials(ctx),
      providerStatus: 'unavailable',
      statusNote: 'No suitable video found. Verified topic recommendations require the YouTube Data API.'
    };
  }

  const extractSanitizedYouTubeError = async (resp: Response): Promise<string> => {
    try {
      const errJson = (await resp.json()) as {
        error?: { message?: string; status?: string; errors?: Array<{ reason?: string }> };
      };
      const reason = errJson?.error?.errors?.[0]?.reason || errJson?.error?.status || '';
      const rawMsg = errJson?.error?.message || '';
      const safeMsg = rawMsg
        .replace(/AIza[0-9A-Za-z_-]{20,}/g, '[REDACTED]')
        .replace(/key=[^&\s"']+/gi, 'key=[REDACTED]')
        .slice(0, 140);
      if (reason && safeMsg) return `${reason} (${safeMsg})`;
      if (safeMsg) return safeMsg;
      if (reason) return reason;
      return '';
    } catch {
      return '';
    }
  };

  if (isCodingRelatedTopic(ctx)) return discoverApprovedCodingTutorials(ctx, apiKey, fetchImpl);
  if (role === 'guest') return discoverLegacyGuestNonCodingTutorials(ctx, apiKey, fetchImpl);
  return discoverNonCodingTutorials(ctx, apiKey, fetchImpl);
}

// =========================================================================
// ACTUAL SCHEDULE & TIMETABLE DERIVATION (ZERO INVENTED TIMINGS)
// =========================================================================
export function buildActualScheduleMeta(ctx: SharedCurriculumDayContext): {
  scheduleTarget: string;
  studyTimetable: CanonicalTimetableSlot[];
} {
  const isSat = ctx.dayOfWeek === 'Saturday';
  const isSun = ctx.dayOfWeek === 'Sunday';

  if (ctx.trackId === 'main') {
    if (isSat) {
      return {
        scheduleTarget: '3h Prep + 3h Weekly Exam',
        studyTimetable: [
          { duration: '90 min', activity: 'Review Week Concept & Architecture Notes' },
          { duration: '90 min', activity: 'Complete Practical Deliverable & Weak-Area Revision' },
          { duration: '180 min', activity: `Weekly Saturday Examination (Week ${ctx.weekNumber})` }
        ]
      };
    }
    if (isSun) {
      return {
        scheduleTarget: '3 Hours Revision',
        studyTimetable: [
          { duration: '90 min', activity: 'Weekly Consolidation & Mistake Review' },
          { duration: '60 min', activity: 'Rebuild Key Implementation / Diagram' },
          { duration: '30 min', activity: 'Next-Week Warm-Up & Notes Organization' }
        ]
      };
    }
    return {
      scheduleTarget: '4 Hours (240 Mins)',
      studyTimetable: [
        { duration: '60 min', activity: 'Learn Concepts, Docs & Core Theory' },
        { duration: '120 min', activity: 'Guided Implementation & Practical Exercise' },
        { duration: '30 min', activity: 'Test, Debug & Verify Edge Cases' },
        { duration: '30 min', activity: 'Write Revision Notes & Save Deliverable' }
      ]
    };
  }

  if (ctx.trackId === 'dsa') {
    if (isSat) {
      return {
        scheduleTarget: '2 Hours (120 Mins) Revision',
        studyTimetable: [
          { duration: '45 min', activity: 'Re-solve Weekly C++ Exercises Without Notes' },
          { duration: '45 min', activity: 'Timed Coding Assessment & Complexity Analysis' },
          { duration: '30 min', activity: 'Update DSA Error Log & Edge-Case Notes' }
        ]
      };
    }
    if (isSun) {
      return {
        scheduleTarget: '2 Hours (120 Mins) Revision',
        studyTimetable: [
          { duration: '40 min', activity: 'Review Weekly C++ Patterns & STL Notes' },
          { duration: '50 min', activity: 'Rebuild 1 Key Solution From Blank File' },
          { duration: '30 min', activity: 'List 3 Weak Areas & Next-Week Warm-Up' }
        ]
      };
    }
    return {
      scheduleTarget: '90 Minutes',
      studyTimetable: [
        { duration: '30 min', activity: 'Learn & Understand C++ Concepts & Complexity' },
        { duration: '40 min', activity: 'Solve Practice Problems + 3 LeetCode Questions' },
        { duration: '20 min', activity: 'Revise & Make Short C++ Notes' }
      ]
    };
  }

  // Azure Alternate (100 Days): 1 hour Mon-Sun
  if (isSat) {
    return {
      scheduleTarget: '60 Minutes Revision',
      studyTimetable: [
        { duration: '30 min', activity: 'Answer Weekly Azure Scenario Questions' },
        { duration: '20 min', activity: 'Repeat Portal/Service Exercise & Security Check' },
        { duration: '10 min', activity: 'Verify Cost & Lab Resource Cleanup' }
      ]
    };
  }
  if (isSun) {
    return {
      scheduleTarget: '60 Minutes Revision',
      studyTimetable: [
        { duration: '25 min', activity: 'Review Azure Service Comparison Notes' },
        { duration: '25 min', activity: 'Redraw Architecture / Data-Flow Diagram' },
        { duration: '10 min', activity: 'List Gaps & Next-Week Checklist' }
      ]
    };
  }
  return {
    scheduleTarget: '60 Minutes',
    studyTimetable: [
      { duration: '25 min', activity: 'Read Microsoft Learn Docs & Service Concepts' },
      { duration: '25 min', activity: 'Hands-On Architecture / Portal Exercise' },
      { duration: '10 min', activity: 'Document Cost, Security & Milestone Notes' }
    ]
  };
}

// =========================================================================
// GEMINI ENRICHMENT (gemini-4-hydrogen, PREPARATION_GEMINI_KEY)
// =========================================================================
export interface GeminiEnrichmentOutput {
  topicExplanation: string;
  learningObjectives: string[];
  practicalExamples: string[];
  revisionNotes: string[];
  commonMistakes: string[];
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
  aiProviderStatus:
    | 'gemini_generated'
    | 'quota_exhausted_cached'
    | 'missing_api_key'
    | 'invalid_api_key'
    | 'unavailable';
  modelUsed?: string;
  data?: GeminiEnrichmentOutput;
  errorMessage?: string;
}

export function isQuotaOrRateLimitStatusOrMsg(status: number, msg: string): boolean {
  if (status === 429) return true;
  const lower = msg.toLowerCase();
  return (
    lower.includes('429') ||
    lower.includes('resource_exhausted') ||
    lower.includes('quota') ||
    lower.includes('rate limit')
  );
}

export function isInvalidOrDisabledApiKeyStatusOrMsg(status: number, msg: string): boolean {
  if (status === 401 || status === 403) return true;
  const lower = msg.toLowerCase();
  return (
    lower.includes('api_key_invalid') ||
    lower.includes('api key not valid') ||
    lower.includes('permission_denied') ||
    lower.includes('api key expired') ||
    lower.includes('disabled') ||
    lower.includes('consumer') && lower.includes('suspended')
  );
}

export function buildTrackMentorSystemInstruction(trackId: SharedTrackId): string {
  const base =
    "You are an engineering mentor for Steeven's 180-Day Preparation Tracker. Stay 100% grounded in the provided curriculum topic, subtopics, practical task, official docs, and YouTube items. Never invent URLs, video IDs, or LeetCode problems. Keep explanations beginner-friendly, concise, and actionable. For every YouTube item in youtubeAnnotations, return its exact id and write an explicit topicCovered sentence naming the specific concept covered alongside a clear short explanation and whyUseful note.";
  if (trackId === 'dsa') {
    return `${base} For DSA in C++, include clear C++17 examples and Big-O time/space complexity in practicalExamples, highlight common off-by-one/edge-case bugs in commonMistakes, and provide concise C++ revision reminders in revisionNotes.`;
  }
  if (trackId === 'azure') {
    return `${base} For Azure (AZ-900 / DP-900 / AI-102), emphasize Azure service boundaries, real-world architecture use cases in practicalExamples, cost/security/cleanup cautions in commonMistakes, and Microsoft Learn exam revision notes in revisionNotes.`;
  }
  return `${base} For Main Plan (Production RAG & AI Engineering), include concrete Python/RAG architectural examples in practicalExamples, trust-boundary/failure pitfalls in commonMistakes, and crisp revision notes in revisionNotes.`;
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
    console.warn('[daily-resources] Gemini fallback selected', {
      provider: 'gemini', model: FREE_TIER_GEMINI_MODEL, track: ctx.trackId, reason: 'missing_api_key'
    });
    return {
      success: false,
      aiProviderStatus: 'missing_api_key',
      errorMessage: 'PREPARATION_GEMINI_KEY is not configured in server environment secrets.'
    };
  }

  const promptPayload = {
    track: ctx.trackLabel,
    dayNumber: ctx.dayNumber,
    date: ctx.dateLabel,
    dayOfWeek: ctx.dayOfWeek,
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

  for (let attempt = 1; attempt <= GEMINI_MAX_ATTEMPTS; attempt += 1) {
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
                text: buildTrackMentorSystemInstruction(ctx.trackId)
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
                practicalExamples: { type: 'ARRAY', items: { type: 'STRING' } },
                revisionNotes: { type: 'ARRAY', items: { type: 'STRING' } },
                commonMistakes: { type: 'ARRAY', items: { type: 'STRING' } },
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
                'practicalExamples',
                'revisionNotes',
                'commonMistakes',
                'suggestedLearningOrder',
                'dailyGuidance',
                'practicalExerciseSummary',
                'youtubeAnnotations'
              ]
            }
          }
        }),
        signal: AbortSignal.timeout(20000)
      }
    );

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      const quotaHit = isQuotaOrRateLimitStatusOrMsg(resp.status, errText);
      const invalidKey = !quotaHit && isInvalidOrDisabledApiKeyStatusOrMsg(resp.status, errText);
      const retryAfter = resp.headers.get('retry-after');
      const retryableResponse = isRetryableGeminiStatus(resp.status) &&
        !(resp.status === 429 && isHardQuotaExhaustion(errText));
      if (retryableResponse && attempt < GEMINI_MAX_ATTEMPTS) {
        const waited = await waitBeforeGeminiRetry(attempt, retryAfter);
        if (!waited) {
          console.warn('[daily-resources] Gemini retry deferred to a later run', {
            provider: 'gemini', model: FREE_TIER_GEMINI_MODEL, track: ctx.trackId,
            status: resp.status, reason: 'retry_after_exceeds_bounded_wait', attempt
          });
        } else {
        console.warn('[daily-resources] Gemini transient response; retrying', {
          provider: 'gemini', model: FREE_TIER_GEMINI_MODEL, track: ctx.trackId,
          status: resp.status, attempt, maxAttempts: GEMINI_MAX_ATTEMPTS,
          retryAfter: retryAfter || undefined
        });
        continue;
        }
      }
      console.warn('[daily-resources] Gemini fallback selected', {
        provider: 'gemini', model: FREE_TIER_GEMINI_MODEL, track: ctx.trackId,
        status: resp.status, reason: quotaHit ? 'quota_or_rate_limit' : invalidKey ? 'invalid_key' : 'provider_error',
        attempt
      });
      return {
        success: false,
        aiProviderStatus: quotaHit
          ? 'quota_exhausted_cached'
          : invalidKey
          ? 'invalid_api_key'
          : 'unavailable',
        errorMessage: quotaHit
          ? `Gemini quota exceeded or rate-limited (HTTP ${resp.status}).`
          : invalidKey
          ? `PREPARATION_GEMINI_KEY is invalid, disabled, or denied permission (HTTP ${resp.status}). Update PREPARATION_GEMINI_KEY in Secrets.`
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
    console.info('[daily-resources] Gemini generation succeeded', {
      provider: 'gemini', model: FREE_TIER_GEMINI_MODEL, track: ctx.trackId, attempt
    });
    return {
      success: true,
      aiProviderStatus: 'gemini_generated',
      modelUsed: FREE_TIER_GEMINI_MODEL,
      data: parsed
    };
   } catch (err) {
    const detail = err instanceof Error ? err.message : 'Gemini API call failed.';
    const statusMatch = detail.match(/(?:HTTP|status|code)\s*[:=]?\s*(429|502|503|504)\b/i);
    const status = statusMatch ? Number(statusMatch[1]) : 0;
    if (isRetryableGeminiStatus(status) && attempt < GEMINI_MAX_ATTEMPTS) {
      console.warn('[daily-resources] Gemini transient failure; retrying', {
        provider: 'gemini', model: FREE_TIER_GEMINI_MODEL, track: ctx.trackId,
        status, attempt, maxAttempts: GEMINI_MAX_ATTEMPTS
      });
      await waitBeforeGeminiRetry(attempt, null);
      continue;
    }
    const quotaHit = isQuotaOrRateLimitStatusOrMsg(0, detail);
    const invalidKey = !quotaHit && isInvalidOrDisabledApiKeyStatusOrMsg(0, detail);
    console.warn('[daily-resources] Gemini fallback selected', {
      provider: 'gemini', model: FREE_TIER_GEMINI_MODEL, track: ctx.trackId,
      status: status || undefined, reason: quotaHit ? 'quota_or_rate_limit' : invalidKey ? 'invalid_key' : 'provider_error',
      attempt
    });
    return {
      success: false,
      aiProviderStatus: quotaHit
        ? 'quota_exhausted_cached'
        : invalidKey
        ? 'invalid_api_key'
        : 'unavailable',
      errorMessage: quotaHit
        ? `Gemini quota exceeded or rate-limited (${detail}).`
        : invalidKey
        ? `PREPARATION_GEMINI_KEY is invalid or disabled (${detail}).`
        : `Gemini generation unavailable: ${detail}`
    };
   }
  }
  return { success: false, aiProviderStatus: 'unavailable', errorMessage: 'Gemini retries exhausted.' };
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
      practicalExamples: existingCached.practicalExamples || [],
      revisionNotes: existingCached.revisionNotes || [],
      commonMistakes: existingCached.commonMistakes || [],
      suggestedLearningOrder: existingCached.suggestedLearningOrder,
      dailyGuidance: existingCached.dailyGuidance,
      practicalExerciseSummary: existingCached.practicalExerciseSummary,
      tutorials: mergedTutorials
    };
  }

  const baseExplanation =
    ctx.trackId === 'dsa'
      ? `Today's C++ DSA focus is "${ctx.topic}" (${ctx.phaseOrModule}). Master ${ctx.objectives[0] || ctx.topic} and implement cleanly in C++ to satisfy: ${ctx.expectedOutcome}`
      : ctx.trackId === 'azure'
      ? `Today's Azure preparation covers "${ctx.topic}" (${ctx.phaseOrModule}). Study Microsoft Learn architecture guidance to complete: ${ctx.expectedOutcome}`
      : `Today's Main Plan session focuses on "${ctx.topic}" (${ctx.phaseOrModule}). Complete the core implementation concepts so you can ship: ${ctx.deliverable}`;

  const practicalExamples =
    ctx.trackId === 'dsa'
      ? [
          `C++ Practice Pattern (${ctx.topic}): Write clean C++17 code using standard STL headers, trace dry-run states, and verify Time & Space Big-O complexity.`,
          `Hands-on Deliverable: ${ctx.practicalWork}`
        ]
      : ctx.trackId === 'azure'
      ? [
          `Azure Architecture & Use Case (${ctx.topic}): Map service boundaries, identity/RBAC, and cost controls based on ${docs[0]?.title || 'Microsoft Learn'}.`,
          `Practical Exercise: ${ctx.practicalWork}`
        ]
      : [
          `Engineering Implementation (${ctx.topic}): Apply today's concept to your Production RAG codebase — ${ctx.practicalWork}`,
          `Expected Milestone Output: ${ctx.deliverable}`
        ];

  const revisionNotes = [
    `Key Focus: ${ctx.objectives.slice(0, 3).join(' · ') || ctx.topic}`,
    `Expected Outcome: ${ctx.expectedOutcome}`,
    `Deliverable Target: ${ctx.deliverable}`
  ];

  const commonMistakes =
    ctx.trackId === 'dsa'
      ? [
          'Skipping edge-case dry runs (empty input, single element, integer overflow) before coding.',
          'Writing brute-force loops without analyzing Time/Space complexity first.'
        ]
      : ctx.trackId === 'azure'
      ? [
          'Leaving paid Azure lab resources running after completing hands-on practice.',
          'Hardcoding connection strings or API keys instead of using managed identity / Key Vault.'
        ]
      : [
          'Skipping explicit trust boundaries or letting client code call providers directly.',
          'Moving to the next topic before verifying today\'s deliverable and notes.'
        ];

  const order =
    ctx.trackId === 'dsa'
      ? [
          `Review official C++ documentation (${docs[0]?.title || 'cppreference'}) for syntax & complexity guarantees.`,
          `Watch 1–2 focused YouTube tutorials on "${ctx.topic}" before coding.`,
          leetcodeQuestions.some((q) => q.available)
            ? "Solve today's LeetCode triplet in order: Easy -> Medium -> Hard."
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
    practicalExamples,
    revisionNotes,
    commonMistakes,
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

function safeHttpsHref(url?: string): string | null {
  if (!url || !isValidHttpsUrl(url)) return null;
  return escapeHtml(url);
}

function getTrackShortBadgeLabel(trackId: SharedTrackId): string {
  if (trackId === 'dsa') return 'DSA in C++';
  if (trackId === 'azure') return 'Azure Alternate';
  return 'Main Plan (180d)';
}

function getTrackMotivationQuote(track: CanonicalTrackDailyResources): string {
  if (track.trackId === 'dsa') {
    return `"Small, consistent efforts on the right topics create big results. Keep coding, Steeven! 💪"`;
  }
  if (track.trackId === 'azure') {
    return `"Stay disciplined, Steeven. Today's Azure architecture clarity is tomorrow's cloud confidence. 🚀"`;
  }
  return `"One focused day at a time. Your consistency builds your future. 💪"`;
}

function renderYouTubeHtmlList(tutorials: CanonicalYouTubeResource[]): string {
  if (!tutorials || tutorials.length === 0) {
    return '<p style="margin:8px 0;color:#78716C;font-size:13px;">No verified tutorials available for this topic today.</p>';
  }

  return tutorials
    .map((yt, idx) => {
      const safeHref = safeHttpsHref(yt.url);
      const safeThumb = safeHttpsHref(yt.thumbnailUrl);
      const badgeText = yt.isVerifiedVideo ? 'Verified Video' : 'Topic Search';
      const badgeBg = yt.isVerifiedVideo ? '#ECFDF5' : '#FEF3C7';
      const badgeColor = yt.isVerifiedVideo ? '#047857' : '#92400E';

      return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E0DCD3;border-radius:10px;margin-bottom:10px;background:#FAF8F5;border-collapse:separate;">
        <tr>
          <td style="padding:10px 12px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                ${
                  safeThumb
                    ? `<td width="118" valign="top" style="padding-right:12px;">
                        <img src="${safeThumb}" alt="${escapeHtml(yt.title)}" width="112" style="display:block;width:112px;height:64px;object-fit:cover;border-radius:8px;border:1px solid #E0DCD3;" />
                      </td>`
                    : ''
                }
                <td valign="top">
                  <div style="margin-bottom:4px;">
                    <strong style="font-size:13px;color:#292929;line-height:1.35;">${idx + 1}. ${escapeHtml(yt.title)}</strong>
                  </div>
                  <div style="font-size:11px;color:#57534E;margin-bottom:5px;">
                    <strong>${escapeHtml(yt.channelName)}</strong>
                    ${yt.duration ? ` &middot; <span style="font-family:monospace;color:#292929;">${escapeHtml(yt.duration)}</span>` : ''}
                    &nbsp;<span style="display:inline-block;padding:1px 7px;border-radius:999px;background:${badgeBg};color:${badgeColor};font-size:10px;font-weight:700;">${badgeText}</span>
                  </div>
                  <div style="font-size:11px;color:#57534E;line-height:1.45;margin-bottom:7px;">
                    <strong style="color:#C2410C;">Topic:</strong> ${escapeHtml(yt.topicCovered)}
                  </div>
                  ${
                    safeHref
                      ? `<a href="${safeHref}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:5px 11px;border-radius:6px;background:#292929;color:#F3EFE6;text-decoration:none;font-size:11px;font-weight:700;">${
                          yt.isVerifiedVideo ? 'Watch Video' : 'Open YouTube Search'
                        } &rarr;</a>`
                      : ''
                  }
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;
    })
    .join('');
}

function renderLeetCodeHtmlList(questions: SharedDailyLeetCodeQuestion[]): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      ${questions
        .map((q) => {
          const diffEmoji = q.difficulty === 'Easy' ? '🟢' : q.difficulty === 'Medium' ? '🟡' : '🔴';
          const diffColor =
            q.difficulty === 'Easy' ? '#047857' : q.difficulty === 'Medium' ? '#B45309' : '#BE123C';
          const diffBg =
            q.difficulty === 'Easy' ? '#F0FDF4' : q.difficulty === 'Medium' ? '#FFFBEB' : '#FFF1F2';
          const safeHref = safeHttpsHref(q.url);

          return `
          <td width="33.33%" valign="top" style="padding:4px;" class="stack-col">
            <div style="border:1px solid #E0DCD3;border-radius:10px;padding:12px;background:${diffBg};height:100%;">
              <div style="font-size:11px;font-weight:800;color:${diffColor};text-transform:uppercase;margin-bottom:6px;">
                ${diffEmoji} ${escapeHtml(q.difficulty)}
              </div>
              ${
                q.available
                  ? `<div style="font-size:13px;font-weight:800;color:#292929;margin-bottom:5px;line-height:1.3;">
                      ${q.problemNumber ? `#${escapeHtml(q.problemNumber)}. ` : ''}${escapeHtml(q.title || '')}
                    </div>
                    <div style="font-size:11px;color:#57534E;line-height:1.45;margin-bottom:6px;">
                      ${escapeHtml(q.shortExplanation)}
                    </div>
                    <div style="font-size:11px;color:#292929;line-height:1.4;margin-bottom:8px;">
                      <strong>Relevance:</strong> ${escapeHtml(q.whyMatchesTopic)}
                    </div>
                    ${
                      safeHref
                        ? `<a href="${safeHref}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:6px 10px;border-radius:6px;background:#E7826D;color:#292929;text-decoration:none;font-size:11px;font-weight:800;">Solve on LeetCode &rarr;</a>`
                        : ''
                    }`
                  : `<div style="font-size:12px;font-weight:700;color:#57534E;margin-bottom:4px;">Unavailable Today</div>
                    <div style="font-size:11px;color:#78716C;line-height:1.4;">${escapeHtml(
                      q.whyUnavailable || q.shortExplanation
                    )}</div>`
              }
            </div>
          </td>`;
        })
        .join('')}
    </tr>
  </table>`;
}

function hasChecklistCompletion(
  doneMap: Record<string, boolean>,
  exactKeys: string[],
  prefixes: string[] = []
): boolean {
  for (const key of exactKeys) {
    if (doneMap[key]) return true;
  }
  if (prefixes.length > 0) {
    for (const [key, val] of Object.entries(doneMap)) {
      if (val && prefixes.some((prefix) => key.startsWith(prefix))) {
        return true;
      }
    }
  }
  return false;
}

function buildTrackChecklistItems(
  track: CanonicalTrackDailyResources,
  completedKeys?: Record<string, boolean>
): { label: string; checked: boolean }[] {
  const ctx = getSharedCurriculumDayContext(track.trackId, track.planDay);
  const doneMap = completedKeys || {};
  const prefix = track.trackId === 'main' ? `${track.planDay}_` : `${track.trackId}_${track.planDay}_`;
  const ytPrefix = `yt_${track.trackId}_d${track.planDay}_`;
  const docPrefix = `doc_${track.trackId}_d${track.planDay}_`;
  const exKey = `ex_${track.trackId}_d${track.planDay}`;

  if (track.trackId === 'dsa') {
    return [
      {
        label: `Study ${track.topicTitle} (Concepts & C++ Examples)`,
        checked: hasChecklistCompletion(doneMap, [`${prefix}obj`])
      },
      {
        label: 'Watch recommended YouTube tutorial',
        checked: hasChecklistCompletion(doneMap, [`${ytPrefix}0`], [ytPrefix])
      },
      {
        label: track.leetcodeQuestions.some((q) => q.available)
          ? 'Solve the 3 LeetCode problems (Easy / Medium / Hard)'
          : `Complete hands-on C++ work: ${ctx?.practicalWork.slice(0, 70) || track.topicTitle}`,
        checked: hasChecklistCompletion(doneMap, [`${prefix}work`, exKey])
      },
      {
        label: `Revise & save milestone: ${ctx?.deliverable || track.topicTitle}`,
        checked: hasChecklistCompletion(doneMap, [`${prefix}milestone`])
      }
    ];
  }

  if (track.trackId === 'azure') {
    return [
      {
        label: `Read Microsoft Learn docs for ${track.topicTitle}`,
        checked: hasChecklistCompletion(doneMap, [`${prefix}obj`], [docPrefix])
      },
      {
        label: 'Watch recommended Azure YouTube video',
        checked: hasChecklistCompletion(doneMap, [`${ytPrefix}0`], [ytPrefix])
      },
      {
        label: `Complete hands-on lab/exercise: ${ctx?.practicalWork.slice(0, 75) || track.topicTitle}`,
        checked: hasChecklistCompletion(doneMap, [`${prefix}work`, exKey])
      },
      {
        label: `Verify cost/security cleanup & log notes (${ctx?.deliverable.slice(0, 55) || 'Milestone'})`,
        checked: hasChecklistCompletion(doneMap, [`${prefix}milestone`])
      }
    ];
  }

  return [
    {
      label: `Study Main Plan Day ${track.planDay}: ${track.topicTitle}`,
      checked: hasChecklistCompletion(doneMap, [`${track.planDay}_concept`, `${track.planDay}_t1`])
    },
    {
      label: 'Watch topic-specific YouTube walkthrough & review docs',
      checked: hasChecklistCompletion(doneMap, [`${docPrefix}0`, `${ytPrefix}0`], [docPrefix, ytPrefix])
    },
    {
      label: `Build practical task: ${ctx?.practicalWork.slice(0, 75) || track.topicTitle}`,
      checked: hasChecklistCompletion(doneMap, [`${track.planDay}_practical`, `${track.planDay}_t2`, exKey])
    },
    {
      label: `Test edge cases & ship deliverable (${ctx?.deliverable.slice(0, 55) || 'Deliverable'})`,
      checked: hasChecklistCompletion(doneMap, [`${track.planDay}_deliverable`, `${track.planDay}_t3`])
    }
  ];
}

function renderTrackSectionHtml(
  sectionLabel: string,
  track: CanonicalTrackDailyResources | null,
  includeLeetCode: boolean,
  completedChecklistMap?: Record<string, boolean>
): string {
  if (!track) {
    return `
    <div style="background:#FFFFFF;border:1px solid #E0DCD3;border-radius:14px;padding:20px;margin-bottom:20px;">
      <h2 style="margin:0 0 8px;font-size:16px;color:#292929;text-transform:uppercase;letter-spacing:0.5px;">${escapeHtml(
        sectionLabel
      )}</h2>
      <p style="margin:0;font-size:13px;color:#78716C;">Schedule not unlocked yet for today's Asia/Kolkata date.</p>
    </div>`;
  }

  const ctx = getSharedCurriculumDayContext(track.trackId, track.planDay);
  const actualSchedule = buildActualScheduleMeta(ctx || {
    trackId: track.trackId,
    trackLabel: track.trackLabel,
    dayNumber: track.planDay,
    isoDate: track.planDate,
    dateLabel: track.dateLabel,
    dayOfWeek: track.dayOfWeek || '',
    weekNumber: 1,
    phaseOrModule: track.phaseOrModule,
    topic: track.topicTitle,
    objectives: track.learningObjectives,
    practicalWork: track.practicalExerciseSummary,
    expectedOutcome: track.dailyGuidance,
    deliverable: track.practicalExerciseSummary,
    isDsaRelated: track.trackId === 'dsa'
  });

  const maxDays = track.trackId === 'main' ? MAIN_TRACK_MAX_DAYS : SUB_TRACK_MAX_DAYS;
  const pct = Math.min(100, Math.round((track.planDay / maxDays) * 100));
  const scheduleTarget = track.scheduleTarget || actualSchedule.scheduleTarget;
  const timetable = track.studyTimetable?.length ? track.studyTimetable : actualSchedule.studyTimetable;
  const practicalExamples = track.practicalExamples?.length
    ? track.practicalExamples
    : [track.practicalExerciseSummary];
  const revisionNotes = track.revisionNotes?.length
    ? track.revisionNotes
    : track.learningObjectives.slice(0, 3);
  const commonMistakes = track.commonMistakes?.length ? track.commonMistakes : [];
  const checklistItems = buildTrackChecklistItems(track, completedChecklistMap);

  const docsHtml =
    track.officialDocs.length > 0
      ? track.officialDocs
          .map((doc) => {
            const safeHref = safeHttpsHref(doc.url);
            return `
            <div style="border:1px solid #E0DCD3;border-radius:8px;padding:9px 11px;margin-bottom:8px;background:#FAF8F5;">
              <div style="font-size:12px;font-weight:700;color:#292929;margin-bottom:2px;">
                ${
                  safeHref
                    ? `<a href="${safeHref}" target="_blank" rel="noopener noreferrer" style="color:#C2410C;text-decoration:underline;">${escapeHtml(
                        doc.title
                      )} &rarr;</a>`
                    : escapeHtml(doc.title)
                }
              </div>
              <div style="font-size:11px;color:#78716C;margin-bottom:2px;">${escapeHtml(doc.sourceLabel)}</div>
              <div style="font-size:11px;color:#57534E;line-height:1.4;">${escapeHtml(doc.description)}</div>
            </div>`;
          })
          .join('')
      : '<p style="margin:4px 0;font-size:12px;color:#78716C;">Refer to today\'s syllabus deliverables.</p>';

  return `
  <!-- TRACK SECTION: ${escapeHtml(track.trackLabel)} -->
  <div style="margin-bottom:22px;">
    <!-- Preparation Identity Card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F5;border:1px solid #E0DCD3;border-radius:14px;margin-bottom:14px;">
      <tr>
        <td style="padding:16px 18px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="28%" valign="top" style="padding-right:12px;border-right:1px solid #E0DCD3;" class="stack-col">
                <div style="font-size:24px;font-weight:800;color:#292929;line-height:1.1;">DAY ${track.planDay}</div>
                <div style="display:inline-block;margin-top:6px;padding:4px 10px;border-radius:999px;background:#E7826D;color:#FFFFFF;font-size:11px;font-weight:800;">
                  ${escapeHtml(getTrackShortBadgeLabel(track.trackId))}
                </div>
              </td>
              <td width="24%" valign="top" style="padding:0 12px;border-right:1px solid #E0DCD3;" class="stack-col">
                <div style="font-size:11px;color:#78716C;font-weight:600;">📅 Date</div>
                <div style="font-size:13px;font-weight:700;color:#292929;margin-top:3px;">${escapeHtml(track.dateLabel)}</div>
                <div style="font-size:11px;color:#57534E;">(${escapeHtml(track.dayOfWeek || ctx?.dayOfWeek || 'IST')})</div>
              </td>
              <td width="23%" valign="top" style="padding:0 12px;border-right:1px solid #E0DCD3;" class="stack-col">
                <div style="font-size:11px;color:#78716C;font-weight:600;">🕒 Today's Target</div>
                <div style="font-size:13px;font-weight:700;color:#292929;margin-top:3px;">${escapeHtml(scheduleTarget)}</div>
              </td>
              <td width="25%" valign="top" style="padding-left:12px;" class="stack-col">
                <div style="font-size:11px;color:#78716C;font-weight:600;">🎯 Track Progress</div>
                <div style="font-size:13px;font-weight:700;color:#292929;margin-top:3px;">${track.planDay} / ${maxDays} Days (${pct}%)</div>
                <div style="margin-top:6px;background:#E0DCD3;border-radius:999px;height:7px;overflow:hidden;">
                  <div style="width:${pct}%;background:#E7826D;height:7px;border-radius:999px;"></div>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Row 1: Today's Topics + Today's Study Plan -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
      <tr>
        <td width="50%" valign="top" style="padding-right:7px;" class="stack-col">
          <div style="background:#FFFFFF;border:1px solid #E0DCD3;border-radius:14px;overflow:hidden;">
            <div style="background:#6B4433;color:#F3EFE6;padding:10px 14px;font-size:13px;font-weight:800;">
              📖 Today's Topics
            </div>
            <div style="padding:14px;">
              <div style="font-size:11px;font-weight:700;color:#E7826D;text-transform:uppercase;margin-bottom:4px;">
                ${escapeHtml(track.phaseOrModule)}
              </div>
              <div style="font-size:16px;font-weight:800;color:#292929;margin-bottom:8px;">
                ${escapeHtml(track.topicTitle)}
              </div>
              <ul style="margin:0;padding-left:18px;font-size:12px;color:#57534E;line-height:1.55;">
                ${track.learningObjectives.map((obj) => `<li style="margin-bottom:3px;">${escapeHtml(obj)}</li>`).join('')}
              </ul>
            </div>
          </div>
        </td>
        <td width="50%" valign="top" style="padding-left:7px;" class="stack-col">
          <div style="background:#FFFFFF;border:1px solid #E0DCD3;border-radius:14px;overflow:hidden;">
            <div style="background:#6B4433;color:#F3EFE6;padding:10px 14px;font-size:13px;font-weight:800;">
              🕒 Today's Study Plan (${escapeHtml(scheduleTarget)})
            </div>
            <div style="padding:14px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${timetable
                  .map(
                    (slot) => `
                  <tr>
                    <td width="76" valign="top" style="padding:4px 8px 6px 0;">
                      <span style="display:inline-block;padding:3px 7px;border-radius:6px;background:#E7826D;color:#FFFFFF;font-size:11px;font-weight:700;white-space:nowrap;">${escapeHtml(
                        slot.duration
                      )}</span>
                    </td>
                    <td valign="top" style="padding:4px 0 6px;font-size:12px;color:#292929;font-weight:600;line-height:1.35;">
                      ${escapeHtml(slot.activity)}
                    </td>
                  </tr>`
                  )
                  .join('')}
              </table>
            </div>
          </div>
        </td>
      </tr>
    </table>

    <!-- Row 2: AI Learning Summary + Key Takeaways & Revision -->
    <div style="background:#FFFFFF;border:1px solid #E0DCD3;border-radius:14px;overflow:hidden;margin-bottom:14px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="52%" valign="top" style="padding:0;border-right:1px solid #E0DCD3;" class="stack-col">
            <div style="background:#C26D53;color:#FFFFFF;padding:10px 14px;font-size:13px;font-weight:800;">
              ✨ AI Learning Summary &amp; Practical Examples
            </div>
            <div style="padding:14px;font-size:12px;color:#292929;line-height:1.6;">
              <p style="margin:0 0 8px;">${escapeHtml(track.topicExplanation)}</p>
              <div style="background:#FAF8F5;border-left:3px solid #E7826D;padding:8px 10px;border-radius:6px;margin-bottom:6px;">
                <strong style="display:block;margin-bottom:3px;">Practical Examples &amp; Exercise:</strong>
                <ul style="margin:0;padding-left:16px;color:#57534E;">
                  ${practicalExamples.map((ex) => `<li style="margin-bottom:2px;">${escapeHtml(ex)}</li>`).join('')}
                </ul>
              </div>
              <div style="font-size:11px;color:#57534E;">
                <strong>Deliverable:</strong> ${escapeHtml(track.practicalExerciseSummary)}
              </div>
            </div>
          </td>
          <td width="48%" valign="top" style="padding:14px;">
            <div style="font-size:13px;font-weight:800;color:#292929;margin-bottom:8px;">
              🎯 Key Takeaways &amp; Revision Notes
            </div>
            <ul style="margin:0 0 10px;padding-left:18px;font-size:12px;color:#292929;line-height:1.55;">
              ${revisionNotes.map((note) => `<li style="margin-bottom:4px;">${escapeHtml(note)}</li>`).join('')}
            </ul>
            ${
              commonMistakes.length > 0
                ? `<div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:8px 10px;font-size:11px;color:#78350F;">
                    <strong style="display:block;margin-bottom:3px;">⚠️ Avoid Common Mistakes:</strong>
                    <ul style="margin:0;padding-left:16px;">
                      ${commonMistakes.map((m) => `<li>${escapeHtml(m)}</li>`).join('')}
                    </ul>
                  </div>`
                : ''
            }
          </td>
        </tr>
      </table>
    </div>

    <!-- Row 3: Learning Resources + YouTube Recommendations -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
      <tr>
        <td width="46%" valign="top" style="padding-right:7px;" class="stack-col">
          <div style="background:#FFFFFF;border:1px solid #E0DCD3;border-radius:14px;overflow:hidden;">
            <div style="background:#C26D53;color:#FFFFFF;padding:10px 14px;font-size:13px;font-weight:800;">
              📚 Learning Resources
            </div>
            <div style="padding:12px;">
              ${docsHtml}
            </div>
          </div>
        </td>
        <td width="54%" valign="top" style="padding-left:7px;" class="stack-col">
          <div style="background:#FFFFFF;border:1px solid #E0DCD3;border-radius:14px;overflow:hidden;">
            <div style="background:#C26D53;color:#FFFFFF;padding:10px 14px;font-size:13px;font-weight:800;">
              ▶️ YouTube Recommendations
            </div>
            <div style="padding:12px;">
              ${renderYouTubeHtmlList(track.youtubeTutorials)}
            </div>
          </div>
        </td>
      </tr>
    </table>

    ${
      includeLeetCode
        ? `<!-- DSA Mandatory 3 LeetCode Problems -->
          <div style="background:#FFFFFF;border:1px solid #E0DCD3;border-radius:14px;overflow:hidden;margin-bottom:14px;">
            <div style="background:#8D4F3E;color:#FFFFFF;padding:10px 14px;font-size:13px;font-weight:800;">
              &lt;/&gt; Today's LeetCode Practice (3 Problems: 1 Easy · 1 Medium · 1 Hard)
            </div>
            <div style="padding:10px;">
              ${renderLeetCodeHtmlList(track.leetcodeQuestions)}
            </div>
          </div>`
        : ''
    }

    <!-- Row 4: Today's Checklist + Daily Motivation -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="52%" valign="top" style="padding-right:7px;" class="stack-col">
          <div style="background:#FFFFFF;border:1px solid #E0DCD3;border-radius:14px;overflow:hidden;">
            <div style="background:#C26D53;color:#FFFFFF;padding:10px 14px;font-size:13px;font-weight:800;">
              ☑️ Today's Checklist
            </div>
            <div style="padding:12px 14px;font-size:12px;color:#292929;">
              ${checklistItems
                .map(
                  (item) => `
                <div style="padding:5px 0;border-bottom:1px solid #F3EFE6;">
                  <span style="display:inline-block;width:16px;font-weight:800;color:${
                    item.checked ? '#047857' : '#78716C'
                  };">${item.checked ? '☑' : '☐'}</span>
                  <span style="${item.checked ? 'text-decoration:line-through;color:#78716C;' : ''}">${escapeHtml(
                    item.label
                  )}</span>
                </div>`
                )
                .join('')}
            </div>
          </div>
        </td>
        <td width="48%" valign="top" style="padding-left:7px;" class="stack-col">
          <div style="background:#F7EBE4;border:1px solid #E7826D;border-radius:14px;overflow:hidden;">
            <div style="background:#C26D53;color:#FFFFFF;padding:10px 14px;font-size:13px;font-weight:800;">
              🏔️ Daily Motivation
            </div>
            <div style="padding:16px 14px;font-size:13px;font-style:italic;font-weight:600;color:#292929;line-height:1.55;">
              ${escapeHtml(getTrackMotivationQuote(track))}
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>`;
}

export function buildDailyEmailContent(
  payload: CanonicalDailyDashboardPayload,
  appUrlOverride?: string,
  options?: {
    track?: SharedTrackId;
    completedChecklistMap?: Record<string, boolean>;
  }
) {
  const rawAppUrl = (appUrlOverride || DEFAULT_APP_URL).trim() || DEFAULT_APP_URL;
  const appUrl = isValidHttpsUrl(rawAppUrl) ? rawAppUrl : DEFAULT_APP_URL;
  const singleTrack = options?.track ? payload.tracks[options.track] : null;

  const subject = singleTrack
    ? `🚀 Steeven, Your Day ${singleTrack.planDay} ${getTrackShortBadgeLabel(
        singleTrack.trackId
      )} Preparation Plan Is Ready!`
    : `🚀 Steeven, Your Day ${payload.unlockedDays.main} Preparation Plan Is Ready! (${payload.istDateLabel})`;

  const trackSectionsHtml = options?.track
    ? renderTrackSectionHtml(
        singleTrack?.trackLabel || options.track.toUpperCase(),
        singleTrack,
        options.track === 'dsa',
        options.completedChecklistMap
      )
    : [
        renderTrackSectionHtml(
          'MAIN PLAN — 180 DAYS',
          payload.tracks.main,
          false,
          options?.completedChecklistMap
        ),
        renderTrackSectionHtml(
          'DSA IN C++ — 100 DAYS',
          payload.tracks.dsa,
          true,
          options?.completedChecklistMap
        ),
        renderTrackSectionHtml(
          'AZURE ALTERNATE — 100 DAYS',
          payload.tracks.azure,
          false,
          options?.completedChecklistMap
        )
      ].join('');

  const subtitleDaysSummary = singleTrack
    ? `${singleTrack.trackLabel} · Day ${singleTrack.planDay} · ${singleTrack.dateLabel}`
    : `Main Plan: Day ${payload.unlockedDays.main}/180 · DSA in C++: Day ${payload.unlockedDays.dsa}/100 · Azure: Day ${payload.unlockedDays.azure}/100`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(subject)}</title>
  <style>
    @media only screen and (max-width: 640px) {
      .stack-col {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        padding-bottom: 10px !important;
        border-right: none !important;
      }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#F3EFE6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#292929;">
  <div style="max-width:720px;margin:0 auto;padding:18px 12px;">
    <!-- Branded Dark Electric Black Header -->
    <div style="background:#292929;color:#F3EFE6;border-radius:16px 16px 8px 8px;padding:22px 24px;border-bottom:4px solid #E7826D;">
      <div style="font-size:18px;font-weight:800;letter-spacing:0.4px;color:#F3EFE6;">
        📘 STEEVEN'S 180-DAY PREPARATION TRACKER
      </div>
      <div style="margin-top:4px;font-size:13px;color:#E0DCD3;">
        Your Daily Learning Companion 🚀 &nbsp;&middot;&nbsp; ${escapeHtml(subtitleDaysSummary)}
      </div>
    </div>

    <!-- Exact Required Main Hero Heading -->
    <div style="text-align:center;padding:20px 12px 16px;">
      <h1 style="margin:0 0 6px;font-size:24px;font-weight:800;color:#292929;line-height:1.25;">
        Steeven, Today You Have This Work! 🚀
      </h1>
      <p style="margin:0;font-size:13px;color:#57534E;">
        Here is your personalized study plan for today (${escapeHtml(payload.istDateLabel)} · Asia/Kolkata). Stay consistent and keep going! 💪
      </p>
    </div>

    ${trackSectionsHtml}

    ${
      !options?.track
        ? `<!-- Combined Multi-Track Action Plan -->
          <div style="background:#FFFFFF;border:1px solid #E0DCD3;border-radius:14px;padding:18px;margin-bottom:18px;">
            <h2 style="margin:0 0 10px;font-size:14px;font-weight:800;color:#292929;text-transform:uppercase;letter-spacing:0.5px;">
              🧭 Today's Combined Study Sequence
            </h2>
            <ul style="margin:0 0 10px;padding-left:18px;font-size:12px;line-height:1.6;color:#292929;">
              <li><strong>Study First:</strong> ${escapeHtml(payload.actionPlan.studyFirst)}</li>
              <li><strong>Watch Tutorials:</strong> ${escapeHtml(payload.actionPlan.tutorialsToWatch)}</li>
              <li><strong>Solve LeetCode:</strong> ${escapeHtml(payload.actionPlan.leetcodeFirst)}</li>
              <li><strong>Practical Exercise:</strong> ${escapeHtml(payload.actionPlan.practicalExercise)}</li>
            </ul>
            <ol style="margin:0;padding-left:20px;font-size:12px;color:#57534E;line-height:1.6;">
              ${payload.actionPlan.sequence.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}
            </ol>
          </div>`
        : ''
    }

    <!-- Prominent Dashboard CTA -->
    <div style="text-align:center;padding:8px 0 20px;">
      <a href="${escapeHtml(appUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:14px 30px;border-radius:999px;background:#E7826D;color:#FFFFFF;text-decoration:none;font-size:15px;font-weight:800;letter-spacing:0.2px;box-shadow:0 3px 10px rgba(231,130,109,0.35);">
        🚀 Open My Preparation Dashboard &rarr;
      </a>
    </div>

    <!-- Dark Electric Black Footer -->
    <div style="background:#292929;color:#E0DCD3;border-radius:12px;padding:16px 18px;text-align:center;">
      <div style="font-size:12px;font-weight:800;color:#F3EFE6;letter-spacing:0.4px;">
        STEEVEN'S 180-DAY PREPARATION TRACKER
      </div>
      <div style="font-size:11px;color:#A8A49C;margin-top:4px;">
        Daily Learning Report | Asia/Kolkata (IST) | Keep Learning · Keep Practicing · Keep Growing 🚀
      </div>
    </div>
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
    const checklistText = buildTrackChecklistItems(t, options?.completedChecklistMap)
      .map((c) => `  [${c.checked ? 'x' : ' '}] ${c.label}`)
      .join('\n');
    return `=== ${label} (Day ${t.planDay} — ${t.dateLabel}) ===\nTopic: ${t.topicTitle}\nExplanation: ${t.topicExplanation}\nYouTube Tutorials:\n${ytText}${lcText}\nOfficial Docs:\n${docsText}\nActionable Task: ${t.practicalExerciseSummary}\nChecklist:\n${checklistText}\n`;
  };

  const textSections = options?.track
    ? [formatTrackText(options.track.toUpperCase(), singleTrack, options.track === 'dsa')]
    : [
        formatTrackText('MAIN PLAN — 180 DAYS', payload.tracks.main, false),
        formatTrackText('DSA IN C++ (100 DAYS)', payload.tracks.dsa, true),
        formatTrackText('AZURE — ALTERNATE PLAN (100 DAYS)', payload.tracks.azure, false),
        "=== TODAY'S ACTION PLAN ===",
        `- Study First: ${payload.actionPlan.studyFirst}`,
        `- Watch Tutorials: ${payload.actionPlan.tutorialsToWatch}`,
        `- Solve LeetCode: ${payload.actionPlan.leetcodeFirst}`,
        `- Practical Exercise: ${payload.actionPlan.practicalExercise}`
      ];

  const text = [
    subject,
    "Steeven, Today You Have This Work! 🚀",
    '',
    ...textSections,
    '',
    `Open My Preparation Dashboard: ${appUrl}`,
    'STEEVEN\'S 180-DAY PREPARATION TRACKER | Asia/Kolkata (IST)'
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
  attempts?: number;
  idempotencyKey?: string;
}

function sanitizeEmailError(message: string): string {
  return message
    .replace(/\bre_[A-Za-z0-9_-]{8,}\b/g, 're_***')
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, 'Bearer ***');
}

export async function sendDailyEmailViaResend(
  payload: CanonicalDailyDashboardPayload,
  config: PipelineEnvConfig,
  options?: {
    idempotencySuffix?: string;
    fetchImpl?: typeof fetch;
    maxAttempts?: number;
    retryDelayMs?: number;
  }
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
      attempts: 0,
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
      attempts: 0,
      errorMessage:
        'RESEND_FROM_EMAIL is not configured. Set a Resend-verified sender address.'
    };
  }

  const idempotencyKey = options?.idempotencySuffix
    ? `steeven-daily-${payload.istDate}-${options.idempotencySuffix}`
    : `steeven-daily-${payload.istDate}`;
  const fetchFn = options?.fetchImpl || config.fetchImpl || fetch;
  const maxAttempts = Math.max(1, Math.min(4, options?.maxAttempts ?? 3));
  const baseRetryDelayMs = Math.max(0, options?.retryDelayMs ?? 300);

  let lastErrorMessage = 'Network error sending email via Resend.';
  let lastSenderIssue = false;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const resp = await fetchFn('https://api.resend.com/emails', {
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
        const msg = sanitizeEmailError(respJson.message || `Resend returned HTTP ${resp.status}`);
        const isSenderIssue =
          resp.status === 403 ||
          msg.toLowerCase().includes('verify') ||
          msg.toLowerCase().includes('domain');
        lastErrorMessage = msg;
        lastSenderIssue = isSenderIssue;

        const isTransient = resp.status === 429 || resp.status >= 500;
        if (isTransient && attempt < maxAttempts) {
          if (baseRetryDelayMs > 0) {
            await new Promise((resolve) => setTimeout(resolve, baseRetryDelayMs * attempt));
          }
          continue;
        }

        return {
          sent: false,
          emailStatus: isSenderIssue ? 'awaiting_sender_verification' : 'failed',
          recipientEmail,
          subject,
          providerMessageId: null,
          attempts: attempt,
          idempotencyKey,
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
          attempts: attempt,
          idempotencyKey,
          errorMessage: 'Resend did not return a confirmed message ID.'
        };
      }

      return {
        sent: true,
        emailStatus: 'sent',
        recipientEmail,
        subject,
        providerMessageId: respJson.id,
        attempts: attempt,
        idempotencyKey,
        errorMessage: null
      };
    } catch (err) {
      lastErrorMessage = sanitizeEmailError(
        err instanceof Error ? err.message : 'Network error sending email via Resend.'
      );
      lastSenderIssue = false;
      if (attempt < maxAttempts) {
        if (baseRetryDelayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, baseRetryDelayMs * attempt));
        }
        continue;
      }
    }
  }

  return {
    sent: false,
    emailStatus: lastSenderIssue ? 'awaiting_sender_verification' : 'failed',
    recipientEmail,
    subject,
    providerMessageId: null,
    attempts: maxAttempts,
    idempotencyKey,
    errorMessage: lastErrorMessage
  };
}

// =========================================================================
// SUPABASE REST PERSISTENCE & READS (SHARED BY EDGE, EXPRESS, VERCEL)
// Supports both legacy service_role JWTs and new sb_secret_ keys safely.
// =========================================================================
export function buildSupabaseRestHeadersCanonical(
  serviceKey: string,
  extraHeaders: Record<string, string> = {}
): Record<string, string> {
  const trimmed = serviceKey.trim();
  const isJwt = Boolean(trimmed && trimmed.split('.').length === 3 && trimmed.startsWith('eyJ'));
  if (isJwt) {
    return {
      apikey: trimmed,
      Authorization: `Bearer ${trimmed}`,
      ...extraHeaders
    };
  }
  return {
    apikey: trimmed,
    ...extraHeaders
  };
}

const SUPABASE_UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isSupabaseServerConfigured(config: PipelineEnvConfig): boolean {
  const url = config.supabaseUrl?.trim() || '';
  const key = config.supabaseServiceRoleKey?.trim() || '';
  const ownerId = config.ownerUserId?.trim() || '';
  return Boolean(url && key && ownerId && SUPABASE_UUID_REGEX.test(ownerId));
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

  const headers = buildSupabaseRestHeadersCanonical(serviceKey, {
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates,return=minimal'
  });

  const baseBriefRow = {
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
  };

  const extendedBriefRow = {
    ...baseBriefRow,
    practical_examples: resource.practicalExamples || [],
    revision_notes: resource.revisionNotes || [],
    common_mistakes: resource.commonMistakes || [],
    schedule_meta: {
      dayOfWeek: resource.dayOfWeek,
      scheduleTarget: resource.scheduleTarget,
      studyTimetable: resource.studyTimetable || []
    }
  };

  try {
    let briefResp = await fetchFn(
      `${baseUrl}/rest/v1/daily_learning_briefs?on_conflict=user_id,track_id,plan_day`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify([extendedBriefRow]),
        signal: AbortSignal.timeout(6000)
      }
    );

    // Graceful backward compatibility if additive 20261118 columns are not yet applied in Supabase
    if (!briefResp.ok && (briefResp.status === 400 || briefResp.status === 404)) {
      briefResp = await fetchFn(
        `${baseUrl}/rest/v1/daily_learning_briefs?on_conflict=user_id,track_id,plan_day`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify([baseBriefRow]),
          signal: AbortSignal.timeout(6000)
        }
      );
    }

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
        thumbnail_url: yt.thumbnailUrl || null,
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
        thumbnail_url: null,
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
        thumbnail_url: null,
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
              thumbnail_url: null,
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
      let resResp = await fetchFn(
        `${baseUrl}/rest/v1/daily_learning_resources?on_conflict=user_id,track_id,plan_day,resource_type,url`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(resourceRows),
          signal: AbortSignal.timeout(6000)
        }
      );
      if (!resResp.ok && (resResp.status === 400 || resResp.status === 404)) {
        const legacyRows = resourceRows.map((row) => {
          const { thumbnail_url: _t, ...rest } = row as typeof row & { thumbnail_url?: string | null };
          return rest;
        });
        resResp = await fetchFn(
          `${baseUrl}/rest/v1/daily_learning_resources?on_conflict=user_id,track_id,plan_day,resource_type,url`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify(legacyRows),
            signal: AbortSignal.timeout(6000)
          }
        );
      }
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
      headers: buildSupabaseRestHeadersCanonical(serviceKey, {
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal'
      }),
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
  practical_examples?: string[];
  revision_notes?: string[];
  common_mistakes?: string[];
  schedule_meta?: {
    dayOfWeek?: string;
    scheduleTarget?: string;
    studyTimetable?: CanonicalTimetableSlot[];
  };
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
  channel_id?: string | null;
  topic_covered: string;
  description: string;
  why_useful: string;
  duration?: string | null;
  language?: string;
  is_verified: boolean;
  thumbnail_url?: string | null;
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
  config: PipelineEnvConfig,
  role: 'owner' | 'guest' = 'owner'
): Promise<CanonicalTrackDailyResources | null> {
  if (!isSupabaseServerConfigured(config)) return null;

  const ctx = getSharedCurriculumDayContext(trackId, dayNumber);
  if (!ctx) return null;

  const baseUrl = config.supabaseUrl!.trim().replace(/\/$/, '');
  const serviceKey = config.supabaseServiceRoleKey!.trim();
  const ownerUserId = config.ownerUserId!.trim();
  const fetchFn = config.fetchImpl || fetch;
  const headers = buildSupabaseRestHeadersCanonical(serviceKey);

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
    const youtubeRows = await revalidateCachedYouTubeRows(
      resources,
      ctx,
      config.youtubeApiKey,
      fetchFn,
      role
    );
    const docRows = resources.filter((r) => r.resource_type === 'official_documentation');
    const exerciseRows = resources.filter((r) => r.resource_type === 'practical_exercise');

    const youtubeTutorials: CanonicalYouTubeResource[] =
      youtubeRows.length > 0
        ? youtubeRows.map((yt, idx) => {
            const videoIdMatch = /[?&]v=([a-zA-Z0-9_-]{11})/.exec(yt.url || '');
            const vid = videoIdMatch?.[1];
            return {
              id: `yt_${trackId}_d${dayNumber}_sb_${idx + 1}`,
              title: yt.title,
              channelName: yt.channel_or_source,
              channelId: yt.channel_id || undefined,
              url: yt.url,
              videoId: vid,
              thumbnailUrl:
                yt.thumbnail_url ||
                (yt.is_verified && vid ? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg` : undefined),
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

    const actualSchedule = buildActualScheduleMeta(ctx);

    return {
      trackId,
      trackLabel: ctx.trackLabel,
      planDay: dayNumber,
      planDate: ctx.isoDate,
      dateLabel: ctx.dateLabel,
      dayOfWeek: brief.schedule_meta?.dayOfWeek || ctx.dayOfWeek,
      topicTitle: ctx.topic,
      phaseOrModule: brief.phase_or_module || ctx.phaseOrModule,
      scheduleTarget: brief.schedule_meta?.scheduleTarget || actualSchedule.scheduleTarget,
      studyTimetable:
        brief.schedule_meta?.studyTimetable && brief.schedule_meta.studyTimetable.length > 0
          ? brief.schedule_meta.studyTimetable
          : actualSchedule.studyTimetable,
      learningObjectives:
        Array.isArray(brief.learning_objectives) && brief.learning_objectives.length > 0
          ? brief.learning_objectives
          : ctx.objectives,
      topicExplanation: brief.topic_explanation,
      practicalExamples: Array.isArray(brief.practical_examples) ? brief.practical_examples : [],
      revisionNotes: Array.isArray(brief.revision_notes) ? brief.revision_notes : [],
      commonMistakes: Array.isArray(brief.common_mistakes) ? brief.common_mistakes : [],
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
      headers: buildSupabaseRestHeadersCanonical(serviceKey),
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
  if (!config.geminiApiKey?.trim()) missing.push('PREPARATION_GEMINI_KEY');
  if (!config.youtubeApiKey?.trim()) missing.push('YOUTUBE_API_KEY');
  if (!config.resendApiKey?.trim()) missing.push('RESEND_API_KEY');
  if (!config.resendFromEmail?.trim()) missing.push('RESEND_FROM_EMAIL');
  return missing;
}

export function buildDeterministicReadOnlyTrack(
  trackId: SharedTrackId,
  dayNumber: number,
  config: PipelineEnvConfig,
  existingCached?: CanonicalTrackDailyResources,
  scheduleStartIsoIst: string = START_DATE_IST
): CanonicalTrackDailyResources | null {
  const ctx = getCycleCurriculumContext(trackId, dayNumber, scheduleStartIsoIst);
  if (!ctx) return null;

  const actualSchedule = buildActualScheduleMeta(ctx);
  const isGuestSchedule = scheduleStartIsoIst === LEGACY_GUEST_START_DATE_IST;
  const tutorials = isGuestSchedule ? buildLegacyGuestSearchFallbackTutorials(ctx) : buildSearchFallbackTutorials(ctx);
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
      : 'Curriculum, official docs, and LeetCode loaded; PREPARATION_GEMINI_KEY needed for AI enrichment.',
    isGuestSchedule ? 'Displaying Guest YouTube topic search links.' : 'No suitable video found without a verified YouTube recommendation.'
  ];
  if (leetcodeWarning) statusNotes.push(leetcodeWarning);

  return {
    trackId,
    trackLabel: ctx.trackLabel,
    planDay: dayNumber,
    planDate: ctx.isoDate,
    dateLabel: ctx.dateLabel,
    dayOfWeek: ctx.dayOfWeek,
    topicTitle: ctx.topic,
    phaseOrModule: ctx.phaseOrModule,
    scheduleTarget: actualSchedule.scheduleTarget,
    studyTimetable: actualSchedule.studyTimetable,
    learningObjectives: fallback.learningObjectives,
    topicExplanation: fallback.topicExplanation,
    practicalExamples: fallback.practicalExamples,
    revisionNotes: fallback.revisionNotes,
    commonMistakes: fallback.commonMistakes,
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
    youtubeProviderStatus: isGuestSchedule
      ? config.youtubeApiKey?.trim() ? 'search_fallback_quota' : 'search_fallback_no_key'
      : 'unavailable',
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
    scheduleStartIsoIst?: string;
    role?: 'owner' | 'guest';
  }
): Promise<CanonicalTrackDailyResources> {
  const scheduleStartIsoIst = options?.scheduleStartIsoIst || START_DATE_IST;
  const ctx = getCycleCurriculumContext(trackId, dayNumber, scheduleStartIsoIst);
  if (!ctx) {
    throw new Error(`Invalid dayNumber ${dayNumber} for track "${trackId}".`);
  }

  if (!isTrackDayCurrentlyUnlockedCanonical(trackId, dayNumber, Date.now(), scheduleStartIsoIst)) {
    throw new Error(
      `LOCKED_FUTURE_DAY: ${ctx.trackLabel} Day ${dayNumber} unlocks on ${ctx.dateLabel} at 00:00 IST.`
    );
  }

  const rawExistingCached = options?.existingCached || undefined;
  const role = options?.role || 'owner';
  const hasYoutubeKey = Boolean(config.youtubeApiKey?.trim());
  const cachedSource = (rawExistingCached?.youtubeTutorials || []).filter((tutorial) => tutorial.linkKind === 'verified_video');
  const cachedRows: SupabaseResourceRow[] = cachedSource.map((tutorial) => ({
    track_id: trackId,
    plan_day: dayNumber,
    resource_type: 'youtube',
    title: tutorial.title,
    url: tutorial.url,
    channel_or_source: tutorial.channelName,
    channel_id: tutorial.channelId,
    topic_covered: tutorial.topicCovered,
    description: tutorial.explanation,
    why_useful: tutorial.whyUseful,
    duration: tutorial.duration || null,
    language: tutorial.language,
    is_verified: tutorial.isVerifiedVideo,
    thumbnail_url: tutorial.thumbnailUrl || null
  }));
  const validatedCacheRows = await revalidateCachedYouTubeRows(
    cachedRows,
    ctx,
    config.youtubeApiKey,
    config.fetchImpl || fetch,
    role
  );
  const cachedSourceById = new Map(cachedSource.map((tutorial) => [cachedVideoId(tutorial.url), tutorial]));
  const validatedCachedTutorials = validatedCacheRows.flatMap((row) => {
    const videoId = cachedVideoId(row.url);
    const source = videoId ? cachedSourceById.get(videoId) : undefined;
    if (!source || !videoId) return [];
    return [{
      ...source,
      title: row.title,
      url: row.url,
      videoId,
      channelName: row.channel_or_source,
      channelId: row.channel_id || undefined,
      topicCovered: ctx.topic,
      explanation: row.description,
      whyUseful: row.why_useful,
      duration: row.duration || undefined,
      language: row.language || 'en',
      isVerifiedVideo: true,
      linkKind: 'verified_video' as const
    }];
  });
  const cachedDirectTutorials = reusableTutorials(ctx, validatedCachedTutorials);
  const cachedTutorials = cachedDirectTutorials.length > 0
    ? cachedDirectTutorials
    : buildSearchFallbackTutorials(ctx);
  const existingCached = rawExistingCached
    ? {
        ...rawExistingCached,
        youtubeTutorials: cachedTutorials,
        youtubeProviderStatus: cachedDirectTutorials.length > 0
          ? 'youtube_api_verified' as const
          : hasYoutubeKey ? 'unavailable' as const : 'search_fallback_no_key' as const
      }
    : undefined;
  const hasGeminiKey = Boolean(config.geminiApiKey?.trim());

  // Avoid unnecessary regeneration & quota burn when valid AI/YouTube resources already exist
  if (!options?.forceRefresh && existingCached) {
    const aiComplete = !hasGeminiKey || existingCached.aiProviderStatus === 'gemini_generated';
    const ytComplete =
      !hasYoutubeKey ||
      (existingCached.youtubeProviderStatus === 'youtube_api_verified' && existingCached.youtubeTutorials.length > 0);
    const ageMs = Date.now() - new Date(existingCached.updatedAt).getTime();
    const recentTransientCooldown =
      Number.isFinite(ageMs) &&
      ageMs < 3 * 60 * 1000 &&
      (existingCached.aiProviderStatus === 'quota_exhausted_cached' ||
        existingCached.aiProviderStatus === 'unavailable');

    if (
      (aiComplete && ytComplete) ||
      (Number.isFinite(ageMs) &&
        ageMs < 12 * 60 * 60 * 1000 &&
        existingCached.aiProviderStatus === 'gemini_generated') ||
      (recentTransientCooldown && ytComplete)
    ) {
      return {
        ...existingCached,
        status: existingCached.aiProviderStatus === 'gemini_generated' ? 'cached' : existingCached.status
      };
    }
  }

  const actualSchedule = buildActualScheduleMeta(ctx);

  // Reuse cached verified YouTube videos if YouTube already succeeded or if quota is hit on refresh
  let ytResult: YouTubeDiscoveryResult;
  if (
    !options?.forceRefresh &&
    existingCached?.youtubeProviderStatus === 'youtube_api_verified' &&
    existingCached.youtubeTutorials.some((t) => t.isVerifiedVideo)
  ) {
    ytResult = {
      tutorials: existingCached.youtubeTutorials,
      providerStatus: 'youtube_api_verified',
      statusNote: 'Using cached verified YouTube tutorials to preserve API quota.'
    };
  } else {
    ytResult = await discoverYouTubeTutorials(ctx, config.youtubeApiKey, config.fetchImpl || fetch, role);
    if (
      ytResult.providerStatus !== 'youtube_api_verified' &&
      existingCached?.youtubeProviderStatus === 'youtube_api_verified' &&
      existingCached.youtubeTutorials.some((t) => t.isVerifiedVideo)
    ) {
      ytResult = {
        tutorials: existingCached.youtubeTutorials,
        providerStatus: 'youtube_api_verified',
        statusNote: 'Preserved cached verified YouTube tutorials after quota/lookup fallback.'
      };
    }
  }

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

  const geminiCaller = config.geminiCaller || generateGroundedDailyBrief;
  const geminiResult = await geminiCaller(
    ctx,
    ytResult.tutorials,
    docs,
    leetcodeQuestions,
    config.geminiApiKey
  );

  let finalExplanation: string;
  let finalObjectives: string[];
  let finalExamples: string[];
  let finalRevisionNotes: string[];
  let finalCommonMistakes: string[];
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
    finalExamples = Array.isArray(g.practicalExamples) ? g.practicalExamples : [];
    finalRevisionNotes = Array.isArray(g.revisionNotes) ? g.revisionNotes : [];
    finalCommonMistakes = Array.isArray(g.commonMistakes) ? g.commonMistakes : [];
    finalOrder = g.suggestedLearningOrder.length > 0 ? g.suggestedLearningOrder : [];
    finalGuidance = g.dailyGuidance;
    finalExerciseSummary = g.practicalExerciseSummary;
  } else {
    // The result below is fallback/cached content for this run; keep the failed
    // provider status so clients never label it as newly generated AI output.
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
    finalExamples = fallback.practicalExamples;
    finalRevisionNotes = fallback.revisionNotes;
    finalCommonMistakes = fallback.commonMistakes;
    finalOrder = fallback.suggestedLearningOrder;
    finalGuidance = fallback.dailyGuidance;
    finalExerciseSummary = fallback.practicalExerciseSummary;
    finalTutorials = fallback.tutorials;
  }

  const statusNotes: string[] = [];
  const requiredResourcesComplete = hasCompleteRequiredTrackResources({
    trackId,
    topicExplanation: finalExplanation,
    learningObjectives: finalObjectives,
    officialDocs: docs,
    practicalExercises,
    youtubeTutorials: finalTutorials,
    youtubeProviderStatus: ytResult.providerStatus,
    leetcodeQuestions
  });
  const guestLegacyComplete =
    aiStatus === 'gemini_generated' && ytResult.providerStatus === 'youtube_api_verified';
  const status: CanonicalResourceStatus = role === 'guest'
    ? guestLegacyComplete ? 'updated' : 'partially_updated'
    : requiredResourcesComplete ? 'updated' : 'partially_updated';

  if (role === 'guest') {
    if (guestLegacyComplete) {
      statusNotes.push('Updated successfully with verified YouTube tutorials and Gemini AI insights.');
    } else {
      if (aiStatus === 'missing_api_key') {
        statusNotes.push(
          'Curriculum, official docs, and LeetCode loaded; PREPARATION_GEMINI_KEY needed for AI enrichment.'
        );
      } else if (aiStatus === 'invalid_api_key') {
        statusNotes.push(geminiResult.errorMessage || 'PREPARATION_GEMINI_KEY is invalid or disabled. Update PREPARATION_GEMINI_KEY in Secrets.');
      } else if (aiStatus === 'quota_exhausted_cached' || aiStatus === 'unavailable') {
        statusNotes.push(
          `Gemini fallback: ${geminiResult.errorMessage || (aiStatus === 'unavailable' ? 'provider temporarily unavailable' : 'quota or rate limit reached')}; displaying grounded curriculum${existingCached?.aiProviderStatus === 'gemini_generated' ? ' and previously cached Gemini notes' : ''}. No new Gemini content was generated for this track.`
        );
      }
      if (ytResult.providerStatus !== 'youtube_api_verified') statusNotes.push(ytResult.statusNote);
    }
  } else {
    statusNotes.push(
      requiredResourcesComplete
        ? 'Required daily learning resources were refreshed and verified.'
        : 'Some required daily resources are missing or could not be verified; see the provider and resource details below.'
    );
  }

  if (role !== 'guest' && aiStatus === 'missing_api_key') {
    statusNotes.push(
      'Grounded curriculum fallback is displayed; PREPARATION_GEMINI_KEY is needed for optional AI enrichment.'
    );
  } else if (role !== 'guest' && aiStatus === 'invalid_api_key') {
    statusNotes.push(
      geminiResult.errorMessage ||
        'PREPARATION_GEMINI_KEY is invalid or disabled. Update PREPARATION_GEMINI_KEY in Secrets.'
    );
  } else if (role !== 'guest' && aiStatus === 'quota_exhausted_cached') {
    statusNotes.push(
      `Gemini fallback: ${geminiResult.errorMessage || 'quota or rate limit reached'}; displaying grounded curriculum${existingCached?.aiProviderStatus === 'gemini_generated' ? ' and previously cached Gemini notes' : ''}. No new Gemini content was generated for this track.`
    );
  } else if (role !== 'guest' && aiStatus === 'unavailable') {
    statusNotes.push(
      `Gemini fallback: ${geminiResult.errorMessage || 'provider temporarily unavailable'}; displaying grounded curriculum${existingCached?.aiProviderStatus === 'gemini_generated' ? ' and previously cached Gemini notes' : ''}. No new Gemini content was generated for this track.`
    );
  }
  if (role !== 'guest' && ytResult.providerStatus !== 'youtube_api_verified') {
    statusNotes.push(ytResult.statusNote);
  }
  if (leetcodeWarning) statusNotes.push(leetcodeWarning);

  const nowIso = new Date().toISOString();
  const payload: CanonicalTrackDailyResources = {
    trackId,
    trackLabel: ctx.trackLabel,
    planDay: dayNumber,
    planDate: ctx.isoDate,
    dateLabel: ctx.dateLabel,
    dayOfWeek: ctx.dayOfWeek,
    topicTitle: ctx.topic,
    phaseOrModule: ctx.phaseOrModule,
    scheduleTarget: actualSchedule.scheduleTarget,
    studyTimetable: actualSchedule.studyTimetable,
    learningObjectives: finalObjectives,
    topicExplanation: finalExplanation,
    practicalExamples: finalExamples,
    revisionNotes: finalRevisionNotes,
    commonMistakes: finalCommonMistakes,
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
