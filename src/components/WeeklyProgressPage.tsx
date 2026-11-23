import React from 'react';
import { useApp } from '../context/AppContext';
import { ALL_180_DAYS } from '../data/syllabus';
import {
  Award,
  TrendingUp
} from 'lucide-react';

export const WeeklyProgressPage: React.FC = () => {
  const {
    state,
    getDayStatus,
    getDayTaskCompletion,
    setSelectedDayNumber,
    setCurrentPage
  } = useApp();

  // Compute stats for all 26 weeks
  const totalWeeks = 26;
  const weeklyData = Array.from({ length: totalWeeks }, (_, i) => i + 1).map(wk => {
    const sourceDays = ALL_180_DAYS.filter(d => d.weekNumber === wk);
    const daysInWeek = sourceDays;
    if (daysInWeek.length === 0) return null;

    let totalTasksInWeek = 0;
    let completedTasksInWeek = 0;
    let totalPlannedHours = 0;
    let totalStudiedSeconds = 0;

    daysInWeek.forEach(day => {
      const { completed, total } = getDayTaskCompletion(day.dayNumber);
      completedTasksInWeek += completed;
      totalTasksInWeek += total;
      totalPlannedHours += day.targetHours;
      totalStudiedSeconds += state.studyTimeSeconds[day.dayNumber] || 0;
    });

    const pendingTasks = totalTasksInWeek - completedTasksInWeek;
    const taskCompletionPct = totalTasksInWeek > 0 ? Math.round((completedTasksInWeek / totalTasksInWeek) * 100) : 0;
    const studiedHours = (totalStudiedSeconds / 3600).toFixed(1);

    const assessmentSubmission = state.assessmentSubmissions[wk];
    const assessmentPassed = !!assessmentSubmission?.passed;
    const assessmentScore = assessmentSubmission ? `${assessmentSubmission.score}/${assessmentSubmission.maxScore} (${assessmentSubmission.percentage}%)` : 'Not Submitted';

    // A week is marked completed ONLY when:
    // 1. All learning tasks for that week are done
    // 2. The mandatory Saturday assessment is submitted & passed
    const isWeekFullyCompleted = totalTasksInWeek > 0 && completedTasksInWeek === totalTasksInWeek && assessmentPassed;

    const moduleTitle = daysInWeek[0]?.moduleTitle || 'RAG Preparation';
    const startDateStr = daysInWeek[0]?.dateString;
    const endDateStr = daysInWeek[daysInWeek.length - 1]?.dateString;

    return {
      weekNumber: wk,
      moduleTitle,
      startDateStr,
      endDateStr,
      days: daysInWeek,
      totalTasks: totalTasksInWeek,
      completedTasks: completedTasksInWeek,
      pendingTasks,
      taskCompletionPct,
      plannedHours: totalPlannedHours,
      studiedHours,
      assessmentPassed,
      assessmentScore,
      isWeekFullyCompleted
    };
  }).filter(Boolean);

  const completedWeeksCount = weeklyData.filter(w => w?.isWeekFullyCompleted).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0DCD3]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292929] tracking-tight">
            WEEKLY PROGRESS & MILESTONES
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            Rules: A week is marked complete ONLY when all 7 days of tasks are finished AND the mandatory Saturday assessment is passed.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E0DCD3] text-xs text-[#292929] shadow-sm">
          <TrendingUp className="w-4 h-4 text-[#E7826D]" />
          <span>Weeks Completed: <strong className="font-mono text-[#292929] font-bold">{completedWeeksCount} / {weeklyData.length}</strong></span>
        </div>
      </div>

      {/* Grid of Weeks */}
      <div className="space-y-4">
        {weeklyData.map(wk => {
          if (!wk) return null;

          return (
            <div
              key={wk.weekNumber}
              className={`bg-white border rounded-2xl p-5 sm:p-6 transition-all shadow-sm ${
                wk.isWeekFullyCompleted
                  ? 'border-emerald-300'
                  : wk.taskCompletionPct > 0
                  ? 'border-[#E7826D]/40'
                  : 'border-[#E0DCD3]'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E0DCD3]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#FAF8F5] text-[#E7826D] border border-[#E0DCD3]">
                      WEEK {wk.weekNumber}
                    </span>
                    <span className="text-[#A8A29E]">·</span>
                    <span className="text-[#78716C] font-semibold">{wk.startDateStr} – {wk.endDateStr}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#292929] pt-1">
                    {wk.moduleTitle}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      wk.isWeekFullyCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : wk.taskCompletionPct > 0
                        ? 'bg-[#E7826D]/15 text-[#E7826D] border border-[#E7826D]/30'
                        : 'bg-stone-100 text-stone-600 border border-stone-200'
                    }`}
                  >
                    {wk.isWeekFullyCompleted
                      ? 'WEEK COMPLETED'
                      : wk.taskCompletionPct > 0
                      ? 'IN PROGRESS'
                      : 'NOT STARTED'}
                  </span>
                </div>
              </div>

              {/* Weekly Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3]">
                  <span className="text-[#78716C] font-semibold block mb-1">Learning Tasks</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold font-mono text-[#292929] tabular-nums">
                      {wk.completedTasks} / {wk.totalTasks}
                    </span>
                    <span className="text-[11px] text-[#78716C]">({wk.taskCompletionPct}%)</span>
                  </div>
                  <span className="text-[10px] text-[#A8A29E]">{wk.pendingTasks} pending tasks</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3]">
                  <span className="text-[#78716C] font-semibold block mb-1">Study Hours</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold font-mono text-[#E7826D] tabular-nums">
                      {wk.studiedHours}h
                    </span>
                    <span className="text-[11px] text-[#78716C] font-mono">/ {wk.plannedHours}h target</span>
                  </div>
                  <span className="text-[10px] text-[#A8A29E]">Mon-Fri 4h + Sat/Sun 3h</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3]">
                  <span className="text-[#78716C] font-semibold block mb-1">Saturday Assessment</span>
                  <div className="flex items-center gap-1.5 font-bold">
                    <Award className={`w-3.5 h-3.5 ${wk.assessmentPassed ? 'text-[#16A34A]' : 'text-[#A8A29E]'}`} />
                    <span className={wk.assessmentPassed ? 'text-[#16A34A] font-mono text-sm' : 'text-[#78716C] text-xs'}>
                      {wk.assessmentPassed ? 'Passed' : 'Pending Exam'}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#A8A29E]">Score: {wk.assessmentScore}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3]">
                  <span className="text-[#78716C] font-semibold block mb-1">Sunday Revision</span>
                  <span className="text-xs font-bold text-[#292929] block">Included in Schedule</span>
                  <span className="text-[10px] text-[#A8A29E]">3 hours dedicated review</span>
                </div>
              </div>

              {/* Days in Week Chips */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-[#78716C] mr-1">Days:</span>
                {wk.days.map(d => {
                  const status = getDayStatus(d.dayNumber);
                  let chipColor = 'bg-[#FAF8F5] text-[#78716C] border-[#E0DCD3]';
                  if (status === 'completed') chipColor = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold';
                  else if (status === 'in-progress') chipColor = 'bg-[#E7826D]/15 text-[#E7826D] border-[#E7826D]/40 font-bold';
                  else if (status === 'incomplete') chipColor = 'bg-rose-50 text-rose-700 border-rose-200';

                  return (
                    <button
                      key={d.dayNumber}
                      onClick={() => {
                        setSelectedDayNumber(d.dayNumber);
                        setCurrentPage('today_work');
                      }}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono cursor-pointer hover:opacity-80 transition-opacity ${chipColor}`}
                      title={`Day ${d.dayNumber}: ${d.topic}`}
                    >
                      D{d.dayNumber} ({d.dayOfWeek.slice(0, 3)})
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
