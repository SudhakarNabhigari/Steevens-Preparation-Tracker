import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_180_DAYS } from '../data/syllabus';
import { DSA_100_DAYS } from '../data/dsaSyllabus';
import { AZURE_100_DAYS } from '../data/azureSyllabus';
import { DaySchedule, TrackDaySchedule, TrackId } from '../types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  X,
  Layers,
  Code2,
  Cloud
} from 'lucide-react';

type UnifiedCalendarDay =
  | { kind: 'main'; data: DaySchedule }
  | { kind: 'track'; data: TrackDaySchedule };

export const PreparationCalendarPage: React.FC = () => {
  const {
    currentDayNumber,
    currentTrackDayNumber,
    getTrackDayStatus,
    getTrackDayTaskCompletion,
    openDayForTrack,
    state
  } = useApp();

  const [selectedTrack, setSelectedTrack] = useState<TrackId>('main');
  const [viewYear, setViewYear] = useState<number>(2026);
  const [viewMonth, setViewMonth] = useState<number>(10); // 10 = November 2026
  const [selectedDayModal, setSelectedDayModal] = useState<UnifiedCalendarDay | null>(null);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleJumpToStart = () => {
    setViewYear(2026);
    setViewMonth(10); // Nov 2026
  };

  const handleJumpToEnd = () => {
    if (selectedTrack === 'main') {
      setViewYear(2027);
      setViewMonth(4); // May 2027
    } else {
      setViewYear(2027);
      setViewMonth(1); // Feb 2027
    }
  };

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0);

    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const daysInMonth = lastDayOfMonth.getDate();

    const dayMap = new Map<string, UnifiedCalendarDay>();
    if (selectedTrack === 'main') {
      ALL_180_DAYS.forEach(d => dayMap.set(d.isoDate, { kind: 'main', data: d }));
    } else if (selectedTrack === 'dsa') {
      DSA_100_DAYS.forEach(d => dayMap.set(d.isoDate, { kind: 'track', data: d }));
    } else {
      AZURE_100_DAYS.forEach(d => dayMap.set(d.isoDate, { kind: 'track', data: d }));
    }

    const cells: Array<{
      dateNumber: number;
      dateIso: string;
      isCurrentMonth: boolean;
      entry?: UnifiedCalendarDay;
    }> = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push({ dateNumber: 0, dateIso: '', isCurrentMonth: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const monthStr = String(viewMonth + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const isoDate = `${viewYear}-${monthStr}-${dayStr}`;
      const entry = dayMap.get(isoDate);

      cells.push({
        dateNumber: d,
        dateIso: isoDate,
        isCurrentMonth: true,
        entry
      });
    }

    return cells;
  }, [viewYear, viewMonth, selectedTrack]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatDuration = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m`;
    return `${secs}s`;
  };

  const getTrackStudySeconds = (dayNumber: number) => {
    if (selectedTrack === 'main') return state.studyTimeSeconds[dayNumber] || 0;
    if (selectedTrack === 'dsa') return state.dsaProgress?.studyTimeSeconds[dayNumber] || 0;
    return state.azureProgress?.studyTimeSeconds[dayNumber] || 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0DCD3]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#E7826D] font-bold mb-1">
            <CalendarIcon className="w-4 h-4" />
            <span>
              {selectedTrack === 'main'
                ? 'MAIN PLAN · 180-DAY TIMELINE'
                : selectedTrack === 'dsa'
                ? 'DSA IN C++ · 100-DAY TIMELINE'
                : 'AZURE · 100-DAY TIMELINE'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292929] tracking-tight">
            PREPARATION CALENDAR
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            {selectedTrack === 'main'
              ? 'Visual calendar from 16 November 2026 to 14 May 2027 (Main Plan).'
              : 'Visual calendar from 16 November 2026 to 23 February 2027 (100-Day Independent Track).'}
          </p>
        </div>

        {/* Quick Month Jump Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleJumpToStart}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#E0DCD3] hover:bg-[#FAF8F5] text-xs font-semibold text-[#292929] transition-colors cursor-pointer shadow-sm"
          >
            Launch (Nov 2026)
          </button>
          <button
            onClick={handleJumpToEnd}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#E0DCD3] hover:bg-[#FAF8F5] text-xs font-semibold text-[#292929] transition-colors cursor-pointer shadow-sm"
          >
            {selectedTrack === 'main' ? 'Final Day (May 2027)' : 'Day 100 (Feb 2027)'}
          </button>
        </div>
      </div>

      {/* Independent Track Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-[#E0DCD3] rounded-2xl shadow-sm">
        <button
          onClick={() => {
            setSelectedTrack('main');
            setSelectedDayModal(null);
          }}
          className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            selectedTrack === 'main'
              ? 'bg-[#292929] text-[#F3EFE6]'
              : 'text-[#78716C] hover:text-[#292929] hover:bg-[#FAF8F5]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#E7826D]" />
          <span>Main Plan (180 Days)</span>
        </button>

        <button
          onClick={() => {
            setSelectedTrack('dsa');
            setSelectedDayModal(null);
          }}
          className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            selectedTrack === 'dsa'
              ? 'bg-[#292929] text-[#F3EFE6]'
              : 'text-[#78716C] hover:text-[#292929] hover:bg-[#FAF8F5]'
          }`}
        >
          <Code2 className="w-4 h-4 text-[#E7826D]" />
          <span>DSA in C++ (100 Days)</span>
        </button>

        <button
          onClick={() => {
            setSelectedTrack('azure');
            setSelectedDayModal(null);
          }}
          className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            selectedTrack === 'azure'
              ? 'bg-[#292929] text-[#F3EFE6]'
              : 'text-[#78716C] hover:text-[#292929] hover:bg-[#FAF8F5]'
          }`}
        >
          <Cloud className="w-4 h-4 text-[#E7826D]" />
          <span>Azure (100 Days)</span>
        </button>
      </div>

      {/* Legend & Month Navigation Bar */}
      <div className="bg-white border border-[#E0DCD3] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#E0DCD3] text-[#292929] border border-[#E0DCD3] transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#E0DCD3] text-[#292929] border border-[#E0DCD3] transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#292929] tracking-tight">
              {monthNames[viewMonth]} {viewYear}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#16A34A]" />
              <span className="text-[#292929] font-medium">Completed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#E7826D]" />
              <span className="text-[#292929] font-medium">In Progress</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-stone-300" />
              <span className="text-[#78716C]">Upcoming / Not Started</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#DC2626]" />
              <span className="text-[#292929] font-medium">Incomplete Past Day</span>
            </span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-7 gap-2 pb-2 text-center text-xs font-bold text-[#78716C] uppercase tracking-wider">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div className="text-[#E7826D]">Sat (Revision/Exam)</div>
              <div className="text-[#78716C]">Sun (Review)</div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((cell, idx) => {
                if (!cell.isCurrentMonth) {
                  return (
                    <div
                      key={`empty_${idx}`}
                      className="h-24 sm:h-28 rounded-xl bg-[#FAF8F5]/50 border border-transparent"
                    />
                  );
                }

                const entry = cell.entry;
                const isPreparationDay = !!entry;
                const dayNumber = entry ? entry.data.dayNumber : 0;
                const activeDayRef = selectedTrack === 'main' ? currentDayNumber : currentTrackDayNumber;
                const isCurrent = isPreparationDay && dayNumber === activeDayRef;

                const status = isPreparationDay ? getTrackDayStatus(selectedTrack, dayNumber) : 'locked';
                const taskStats = isPreparationDay
                  ? getTrackDayTaskCompletion(selectedTrack, dayNumber)
                  : { completed: 0, total: 0, percentage: 0 };

                let cellBg = 'bg-[#FAF8F5] border-[#E0DCD3]';
                let indicatorDot = 'bg-stone-300';
                let dayBadgeStyle = 'text-[#78716C] bg-stone-100';

                if (isPreparationDay) {
                  if (status === 'completed') {
                    cellBg = 'bg-emerald-50/60 border-emerald-300';
                    indicatorDot = 'bg-[#16A34A]';
                    dayBadgeStyle = 'bg-emerald-100 text-emerald-800 font-bold';
                  } else if (status === 'in-progress') {
                    cellBg = 'bg-[#FAF8F5] border-[#E7826D]';
                    indicatorDot = 'bg-[#E7826D]';
                    dayBadgeStyle = 'bg-[#E7826D]/15 text-[#E7826D] font-bold';
                  } else if (status === 'incomplete') {
                    cellBg = 'bg-rose-50/60 border-rose-300';
                    indicatorDot = 'bg-[#DC2626]';
                    dayBadgeStyle = 'bg-rose-100 text-rose-800 font-bold';
                  } else {
                    cellBg = 'bg-white border-[#E0DCD3] hover:border-[#292929]/30';
                    indicatorDot = 'bg-stone-300';
                    dayBadgeStyle = 'bg-[#FAF8F5] text-[#292929] font-semibold';
                  }
                } else {
                  cellBg = 'bg-[#FAF8F5]/40 border-stone-200 opacity-50';
                }

                const durationBadge =
                  entry?.kind === 'main'
                    ? `${entry.data.targetHours}h`
                    : entry?.kind === 'track'
                    ? `${entry.data.targetMinutes}m`
                    : '';

                const subtitleText =
                  entry?.kind === 'main'
                    ? entry.data.focusType
                    : entry?.kind === 'track'
                    ? entry.data.classFocus
                    : '';

                return (
                  <div
                    key={`day_${cell.dateIso}`}
                    onClick={() => {
                      if (entry) {
                        setSelectedDayModal(entry);
                      }
                    }}
                    className={`h-24 sm:h-28 rounded-xl p-2 sm:p-2.5 border flex flex-col justify-between transition-all ${cellBg} ${
                      isPreparationDay ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
                    } ${isCurrent ? 'ring-2 ring-[#E7826D] shadow-md' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-[#292929] tabular-nums">
                        {cell.dateNumber}
                      </span>

                      {isPreparationDay && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${dayBadgeStyle}`}>
                          D{dayNumber}
                        </span>
                      )}
                    </div>

                    {isPreparationDay ? (
                      <div className="space-y-0.5 my-1">
                        <p className="text-[10px] sm:text-[11px] font-semibold text-[#292929] line-clamp-1 leading-tight">
                          {entry.data.topic}
                        </p>
                        <span className="text-[9px] text-[#78716C] block line-clamp-1">
                          {subtitleText}
                        </span>
                      </div>
                    ) : (
                      <div className="text-[10px] text-[#A8A29E] italic">No scheduled prep</div>
                    )}

                    {isPreparationDay && (
                      <div className="flex items-center justify-between text-[10px] text-[#78716C] pt-1 border-t border-[#E0DCD3]/60">
                        <div className="flex items-center gap-1 font-mono">
                          <span className={`w-2 h-2 rounded-full ${indicatorDot}`} />
                          <span className="hidden sm:inline">
                            {taskStats.completed}/{taskStats.total}
                          </span>
                        </div>
                        <span className="font-mono text-[9px] text-[#A8A29E]">{durationBadge}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Date Details Modal */}
      {selectedDayModal && (
        <div className="fixed inset-0 z-50 bg-[#292929]/70 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl my-8">
            <div className="flex items-start justify-between border-b border-[#E0DCD3] pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] text-[#E7826D] font-mono font-bold text-xs border border-[#E0DCD3]">
                    DAY {selectedDayModal.data.dayNumber} OF {selectedTrack === 'main' ? 180 : 100}
                  </span>
                  <span className="text-xs text-[#78716C] font-semibold font-mono">
                    {selectedDayModal.data.dateString} ({selectedDayModal.data.dayOfWeek})
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#292929]">{selectedDayModal.data.topic}</h3>
              </div>
              <button
                onClick={() => setSelectedDayModal(null)}
                className="p-1 rounded-lg text-[#78716C] hover:text-[#292929] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
                <span className="text-[10px] text-[#78716C] font-semibold block mb-0.5">Status</span>
                <span className="font-bold text-[#292929] uppercase text-xs">
                  {getTrackDayStatus(selectedTrack, selectedDayModal.data.dayNumber).replace('-', ' ')}
                </span>
              </div>

              <div className="p-3 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
                <span className="text-[10px] text-[#78716C] font-semibold block mb-0.5">Tasks Done</span>
                <span className="font-mono font-bold text-[#292929] text-xs">
                  {getTrackDayTaskCompletion(selectedTrack, selectedDayModal.data.dayNumber).completed} /{' '}
                  {getTrackDayTaskCompletion(selectedTrack, selectedDayModal.data.dayNumber).total}
                </span>
              </div>

              <div className="p-3 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
                <span className="text-[10px] text-[#78716C] font-semibold block mb-0.5">
                  Studied Duration
                </span>
                <span className="font-mono font-bold text-[#E7826D] text-xs">
                  {formatDuration(getTrackStudySeconds(selectedDayModal.data.dayNumber))}
                </span>
              </div>
            </div>

            {selectedDayModal.kind === 'main' ? (
              <>
                <div className="space-y-1 text-xs">
                  <span className="text-[#78716C] font-semibold">Module & Daily Focus:</span>
                  <p className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] text-[#292929]">
                    <strong className="text-[#E7826D]">Module {selectedDayModal.data.moduleNumber}:</strong>{' '}
                    {selectedDayModal.data.moduleTitle} · {selectedDayModal.data.focusType}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs">
                  <span className="text-[#78716C] font-semibold block">
                    Required Subtopics for Day {selectedDayModal.data.dayNumber}:
                  </span>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {selectedDayModal.data.subtopics.map((sub, i) => {
                      const isDone = !!state.completedTasks[`${selectedDayModal.data.dayNumber}_subtopic_${i}`];
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF8F5] border border-[#E0DCD3] text-[#292929]"
                        >
                          <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? 'text-[#16A34A]' : 'text-stone-300'}`} />
                          <span className={isDone ? 'line-through text-[#78716C]' : ''}>{sub}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] text-[#292929]">
                  <strong className="text-[#E7826D]">Schedule: </strong>
                  {selectedDayModal.data.scheduleLabel} · {selectedDayModal.data.phaseTitle}
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] text-[#292929]">
                  <strong className="text-[#292929]">Objective: </strong>
                  {selectedDayModal.data.objective}
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] text-[#292929]">
                  <strong className="text-[#292929]">Student Work: </strong>
                  {selectedDayModal.data.studentWork}
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] text-[#292929]">
                  <strong className="text-[#E7826D]">Milestone / Output: </strong>
                  {selectedDayModal.data.milestoneOutput}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#E0DCD3]">
              <button
                onClick={() => setSelectedDayModal(null)}
                className="px-4 py-2 rounded-xl bg-white border border-[#E0DCD3] hover:bg-[#FAF8F5] text-xs font-semibold text-[#292929] cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={() => {
                  openDayForTrack(selectedTrack, selectedDayModal.data.dayNumber);
                  setSelectedDayModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#E7826D] hover:bg-[#D66F5A] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md shadow-[#E7826D]/30"
              >
                <span>
                  OPEN {selectedTrack === 'main' ? 'MAIN PLAN' : selectedTrack === 'dsa' ? 'DSA IN C++' : 'AZURE'} DAY{' '}
                  {selectedDayModal.data.dayNumber}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
