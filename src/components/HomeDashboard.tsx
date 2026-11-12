import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_180_DAYS } from '../data/syllabus';
import { DSA_TOTAL_PLANNED_HOURS } from '../data/dsaSyllabus';
import { AZURE_TOTAL_PLANNED_HOURS } from '../data/azureSyllabus';
import { TrackDayPickerModal } from './TrackDayPickerModal';
import {
  OverallProgressBar,
  CompletionTrajectoryChart,
  StudyHoursChart,
  WeeklyProgressChart,
  AssessmentPerformanceChart
} from './Charts';
import {
  Award,
  ChevronRight,
  ArrowRight,
  Layers,
  Code2,
  Cloud
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const {
    state,
    currentDayNumber,
    currentDaySchedule,
    getDayStatus,
    getDayTaskCompletion,
    getTrackDayStatus,
    setSelectedDayNumber,
    setCurrentPage,
    isSaturdayToday
  } = useApp();

  const [pickerDayNumber, setPickerDayNumber] = useState<number | null>(null);

  const resumeDay = state.lastActiveDayNumber || currentDayNumber || 1;
  const resumeSchedule = ALL_180_DAYS[resumeDay - 1] || ALL_180_DAYS[0];

  // Main Plan metric counts
  let completedDaysCount = 0;
  let inProgressDaysCount = 0;
  let incompleteDaysCount = 0;

  for (let d = 1; d <= 180; d++) {
    const status = getDayStatus(d);
    if (status === 'completed') completedDaysCount++;
    else if (status === 'in-progress') inProgressDaysCount++;
    else if (status === 'incomplete') incompleteDaysCount++;
  }

  const remainingDaysCount = 180 - completedDaysCount;
  const overallPercentage = Math.round((completedDaysCount / 180) * 100);

  // Main total study hours
  const totalActualSeconds = Object.values(state.studyTimeSeconds).reduce((a, b) => a + b, 0);
  const actualHoursFormatted = (totalActualSeconds / 3600).toFixed(1);
  const totalPlannedHours = 745;

  // DSA & Azure independent summary metrics
  const dsaSummary = useMemo(() => {
    let completed = 0;
    for (let d = 1; d <= 100; d++) {
      if (getTrackDayStatus('dsa', d) === 'completed') completed++;
    }
    const secs = Object.values(state.dsaProgress?.studyTimeSeconds || {}).reduce((a, b) => a + b, 0);
    return {
      completed,
      pct: Math.round((completed / 100) * 100),
      hours: (secs / 3600).toFixed(1),
      activeDay: state.dsaProgress?.lastActiveDayNumber || 1
    };
  }, [getTrackDayStatus, state.dsaProgress]);

  const azureSummary = useMemo(() => {
    let completed = 0;
    for (let d = 1; d <= 100; d++) {
      if (getTrackDayStatus('azure', d) === 'completed') completed++;
    }
    const secs = Object.values(state.azureProgress?.studyTimeSeconds || {}).reduce((a, b) => a + b, 0);
    return {
      completed,
      pct: Math.round((completed / 100) * 100),
      hours: (secs / 3600).toFixed(1),
      activeDay: state.azureProgress?.lastActiveDayNumber || 1
    };
  }, [getTrackDayStatus, state.azureProgress]);

  // Assessments
  const submittedAssessments = Object.values(state.assessmentSubmissions).length;
  const passedAssessments = Object.values(state.assessmentSubmissions).filter(s => s.passed).length;

  const handleDayBoxClick = (dayNum: number) => {
    setPickerDayNumber(dayNum);
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

      {/* Prominent Resume Exactly Where I Stopped Hero Action (Main Plan) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E0DCD3] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E7826D]">
            <span>Active Preparation Position</span>
            <span>·</span>
            <span>Main Plan Day {resumeDay} of 180</span>
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

      {/* Top Headline: DAYS OF PREPARATION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E0DCD3]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292929] tracking-tight">
            DAYS OF PREPARATION
          </h1>
          <p className="text-xs text-[#5A5650] mt-0.5">
            Three independent preparation tracks · Progress updates strictly on verified completion.
          </p>
        </div>
        <div className="text-xs font-mono text-[#5A5650]">
          Main: 16 Nov 2026 – 14 May 2027 · DSA & Azure: 16 Nov 2026 – 23 Feb 2027
        </div>
      </div>

      {/* THREE INDEPENDENT PREPARATION TRACKS — BUTTONS + SEPARATE PROGRESS SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Track 1: MAIN PLAN — 180 DAYS */}
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#292929] text-[#F3EFE6] flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4 text-[#E7826D]" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#292929] tracking-tight">
                    MAIN PLAN — 180 DAYS
                  </h3>
                  <p className="text-[11px] text-[#736E65]">
                    AI / ML / Generative AI / RAG
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[#E7826D]">{overallPercentage}%</span>
            </div>

            <div className="w-full h-2 bg-[#EAE5DC] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E7826D] rounded-full transition-all"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl p-2.5">
              <div>
                <span className="text-[10px] text-[#736E65] block">Days Done</span>
                <span className="font-mono text-xs font-bold text-[#292929]">
                  {completedDaysCount}/180
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#736E65] block">Active Day</span>
                <span className="font-mono text-xs font-bold text-[#E7826D]">D{resumeDay}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#736E65] block">Hours</span>
                <span className="font-mono text-xs font-bold text-[#292929]">
                  {actualHoursFormatted}h
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedDayNumber(resumeDay);
              setCurrentPage('today_work');
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#292929] hover:bg-[#3A3A3A] text-[#F3EFE6] text-xs font-bold flex items-center justify-between cursor-pointer transition-colors uppercase tracking-wide"
          >
            <span>Open Main Plan</span>
            <ChevronRight className="w-4 h-4 text-[#E7826D]" />
          </button>
        </div>

        {/* Track 2: DSA IN C++ — 100 DAYS */}
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E7826D]/15 text-[#E7826D] border border-[#E7826D]/30 flex items-center justify-center shrink-0">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#292929] tracking-tight">
                    DSA IN C++ — 100 DAYS
                  </h3>
                  <p className="text-[11px] text-[#736E65]">
                    90m Mon–Fri · 2h Sat–Sun Revision
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[#E7826D]">{dsaSummary.pct}%</span>
            </div>

            <div className="w-full h-2 bg-[#EAE5DC] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E7826D] rounded-full transition-all"
                style={{ width: `${dsaSummary.pct}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl p-2.5">
              <div>
                <span className="text-[10px] text-[#736E65] block">Days Done</span>
                <span className="font-mono text-xs font-bold text-[#292929]">
                  {dsaSummary.completed}/100
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#736E65] block">Active Day</span>
                <span className="font-mono text-xs font-bold text-[#E7826D]">
                  D{dsaSummary.activeDay}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#736E65] block">Hours</span>
                <span className="font-mono text-xs font-bold text-[#292929]">
                  {dsaSummary.hours}h/{DSA_TOTAL_PLANNED_HOURS}h
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentPage('dsa_track')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#E7826D] hover:bg-[#d8735e] text-white text-xs font-bold flex items-center justify-between cursor-pointer transition-colors uppercase tracking-wide shadow-sm"
          >
            <span>Open DSA in C++ Track</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Track 3: AZURE — 100 DAYS */}
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#292929] text-[#F3EFE6] flex items-center justify-center shrink-0">
                  <Cloud className="w-4 h-4 text-[#E7826D]" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#292929] tracking-tight">
                    AZURE — 100 DAYS
                  </h3>
                  <p className="text-[11px] text-[#736E65]">
                    AZ-900 / DP-900 / AI-102 · 1h Daily
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[#E7826D]">{azureSummary.pct}%</span>
            </div>

            <div className="w-full h-2 bg-[#EAE5DC] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E7826D] rounded-full transition-all"
                style={{ width: `${azureSummary.pct}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl p-2.5">
              <div>
                <span className="text-[10px] text-[#736E65] block">Days Done</span>
                <span className="font-mono text-xs font-bold text-[#292929]">
                  {azureSummary.completed}/100
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#736E65] block">Active Day</span>
                <span className="font-mono text-xs font-bold text-[#E7826D]">
                  D{azureSummary.activeDay}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#736E65] block">Hours</span>
                <span className="font-mono text-xs font-bold text-[#292929]">
                  {azureSummary.hours}h/{AZURE_TOTAL_PLANNED_HOURS}h
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentPage('azure_track')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#E7826D] hover:bg-[#d8735e] text-white text-xs font-bold flex items-center justify-between cursor-pointer transition-colors uppercase tracking-wide shadow-sm"
          >
            <span>Open Azure Track</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary KPI Strip (Main 180-Day Plan) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-[#FFFFFF] border border-[#E0DCD3] rounded-xl p-3.5">
          <span className="text-[11px] font-medium text-[#736E65] block mb-1">Main Progress</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#292929] tabular-nums">
            {overallPercentage}%
          </span>
          <span className="text-[10px] text-[#9B968D] mt-1 block">180 total days</span>
        </div>

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

        <div className="bg-[#FFFFFF] border border-[#E0DCD3] rounded-xl p-3.5">
          <span className="text-[11px] font-medium text-[#736E65] block mb-1">Remaining</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#292929] tabular-nums">
            {remainingDaysCount}
          </span>
          <span className="text-[10px] text-[#9B968D] mt-1 block">Days ahead</span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E0DCD3] rounded-xl p-3.5">
          <span className="text-[11px] font-medium text-[#736E65] block mb-1">Main Time</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold font-mono text-[#292929] tabular-nums">
              {actualHoursFormatted}h
            </span>
            <span className="text-[11px] text-[#736E65] font-mono">/ {totalPlannedHours}h</span>
          </div>
          <span className="text-[10px] text-[#9B968D] mt-1 block">Timer recorded</span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E0DCD3] rounded-xl p-3.5">
          <span className="text-[11px] font-medium text-[#736E65] block mb-1">Assessments</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#292929] tabular-nums">
            {passedAssessments} / {submittedAssessments}
          </span>
          <span className="text-[10px] text-[#9B968D] mt-1 block">Exams passed</span>
        </div>
      </div>

      {/* Main Plan Progress Bar */}
      <OverallProgressBar />

      {/* 180 COMPACT DAY BOXES GRID */}
      <div className="bg-[#FFFFFF] border border-[#E0DCD3] rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-[#292929]">
              180 Compact Day Boxes · Click Any Day to Choose Track
            </h2>
            <p className="text-xs text-[#5A5650]">
              Grey = Locked/Not Started · Terracotta = In Progress · Green = 100% Completed · Red = Overdue Incomplete
            </p>
          </div>

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
                title={`Day ${day.dayNumber} (${day.dateString}) — Click to choose Main, DSA, or Azure track`}
              >
                <span className="font-mono text-[10px] sm:text-xs font-semibold tabular-nums">
                  D{day.dayNumber}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${dotColor}`} />

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

      {/* Analytics Charts Grid (Main Plan) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompletionTrajectoryChart />
        <StudyHoursChart />
        <WeeklyProgressChart />
        <AssessmentPerformanceChart />
      </div>

      {/* Day Click Track Selector Modal */}
      <TrackDayPickerModal dayNumber={pickerDayNumber} onClose={() => setPickerDayNumber(null)} />
    </div>
  );
};
