import {
  Assessment,
  AssessmentSnapshot,
  AssessmentSubmission,
  Question,
  WeeklyReviewNotes,
  WrittenReviewStatus
} from '../types';

export function buildAssessmentSnapshot(assessment: Assessment): AssessmentSnapshot {
  return {
    title: assessment.title,
    moduleTitle: assessment.moduleTitle,
    scheduledDate: assessment.scheduledDate,
    questions: assessment.questions.map(q => ({
      ...q,
      options: q.options ? [...q.options] : undefined
    })),
    leetcodeProblems: assessment.leetcodeProblems.map(p => ({ ...p }))
  };
}

export function gradeMcqQuestions(
  questions: Question[],
  answers: Record<string, string | number>
): { mcqScore: number; mcqMaxScore: number } {
  let mcqScore = 0;
  let mcqMaxScore = 0;

  for (const q of questions) {
    if (q.type !== 'mcq') continue;
    mcqMaxScore += q.points;
    const raw = answers[q.id];
    if (raw !== undefined && raw !== '' && Number(raw) === Number(q.correctAnswer)) {
      mcqScore += q.points;
    }
  }

  return { mcqScore, mcqMaxScore };
}

export function getPointsForReviewStatus(points: number, status: WrittenReviewStatus | undefined): number {
  switch (status) {
    case 'full':
      return points;
    case 'partial':
      return Math.round(points * 0.5);
    case 'needs_revision':
    case 'pending':
    default:
      return 0;
  }
}

export function computeWrittenReviewScore(
  questions: Question[],
  selfReviews: Record<string, WrittenReviewStatus> = {}
): { writtenReviewScore: number; writtenMaxScore: number; normalizedReviews: Record<string, WrittenReviewStatus> } {
  let writtenReviewScore = 0;
  let writtenMaxScore = 0;
  const normalizedReviews: Record<string, WrittenReviewStatus> = {};

  for (const q of questions) {
    if (q.type === 'mcq') continue;
    writtenMaxScore += q.points;
    const status: WrittenReviewStatus = selfReviews[q.id] || 'pending';
    normalizedReviews[q.id] = status;
    writtenReviewScore += getPointsForReviewStatus(q.points, status);
  }

  return { writtenReviewScore, writtenMaxScore, normalizedReviews };
}

export function createEvaluatedSubmission(params: {
  assessment: Assessment;
  answers: Record<string, string | number>;
  timeSpentSeconds: number;
  passThreshold?: number;
  reviewNotes?: WeeklyReviewNotes;
  writtenSelfReviews?: Record<string, WrittenReviewStatus>;
}): AssessmentSubmission {
  const { assessment, answers, timeSpentSeconds, reviewNotes, writtenSelfReviews } = params;
  const passThreshold = params.passThreshold ?? assessment.passThreshold;
  const questions = assessment.questions;

  const { mcqScore, mcqMaxScore } = gradeMcqQuestions(questions, answers);
  const { writtenReviewScore, writtenMaxScore, normalizedReviews } = computeWrittenReviewScore(
    questions,
    writtenSelfReviews || {}
  );

  const score = mcqScore + writtenReviewScore;
  const maxScore = mcqMaxScore + writtenMaxScore || assessment.totalPoints;
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const passed = percentage >= passThreshold;

  return {
    weekNumber: assessment.weekNumber,
    answers: { ...answers },
    score,
    maxScore,
    percentage,
    passed,
    submittedAt: new Date().toISOString(),
    timeSpentSeconds: Math.max(0, Math.round(timeSpentSeconds)),
    mcqScore,
    mcqMaxScore,
    writtenReviewScore,
    writtenMaxScore,
    writtenSelfReviews: normalizedReviews,
    reviewNotes: reviewNotes || {
      strengths: '',
      weakTopics: '',
      mistakes: '',
      revisionActions: '',
      nextWeekRecommendations: ''
    },
    snapshot: buildAssessmentSnapshot(assessment)
  };
}

export function applyRubricSelfReviewToSubmission(
  submission: AssessmentSubmission,
  questions: Question[],
  selfReviews: Record<string, WrittenReviewStatus>,
  reviewNotes?: WeeklyReviewNotes,
  passThreshold = 70
): AssessmentSubmission {
  const { mcqScore, mcqMaxScore } = gradeMcqQuestions(questions, submission.answers || {});
  const { writtenReviewScore, writtenMaxScore, normalizedReviews } = computeWrittenReviewScore(
    questions,
    selfReviews
  );

  const score = mcqScore + writtenReviewScore;
  const maxScore = mcqMaxScore + writtenMaxScore || submission.maxScore || 100;
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const passed = percentage >= passThreshold;

  return {
    ...submission,
    mcqScore,
    mcqMaxScore,
    writtenReviewScore,
    writtenMaxScore,
    writtenSelfReviews: normalizedReviews,
    reviewNotes: reviewNotes ?? submission.reviewNotes,
    score,
    maxScore,
    percentage,
    passed
  };
}
