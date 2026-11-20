import { Assessment, AssessmentMetadataSummary } from '../types';
import { getWeekUnlockIsoIst, isAssessmentUnlockedByIstClock, isValidAssessmentWeek, PREPARATION_START_ISO_IST } from '../utils/assessmentLock';
import { WEEKS_01_TO_06_ASSESSMENTS } from './assessments/weeks01to06';
import { WEEKS_07_TO_13_ASSESSMENTS } from './assessments/weeks07to13';
import { WEEKS_14_TO_20_ASSESSMENTS } from './assessments/weeks14to20';
import { WEEKS_21_TO_26_ASSESSMENTS } from './assessments/weeks21to26';

export const WEEKLY_ASSESSMENTS: Assessment[] = [
  ...WEEKS_01_TO_06_ASSESSMENTS,
  ...WEEKS_07_TO_13_ASSESSMENTS,
  ...WEEKS_14_TO_20_ASSESSMENTS,
  ...WEEKS_21_TO_26_ASSESSMENTS
].sort((a, b) => a.weekNumber - b.weekNumber);

export function getAssessmentMetadataForWeek(weekNumber: number, startIsoIst?: string): AssessmentMetadataSummary | null {
  if (!isValidAssessmentWeek(weekNumber)) return null;
  const found = WEEKLY_ASSESSMENTS.find(a => a.weekNumber === weekNumber);
  if (!found) return null;

  const mcqCount = found.questions.filter(q => q.type === 'mcq').length;
  const codingCount = found.questions.filter(
    q => q.type === 'coding' || q.type === 'debugging'
  ).length;
  const writtenCount = found.questions.filter(
    q => q.type === 'short_answer' || q.type === 'architecture'
  ).length;

  const unlockIsoIst = startIsoIst && startIsoIst !== PREPARATION_START_ISO_IST
    ? getWeekUnlockIsoIst(weekNumber, startIsoIst)
    : found.unlockIsoIst;
  const scheduledDate = startIsoIst && startIsoIst !== PREPARATION_START_ISO_IST
    ? new Date(unlockIsoIst).toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' })
    : found.scheduledDate;
  return {
    weekNumber: found.weekNumber,
    title: found.title,
    moduleTitle: found.moduleTitle,
    scheduledDayNumber: found.scheduledDayNumber,
    scheduledDate,
    unlockIsoIst,
    studyWindow: found.studyWindow,
    durationMinutes: found.durationMinutes,
    topicsCovered: found.topicsCovered,
    dsaTopics: found.dsaTopics,
    azureTopics: found.azureTopics,
    totalPoints: found.totalPoints,
    passThreshold: found.passThreshold,
    questionBreakdown: {
      mcqCount,
      codingCount,
      writtenCount,
      leetcodeCount: found.leetcodeProblems.length
    }
  };
}

export function getAllAssessmentMetadata(startIsoIst?: string): AssessmentMetadataSummary[] {
  return WEEKLY_ASSESSMENTS.map(a => getAssessmentMetadataForWeek(a.weekNumber, startIsoIst)!);
}

/**
 * Date-gated accessor: strictly enforces Asia/Kolkata IST unlock time.
 * Never returns questions, options, answer keys, explanations, or LeetCode problems before 00:00 IST on unlock date.
 */
export function getUnlockedAssessmentForWeek(
  weekNumber: number,
  nowMs: number = Date.now(),
  startIsoIst?: string
): Assessment | null {
  if (!isAssessmentUnlockedByIstClock(weekNumber, nowMs, startIsoIst)) {
    return null;
  }
  const assessment = WEEKLY_ASSESSMENTS.find(a => a.weekNumber === weekNumber);
  if (!assessment) return null;
  if (!startIsoIst || startIsoIst === PREPARATION_START_ISO_IST) return assessment;
  const unlockIsoIst = getWeekUnlockIsoIst(weekNumber, startIsoIst);
  const scheduledDate = new Date(unlockIsoIst).toLocaleDateString('en-GB', {
    timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric'
  });
  return { ...assessment, scheduledDate, unlockIsoIst };
}

/**
 * Legacy-compatible helper now strictly enforces IST unlock gate: returns null if locked.
 */
export function getAssessmentForWeek(
  weekNumber: number,
  _allDays?: unknown[],
  nowMs: number = Date.now()
): Assessment | null {
  return getUnlockedAssessmentForWeek(weekNumber, nowMs);
}
