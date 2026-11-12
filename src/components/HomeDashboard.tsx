import React from 'react';
import { useApp } from '../context/AppContext';
import { ALL_180_DAYS } from '../data/syllabus';
import {
  OverallProgressBar,
  CompletionTrajectoryChart,
  StudyHoursChart,
  WeeklyProgressChart,
  AssessmentPerformanceChart
} from './Charts';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  ChevronRight,
  BookOpen,
  Calendar,
  ArrowRight
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const {
    state,
    currentDayNumber,
    currentDaySchedule,
    getDayStatus,
    getDayTaskCompletion,
    setSelectedDayNumber,
    setCurrentPage,
    isSaturdayToday
  } = useApp();

  const resumeDay = state.lastActiveDayNumber || currentDayNumber || 1;
  const resumeSchedule = ALL_180_DAYS[resumeDay - 1] || ALL_180_DAYS[0];

  // Metric counts
  let completedDaysCount = 0;
  let inProgressDaysCount = 0;
  let incompleteDaysCount = 0;
  let lockedDaysCount = 0;

  for (let d = 1; d <= 180; d++) {
    const status = getDayStatus(d);
    if (status === 'completed') completedDaysCount++;
    else if (status === 'in-progress') inProgressDaysCount++;
    else if (status === 'incomplete') incompleteDaysCount++;
    else lockedDaysCount++;
  }

  const remainingDaysCount = 180 - completedDaysCount;
  const overallPercentage = Math.round((completedDaysCount / 180) * 100);

  // Total study hours
  const totalActualSeconds = Object.values(state.studyTimeSeconds).reduce((a, b) => a + b, 0);
  const actualHoursFormatted = (totalActualSeconds / 3600).toFixed(1);
  const totalPlannedHours = 745;

  // Assessments
  const submittedAssessments = Object.values(state.assessmentSubmissions).length;
  const passedAssessments = Object.values(state.assessmentSubmissions).filter(s => s.passed).length;

  const handleDayBoxClick = (dayNum: number) => {
    setSelectedDayNumber(dayNum);
    setCurrentPage('today_work');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Saturday Assessment Callout Banner if today is Saturday */}
      {isSaturdayToday && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#292929] text-[#F3EFE6] border border-[#E7826D] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E7826D]/20 text-[#E7826D] flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold uppercase tracking-wide text-[#F3EFE6]">
                TODAY IS YOUR WEEKLY ASSESSMENT DAY!
              </h2>
              <p className="text-xs text-[#C2BEB5]">
                Saturday assessment is mandatory (3 hours). Test your mastery of Week {currentDaySchedule.weekNumber} topics.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentPage('weekly_assessments')}
            className="px-4 py-2.5 rounded-xl bg-[#E7826D] hover:bg-[#d8735e] text-[#292929] text-xs font-bold shrink-0 cursor-pointer shadow-sm transition-colors flex items-center gap-2 justify-center uppercase tracking-wide"
          >
            <span>Start Weekly Assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Prominent Resume Exactly Where I Stopped Hero Action */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E0DCD3] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E7826D]">
            <span>Active Preparation Position</span>
            <span>·</span>
            <span>Day {resumeDay} of 180</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#292929]">
            {resumeSchedule.topic}
          </h2>
          <p className="text-xs text-[#5A5650] max-w-2xl">
            {resumeSchedule.practicalTask}
          </p>
        </div>

        <div className="shrink-0">
          <button
            onClick={() => {
              setSelectedDayNumber(resumeDay);
              setCurrentPage('today_work');
            }}
            className="w-full sm:w-auto px-6 py-3 bg-[#E7826D] hover:bg-[#d8735e] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all uppercase tracking-wide"
          >
            <span>Continue Preparation (Day {resumeDay})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E0DCD3]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292929] tracking-tight">
            DAYS OF PREPARATION
          </h1>
          <p className="text-xs text-[#5A5650] mt-0.5">
            Real personal preparation tracker · Progress updates strictly on your verified completion.
          </p>
        </div>
        <div className="text-xs font-mono text-[#5A5650]">
          Schedule: 16 Nov 2026 – 14 May 2027
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Overall Completion */}
        <div className="bg-[#FFFFFF] border border-[#E0DCD3] rounded-xl p-3.5">
          <span className="text-[11px] font-medium text-[#736E65] block mb-1">Overall Progress</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#292929] tabular-nums">
            {overallPercentage}%
          </span>
          <span className="text-[10px] text-[#9B968D] mt-1 block">180 total days</span>
        </div>

        {/* Completed Days */}
        <div className="bg-[#FFFFFF] border border-[#BBF7D0] rounded-xl p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#15803D] block mb-1">Completed</span>
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
          </div>
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#15803D] tabular-nums">
            {completedDaysCount}
          </span>
          <span className="text-[10px] text-[#9B968D] mt-1 block">All tasks verified</span>
        </div>

        {/* In Progress */}
        <div className="bg-[#FFFFFF] border border-[#FED7AA] rounded-xl p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#C2410C] block mb-1">In Progress</span>
            <span className="w-2 h-2 rounded-full bg-[#E7826D]" />
          </div>
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#E7826D] tabular-nums">
            {inProgressDaysCount}
          </span>
          <span className="text-[10px] text-[#9B968D] mt-1 block">Partially checked</span>
        </div>

        {/* Incomplete */}
        <div className="bg-[#FFFFFF] border border-[#FECACA] rounded-xl p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#B91C1C] block mb-1">Incomplete</span>
            <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
          </div>
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#B91C1C] tabular-nums">
            {incompleteDaysCount}
          </span>
          <span className="text-[10px] text-[#9B968D] mt-1 block">Day passed pending</span>
        </div>

        {/* Remaining Days */}
        <div className="bg-[#FFFFFF] border border-[#E0DCD3] rounded-xl p-3.5">
          <span className="text-[11px] font-medium text-[#736E65] block mb-1">Remaining</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#292929] tabular-nums">
            {remainingDaysCount}
          </span>
          <span className="text-[10px] text-[#9B968D] mt-1 block">Days ahead</span>
        </div>

        {/* Actual Study Hours */}
        <div className="bg-[#FFFFFF] border border-[#E0DCD3] rounded-xl p-3.5">
          <span className="text-[11px] font-medium text-[#736E65] block mb-1">Actual Time</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold font-mono text-[#292929] tabular-nums">
              {actualHoursFormatted}h
            </span>
            <span className="text-[11px] text-[#736E65] font-mono">/ {totalPlannedHours}h</span>
          </div>
          <span className="text-[10px] text-[#9B968D] mt-1 block">Timer recorded</span>
        </div>

        {/* Assessments */}
        <div className="bg-[#FFFFFF] border border-[#E0DCD3] rounded-xl p-3.5">
          <span className="text-[11px] font-medium text-[#736E65] block mb-1">Assessments</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#292929] tabular-nums">
            {passedAssessments} / {submittedAssessments}
          </span>
          <span className="text-[10px] text-[#9B968D] mt-1 block">Exams passed</span>
        </div>
      </div>

      {/* Progress Bar */}
      <OverallProgressBar />

      {/* 180 COMPACT DAY BOXES GRID */}
      <div className="bg-[#FFFFFF] border border-[#E0DCD3] rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-[#292929]">
              180 Compact Day Boxes
            </h2>
            <p className="text-xs text-[#5A5650]">
              Grey = Locked/Not Started · Terracotta = In Progress · Green = 100% Completed · Red = Overdue Incomplete
            </p>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-[#5A5650]">
              <span className="w-3 h-3 rounded bg-[#EAE5DC] border border-[#D5D0C7]" />
              <span>Grey: Locked</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#C2410C]">
              <span className="w-3 h-3 rounded bg-[#FED7AA] border border-[#E7826D]" />
              <span>Terracotta: In Progress</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#15803D]">
              <span className="w-3 h-3 rounded bg-[#BBF7D0] border border-[#16A34A]" />
              <span>Green: Done</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#B91C1C]">
              <span className="w-3 h-3 rounded bg-[#FECACA] border border-[#DC2626]" />
              <span>Red: Incomplete</span>
            </span>
          </div>
        </div>

        {/* 180 Day Boxes */}
        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 lg:grid-cols-18 gap-1.5 sm:gap-2">
          {ALL_180_DAYS.map(day => {
            const status = getDayStatus(day.dayNumber);
            const isCurrent = day.dayNumber === resumeDay;
            const { completed, total } = getDayTaskCompletion(day.dayNumber);

            let boxStyle = 'bg-[#FAF8F5] text-[#736E65] border-[#E0DCD3] hover:border-[#292929]';
            let dotColor = 'bg-[#D5D0C7]';

            if (status === 'completed') {
              boxStyle = 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC] font-bold';
              dotColor = 'bg-[#16A34A]';
            } else if (status === 'in-progress') {
              boxStyle = 'bg-[#FFEDD5] text-[#C2410C] border-[#E7826D] font-bold';
              dotColor = 'bg-[#E7826D]';
            } else if (status === 'incomplete') {
              boxStyle = 'bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5] font-bold';
              dotColor = 'bg-[#DC2626]';
            } else if (status === 'locked') {
              boxStyle = 'bg-[#F3EFE6] text-[#A8A49C] border-[#EAE5DC] opacity-75';
              dotColor = 'bg-[#D5D0C7]';
            }

            return (
              <button
                key={day.dayNumber}
                onClick={() => handleDayBoxClick(day.dayNumber)}
                className={`group relative p-1.5 sm:p-2 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${boxStyle} ${
                  isCurrent ? 'ring-2 ring-[#E7826D] ring-offset-2 ring-offset-[#FFFFFF]' : ''
                }`}
                title={`Day ${day.dayNumber}: ${day.topic} (${day.dateString}) - ${status} (${completed}/${total} tasks)`}
              >
                <span className="font-mono text-[10px] sm:text-xs font-semibold tabular-nums">
                  D{day.dayNumber}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${dotColor}`} />

                {/* Tooltip */}
                <div className="hidden group-hover:block absolute bottom-full mb-1 z-30 w-44 p-2 bg-[#292929] text-[#F3EFE6] rounded-lg text-left shadow-lg pointer-events-none">
                  <div className="text-[10px] font-bold">Day {day.dayNumber} · {day.dayOfWeek.slice(0, 3)}</div>
                  <div className="text-[9px] text-[#E0DCD3] truncate">{day.topic}</div>
                  <div className="text-[9px] text-[#A8A49C] mt-1 flex justify-between">
                    <span>{day.dateString}</span>
                    <span className="font-mono">{completed}/{total} tasks</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompletionTrajectoryChart />
        <StudyHoursChart />
        <WeeklyProgressChart />
        <AssessmentPerformanceChart />
      </div>
    </div>
  );
};
