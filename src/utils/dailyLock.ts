export const DAILY_PREPARATION_START_ISO_IST = '2026-11-23T00:00:00+05:30';
export const MAIN_TRACK_MAX_DAYS = 180;
export const SUB_TRACK_MAX_DAYS = 100;

const START_EPOCH_MS = new Date(DAILY_PREPARATION_START_ISO_IST).getTime();
const DAY_MS = 24 * 60 * 60 * 1000;
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export function isValidPrepDay(dayNumber: number, maxDay: number = MAIN_TRACK_MAX_DAYS): boolean {
  return Number.isInteger(dayNumber) && dayNumber >= 1 && dayNumber <= maxDay;
}

/**
 * Computes exact midnight Asia/Kolkata (UTC+05:30) ISO timestamp for dayNumber (1..maxDay).
 * Day 1 => 2026-11-23T00:00:00+05:30
 * Day 2 => 2026-11-24T00:00:00+05:30
 */
export function getDayUnlockIsoIst(dayNumber: number, maxDay: number = MAIN_TRACK_MAX_DAYS, startIsoIst: string = DAILY_PREPARATION_START_ISO_IST): string {
  const safeDay = isValidPrepDay(dayNumber, maxDay) ? dayNumber : 1;
  const unlockEpoch = new Date(startIsoIst).getTime() + (safeDay - 1) * DAY_MS;
  const istShifted = new Date(unlockEpoch + IST_OFFSET_MS);
  const year = istShifted.getUTCFullYear();
  const month = String(istShifted.getUTCMonth() + 1).padStart(2, '0');
  const day = String(istShifted.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}T00:00:00+05:30`;
}

export function getDayUnlockEpochMs(dayNumber: number, maxDay: number = MAIN_TRACK_MAX_DAYS, startIsoIst: string = DAILY_PREPARATION_START_ISO_IST): number {
  return new Date(getDayUnlockIsoIst(dayNumber, maxDay, startIsoIst)).getTime();
}

export function getDayUnlockDateLabelIst(dayNumber: number, maxDay: number = MAIN_TRACK_MAX_DAYS, startIsoIst: string = DAILY_PREPARATION_START_ISO_IST): string {
  const unlockMs = getDayUnlockEpochMs(dayNumber, maxDay, startIsoIst);
  return new Date(unlockMs).toLocaleDateString('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function getDayUnlockDateTimeLabelIst(dayNumber: number, maxDay: number = MAIN_TRACK_MAX_DAYS, startIsoIst: string = DAILY_PREPARATION_START_ISO_IST): string {
  return `${getDayUnlockDateLabelIst(dayNumber, maxDay, startIsoIst)} · 00:00 IST`;
}

/**
 * Strict real-clock Asia/Kolkata (IST) daily unlock check.
 * Applies equally to Owner and Guest. Cannot be bypassed by test simulation or role switching.
 */
export function isDayUnlockedByIstClock(
  dayNumber: number,
  nowMs: number = Date.now(),
  maxDay: number = MAIN_TRACK_MAX_DAYS,
  startIsoIst: string = DAILY_PREPARATION_START_ISO_IST
): boolean {
  if (!isValidPrepDay(dayNumber, maxDay)) return false;
  return nowMs >= getDayUnlockEpochMs(dayNumber, maxDay, startIsoIst);
}

/**
 * Returns 0 before 23 Nov 2026 00:00 IST, 1 on 23 Nov 2026, 2 on 24 Nov 2026, etc. (clamped to maxDay).
 */
export function getUnlockedDayCountByIstClock(
  nowMs: number = Date.now(),
  maxDay: number = MAIN_TRACK_MAX_DAYS,
  startIsoIst: string = DAILY_PREPARATION_START_ISO_IST
): number {
  const startEpoch = new Date(startIsoIst).getTime();
  if (nowMs < startEpoch) return 0;
  const elapsedDays = Math.floor((nowMs - startEpoch) / DAY_MS) + 1;
  return Math.min(maxDay, Math.max(0, elapsedDays));
}

/**
 * Returns the active IST schedule day (clamped to 1..maxDay for UI default selection).
 */
export function getCurrentIstScheduleDay(
  nowMs: number = Date.now(),
  maxDay: number = MAIN_TRACK_MAX_DAYS,
  startIsoIst: string = DAILY_PREPARATION_START_ISO_IST
): number {
  return Math.max(1, getUnlockedDayCountByIstClock(nowMs, maxDay, startIsoIst));
}

export interface DailyLockCountdown {
  isUnlocked: boolean;
  totalMsRemaining: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  unlockIsoIst: string;
  unlockDateLabelIst: string;
  unlockLabelIst: string;
}

export function getDayLockStatus(
  dayNumber: number,
  nowMs: number = Date.now(),
  maxDay: number = MAIN_TRACK_MAX_DAYS,
  startIsoIst: string = DAILY_PREPARATION_START_ISO_IST
): DailyLockCountdown {
  const unlockIsoIst = getDayUnlockIsoIst(dayNumber, maxDay, startIsoIst);
  const unlockMs = new Date(unlockIsoIst).getTime();
  const diff = Math.max(0, unlockMs - nowMs);
  const isUnlocked = isValidPrepDay(dayNumber, maxDay) && nowMs >= unlockMs;

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
    unlockDateLabelIst: getDayUnlockDateLabelIst(dayNumber, maxDay, startIsoIst),
    unlockLabelIst: getDayUnlockDateTimeLabelIst(dayNumber, maxDay, startIsoIst)
  };
}
