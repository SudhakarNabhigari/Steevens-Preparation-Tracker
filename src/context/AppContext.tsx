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
  TrackRevisionRecord
} from '../types';
import {
  ALL_180_DAYS,
  START_DATE_IST
} from '../data/syllabus';
import { DSA_100_DAYS } from '../data/dsaSyllabus';
import { AZURE_100_DAYS } from '../data/azureSyllabus';
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
  importBackupJson
} from '../services/storage';
import { supabase } from '../lib/supabase';
import { migrateLegacyRoadmapPdfs, deleteRoadmapPdfFromStorage } from '../services/roadmapPdfStorage';
import {
  OWNER_AUTH_EMAIL,
  loadOrMigrateOwnerProgress,
  saveOwnerProgressToCloud
} from '../services/cloudProgress';

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
  | 'preparation_calendar';

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
  saveStatus: SaveStatus;

  // Real clock & lock state
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

  // Day status helpers
  getDayStatus: (dayNumber: number) => DayStatus;
  getDayTaskCompletion: (dayNumber: number) => { completed: number; total: number; percentage: number };
  getTrackDayStatus: (track: TrackId, dayNumber: number) => DayStatus;
  getTrackDayTaskCompletion: (track: TrackId, dayNumber: number) => { completed: number; total: number; percentage: number };

  // Authentication
  login: (username: string, pass: string, targetRole: UserRole) => Promise<boolean>;
  logout: () => void;
  updateCredentials: (username: string, password: string) => void;

  // Main Plan Task & Notes Actions
  toggleTaskCompletion: (dayNumber: number, taskId: string) => void;
  saveDayNotes: (dayNumber: number, notes: string) => void;
  submitAssessment: (submission: AssessmentSubmission) => void;

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

  // PDF Management
  uploadRoadmapPdf: (file: File) => Promise<{ success: boolean; message: string; pdfId?: string }>;
  setActivePdf: (pdfId: string) => void;
  deletePdf: (pdfId: string) => Promise<boolean>;

  // Resource Library Actions
  addResource: (item: Omit<ResourceItem, 'id' | 'dateAdded'>) => { success: boolean; message: string; id?: string };
  updateResource: (id: string, updates: Partial<ResourceItem>) => boolean;
  deleteResource: (id: string) => boolean;
  toggleResourceImportant: (id: string) => void;
  toggleResourceCompleted: (id: string) => void;
  saveResourceNotes: (id: string, notes: string) => void;

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

  // Date Simulation (Owner testing)
  setSimulationMode: (enabled: boolean, isoDate?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const START_DATE_MS = new Date(START_DATE_IST).getTime();

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UserState>(() => loadRoleStateSync('owner'));
  const [currentPage, setCurrentPage] = useState<NavigationPage>('login');
  const [selectedDayNumber, setSelectedDayNumberState] = useState<number>(() => state.lastActiveDayNumber || 1);
  const [selectedDsaDay, setSelectedDsaDayState] = useState<number>(
    () => state.dsaProgress?.lastActiveDayNumber || 1
  );
  const [selectedAzureDay, setSelectedAzureDayState] = useState<number>(
    () => state.azureProgress?.lastActiveDayNumber || 1
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [nowTimestamp, setNowTimestamp] = useState<number>(Date.now());

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ownerAuthUserIdRef = useRef<string | null>(null);
  const loginInProgressRef = useRef(false);

  // Rehydrate asynchronously from IndexedDB for maximum permanent persistence
  useEffect(() => {
    async function rehydrateFromDB() {
      const key = state.role === 'owner' ? OWNER_STORAGE_KEY : GUEST_STORAGE_KEY;
      const dbData = await loadFromIndexedDB(key);
      if (loginInProgressRef.current || ownerAuthUserIdRef.current) return;
      if (
        dbData &&
        dbData.lastSavedTimestamp &&
        (!state.lastSavedTimestamp || dbData.lastSavedTimestamp > state.lastSavedTimestamp)
      ) {
        const hydrated = hydrateUserState(dbData, state.role);
        setState(hydrated);
        if (hydrated.lastActiveDayNumber) {
          setSelectedDayNumberState(hydrated.lastActiveDayNumber);
        }
        if (hydrated.dsaProgress?.lastActiveDayNumber) {
          setSelectedDsaDayState(hydrated.dsaProgress.lastActiveDayNumber);
        }
        if (hydrated.azureProgress?.lastActiveDayNumber) {
          setSelectedAzureDayState(hydrated.azureProgress.lastActiveDayNumber);
        }
      }
    }
    rehydrateFromDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Permanent local save + Supabase cloud save
  useEffect(() => {
    if (!state.isAuthenticated) return;

    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      const localOk = await saveRoleStatePermanent({ ...state });
      let cloudOk = true;

      if (state.role === 'owner' && ownerAuthUserIdRef.current) {
        try {
          await saveOwnerProgressToCloud(ownerAuthUserIdRef.current, state);
        } catch (error) {
          console.error('Supabase progress save failed:', error);
          cloudOk = false;
        }
      }

      setSaveStatus(localOk && cloudOk ? 'saved' : 'error');
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

  // Determine effective current time
  const effectiveTimeMs = useMemo(() => {
    if (state.role === 'owner' && state.simulationEnabled && state.simulationDate) {
      return new Date(state.simulationDate).getTime();
    }
    return nowTimestamp;
  }, [state.role, state.simulationEnabled, state.simulationDate, nowTimestamp]);

  // Lock status calculation
  const isPreparationLocked = useMemo(() => {
    if (state.role === 'guest') {
      return false;
    }
    return effectiveTimeMs < START_DATE_MS;
  }, [state.role, effectiveTimeMs]);

  const lockTimeRemaining = useMemo(() => {
    const diff = Math.max(0, START_DATE_MS - effectiveTimeMs);
    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return { days, hours, minutes, seconds, totalMs: diff };
  }, [effectiveTimeMs]);

  // Current day calculation (Main: 1..180, Track: 1..100)
  const currentDayNumber = useMemo(() => {
    if (state.role === 'owner' && isPreparationLocked) return 1;
    if (state.role === 'guest') return state.lastActiveDayNumber || 1;
    const diffMs = effectiveTimeMs - START_DATE_MS;
    const day = Math.floor(diffMs / (24 * 3600 * 1000)) + 1;
    return Math.min(180, Math.max(1, day));
  }, [state.role, isPreparationLocked, effectiveTimeMs, state.lastActiveDayNumber]);

  const currentTrackDayNumber = useMemo(() => {
    if (state.role === 'owner' && isPreparationLocked) return 1;
    if (state.role === 'guest') return 1;
    const diffMs = effectiveTimeMs - START_DATE_MS;
    const day = Math.floor(diffMs / (24 * 3600 * 1000)) + 1;
    return Math.min(100, Math.max(1, day));
  }, [state.role, isPreparationLocked, effectiveTimeMs]);

  const currentDaySchedule = useMemo(() => {
    return ALL_180_DAYS[currentDayNumber - 1] || ALL_180_DAYS[0];
  }, [currentDayNumber]);

  const isSaturdayToday = useMemo(() => {
    const date = new Date(effectiveTimeMs);
    const weekday = date.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', weekday: 'long' });
    return weekday === 'Saturday';
  }, [effectiveTimeMs]);

  // Route protection
  useEffect(() => {
    const allowedWhileLocked: NavigationPage[] = [
      'lock_screen',
      'settings',
      'original_roadmap',
      'roadmap_pdf',
      'preparation_calendar',
      'all_days',
      'weekly_progress',
      'study_history',
      'resource_library',
      'doubt_notebook'
    ];

    if (!state.isAuthenticated) {
      setCurrentPage('login');
    } else if (state.role === 'owner' && isPreparationLocked && !allowedWhileLocked.includes(currentPage)) {
      setCurrentPage('lock_screen');
    } else if (currentPage === 'login' || (currentPage === 'lock_screen' && !isPreparationLocked)) {
      setCurrentPage('home_dashboard');
    }
  }, [state.isAuthenticated, state.role, isPreparationLocked, currentPage]);

  // Timer engine - completely isolated per trackId
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

  // Main Plan Status calculation
  const getDayStatus = useCallback(
    (dayNum: number): DayStatus => {
      if (state.role === 'owner' && isPreparationLocked) {
        return 'locked';
      }

      if (state.role === 'owner' && dayNum > currentDayNumber) {
        return 'locked';
      }

      const { completed, total } = getDayTaskCompletion(dayNum);
      const allDone = total > 0 && completed === total;

      if (allDone) {
        return 'completed';
      }

      if (state.role === 'owner' && dayNum < currentDayNumber) {
        return 'incomplete';
      }

      const studiedTime = state.studyTimeSeconds[dayNum] || 0;
      if (completed > 0 || studiedTime > 0) {
        return 'in-progress';
      }

      return 'not-started';
    },
    [state.role, isPreparationLocked, currentDayNumber, getDayTaskCompletion, state.studyTimeSeconds]
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

  // Unified per-track status helper
  const getTrackDayStatus = useCallback(
    (track: TrackId, dayNum: number): DayStatus => {
      if (track === 'main') {
        return getDayStatus(dayNum);
      }

      if (state.role === 'owner' && isPreparationLocked) {
        return 'locked';
      }

      if (state.role === 'owner' && dayNum > currentTrackDayNumber) {
        return 'locked';
      }

      const { completed, total } = getTrackDayTaskCompletion(track, dayNum);
      const allDone = total > 0 && completed === total;
      if (allDone) {
        return 'completed';
      }

      if (state.role === 'owner' && dayNum < currentTrackDayNumber) {
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
      state.role,
      isPreparationLocked,
      currentTrackDayNumber,
      getTrackDayTaskCompletion,
      state.dsaProgress,
      state.azureProgress
    ]
  );

  // Login: Supabase authentication for owner, local authentication for guest
  const login = useCallback(async (
    user: string,
    pass: string,
    targetRole: UserRole
  ): Promise<boolean> => {
    const trimmedUser = user.trim().toLowerCase();

    if (targetRole === 'guest') {
      if (trimmedUser !== 'guest' || pass !== 'Guest@0111') return false;

      ownerAuthUserIdRef.current = null;
      const guestState = loadRoleStateSync('guest');
      guestState.isAuthenticated = true;
      setState(guestState);
      setSelectedDayNumberState(guestState.lastActiveDayNumber || 1);
      setSelectedDsaDayState(guestState.dsaProgress?.lastActiveDayNumber || 1);
      setSelectedAzureDayState(guestState.azureProgress?.lastActiveDayNumber || 1);
      return true;
    }

    if (trimmedUser !== 'steeven' || !pass) return false;

    loginInProgressRef.current = true;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: OWNER_AUTH_EMAIL,
        password: pass
      });

      if (error || !data.user) return false;

      ownerAuthUserIdRef.current = data.user.id;

      const cachedState = loadRoleStateSync('owner');
      const indexedState = await loadFromIndexedDB(OWNER_STORAGE_KEY);

      const localState =
        indexedState?.lastSavedTimestamp &&
        (!cachedState.lastSavedTimestamp ||
          indexedState.lastSavedTimestamp > cachedState.lastSavedTimestamp)
          ? hydrateUserState(indexedState, 'owner')
          : cachedState;

      const cloudState = await loadOrMigrateOwnerProgress(data.user.id, localState);

      let ownerProgress = cloudState;

      try {
        const migratedPdfs = await migrateLegacyRoadmapPdfs(
          data.user.id,
          cloudState.uploadedPdfs || []
        );

        const migrationChanged = migratedPdfs.some((pdf, index) =>
          pdf.storagePath !== cloudState.uploadedPdfs?.[index]?.storagePath ||
          pdf.fileUrl !== cloudState.uploadedPdfs?.[index]?.fileUrl
        );

        if (migrationChanged) {
          ownerProgress = {
            ...cloudState,
            uploadedPdfs: migratedPdfs,
          };

          await saveOwnerProgressToCloud(data.user.id, ownerProgress);
          console.info('Legacy roadmap PDFs migrated to Supabase Storage.');
        }
      } catch (migrationError) {
        console.error('Legacy PDF migration failed. Original PDF data was preserved:', migrationError);
      }

      const ownerState = { ...ownerProgress, isAuthenticated: true };

      setState(ownerState);
      setSelectedDayNumberState(ownerState.lastActiveDayNumber || 1);
      setSelectedDsaDayState(ownerState.dsaProgress?.lastActiveDayNumber || 1);
      setSelectedAzureDayState(ownerState.azureProgress?.lastActiveDayNumber || 1);

      return true;
    } catch (error) {
      console.error('Owner login/cloud loading failed:', error);
      ownerAuthUserIdRef.current = null;
      await supabase.auth.signOut();
      return false;
    } finally {
      loginInProgressRef.current = false;
    }
  }, []);

  const logout = useCallback(() => {
    console.log('[LOGOUT] Function called');
    const wasOwner = state.role === 'owner';
    ownerAuthUserIdRef.current = null;

    if (wasOwner) {
      void supabase.auth.signOut().catch(error => {
        console.error('Supabase sign-out failed:', error);
      });
    }

    setState(prev => {
      const loggedOut = {
        ...prev,
        isAuthenticated: false,
        timerState: { ...prev.timerState, isActive: false, isPaused: false }
      };
      void saveRoleStatePermanent(loggedOut);
      return loggedOut;
    });
    setCurrentPage('login');
  }, [state.role]);
  const updateCredentials = useCallback(
    (newUsername: string, newPassword: string) => {
      if (state.role !== 'owner') return;
      setState(prev => ({
        ...prev,
        username: newUsername.trim(),
        passwordHash: newPassword
      }));
    },
    [state.role]
  );

  // Main Plan Toggle task completion
  const toggleTaskCompletion = useCallback(
    (dayNum: number, taskId: string) => {
      if (state.role === 'owner' && isPreparationLocked) return;

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
    },
    [state.role, isPreparationLocked]
  );

  const saveDayNotes = useCallback(
    (dayNum: number, notes: string) => {
      if (state.role === 'owner' && isPreparationLocked) return;

      setState(prev => ({
        ...prev,
        lastActiveDayNumber: dayNum,
        dayNotes: {
          ...prev.dayNotes,
          [dayNum]: notes
        }
      }));
    },
    [state.role, isPreparationLocked]
  );

  const submitAssessment = useCallback(
    (submission: AssessmentSubmission) => {
      setState(prev => {
        const week = submission.weekNumber;
        const updatedSubmissions = {
          ...prev.assessmentSubmissions,
          [week]: submission
        };

        const newLog: StudySessionLog = {
          id: `assess_${week}_${Date.now()}`,
          trackId: 'main',
          dayNumber: currentDayNumber,
          date: new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' }),
          startTime: new Date(Date.now() - submission.timeSpentSeconds * 1000).toISOString(),
          endTime: new Date().toISOString(),
          durationSeconds: submission.timeSpentSeconds,
          type: 'weekly_assessment',
          completedTasksCount: Object.keys(submission.answers).length,
          notes: `Main Plan Week ${week} Assessment submitted with score ${submission.score}/${submission.maxScore} (${submission.percentage}%)`
        };

        return {
          ...prev,
          assessmentSubmissions: updatedSubmissions,
          studyLogs: [newLog, ...prev.studyLogs]
        };
      });
    },
    [currentDayNumber]
  );

  // DSA & Azure Independent Track Actions
  const toggleTrackTaskCompletion = useCallback(
    (track: 'dsa' | 'azure', dayNum: number, taskId: string) => {
      if (state.role === 'owner' && isPreparationLocked) return;

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
    [state.role, isPreparationLocked]
  );

  const saveTrackDayNotes = useCallback(
    (track: 'dsa' | 'azure', dayNum: number, notes: string) => {
      if (state.role === 'owner' && isPreparationLocked) return;

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
    [state.role, isPreparationLocked]
  );

  const saveTrackRevisionRecord = useCallback(
    (
      track: 'dsa' | 'azure',
      weekNumber: number,
      record: Omit<TrackRevisionRecord, 'weekNumber' | 'completedAt'>
    ) => {
      if (state.role === 'owner' && isPreparationLocked) return;

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
    [state.role, isPreparationLocked]
  );

  // Timers (with track isolation & snapshot switching)
  const startTimer = useCallback(
    (
      dayNumber: number,
      durationMinutes?: number,
      type: 'daily' | 'assessment' = 'daily',
      trackId: TrackId = 'main'
    ) => {
      if (state.role === 'owner' && isPreparationLocked) return;

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
    [state.role, isPreparationLocked]
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

  // PDF Management
  const uploadRoadmapPdf = useCallback(
    async (file: File): Promise<{ success: boolean; message: string; pdfId?: string }> => {
      if (state.role !== 'owner') {
        return { success: false, message: 'Only Steeven (Owner) has permission to upload roadmap PDFs.' };
      }

      if (file.type !== 'application/pdf') {
        return { success: false, message: 'Invalid file type. Only PDF documents (.pdf) are allowed.' };
      }

      const userId = ownerAuthUserIdRef.current;

      if (!userId) {
        return { success: false, message: 'Please log in again before uploading a PDF.' };
      }

      const newId = `pdf_${Date.now()}`;
      const safeFilename = file.name.replace(/[^\w.-]+/g, '_');
      const storagePath = `${userId}/${newId}-${safeFilename}`;

      try {
        const { error } = await supabase.storage
          .from('roadmap-pdfs')
          .upload(storagePath, file, {
            contentType: 'application/pdf',
            upsert: false,
          });

        if (error) throw error;

        const newRecord: RoadmapPdfRecord = {
          id: newId,
          filename: file.name,
          fileSize: file.size,
          fileSizeBytesFormatted: `${(file.size / 1024).toFixed(1)} KB`,
          uploadTimestamp: new Date().toISOString(),
          ownerId: userId,
          storagePath,
          fileUrl: '',
          version: (state.uploadedPdfs.length || 1) + 1,
          isActiveRoadmap: false,
          extractedSummary: {
            pages: 20,
            topicsCount: 180,
            coveragePct: 100.0,
          },
        };

        setState(prev => ({
          ...prev,
          uploadedPdfs: [newRecord, ...prev.uploadedPdfs],
        }));

        return {
          success: true,
          message: 'PDF uploaded successfully to secure cloud storage.',
          pdfId: newId,
        };
      } catch (error) {
        console.error('Roadmap PDF upload failed:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'PDF upload failed. Please try again.',
        };
      }
    },
    [state.role, state.uploadedPdfs]
  );
  const setActivePdf = useCallback(
    (pdfId: string) => {
      if (state.role !== 'owner') return;

      setState(prev => ({
        ...prev,
        activePdfId: pdfId,
        uploadedPdfs: prev.uploadedPdfs.map(p => ({
          ...p,
          isActiveRoadmap: p.id === pdfId
        }))
      }));
    },
    [state.role]
  );

  const deletePdf = useCallback(
    async (pdfId: string): Promise<boolean> => {
      if (state.role !== 'owner') return false;

      const pdfToDelete = state.uploadedPdfs.find(p => p.id === pdfId);

      if (!pdfToDelete || state.uploadedPdfs.length <= 1) {
        return false;
      }

      try {
        if (
          pdfToDelete.storagePath &&
          !pdfToDelete.storagePath.startsWith('/') &&
          pdfToDelete.storagePath.includes('/')
        ) {
          await deleteRoadmapPdfFromStorage(pdfToDelete.storagePath);
        }

        setState(prev => {
          const updated = prev.uploadedPdfs.filter(p => p.id !== pdfId);

          if (updated.length === prev.uploadedPdfs.length || updated.length === 0) {
            return prev;
          }

          return {
            ...prev,
            uploadedPdfs: updated,
            activePdfId: prev.activePdfId === pdfId
              ? updated[0].id
              : prev.activePdfId,
          };
        });

        return true;
      } catch (error) {
        console.error('PDF deletion failed:', error);
        return false;
      }
    },
    [state.role, state.uploadedPdfs]
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

  const resetAllData = useCallback(() => {
    if (state.role === 'owner') {
      const resetState = hydrateUserState({ ...DEFAULT_OWNER_STATE, isAuthenticated: true }, 'owner');
      setState(resetState);
      saveRoleStatePermanent(resetState);
      setSelectedDayNumberState(1);
      setSelectedDsaDayState(1);
      setSelectedAzureDayState(1);
    } else {
      const resetGuest = hydrateUserState({ ...DEFAULT_GUEST_STATE, isAuthenticated: true }, 'guest');
      setState(resetGuest);
      saveRoleStatePermanent(resetGuest);
      setSelectedDayNumberState(1);
      setSelectedDsaDayState(1);
      setSelectedAzureDayState(1);
    }
  }, [state.role]);

  const resetGuestPreview = useCallback(() => {
    const resetGuest = hydrateUserState({ ...DEFAULT_GUEST_STATE, isAuthenticated: true }, 'guest');
    setState(resetGuest);
    saveRoleStatePermanent(resetGuest);
    setSelectedDayNumberState(1);
    setSelectedDsaDayState(1);
    setSelectedAzureDayState(1);
  }, []);

  const setSimulationMode = useCallback(
    (enabled: boolean, isoDate?: string) => {
      if (state.role !== 'owner') return;
      setState(prev => ({
        ...prev,
        simulationEnabled: enabled,
        simulationDate: enabled ? isoDate || '2026-11-16T09:00:00+05:30' : null
      }));
    },
    [state.role]
  );

  // ==========================================
  // RESOURCE LIBRARY ACTIONS
  // ==========================================
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

      const newId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newResource: ResourceItem = {
        ...item,
        url: validUrl,
        id: newId,
        dateAdded: new Date().toISOString()
      };

      setState(prev => ({
        ...prev,
        resources: [newResource, ...(prev.resources || [])]
      }));

      return { success: true, message: 'Resource saved successfully.', id: newId };
    },
    [state.resources]
  );

  const updateResource = useCallback((id: string, updates: Partial<ResourceItem>): boolean => {
    let success = false;
    setState(prev => {
      const list = prev.resources || [];
      const updated = list.map(r => {
        if (r.id === id) {
          success = true;
          return { ...r, ...updates };
        }
        return r;
      });
      return { ...prev, resources: updated };
    });
    return success;
  }, []);

  const deleteResource = useCallback((id: string): boolean => {
    let success = false;
    setState(prev => {
      const list = prev.resources || [];
      const updated = list.filter(r => r.id !== id);
      success = updated.length !== list.length;
      return { ...prev, resources: updated };
    });
    return success;
  }, []);

  const toggleResourceImportant = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      resources: (prev.resources || []).map(r => (r.id === id ? { ...r, isImportant: !r.isImportant } : r))
    }));
  }, []);

  const toggleResourceCompleted = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      resources: (prev.resources || []).map(r => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r))
    }));
  }, []);

  const saveResourceNotes = useCallback((id: string, notes: string) => {
    setState(prev => ({
      ...prev,
      resources: (prev.resources || []).map(r => (r.id === id ? { ...r, personalNotes: notes } : r))
    }));
  }, []);

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
      saveStatus,
      isPreparationLocked,
      lockTimeRemaining,
      currentDayNumber,
      currentTrackDayNumber,
      currentDaySchedule,
      isSaturdayToday,
      getDayStatus,
      getDayTaskCompletion,
      getTrackDayStatus,
      getTrackDayTaskCompletion,
      login,
      logout,
      updateCredentials,
      toggleTaskCompletion,
      saveDayNotes,
      submitAssessment,
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
      saveStatus,
      isPreparationLocked,
      lockTimeRemaining,
      currentDayNumber,
      currentTrackDayNumber,
      currentDaySchedule,
      isSaturdayToday,
      getDayStatus,
      getDayTaskCompletion,
      getTrackDayStatus,
      getTrackDayTaskCompletion,
      login,
      logout,
      updateCredentials,
      toggleTaskCompletion,
      saveDayNotes,
      submitAssessment,
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









