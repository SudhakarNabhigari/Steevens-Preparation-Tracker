import { ALL_180_DAYS } from '../syllabus';
import { DSA_100_DAYS } from '../dsaSyllabus';
import { AZURE_100_DAYS } from '../azureSyllabus';
import { Assessment, Question } from '../../types';
import {
  getScheduledDayForWeek,
  getWeekUnlockDateLabelIst,
  getWeekUnlockIsoIst
} from '../../utils/assessmentLock';
import { getLeetCodeProblemsForWeek } from './leetcodeBank';

export interface WeekAssessmentDefinition {
  weekNumber: number;
  title: string;
  moduleTitle: string;
  topicsCovered: string[];
  extraDsaTopics?: string[];
  extraAzureTopics?: string[];
  questions: Question[];
}

export function buildWeekAssessment(def: WeekAssessmentDefinition): Assessment {
  const { weekNumber } = def;
  const mainDays = ALL_180_DAYS.filter(d => d.weekNumber === weekNumber);
  const dsaDays = DSA_100_DAYS.filter(d => d.weekNumber === weekNumber);
  const azureDays = AZURE_100_DAYS.filter(d => d.weekNumber === weekNumber);

  const scheduledDayNumber = getScheduledDayForWeek(weekNumber);
  const scheduledDate = getWeekUnlockDateLabelIst(weekNumber);
  const unlockIsoIst = getWeekUnlockIsoIst(weekNumber);

  const startDate = mainDays[0]?.dateString || scheduledDate;
  const endDate = mainDays[mainDays.length - 1]?.dateString || scheduledDate;
  const studyWindow = `${startDate} – ${endDate}`;

  const dsaTopics =
    dsaDays.length > 0
      ? dsaDays.filter(d => !d.isWeekendRevision).map(d => `D${d.dayNumber}: ${d.topic}`)
      : def.extraDsaTopics || [];

  const azureTopics =
    azureDays.length > 0
      ? azureDays.filter(d => !d.isWeekendRevision).map(d => `D${d.dayNumber}: ${d.topic}`)
      : def.extraAzureTopics || [];

  return {
    weekNumber,
    title: def.title,
    moduleTitle: def.moduleTitle,
    scheduledDayNumber,
    scheduledDate,
    unlockIsoIst,
    studyWindow,
    durationMinutes: 180,
    topicsCovered: def.topicsCovered,
    dsaTopics,
    azureTopics,
    questions: def.questions,
    leetcodeProblems: getLeetCodeProblemsForWeek(weekNumber),
    totalPoints: 100,
    passThreshold: 70
  };
}
