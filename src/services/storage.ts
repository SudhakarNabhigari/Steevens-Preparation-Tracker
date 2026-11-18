import {
  UserState,
  RoadmapPdfRecord,
  TrackProgressState,
  SharedAppSettings,
  SharedOwnerContent,
  AssessmentSubmission,
  LeetCodeProgressEntry,
  ActiveAssessmentAttempt
} from '../types';
import { isAssessmentUnlockedByIstClock } from '../utils/assessmentLock';

export const OWNER_STORAGE_KEY = 'steeven_180day_prep_owner_permanent_v3';
export const GUEST_STORAGE_KEY = 'steeven_180day_prep_guest_sandbox_v3';
export const SHARED_CONTENT_STORAGE_KEY = 'steeven_180day_shared_owner_content_v1';
export const SHARED_SYNC_CHANNEL = 'steeven_prep_shared_sync_v1';

export const DEFAULT_TRACK_PROGRESS = (): TrackProgressState => ({
  completedTasks: {},
  completedDays: {},
  dayNotes: {},
  studyTimeSeconds: {},
  revisionRecords: {},
  lastActiveDayNumber: 1
});

export const DEFAULT_AUTHORITATIVE_PDF: RoadmapPdfRecord = {
  id: 'authoritative_roadmap_rag_180',
  filename: 'FINAL_RAG_180_DAY_COMPLETE_LEARNING_SYLLABUS.pdf',
  fileSize: 468492,
  fileSizeBytesFormatted: '457.5 KB',
  uploadTimestamp: '2026-11-12T00:00:00.000Z',
  ownerId: 'steeven_owner',
  storagePath: '/assets/aistudio/FINAL_RAG_180_DAY_COMPLETE_LEARNING_SYLLABUS__1__3a24eef8.pdf',
  fileUrl: '/assets/aistudio/FINAL_RAG_180_DAY_COMPLETE_LEARNING_SYLLABUS__1__3a24eef8.pdf',
  version: 1,
  isActiveRoadmap: true,
  isDefaultSourcePdf: true,
  extractedSummary: {
    pages: 20,
    topicsCount: 180,
    coveragePct: 100.0
  }
};

export const DEFAULT_DSA_PDF: RoadmapPdfRecord = {
  id: 'authoritative_roadmap_dsa_100',
  filename: 'DSA_CPP_100_Day_180_Style_Daily_Curriculum.pdf',
  fileSize: 224500,
  fileSizeBytesFormatted: '219.2 KB',
  uploadTimestamp: '2026-11-12T00:00:00.000Z',
  ownerId: 'steeven_owner',
  storagePath: '/assets/aistudio/DSA_CPP_100_Day_180_Style_Daily_Curriculum_7bad3ece.pdf',
  fileUrl: '/assets/aistudio/DSA_CPP_100_Day_180_Style_Daily_Curriculum_7bad3ece.pdf',
  version: 1,
  isActiveRoadmap: false,
  isDefaultSourcePdf: true,
  extractedSummary: {
    pages: 22,
    topicsCount: 100,
    coveragePct: 100.0
  }
};

export const DEFAULT_AZURE_PDF: RoadmapPdfRecord = {
  id: 'authoritative_roadmap_azure_100',
  filename: 'Azure_100_Day_180_Style_Daily_Curriculum.pdf',
  fileSize: 228100,
  fileSizeBytesFormatted: '222.8 KB',
  uploadTimestamp: '2026-11-12T00:00:00.000Z',
  ownerId: 'steeven_owner',
  storagePath: '/assets/aistudio/Azure_100_Day_180_Style_Daily_Curriculum_a614b703.pdf',
  fileUrl: '/assets/aistudio/Azure_100_Day_180_Style_Daily_Curriculum_a614b703.pdf',
  version: 1,
  isActiveRoadmap: false,
  isDefaultSourcePdf: true,
  extractedSummary: {
    pages: 22,
    topicsCount: 100,
    coveragePct: 100.0
  }
};

export const DEFAULT_SHARED_SETTINGS: SharedAppSettings = {
  preparationTitle: "STEEVEN'S 180-DAY PREPARATION TRACKER",
  timezoneLabel: 'Asia/Kolkata (IST, UTC+05:30)',
  studyScheduleBannerNote: 'Main (180d) · DSA in C++ (100d) · Azure (100d) · Asia/Kolkata',
  preferredTrackOrder: ['main', 'dsa', 'azure'],
  showWeekendRevisionGuidance: true,
  defaultDailyGoalHours: 4,
  resourceLibraryNotice: 'Organize official docs, research papers, tutorials, technical blogs, and personal notes mapped across 180 days.',
  updatedAt: '2026-11-12T00:00:00.000Z'
};

export const DEFAULT_SHARED_CONTENT: SharedOwnerContent = {
  uploadedPdfs: [DEFAULT_AUTHORITATIVE_PDF, DEFAULT_DSA_PDF, DEFAULT_AZURE_PDF],
  activePdfId: 'authoritative_roadmap_rag_180',
  resources: [],
  sharedSettings: { ...DEFAULT_SHARED_SETTINGS },
  updatedAt: '2026-11-12T00:00:00.000Z'
};

function mergeDefaultTrackPdfs(
  existing: RoadmapPdfRecord[] | undefined,
  isLegacyPreMultiTrack = false
): RoadmapPdfRecord[] {
  if (!existing || existing.length === 0) {
    return [DEFAULT_AUTHORITATIVE_PDF, DEFAULT_DSA_PDF, DEFAULT_AZURE_PDF];
  }
  const base = [...existing];
  if (isLegacyPreMultiTrack) {
    const ids = new Set(base.map(p => p.id));
    if (!ids.has(DEFAULT_DSA_PDF.id)) base.push(DEFAULT_DSA_PDF);
    if (!ids.has(DEFAULT_AZURE_PDF.id)) base.push(DEFAULT_AZURE_PDF);
  }
  return base;
}

// Initial state for Steeven (Owner) — STRICTLY ZERO FAKE PROGRESS & ZERO HARDCODED PASSWORDS
export const DEFAULT_OWNER_STATE: UserState = {
  username: 'Steeven',
  passwordHash: '',
  role: 'owner',
  isAuthenticated: false,
  completedTasks: {},
  completedDays: {},
  dayNotes: {},
  studyTimeSeconds: {},
  assessmentSubmissions: {},
  leetcodeProgress: {},
  activeAssessmentAttempt: null,
  studyLogs: [],
  lastActiveDayNumber: 1,
  lastSavedTimestamp: new Date().toISOString(),
  timerState: {
    isActive: false,
    isPaused: false,
    trackId: 'main',
    dayNumber: 1,
    targetSeconds: 4 * 3600,
    elapsedSeconds: 0,
    remainingSeconds: 4 * 3600,
    type: 'daily'
  },
  trackTimerSnapshots: {},
  dsaProgress: DEFAULT_TRACK_PROGRESS(),
  azureProgress: DEFAULT_TRACK_PROGRESS(),
  simulationDate: null,
  simulationEnabled: false,
  uploadedPdfs: [DEFAULT_AUTHORITATIVE_PDF, DEFAULT_DSA_PDF, DEFAULT_AZURE_PDF],
  activePdfId: 'authoritative_roadmap_rag_180',
  resources: [],
  doubtEntries: [],
  sharedSettings: { ...DEFAULT_SHARED_SETTINGS }
};

// Initial state for Guest Sandbox — isolated local temporary study sandbox
export const DEFAULT_GUEST_STATE: UserState = {
  username: 'Guest',
  passwordHash: '',
  role: 'guest',
  isAuthenticated: false,
  completedTasks: {},
  completedDays: {},
  dayNotes: {},
  studyTimeSeconds: {},
  assessmentSubmissions: {},
  leetcodeProgress: {},
  activeAssessmentAttempt: null,
  studyLogs: [],
  lastActiveDayNumber: 1,
  lastSavedTimestamp: new Date().toISOString(),
  timerState: {
    isActive: false,
    isPaused: false,
    trackId: 'main',
    dayNumber: 1,
    targetSeconds: 4 * 3600,
    elapsedSeconds: 0,
    remainingSeconds: 4 * 3600,
    type: 'daily'
  },
  trackTimerSnapshots: {},
  dsaProgress: DEFAULT_TRACK_PROGRESS(),
  azureProgress: DEFAULT_TRACK_PROGRESS(),
  simulationDate: null,
  simulationEnabled: false,
  uploadedPdfs: [DEFAULT_AUTHORITATIVE_PDF, DEFAULT_DSA_PDF, DEFAULT_AZURE_PDF],
  activePdfId: 'authoritative_roadmap_rag_180',
  resources: [],
  doubtEntries: [],
  sharedSettings: { ...DEFAULT_SHARED_SETTINGS }
};

// ==========================================
// INDEXEDDB PERMANENT STORAGE ENGINE
// ==========================================
const DB_NAME = 'SteevenPrepPermanentDB';
const DB_VERSION = 1;
const STORE_NAME = 'user_prep_records';

function openDatabase(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('IndexedDB open error, falling back to LocalStorage');
        resolve(null);
      };
    } catch (e) {
      console.warn('IndexedDB not supported or accessible:', e);
      resolve(null);
    }
  });
}

export async function saveToIndexedDB(key: string, data: unknown): Promise<boolean> {
  const db = await openDatabase();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ key, data, updatedAt: Date.now() });

      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

export async function loadFromIndexedDB<T = UserState>(key: string): Promise<T | null> {
  const db = await openDatabase();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => {
        if (req.result && req.result.data) {
          resolve(req.result.data as T);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

// ==========================================
// SHARED OWNER CONTENT SYNC HELPERS
// ==========================================
export function sanitizeSharedContent(
  raw: Partial<SharedOwnerContent> | null | undefined,
  isLegacyPreMultiTrack = false
): SharedOwnerContent {
  const uploadedPdfs = mergeDefaultTrackPdfs(raw?.uploadedPdfs, isLegacyPreMultiTrack);
  const hasActive = uploadedPdfs.some(p => p.id === raw?.activePdfId);
  const resolvedActiveId = hasActive
    ? (raw!.activePdfId as string)
    : uploadedPdfs[0]?.id || DEFAULT_AUTHORITATIVE_PDF.id;

  const normalizedPdfs = uploadedPdfs.map(pdf => ({
    ...pdf,
    isActiveRoadmap: pdf.id === resolvedActiveId
  }));

  const normalizedResources = Array.isArray(raw?.resources)
    ? raw!.resources.map(r => ({ ...r, tags: Array.isArray(r.tags) ? [...r.tags] : [] }))
    : [];

  const mergedSettings: SharedAppSettings = {
    ...DEFAULT_SHARED_SETTINGS,
    ...(raw?.sharedSettings || {}),
    preferredTrackOrder:
      Array.isArray(raw?.sharedSettings?.preferredTrackOrder) &&
      raw!.sharedSettings!.preferredTrackOrder.length === 3
        ? raw!.sharedSettings!.preferredTrackOrder
        : DEFAULT_SHARED_SETTINGS.preferredTrackOrder
  };

  return {
    uploadedPdfs: normalizedPdfs,
    activePdfId: resolvedActiveId,
    resources: normalizedResources,
    sharedSettings: mergedSettings,
    updatedAt: raw?.updatedAt || mergedSettings.updatedAt || DEFAULT_SHARED_CONTENT.updatedAt
  };
}

export function extractSharedContentFromOwner(ownerState: Partial<UserState>): SharedOwnerContent {
  const isLegacy = !ownerState.dsaProgress && !ownerState.azureProgress;
  return sanitizeSharedContent(
    {
      uploadedPdfs: ownerState.uploadedPdfs,
      activePdfId: ownerState.activePdfId,
      resources: ownerState.resources,
      sharedSettings: ownerState.sharedSettings,
      updatedAt: ownerState.sharedSettings?.updatedAt || ownerState.lastSavedTimestamp || new Date().toISOString()
    },
    isLegacy
  );
}

function getSharedContentFingerprint(content: SharedOwnerContent): string {
  return JSON.stringify({
    uploadedPdfs: content.uploadedPdfs.map(p => ({
      id: p.id,
      filename: p.filename,
      fileSize: p.fileSize,
      uploadTimestamp: p.uploadTimestamp,
      version: p.version,
      isActiveRoadmap: p.isActiveRoadmap,
      fileUrlLength: p.fileUrl?.length || 0,
      fileUrlHead: p.fileUrl?.slice(0, 64) || ''
    })),
    activePdfId: content.activePdfId,
    resources: content.resources,
    sharedSettings: content.sharedSettings
  });
}

function broadcastSharedContentUpdate(updatedAt: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(SHARED_SYNC_CHANNEL);
      channel.postMessage({ type: 'SHARED_CONTENT_UPDATED', updatedAt });
      channel.close();
    }
  } catch {
    // Ignore BroadcastChannel errors in restricted contexts
  }
}

export function loadSharedContentSync(): SharedOwnerContent {
  if (typeof localStorage === 'undefined') {
    return sanitizeSharedContent(DEFAULT_SHARED_CONTENT);
  }

  try {
    const rawShared = localStorage.getItem(SHARED_CONTENT_STORAGE_KEY);
    if (rawShared) {
      const parsed = JSON.parse(rawShared) as Partial<SharedOwnerContent>;
      return sanitizeSharedContent(parsed);
    }

    // Bootstrap shared content once from existing Owner record if present
    const rawOwner = localStorage.getItem(OWNER_STORAGE_KEY);
    if (rawOwner) {
      const ownerParsed = JSON.parse(rawOwner) as Partial<UserState>;
      const extracted = extractSharedContentFromOwner(ownerParsed);
      try {
        localStorage.setItem(SHARED_CONTENT_STORAGE_KEY, JSON.stringify(extracted));
      } catch {
        // Ignore quota error during bootstrap
      }
      return extracted;
    }
  } catch (err) {
    console.error('Failed to load shared owner content:', err);
  }

  return sanitizeSharedContent(DEFAULT_SHARED_CONTENT);
}

export async function loadSharedContentAsync(): Promise<SharedOwnerContent> {
  const syncShared = loadSharedContentSync();

  try {
    const idbShared = await loadFromIndexedDB<SharedOwnerContent>(SHARED_CONTENT_STORAGE_KEY);
    if (idbShared && idbShared.updatedAt && idbShared.updatedAt >= syncShared.updatedAt) {
      return sanitizeSharedContent(idbShared);
    }

    // Fallback: if SHARED_CONTENT_STORAGE_KEY wasn't in IDB yet, check Owner record in IDB
    if (!idbShared) {
      const idbOwner = await loadFromIndexedDB<UserState>(OWNER_STORAGE_KEY);
      if (idbOwner) {
        const extracted = extractSharedContentFromOwner(idbOwner);
        if (extracted.updatedAt >= syncShared.updatedAt) {
          return extracted;
        }
      }
    }
  } catch (err) {
    console.warn('Async shared content load fallback to sync:', err);
  }

  return syncShared;
}

export async function saveSharedContent(
  shared: SharedOwnerContent,
  forceBroadcast = false
): Promise<boolean> {
  const normalized = sanitizeSharedContent(shared);
  let hasChanged = forceBroadcast;

  try {
    const existingRaw = typeof localStorage !== 'undefined'
      ? localStorage.getItem(SHARED_CONTENT_STORAGE_KEY)
      : null;

    if (!existingRaw) {
      hasChanged = true;
    } else {
      const existingParsed = sanitizeSharedContent(JSON.parse(existingRaw) as Partial<SharedOwnerContent>);
      if (getSharedContentFingerprint(existingParsed) !== getSharedContentFingerprint(normalized)) {
        hasChanged = true;
      }
    }
  } catch {
    hasChanged = true;
  }

  if (!hasChanged) {
    return true;
  }

  normalized.updatedAt = new Date().toISOString();

  let lsOk = false;
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(SHARED_CONTENT_STORAGE_KEY, JSON.stringify(normalized));
      lsOk = true;
    } catch (err) {
      console.warn('LocalStorage quota exceeded for shared content, relying on IndexedDB:', err);
    }
  }

  const idbOk = await saveToIndexedDB(SHARED_CONTENT_STORAGE_KEY, normalized);
  broadcastSharedContentUpdate(normalized.updatedAt);

  return lsOk || idbOk;
}

export function applySharedContentToGuestState(
  guestState: UserState,
  shared: SharedOwnerContent
): UserState {
  const sanitized = sanitizeSharedContent(shared);
  return {
    ...guestState,
    role: 'guest',
    username: 'Guest',
    passwordHash: '',
    uploadedPdfs: sanitized.uploadedPdfs,
    activePdfId: sanitized.activePdfId,
    resources: sanitized.resources,
    sharedSettings: sanitized.sharedSettings
  };
}

export function subscribeToSharedContentUpdates(onUpdate: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleStorage = (e: StorageEvent) => {
    if (e.key === SHARED_CONTENT_STORAGE_KEY || e.key === OWNER_STORAGE_KEY) {
      onUpdate();
    }
  };

  window.addEventListener('storage', handleStorage);

  let channel: BroadcastChannel | null = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(SHARED_SYNC_CHANNEL);
      channel.onmessage = (event) => {
        if (event?.data?.type === 'SHARED_CONTENT_UPDATED') {
          onUpdate();
        }
      };
    }
  } catch {
    channel = null;
  }

  return () => {
    window.removeEventListener('storage', handleStorage);
    if (channel) {
      try {
        channel.close();
      } catch {
        // Ignore close errors
      }
    }
  };
}

function sanitizeLockedAssessmentState(
  submissions: Record<number, AssessmentSubmission> | undefined,
  leetcodeProgress: Record<string, LeetCodeProgressEntry> | undefined,
  activeAttempt: ActiveAssessmentAttempt | null | undefined,
  nowMs: number
): {
  assessmentSubmissions: Record<number, AssessmentSubmission>;
  leetcodeProgress: Record<string, LeetCodeProgressEntry>;
  activeAssessmentAttempt: ActiveAssessmentAttempt | null;
} {
  const cleanSubmissions: Record<number, AssessmentSubmission> = {};
  if (submissions && typeof submissions === 'object') {
    for (const [k, v] of Object.entries(submissions)) {
      const wk = Number(k);
      if (isAssessmentUnlockedByIstClock(wk, nowMs) && v) {
        cleanSubmissions[wk] = v;
      }
    }
  }

  const cleanLeetcode: Record<string, LeetCodeProgressEntry> = {};
  if (leetcodeProgress && typeof leetcodeProgress === 'object') {
    for (const [probId, entry] of Object.entries(leetcodeProgress)) {
      const match = /^w(\d+)_/.exec(probId);
      const wk = match ? Number(match[1]) : 0;
      if (wk > 0 && isAssessmentUnlockedByIstClock(wk, nowMs) && entry) {
        cleanLeetcode[probId] = entry;
      }
    }
  }

  const cleanAttempt =
    activeAttempt && isAssessmentUnlockedByIstClock(activeAttempt.weekNumber, nowMs)
      ? activeAttempt
      : null;

  return {
    assessmentSubmissions: cleanSubmissions,
    leetcodeProgress: cleanLeetcode,
    activeAssessmentAttempt: cleanAttempt
  };
}

export function hydrateUserState(
  parsed: Partial<UserState>,
  role: 'owner' | 'guest',
  nowMs: number = Date.now()
): UserState {
  const defaultState = role === 'owner' ? DEFAULT_OWNER_STATE : DEFAULT_GUEST_STATE;
  const dsaDefault = DEFAULT_TRACK_PROGRESS();
  const azureDefault = DEFAULT_TRACK_PROGRESS();
  const isLegacy = !parsed.dsaProgress && !parsed.azureProgress;
  const sanitizedAssessment = sanitizeLockedAssessmentState(
    parsed.assessmentSubmissions,
    parsed.leetcodeProgress,
    parsed.activeAssessmentAttempt,
    nowMs
  );

  const baseHydrated: UserState = {
    ...defaultState,
    ...parsed,
    role,
    simulationEnabled: false,
    simulationDate: null,
    assessmentSubmissions: sanitizedAssessment.assessmentSubmissions,
    leetcodeProgress: sanitizedAssessment.leetcodeProgress,
    activeAssessmentAttempt: sanitizedAssessment.activeAssessmentAttempt,
    lastActiveDayNumber: parsed.lastActiveDayNumber || defaultState.lastActiveDayNumber || 1,
    timerState: {
      ...defaultState.timerState,
      ...(parsed.timerState || {}),
      trackId: parsed.timerState?.trackId || 'main'
    },
    trackTimerSnapshots: parsed.trackTimerSnapshots || {},
    dsaProgress: {
      ...dsaDefault,
      ...(parsed.dsaProgress || {}),
      completedTasks: parsed.dsaProgress?.completedTasks || {},
      completedDays: parsed.dsaProgress?.completedDays || {},
      dayNotes: parsed.dsaProgress?.dayNotes || {},
      studyTimeSeconds: parsed.dsaProgress?.studyTimeSeconds || {},
      revisionRecords: parsed.dsaProgress?.revisionRecords || {},
      lastActiveDayNumber: parsed.dsaProgress?.lastActiveDayNumber || 1
    },
    azureProgress: {
      ...azureDefault,
      ...(parsed.azureProgress || {}),
      completedTasks: parsed.azureProgress?.completedTasks || {},
      completedDays: parsed.azureProgress?.completedDays || {},
      dayNotes: parsed.azureProgress?.dayNotes || {},
      studyTimeSeconds: parsed.azureProgress?.studyTimeSeconds || {},
      revisionRecords: parsed.azureProgress?.revisionRecords || {},
      lastActiveDayNumber: parsed.azureProgress?.lastActiveDayNumber || 1
    },
    uploadedPdfs: mergeDefaultTrackPdfs(parsed.uploadedPdfs, isLegacy),
    activePdfId: parsed.activePdfId || defaultState.activePdfId,
    resources: Array.isArray(parsed.resources) ? parsed.resources : [],
    doubtEntries: Array.isArray(parsed.doubtEntries) ? parsed.doubtEntries : [],
    sharedSettings: {
      ...DEFAULT_SHARED_SETTINGS,
      ...(parsed.sharedSettings || {})
    }
  };

  if (role === 'guest') {
    const shared = loadSharedContentSync();
    return applySharedContentToGuestState(baseHydrated, shared);
  }

  return baseHydrated;
}

// Synchronous fast load from localStorage cache
export function loadRoleStateSync(role: 'owner' | 'guest'): UserState {
  const key = role === 'owner' ? OWNER_STORAGE_KEY : GUEST_STORAGE_KEY;
  const defaultState = role === 'owner' ? DEFAULT_OWNER_STATE : DEFAULT_GUEST_STATE;

  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    if (!raw) {
      if (role === 'guest') {
        return applySharedContentToGuestState({ ...defaultState }, loadSharedContentSync());
      }
      return defaultState;
    }
    const parsed = JSON.parse(raw) as Partial<UserState>;
    return hydrateUserState(parsed, role);
  } catch (err) {
    console.error(`Failed to load ${role} storage:`, err);
    if (role === 'guest') {
      return applySharedContentToGuestState({ ...defaultState }, loadSharedContentSync());
    }
    return defaultState;
  }
}

// Strip shared-content-specific arrays when persisting Guest personal progress so Guest sandbox never becomes stale authority
function buildGuestPersistPayload(state: UserState): UserState {
  return {
    ...state,
    role: 'guest',
    username: 'Guest',
    passwordHash: '',
    authVerifier: undefined,
    // Keep personal progress fields intact; shared content is always overlaid from SHARED_CONTENT_STORAGE_KEY
    uploadedPdfs: [],
    resources: []
  };
}

// Scrub any plaintext password field before persisting Owner state to LocalStorage or IndexedDB
function buildOwnerPersistPayload(state: UserState): UserState {
  return {
    ...state,
    role: 'owner',
    passwordHash: ''
  };
}

function parseIsoEpochMs(iso?: string | null): number {
  if (!iso) return 0;
  const ms = new Date(iso).getTime();
  return Number.isFinite(ms) ? ms : 0;
}

function mergeTrackProgressSafely(
  localTrack: TrackProgressState,
  cloudTrack: Partial<TrackProgressState> | undefined,
  localIsNewer: boolean
): TrackProgressState {
  if (!cloudTrack) return localTrack;

  const olderTasks = localIsNewer ? cloudTrack.completedTasks || {} : localTrack.completedTasks;
  const newerTasks = localIsNewer ? localTrack.completedTasks : cloudTrack.completedTasks || {};
  const mergedTasks: Record<string, boolean> = { ...olderTasks, ...newerTasks };
  for (const [k, v] of Object.entries(olderTasks)) {
    if (v) mergedTasks[k] = true;
  }

  const olderDays = localIsNewer ? cloudTrack.completedDays || {} : localTrack.completedDays;
  const newerDays = localIsNewer ? localTrack.completedDays : cloudTrack.completedDays || {};
  const mergedDays: Record<number, boolean> = { ...olderDays, ...newerDays };
  for (const [k, v] of Object.entries(olderDays)) {
    if (v) mergedDays[Number(k)] = true;
  }

  const mergedNotes: Record<number, string> = {
    ...(localIsNewer ? cloudTrack.dayNotes || {} : localTrack.dayNotes),
    ...(localIsNewer ? localTrack.dayNotes : cloudTrack.dayNotes || {})
  };
  for (const [k, v] of Object.entries(localIsNewer ? cloudTrack.dayNotes || {} : localTrack.dayNotes)) {
    const day = Number(k);
    if (v && !mergedNotes[day]) mergedNotes[day] = v;
  }

  const mergedTime: Record<number, number> = { ...(cloudTrack.studyTimeSeconds || {}) };
  for (const [k, v] of Object.entries(localTrack.studyTimeSeconds || {})) {
    const day = Number(k);
    mergedTime[day] = Math.max(mergedTime[day] || 0, Number(v) || 0);
  }

  const mergedRevisions = { ...(cloudTrack.revisionRecords || {}) };
  for (const [k, rec] of Object.entries(localTrack.revisionRecords || {})) {
    const wk = Number(k);
    const existing = mergedRevisions[wk];
    if (!existing) {
      mergedRevisions[wk] = rec;
    } else {
      const localRevMs = parseIsoEpochMs(rec.completedAt);
      const cloudRevMs = parseIsoEpochMs(existing.completedAt);
      if (localRevMs >= cloudRevMs) mergedRevisions[wk] = rec;
    }
  }

  return {
    completedTasks: mergedTasks,
    completedDays: mergedDays,
    dayNotes: mergedNotes,
    studyTimeSeconds: mergedTime,
    revisionRecords: mergedRevisions,
    lastActiveDayNumber: localIsNewer
      ? localTrack.lastActiveDayNumber || cloudTrack.lastActiveDayNumber || 1
      : cloudTrack.lastActiveDayNumber || localTrack.lastActiveDayNumber || 1
  };
}

function mergeArrayById<T extends { id: string }>(
  primary: T[],
  secondary: T[] | undefined
): T[] {
  const map = new Map<string, T>();
  for (const item of secondary || []) {
    if (item?.id) map.set(item.id, item);
  }
  for (const item of primary || []) {
    if (item?.id) map.set(item.id, item);
  }
  return Array.from(map.values());
}

export interface SafeMergeResult {
  merged: UserState;
  conflictDetected: boolean;
  resolution: 'local_newer' | 'cloud_newer' | 'merged_equal';
  shouldPushMergedToCloud: boolean;
}

/**
 * Timestamp-aware non-destructive Owner progress merge.
 * Preserves newer local progress while merging distinct records across Main, DSA, Azure,
 * assessments, LeetCode, notes, timers, doubts, resources, and PDF metadata.
 */
export function mergeOwnerStatesSafely(
  localState: UserState,
  cloudRaw: Partial<UserState>,
  nowMs: number = Date.now()
): SafeMergeResult {
  const cleanLocal = hydrateUserState(localState, 'owner', nowMs);
  const cleanCloud = hydrateUserState(cloudRaw, 'owner', nowMs);

  const localMs = parseIsoEpochMs(cleanLocal.lastSavedTimestamp);
  const cloudMs = parseIsoEpochMs(cleanCloud.lastSavedTimestamp);
  const localIsNewer = localMs >= cloudMs;
  const conflictDetected = localMs > 0 && cloudMs > 0 && Math.abs(localMs - cloudMs) > 1000;

  const primary = localIsNewer ? cleanLocal : cleanCloud;
  const secondary = localIsNewer ? cleanCloud : cleanLocal;

  // Main Plan union merge
  const completedTasks: Record<string, boolean> = {
    ...secondary.completedTasks,
    ...primary.completedTasks
  };
  for (const [k, v] of Object.entries(secondary.completedTasks)) {
    if (v) completedTasks[k] = true;
  }

  const completedDays: Record<number, boolean> = {
    ...secondary.completedDays,
    ...primary.completedDays
  };
  for (const [k, v] of Object.entries(secondary.completedDays)) {
    if (v) completedDays[Number(k)] = true;
  }

  const dayNotes: Record<number, string> = {
    ...secondary.dayNotes,
    ...primary.dayNotes
  };
  for (const [k, v] of Object.entries(secondary.dayNotes)) {
    const day = Number(k);
    if (v && !dayNotes[day]) dayNotes[day] = v;
  }

  const studyTimeSeconds: Record<number, number> = { ...secondary.studyTimeSeconds };
  for (const [k, v] of Object.entries(primary.studyTimeSeconds)) {
    const day = Number(k);
    studyTimeSeconds[day] = Math.max(studyTimeSeconds[day] || 0, Number(v) || 0);
  }

  // Assessments union (prefer newer submission if same week)
  const assessmentSubmissions: Record<number, AssessmentSubmission> = {
    ...secondary.assessmentSubmissions
  };
  for (const [k, sub] of Object.entries(primary.assessmentSubmissions)) {
    const wk = Number(k);
    const other = assessmentSubmissions[wk];
    if (!other || parseIsoEpochMs(sub.submittedAt) >= parseIsoEpochMs(other.submittedAt)) {
      assessmentSubmissions[wk] = sub;
    }
  }

  // LeetCode progress union (never lose completed=true or notes)
  const leetcodeProgress: Record<string, LeetCodeProgressEntry> = {
    ...secondary.leetcodeProgress
  };
  for (const [probId, entry] of Object.entries(primary.leetcodeProgress)) {
    const other = leetcodeProgress[probId];
    if (!other) {
      leetcodeProgress[probId] = entry;
    } else {
      leetcodeProgress[probId] = {
        completed: Boolean(entry.completed || other.completed),
        completedAt: entry.completedAt || other.completedAt,
        notes: entry.notes || other.notes
      };
    }
  }

  // PDFs: preserve local inline data: URLs if cloud record does not yet have a storagePath
  const pdfMap = new Map<string, RoadmapPdfRecord>();
  for (const pdf of secondary.uploadedPdfs) {
    pdfMap.set(pdf.id, pdf);
  }
  for (const pdf of primary.uploadedPdfs) {
    const existing = pdfMap.get(pdf.id);
    if (!existing) {
      pdfMap.set(pdf.id, pdf);
    } else {
      pdfMap.set(pdf.id, {
        ...existing,
        ...pdf,
        fileUrl:
          pdf.fileUrl && (pdf.fileUrl.startsWith('data:') || pdf.fileUrl.startsWith('/'))
            ? pdf.fileUrl
            : existing.fileUrl || pdf.fileUrl,
        storagePath: pdf.storagePath || existing.storagePath
      });
    }
  }

  const mergedPdfs = Array.from(pdfMap.values());
  const resolvedActivePdfId = mergedPdfs.some(p => p.id === primary.activePdfId)
    ? primary.activePdfId
    : mergedPdfs[0]?.id || primary.activePdfId;

  const mergedSharedSettings: SharedAppSettings =
    parseIsoEpochMs(cleanLocal.sharedSettings?.updatedAt) >=
    parseIsoEpochMs(cleanCloud.sharedSettings?.updatedAt)
      ? cleanLocal.sharedSettings
      : cleanCloud.sharedSettings;

  const dailyAiResourceCompletions: Record<string, boolean> = {
    ...(secondary.dailyAiResourceCompletions || {}),
    ...(primary.dailyAiResourceCompletions || {})
  };
  for (const [k, v] of Object.entries(secondary.dailyAiResourceCompletions || {})) {
    if (v) dailyAiResourceCompletions[k] = true;
  }

  const merged: UserState = {
    ...primary,
    role: 'owner',
    passwordHash: '',
    authVerifier: cleanLocal.authVerifier || cleanCloud.authVerifier,
    isAuthenticated: localState.isAuthenticated,
    completedTasks,
    completedDays,
    dayNotes,
    studyTimeSeconds,
    assessmentSubmissions,
    leetcodeProgress,
    activeAssessmentAttempt: primary.activeAssessmentAttempt || secondary.activeAssessmentAttempt || null,
    studyLogs: mergeArrayById(primary.studyLogs, secondary.studyLogs),
    dsaProgress: mergeTrackProgressSafely(cleanLocal.dsaProgress, cleanCloud.dsaProgress, localIsNewer),
    azureProgress: mergeTrackProgressSafely(cleanLocal.azureProgress, cleanCloud.azureProgress, localIsNewer),
    uploadedPdfs: mergedPdfs.map(p => ({ ...p, isActiveRoadmap: p.id === resolvedActivePdfId })),
    activePdfId: resolvedActivePdfId,
    resources: mergeArrayById(primary.resources, secondary.resources),
    doubtEntries: mergeArrayById(primary.doubtEntries, secondary.doubtEntries),
    sharedSettings: mergedSharedSettings,
    dailyAiResourceCompletions,
    lastSavedTimestamp: new Date(Math.max(localMs, cloudMs, nowMs)).toISOString()
  };

  return {
    merged,
    conflictDetected,
    resolution: localMs === cloudMs ? 'merged_equal' : localIsNewer ? 'local_newer' : 'cloud_newer',
    shouldPushMergedToCloud: localIsNewer || conflictDetected
  };
}

// Save immediately to LocalStorage and asynchronously replicate to IndexedDB
export async function saveRoleStatePermanent(state: UserState): Promise<boolean> {
  const isOwner = state.role === 'owner';
  const key = isOwner ? OWNER_STORAGE_KEY : GUEST_STORAGE_KEY;
  const timestampedState: UserState = isOwner
    ? buildOwnerPersistPayload({ ...state, lastSavedTimestamp: new Date().toISOString() })
    : buildGuestPersistPayload({ ...state, lastSavedTimestamp: new Date().toISOString() });

  let localStorageOk = false;
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(timestampedState));
      localStorageOk = true;
    } catch (err) {
      console.error('LocalStorage write failed:', err);
    }
  }

  // Only Owner can update Shared Owner Content
  if (isOwner) {
    const shared = extractSharedContentFromOwner(timestampedState);
    await saveSharedContent(shared);
  }

  // Replicate personal role state to IndexedDB
  const idbOk = await saveToIndexedDB(key, timestampedState);

  return localStorageOk || idbOk;
}

export function resetGuestPreviewState(): UserState {
  const freshGuest = applySharedContentToGuestState(
    {
      ...DEFAULT_GUEST_STATE,
      dsaProgress: DEFAULT_TRACK_PROGRESS(),
      azureProgress: DEFAULT_TRACK_PROGRESS(),
      isAuthenticated: true
    },
    loadSharedContentSync()
  );
  saveRoleStatePermanent(freshGuest);
  return freshGuest;
}

// Backup Export
export function exportBackupJson(state: UserState): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `steeven_180day_prep_backup_${timestamp}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Backup Import (Owner Only)
export function importBackupJson(jsonString: string): UserState | null {
  try {
    const parsed = JSON.parse(jsonString) as Partial<UserState>;
    if (parsed && typeof parsed === 'object') {
      const merged = hydrateUserState(
        {
          ...parsed,
          isAuthenticated: true
        },
        'owner'
      );
      saveRoleStatePermanent(merged);
      return merged;
    }
    return null;
  } catch (err) {
    console.error('Invalid backup JSON:', err);
    return null;
  }
}
