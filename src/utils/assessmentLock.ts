export const PREPARATION_START_ISO_IST = '2026-11-16T00:00:00+05:30';
export const TOTAL_ASSESSMENT_WEEKS = 26;

const START_EPOCH_MS = new Date(PREPARATION_START_ISO_IST).getTime();
const DAY_MS = 24 * 60 * 60 * 1000;
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export function isValidAssessmentWeek(weekNumber: number): boolean {
  return Number.isInteger(weekNumber) && weekNumber >= 1 && weekNumber <= TOTAL_ASSESSMENT_WEEKS;
}

/**
 * Weeks 1-25 unlock on their scheduled Saturday checkpoint (Day 6, 13, 20, ..., 174).
 * Week 26 is the final partial week (Days 176-180) and unlocks on Day 180 (14 May 2027).
 */
export function getScheduledDayForWeek(weekNumber: number): number {
  if (!isValidAssessmentWeek(weekNumber)) return 180;
  return weekNumber <= 25 ? weekNumber * 7 - 1 : 180;
}

/**
 * Computes exact YYYY-MM-DD in Asia/Kolkata (UTC+05:30) for a given dayNumber (1..180)
 * and returns explicit midnight IST ISO string: YYYY-MM-DDT00:00:00+05:30.
 */
export function getWeekUnlockIsoIst(weekNumber: number): string {
  const scheduledDay = getScheduledDayForWeek(weekNumber);
  const unlockEpoch = START_EPOCH_MS + (scheduledDay - 1) * DAY_MS;
  const istShifted = new Date(unlockEpoch + IST_OFFSET_MS);
  const year = istShifted.getUTCFullYear();
  const month = String(istShifted.getUTCMonth() + 1).padStart(2, '0');
  const day = String(istShifted.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}T00:00:00+05:30`;
}

export function getWeekUnlockEpochMs(weekNumber: number): number {
  return new Date(getWeekUnlockIsoIst(weekNumber)).getTime();
}

export function getWeekUnlockDateLabelIst(weekNumber: number): string {
  const unlockMs = getWeekUnlockEpochMs(weekNumber);
  return new Date(unlockMs).toLocaleDateString('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function getWeekUnlockDateTimeLabelIst(weekNumber: number): string {
  return `${getWeekUnlockDateLabelIst(weekNumber)} · 00:00 IST`;
}

/**
 * Strict real-clock IST gate.
 * Applies equally to Owner and Guest. Cannot be bypassed by role, preview, or client simulation.
 */
export function isAssessmentUnlockedByIstClock(
  weekNumber: number,
  nowMs: number = Date.now()
): boolean {
  if (!isValidAssessmentWeek(weekNumber)) return false;
  return nowMs >= getWeekUnlockEpochMs(weekNumber);
}

export interface AssessmentCountdown {
  isUnlocked: boolean;
  totalMsRemaining: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  unlockIsoIst: string;
  unlockLabelIst: string;
}

export function getAssessmentLockStatus(
  weekNumber: number,
  nowMs: number = Date.now()
): AssessmentCountdown {
  const unlockIsoIst = getWeekUnlockIsoIst(weekNumber);
  const unlockMs = new Date(unlockIsoIst).getTime();
  const diff = Math.max(0, unlockMs - nowMs);
  const isUnlocked = isValidAssessmentWeek(weekNumber) && nowMs >= unlockMs;

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / DAY_MS);

  return {
    isUnlocked,
    totalMsRemaining: diff,
    days,
    hours,
    minutes,
    seconds,
    unlockIsoIst,
    unlockLabelIst: getWeekUnlockDateTimeLabelIst(weekNumber)
  };
}
