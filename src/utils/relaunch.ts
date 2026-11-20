import type { TrackProgressState, UserState } from '../types';
import { DEFAULT_TRACK_PROGRESS } from '../services/storage';
import {
  OWNER_RELAUNCH_CYCLE_ID,
  OWNER_RELAUNCH_START_ISO_IST,
  OWNER_RELAUNCH_START_MS
} from './relaunchConfig';

export {
  OWNER_RELAUNCH_CYCLE_ID,
  OWNER_RELAUNCH_START_ISO_IST,
  OWNER_RELAUNCH_START_MS,
  OWNER_RESTART_EMAIL_EARLIEST_ISO_IST,
  OWNER_RESTART_EMAIL_EARLIEST_MS
} from './relaunchConfig';

export interface ArchivedPreparationCycle {
  cycleId: string;
  archivedAt: string;
  startDateIsoIst: string;
  main: Pick<UserState, 'completedTasks' | 'completedDays' | 'dayNotes' | 'studyTimeSeconds' | 'assessmentSubmissions' | 'leetcodeProgress' | 'activeAssessmentAttempt'>;
  dsa: TrackProgressState;
  azure: TrackProgressState;
  studyLogs: UserState['studyLogs'];
  timerState: UserState['timerState'];
  trackTimerSnapshots: NonNullable<UserState['trackTimerSnapshots']>;
  dailyAiResourceCompletions?: UserState['dailyAiResourceCompletions'];
}

export function isBeforeOwnerRelaunch(nowMs: number): boolean {
  return nowMs < OWNER_RELAUNCH_START_MS;
}

export function createOwnerRelaunchCycle(state: UserState, nowMs: number): UserState {
  if (state.role !== 'owner' || isBeforeOwnerRelaunch(nowMs) || state.preparationCycleId === OWNER_RELAUNCH_CYCLE_ID) {
    return state;
  }

  const archivedAt = new Date(nowMs).toISOString();
  const existingHistory = state.preparationCycleHistory || [];
  const priorCycleId = state.preparationCycleId || 'owner-cycle-2026-11-16';
  const alreadyArchived = existingHistory.some((cycle) => cycle.cycleId === priorCycleId);
  const archive: ArchivedPreparationCycle = {
    cycleId: priorCycleId,
    archivedAt,
    startDateIsoIst: state.preparationCycleStartIsoIst || '2026-11-16T00:00:00+05:30',
    main: {
      completedTasks: state.completedTasks || {},
      completedDays: state.completedDays || {},
      dayNotes: state.dayNotes || {},
      studyTimeSeconds: state.studyTimeSeconds || {},
      assessmentSubmissions: state.assessmentSubmissions || {},
      leetcodeProgress: state.leetcodeProgress || {},
      activeAssessmentAttempt: state.activeAssessmentAttempt || null
    },
    dsa: state.dsaProgress || DEFAULT_TRACK_PROGRESS(),
    azure: state.azureProgress || DEFAULT_TRACK_PROGRESS(),
    studyLogs: state.studyLogs || [],
    timerState: { ...state.timerState },
    trackTimerSnapshots: Object.fromEntries(
      Object.entries(state.trackTimerSnapshots || {}).map(([trackId, timer]) => [
        trackId,
        timer ? { ...timer } : timer
      ])
    ) as NonNullable<UserState['trackTimerSnapshots']>,
    dailyAiResourceCompletions: state.dailyAiResourceCompletions || {}
  };

  return {
    ...state,
    preparationCycleId: OWNER_RELAUNCH_CYCLE_ID,
    preparationCycleStartIsoIst: OWNER_RELAUNCH_START_ISO_IST,
    preparationCycleHistory: alreadyArchived ? existingHistory : [...existingHistory, archive],
    completedTasks: {},
    completedDays: {},
    dayNotes: {},
    studyTimeSeconds: {},
    assessmentSubmissions: {},
    leetcodeProgress: {},
    activeAssessmentAttempt: null,
    studyLogs: [],
    lastActiveDayNumber: 1,
    timerState: {
      ...state.timerState,
      isActive: false,
      isPaused: false,
      trackId: 'main',
      dayNumber: 1,
      elapsedSeconds: 0,
      remainingSeconds: state.timerState.targetSeconds,
      startedAtTimestamp: undefined,
      pausedAtTimestamp: undefined,
      type: 'daily'
    },
    trackTimerSnapshots: {},
    dsaProgress: DEFAULT_TRACK_PROGRESS(),
    azureProgress: DEFAULT_TRACK_PROGRESS(),
    dailyAiResourceCompletions: {},
    lastSavedTimestamp: archivedAt
  };
}

export function addDaysToIsoDate(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function shiftScheduleDate<T extends { isoDate: string; dateString: string }>(entry: T, days: number): T {
  const shifted = new Date(new Date(`${entry.isoDate}T00:00:00Z`).getTime() + days * 86_400_000);
  return {
    ...entry,
    isoDate: shifted.toISOString().slice(0, 10),
    dateString: shifted.toLocaleDateString('en-GB', {
      timeZone: 'UTC', day: '2-digit', month: 'short', year: 'numeric'
    })
  };
}
