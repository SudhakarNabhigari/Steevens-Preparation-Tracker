import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  getAllAssessmentMetadata,
  getAssessmentMetadataForWeek,
  getUnlockedAssessmentForWeek
} from '../data/assessments';
import { getAssessmentLockStatus } from '../utils/assessmentLock';
import { DAILY_PREPARATION_START_ISO_IST } from '../utils/dailyLock';
import { OWNER_RELAUNCH_START_ISO_IST } from '../utils/relaunch';
import {
  AssessmentSubmission,
  Question,
  WeeklyReviewNotes,
  WrittenReviewStatus
} from '../types';
import {
  Award,
  Clock,
  CheckCircle2,
  Play,
  Send,
  Lock,
  Unlock,
  ExternalLink,
  Code2,
  FileText,
  CheckSquare,
  Square,
  AlertCircle,
  BookOpen,
  RotateCcw,
  Save,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

const EMPTY_REVIEW_NOTES: WeeklyReviewNotes = {
  strengths: '',
  weakTopics: '',
  mistakes: '',
  revisionActions: '',
  nextWeekRecommendations: ''
};

const DOMAIN_BADGE_STYLES: Record<string, string> = {
  python: 'bg-sky-50 text-sky-800 border-sky-200',
  genai: 'bg-purple-50 text-purple-800 border-purple-200',
  ml: 'bg-amber-50 text-amber-800 border-amber-200',
  rag: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  azure: 'bg-blue-50 text-blue-800 border-blue-200',
  dsa: 'bg-rose-50 text-rose-800 border-rose-200'
};

export const WeeklyAssessmentsPage: React.FC = () => {
  const {
    state,
    userRole,
    nowTimestamp,
    isSaturdayToday,
    submitAssessment,
    isAssessmentWeekUnlocked,
    startAssessmentAttempt,
    saveAssessmentDraftAnswer,
    updateAssessmentAttemptElapsed,
    cancelAssessmentAttempt,
    updateAssessmentRubricReview,
    toggleAssessmentLeetCodeProblem,
    saveAssessmentLeetCodeNotes
  } = useApp();

  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [isExamActive, setIsExamActive] = useState<boolean>(false);
  const [examRemainingSeconds, setExamRemainingSeconds] = useState<number>(180 * 60);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | number>>({});
  const [activeTab, setActiveTab] = useState<'assessment' | 'leetcode' | 'review'>('assessment');
  const [reviewNotesDraft, setReviewNotesDraft] = useState<WeeklyReviewNotes>(EMPTY_REVIEW_NOTES);
  const [reviewSaveSuccess, setReviewSaveSuccess] = useState<boolean>(false);
  const [lcNotesDrafts, setLcNotesDrafts] = useState<Record<string, string>>({});
  const [lcSavedId, setLcSavedId] = useState<string | null>(null);
  const scheduleStart = userRole === 'owner' ? OWNER_RELAUNCH_START_ISO_IST : DAILY_PREPARATION_START_ISO_IST;

  const allMetadata = useMemo(() => getAllAssessmentMetadata(scheduleStart), [scheduleStart]);
  const currentMeta = useMemo(
    () => getAssessmentMetadataForWeek(selectedWeek, scheduleStart) || allMetadata[0],
    [selectedWeek, allMetadata, scheduleStart]
  );

  // Strict real-clock IST gate (identical for Owner & Guest, cannot be bypassed by simulation)
  const lockStatus = useMemo(
    () => getAssessmentLockStatus(selectedWeek, nowTimestamp, scheduleStart),
    [selectedWeek, nowTimestamp, scheduleStart]
  );
  const isUnlocked = isAssessmentWeekUnlocked(selectedWeek) && lockStatus.isUnlocked;

  // NEVER resolve full assessment (questions, answers, keys, LeetCode links) unless strictly unlocked in IST
  const unlockedAssessment = useMemo(() => {
    if (!isUnlocked) return null;
    return getUnlockedAssessmentForWeek(selectedWeek, nowTimestamp, scheduleStart);
  }, [isUnlocked, selectedWeek, nowTimestamp, scheduleStart]);

  const existingSubmission: AssessmentSubmission | undefined = isUnlocked
    ? state.assessmentSubmissions[selectedWeek]
    : undefined;

  const activeAttemptForWeek =
    isUnlocked && state.activeAssessmentAttempt?.weekNumber === selectedWeek
      ? state.activeAssessmentAttempt
      : null;

  // Reset UI view cleanly when switching weeks
  useEffect(() => {
    setIsExamActive(false);
    if (activeAttemptForWeek) {
      setUserAnswers(activeAttemptForWeek.answers || {});
      setExamRemainingSeconds(Math.max(0, 180 * 60 - (activeAttemptForWeek.elapsedSeconds || 0)));
    } else {
      setUserAnswers({});
      setExamRemainingSeconds(180 * 60);
    }
    setReviewNotesDraft(existingSubmission?.reviewNotes || EMPTY_REVIEW_NOTES);
    setReviewSaveSuccess(false);
  }, [selectedWeek]);

  // Sync review notes when existing submission updates
  useEffect(() => {
    if (existingSubmission?.reviewNotes) {
      setReviewNotesDraft(existingSubmission.reviewNotes);
    } else {
      setReviewNotesDraft(EMPTY_REVIEW_NOTES);
    }
  }, [existingSubmission?.submittedAt, selectedWeek]);

  // Sync local LC notes drafts cleanly when week changes
  useEffect(() => {
    if (!unlockedAssessment) {
      setLcNotesDrafts({});
      return;
    }
    const nextDrafts: Record<string, string> = {};
    unlockedAssessment.leetcodeProblems.forEach(p => {
      nextDrafts[p.id] = state.leetcodeProgress?.[p.id]?.notes || '';
    });
    setLcNotesDrafts(nextDrafts);
  }, [selectedWeek, unlockedAssessment, state.leetcodeProgress]);

  // Summary metrics across all 26 weeks
  const dashboardSummary = useMemo(() => {
    let unlockedCount = 0;
    let passedCount = 0;
    let submittedCount = 0;
    let pctSum = 0;
    let solvedLeetCodeCount = 0;

    for (let wk = 1; wk <= 26; wk++) {
      const wkUnlocked = getAssessmentLockStatus(wk, nowTimestamp, scheduleStart).isUnlocked;
      if (wkUnlocked) {
        unlockedCount++;
        const sub = state.assessmentSubmissions[wk];
        if (sub) {
          submittedCount++;
          pctSum += sub.percentage;
          if (sub.passed) passedCount++;
        }
      }
    }

    for (const [probId, entry] of Object.entries(state.leetcodeProgress || {})) {
      const match = /^w(\d+)_/.exec(probId);
      const wk = match ? Number(match[1]) : 0;
      if (wk > 0 && getAssessmentLockStatus(wk, nowTimestamp, scheduleStart).isUnlocked && entry?.completed) {
        solvedLeetCodeCount++;
      }
    }

    return {
      unlockedCount,
      passedCount,
      submittedCount,
      avgPct: submittedCount > 0 ? Math.round(pctSum / submittedCount) : null,
      solvedLeetCodeCount
    };
  }, [nowTimestamp, scheduleStart, state.assessmentSubmissions, state.leetcodeProgress]);

  // 3-hour exam countdown timer (ticks only during active unlocked exam)
  useEffect(() => {
    if (!isExamActive || !isUnlocked || !unlockedAssessment) return;

    const interval = setInterval(() => {
      setExamRemainingSeconds(prev => {
        if (prev <= 1) {
          handleSubmitExam(userAnswers, 180 * 60);
          return 0;
        }
        const nextRemaining = prev - 1;
        const elapsed = 180 * 60 - nextRemaining;
        if (elapsed % 5 === 0) {
          updateAssessmentAttemptElapsed(selectedWeek, elapsed);
        }
        return nextRemaining;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isExamActive, isUnlocked, unlockedAssessment, selectedWeek, userAnswers]);

  const handleStartOrResumeExam = () => {
    if (!isUnlocked || !unlockedAssessment) return;
    const res = startAssessmentAttempt(selectedWeek);
    if (!res.success) return;

    if (activeAttemptForWeek) {
      setUserAnswers(activeAttemptForWeek.answers || {});
      setExamRemainingSeconds(Math.max(1, 180 * 60 - (activeAttemptForWeek.elapsedSeconds || 0)));
    } else {
      setUserAnswers({});
      setExamRemainingSeconds(180 * 60);
    }
    setIsExamActive(true);
    setActiveTab('assessment');
  };

  const handleAnswerChange = (questionId: string, val: string | number) => {
    if (!isUnlocked) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: val }));
    saveAssessmentDraftAnswer(selectedWeek, questionId, val);
  };

  const handleSaveAndExitDraft = () => {
    if (!isUnlocked) return;
    updateAssessmentAttemptElapsed(selectedWeek, 180 * 60 - examRemainingSeconds);
    setIsExamActive(false);
  };

  const handleSubmitExam = (
    answersOverride?: Record<string, string | number>,
    elapsedOverride?: number
  ) => {
    if (!isUnlocked || !unlockedAssessment) return;

    const finalAnswers = answersOverride || userAnswers;
    const finalElapsed =
      elapsedOverride !== undefined ? elapsedOverride : Math.max(1, 180 * 60 - examRemainingSeconds);

    const ok = submitAssessment({
      weekNumber: selectedWeek,
      answers: finalAnswers,
      score: 0,
      maxScore: unlockedAssessment.totalPoints,
      percentage: 0,
      passed: false,
      submittedAt: new Date().toISOString(),
      timeSpentSeconds: finalElapsed,
      reviewNotes: reviewNotesDraft
    });

    if (ok) {
      setIsExamActive(false);
      setActiveTab('review');
    }
  };

  const handleRubricStatusChange = (questionId: string, status: WrittenReviewStatus) => {
    if (!isUnlocked || !existingSubmission) return;
    const nextReviews: Record<string, WrittenReviewStatus> = {
      ...(existingSubmission.writtenSelfReviews || {}),
      [questionId]: status
    };
    const prevPassed = existingSubmission.passed;
    const ok = updateAssessmentRubricReview(selectedWeek, nextReviews, reviewNotesDraft);
    if (ok && !prevPassed) {
      const qs = existingSubmission.snapshot?.questions || unlockedAssessment?.questions || [];
      const q = qs.find(item => item.id === questionId);
      if (q && status === 'full') {
        try {
          confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
        } catch {
          // ignore confetti error
        }
      }
    }
  };

  const handleSaveReviewNotes = () => {
    if (!isUnlocked || !existingSubmission) return;
    const ok = updateAssessmentRubricReview(
      selectedWeek,
      existingSubmission.writtenSelfReviews || {},
      reviewNotesDraft
    );
    if (ok) {
      setReviewSaveSuccess(true);
      setTimeout(() => setReviewSaveSuccess(false), 2500);
    }
  };

  const formatExamTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  };

  const inspectionQuestions: Question[] = useMemo(() => {
    if (!isUnlocked) return [];
    if (existingSubmission?.snapshot?.questions?.length) {
      return existingSubmission.snapshot.questions;
    }
    return unlockedAssessment?.questions || [];
  }, [isUnlocked, existingSubmission, unlockedAssessment]);

  const inspectionLeetCode = useMemo(() => {
    if (!isUnlocked) return [];
    if (existingSubmission?.snapshot?.leetcodeProblems?.length) {
      return existingSubmission.snapshot.leetcodeProblems;
    }
    return unlockedAssessment?.leetcodeProblems || [];
  }, [isUnlocked, existingSubmission, unlockedAssessment]);

  const mcqQuestions = useMemo(
    () => (unlockedAssessment?.questions || []).filter(q => q.type === 'mcq'),
    [unlockedAssessment]
  );
  const codingQuestions = useMemo(
    () =>
      (unlockedAssessment?.questions || []).filter(
        q => q.type === 'debugging' || q.type === 'coding'
      ),
    [unlockedAssessment]
  );
  const writtenQuestions = useMemo(
    () =>
      (unlockedAssessment?.questions || []).filter(
        q => q.type === 'short_answer' || q.type === 'architecture'
      ),
    [unlockedAssessment]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
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
                Saturday 3-hour checkpoint exam + 5 LeetCode DSA problems covering Python, ML, GenAI, RAG, Azure & C++ DSA.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-[#E7826D] text-white text-xs font-bold rounded-lg shrink-0">
            Mandatory
          </span>
        </div>
      )}

      {/* Header + Week Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E0DCD3]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292929] tracking-tight">
            26-WEEK WEEKLY ASSESSMENTS
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            23 Nov 2026 – 21 May 2027 · Strict 00:00 IST date lock · 100 Pts/Week + 130 Verified LeetCode Problems.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-[#78716C] font-semibold">Select Week:</span>
          <select
            value={selectedWeek}
            onChange={e => {
              const wk = Number(e.target.value);
              setSelectedWeek(wk);
              if (activeTab === 'review') setActiveTab('assessment');
            }}
            className="px-3 py-2 bg-white border border-[#E0DCD3] rounded-xl text-xs sm:text-sm text-[#292929] focus:outline-none focus:border-[#E7826D] cursor-pointer shadow-sm"
          >
            {allMetadata.map(meta => {
              const wkUnlocked = getAssessmentLockStatus(meta.weekNumber, nowTimestamp, scheduleStart).isUnlocked;
              const sub = wkUnlocked ? state.assessmentSubmissions[meta.weekNumber] : undefined;
              const statusTag = !wkUnlocked
                ? `Locked until ${meta.scheduledDate}`
                : sub
                ? `Scored ${sub.percentage}%`
                : 'Unlocked';
              return (
                <option key={meta.weekNumber} value={meta.weekNumber}>
                  Week {meta.weekNumber} — {statusTag}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E0DCD3] rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] font-semibold text-[#78716C] block mb-1">Weeks Unlocked</span>
          <span className="text-xl font-bold font-mono text-[#292929] tabular-nums">
            {dashboardSummary.unlockedCount} / 26
          </span>
          <span className="text-[10px] text-[#A8A29E] block mt-0.5">00:00 IST real clock</span>
        </div>

        <div className="bg-white border border-[#E0DCD3] rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] font-semibold text-[#78716C] block mb-1">Exams Passed</span>
          <span className="text-xl font-bold font-mono text-[#16A34A] tabular-nums">
            {dashboardSummary.passedCount} / 26
          </span>
          <span className="text-[10px] text-[#A8A29E] block mt-0.5">70% pass threshold</span>
        </div>

        <div className="bg-white border border-[#E0DCD3] rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] font-semibold text-[#78716C] block mb-1">Average Score</span>
          <span className="text-xl font-bold font-mono text-[#E7826D] tabular-nums">
            {dashboardSummary.avgPct !== null ? `${dashboardSummary.avgPct}%` : '--'}
          </span>
          <span className="text-[10px] text-[#A8A29E] block mt-0.5">
            {dashboardSummary.submittedCount} submitted
          </span>
        </div>

        <div className="bg-white border border-[#E0DCD3] rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] font-semibold text-[#78716C] block mb-1">LeetCode Solved</span>
          <span className="text-xl font-bold font-mono text-[#292929] tabular-nums">
            {dashboardSummary.solvedLeetCodeCount} / 130
          </span>
          <span className="text-[10px] text-[#A8A29E] block mt-0.5">User-confirmed tracking</span>
        </div>
      </div>

      {/* All 26 Weeks Interactive Checkpoint Strip */}
      <div className="bg-white border border-[#E0DCD3] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-[#292929] uppercase tracking-wider">
            26-Week Assessment Checkpoint Grid (Click Any Week)
          </span>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#78716C]">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#A8A29E]" /> Locked (IST)
            </span>
            <span className="flex items-center gap-1">
              <Unlock className="w-3 h-3 text-[#E7826D]" /> Unlocked
            </span>
            <span className="flex items-center gap-1 text-[#16A34A] font-semibold">
              <CheckCircle2 className="w-3 h-3" /> Passed
            </span>
          </div>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-13 gap-1.5">
          {allMetadata.map(meta => {
            const wk = meta.weekNumber;
            const wkUnlocked = getAssessmentLockStatus(wk, nowTimestamp, scheduleStart).isUnlocked;
            const sub = wkUnlocked ? state.assessmentSubmissions[wk] : undefined;
            const hasDraft = wkUnlocked && state.activeAssessmentAttempt?.weekNumber === wk;
            const isSelected = selectedWeek === wk;

            let styleClass =
              'bg-[#FAF8F5] text-[#A8A29E] border-[#E0DCD3] hover:border-[#292929]';
            if (wkUnlocked) {
              if (sub?.passed) {
                styleClass = 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold';
              } else if (sub && !sub.passed) {
                styleClass = 'bg-rose-50 text-rose-700 border-rose-300 font-bold';
              } else if (hasDraft) {
                styleClass = 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
              } else {
                styleClass = 'bg-white text-[#292929] border-[#E7826D]/60 font-semibold';
              }
            }

            return (
              <button
                key={wk}
                onClick={() => {
                  setSelectedWeek(wk);
                  if (activeTab === 'review') setActiveTab('assessment');
                }}
                title={`Week ${wk} (${meta.scheduledDate}) — ${
                  wkUnlocked ? (sub ? `${sub.percentage}%` : 'Unlocked') : `Locked until ${meta.scheduledDate} 00:00 IST`
                }`}
                className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${styleClass} ${
                  isSelected ? 'ring-2 ring-[#E7826D] ring-offset-1' : ''
                }`}
              >
                <div className="flex items-center gap-0.5 text-[11px] font-mono">
                  {!wkUnlocked && <Lock className="w-2.5 h-2.5 shrink-0" />}
                  <span>W{wk}</span>
                </div>
                <span className="text-[9px] font-mono opacity-80 truncate max-w-full">
                  {wk === 26 ? '21 May' : meta.scheduledDate.slice(0, 6)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top-Level Assessment Section Tabs (Always Accessible: Overview | LeetCode Practice | Review) */}
      {!isExamActive && (
        <div className="flex flex-wrap items-center gap-2 border-b border-[#E0DCD3] pb-3">
          <button
            onClick={() => setActiveTab('assessment')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
              activeTab === 'assessment'
                ? 'bg-[#292929] text-white'
                : 'bg-white text-[#292929] border border-[#E0DCD3] hover:bg-[#FAF8F5]'
            }`}
          >
            Assessment Overview
          </button>
          <button
            onClick={() => setActiveTab('leetcode')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'leetcode'
                ? 'bg-[#292929] text-white'
                : 'bg-white text-[#292929] border border-[#E0DCD3] hover:bg-[#FAF8F5]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-[#E7826D]" />
            <span>
              LeetCode Practice
              {isUnlocked && unlockedAssessment
                ? ` (${inspectionLeetCode.filter(p => state.leetcodeProgress?.[p.id]?.completed).length}/${unlockedAssessment.leetcodeProblems.length})`
                : ' (Locked)'}
            </span>
          </button>
          {isUnlocked && existingSubmission && (
            <button
              onClick={() => setActiveTab('review')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTab === 'review'
                  ? 'bg-[#292929] text-white'
                  : 'bg-white text-[#292929] border border-[#E0DCD3] hover:bg-[#FAF8F5]'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#E7826D]" />
              <span>Rubric Grading & Weekly Review ({existingSubmission.percentage}%)</span>
            </button>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* STRICT LOCKED VIEW: ASSESSMENT OVERVIEW (zero questions/keys exposed) */}
      {/* ===================================================================== */}
      {!isUnlocked && activeTab !== 'leetcode' && (
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E0DCD3] pb-5">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-md bg-[#292929] text-white font-bold flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#E7826D]" />
                  <span>WEEK {currentMeta.weekNumber} LOCKED</span>
                </span>
                <span className="text-[#A8A29E]">·</span>
                <span className="text-[#78716C] font-mono font-semibold">
                  Unlocks: {lockStatus.unlockLabelIst}
                </span>
                <span className="text-[#A8A29E]">·</span>
                <span className="text-[#78716C]">Study Window: {currentMeta.studyWindow}</span>
              </div>
              <h2 className="text-xl font-bold text-[#292929] pt-1">{currentMeta.title}</h2>
              <p className="text-xs text-[#78716C]">
                Module: <strong className="text-[#292929]">{currentMeta.moduleTitle}</strong>
              </p>
            </div>

            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200 flex items-center gap-1.5 shrink-0 self-start">
              <Lock className="w-3.5 h-3.5 text-[#E7826D]" />
              <span>LOCKED UNTIL {currentMeta.scheduledDate.toUpperCase()}</span>
            </span>
          </div>

          {/* Strict IST Enforcement Notice + Live Countdown */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E0DCD3] space-y-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#E7826D] shrink-0 mt-0.5" />
              <div className="text-xs text-[#78716C] leading-relaxed">
                <strong className="text-[#292929] block mb-1">
                  Strict Asia/Kolkata (IST) Date Lock Active
                </strong>
                All assessment questions, MCQ options, coding prompts, answer rubrics, and weekly LeetCode links remain strictly hidden until{' '}
                <strong className="text-[#292929] font-mono">{lockStatus.unlockLabelIst}</strong>. This lock applies equally to Owner and Guest and cannot be bypassed via role switching, URL navigation, or workspace date simulation.
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto pt-1">
              <div className="bg-white border border-[#E0DCD3] rounded-xl p-3 text-center">
                <span className="text-2xl font-extrabold font-mono text-[#292929] tabular-nums block">
                  {String(lockStatus.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">
                  Days
                </span>
              </div>
              <div className="bg-white border border-[#E0DCD3] rounded-xl p-3 text-center">
                <span className="text-2xl font-extrabold font-mono text-[#292929] tabular-nums block">
                  {String(lockStatus.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">
                  Hours
                </span>
              </div>
              <div className="bg-white border border-[#E0DCD3] rounded-xl p-3 text-center">
                <span className="text-2xl font-extrabold font-mono text-[#292929] tabular-nums block">
                  {String(lockStatus.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">
                  Minutes
                </span>
              </div>
              <div className="bg-white border border-[#E0DCD3] rounded-xl p-3 text-center">
                <span className="text-2xl font-extrabold font-mono text-[#E7826D] tabular-nums block">
                  {String(lockStatus.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">
                  Seconds
                </span>
              </div>
            </div>
          </div>

          {/* Safe Assessment Structure Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
              <span className="text-[11px] text-[#78716C] font-semibold block mb-1">Exam Duration</span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#292929]">
                <Clock className="w-4 h-4 text-[#E7826D]" />
                <span>3 Hours (180 Minutes)</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
              <span className="text-[11px] text-[#78716C] font-semibold block mb-1">Scoring & Pass Gate</span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#292929]">
                <Award className="w-4 h-4 text-[#E7826D]" />
                <span>
                  {currentMeta.passThreshold}% ({currentMeta.totalPoints} Pts Total)
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
              <span className="text-[11px] text-[#78716C] font-semibold block mb-1">Assessment Blueprint</span>
              <span className="text-xs font-semibold text-[#292929]">
                {currentMeta.questionBreakdown.mcqCount} MCQs · {currentMeta.questionBreakdown.codingCount} Coding/Debug · {currentMeta.questionBreakdown.writtenCount} Written · {currentMeta.questionBreakdown.leetcodeCount} LeetCode
              </span>
            </div>
          </div>

          {/* Safe Weekly Topics Metadata Summary */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C] block mb-2">
                Week {currentMeta.weekNumber} Syllabus Scope (Main Plan · DSA · Azure)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentMeta.topicsCovered.map((topic, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E0DCD3] text-xs text-[#292929]"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#E7826D] shrink-0" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {(currentMeta.dsaTopics.length > 0 || currentMeta.azureTopics.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {currentMeta.dsaTopics.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#292929] flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-[#E7826D]" />
                      <span>DSA Topics Covered</span>
                    </span>
                    <ul className="space-y-1 text-xs text-[#78716C]">
                      {currentMeta.dsaTopics.map((t, idx) => (
                        <li key={idx}>• {t}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentMeta.azureTopics.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#292929] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#E7826D]" />
                      <span>Azure Topics Covered</span>
                    </span>
                    <ul className="space-y-1 text-xs text-[#78716C]">
                      {currentMeta.azureTopics.map((t, idx) => (
                        <li key={idx}>• {t}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STRICT LOCKED VIEW: LEETCODE PRACTICE (only week #, unlock date, ETA) */}
      {/* ===================================================================== */}
      {!isUnlocked && activeTab === 'leetcode' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E0DCD3] pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs mb-1">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#292929] text-white font-bold flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-[#E7826D]" />
                    <span>WEEK {selectedWeek} LEETCODE PRACTICE LOCKED</span>
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[#292929]">
                  Week {selectedWeek} LeetCode Set
                </h2>
                <p className="text-xs text-[#78716C] mt-0.5">
                  Unlocks on <strong className="text-[#292929] font-mono">{lockStatus.unlockLabelIst}</strong>
                </p>
              </div>

              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200 flex items-center gap-1.5 shrink-0 self-start">
                <Lock className="w-3.5 h-3.5 text-[#E7826D]" />
                <span>LOCKED UNTIL {currentMeta.scheduledDate.toUpperCase()}</span>
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E0DCD3] space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#E7826D] shrink-0 mt-0.5" />
                <p className="text-xs text-[#5A5650] leading-relaxed">
                  All 5 LeetCode problems, titles, difficulty tags, topics, and official problem URLs for Week {selectedWeek} remain strictly hidden until{' '}
                  <strong className="text-[#292929] font-mono">{lockStatus.unlockLabelIst}</strong>.
                </p>
              </div>

              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto pt-1">
                <div className="bg-white border border-[#E0DCD3] rounded-xl p-3 text-center">
                  <span className="text-2xl font-extrabold font-mono text-[#292929] tabular-nums block">
                    {String(lockStatus.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">Days</span>
                </div>
                <div className="bg-white border border-[#E0DCD3] rounded-xl p-3 text-center">
                  <span className="text-2xl font-extrabold font-mono text-[#292929] tabular-nums block">
                    {String(lockStatus.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">Hours</span>
                </div>
                <div className="bg-white border border-[#E0DCD3] rounded-xl p-3 text-center">
                  <span className="text-2xl font-extrabold font-mono text-[#292929] tabular-nums block">
                    {String(lockStatus.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">Minutes</span>
                </div>
                <div className="bg-white border border-[#E0DCD3] rounded-xl p-3 text-center">
                  <span className="text-2xl font-extrabold font-mono text-[#E7826D] tabular-nums block">
                    {String(lockStatus.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">Seconds</span>
                </div>
              </div>
            </div>

            {/* 26-Week LeetCode Schedule Lock Overview (safe week # + unlock date + status only) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                All 26 Weeks LeetCode Schedule Status
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {allMetadata.map(meta => {
                    const st = getAssessmentLockStatus(meta.weekNumber, nowTimestamp, scheduleStart);
                    const unlockedWk = st.isUnlocked ? getUnlockedAssessmentForWeek(meta.weekNumber, nowTimestamp, scheduleStart) : null;
                  const solvedWk = unlockedWk
                    ? unlockedWk.leetcodeProblems.filter(p => state.leetcodeProgress?.[p.id]?.completed).length
                    : 0;
                  return (
                    <button
                      key={meta.weekNumber}
                      onClick={() => setSelectedWeek(meta.weekNumber)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        selectedWeek === meta.weekNumber
                          ? 'bg-[#FAF8F5] border-[#E7826D]'
                          : 'bg-white border-[#E0DCD3] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-[#292929] block">
                          Week {meta.weekNumber}
                        </span>
                        <span className="text-[11px] font-mono text-[#78716C]">
                          {st.unlockLabelIst}
                        </span>
                      </div>
                      {st.isUnlocked ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
                          {solvedWk}/5 Solved
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 text-[10px] font-mono font-bold flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          <span>{st.days}d left</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* UNLOCKED VIEW (when isUnlocked === true in real IST clock)            */}
      {/* ===================================================================== */}
      {isUnlocked && unlockedAssessment && (
        <>

          {/* TAB 1: OVERVIEW (not currently inside exam) */}
          {!isExamActive && activeTab === 'assessment' && (
            <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E0DCD3] pb-5">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] text-[#E7826D] font-bold border border-[#E0DCD3]">
                      Week {unlockedAssessment.weekNumber} Assessment
                    </span>
                    <span className="text-[#A8A29E]">·</span>
                    <span className="text-[#78716C] font-mono">
                      Unlocked: {lockStatus.unlockLabelIst}
                    </span>
                    <span className="text-[#A8A29E]">·</span>
                    <span className="text-[#78716C]">{unlockedAssessment.studyWindow}</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#292929] pt-1">
                    {unlockedAssessment.title}
                  </h2>
                  <p className="text-xs text-[#78716C]">
                    Covers module: <strong className="text-[#292929]">{unlockedAssessment.moduleTitle}</strong>
                  </p>
                </div>

                <div>
                  {existingSubmission ? (
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          existingSubmission.passed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {existingSubmission.passed ? 'PASSED' : 'NEEDS REVIEW / RETAKE'}
                      </span>
                      <div className="font-mono text-xs text-[#292929] mt-1.5 font-bold">
                        Score: {existingSubmission.score} / {existingSubmission.maxScore} (
                        {existingSubmission.percentage}%)
                      </div>
                    </div>
                  ) : activeAttemptForWeek ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      DRAFT IN PROGRESS ({Object.keys(activeAttemptForWeek.answers).length}/20)
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      UNLOCKED · READY TO START
                    </span>
                  )}
                </div>
              </div>

              {/* Exam Format Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
                  <span className="text-[11px] text-[#78716C] font-semibold block mb-1">Duration</span>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-[#292929]">
                    <Clock className="w-4 h-4 text-[#E7826D]" />
                    <span>3 Hours (180 Min)</span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
                  <span className="text-[11px] text-[#78716C] font-semibold block mb-1">
                    Section A (Auto-Graded)
                  </span>
                  <span className="text-sm font-bold text-[#292929]">15 MCQs · 60 Pts</span>
                </div>

                <div className="p-3.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
                  <span className="text-[11px] text-[#78716C] font-semibold block mb-1">
                    Sections B & C (Rubric)
                  </span>
                  <span className="text-sm font-bold text-[#292929]">
                    2 Coding + 3 Written · 40 Pts
                  </span>
                </div>

                <div className="p-3.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
                  <span className="text-[11px] text-[#78716C] font-semibold block mb-1">
                    Pass Threshold
                  </span>
                  <span className="text-sm font-bold text-[#292929]">
                    {unlockedAssessment.passThreshold}% (70 / 100 Pts)
                  </span>
                </div>
              </div>

              {/* Syllabus Covered */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#78716C] block">
                  Week {unlockedAssessment.weekNumber} Syllabus Covered:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {unlockedAssessment.topicsCovered.map((topic, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E0DCD3] text-xs text-[#292929]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                {activeAttemptForWeek && (
                  <button
                    onClick={() => cancelAssessmentAttempt(selectedWeek)}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E0DCD3] text-xs font-semibold text-[#78716C] flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Discard Saved Draft</span>
                  </button>
                )}

                <div className="flex flex-wrap items-center gap-3 ml-auto">
                  {existingSubmission && (
                    <button
                      onClick={() => setActiveTab('review')}
                      className="px-5 py-3 bg-[#292929] hover:bg-[#3F3F3F] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      Open Rubric Review ({existingSubmission.percentage}%)
                    </button>
                  )}

                  <button
                    onClick={handleStartOrResumeExam}
                    className="px-6 py-3 bg-[#E7826D] hover:bg-[#D66F5A] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#E7826D]/30 flex items-center gap-2 cursor-pointer transition-all uppercase tracking-wider"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>
                      {activeAttemptForWeek
                        ? 'Resume 3-Hour Assessment'
                        : existingSubmission
                        ? 'Retake 3-Hour Assessment'
                        : 'Start 3-Hour Assessment'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE 3-HOUR EXAM INTERFACE */}
          {isExamActive && (
            <div className="space-y-8">
              {/* Persistent Exam Timer Bar */}
              <div className="sticky top-18 z-30 p-4 rounded-2xl bg-[#292929] text-white border border-[#292929] shadow-xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E7826D] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E0DCD3]">
                    Week {unlockedAssessment.weekNumber} Assessment ·{' '}
                    {Object.keys(userAnswers).length} / {unlockedAssessment.questions.length} Answered
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10">
                    <Clock className="w-4 h-4 text-[#E7826D]" />
                    <span className="font-mono text-base font-extrabold text-[#E7826D] tabular-nums">
                      {formatExamTime(examRemainingSeconds)}
                    </span>
                  </div>

                  <button
                    onClick={handleSaveAndExitDraft}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
                  >
                    Save Draft & Exit
                  </button>

                  <button
                    onClick={() => handleSubmitExam()}
                    className="px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold cursor-pointer shadow-md transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Exam</span>
                  </button>
                </div>
              </div>

              {/* SECTION A: 15 MCQs */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#E0DCD3] pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#292929]">
                    Section A — Objective MCQs ({mcqQuestions.length} Questions · 60 Pts · Auto-Graded)
                  </h3>
                </div>

                {mcqQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="bg-white border border-[#E0DCD3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-lg bg-[#FAF8F5] text-[#E7826D] font-bold text-xs font-mono border border-[#E0DCD3]">
                          Q{idx + 1}
                        </span>
                        {q.domain && (
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                              DOMAIN_BADGE_STYLES[q.domain] || 'bg-stone-50 text-stone-700 border-stone-200'
                            }`}
                          >
                            {q.domain}
                          </span>
                        )}
                        <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
                          MCQ · Auto-Graded
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#292929]">
                        {q.points} Pts
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-[#292929] whitespace-pre-line leading-relaxed">
                      {q.prompt}
                    </p>

                    {q.codeSnippet && (
                      <pre className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] text-xs font-mono text-[#292929] overflow-x-auto">
                        {q.codeSnippet}
                      </pre>
                    )}

                    {q.options && (
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
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                                  isSelected ? 'border-[#E7826D]' : 'border-[#A8A29E]'
                                }`}
                              >
                                {isSelected && <span className="w-2 h-2 rounded-full bg-[#E7826D]" />}
                              </div>
                              <span className="leading-relaxed">{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* SECTION B: 2 Practical Coding / Debugging Challenges */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#E0DCD3] pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#292929]">
                    Section B — Practical Coding & Debugging ({codingQuestions.length} Challenges · 20 Pts · Self-Reported Rubric Review)
                  </h3>
                </div>

                {codingQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="bg-white border border-[#E0DCD3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-lg bg-[#FAF8F5] text-[#E7826D] font-bold text-xs font-mono border border-[#E0DCD3]">
                          Q{mcqQuestions.length + idx + 1}
                        </span>
                        {q.domain && (
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                              DOMAIN_BADGE_STYLES[q.domain] || 'bg-stone-50 text-stone-700 border-stone-200'
                            }`}
                          >
                            {q.domain}
                          </span>
                        )}
                        <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
                          {q.type} · Self-Reported Rubric Review
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#292929]">
                        {q.points} Pts
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-[#292929] whitespace-pre-line leading-relaxed">
                      {q.prompt}
                    </p>

                    {q.codeSnippet && (
                      <pre className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] text-xs font-mono text-[#292929] overflow-x-auto">
                        {q.codeSnippet}
                      </pre>
                    )}

                    <textarea
                      rows={6}
                      value={(userAnswers[q.id] as string) || ''}
                      onChange={e => handleAnswerChange(q.id, e.target.value)}
                      placeholder="Write your code implementation, root-cause fix, and edge-case handling here..."
                      className="w-full p-3 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs sm:text-sm text-[#292929] focus:outline-none focus:border-[#E7826D] focus:bg-white font-mono leading-relaxed"
                    />
                  </div>
                ))}
              </div>

              {/* SECTION C: 3 Short-Answer / Architecture Design */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#E0DCD3] pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#292929]">
                    Section C — Short-Answer & Architecture Design ({writtenQuestions.length} Questions · 20 Pts · Rubric Review)
                  </h3>
                </div>

                {writtenQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="bg-white border border-[#E0DCD3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-lg bg-[#FAF8F5] text-[#E7826D] font-bold text-xs font-mono border border-[#E0DCD3]">
                          Q{mcqQuestions.length + codingQuestions.length + idx + 1}
                        </span>
                        {q.domain && (
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                              DOMAIN_BADGE_STYLES[q.domain] || 'bg-stone-50 text-stone-700 border-stone-200'
                            }`}
                          >
                            {q.domain}
                          </span>
                        )}
                        <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
                          {q.type.replace('_', ' ')} · Rubric Review
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#292929]">
                        {q.points} Pts
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-[#292929] whitespace-pre-line leading-relaxed">
                      {q.prompt}
                    </p>

                    <textarea
                      rows={5}
                      value={(userAnswers[q.id] as string) || ''}
                      onChange={e => handleAnswerChange(q.id, e.target.value)}
                      placeholder="Write your architectural justification, failure modes, and technical explanation..."
                      className="w-full p-3 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs sm:text-sm text-[#292929] focus:outline-none focus:border-[#E7826D] focus:bg-white leading-relaxed"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleSubmitExam()}
                  className="px-8 py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-sm font-bold shadow-md shadow-[#16A34A]/30 flex items-center gap-2 cursor-pointer transition-all uppercase tracking-wider"
                >
                  <Send className="w-4 h-4" />
                  <span>Finalize & Grade MCQs</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: WEEKLY LEETCODE DSA SET (5 Verified Official Problems) */}
          {!isExamActive && activeTab === 'leetcode' && (
            <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E0DCD3] pb-4">
                <div>
                  <h2 className="text-lg font-bold text-[#292929]">
                    Week {unlockedAssessment.weekNumber} LeetCode DSA Practice Set (5 Verified Problems)
                  </h2>
                  <p className="text-xs text-[#78716C] mt-1">
                    Manual / user-confirmed problem tracking. Solve each problem on LeetCode using the official link, then check completion and record personal complexity notes here.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E0DCD3] text-xs font-mono font-bold text-[#292929] shrink-0">
                  {
                    inspectionLeetCode.filter(p => state.leetcodeProgress?.[p.id]?.completed).length
                  }{' '}
                  / {inspectionLeetCode.length} Solved
                </span>
              </div>

              <div className="space-y-3">
                {inspectionLeetCode.map(prob => {
                  const prog = state.leetcodeProgress?.[prob.id];
                  const isDone = !!prog?.completed;
                  const diffBadge =
                    prob.difficulty === 'Easy'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : prob.difficulty === 'Medium'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200';

                  return (
                    <div
                      key={prob.id}
                      className={`p-4 rounded-xl border transition-colors space-y-3 ${
                        isDone
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-[#FAF8F5] border-[#E0DCD3]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleAssessmentLeetCodeProblem(selectedWeek, prob.id)}
                            className="mt-0.5 text-[#E7826D] hover:text-[#D66F5A] cursor-pointer shrink-0"
                            title={isDone ? 'Mark unsolved' : 'Mark solved (user-confirmed)'}
                          >
                            {isDone ? (
                              <CheckSquare className="w-5 h-5 text-[#16A34A]" />
                            ) : (
                              <Square className="w-5 h-5" />
                            )}
                          </button>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#78716C]">
                                #{prob.frontendId}
                              </span>
                              <span className="text-sm font-bold text-[#292929]">{prob.title}</span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${diffBadge}`}
                              >
                                {prob.difficulty}
                              </span>
                            </div>
                            <span className="text-xs text-[#78716C] block mt-0.5">
                              DSA Topic: {prob.dsaTopic}
                            </span>
                          </div>
                        </div>

                        <a
                          href={prob.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-[#292929] hover:bg-[#3F3F3F] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                        >
                          <span>Solve on LeetCode</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#E7826D]" />
                        </a>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pl-8">
                        <input
                          type="text"
                          value={lcNotesDrafts[prob.id] ?? ''}
                          onChange={e =>
                            setLcNotesDrafts(prev => ({ ...prev, [prob.id]: e.target.value }))
                          }
                          placeholder="Personal notes: approach, C++ STL trick, time/space complexity..."
                          className="flex-1 px-3 py-1.5 bg-white border border-[#E0DCD3] rounded-lg text-xs text-[#292929] focus:outline-none focus:border-[#E7826D]"
                        />
                        <button
                          onClick={() => {
                            const ok = saveAssessmentLeetCodeNotes(
                              selectedWeek,
                              prob.id,
                              lcNotesDrafts[prob.id] || ''
                            );
                            if (ok) {
                              setLcSavedId(prob.id);
                              setTimeout(() => setLcSavedId(null), 1500);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF8F5] border border-[#E0DCD3] text-xs font-semibold text-[#292929] cursor-pointer shrink-0"
                        >
                          {lcSavedId === prob.id ? 'Saved!' : 'Save Note'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: AUTHENTIC GRADING, RUBRIC SELF-REVIEW & WEEKLY REVIEW */}
          {!isExamActive && activeTab === 'review' && existingSubmission && (
            <div className="space-y-6">
              {/* Score Breakdown Header */}
              <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E0DCD3] pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        existingSubmission.passed
                          ? 'bg-emerald-50 text-[#16A34A]'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      <Award className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#292929]">
                        Week {selectedWeek} Authentic Score & Rubric Review
                      </h2>
                      <p className="text-xs text-[#78716C]">
                        Submitted {new Date(existingSubmission.submittedAt).toLocaleString()} ·
                        Snapshot preserved
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-2xl font-extrabold font-mono text-[#292929] tabular-nums block">
                        {existingSubmission.score} / {existingSubmission.maxScore} Pts
                      </span>
                      <span className="text-[11px] text-[#78716C] font-mono">
                        Pass Gate: {unlockedAssessment.passThreshold}%
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        existingSubmission.passed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {existingSubmission.percentage}% ·{' '}
                      {existingSubmission.passed ? 'PASSED' : 'NEEDS REVISION'}
                    </span>
                  </div>
                </div>

                {/* Deterministic vs Self-Reported Split */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3]">
                    <span className="text-[#78716C] font-semibold block mb-1">
                      Section A · Auto-Graded MCQs
                    </span>
                    <span className="text-lg font-bold font-mono text-[#292929]">
                      {existingSubmission.mcqScore ?? 0} / {existingSubmission.mcqMaxScore ?? 60} Pts
                    </span>
                    <span className="text-[10px] text-[#A8A29E] block">
                      Deterministic answer-key check
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3]">
                    <span className="text-[#78716C] font-semibold block mb-1">
                      Sections B & C · Rubric Self-Review
                    </span>
                    <span className="text-lg font-bold font-mono text-[#E7826D]">
                      {existingSubmission.writtenReviewScore ?? 0} /{' '}
                      {existingSubmission.writtenMaxScore ?? 40} Pts
                    </span>
                    <span className="text-[10px] text-[#A8A29E] block">
                      Explicit self-reported verification (0 until reviewed)
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3]">
                    <span className="text-[#78716C] font-semibold block mb-1">
                      Pending Rubric Reviews
                    </span>
                    <span className="text-lg font-bold font-mono text-[#292929]">
                      {
                        inspectionQuestions.filter(
                          q =>
                            q.type !== 'mcq' &&
                            (!existingSubmission.writtenSelfReviews?.[q.id] ||
                              existingSubmission.writtenSelfReviews[q.id] === 'pending')
                        ).length
                      }{' '}
                      / {inspectionQuestions.filter(q => q.type !== 'mcq').length}
                    </span>
                    <span className="text-[10px] text-[#A8A29E] block">
                      Grade your coding & written answers below
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Authentic Grading Policy:</strong> Coding and written questions do not receive automatic points for text length. Compare each written/code answer honestly against its Model Answer & Rubric below and select Pending, Needs Revision (0%), Partial (50%), or Full Match (100%).
                  </span>
                </div>
              </div>

              {/* Question-by-Question Review */}
              <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                  Detailed Question Breakdown (Historical Snapshot · {inspectionQuestions.length} Questions)
                </h3>

                {inspectionQuestions.map((q, idx) => {
                  const ans = existingSubmission.answers[q.id];
                  const isMcq = q.type === 'mcq';
                  const isMcqCorrect =
                    isMcq && ans !== undefined && ans !== '' && Number(ans) === Number(q.correctAnswer);
                  const reviewStatus: WrittenReviewStatus =
                    existingSubmission.writtenSelfReviews?.[q.id] || 'pending';

                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] space-y-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 text-xs">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#E7826D]">Q{idx + 1}</span>
                            <span className="uppercase font-bold text-[#78716C]">
                              {q.type.replace('_', ' ')}
                            </span>
                            {q.domain && (
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                  DOMAIN_BADGE_STYLES[q.domain] || ''
                                }`}
                              >
                                {q.domain}
                              </span>
                            )}
                          </div>
                          <p className="font-bold text-[#292929] text-xs sm:text-sm whitespace-pre-line">
                            {q.prompt}
                          </p>
                        </div>

                        <div className="shrink-0 text-right font-mono font-bold">
                          {isMcq ? (
                            <span className={isMcqCorrect ? 'text-[#16A34A]' : 'text-[#DC2626]'}>
                              {isMcqCorrect ? `+${q.points}` : '0'} / {q.points} Pts
                            </span>
                          ) : (
                            <span className="text-[#292929]">
                              {reviewStatus === 'full'
                                ? q.points
                                : reviewStatus === 'partial'
                                ? Math.round(q.points * 0.5)
                                : 0}{' '}
                              / {q.points} Pts
                            </span>
                          )}
                        </div>
                      </div>

                      {isMcq && q.options ? (
                        <div className="text-xs space-y-1 bg-white p-3 rounded-lg border border-[#E0DCD3]">
                          <div>
                            <strong className="text-[#78716C]">Your Choice: </strong>
                            <span className={isMcqCorrect ? 'text-[#16A34A] font-semibold' : 'text-[#DC2626] font-semibold'}>
                              {ans !== undefined && ans !== '' && q.options[Number(ans)]
                                ? q.options[Number(ans)]
                                : 'No option selected'}
                            </span>
                          </div>
                          {!isMcqCorrect && q.options[Number(q.correctAnswer)] && (
                            <div>
                              <strong className="text-[#292929]">Correct Answer: </strong>
                              <span className="text-[#16A34A] font-semibold">
                                {q.options[Number(q.correctAnswer)]}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs bg-white p-3 rounded-lg border border-[#E0DCD3] space-y-2">
                          <strong className="text-[#78716C] block">Your Written / Code Response:</strong>
                          <pre className="whitespace-pre-wrap font-mono text-xs text-[#292929]">
                            {ans && String(ans).trim().length > 0
                              ? String(ans)
                              : '(No response recorded)'}
                          </pre>
                        </div>
                      )}

                      <div className="text-xs text-[#78716C] leading-relaxed bg-white p-3 rounded-lg border border-[#E0DCD3]">
                        <strong className="text-[#292929] font-semibold">
                          Model Answer & Rubric:{' '}
                        </strong>
                        {q.rubricExplanation}
                      </div>

                      {!isMcq && (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-[11px] font-bold text-[#78716C] uppercase mr-1">
                            Self-Reported Grade:
                          </span>
                          {(
                            [
                              { key: 'pending', label: 'Pending (0)' },
                              { key: 'needs_revision', label: 'Needs Revision (0)' },
                              {
                                key: 'partial',
                                label: `Partial 50% (+${Math.round(q.points * 0.5)})`
                              },
                              { key: 'full', label: `Full Match 100% (+${q.points})` }
                            ] as const
                          ).map(btn => (
                            <button
                              key={btn.key}
                              onClick={() => handleRubricStatusChange(q.id, btn.key)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer transition-colors ${
                                reviewStatus === btn.key
                                  ? btn.key === 'full'
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : btn.key === 'partial'
                                    ? 'bg-amber-500 text-white border-amber-500'
                                    : btn.key === 'needs_revision'
                                    ? 'bg-rose-600 text-white border-rose-600'
                                    : 'bg-[#292929] text-white border-[#292929]'
                                  : 'bg-white text-[#292929] border-[#E0DCD3] hover:bg-[#FAF8F5]'
                              }`}
                            >
                              {btn.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Weekly Review Section (Persistent Reflection & Next-Week Plan) */}
              <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E0DCD3] pb-3">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#292929]">
                      Week {selectedWeek} Structured Weekly Review
                    </h3>
                    <p className="text-xs text-[#78716C] mt-0.5">
                      Log verified strengths, weak areas, mistakes, revision drills, and next-week priorities.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveReviewNotes}
                    className="px-4 py-2 rounded-xl bg-[#E7826D] hover:bg-[#D66F5A] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{reviewSaveSuccess ? 'Review Saved!' : 'Save Weekly Review'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#292929] mb-1">Strengths</label>
                    <textarea
                      rows={3}
                      value={reviewNotesDraft.strengths}
                      onChange={e =>
                        setReviewNotesDraft(prev => ({ ...prev, strengths: e.target.value }))
                      }
                      placeholder="Topics, labs, or LeetCode patterns mastered this week..."
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#292929] mb-1">Weak Topics</label>
                    <textarea
                      rows={3}
                      value={reviewNotesDraft.weakTopics}
                      onChange={e =>
                        setReviewNotesDraft(prev => ({ ...prev, weakTopics: e.target.value }))
                      }
                      placeholder="Concepts requiring deeper walkthrough or lab practice..."
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#292929] mb-1">
                      Mistakes & Root Causes
                    </label>
                    <textarea
                      rows={3}
                      value={reviewNotesDraft.mistakes}
                      onChange={e =>
                        setReviewNotesDraft(prev => ({ ...prev, mistakes: e.target.value }))
                      }
                      placeholder="Missed MCQ assumptions, debugging bugs, edge cases..."
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#292929] mb-1">
                      Revision Actions
                    </label>
                    <textarea
                      rows={3}
                      value={reviewNotesDraft.revisionActions}
                      onChange={e =>
                        setReviewNotesDraft(prev => ({ ...prev, revisionActions: e.target.value }))
                      }
                      placeholder="Specific flashcards, Doubt Notebook entries, or drills to revisit..."
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D]"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block font-bold text-[#292929] mb-1">
                    Next-Week Recommendations
                  </label>
                  <textarea
                    rows={2}
                    value={reviewNotesDraft.nextWeekRecommendations}
                    onChange={e =>
                      setReviewNotesDraft(prev => ({
                        ...prev,
                        nextWeekRecommendations: e.target.value
                      }))
                    }
                    placeholder="Adjustments to daily study split (Main / DSA / Azure) for next week..."
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D]"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
