import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_180_DAYS } from '../data/syllabus';
import { getAssessmentForWeek } from '../data/assessments';
import { AssessmentSubmission } from '../types';
import {
  Award,
  Clock,
  CheckCircle2,
  Play,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WeeklyAssessmentsPage: React.FC = () => {
  const {
    state,
    currentDayNumber,
    isPreparationLocked,
    isSaturdayToday,
    submitAssessment,
    userRole
  } = useApp();

  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [isExamActive, setIsExamActive] = useState<boolean>(false);
  const [examRemainingSeconds, setExamRemainingSeconds] = useState<number>(180 * 60); // 3 hours
  const [userAnswers, setUserAnswers] = useState<Record<string, string | number>>({});
  const [submissionResult, setSubmissionResult] = useState<AssessmentSubmission | null>(null);

  // Get current assessment object
  const currentAssessment = getAssessmentForWeek(selectedWeek, ALL_180_DAYS);
  const existingSubmission = state.assessmentSubmissions[selectedWeek];

  // Scheduled Saturday day number for selected week
  const scheduledSaturdayDay = selectedWeek * 7 - 1; // e.g. Week 1 -> Day 6 (Saturday 21 Nov)
  // Guests can always preview assessments without waiting for real calendar
  const isUnlocked = userRole === 'guest' || (!isPreparationLocked && currentDayNumber >= scheduledSaturdayDay) || state.simulationEnabled;

  // 3-hour exam timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isExamActive && examRemainingSeconds > 0) {
      interval = setInterval(() => {
        setExamRemainingSeconds(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isExamActive, examRemainingSeconds]);

  const handleStartExam = () => {
    setIsExamActive(true);
    setExamRemainingSeconds(180 * 60);
    setUserAnswers({});
    setSubmissionResult(null);
  };

  const handleAnswerChange = (questionId: string, val: string | number) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: val }));
  };

  const handleAutoSubmit = () => {
    calculateAndSubmit();
  };

  const calculateAndSubmit = () => {
    let earnedPoints = 0;
    const totalPoints = currentAssessment.totalPoints;

    currentAssessment.questions.forEach(q => {
      const ans = userAnswers[q.id];
      if (q.type === 'mcq') {
        if (ans !== undefined && Number(ans) === q.correctAnswer) {
          earnedPoints += q.points;
        }
      } else {
        // Evaluate based on completeness
        if (ans && typeof ans === 'string' && ans.trim().length >= 25) {
          earnedPoints += q.points;
        } else if (ans && typeof ans === 'string' && ans.trim().length > 0) {
          earnedPoints += Math.round(q.points * 0.5);
        }
      }
    });

    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    const passed = percentage >= currentAssessment.passThreshold;

    const submission: AssessmentSubmission = {
      weekNumber: selectedWeek,
      answers: userAnswers,
      score: earnedPoints,
      maxScore: totalPoints,
      percentage,
      passed,
      submittedAt: new Date().toISOString(),
      timeSpentSeconds: 180 * 60 - examRemainingSeconds
    };

    submitAssessment(submission);
    setSubmissionResult(submission);
    setIsExamActive(false);

    if (passed) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // fallback
      }
    }
  };

  const formatExamTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Saturday Assessment Callout */}
      {isSaturdayToday && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#292929] text-white border border-[#292929] shadow-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-[#E7826D] shrink-0" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                TODAY IS YOUR WEEKLY ASSESSMENT DAY!
              </h2>
              <p className="text-xs text-[#E0DCD3]">
                Saturday assessment is mandatory. The 3-hour exam covers all topics and subtopics studied during this week.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-[#E7826D] text-white text-xs font-bold rounded-lg shrink-0">
            Mandatory
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0DCD3]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292929] tracking-tight">
            WEEKLY ASSESSMENTS
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            Mandatory 3-hour Saturday assessments evaluating written, practical, debugging, and viva concepts.
          </p>
        </div>

        {/* Week Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#78716C] font-semibold">Select Week:</span>
          <select
            value={selectedWeek}
            onChange={(e) => {
              setSelectedWeek(Number(e.target.value));
              setIsExamActive(false);
              setSubmissionResult(null);
            }}
            className="px-3 py-2 bg-white border border-[#E0DCD3] rounded-xl text-xs sm:text-sm text-[#292929] focus:outline-none focus:border-[#E7826D] cursor-pointer shadow-sm"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(wk => {
              const sub = state.assessmentSubmissions[wk];
              const label = sub ? `Week ${wk} (Scored ${sub.percentage}%)` : `Week ${wk}`;
              return <option key={wk} value={wk}>{label}</option>;
            })}
          </select>
        </div>
      </div>

      {/* Main Assessment Container */}
      {!isExamActive && (
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E0DCD3] pb-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] text-[#E7826D] font-bold border border-[#E0DCD3]">
                  Week {currentAssessment.weekNumber} Assessment
                </span>
                <span className="text-[#A8A29E]">·</span>
                <span className="text-[#78716C] font-mono">Scheduled: {currentAssessment.scheduledDate}</span>
              </div>
              <h2 className="text-xl font-bold text-[#292929] pt-1">
                {currentAssessment.title}
              </h2>
              <p className="text-xs text-[#78716C]">
                Covers module: <strong className="text-[#292929]">{currentAssessment.moduleTitle}</strong>
              </p>
            </div>

            {/* Assessment Status Badge */}
            <div>
              {existingSubmission ? (
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    existingSubmission.passed
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {existingSubmission.passed ? 'PASSED' : 'RETAKE REQUIRED'}
                  </span>
                  <div className="font-mono text-xs text-[#292929] mt-1.5 font-bold">
                    Score: {existingSubmission.score} / {existingSubmission.maxScore} ({existingSubmission.percentage}%)
                  </div>
                </div>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-600 border border-stone-200">
                  {isUnlocked ? 'READY TO START' : 'LOCKED UNTIL SATURDAY'}
                </span>
              )}
            </div>
          </div>

          {/* Exam Requirements Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
              <span className="text-[11px] text-[#78716C] font-semibold block mb-1">Duration</span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#292929]">
                <Clock className="w-4 h-4 text-[#E7826D]" />
                <span>3 Hours (180 Minutes)</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
              <span className="text-[11px] text-[#78716C] font-semibold block mb-1">Pass Threshold</span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#292929]">
                <Award className="w-4 h-4 text-[#E7826D]" />
                <span>{currentAssessment.passThreshold}% (70 / 100 Pts)</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
              <span className="text-[11px] text-[#78716C] font-semibold block mb-1">Question Format</span>
              <span className="text-xs font-semibold text-[#292929]">
                MCQs, Short-Answer, Debugging, Architecture
              </span>
            </div>
          </div>

          {/* Syllabus Covered */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78716C] block">
              Week {currentAssessment.weekNumber} Syllabus Covered:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentAssessment.topicsCovered.map((topic, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E0DCD3] text-xs text-[#292929]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Source Attribution Note */}
          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] text-xs text-[#78716C] leading-relaxed">
            <strong className="text-[#292929] font-semibold">Source Syllabus Verification Note: </strong>
            The original PDF establishes the mandatory Saturday 3-hour assessment requirement and defines the topics covered. These questions are structured practice assessments directly aligned to that week's syllabus content.
          </div>

          {/* Action Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleStartExam}
              disabled={!isUnlocked}
              className="px-6 py-3 bg-[#E7826D] hover:bg-[#D66F5A] active:bg-[#C85D48] text-white rounded-xl text-sm font-bold shadow-md shadow-[#E7826D]/30 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{existingSubmission ? 'Retake 3-Hour Assessment' : 'Start 3-Hour Assessment'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE 3-HOUR EXAM INTERFACE */}
      {isExamActive && (
        <div className="space-y-6">
          {/* Persistent Exam Timer Bar */}
          <div className="sticky top-18 z-30 p-4 rounded-2xl bg-[#292929] text-white border border-[#292929] shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E7826D] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#E0DCD3]">
                Week {currentAssessment.weekNumber} Assessment In Progress
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10">
                <Clock className="w-4 h-4 text-[#E7826D]" />
                <span className="font-mono text-base font-extrabold text-[#E7826D] tabular-nums">
                  {formatExamTime(examRemainingSeconds)}
                </span>
              </div>

              <button
                onClick={calculateAndSubmit}
                className="px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold cursor-pointer shadow-md transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Exam</span>
              </button>
            </div>
          </div>

          {/* Questions Container */}
          <div className="space-y-6">
            {currentAssessment.questions.map((q, idx) => (
              <div key={q.id} className="bg-white border border-[#E0DCD3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#FAF8F5] text-[#E7826D] font-bold text-xs flex items-center justify-center font-mono border border-[#E0DCD3]">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
                      {q.type.replace('_', ' ')} · {q.points} Points
                    </span>
                  </div>
                </div>

                <p className="text-sm font-semibold text-[#292929] whitespace-pre-line leading-relaxed">
                  {q.prompt}
                </p>

                {/* Optional code snippet */}
                {q.codeSnippet && (
                  <pre className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] text-xs font-mono text-[#292929] overflow-x-auto">
                    {q.codeSnippet}
                  </pre>
                )}

                {/* MCQ Options */}
                {q.type === 'mcq' && q.options && (
                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswers[q.id] === optIdx;
                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleAnswerChange(q.id, optIdx)}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[#FAF8F5] border-[#E7826D] text-[#292929] font-semibold'
                              : 'bg-white border-[#E0DCD3] text-[#78716C] hover:bg-[#FAF8F5] hover:text-[#292929]'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'border-[#E7826D]' : 'border-[#A8A29E]'}`}>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-[#E7826D]" />}
                          </div>
                          <span className="leading-relaxed">{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Text Explanation Input */}
                {q.type !== 'mcq' && (
                  <div className="pt-1">
                    <textarea
                      rows={5}
                      value={(userAnswers[q.id] as string) || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      placeholder="Write your detailed technical explanation, architecture breakdown, or code solution here..."
                      className="w-full p-3 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs sm:text-sm text-[#292929] focus:outline-none focus:border-[#E7826D] focus:bg-white font-mono leading-relaxed"
                    />
                    <span className="text-[10px] text-[#78716C] mt-1 block">
                      Provide architectural justification and edge-case handling.
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Submit */}
          <div className="flex justify-end pt-4">
            <button
              onClick={calculateAndSubmit}
              className="px-8 py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-sm font-bold shadow-md shadow-[#16A34A]/30 flex items-center gap-2 cursor-pointer transition-all uppercase tracking-wider"
            >
              <Send className="w-4 h-4" />
              <span>Finalize & Submit Assessment</span>
            </button>
          </div>
        </div>
      )}

      {/* Submission Result Review Dialog */}
      {submissionResult && !isExamActive && (
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-6">
          <div className="text-center space-y-2 pb-4 border-b border-[#E0DCD3]">
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${submissionResult.passed ? 'bg-emerald-50 text-[#16A34A]' : 'bg-rose-50 text-[#DC2626]'} mb-2`}>
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-[#292929]">
              {submissionResult.passed ? 'Assessment Passed Successfully!' : 'Assessment Needs Revision'}
            </h2>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-extrabold font-mono text-[#292929] tabular-nums">
                {submissionResult.score} / {submissionResult.maxScore} Pts
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${submissionResult.passed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                {submissionResult.percentage}%
              </span>
            </div>
          </div>

          {/* Rubric Breakdown for Each Question */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
              Question Rubric & Model Explanations:
            </h3>

            {currentAssessment.questions.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#292929]">Q{idx + 1}: {q.prompt}</span>
                  <span className="font-mono text-[#E7826D] font-bold shrink-0 ml-2">{q.points} Pts</span>
                </div>
                <div className="text-xs text-[#78716C] leading-relaxed bg-white p-3 rounded-lg border border-[#E0DCD3]">
                  <strong className="text-[#292929] font-semibold">Model Answer & Rubric: </strong>
                  {q.rubricExplanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
