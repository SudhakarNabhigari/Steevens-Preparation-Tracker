import { Assessment, AssessmentMetadataSummary } from '../types';
import { isAssessmentUnlockedByIstClock, isValidAssessmentWeek } from '../utils/assessmentLock';
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

export function getAssessmentMetadataForWeek(weekNumber: number): AssessmentMetadataSummary | null {
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

  return {
    weekNumber: found.weekNumber,
    title: found.title,
    moduleTitle: found.moduleTitle,
    scheduledDayNumber: found.scheduledDayNumber,
    scheduledDate: found.scheduledDate,
    unlockIsoIst: found.unlockIsoIst,
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

export function getAllAssessmentMetadata(): AssessmentMetadataSummary[] {
  return WEEKLY_ASSESSMENTS.map(a => getAssessmentMetadataForWeek(a.weekNumber)!);
}

/**
 * Date-gated accessor: strictly enforces Asia/Kolkata IST unlock time.
 * Never returns questions, options, answer keys, explanations, or LeetCode problems before 00:00 IST on unlock date.
 */
export function getUnlockedAssessmentForWeek(
  weekNumber: number,
  nowMs: number = Date.now()
): Assessment | null {
  if (!isAssessmentUnlockedByIstClock(weekNumber, nowMs)) {
    return null;
  }
  return WEEKLY_ASSESSMENTS.find(a => a.weekNumber === weekNumber) || null;
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
