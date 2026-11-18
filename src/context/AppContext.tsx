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
  SUB_TRACK_MAX_DAYS
} from '../utils/dailyLock';
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
  subscribeToSharedContentUpdates,
  resetGuestPreviewState,
  extractSharedContentFromOwner,
  saveSharedContent
} from '../services/storage';
import {
  configuredOwnerEmail,
  configuredOwnerUserId,
  isSupabaseConfigured,
  supabase
} from '../lib/supabase';
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

  // PDF Management (Owner Only)
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
  const [testModeEnabled, setTestModeEnabled] = useState<boolean>(false);
  const [testModeDate, setTestModeDate] = useState<string | null>(null);
  const [isOwnerSupabaseSessionActive, setIsOwnerSupabaseSessionActive] = useState<boolean>(false);
  const [lastAuthError, setLastAuthError] = useState<string | null>(null);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hydrateAuthenticatedOwnerLocalState = useCallback(() => {
    const ownerState = loadRoleStateSync('owner');
    ownerState.isAuthenticated = true;
    ownerState.passwordHash = '';
    setState(ownerState);
    setSelectedDayNumberState(ownerState.lastActiveDayNumber || 1);
    setSelectedDsaDayState(ownerState.dsaProgress?.lastActiveDayNumber || 1);
    setSelectedAzureDayState(ownerState.azureProgress?.lastActiveDayNumber || 1);

    loadFromIndexedDB(OWNER_STORAGE_KEY).then(async dbOwner => {
      if (
        dbOwner &&
        dbOwner.lastSavedTimestamp &&
        (!ownerState.lastSavedTimestamp || dbOwner.lastSavedTimestamp > ownerState.lastSavedTimestamp)
      ) {
        const hydrated = hydrateUserState(
          { ...dbOwner, passwordHash: '', isAuthenticated: true },
          'owner'
        );
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
    });
  }, []);

  // Restore existing Supabase Auth Owner session cleanly if configured (never touches Guest)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    let mounted = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted || error || !data?.session?.user) return;
      if (configuredOwnerUserId && data.session.user.id !== configuredOwnerUserId) {
        void supabase?.auth.signOut();
        return;
      }
      setIsOwnerSupabaseSessionActive(true);
      hydrateAuthenticatedOwnerLocalState();
      setCurrentPage(prev => (prev === 'login' ? 'home_dashboard' : prev));
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_OUT' || !session) {
        setIsOwnerSupabaseSessionActive(false);
        setState(prev => {
          if (prev.role === 'owner' && prev.isAuthenticated) {
            return { ...DEFAULT_GUEST_STATE, isAuthenticated: false };
          }
          return prev;
        });
        setCurrentPage(prev => (prev === 'login' ? prev : 'login'));
      } else if (session.user) {
        if (configuredOwnerUserId && session.user.id !== configuredOwnerUserId) {
          setIsOwnerSupabaseSessionActive(false);
          return;
        }
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
      return applySharedContentToGuestState(prev, latestShared);
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

  // Permanent Auto-Save on state changes
  useEffect(() => {
    if (!state.isAuthenticated) return;

    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      const ok = await saveRoleStatePermanent(state);
      setSaveStatus(ok ? 'saved' : 'error');
    }, 250);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [state]);

  // Keep live second tick
  useEffect(() => {
    const interval = setInterval(() => {
      setNowTimestamp(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Strict real-clock IST lock status (identical for Owner & Guest, cannot be bypassed by TEST MODE)
  const isPreparationLocked = useMemo(() => {
    return nowTimestamp < START_DATE_MS;
  }, [nowTimestamp]);

  const lockTimeRemaining = useMemo(() => {
    const diff = Math.max(0, START_DATE_MS - nowTimestamp);
    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return { days, hours, minutes, seconds, totalMs: diff };
  }, [nowTimestamp]);

  // Current schedule day in Asia/Kolkata (Main: 1..180, Track: 1..100)
  const currentDayNumber = useMemo(() => {
    return getCurrentIstScheduleDay(nowTimestamp, MAIN_TRACK_MAX_DAYS);
  }, [nowTimestamp]);

  const currentTrackDayNumber = useMemo(() => {
    return getCurrentIstScheduleDay(nowTimestamp, SUB_TRACK_MAX_DAYS);
  }, [nowTimestamp]);

  const currentDaySchedule = useMemo(() => {
    return ALL_180_DAYS[currentDayNumber - 1] || ALL_180_DAYS[0];
  }, [currentDayNumber]);

  const isSaturdayToday = useMemo(() => {
    if (nowTimestamp < START_DATE_MS) return false;
    const date = new Date(nowTimestamp);
    const weekday = date.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', weekday: 'long' });
    return weekday === 'Saturday';
  }, [nowTimestamp]);

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
      return isDayUnlockedByIstClock(dayNumber, nowTimestamp, MAIN_TRACK_MAX_DAYS);
    },
    [nowTimestamp]
  );

  const isTrackDayUnlocked = useCallback(
    (track: TrackId, dayNumber: number): boolean => {
      const maxDay = track === 'main' ? MAIN_TRACK_MAX_DAYS : SUB_TRACK_MAX_DAYS;
      return isDayUnlockedByIstClock(dayNumber, nowTimestamp, maxDay);
    },
    [nowTimestamp]
  );

  // Main Plan Status calculation (strict real-clock IST locking for both Owner & Guest)
  const getDayStatus = useCallback(
    (dayNum: number): DayStatus => {
      if (!isDayUnlockedByIstClock(dayNum, nowTimestamp, MAIN_TRACK_MAX_DAYS)) {
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
    [nowTimestamp, currentDayNumber, getDayTaskCompletion, state.studyTimeSeconds]
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

      if (!isDayUnlockedByIstClock(dayNum, nowTimestamp, SUB_TRACK_MAX_DAYS)) {
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
      currentTrackDayNumber,
      getTrackDayTaskCompletion,
      state.dsaProgress,
      state.azureProgress
    ]
  );

  // Login (Supabase Auth for Owner when configured; local transition verifier only when unconfigured; Guest always local-only)
  const login = useCallback(
    async (user: string, pass: string, targetRole: UserRole): Promise<boolean> => {
      setLastAuthError(null);
      const trimmedUser = user.trim();
      const lowerUser = trimmedUser.toLowerCase();

      if (targetRole === 'owner') {
        if (isSupabaseConfigured && supabase) {
          const email = trimmedUser.includes('@')
            ? trimmedUser
            : lowerUser === 'steeven' && configuredOwnerEmail
            ? configuredOwnerEmail
            : '';

          if (!email) {
            setLastAuthError(
              'Enter your Owner Supabase Auth email address (or configure VITE_OWNER_AUTH_EMAIL).'
            );
            return false;
          }

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: pass
          });

          if (error || !data?.user || !data?.session) {
            setLastAuthError('Invalid Owner Supabase Auth credentials or account not yet created.');
            return false;
          }

          if (configuredOwnerUserId && data.user.id !== configuredOwnerUserId) {
            await supabase.auth.signOut();
            setLastAuthError('This Supabase account is not authorized as the Owner.');
            return false;
          }

          setIsOwnerSupabaseSessionActive(true);
          hydrateAuthenticatedOwnerLocalState();
          setCurrentPage('home_dashboard');
          return true;
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
        setIsOwnerSupabaseSessionActive(false);
        hydrateAuthenticatedOwnerLocalState();
        setCurrentPage('home_dashboard');
        return true;
      } else {
        // Guest is strictly local-only and never touches Supabase Auth or Owner storage
        const isGuest = lowerUser === 'guest';
        const isPassValid = await verifyGuestLocalPassword(pass);
        if (isGuest && isPassValid) {
          const guestState = loadRoleStateSync('guest');
          guestState.isAuthenticated = true;
          guestState.passwordHash = '';
          setIsOwnerSupabaseSessionActive(false);
          setState(guestState);
          setSelectedDayNumberState(guestState.lastActiveDayNumber || 1);
          setSelectedDsaDayState(guestState.dsaProgress?.lastActiveDayNumber || 1);
          setSelectedAzureDayState(guestState.azureProgress?.lastActiveDayNumber || 1);

          Promise.all([loadFromIndexedDB(GUEST_STORAGE_KEY), loadSharedContentAsync()]).then(
            ([dbGuest, latestShared]) => {
              setState(prev => {
                if (prev.role !== 'guest' || !prev.isAuthenticated) return prev;
                const baseGuest =
                  dbGuest &&
                  dbGuest.lastSavedTimestamp &&
                  (!prev.lastSavedTimestamp || dbGuest.lastSavedTimestamp > prev.lastSavedTimestamp)
                    ? hydrateUserState({ ...dbGuest, passwordHash: '', isAuthenticated: true }, 'guest')
                    : prev;
                return applySharedContentToGuestState(baseGuest, latestShared);
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
      void supabase.auth.signOut();
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
    if (!isDayUnlockedByIstClock(dayNum, Date.now(), MAIN_TRACK_MAX_DAYS)) return;

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
    if (!isDayUnlockedByIstClock(dayNum, Date.now(), MAIN_TRACK_MAX_DAYS)) return;

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
      return isAssessmentUnlockedByIstClock(weekNumber, nowTimestamp);
    },
    [nowTimestamp]
  );

  const startAssessmentAttempt = useCallback(
    (weekNumber: number): { success: boolean; reason?: string } => {
      const nowMs = Date.now();
      if (!isAssessmentUnlockedByIstClock(weekNumber, nowMs)) {
        return {
          success: false,
          reason: 'This assessment is locked until 00:00 IST on its scheduled unlock date.'
        };
      }
      const unlocked = getUnlockedAssessmentForWeek(weekNumber, nowMs);
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
    []
  );

  const saveAssessmentDraftAnswer = useCallback(
    (weekNumber: number, questionId: string, value: string | number) => {
      const nowMs = Date.now();
      if (!isAssessmentUnlockedByIstClock(weekNumber, nowMs)) return;

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
    []
  );

  const updateAssessmentAttemptElapsed = useCallback(
    (weekNumber: number, elapsedSeconds: number) => {
      const nowMs = Date.now();
      if (!isAssessmentUnlockedByIstClock(weekNumber, nowMs)) return;

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
    []
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
      const nowMs = Date.now();
      const week = submission.weekNumber;
      if (!isAssessmentUnlockedByIstClock(week, nowMs)) {
        return false;
      }

      const unlocked = getUnlockedAssessmentForWeek(week, nowMs);
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
    [currentDayNumber]
  );

  const updateAssessmentRubricReview = useCallback(
    (
      weekNumber: number,
      selfReviews: Record<string, WrittenReviewStatus>,
      reviewNotes?: WeeklyReviewNotes
    ): boolean => {
      const nowMs = Date.now();
      if (!isAssessmentUnlockedByIstClock(weekNumber, nowMs)) {
        return false;
      }
      const unlocked = getUnlockedAssessmentForWeek(weekNumber, nowMs);
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
    []
  );

  const toggleAssessmentLeetCodeProblem = useCallback(
    (weekNumber: number, problemId: string): boolean => {
      const nowMs = Date.now();
      if (!isAssessmentUnlockedByIstClock(weekNumber, nowMs)) {
        return false;
      }
      const unlocked = getUnlockedAssessmentForWeek(weekNumber, nowMs);
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
    []
  );

  const saveAssessmentLeetCodeNotes = useCallback(
    (weekNumber: number, problemId: string, notes: string): boolean => {
      const nowMs = Date.now();
      if (!isAssessmentUnlockedByIstClock(weekNumber, nowMs)) {
        return false;
      }
      const unlocked = getUnlockedAssessmentForWeek(weekNumber, nowMs);
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
    []
  );

  // DSA & Azure Independent Track Actions (guarded by strict real IST clock)
  const toggleTrackTaskCompletion = useCallback(
    (track: 'dsa' | 'azure', dayNum: number, taskId: string) => {
      if (!isDayUnlockedByIstClock(dayNum, Date.now(), SUB_TRACK_MAX_DAYS)) return;

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
      if (!isDayUnlockedByIstClock(dayNum, Date.now(), SUB_TRACK_MAX_DAYS)) return;

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
      if (!isDayUnlockedByIstClock(weekFirstDay, Date.now(), SUB_TRACK_MAX_DAYS)) return;

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
      if (!isDayUnlockedByIstClock(dayNumber, Date.now(), maxDay)) return;

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
      if (state.role !== 'owner') {
        return { success: false, message: 'Only Steeven (Owner) has permission to upload roadmap PDFs.' };
      }

      if (file.type !== 'application/pdf') {
        return { success: false, message: 'Invalid file type. Only PDF documents (.pdf) are allowed.' };
      }

      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => {
          const dataUrl = e.target?.result as string;
          const newId = `pdf_${Date.now()}`;
          const newRecord: RoadmapPdfRecord = {
            id: newId,
            filename: file.name,
            fileSize: file.size,
            fileSizeBytesFormatted: `${(file.size / 1024).toFixed(1)} KB`,
            uploadTimestamp: new Date().toISOString(),
            ownerId: 'steeven_owner',
            storagePath: `/uploaded_roadmaps/${file.name}`,
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
            if (prev.role !== 'owner') return prev;
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
      if (state.role !== 'owner') return;

      setState(prev => {
        if (prev.role !== 'owner') return prev;
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
      if (state.role !== 'owner') return false;

      if (state.uploadedPdfs.length <= 1) return false;

      setState(prev => {
        if (prev.role !== 'owner' || prev.uploadedPdfs.length <= 1) return prev;
        const updated = prev.uploadedPdfs.filter(p => p.id !== pdfId);
        const nextActiveId = prev.activePdfId === pdfId ? updated[0].id : prev.activePdfId;

        return {
          ...prev,
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

  const resetGuestPreview = useCallback(() => {
    const resetGuest = resetGuestPreviewState();
    setState(resetGuest);
    setSelectedDayNumberState(1);
    setSelectedDsaDayState(1);
    setSelectedAzureDayState(1);
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
      if (state.role !== 'owner') return false;
      setState(prev => {
        if (prev.role !== 'owner') return prev;
        return {
          ...prev,
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

  // ==========================================
  // RESOURCE LIBRARY ACTIONS (OWNER ONLY MUTATIONS)
  // ==========================================
  const addResource = useCallback(
    (item: Omit<ResourceItem, 'id' | 'dateAdded'>): { success: boolean; message: string; id?: string } => {
      if (state.role !== 'owner') {
        return {
          success: false,
          message: 'Read-only in Guest mode: only Steeven (Owner) can modify the Resource Library.'
        };
      }

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

      const newId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newResource: ResourceItem = {
        ...item,
        url: validUrl,
        id: newId,
        dateAdded: new Date().toISOString()
      };

      setState(prev => {
        if (prev.role !== 'owner') return prev;
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
      if (state.role !== 'owner') return false;
      const exists = (state.resources || []).some(r => r.id === id);
      if (!exists) return false;

      setState(prev => {
        if (prev.role !== 'owner') return prev;
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
      if (state.role !== 'owner') return false;
      const exists = (state.resources || []).some(r => r.id === id);
      if (!exists) return false;

      setState(prev => {
        if (prev.role !== 'owner') return prev;
        const list = prev.resources || [];
        return {
          ...prev,
          resources: list.filter(r => r.id !== id)
        };
      });
      return true;
    },
    [state.role, state.resources]
  );

  const toggleResourceImportant = useCallback(
    (id: string) => {
      if (state.role !== 'owner') return;
      setState(prev => {
        if (prev.role !== 'owner') return prev;
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
      if (state.role !== 'owner') return;
      setState(prev => {
        if (prev.role !== 'owner') return prev;
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
      if (state.role !== 'owner') return;
      setState(prev => {
        if (prev.role !== 'owner') return prev;
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
