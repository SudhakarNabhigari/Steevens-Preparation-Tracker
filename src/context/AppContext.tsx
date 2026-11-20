import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  DaySchedule,
  DayStatus,
  UserState,
  UserRole,
  SaveStatus,
  TimerState,
  AssessmentSubmission,
  StudySessionLog,
  RoadmapPdfRecord,
  ResourceItem,
  DoubtEntry,
  DoubtStatus,
  TrackId,
  TrackProgressState,
  TrackRevisionRecord,
  SharedAppSettings,
  WrittenReviewStatus,
  WeeklyReviewNotes
} from '../types';
import {
  ALL_180_DAYS,
  START_DATE_IST
} from '../data/syllabus';
import { DSA_100_DAYS } from '../data/dsaSyllabus';
import { AZURE_100_DAYS } from '../data/azureSyllabus';
import { getUnlockedAssessmentForWeek } from '../data/assessments';
import { isAssessmentUnlockedByIstClock } from '../utils/assessmentLock';
import {
  isDayUnlockedByIstClock,
  getCurrentIstScheduleDay,
  MAIN_TRACK_MAX_DAYS,
  SUB_TRACK_MAX_DAYS,
  DAILY_PREPARATION_START_ISO_IST
} from '../utils/dailyLock';
import { createOwnerRelaunchCycle, isBeforeOwnerRelaunch, OWNER_RELAUNCH_CYCLE_ID, OWNER_RELAUNCH_START_ISO_IST, OWNER_RELAUNCH_START_MS } from '../utils/relaunch';
import { isOfficialRelaunchStatus } from '../utils/relaunchConfig';
import {
  applyRubricSelfReviewToSubmission,
  buildAssessmentSnapshot,
  createEvaluatedSubmission
} from '../utils/assessmentScoring';
import {
  loadRoleStateSync,
  saveRoleStatePermanent,
  loadFromIndexedDB,
  hydrateUserState,
  OWNER_STORAGE_KEY,
  GUEST_STORAGE_KEY,
  DEFAULT_OWNER_STATE,
  DEFAULT_GUEST_STATE,
  exportBackupJson,
  importBackupJson,
  loadSharedContentAsync,
  applySharedContentToGuestState,
  mergeSharedContentIntoGuestState,
  subscribeToSharedContentUpdates,
  resetGuestPreviewState,
  extractSharedContentFromOwner,
  saveSharedContent
} from '../services/storage';
import {
  classifySupabaseAuthError,
  configuredOwnerEmail,
  configuredOwnerUserId,
  getSupabaseOwnerSession,
  hasPartialSupabaseEnv,
  isAnonKeySafeForClient,
  isAuthorizedOwnerUser,
  isConfiguredOwnerUserIdPlaceholder,
  isConfiguredOwnerUserIdValid,
  isSupabaseConfigured,
  requiresStrictServerOwnerVerification,
  supabase,
  verifyOwnerSessionWithServer
} from '../lib/supabase';
import {
  loadOrMigrateOwnerProgress,
  saveOwnerProgressToCloud
} from '../services/cloudProgress';
import {
  computeOwnerTransitionVerifier,
  verifyGuestLocalPassword,
  verifyOwnerTransitionPassword
} from '../utils/authCrypto';

export type NavigationPage =
  | 'login'
  | 'lock_screen'
  | 'home_dashboard'
  | 'today_work'
  | 'dsa_track'
  | 'azure_track'
  | 'all_days'
  | 'weekly_assessments'
  | 'weekly_progress'
  | 'roadmap_pdf'
  | 'original_roadmap'
  | 'study_history'
  | 'settings'
  | 'resource_library'
  | 'doubt_notebook'
  | 'preparation_calendar'
  | 'daily_ai_resources';

interface AppContextType {
  state: UserState;
  userRole: UserRole;
  currentPage: NavigationPage;
  setCurrentPage: (page: NavigationPage) => void;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  selectedDsaDay: number;
  setSelectedDsaDay: (day: number) => void;
  selectedAzureDay: number;
  setSelectedAzureDay: (day: number) => void;
  openDayForTrack: (track: TrackId, dayNumber: number) => void;
  aiResourcesTarget: { trackId: TrackId; dayNumber: number } | null;
  openDailyAiResources: (trackId?: TrackId, dayNumber?: number) => void;
  toggleDailyAiResourceCompletion: (resourceKey: string) => void;
  saveStatus: SaveStatus;

  // Real clock & lock state
  nowTimestamp: number;
  isPreparationLocked: boolean;
  ownerRelaunchServerReady: boolean;
  ownerRelaunchTransitionReady: boolean;
  lockTimeRemaining: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
  };
  currentDayNumber: number; // 1 to 180 (Main)
  currentTrackDayNumber: number; // 1 to 100 (DSA & Azure)
  currentDaySchedule: DaySchedule;
  isSaturdayToday: boolean;

  // Day unlock & status helpers
  isDayUnlocked: (dayNumber: number) => boolean;
  isTrackDayUnlocked: (track: TrackId, dayNumber: number) => boolean;
  getDayStatus: (dayNumber: number) => DayStatus;
  getDayTaskCompletion: (dayNumber: number) => { completed: number; total: number; percentage: number };
  getTrackDayStatus: (track: TrackId, dayNumber: number) => DayStatus;
  getTrackDayTaskCompletion: (track: TrackId, dayNumber: number) => { completed: number; total: number; percentage: number };

  // Authentication
  login: (username: string, pass: string, targetRole: UserRole) => Promise<boolean>;
  logout: () => void;
  updateCredentials: (
    username: string,
    password?: string
  ) => Promise<{ success: boolean; message: string }>;
  isSupabaseAuthConfigured: boolean;
  isOwnerSupabaseSessionActive: boolean;
  lastAuthError: string | null;
  clearAuthError: () => void;

  // Main Plan Task & Notes Actions
  toggleTaskCompletion: (dayNumber: number, taskId: string) => void;
  saveDayNotes: (dayNumber: number, notes: string) => void;
  submitAssessment: (submission: AssessmentSubmission) => boolean;

  // 26-Week Assessment Lock, Attempt, Rubric Self-Review & LeetCode Actions
  isAssessmentWeekUnlocked: (weekNumber: number) => boolean;
  startAssessmentAttempt: (weekNumber: number) => { success: boolean; reason?: string };
  saveAssessmentDraftAnswer: (weekNumber: number, questionId: string, value: string | number) => void;
  updateAssessmentAttemptElapsed: (weekNumber: number, elapsedSeconds: number) => void;
  cancelAssessmentAttempt: (weekNumber?: number) => void;
  updateAssessmentRubricReview: (
    weekNumber: number,
    selfReviews: Record<string, WrittenReviewStatus>,
    reviewNotes?: WeeklyReviewNotes
  ) => boolean;
  toggleAssessmentLeetCodeProblem: (weekNumber: number, problemId: string) => boolean;
  saveAssessmentLeetCodeNotes: (weekNumber: number, problemId: string, notes: string) => boolean;

  // DSA & Azure Independent Track Actions
  toggleTrackTaskCompletion: (track: 'dsa' | 'azure', dayNumber: number, taskId: string) => void;
  saveTrackDayNotes: (track: 'dsa' | 'azure', dayNumber: number, notes: string) => void;
  saveTrackRevisionRecord: (
    track: 'dsa' | 'azure',
    weekNumber: number,
    record: Omit<TrackRevisionRecord, 'weekNumber' | 'completedAt'>
  ) => void;

  // Timer actions
  activeTimer: TimerState;
  startTimer: (dayNumber: number, durationMinutes?: number, type?: 'daily' | 'assessment', trackId?: TrackId) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;

  // PDF changes are role-local; only Owner state is mirrored to shared/cloud storage.
  uploadRoadmapPdf: (
    file: File
  ) => Promise<{ success: boolean; message: string; pdfId?: string; record?: RoadmapPdfRecord }>;
  setActivePdf: (pdfId: string) => void;
  deletePdf: (pdfId: string) => boolean;

  // Resource Library Actions (Owner-managed shared content; read-only for Guest)
  addResource: (item: Omit<ResourceItem, 'id' | 'dateAdded'>) => { success: boolean; message: string; id?: string };
  updateResource: (id: string, updates: Partial<ResourceItem>) => boolean;
  deleteResource: (id: string) => boolean;
  toggleResourceImportant: (id: string) => void;
  toggleResourceCompleted: (id: string) => void;
  saveResourceNotes: (id: string, notes: string) => void;

  // Shared Settings & Live Sync
  updateSharedSettings: (updates: Partial<SharedAppSettings>) => boolean;
  refreshSharedContent: () => Promise<void>;

  // Doubt & Error Notebook Actions
  addDoubtEntry: (entry: Omit<DoubtEntry, 'id' | 'dateCreated'>) => { success: boolean; id: string };
  updateDoubtEntry: (id: string, updates: Partial<DoubtEntry>) => boolean;
  deleteDoubtEntry: (id: string) => boolean;
  setDoubtStatus: (id: string, status: DoubtStatus) => void;
  toggleDoubtNeedsRevision: (id: string) => void;
  saveDoubtAdditionalNotes: (id: string, notes: string) => void;

  // Backup & Reset
  exportBackup: () => void;
  importBackup: (jsonStr: string) => boolean;
  resetAllData: () => void;
  resetGuestPreview: () => void;

  // Ephemeral TEST MODE Schedule Preview (never modifies real locks or saved progress)
  testModeEnabled: boolean;
  testModeDate: string | null;
  setSimulationMode: (enabled: boolean, isoDate?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const START_DATE_MS = new Date(START_DATE_IST).getTime();
const preparationStartForRole = (role: UserRole) => role === 'owner' ? OWNER_RELAUNCH_START_ISO_IST : DAILY_PREPARATION_START_ISO_IST;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Never preload Owner personal data into active React state prior to authentication.
  const [state, setState] = useState<UserState>(() => ({
    ...DEFAULT_GUEST_STATE,
    isAuthenticated: false
  }));
  const [currentPage, setCurrentPage] = useState<NavigationPage>('login');
  const [selectedDayNumber, setSelectedDayNumberState] = useState<number>(1);
  const [selectedDsaDay, setSelectedDsaDayState] = useState<number>(1);
  const [selectedAzureDay, setSelectedAzureDayState] = useState<number>(1);
  const [aiResourcesTarget, setAiResourcesTarget] = useState<{
    trackId: TrackId;
    dayNumber: number;
  } | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [nowTimestamp, setNowTimestamp] = useState<number>(Date.now());
  const [ownerRelaunchServerReady, setOwnerRelaunchServerReady] = useState(false);
  const serverTimeAnchorRef = useRef<{ serverMs: number; perfMs: number } | null>(null);
  const [testModeEnabled, setTestModeEnabled] = useState<boolean>(false);
  const [testModeDate, setTestModeDate] = useState<string | null>(null);
  const [isOwnerSupabaseSessionActive, setIsOwnerSupabaseSessionActive] = useState<boolean>(false);
  const [lastAuthError, setLastAuthError] = useState<string | null>(null);
  const clearAuthError = useCallback(() => setLastAuthError(null), []);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cloudSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ownerCloudUserIdRef = useRef<string | null>(null);
  const explicitLogoutRef = useRef<boolean>(false);
  const authActionInProgressRef = useRef<boolean>(false);
  const stateRef = useRef<UserState>(state);
  stateRef.current = state;
  const guestHydrationGenerationRef = useRef(0);
  const guestResetInProgressRef = useRef(false);
  const getClockNow = useCallback(() => {
    if (stateRef.current.role !== 'owner') return Date.now();
    const anchor = serverTimeAnchorRef.current;
    return anchor ? anchor.serverMs + Math.max(0, performance.now() - anchor.perfMs) : 0;
  }, []);

  useEffect(() => {
    let mounted = true;
    const syncTime = async () => {
      try {
        const response = await fetch('/api/relaunch/status', { cache: 'no-store' });
        if (!response.ok) throw new Error('Relaunch time service unavailable');
        const payload: unknown = await response.json();
        if (!mounted || !isOfficialRelaunchStatus(payload)) return;
        serverTimeAnchorRef.current = { serverMs: payload.serverNow, perfMs: performance.now() };
        setOwnerRelaunchServerReady(true);
        setNowTimestamp(payload.serverNow);
      } catch {
        // Owner remains locked until the server supplies an authoritative time.
      }
    };
    void syncTime();
    const poll = setInterval(syncTime, 15_000);
    return () => { mounted = false; clearInterval(poll); };
  }, []);

  const hydrateAuthenticatedOwnerLocalState = useCallback((cloudUserId?: string | null) => {
    const ownerState = loadRoleStateSync('owner');
    ownerState.isAuthenticated = true;
    ownerState.passwordHash = '';
    setState(ownerState);
    setSelectedDayNumberState(ownerState.lastActiveDayNumber || 1);
    setSelectedDsaDayState(ownerState.dsaProgress?.lastActiveDayNumber || 1);
    setSelectedAzureDayState(ownerState.azureProgress?.lastActiveDayNumber || 1);

    loadFromIndexedDB(OWNER_STORAGE_KEY).then(async dbOwner => {
      let latestLocal = ownerState;
      if (
        dbOwner &&
        dbOwner.lastSavedTimestamp &&
        (!ownerState.lastSavedTimestamp || dbOwner.lastSavedTimestamp > ownerState.lastSavedTimestamp)
      ) {
        const hydrated = hydrateUserState(
          { ...dbOwner, passwordHash: '', isAuthenticated: true },
          'owner'
        );
        latestLocal = hydrated;
        await saveSharedContent(extractSharedContentFromOwner(hydrated));
        setState(prev => (prev.role === 'owner' && prev.isAuthenticated ? hydrated : prev));
        if (hydrated.lastActiveDayNumber) setSelectedDayNumberState(hydrated.lastActiveDayNumber);
        if (hydrated.dsaProgress?.lastActiveDayNumber) {
          setSelectedDsaDayState(hydrated.dsaProgress.lastActiveDayNumber);
        }
        if (hydrated.azureProgress?.lastActiveDayNumber) {
          setSelectedAzureDayState(hydrated.azureProgress.lastActiveDayNumber);
        }
      } else {
        await saveSharedContent(extractSharedContentFromOwner(ownerState));
      }

      if (cloudUserId && isSupabaseConfigured) {
        try {
          const cloudSync = await loadOrMigrateOwnerProgress(cloudUserId, latestLocal);
          if (cloudSync.state) {
            const syncedState = hydrateUserState(
              { ...cloudSync.state, passwordHash: '', isAuthenticated: true },
              'owner'
            );
            await saveRoleStatePermanent(syncedState);
            await saveSharedContent(extractSharedContentFromOwner(syncedState));
            setState(prev =>
              prev.role === 'owner' && prev.isAuthenticated ? syncedState : prev
            );
          }
        } catch {
          // Local IndexedDB/localStorage Owner progress remains active if cloud sync is temporarily offline
        }
      }
    });
  }, []);

  // Restore existing Supabase Auth Owner session cleanly if configured (never touches Guest)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    let mounted = true;
    (async () => {
      if (authActionInProgressRef.current) return;
      const { data, error } = await supabase.auth.getSession();
      if (!mounted || authActionInProgressRef.current) return;

      if (error) {
        setIsOwnerSupabaseSessionActive(false);
        setLastAuthError(classifySupabaseAuthError(error));
        return;
      }

      if (!data?.session?.user) return;

      const validSession = await getSupabaseOwnerSession();
      if (!mounted || authActionInProgressRef.current) return;

      if (!validSession) {
        ownerCloudUserIdRef.current = null;
        explicitLogoutRef.current = true;
        await supabase.auth.signOut().finally(() => {
          explicitLogoutRef.current = false;
        });
        setIsOwnerSupabaseSessionActive(false);
        setLastAuthError(
          !isConfiguredOwnerUserIdValid && !isConfiguredOwnerUserIdPlaceholder
            ? 'Owner configuration error: VITE_OWNER_USER_ID is not a valid 36-character Supabase Auth UUID.'
            : !isAuthorizedOwnerUser(data.session.user)
            ? 'This Supabase session is not authorized as the Owner.'
            : 'Your Owner session has expired. Please sign in again.'
        );
        return;
      }

      const serverVerify = await verifyOwnerSessionWithServer(
        validSession.access_token,
        undefined,
        { requireStrictServer: requiresStrictServerOwnerVerification }
      );
      if (!mounted || authActionInProgressRef.current) return;
      if (
        !serverVerify.authorized &&
        (requiresStrictServerOwnerVerification || !serverVerify.unreachable)
      ) {
        ownerCloudUserIdRef.current = null;
        explicitLogoutRef.current = true;
        await supabase.auth.signOut().finally(() => {
          explicitLogoutRef.current = false;
        });
        setIsOwnerSupabaseSessionActive(false);
        setLastAuthError(serverVerify.error || 'Owner session verification failed.');
        return;
      }

      ownerCloudUserIdRef.current = validSession.user.id;
      setLastAuthError(null);
      setIsOwnerSupabaseSessionActive(true);
      hydrateAuthenticatedOwnerLocalState(validSession.user.id);
      setCurrentPage(prev => (prev === 'login' ? 'home_dashboard' : prev));
    })();

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_OUT' || !session) {
        ownerCloudUserIdRef.current = null;
        setIsOwnerSupabaseSessionActive(false);
        // Never disrupt an active Guest preview session on background Supabase auth events
        if (stateRef.current.role === 'owner' && stateRef.current.isAuthenticated) {
          const wasExplicit = explicitLogoutRef.current;
          setState({ ...DEFAULT_GUEST_STATE, isAuthenticated: false });
          setCurrentPage('login');
          if (!wasExplicit) {
            setLastAuthError('Your Owner session has expired. Please sign in again.');
          }
        }
      } else if (session.user) {
        if (!isAuthorizedOwnerUser(session.user)) {
          ownerCloudUserIdRef.current = null;
          setIsOwnerSupabaseSessionActive(false);
          return;
        }
        ownerCloudUserIdRef.current = session.user.id;
        setIsOwnerSupabaseSessionActive(true);
      }
    });

    return () => {
      mounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, [hydrateAuthenticatedOwnerLocalState]);

  const refreshSharedContent = useCallback(async () => {
    const latestShared = await loadSharedContentAsync();
    setState(prev => {
      if (prev.role !== 'guest') return prev;
      return mergeSharedContentIntoGuestState(prev, latestShared);
    });
  }, []);

  // Live synchronization for Guest: BroadcastChannel, storage event, window focus, and page changes
  useEffect(() => {
    if (!state.isAuthenticated || state.role !== 'guest') return;

    refreshSharedContent();

    const unsubscribe = subscribeToSharedContentUpdates(() => {
      refreshSharedContent();
    });

    const handleFocusOrVisibility = () => {
      if (typeof document === 'undefined' || document.visibilityState === 'visible') {
        refreshSharedContent();
      }
    };

    window.addEventListener('focus', handleFocusOrVisibility);
    document.addEventListener('visibilitychange', handleFocusOrVisibility);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', handleFocusOrVisibility);
      document.removeEventListener('visibilitychange', handleFocusOrVisibility);
    };
  }, [state.isAuthenticated, state.role, currentPage, refreshSharedContent]);

  const setSelectedDayNumber = useCallback((day: number) => {
    const clamped = Math.min(180, Math.max(1, day));
    setSelectedDayNumberState(clamped);
    setState(prev => ({
      ...prev,
      lastActiveDayNumber: clamped
    }));
  }, []);

  const setSelectedDsaDay = useCallback((day: number) => {
    const clamped = Math.min(100, Math.max(1, day));
    setSelectedDsaDayState(clamped);
    setState(prev => ({
      ...prev,
      dsaProgress: {
        ...prev.dsaProgress,
        lastActiveDayNumber: clamped
      }
    }));
  }, []);

  const setSelectedAzureDay = useCallback((day: number) => {
    const clamped = Math.min(100, Math.max(1, day));
    setSelectedAzureDayState(clamped);
    setState(prev => ({
      ...prev,
      azureProgress: {
        ...prev.azureProgress,
        lastActiveDayNumber: clamped
      }
    }));
  }, []);

  const openDayForTrack = useCallback(
    (track: TrackId, dayNumber: number) => {
      if (track === 'main') {
        setSelectedDayNumber(dayNumber);
        setCurrentPage('today_work');
      } else if (track === 'dsa') {
        const clamped = Math.min(100, Math.max(1, dayNumber));
        setSelectedDsaDay(clamped);
        setCurrentPage('dsa_track');
      } else {
        const clamped = Math.min(100, Math.max(1, dayNumber));
        setSelectedAzureDay(clamped);
        setCurrentPage('azure_track');
      }
    },
    [setSelectedDayNumber, setSelectedDsaDay, setSelectedAzureDay]
  );

  const openDailyAiResources = useCallback(
    (trackId?: TrackId, dayNumber?: number) => {
      if (trackId && dayNumber) {
        const maxDay = trackId === 'main' ? MAIN_TRACK_MAX_DAYS : SUB_TRACK_MAX_DAYS;
        setAiResourcesTarget({
          trackId,
          dayNumber: Math.min(maxDay, Math.max(1, dayNumber))
        });
      }
      setCurrentPage('daily_ai_resources');
    },
    []
  );

  const toggleDailyAiResourceCompletion = useCallback((resourceKey: string) => {
    setState(prev => {
      const current = prev.dailyAiResourceCompletions || {};
      return {
        ...prev,
        dailyAiResourceCompletions: {
          ...current,
          [resourceKey]: !current[resourceKey]
        }
      };
    });
  }, []);

  // Permanent Auto-Save on state changes (local + Owner-only Supabase cloud sync)
  useEffect(() => {
    if (!state.isAuthenticated) return;

    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    if (cloudSaveTimeoutRef.current) clearTimeout(cloudSaveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      const ok = await saveRoleStatePermanent(state);
      setSaveStatus(ok ? 'saved' : 'error');
    }, 250);

    const activeOwnerCloudUid =
      state.role === 'owner' && isSupabaseConfigured ? ownerCloudUserIdRef.current : null;
    if (activeOwnerCloudUid) {
      cloudSaveTimeoutRef.current = setTimeout(() => {
        const syncedState = {
          ...state,
          lastSavedTimestamp: new Date().toISOString()
        };
        void saveOwnerProgressToCloud(activeOwnerCloudUid, syncedState).catch(() => {
          // Local IndexedDB/localStorage save already succeeded cleanly
        });
      }, 1200);
    }

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (cloudSaveTimeoutRef.current) clearTimeout(cloudSaveTimeoutRef.current);
    };
  }, [state]);

  // Keep live second tick
  useEffect(() => {
    const interval = setInterval(() => {
      const anchor = serverTimeAnchorRef.current;
      if (stateRef.current.role === 'owner') {
        if (anchor) setNowTimestamp(anchor.serverMs + Math.max(0, performance.now() - anchor.perfMs));
      } else {
        setNowTimestamp(Date.now());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Owner launch time comes from the server; Guest retains its existing schedule.
  const isPreparationLocked = useMemo(() => {
    if (state.role === 'owner') return !ownerRelaunchServerReady || nowTimestamp < OWNER_RELAUNCH_START_MS;
    return nowTimestamp < START_DATE_MS;
  }, [state.role, ownerRelaunchServerReady, nowTimestamp]);

  const ownerRelaunchTransitionReady = state.role !== 'owner' || isBeforeOwnerRelaunch(nowTimestamp) || state.preparationCycleId === OWNER_RELAUNCH_CYCLE_ID;

  useEffect(() => {
    if (!state.isAuthenticated || state.role !== 'owner' || !ownerRelaunchServerReady || nowTimestamp < OWNER_RELAUNCH_START_MS) return;
    if (state.preparationCycleId === OWNER_RELAUNCH_CYCLE_ID) return;
    setState((prev) => createOwnerRelaunchCycle(prev, nowTimestamp));
    setSelectedDayNumberState(1);
    setSelectedDsaDayState(1);
    setSelectedAzureDayState(1);
    setAiResourcesTarget(null);
  }, [state.isAuthenticated, state.role, state.preparationCycleId, ownerRelaunchServerReady, nowTimestamp]);

  const lockTimeRemaining = useMemo(() => {
    const target = state.role === 'owner' ? OWNER_RELAUNCH_START_MS : START_DATE_MS;
    const diff = Math.max(0, target - nowTimestamp);
    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return { days, hours, minutes, seconds, totalMs: diff };
  }, [state.role, nowTimestamp]);

  // Current schedule day in Asia/Kolkata (Main: 1..180, Track: 1..100)
  const currentDayNumber = useMemo(() => {
    return getCurrentIstScheduleDay(nowTimestamp, MAIN_TRACK_MAX_DAYS, state.role === 'owner' ? OWNER_RELAUNCH_START_ISO_IST : DAILY_PREPARATION_START_ISO_IST);
  }, [nowTimestamp, state.role]);

  const currentTrackDayNumber = useMemo(() => {
    return getCurrentIstScheduleDay(nowTimestamp, SUB_TRACK_MAX_DAYS, state.role === 'owner' ? OWNER_RELAUNCH_START_ISO_IST : DAILY_PREPARATION_START_ISO_IST);
  }, [nowTimestamp, state.role]);

  const currentDaySchedule = useMemo(() => {
    const schedule = ALL_180_DAYS[currentDayNumber - 1] || ALL_180_DAYS[0];
    if (state.role !== 'owner') return schedule;
    const shifted = new Date(new Date(schedule.isoDate + 'T00:00:00Z').getTime() + 7 * 86_400_000);
    const isoDate = shifted.toISOString().slice(0, 10);
    const dateString = shifted.toLocaleDateString('en-GB', { timeZone: 'UTC', day: '2-digit', month: 'short', year: 'numeric' });
    return { ...schedule, isoDate, dateString };
  }, [currentDayNumber, state.role]);

  const isSaturdayToday = useMemo(() => {
    if (nowTimestamp < (state.role === 'owner' ? OWNER_RELAUNCH_START_MS : START_DATE_MS)) return false;
    const date = new Date(nowTimestamp);
    const weekday = date.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', weekday: 'long' });
    return weekday === 'Saturday';
  }, [nowTimestamp, state.role]);

  // Navigation & auth guard: all sections remain accessible whenever authenticated
  useEffect(() => {
    if (!state.isAuthenticated) {
      if (currentPage !== 'login') {
        setCurrentPage('login');
      }
    } else if (currentPage === 'login' || currentPage === 'lock_screen') {
      setCurrentPage('home_dashboard');
    }
  }, [state.isAuthenticated, currentPage]);

  // Timer engine — completely isolated per trackId
  useEffect(() => {
    if (!state.timerState.isActive || state.timerState.isPaused) return;

    const timerInterval = setInterval(() => {
      setState(prev => {
        if (!prev.timerState.isActive || prev.timerState.isPaused) return prev;

        const trackId: TrackId = prev.timerState.trackId || 'main';
        const newElapsed = prev.timerState.elapsedSeconds + 1;
        const newRemaining = Math.max(0, prev.timerState.targetSeconds - newElapsed);
        const dayNum = prev.timerState.dayNumber;

        let updatedMainTime = prev.studyTimeSeconds;
        let updatedDsaProgress = prev.dsaProgress;
        let updatedAzureProgress = prev.azureProgress;

        if (trackId === 'main') {
          updatedMainTime = {
            ...prev.studyTimeSeconds,
            [dayNum]: (prev.studyTimeSeconds[dayNum] || 0) + 1
          };
        } else if (trackId === 'dsa') {
          updatedDsaProgress = {
            ...prev.dsaProgress,
            studyTimeSeconds: {
              ...prev.dsaProgress.studyTimeSeconds,
              [dayNum]: (prev.dsaProgress.studyTimeSeconds[dayNum] || 0) + 1
            }
          };
        } else if (trackId === 'azure') {
          updatedAzureProgress = {
            ...prev.azureProgress,
            studyTimeSeconds: {
              ...prev.azureProgress.studyTimeSeconds,
              [dayNum]: (prev.azureProgress.studyTimeSeconds[dayNum] || 0) + 1
            }
          };
        }

        const nextTimerState: TimerState =
          newRemaining <= 0
            ? {
                ...prev.timerState,
                elapsedSeconds: newElapsed,
                remainingSeconds: 0,
                isActive: false,
                isPaused: false
              }
            : {
                ...prev.timerState,
                elapsedSeconds: newElapsed,
                remainingSeconds: newRemaining
              };

        // Log completion session when timer hits 0
        let updatedLogs = prev.studyLogs;
        if (newRemaining <= 0) {
          const completedLog: StudySessionLog = {
            id: `session_${trackId}_${dayNum}_${Date.now()}`,
            trackId,
            dayNumber: dayNum,
            date: new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' }),
            startTime: new Date(Date.now() - newElapsed * 1000).toISOString(),
            endTime: new Date().toISOString(),
            durationSeconds: newElapsed,
            type: prev.timerState.type === 'assessment' ? 'weekly_assessment' : 'daily_preparation',
            completedTasksCount: 0,
            notes: `${trackId.toUpperCase()} Day ${dayNum} timer completed`
          };
          updatedLogs = [completedLog, ...prev.studyLogs];
        }

        return {
          ...prev,
          studyTimeSeconds: updatedMainTime,
          dsaProgress: updatedDsaProgress,
          azureProgress: updatedAzureProgress,
          studyLogs: updatedLogs,
          timerState: nextTimerState
        };
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [state.timerState.isActive, state.timerState.isPaused]);

  // Main Plan Task completion calculation
  const getDayTaskCompletion = useCallback(
    (dayNum: number) => {
      const schedule = ALL_180_DAYS[dayNum - 1];
      if (!schedule) return { completed: 0, total: 1, percentage: 0 };

      const taskIds: string[] = [
        `${dayNum}_concept`,
        ...schedule.subtopics.map((_, i) => `${dayNum}_subtopic_${i}`),
        `${dayNum}_practical`,
        `${dayNum}_deliverable`,
        ...schedule.revisionTasks.map((_, i) => `${dayNum}_revision_${i}`)
      ];

      let completed = 0;
      taskIds.forEach(id => {
        if (state.completedTasks[id]) {
          completed++;
        }
      });

      const total = taskIds.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { completed, total, percentage };
    },
    [state.completedTasks]
  );

  const isDayUnlocked = useCallback(
    (dayNumber: number): boolean => {
      return isDayUnlockedByIstClock(dayNumber, nowTimestamp, MAIN_TRACK_MAX_DAYS, preparationStartForRole(state.role));
    },
    [nowTimestamp, state.role]
  );

  const isTrackDayUnlocked = useCallback(
    (track: TrackId, dayNumber: number): boolean => {
      const maxDay = track === 'main' ? MAIN_TRACK_MAX_DAYS : SUB_TRACK_MAX_DAYS;
      return isDayUnlockedByIstClock(dayNumber, nowTimestamp, maxDay, preparationStartForRole(state.role));
    },
    [nowTimestamp, state.role]
  );

  // Main Plan Status calculation (strict real-clock IST locking for both Owner & Guest)
  const getDayStatus = useCallback(
    (dayNum: number): DayStatus => {
      if (!isDayUnlockedByIstClock(dayNum, nowTimestamp, MAIN_TRACK_MAX_DAYS, preparationStartForRole(state.role))) {
        return 'locked';
      }

      const { completed, total } = getDayTaskCompletion(dayNum);
      const allDone = total > 0 && completed === total;

      if (allDone) {
        return 'completed';
      }

      if (dayNum < currentDayNumber) {
        return 'incomplete';
      }

      const studiedTime = state.studyTimeSeconds[dayNum] || 0;
      if (completed > 0 || studiedTime > 0) {
        return 'in-progress';
      }

      return 'not-started';
    },
    [nowTimestamp, currentDayNumber, getDayTaskCompletion, state.studyTimeSeconds, state.role]
  );

  // Unified per-track task completion helper
  const getTrackDayTaskCompletion = useCallback(
    (track: TrackId, dayNum: number) => {
      if (track === 'main') {
        return getDayTaskCompletion(dayNum);
      }

      const days = track === 'dsa' ? DSA_100_DAYS : AZURE_100_DAYS;
      const progress: TrackProgressState = track === 'dsa' ? state.dsaProgress : state.azureProgress;
      const schedule = days[dayNum - 1];
      if (!schedule) return { completed: 0, total: 1, percentage: 0 };

      let completed = 0;
      schedule.checklist.forEach(item => {
        if (progress?.completedTasks?.[item.id]) {
          completed++;
        }
      });

      const total = schedule.checklist.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { completed, total, percentage };
    },
    [getDayTaskCompletion, state.dsaProgress, state.azureProgress]
  );

  // Unified per-track status helper (strict real-clock IST locking for both Owner & Guest)
  const getTrackDayStatus = useCallback(
    (track: TrackId, dayNum: number): DayStatus => {
      if (track === 'main') {
        return getDayStatus(dayNum);
      }

      if (!isDayUnlockedByIstClock(dayNum, nowTimestamp, SUB_TRACK_MAX_DAYS, preparationStartForRole(state.role))) {
        return 'locked';
      }

      const { completed, total } = getTrackDayTaskCompletion(track, dayNum);
      const allDone = total > 0 && completed === total;
      if (allDone) {
        return 'completed';
      }

      if (dayNum < currentTrackDayNumber) {
        return 'incomplete';
      }

      const progress: TrackProgressState = track === 'dsa' ? state.dsaProgress : state.azureProgress;
      const studiedTime = progress?.studyTimeSeconds?.[dayNum] || 0;
      if (completed > 0 || studiedTime > 0) {
        return 'in-progress';
      }

      return 'not-started';
    },
    [
      getDayStatus,
      nowTimestamp,
      state.role,
      currentTrackDayNumber,
      getTrackDayTaskCompletion,
      state.dsaProgress,
      state.azureProgress
    ]
  );

  // Login (Supabase Auth + Server Registry verification for Owner when configured; Guest always local-only)
  const login = useCallback(
    async (user: string, pass: string, targetRole: UserRole): Promise<boolean> => {
      setLastAuthError(null);
      const trimmedUser = user.trim();
      const lowerUser = trimmedUser.toLowerCase();

      if (targetRole === 'owner') {
        // Never fall back to local transition verifier when Supabase env vars are partially/mis-configured
        if (hasPartialSupabaseEnv && (!isSupabaseConfigured || !supabase)) {
          setLastAuthError(
            !isAnonKeySafeForClient
              ? 'Security error: VITE_SUPABASE_ANON_KEY cannot contain a service_role or sb_secret key.'
              : 'Configuration error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is invalid or incomplete.'
          );
          return false;
        }

        if (isSupabaseConfigured && supabase) {
          const email = trimmedUser.includes('@')
            ? lowerUser
            : lowerUser === 'steeven' && configuredOwnerEmail
            ? configuredOwnerEmail.trim().toLowerCase()
            : '';

          if (!email) {
            setLastAuthError(
              'Enter your Owner Supabase Auth email address (or "Steeven" when VITE_OWNER_AUTH_EMAIL is configured).'
            );
            return false;
          }

          if (
            configuredOwnerEmail &&
            email !== configuredOwnerEmail.trim().toLowerCase()
          ) {
            setLastAuthError('This email does not match the configured Owner account.');
            return false;
          }

          if (
            configuredOwnerUserId &&
            !isConfiguredOwnerUserIdValid &&
            !isConfiguredOwnerUserIdPlaceholder
          ) {
            setLastAuthError(
              'Owner configuration error: VITE_OWNER_USER_ID must be a valid 36-character Supabase Auth UUID.'
            );
            return false;
          }

          if (isConfiguredOwnerUserIdPlaceholder && !configuredOwnerEmail) {
            setLastAuthError(
              'Owner configuration error: VITE_OWNER_AUTH_EMAIL is required when VITE_OWNER_USER_ID holds a template placeholder.'
            );
            return false;
          }

          authActionInProgressRef.current = true;
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password: pass
            });

            if (error || !data?.user || !data?.session) {
              setLastAuthError(
                error
                  ? classifySupabaseAuthError(error)
                  : 'Unable to establish an Owner Supabase Auth session.'
              );
              return false;
            }

            if (!isAuthorizedOwnerUser(data.user)) {
              explicitLogoutRef.current = true;
              await supabase.auth.signOut().finally(() => {
                explicitLogoutRef.current = false;
              });
              setLastAuthError(
                'Owner UUID mismatch: this Supabase account is not authorized as the Owner.'
              );
              return false;
            }

            const serverCheck = await verifyOwnerSessionWithServer(
              data.session.access_token,
              undefined,
              { requireStrictServer: requiresStrictServerOwnerVerification }
            );
            if (!serverCheck.authorized) {
              explicitLogoutRef.current = true;
              await supabase.auth.signOut().finally(() => {
                explicitLogoutRef.current = false;
              });
              setLastAuthError(
                serverCheck.error ||
                  'Owner registry authorization failed on the application server.'
              );
              return false;
            }

            ownerCloudUserIdRef.current = data.user.id;
            setLastAuthError(null);
            setIsOwnerSupabaseSessionActive(true);
            hydrateAuthenticatedOwnerLocalState(data.user.id);
            setCurrentPage('home_dashboard');
            return true;
          } catch (err) {
            setLastAuthError(classifySupabaseAuthError(err));
            return false;
          } finally {
            authActionInProgressRef.current = false;
          }
        }

        // Pre-Supabase local transition mode (strictly unavailable once Supabase Auth is configured)
        const ownerState = loadRoleStateSync('owner');
        const storedOwnerUser = (ownerState.username || 'Steeven').trim().toLowerCase();
        const isSteeven = lowerUser === 'steeven' || lowerUser === storedOwnerUser;
        if (!isSteeven) {
          setLastAuthError('Invalid Owner username.');
          return false;
        }

        const isPassValid = await verifyOwnerTransitionPassword(
          pass,
          ownerState.authVerifier,
          ownerState.passwordHash
        );
        if (!isPassValid) {
          setLastAuthError('Invalid Owner credentials.');
          return false;
        }

        // Migrate legacy stored password into non-plaintext verifier without altering any study progress
        if (ownerState.passwordHash && !ownerState.authVerifier) {
          ownerState.authVerifier = await computeOwnerTransitionVerifier(ownerState.passwordHash);
        }
        ownerState.passwordHash = '';
        ownerCloudUserIdRef.current = null;
        setIsOwnerSupabaseSessionActive(false);
        hydrateAuthenticatedOwnerLocalState(null);
        setCurrentPage('home_dashboard');
        return true;
      } else {
        // Guest is strictly local-only and never touches Supabase Auth or Owner storage
        const isGuest = lowerUser === 'guest';
        const isPassValid = await verifyGuestLocalPassword(pass);
        if (isGuest && isPassValid) {
          const hydrationGeneration = ++guestHydrationGenerationRef.current;
          const guestState = loadRoleStateSync('guest');
          guestState.isAuthenticated = true;
          guestState.passwordHash = '';
          ownerCloudUserIdRef.current = null;
          setIsOwnerSupabaseSessionActive(false);
          setState(guestState);
          setSelectedDayNumberState(guestState.lastActiveDayNumber || 1);
          setSelectedDsaDayState(guestState.dsaProgress?.lastActiveDayNumber || 1);
          setSelectedAzureDayState(guestState.azureProgress?.lastActiveDayNumber || 1);

          Promise.all([loadFromIndexedDB(GUEST_STORAGE_KEY), loadSharedContentAsync()]).then(
            ([dbGuest, latestShared]) => {
              if (hydrationGeneration !== guestHydrationGenerationRef.current) return;
              setState(prev => {
                if (prev.role !== 'guest' || !prev.isAuthenticated) return prev;
                const baseGuest =
                  dbGuest &&
                  dbGuest.lastSavedTimestamp &&
                  (!prev.lastSavedTimestamp || dbGuest.lastSavedTimestamp > prev.lastSavedTimestamp)
                    ? hydrateUserState({ ...dbGuest, passwordHash: '', isAuthenticated: true }, 'guest')
                    : prev;
                return mergeSharedContentIntoGuestState(baseGuest, latestShared);
              });
            }
          );

          setCurrentPage('home_dashboard');
          return true;
        }
        setLastAuthError('Invalid Guest preview credentials.');
        return false;
      }
    },
    [hydrateAuthenticatedOwnerLocalState]
  );

  const logout = useCallback(() => {
    guestHydrationGenerationRef.current += 1;
    explicitLogoutRef.current = true;
    ownerCloudUserIdRef.current = null;
    if (cloudSaveTimeoutRef.current) clearTimeout(cloudSaveTimeoutRef.current);
    setTestModeEnabled(false);
    setTestModeDate(null);
    setLastAuthError(null);
    setIsOwnerSupabaseSessionActive(false);

    setState(prev => {
      if (prev.isAuthenticated) {
        const pausedSnapshot = {
          ...prev,
          isAuthenticated: false,
          passwordHash: '',
          timerState: { ...prev.timerState, isActive: false, isPaused: false }
        };
        void saveRoleStatePermanent(pausedSnapshot);
      }
      return {
        ...DEFAULT_GUEST_STATE,
        isAuthenticated: false
      };
    });

    if (isSupabaseConfigured && supabase) {
      void supabase.auth.signOut().finally(() => {
        explicitLogoutRef.current = false;
      });
    } else {
      explicitLogoutRef.current = false;
    }
    setCurrentPage('login');
  }, []);

  const updateCredentials = useCallback(
    async (
      newUsername: string,
      newPassword?: string
    ): Promise<{ success: boolean; message: string }> => {
      if (state.role !== 'owner') {
        return { success: false, message: 'Guest mode cannot modify Owner credentials.' };
      }

      const trimmedName = newUsername.trim() || state.username || 'Steeven';

      if (isSupabaseConfigured && supabase) {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session) {
          return {
            success: false,
            message: 'Active Supabase Auth session required to update Owner password.'
          };
        }

        if (newPassword && newPassword.trim().length > 0) {
          if (newPassword.length < 8) {
            return {
              success: false,
              message: 'Supabase Auth passwords must be at least 8 characters long.'
            };
          }
          const { error } = await supabase.auth.updateUser({
            password: newPassword,
            data: { display_name: trimmedName }
          });
          if (error) {
            return { success: false, message: error.message };
          }
        } else {
          await supabase.auth.updateUser({ data: { display_name: trimmedName } });
        }

        setState(prev => ({
          ...prev,
          username: trimmedName,
          passwordHash: ''
        }));

        return {
          success: true,
          message: newPassword
            ? 'Owner password and profile updated in Supabase Auth.'
            : 'Owner display username updated.'
        };
      }

      // Local pre-Supabase transition mode: update display name and one-way SHA-256 verifier only (never plaintext)
      let nextVerifier = state.authVerifier;
      if (newPassword && newPassword.trim().length > 0) {
        nextVerifier = await computeOwnerTransitionVerifier(newPassword);
      }

      setState(prev => ({
        ...prev,
        username: trimmedName,
        passwordHash: '',
        authVerifier: nextVerifier
      }));

      return {
        success: true,
        message: newPassword
          ? 'Local transition verifier updated (Supabase Auth not yet configured).'
          : 'Display username updated.'
      };
    },
    [state.role, state.username, state.authVerifier]
  );

  // Main Plan Toggle task completion (guarded by strict real IST clock)
  const toggleTaskCompletion = useCallback((dayNum: number, taskId: string) => {
    if (!isDayUnlockedByIstClock(dayNum, getClockNow(), MAIN_TRACK_MAX_DAYS, preparationStartForRole(stateRef.current.role))) return;

    setState(prev => {
      const isCurrentlyDone = !!prev.completedTasks[taskId];
      const updatedTasks = {
        ...prev.completedTasks,
        [taskId]: !isCurrentlyDone
      };

      const schedule = ALL_180_DAYS[dayNum - 1];
      let allDone = false;
      if (schedule) {
        const allIds = [
          `${dayNum}_concept`,
          ...schedule.subtopics.map((_, i) => `${dayNum}_subtopic_${i}`),
          `${dayNum}_practical`,
          `${dayNum}_deliverable`,
          ...schedule.revisionTasks.map((_, i) => `${dayNum}_revision_${i}`)
        ];
        allDone = allIds.every(id => updatedTasks[id]);
      }

      return {
        ...prev,
        lastActiveDayNumber: dayNum,
        completedTasks: updatedTasks,
        completedDays: {
          ...prev.completedDays,
          [dayNum]: allDone
        }
      };
    });
  }, []);

  const saveDayNotes = useCallback((dayNum: number, notes: string) => {
    if (!isDayUnlockedByIstClock(dayNum, getClockNow(), MAIN_TRACK_MAX_DAYS, preparationStartForRole(stateRef.current.role))) return;

    setState(prev => ({
      ...prev,
      lastActiveDayNumber: dayNum,
      dayNotes: {
        ...prev.dayNotes,
        [dayNum]: notes
      }
    }));
  }, []);

  const isAssessmentWeekUnlocked = useCallback(
    (weekNumber: number): boolean => {
      return isAssessmentUnlockedByIstClock(weekNumber, nowTimestamp, preparationStartForRole(state.role));
    },
    [nowTimestamp, state.role]
  );

  const startAssessmentAttempt = useCallback(
    (weekNumber: number): { success: boolean; reason?: string } => {
      const nowMs = getClockNow();
      const startIso = preparationStartForRole(stateRef.current.role);
      if (!isAssessmentUnlockedByIstClock(weekNumber, nowMs, startIso)) {
        return {
          success: false,
          reason: 'This assessment is locked until 00:00 IST on its scheduled unlock date.'
        };
      }
      const unlocked = getUnlockedAssessmentForWeek(weekNumber, nowMs, startIso);
      if (!unlocked) {
        return { success: false, reason: 'Assessment data is unavailable.' };
      }

      const nowIso = new Date(nowMs).toISOString();
      setState(prev => {
        const existing = prev.activeAssessmentAttempt;
        if (existing && existing.weekNumber === weekNumber) {
          return {
            ...prev,
            activeAssessmentAttempt: {
              ...existing,
              lastUpdatedAt: nowIso
            }
          };
        }
        return {
          ...prev,
          activeAssessmentAttempt: {
            weekNumber,
            startedAt: nowIso,
            lastUpdatedAt: nowIso,
            answers: {},
            elapsedSeconds: 0,
            snapshot: buildAssessmentSnapshot(unlocked)
          }
        };
      });

      return { success: true };
    },
    [getClockNow]
  );

  const saveAssessmentDraftAnswer = useCallback(
    (weekNumber: number, questionId: string, value: string | number) => {
      const nowMs = getClockNow();
      if (!isAssessmentUnlockedByIstClock(weekNumber, nowMs, preparationStartForRole(stateRef.current.role))) return;

      setState(prev => {
        const attempt = prev.activeAssessmentAttempt;
        if (!attempt || attempt.weekNumber !== weekNumber) return prev;
        return {
          ...prev,
          activeAssessmentAttempt: {
            ...attempt,
            lastUpdatedAt: new Date(nowMs).toISOString(),
            answers: {
              ...attempt.answers,
              [questionId]: value
            }
          }
        };
      });
    },
    [getClockNow]
  );

  const updateAssessmentAttemptElapsed = useCallback(
    (weekNumber: number, elapsedSeconds: number) => {
      const nowMs = getClockNow();
      if (!isAssessmentUnlockedByIstClock(weekNumber, nowMs, preparationStartForRole(stateRef.current.role))) return;

      setState(prev => {
        const attempt = prev.activeAssessmentAttempt;
        if (!attempt || attempt.weekNumber !== weekNumber) return prev;
        return {
          ...prev,
          activeAssessmentAttempt: {
            ...attempt,
            elapsedSeconds: Math.max(0, Math.min(180 * 60, Math.round(elapsedSeconds)))
          }
        };
      });
    },
    [getClockNow]
  );

  const cancelAssessmentAttempt = useCallback((weekNumber?: number) => {
    setState(prev => {
      if (!prev.activeAssessmentAttempt) return prev;
      if (weekNumber !== undefined && prev.activeAssessmentAttempt.weekNumber !== weekNumber) {
        return prev;
      }
      return {
        ...prev,
        activeAssessmentAttempt: null
      };
    });
  }, []);

  const submitAssessment = useCallback(
    (submission: AssessmentSubmission): boolean => {
      const nowMs = getClockNow();
      const week = submission.weekNumber;
      const startIso = preparationStartForRole(stateRef.current.role);
      if (!isAssessmentUnlockedByIstClock(week, nowMs, startIso)) {
        return false;
      }

      const unlocked = getUnlockedAssessmentForWeek(week, nowMs, startIso);
      if (!unlocked) {
        return false;
      }

      const evaluatedSubmission = createEvaluatedSubmission({
        assessment: unlocked,
        answers: submission.answers || {},
        timeSpentSeconds: submission.timeSpentSeconds,
        reviewNotes: submission.reviewNotes,
        writtenSelfReviews: submission.writtenSelfReviews
      });

      setState(prev => {
        const updatedSubmissions = {
          ...prev.assessmentSubmissions,
          [week]: evaluatedSubmission
        };

        const newLog: StudySessionLog = {
          id: `assess_${week}_${Date.now()}`,
          trackId: 'main',
          dayNumber: unlocked.scheduledDayNumber || currentDayNumber,
          date: new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' }),
          startTime: new Date(Date.now() - evaluatedSubmission.timeSpentSeconds * 1000).toISOString(),
          endTime: new Date().toISOString(),
          durationSeconds: evaluatedSubmission.timeSpentSeconds,
          type: 'weekly_assessment',
          completedTasksCount: Object.keys(evaluatedSubmission.answers).length,
          notes: `Main Plan Week ${week} Assessment submitted: MCQ ${evaluatedSubmission.mcqScore}/${evaluatedSubmission.mcqMaxScore}, Rubric Review ${evaluatedSubmission.writtenReviewScore}/${evaluatedSubmission.writtenMaxScore}, Total ${evaluatedSubmission.score}/${evaluatedSubmission.maxScore} (${evaluatedSubmission.percentage}%)`
        };

        const shouldClearAttempt = prev.activeAssessmentAttempt?.weekNumber === week;

        return {
          ...prev,
          assessmentSubmissions: updatedSubmissions,
          activeAssessmentAttempt: shouldClearAttempt ? null : prev.activeAssessmentAttempt,
          studyLogs: [newLog, ...prev.studyLogs]
        };
      });

      return true;
    },
    [currentDayNumber, getClockNow]
  );

  const updateAssessmentRubricReview = useCallback(
    (
      weekNumber: number,
      selfReviews: Record<string, WrittenReviewStatus>,
      reviewNotes?: WeeklyReviewNotes
    ): boolean => {
      const nowMs = getClockNow();
      const startIso = preparationStartForRole(stateRef.current.role);
      if (!isAssessmentUnlockedByIstClock(weekNumber, nowMs, startIso)) {
        return false;
      }
      const unlocked = getUnlockedAssessmentForWeek(weekNumber, nowMs, startIso);
      if (!unlocked) return false;

      let updated = false;
      setState(prev => {
        const existing = prev.assessmentSubmissions[weekNumber];
        if (!existing) return prev;
        updated = true;

        const questions = existing.snapshot?.questions || unlocked.questions;
        const recomputed = applyRubricSelfReviewToSubmission(
          existing,
          questions,
          selfReviews,
          reviewNotes,
          unlocked.passThreshold
        );

        return {
          ...prev,
          assessmentSubmissions: {
            ...prev.assessmentSubmissions,
            [weekNumber]: recomputed
          }
        };
      });

      return updated;
    },
    [getClockNow]
  );

  const toggleAssessmentLeetCodeProblem = useCallback(
    (weekNumber: number, problemId: string): boolean => {
      const nowMs = getClockNow();
      const startIso = preparationStartForRole(stateRef.current.role);
      if (!isAssessmentUnlockedByIstClock(weekNumber, nowMs, startIso)) {
        return false;
      }
      const unlocked = getUnlockedAssessmentForWeek(weekNumber, nowMs, startIso);
      if (!unlocked || !unlocked.leetcodeProblems.some(p => p.id === problemId)) {
        return false;
      }

      setState(prev => {
        const curr = prev.leetcodeProgress?.[problemId];
        const nextCompleted = !curr?.completed;
        return {
          ...prev,
          leetcodeProgress: {
            ...(prev.leetcodeProgress || {}),
            [problemId]: {
              completed: nextCompleted,
              completedAt: nextCompleted ? new Date(nowMs).toISOString() : undefined,
              notes: curr?.notes || ''
            }
          }
        };
      });

      return true;
    },
    [getClockNow]
  );

  const saveAssessmentLeetCodeNotes = useCallback(
    (weekNumber: number, problemId: string, notes: string): boolean => {
      const nowMs = getClockNow();
      const startIso = preparationStartForRole(stateRef.current.role);
      if (!isAssessmentUnlockedByIstClock(weekNumber, nowMs, startIso)) {
        return false;
      }
      const unlocked = getUnlockedAssessmentForWeek(weekNumber, nowMs, startIso);
      if (!unlocked || !unlocked.leetcodeProblems.some(p => p.id === problemId)) {
        return false;
      }

      setState(prev => {
        const curr = prev.leetcodeProgress?.[problemId];
        return {
          ...prev,
          leetcodeProgress: {
            ...(prev.leetcodeProgress || {}),
            [problemId]: {
              completed: !!curr?.completed,
              completedAt: curr?.completedAt,
              notes
            }
          }
        };
      });

      return true;
    },
    [getClockNow]
  );

  // DSA & Azure Independent Track Actions (guarded by strict real IST clock)
  const toggleTrackTaskCompletion = useCallback(
    (track: 'dsa' | 'azure', dayNum: number, taskId: string) => {
      if (!isDayUnlockedByIstClock(dayNum, getClockNow(), SUB_TRACK_MAX_DAYS, preparationStartForRole(stateRef.current.role))) return;

      const days = track === 'dsa' ? DSA_100_DAYS : AZURE_100_DAYS;
      const schedule = days[dayNum - 1];

      setState(prev => {
        const currentTrack = track === 'dsa' ? prev.dsaProgress : prev.azureProgress;
        const isDone = !!currentTrack.completedTasks[taskId];
        const updatedTasks = {
          ...currentTrack.completedTasks,
          [taskId]: !isDone
        };

        const allDone = schedule ? schedule.checklist.every(item => !!updatedTasks[item.id]) : false;

        const nextTrackState: TrackProgressState = {
          ...currentTrack,
          lastActiveDayNumber: dayNum,
          completedTasks: updatedTasks,
          completedDays: {
            ...currentTrack.completedDays,
            [dayNum]: allDone
          }
        };

        return track === 'dsa'
          ? { ...prev, dsaProgress: nextTrackState }
          : { ...prev, azureProgress: nextTrackState };
      });
    },
    []
  );

  const saveTrackDayNotes = useCallback(
    (track: 'dsa' | 'azure', dayNum: number, notes: string) => {
      if (!isDayUnlockedByIstClock(dayNum, getClockNow(), SUB_TRACK_MAX_DAYS, preparationStartForRole(stateRef.current.role))) return;

      setState(prev => {
        const currentTrack = track === 'dsa' ? prev.dsaProgress : prev.azureProgress;
        const nextTrackState: TrackProgressState = {
          ...currentTrack,
          lastActiveDayNumber: dayNum,
          dayNotes: {
            ...currentTrack.dayNotes,
            [dayNum]: notes
          }
        };
        return track === 'dsa'
          ? { ...prev, dsaProgress: nextTrackState }
          : { ...prev, azureProgress: nextTrackState };
      });
    },
    []
  );

  const saveTrackRevisionRecord = useCallback(
    (
      track: 'dsa' | 'azure',
      weekNumber: number,
      record: Omit<TrackRevisionRecord, 'weekNumber' | 'completedAt'>
    ) => {
      const weekFirstDay = Math.max(1, (weekNumber - 1) * 7 + 1);
      if (!isDayUnlockedByIstClock(weekFirstDay, getClockNow(), SUB_TRACK_MAX_DAYS, preparationStartForRole(stateRef.current.role))) return;

      const fullRecord: TrackRevisionRecord = {
        ...record,
        weekNumber,
        completedAt: new Date().toISOString()
      };

      setState(prev => {
        const currentTrack = track === 'dsa' ? prev.dsaProgress : prev.azureProgress;
        const nextTrackState: TrackProgressState = {
          ...currentTrack,
          revisionRecords: {
            ...currentTrack.revisionRecords,
            [weekNumber]: fullRecord
          }
        };

        return track === 'dsa'
          ? { ...prev, dsaProgress: nextTrackState }
          : { ...prev, azureProgress: nextTrackState };
      });
    },
    []
  );

  // Timers (with track isolation, snapshot switching & strict real IST lock enforcement)
  const startTimer = useCallback(
    (
      dayNumber: number,
      durationMinutes?: number,
      type: 'daily' | 'assessment' = 'daily',
      trackId: TrackId = 'main'
    ) => {
      const maxDay = trackId === 'main' ? MAIN_TRACK_MAX_DAYS : SUB_TRACK_MAX_DAYS;
    if (!isDayUnlockedByIstClock(dayNumber, getClockNow(), maxDay, preparationStartForRole(stateRef.current.role))) return;

      let targetSeconds = (durationMinutes || 240) * 60;
      if (!durationMinutes) {
        if (trackId === 'main') {
          const schedule = ALL_180_DAYS[dayNumber - 1];
          targetSeconds = (schedule ? schedule.targetHours : 4) * 3600;
        } else if (trackId === 'dsa') {
          const schedule = DSA_100_DAYS[dayNumber - 1];
          targetSeconds = (schedule ? schedule.targetMinutes : 90) * 60;
        } else {
          const schedule = AZURE_100_DAYS[dayNumber - 1];
          targetSeconds = (schedule ? schedule.targetMinutes : 60) * 60;
        }
      }

      setState(prev => {
        const prevTrackId: TrackId = prev.timerState.trackId || 'main';
        const snapshots = { ...(prev.trackTimerSnapshots || {}) };

        // Save previous running timer snapshot if switching tracks
        if (prev.timerState.isActive && prevTrackId !== trackId) {
          snapshots[prevTrackId] = {
            ...prev.timerState,
            isPaused: true,
            pausedAtTimestamp: Date.now()
          };
        }

        // Log elapsed time from previous track session if it had significant progress and is being replaced on same track
        const nextLogs = [...prev.studyLogs];
        if (prev.timerState.isActive && prevTrackId === trackId && prev.timerState.elapsedSeconds >= 10) {
          nextLogs.unshift({
            id: `session_${prevTrackId}_${prev.timerState.dayNumber}_${Date.now()}`,
            trackId: prevTrackId,
            dayNumber: prev.timerState.dayNumber,
            date: new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' }),
            startTime: new Date(Date.now() - prev.timerState.elapsedSeconds * 1000).toISOString(),
            endTime: new Date().toISOString(),
            durationSeconds: prev.timerState.elapsedSeconds,
            type: prev.timerState.type === 'assessment' ? 'weekly_assessment' : 'daily_preparation',
            completedTasksCount: 0
          });
        }

        // Check if we have a paused snapshot for this track & day
        const existingSnap = snapshots[trackId];
        const useSnapshot = existingSnap && existingSnap.isActive && existingSnap.dayNumber === dayNumber;
        if (useSnapshot) {
          delete snapshots[trackId];
        }

        const nextTimer: TimerState = useSnapshot
          ? {
              ...existingSnap,
              isPaused: false,
              startedAtTimestamp: Date.now()
            }
          : {
              isActive: true,
              isPaused: false,
              trackId,
              dayNumber,
              targetSeconds,
              elapsedSeconds: 0,
              remainingSeconds: targetSeconds,
              startedAtTimestamp: Date.now(),
              type
            };

        return {
          ...prev,
          lastActiveDayNumber: trackId === 'main' ? dayNumber : prev.lastActiveDayNumber,
          dsaProgress:
            trackId === 'dsa'
              ? { ...prev.dsaProgress, lastActiveDayNumber: dayNumber }
              : prev.dsaProgress,
          azureProgress:
            trackId === 'azure'
              ? { ...prev.azureProgress, lastActiveDayNumber: dayNumber }
              : prev.azureProgress,
          trackTimerSnapshots: snapshots,
          studyLogs: nextLogs,
          timerState: nextTimer
        };
      });
    },
    []
  );

  const pauseTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      timerState: {
        ...prev.timerState,
        isPaused: true,
        pausedAtTimestamp: Date.now()
      }
    }));
  }, []);

  const resumeTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      timerState: {
        ...prev.timerState,
        isPaused: false,
        startedAtTimestamp: Date.now()
      }
    }));
  }, []);

  const resetTimer = useCallback(() => {
    setState(prev => {
      const nextLogs = [...prev.studyLogs];
      if (prev.timerState.elapsedSeconds >= 10) {
        const trackId: TrackId = prev.timerState.trackId || 'main';
        nextLogs.unshift({
          id: `session_${trackId}_${prev.timerState.dayNumber}_${Date.now()}`,
          trackId,
          dayNumber: prev.timerState.dayNumber,
          date: new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' }),
          startTime: new Date(Date.now() - prev.timerState.elapsedSeconds * 1000).toISOString(),
          endTime: new Date().toISOString(),
          durationSeconds: prev.timerState.elapsedSeconds,
          type: prev.timerState.type === 'assessment' ? 'weekly_assessment' : 'daily_preparation',
          completedTasksCount: 0
        });
      }

      return {
        ...prev,
        studyLogs: nextLogs,
        timerState: {
          ...prev.timerState,
          isActive: false,
          isPaused: false,
          elapsedSeconds: 0,
          remainingSeconds: prev.timerState.targetSeconds
        }
      };
    });
  }, []);

  // PDF Management (Owner Only)
  const uploadRoadmapPdf = useCallback(
    async (
      file: File
    ): Promise<{ success: boolean; message: string; pdfId?: string; record?: RoadmapPdfRecord }> => {
      if (file.type !== 'application/pdf') {
        return { success: false, message: 'Invalid file type. Only PDF documents (.pdf) are allowed.' };
      }

      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => {
          const dataUrl = e.target?.result as string;
          const isGuest = state.role === 'guest';
          const newId = isGuest
            ? `guest_pdf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
            : `pdf_${Date.now()}`;
          const newRecord: RoadmapPdfRecord = {
            id: newId,
            filename: file.name,
            fileSize: file.size,
            fileSizeBytesFormatted: `${(file.size / 1024).toFixed(1)} KB`,
            uploadTimestamp: new Date().toISOString(),
            ownerId: isGuest ? 'guest-preview' : 'steeven_owner',
            storagePath: isGuest ? `guest-preview/${file.name}` : `/uploaded_roadmaps/${file.name}`,
            fileUrl: dataUrl,
            version: (state.uploadedPdfs.length || 1) + 1,
            isActiveRoadmap: false,
            extractedSummary: {
              pages: 20,
              topicsCount: 180,
              coveragePct: 100.0
            }
          };

          setState(prev => {
            if (prev.role !== state.role) return prev;
            return {
              ...prev,
              uploadedPdfs: [newRecord, ...prev.uploadedPdfs]
            };
          });

          resolve({
            success: true,
            message: 'PDF uploaded and saved permanently.',
            pdfId: newId,
            record: newRecord
          });
        };

        reader.onerror = () => {
          resolve({ success: false, message: 'Failed to read file contents.' });
        };

        reader.readAsDataURL(file);
      });
    },
    [state.role, state.uploadedPdfs]
  );

  const setActivePdf = useCallback(
    (pdfId: string) => {
      if (state.role !== 'owner' && state.role !== 'guest') return;

      setState(prev => {
        if (prev.role !== state.role) return prev;
        return {
          ...prev,
          activePdfId: pdfId,
          uploadedPdfs: prev.uploadedPdfs.map(p => ({
            ...p,
            isActiveRoadmap: p.id === pdfId
          }))
        };
      });
    },
    [state.role]
  );

  const deletePdf = useCallback(
    (pdfId: string): boolean => {
      if (state.role !== 'owner' && state.role !== 'guest') return false;

      if (state.uploadedPdfs.length <= 1) return false;

      setState(prev => {
        if (prev.role !== state.role || prev.uploadedPdfs.length <= 1) return prev;
        const updated = prev.uploadedPdfs.filter(p => p.id !== pdfId);
        const nextActiveId = prev.activePdfId === pdfId ? updated[0].id : prev.activePdfId;

        return {
          ...prev,
          guestDeletedSharedPdfIds: prev.role === 'guest' && !pdfId.startsWith('guest_pdf_')
            ? Array.from(new Set([...(prev.guestDeletedSharedPdfIds || []), pdfId]))
            : prev.guestDeletedSharedPdfIds,
          uploadedPdfs: updated.map(p => ({
            ...p,
            isActiveRoadmap: p.id === nextActiveId
          })),
          activePdfId: nextActiveId
        };
      });
      return true;
    },
    [state.role, state.uploadedPdfs.length]
  );

  // Backup & Reset
  const exportBackup = useCallback(() => {
    exportBackupJson(state);
  }, [state]);

  const importBackup = useCallback(
    (jsonStr: string): boolean => {
      if (state.role !== 'owner') return false;
      const imported = importBackupJson(jsonStr);
      if (imported) {
        setState(imported);
        setSelectedDayNumberState(imported.lastActiveDayNumber || 1);
        setSelectedDsaDayState(imported.dsaProgress?.lastActiveDayNumber || 1);
        setSelectedAzureDayState(imported.azureProgress?.lastActiveDayNumber || 1);
        return true;
      }
      return false;
    },
    [state.role]
  );

  const resetGuestPreview = useCallback(async () => {
    if (stateRef.current.role !== 'guest' || guestResetInProgressRef.current) return;
    if (typeof window !== 'undefined' && !window.confirm('Reset Guest Preview? This clears all temporary Guest progress, notes, settings, resources, and uploaded PDFs. Owner data is not affected.')) return;
    guestResetInProgressRef.current = true;
    guestHydrationGenerationRef.current += 1;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    if (cloudSaveTimeoutRef.current) clearTimeout(cloudSaveTimeoutRef.current);
    try {
      const resetGuest = await resetGuestPreviewState();
      if (stateRef.current.role !== 'guest') return;
      setState(resetGuest);
      setSelectedDayNumberState(1);
      setSelectedDsaDayState(1);
      setSelectedAzureDayState(1);
      setAiResourcesTarget(null);
      setCurrentPage('home_dashboard');
    } catch {
      if (typeof window !== 'undefined') window.alert('Guest Preview could not be reset because browser storage did not confirm the save. Your current Guest data was kept. Please try again.');
    } finally {
      guestResetInProgressRef.current = false;
    }
  }, []);

  const resetAllData = useCallback(() => {
    if (state.role === 'owner') {
      const resetState = hydrateUserState({ ...DEFAULT_OWNER_STATE, isAuthenticated: true }, 'owner');
      setState(resetState);
      saveRoleStatePermanent(resetState);
      setSelectedDayNumberState(1);
      setSelectedDsaDayState(1);
      setSelectedAzureDayState(1);
    } else {
      resetGuestPreview();
    }
  }, [state.role, resetGuestPreview]);

  const setSimulationMode = useCallback(
    (enabled: boolean, isoDate?: string) => {
      if (state.role !== 'owner') return;
      setTestModeEnabled(enabled);
      setTestModeDate(enabled ? isoDate || '2026-11-16T09:00:00+05:30' : null);
    },
    [state.role]
  );

  const updateSharedSettings = useCallback(
    (updates: Partial<SharedAppSettings>): boolean => {
      if (state.role !== 'owner' && state.role !== 'guest') return false;
      setState(prev => {
        if (prev.role !== state.role) return prev;
        return {
          ...prev,
          guestSharedSettingsCustomized: prev.role === 'guest' ? true : prev.guestSharedSettingsCustomized,
          sharedSettings: {
            ...prev.sharedSettings,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        };
      });
      return true;
    },
    [state.role]
  );

  // Resource state is role-local; Guest mutations never update shared Owner content.
  const addResource = useCallback(
    (item: Omit<ResourceItem, 'id' | 'dateAdded'>): { success: boolean; message: string; id?: string } => {
      let validUrl = item.url.trim();
      if (!validUrl) {
        return { success: false, message: 'Resource URL is required.' };
      }
      if (!/^https?:\/\//i.test(validUrl)) {
        validUrl = 'https://' + validUrl;
      }
      try {
        new URL(validUrl);
      } catch {
        return { success: false, message: 'Please enter a valid URL (e.g. https://arxiv.org/abs/...)' };
      }

      const currentList = state.resources || [];
      const isDuplicate = currentList.some(r => r.url.toLowerCase().trim() === validUrl.toLowerCase());
      if (isDuplicate) {
        return { success: false, message: 'A resource with this URL already exists in your library.' };
      }

      const newId = `${state.role === 'guest' ? 'guest_res' : 'res'}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newResource: ResourceItem = {
        ...item,
        url: validUrl,
        id: newId,
        dateAdded: new Date().toISOString()
      };

      setState(prev => {
        if (prev.role !== state.role) return prev;
        return {
          ...prev,
          resources: [newResource, ...(prev.resources || [])]
        };
      });

      return { success: true, message: 'Resource saved successfully.', id: newId };
    },
    [state.role, state.resources]
  );

  const updateResource = useCallback(
    (id: string, updates: Partial<ResourceItem>): boolean => {
      if (state.role !== 'owner' && state.role !== 'guest') return false;
      const exists = (state.resources || []).some(r => r.id === id);
      if (!exists) return false;

      setState(prev => {
        if (prev.role !== state.role) return prev;
        const list = prev.resources || [];
        return {
          ...prev,
          resources: list.map(r => (r.id === id ? { ...r, ...updates } : r))
        };
      });
      return true;
    },
    [state.role, state.resources]
  );

  const deleteResource = useCallback(
    (id: string): boolean => {
      if (state.role !== 'owner' && state.role !== 'guest') return false;
      const exists = (state.resources || []).some(r => r.id === id);
      if (!exists) return false;

      setState(prev => {
        if (prev.role !== state.role) return prev;
        const list = prev.resources || [];
        return {
          ...prev,
          guestDeletedSharedResourceIds: prev.role === 'guest' && !id.startsWith('guest_res_')
            ? Array.from(new Set([...(prev.guestDeletedSharedResourceIds || []), id]))
            : prev.guestDeletedSharedResourceIds,
          resources: list.filter(r => r.id !== id)
        };
      });
      return true;
    },
    [state.role, state.resources]
  );

  const toggleResourceImportant = useCallback(
    (id: string) => {
      if (state.role !== 'owner' && state.role !== 'guest') return;
      setState(prev => {
        if (prev.role !== state.role) return prev;
        return {
          ...prev,
          resources: (prev.resources || []).map(r =>
            r.id === id ? { ...r, isImportant: !r.isImportant } : r
          )
        };
      });
    },
    [state.role]
  );

  const toggleResourceCompleted = useCallback(
    (id: string) => {
      if (state.role !== 'owner' && state.role !== 'guest') return;
      setState(prev => {
        if (prev.role !== state.role) return prev;
        return {
          ...prev,
          resources: (prev.resources || []).map(r =>
            r.id === id ? { ...r, isCompleted: !r.isCompleted } : r
          )
        };
      });
    },
    [state.role]
  );

  const saveResourceNotes = useCallback(
    (id: string, notes: string) => {
      if (state.role !== 'owner' && state.role !== 'guest') return;
      setState(prev => {
        if (prev.role !== state.role) return prev;
        return {
          ...prev,
          resources: (prev.resources || []).map(r =>
            r.id === id ? { ...r, personalNotes: notes } : r
          )
        };
      });
    },
    [state.role]
  );

  // ==========================================
  // DOUBT & ERROR NOTEBOOK ACTIONS
  // ==========================================
  const addDoubtEntry = useCallback(
    (entry: Omit<DoubtEntry, 'id' | 'dateCreated'>): { success: boolean; id: string } => {
      const newId = `doubt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newEntry: DoubtEntry = {
        ...entry,
        id: newId,
        dateCreated: new Date().toISOString()
      };

      setState(prev => ({
        ...prev,
        doubtEntries: [newEntry, ...(prev.doubtEntries || [])]
      }));

      return { success: true, id: newId };
    },
    []
  );

  const updateDoubtEntry = useCallback((id: string, updates: Partial<DoubtEntry>): boolean => {
    let success = false;
    setState(prev => {
      const list = prev.doubtEntries || [];
      const updated = list.map(d => {
        if (d.id === id) {
          success = true;
          return { ...d, ...updates };
        }
        return d;
      });
      return { ...prev, doubtEntries: updated };
    });
    return success;
  }, []);

  const deleteDoubtEntry = useCallback((id: string): boolean => {
    let success = false;
    setState(prev => {
      const list = prev.doubtEntries || [];
      const updated = list.filter(d => d.id !== id);
      success = updated.length !== list.length;
      return { ...prev, doubtEntries: updated };
    });
    return success;
  }, []);

  const setDoubtStatus = useCallback((id: string, status: DoubtStatus) => {
    setState(prev => ({
      ...prev,
      doubtEntries: (prev.doubtEntries || []).map(d => (d.id === id ? { ...d, status } : d))
    }));
  }, []);

  const toggleDoubtNeedsRevision = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      doubtEntries: (prev.doubtEntries || []).map(d =>
        d.id === id ? { ...d, needsRevision: !d.needsRevision } : d
      )
    }));
  }, []);

  const saveDoubtAdditionalNotes = useCallback((id: string, notes: string) => {
    setState(prev => ({
      ...prev,
      doubtEntries: (prev.doubtEntries || []).map(d =>
        d.id === id ? { ...d, additionalNotes: notes } : d
      )
    }));
  }, []);

  const value = useMemo(
    () => ({
      state,
      userRole: state.role,
      currentPage,
      setCurrentPage,
      selectedDayNumber,
      setSelectedDayNumber,
      selectedDsaDay,
      setSelectedDsaDay,
      selectedAzureDay,
      setSelectedAzureDay,
      openDayForTrack,
      aiResourcesTarget,
      openDailyAiResources,
      toggleDailyAiResourceCompletion,
      saveStatus,
      nowTimestamp,
      isPreparationLocked,
      ownerRelaunchServerReady,
      ownerRelaunchTransitionReady,
      lockTimeRemaining,
      currentDayNumber,
      currentTrackDayNumber,
      currentDaySchedule,
      isSaturdayToday,
      isDayUnlocked,
      isTrackDayUnlocked,
      getDayStatus,
      getDayTaskCompletion,
      getTrackDayStatus,
      getTrackDayTaskCompletion,
      login,
      logout,
      updateCredentials,
      isSupabaseAuthConfigured: isSupabaseConfigured,
      isOwnerSupabaseSessionActive,
      lastAuthError,
      clearAuthError,
      toggleTaskCompletion,
      saveDayNotes,
      submitAssessment,
      isAssessmentWeekUnlocked,
      startAssessmentAttempt,
      saveAssessmentDraftAnswer,
      updateAssessmentAttemptElapsed,
      cancelAssessmentAttempt,
      updateAssessmentRubricReview,
      toggleAssessmentLeetCodeProblem,
      saveAssessmentLeetCodeNotes,
      toggleTrackTaskCompletion,
      saveTrackDayNotes,
      saveTrackRevisionRecord,
      activeTimer: state.timerState,
      startTimer,
      pauseTimer,
      resumeTimer,
      resetTimer,
      uploadRoadmapPdf,
      setActivePdf,
      deletePdf,
      addResource,
      updateResource,
      deleteResource,
      toggleResourceImportant,
      toggleResourceCompleted,
      saveResourceNotes,
      updateSharedSettings,
      refreshSharedContent,
      addDoubtEntry,
      updateDoubtEntry,
      deleteDoubtEntry,
      setDoubtStatus,
      toggleDoubtNeedsRevision,
      saveDoubtAdditionalNotes,
      exportBackup,
      importBackup,
      resetAllData,
      resetGuestPreview,
      testModeEnabled,
      testModeDate,
      setSimulationMode
    }),
    [
      state,
      currentPage,
      selectedDayNumber,
      setSelectedDayNumber,
      selectedDsaDay,
      setSelectedDsaDay,
      selectedAzureDay,
      setSelectedAzureDay,
      openDayForTrack,
      aiResourcesTarget,
      openDailyAiResources,
      toggleDailyAiResourceCompletion,
      saveStatus,
      nowTimestamp,
      isPreparationLocked,
      ownerRelaunchServerReady,
      ownerRelaunchTransitionReady,
      lockTimeRemaining,
      currentDayNumber,
      currentTrackDayNumber,
      currentDaySchedule,
      isSaturdayToday,
      isDayUnlocked,
      isTrackDayUnlocked,
      getDayStatus,
      getDayTaskCompletion,
      getTrackDayStatus,
      getTrackDayTaskCompletion,
      login,
      logout,
      updateCredentials,
      isOwnerSupabaseSessionActive,
      lastAuthError,
      toggleTaskCompletion,
      saveDayNotes,
      submitAssessment,
      isAssessmentWeekUnlocked,
      startAssessmentAttempt,
      saveAssessmentDraftAnswer,
      updateAssessmentAttemptElapsed,
      cancelAssessmentAttempt,
      updateAssessmentRubricReview,
      toggleAssessmentLeetCodeProblem,
      saveAssessmentLeetCodeNotes,
      toggleTrackTaskCompletion,
      saveTrackDayNotes,
      saveTrackRevisionRecord,
      startTimer,
      pauseTimer,
      resumeTimer,
      resetTimer,
      uploadRoadmapPdf,
      setActivePdf,
      deletePdf,
      addResource,
      updateResource,
      deleteResource,
      toggleResourceImportant,
      toggleResourceCompleted,
      saveResourceNotes,
      updateSharedSettings,
      refreshSharedContent,
      addDoubtEntry,
      updateDoubtEntry,
      deleteDoubtEntry,
      setDoubtStatus,
      toggleDoubtNeedsRevision,
      saveDoubtAdditionalNotes,
      exportBackup,
      importBackup,
      resetAllData,
      resetGuestPreview,
      testModeEnabled,
      testModeDate,
      setSimulationMode
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
