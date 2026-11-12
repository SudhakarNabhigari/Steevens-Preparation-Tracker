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
  DoubtStatus
} from '../types';
import {
  ALL_180_DAYS,
  START_DATE_IST,
  RETAINED_REFERENCES
} from '../data/syllabus';
import {
  loadRoleStateSync,
  saveRoleStatePermanent,
  loadFromIndexedDB,
  OWNER_STORAGE_KEY,
  GUEST_STORAGE_KEY,
  DEFAULT_OWNER_STATE,
  DEFAULT_GUEST_STATE,
  exportBackupJson,
  importBackupJson
} from '../services/storage';

export type NavigationPage =
  | 'login'
  | 'lock_screen'
  | 'home_dashboard'
  | 'today_work'
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
  currentDayNumber: number; // 1 to 180
  currentDaySchedule: DaySchedule;
  isSaturdayToday: boolean;

  // Day status helper
  getDayStatus: (dayNumber: number) => DayStatus;
  getDayTaskCompletion: (dayNumber: number) => { completed: number; total: number; percentage: number };

  // Authentication
  login: (username: string, pass: string, targetRole: UserRole) => boolean;
  logout: () => void;
  updateCredentials: (username: string, password: string) => void;

  // Task & Notes Actions
  toggleTaskCompletion: (dayNumber: number, taskId: string) => void;
  saveDayNotes: (dayNumber: number, notes: string) => void;
  submitAssessment: (submission: AssessmentSubmission) => void;

  // Timer actions
  activeTimer: TimerState;
  startTimer: (dayNumber: number, durationMinutes?: number, type?: 'daily' | 'assessment') => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;

  // PDF Management
  uploadRoadmapPdf: (file: File) => Promise<{ success: boolean; message: string; pdfId?: string }>;
  setActivePdf: (pdfId: string) => void;
  deletePdf: (pdfId: string) => boolean;

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
  // Initialize to lastActiveDayNumber so the user resumes exactly where they stopped!
  const [selectedDayNumber, setSelectedDayNumberState] = useState<number>(() => state.lastActiveDayNumber || 1);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [nowTimestamp, setNowTimestamp] = useState<number>(Date.now());

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Rehydrate asynchronously from IndexedDB for maximum permanent persistence
  useEffect(() => {
    async function rehydrateFromDB() {
      const key = state.role === 'owner' ? OWNER_STORAGE_KEY : GUEST_STORAGE_KEY;
      const dbData = await loadFromIndexedDB(key);
      if (dbData && dbData.lastSavedTimestamp && (!state.lastSavedTimestamp || dbData.lastSavedTimestamp > state.lastSavedTimestamp)) {
        setState(prev => ({
          ...prev,
          ...dbData,
          role: prev.role
        }));
        if (dbData.lastActiveDayNumber) {
          setSelectedDayNumberState(dbData.lastActiveDayNumber);
        }
      }
    }
    rehydrateFromDB();
  }, []);

  // Update selected day and remember last active position
  const setSelectedDayNumber = useCallback((day: number) => {
    setSelectedDayNumberState(day);
    setState(prev => ({
      ...prev,
      lastActiveDayNumber: day
    }));
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

  // Determine effective current time
  const effectiveTimeMs = useMemo(() => {
    if (state.role === 'owner' && state.simulationEnabled && state.simulationDate) {
      return new Date(state.simulationDate).getTime();
    }
    return nowTimestamp;
  }, [state.role, state.simulationEnabled, state.simulationDate, nowTimestamp]);

  // Lock status calculation:
  // - Guest is NEVER locked out by date
  // - Steeven (Owner) is locked until Nov 16 2026 12:00 AM IST
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

  // Current day calculation
  const currentDayNumber = useMemo(() => {
    if (state.role === 'owner' && isPreparationLocked) return 1;
    if (state.role === 'guest') return state.lastActiveDayNumber || 1;
    const diffMs = effectiveTimeMs - START_DATE_MS;
    const day = Math.floor(diffMs / (24 * 3600 * 1000)) + 1;
    return Math.min(180, Math.max(1, day));
  }, [state.role, isPreparationLocked, effectiveTimeMs, state.lastActiveDayNumber]);

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
    if (!state.isAuthenticated) {
      setCurrentPage('login');
    } else if (state.role === 'owner' && isPreparationLocked && currentPage !== 'settings' && currentPage !== 'original_roadmap' && currentPage !== 'roadmap_pdf') {
      setCurrentPage('lock_screen');
    } else if (currentPage === 'login' || (currentPage === 'lock_screen' && !isPreparationLocked)) {
      setCurrentPage('home_dashboard');
    }
  }, [state.isAuthenticated, state.role, isPreparationLocked]);

  // Timer engine
  useEffect(() => {
    if (!state.timerState.isActive || state.timerState.isPaused) return;

    const timerInterval = setInterval(() => {
      setState(prev => {
        if (!prev.timerState.isActive || prev.timerState.isPaused) return prev;

        const newElapsed = prev.timerState.elapsedSeconds + 1;
        const newRemaining = Math.max(0, prev.timerState.targetSeconds - newElapsed);

        const dayNum = prev.timerState.dayNumber;
        const prevDayStudy = prev.studyTimeSeconds[dayNum] || 0;
        const updatedStudyTime = {
          ...prev.studyTimeSeconds,
          [dayNum]: prevDayStudy + 1
        };

        if (newRemaining <= 0) {
          return {
            ...prev,
            studyTimeSeconds: updatedStudyTime,
            timerState: {
              ...prev.timerState,
              elapsedSeconds: newElapsed,
              remainingSeconds: 0,
              isActive: false,
              isPaused: false
            }
          };
        }

        return {
          ...prev,
          studyTimeSeconds: updatedStudyTime,
          timerState: {
            ...prev.timerState,
            elapsedSeconds: newElapsed,
            remainingSeconds: newRemaining
          }
        };
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [state.timerState.isActive, state.timerState.isPaused]);

  // Task completion calculation
  const getDayTaskCompletion = useCallback((dayNum: number) => {
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
  }, [state.completedTasks]);

  // Status calculation:
  // - Grey: Not started or locked
  // - Terracotta: In progress (#E7826D)
  // - Green: All mandatory tasks completed
  // - Red: Scheduled day ended with incomplete mandatory work
  const getDayStatus = useCallback((dayNum: number): DayStatus => {
    if (state.role === 'owner' && isPreparationLocked) {
      return 'locked';
    }

    if (state.role === 'owner' && dayNum > currentDayNumber) {
      return 'locked';
    }

    const { completed, total } = getDayTaskCompletion(dayNum);
    const allDone = total > 0 && completed === total;

    if (allDone) {
      return 'completed'; // Green
    }

    if (state.role === 'owner' && dayNum < currentDayNumber) {
      return 'incomplete'; // Red
    }

    const studiedTime = state.studyTimeSeconds[dayNum] || 0;
    if (completed > 0 || studiedTime > 0) {
      return 'in-progress'; // Terracotta
    }

    return 'not-started'; // Grey
  }, [state.role, isPreparationLocked, currentDayNumber, getDayTaskCompletion, state.studyTimeSeconds]);

  // Login
  const login = useCallback((user: string, pass: string, targetRole: UserRole): boolean => {
    const trimmedUser = user.trim().toLowerCase();

    if (targetRole === 'owner') {
      const isSteeven = trimmedUser === 'steeven';
      const isPassValid = pass === 'Nani@011' || pass === 'Nani@0111';
      if (isSteeven && isPassValid) {
        const ownerState = loadRoleStateSync('owner');
        ownerState.isAuthenticated = true;
        setState(ownerState);
        setSelectedDayNumberState(ownerState.lastActiveDayNumber || 1);
        return true;
      }
      return false;
    } else {
      const isGuest = trimmedUser === 'guest';
      const isPassValid = pass === 'Guest@0111';
      if (isGuest && isPassValid) {
        const guestState = loadRoleStateSync('guest');
        guestState.isAuthenticated = true;
        setState(guestState);
        setSelectedDayNumberState(guestState.lastActiveDayNumber || 1);
        return true;
      }
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setState(prev => {
      const loggedOut = {
        ...prev,
        isAuthenticated: false,
        timerState: { ...prev.timerState, isActive: false, isPaused: false }
      };
      saveRoleStatePermanent(loggedOut);
      return loggedOut;
    });
    setCurrentPage('login');
  }, []);

  const updateCredentials = useCallback((newUsername: string, newPassword: string) => {
    if (state.role !== 'owner') return;
    setState(prev => ({
      ...prev,
      username: newUsername.trim(),
      passwordHash: newPassword
    }));
  }, [state.role]);

  // Toggle task completion
  const toggleTaskCompletion = useCallback((dayNum: number, taskId: string) => {
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
  }, [state.role, isPreparationLocked]);

  const saveDayNotes = useCallback((dayNum: number, notes: string) => {
    if (state.role === 'owner' && isPreparationLocked) return;

    setState(prev => ({
      ...prev,
      lastActiveDayNumber: dayNum,
      dayNotes: {
        ...prev.dayNotes,
        [dayNum]: notes
      }
    }));
  }, [state.role, isPreparationLocked]);

  const submitAssessment = useCallback((submission: AssessmentSubmission) => {
    setState(prev => {
      const week = submission.weekNumber;
      const updatedSubmissions = {
        ...prev.assessmentSubmissions,
        [week]: submission
      };

      const newLog: StudySessionLog = {
        id: `assess_${week}_${Date.now()}`,
        dayNumber: currentDayNumber,
        date: new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' }),
        startTime: new Date(Date.now() - submission.timeSpentSeconds * 1000).toISOString(),
        endTime: new Date().toISOString(),
        durationSeconds: submission.timeSpentSeconds,
        type: 'weekly_assessment',
        completedTasksCount: Object.keys(submission.answers).length,
        notes: `Week ${week} Assessment submitted with score ${submission.score}/${submission.maxScore} (${submission.percentage}%)`
      };

      return {
        ...prev,
        assessmentSubmissions: updatedSubmissions,
        studyLogs: [newLog, ...prev.studyLogs]
      };
    });
  }, [currentDayNumber]);

  // Timers
  const startTimer = useCallback((dayNumber: number, durationMinutes?: number, type: 'daily' | 'assessment' = 'daily') => {
    if (state.role === 'owner' && isPreparationLocked) return;

    const schedule = ALL_180_DAYS[dayNumber - 1];
    const defaultHours = schedule ? schedule.targetHours : 4;
    const targetSeconds = (durationMinutes ? durationMinutes * 60 : defaultHours * 3600);

    setState(prev => ({
      ...prev,
      lastActiveDayNumber: dayNumber,
      timerState: {
        isActive: true,
        isPaused: false,
        dayNumber,
        targetSeconds,
        elapsedSeconds: 0,
        remainingSeconds: targetSeconds,
        startedAtTimestamp: Date.now(),
        type
      }
    }));
  }, [state.role, isPreparationLocked]);

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
    setState(prev => ({
      ...prev,
      timerState: {
        ...prev.timerState,
        isActive: false,
        isPaused: false,
        elapsedSeconds: 0,
        remainingSeconds: prev.timerState.targetSeconds
      }
    }));
  }, []);

  // PDF Management
  const uploadRoadmapPdf = useCallback(async (file: File): Promise<{ success: boolean; message: string; pdfId?: string }> => {
    if (state.role !== 'owner') {
      return { success: false, message: 'Only Steeven (Owner) has permission to upload roadmap PDFs.' };
    }

    if (file.type !== 'application/pdf') {
      return { success: false, message: 'Invalid file type. Only PDF documents (.pdf) are allowed.' };
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
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

        setState(prev => ({
          ...prev,
          uploadedPdfs: [newRecord, ...prev.uploadedPdfs]
        }));

        resolve({ success: true, message: 'PDF uploaded and saved permanently.', pdfId: newId });
      };

      reader.onerror = () => {
        resolve({ success: false, message: 'Failed to read file contents.' });
      };

      reader.readAsDataURL(file);
    });
  }, [state.role, state.uploadedPdfs]);

  const setActivePdf = useCallback((pdfId: string) => {
    if (state.role !== 'owner') return;

    setState(prev => ({
      ...prev,
      activePdfId: pdfId,
      uploadedPdfs: prev.uploadedPdfs.map(p => ({
        ...p,
        isActiveRoadmap: p.id === pdfId
      }))
    }));
  }, [state.role]);

  const deletePdf = useCallback((pdfId: string): boolean => {
    if (state.role !== 'owner') return false;

    let success = false;
    setState(prev => {
      if (prev.uploadedPdfs.length <= 1) return prev;
      success = true;
      const updated = prev.uploadedPdfs.filter(p => p.id !== pdfId);
      const nextActiveId = prev.activePdfId === pdfId ? updated[0].id : prev.activePdfId;

      return {
        ...prev,
        uploadedPdfs: updated,
        activePdfId: nextActiveId
      };
    });
    return success;
  }, [state.role]);

  // Backup & Reset
  const exportBackup = useCallback(() => {
    exportBackupJson(state);
  }, [state]);

  const importBackup = useCallback((jsonStr: string): boolean => {
    if (state.role !== 'owner') return false;
    const imported = importBackupJson(jsonStr);
    if (imported) {
      setState(imported);
      setSelectedDayNumberState(imported.lastActiveDayNumber || 1);
      return true;
    }
    return false;
  }, [state.role]);

  const resetAllData = useCallback(() => {
    if (state.role === 'owner') {
      const resetState = { ...DEFAULT_OWNER_STATE, isAuthenticated: true };
      setState(resetState);
      saveRoleStatePermanent(resetState);
      setSelectedDayNumberState(1);
    } else {
      const resetGuest = { ...DEFAULT_GUEST_STATE, isAuthenticated: true };
      setState(resetGuest);
      saveRoleStatePermanent(resetGuest);
      setSelectedDayNumberState(1);
    }
  }, [state.role]);

  const resetGuestPreview = useCallback(() => {
    const resetGuest = { ...DEFAULT_GUEST_STATE, isAuthenticated: true };
    setState(resetGuest);
    saveRoleStatePermanent(resetGuest);
    setSelectedDayNumberState(1);
  }, []);

  const setSimulationMode = useCallback((enabled: boolean, isoDate?: string) => {
    if (state.role !== 'owner') return;
    setState(prev => ({
      ...prev,
      simulationEnabled: enabled,
      simulationDate: enabled ? (isoDate || '2026-11-16T09:00:00+05:30') : null
    }));
  }, [state.role]);

  // ==========================================
  // RESOURCE LIBRARY ACTIONS
  // ==========================================
  const addResource = useCallback((item: Omit<ResourceItem, 'id' | 'dateAdded'>): { success: boolean; message: string; id?: string } => {
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
  }, [state.resources]);

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
      resources: (prev.resources || []).map(r => r.id === id ? { ...r, isImportant: !r.isImportant } : r)
    }));
  }, []);

  const toggleResourceCompleted = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      resources: (prev.resources || []).map(r => r.id === id ? { ...r, isCompleted: !r.isCompleted } : r)
    }));
  }, []);

  const saveResourceNotes = useCallback((id: string, notes: string) => {
    setState(prev => ({
      ...prev,
      resources: (prev.resources || []).map(r => r.id === id ? { ...r, personalNotes: notes } : r)
    }));
  }, []);

  // ==========================================
  // DOUBT & ERROR NOTEBOOK ACTIONS
  // ==========================================
  const addDoubtEntry = useCallback((entry: Omit<DoubtEntry, 'id' | 'dateCreated'>): { success: boolean; id: string } => {
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
  }, []);

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
      doubtEntries: (prev.doubtEntries || []).map(d => d.id === id ? { ...d, status } : d)
    }));
  }, []);

  const toggleDoubtNeedsRevision = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      doubtEntries: (prev.doubtEntries || []).map(d => d.id === id ? { ...d, needsRevision: !d.needsRevision } : d)
    }));
  }, []);

  const saveDoubtAdditionalNotes = useCallback((id: string, notes: string) => {
    setState(prev => ({
      ...prev,
      doubtEntries: (prev.doubtEntries || []).map(d => d.id === id ? { ...d, additionalNotes: notes } : d)
    }));
  }, []);

  const value = useMemo(() => ({
    state,
    userRole: state.role,
    currentPage,
    setCurrentPage,
    selectedDayNumber,
    setSelectedDayNumber,
    saveStatus,
    isPreparationLocked,
    lockTimeRemaining,
    currentDayNumber,
    currentDaySchedule,
    isSaturdayToday,
    getDayStatus,
    getDayTaskCompletion,
    login,
    logout,
    updateCredentials,
    toggleTaskCompletion,
    saveDayNotes,
    submitAssessment,
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
  }), [
    state,
    currentPage,
    selectedDayNumber,
    setSelectedDayNumber,
    saveStatus,
    isPreparationLocked,
    lockTimeRemaining,
    currentDayNumber,
    currentDaySchedule,
    isSaturdayToday,
    getDayStatus,
    getDayTaskCompletion,
    login,
    logout,
    updateCredentials,
    toggleTaskCompletion,
    saveDayNotes,
    submitAssessment,
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
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
