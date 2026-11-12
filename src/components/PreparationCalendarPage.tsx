import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_180_DAYS } from '../data/syllabus';
import { DaySchedule } from '../types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  X,
  Target,
  Sparkles,
  Layers
} from 'lucide-react';

export const PreparationCalendarPage: React.FC = () => {
  const {
    currentDayNumber,
    getDayStatus,
    getDayTaskCompletion,
    setSelectedDayNumber,
    setCurrentPage,
    state,
    userRole
  } = useApp();

  // Preparation window bounds:
  // Starts: Nov 16, 2026 (Month index 10 in 0-indexed JS Date)
  // Ends: May 14, 2027 (Month index 4 in 0-indexed JS Date)
  // Default to November 2026 or current active preparation month
  const initialYear = 2026;
  const initialMonth = 10; // November

  const [viewYear, setViewYear] = useState<number>(initialYear);
  const [viewMonth, setViewMonth] = useState<number>(initialMonth); // 0-indexed (10 = Nov, 11 = Dec, 0 = Jan...)

  // Selected date modal
  const [selectedDayModal, setSelectedDayModal] = useState<DaySchedule | null>(null);

  // Month navigation helpers
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

  const handleJumpToPreparationStart = () => {
    setViewYear(2026);
    setViewMonth(10); // November 2026
  };

  const handleJumpToPreparationEnd = () => {
    setViewYear(2027);
    setViewMonth(4); // May 2027
  };

  // Build calendar matrix for currently viewed month
  // Monday is column 0, Sunday is column 6
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0);

    // In JS, getDay() returns 0 for Sunday, 1 for Monday...
    // We adjust so Monday is 0:
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const daysInMonth = lastDayOfMonth.getDate();

    // Map syllabus days by ISO date string (YYYY-MM-DD)
    const syllabusByDate = new Map<string, DaySchedule>();
    ALL_180_DAYS.forEach(day => {
      syllabusByDate.set(day.isoDate, day);
    });

    const cells: Array<{
      dateNumber: number;
      dateIso: string;
      isCurrentMonth: boolean;
      scheduleDay?: DaySchedule;
    }> = [];

    // Preceding empty/padding days
    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push({
        dateNumber: 0,
        dateIso: '',
        isCurrentMonth: false
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const monthStr = String(viewMonth + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const isoDate = `${viewYear}-${monthStr}-${dayStr}`;
      const scheduleDay = syllabusByDate.get(isoDate);

      cells.push({
        dateNumber: d,
        dateIso,
        isCurrentMonth: true,
        scheduleDay
      });
    }

    return cells;
  }, [viewYear, viewMonth]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0DCD3]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#E7826D] font-bold mb-1">
            <CalendarIcon className="w-4 h-4" />
            <span>180-DAY PREPARATION TIMELINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292929] tracking-tight">
            PREPARATION CALENDAR
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            Visual month-by-month calendar mapped from 16 November 2026 to 14 May 2027 with genuine completion tracking.
          </p>
        </div>

        {/* Quick Month Jump Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleJumpToPreparationStart}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#E0DCD3] hover:bg-[#FAF8F5] text-xs font-semibold text-[#292929] transition-colors cursor-pointer shadow-sm"
          >
            Launch (Nov 2026)
          </button>
          <button
            onClick={handleJumpToPreparationEnd}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#E0DCD3] hover:bg-[#FAF8F5] text-xs font-semibold text-[#292929] transition-colors cursor-pointer shadow-sm"
          >
            Final Capstone (May 2027)
          </button>
        </div>
      </div>

      {/* Legend & Month Navigation Bar */}
      <div className="bg-white border border-[#E0DCD3] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Month / Year Controls */}
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

          {/* Color State Legend */}
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
            {/* Days of week header (Mon - Sun) */}
            <div className="grid grid-cols-7 gap-2 pb-2 text-center text-xs font-bold text-[#78716C] uppercase tracking-wider">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div className="text-[#E7826D]">Sat (Exam)</div>
              <div className="text-[#78716C]">Sun (Review)</div>
            </div>

            {/* Cells */}
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

                const day = cell.scheduleDay;
                const isPreparationDay = !!day;
                const isCurrent = day && day.dayNumber === currentDayNumber;

                // Status calculation
                let status = day ? getDayStatus(day.dayNumber) : 'locked';
                const taskStats = day ? getDayTaskCompletion(day.dayNumber) : { completed: 0, total: 0, percentage: 0 };
                const studySeconds = day ? (state.studyTimeSeconds[day.dayNumber] || 0) : 0;

                // Card styling based on preparation schedule
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
                    // locked / upcoming
                    cellBg = 'bg-white border-[#E0DCD3] hover:border-[#292929]/30';
                    indicatorDot = 'bg-stone-300';
                    dayBadgeStyle = 'bg-[#FAF8F5] text-[#292929] font-semibold';
                  }
                } else {
                  // Non-preparation date (outside Nov 16 2026 - May 14 2027)
                  cellBg = 'bg-[#FAF8F5]/40 border-stone-200 opacity-50';
                }

                return (
                  <div
                    key={`day_${cell.dateIso}`}
                    onClick={() => {
                      if (day) {
                        setSelectedDayModal(day);
                      }
                    }}
                    className={`h-24 sm:h-28 rounded-xl p-2 sm:p-2.5 border flex flex-col justify-between transition-all ${cellBg} ${
                      isPreparationDay ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
                    } ${isCurrent ? 'ring-2 ring-[#E7826D] shadow-md' : ''}`}
                  >
                    {/* Top Row: Date Number and Day Number Badge */}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-[#292929] tabular-nums">
                        {cell.dateNumber}
                      </span>

                      {isPreparationDay && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${dayBadgeStyle}`}>
                          D{day.dayNumber}
                        </span>
                      )}
                    </div>

                    {/* Middle: Topic snippet if preparation day */}
                    {isPreparationDay ? (
                      <div className="space-y-0.5 my-1">
                        <p className="text-[10px] sm:text-[11px] font-semibold text-[#292929] line-clamp-1 leading-tight">
                          {day.topic}
                        </p>
                        <span className="text-[9px] text-[#78716C] block line-clamp-1">
                          {day.focusType}
                        </span>
                      </div>
                    ) : (
                      <div className="text-[10px] text-[#A8A29E] italic">
                        No scheduled prep
                      </div>
                    )}

                    {/* Bottom row: status indicator & tasks snippet */}
                    {isPreparationDay && (
                      <div className="flex items-center justify-between text-[10px] text-[#78716C] pt-1 border-t border-[#E0DCD3]/60">
                        <div className="flex items-center gap-1 font-mono">
                          <span className={`w-2 h-2 rounded-full ${indicatorDot}`} />
                          <span className="hidden sm:inline">
                            {taskStats.completed}/{taskStats.total}
                          </span>
                        </div>
                        <span className="font-mono text-[9px] text-[#A8A29E]">
                          {day.targetHours}h
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Date Details Modal / Slide-over */}
      {selectedDayModal && (
        <div className="fixed inset-0 z-50 bg-[#292929]/70 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl my-8">
            <div className="flex items-start justify-between border-b border-[#E0DCD3] pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] text-[#E7826D] font-mono font-bold text-xs border border-[#E0DCD3]">
                    DAY {selectedDayModal.dayNumber} OF 180
                  </span>
                  <span className="text-xs text-[#78716C] font-semibold font-mono">
                    {selectedDayModal.dateString} ({selectedDayModal.dayOfWeek})
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#292929]">
                  {selectedDayModal.topic}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDayModal(null)}
                className="p-1 rounded-lg text-[#78716C] hover:text-[#292929]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status and Metrics Strip */}
            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
                <span className="text-[10px] text-[#78716C] font-semibold block mb-0.5">Status</span>
                <span className="font-bold text-[#292929] uppercase text-xs">
                  {getDayStatus(selectedDayModal.dayNumber).replace('-', ' ')}
                </span>
              </div>

              <div className="p-3 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
                <span className="text-[10px] text-[#78716C] font-semibold block mb-0.5">Tasks Done</span>
                <span className="font-mono font-bold text-[#292929] text-xs">
                  {getDayTaskCompletion(selectedDayModal.dayNumber).completed} / {getDayTaskCompletion(selectedDayModal.dayNumber).total}
                </span>
              </div>

              <div className="p-3 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
                <span className="text-[10px] text-[#78716C] font-semibold block mb-0.5">Studied Duration</span>
                <span className="font-mono font-bold text-[#E7826D] text-xs">
                  {formatDuration(state.studyTimeSeconds[selectedDayModal.dayNumber] || 0)}
                </span>
              </div>
            </div>

            {/* Module & Focus */}
            <div className="space-y-1 text-xs">
              <span className="text-[#78716C] font-semibold">Module & Daily Focus:</span>
              <p className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] text-[#292929]">
                <strong className="text-[#E7826D]">Module {selectedDayModal.moduleNumber}:</strong> {selectedDayModal.moduleTitle} · {selectedDayModal.focusType}
              </p>
            </div>

            {/* Subtopics Checklist Preview */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[#78716C] font-semibold block">Required Subtopics for Day {selectedDayModal.dayNumber}:</span>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {selectedDayModal.subtopics.map((sub, i) => {
                  const isDone = !!state.completedTasks[`${selectedDayModal.dayNumber}_subtopic_${i}`];
                  return (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF8F5] border border-[#E0DCD3] text-[#292929]">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? 'text-[#16A34A]' : 'text-stone-300'}`} />
                      <span className={isDone ? 'line-through text-[#78716C]' : ''}>{sub}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#E0DCD3]">
              <button
                onClick={() => setSelectedDayModal(null)}
                className="px-4 py-2 rounded-xl bg-white border border-[#E0DCD3] hover:bg-[#FAF8F5] text-xs font-semibold text-[#292929] cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setSelectedDayNumber(selectedDayModal.dayNumber);
                  setCurrentPage('today_work');
                  setSelectedDayModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#E7826D] hover:bg-[#D66F5A] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md shadow-[#E7826D]/30"
              >
                <span>OPEN TODAY WORK (DAY {selectedDayModal.dayNumber})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
