import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_180_DAYS } from '../data/syllabus';
import {
  Clock,
  CheckCircle2,
  Circle,
  Play,
  RotateCcw,
  BookOpen,
  Code,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Save,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TodayWorkPage: React.FC = () => {
  const {
    state,
    currentDayNumber,
    selectedDayNumber,
    setSelectedDayNumber,
    getDayStatus,
    getDayTaskCompletion,
    toggleTaskCompletion,
    saveDayNotes,
    startTimer,
    activeTimer,
    userRole
  } = useApp();

  const day = ALL_180_DAYS[selectedDayNumber - 1] || ALL_180_DAYS[0];
  const { completed, total, percentage } = getDayTaskCompletion(day.dayNumber);
  const status = getDayStatus(day.dayNumber);

  const [notesInput, setNotesInput] = useState(state.dayNotes[day.dayNumber] || '');
  const [notesSavedAlert, setNotesSavedAlert] = useState(false);

  // Sync notes when day changes
  React.useEffect(() => {
    setNotesInput(state.dayNotes[day.dayNumber] || '');
  }, [day.dayNumber, state.dayNotes]);

  const handleToggle = (taskId: string) => {
    toggleTaskCompletion(day.dayNumber, taskId);

    // If this completes the last task, trigger celebratory confetti!
    if (!state.completedTasks[taskId] && completed + 1 === total) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe fallback
      }
    }
  };

  const handleSaveNotes = () => {
    saveDayNotes(day.dayNumber, notesInput);
    setNotesSavedAlert(true);
    setTimeout(() => setNotesSavedAlert(false), 2000);
  };

  const isCurrentDay = day.dayNumber === currentDayNumber;
  const isSaturday = day.dayOfWeek === 'Saturday';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Day Selector & Navigation Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0DCD3]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedDayNumber(Math.max(1, day.dayNumber - 1))}
              disabled={day.dayNumber <= 1}
              className="p-1.5 rounded-lg bg-white border border-[#E0DCD3] hover:bg-[#FAF8F5] text-[#292929] disabled:opacity-30 cursor-pointer transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedDayNumber(Math.min(180, day.dayNumber + 1))}
              disabled={day.dayNumber >= 180}
              className="p-1.5 rounded-lg bg-white border border-[#E0DCD3] hover:bg-[#FAF8F5] text-[#292929] disabled:opacity-30 cursor-pointer transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-[#78716C]">
              <span className="font-semibold text-[#E7826D] uppercase tracking-wide">
                Module {day.moduleNumber}: {day.moduleTitle}
              </span>
              <span>·</span>
              <span>PDF {day.pdfPage ? `Page ${day.pdfPage}` : 'Reference'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#292929] tracking-tight">
              TODAY WORK — DAY {day.dayNumber}
            </h1>
          </div>
        </div>

        {/* Quick jump to Current Day if viewing another day */}
        {!isCurrentDay && (
          <button
            onClick={() => setSelectedDayNumber(currentDayNumber)}
            className="text-xs text-[#E7826D] hover:text-[#D66F5A] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
          >
            <span>Jump to Current (Day {currentDayNumber})</span>
          </button>
        )}
      </div>

      {/* Day Header Summary Card */}
      <div className="bg-white border border-[#E0DCD3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] text-[#292929] font-mono font-semibold border border-[#E0DCD3]">
                {day.dateString}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] text-[#78716C] font-medium border border-[#E0DCD3]">
                {day.dayOfWeek}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] text-[#292929] font-medium border border-[#E0DCD3] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#E7826D]" />
                <span>Target: {day.targetHours} Hours</span>
              </span>
              {isSaturday && (
                <span className="px-2.5 py-0.5 rounded-md bg-[#E7826D]/15 text-[#E7826D] font-bold border border-[#E7826D]/30">
                  + 3h Mandatory Assessment
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#292929] pt-1">
              {day.topic}
            </h2>
            <p className="text-xs text-[#78716C] font-medium">
              Daily Focus: <span className="text-[#292929] font-semibold">{day.focusType}</span>
            </p>
          </div>

          {/* Day Status Badge & Progress */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-[#78716C]">Day Status:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  status === 'completed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : status === 'in-progress'
                    ? 'bg-[#E7826D]/15 text-[#E7826D] border border-[#E7826D]/30'
                    : status === 'incomplete'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-stone-100 text-stone-600 border border-stone-200'
                }`}
              >
                {status.replace('-', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#292929] tabular-nums">
                {completed} / {total} tasks ({percentage}%)
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E0DCD3]">
          <div
            className={`h-full transition-all duration-300 ${
              percentage === 100
                ? 'bg-[#16A34A]'
                : percentage > 0
                ? 'bg-[#E7826D]'
                : 'bg-transparent'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Main Learning Sections with Interactive Checkboxes */}
      <div className="space-y-4">
        {/* Section 1: Concept Mastery */}
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#292929] uppercase tracking-wider border-b border-[#E0DCD3] pb-2">
            <BookOpen className="w-4 h-4 text-[#E7826D]" />
            <span>1. Core Topic & Subtopics to Learn</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {/* Primary Topic Checkbox */}
            <div
              onClick={() => handleToggle(`${day.dayNumber}_concept`)}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E0DCD3] cursor-pointer transition-colors"
            >
              <div className="mt-0.5 shrink-0">
                {state.completedTasks[`${day.dayNumber}_concept`] ? (
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                ) : (
                  <Circle className="w-5 h-5 text-[#A8A29E] hover:text-[#292929]" />
                )}
              </div>
              <div className="flex-1">
                <span className={`text-sm font-semibold block ${state.completedTasks[`${day.dayNumber}_concept`] ? 'text-[#78716C] line-through' : 'text-[#292929]'}`}>
                  Deep study and conceptual notes for {day.topic}
                </span>
                <span className="text-xs text-[#78716C] block mt-0.5">
                  Understand theoretical foundations, trade-offs, and failure boundaries without reading notes.
                </span>
              </div>
            </div>

            {/* Subtopics Checklist */}
            <div className="pl-4 space-y-2 border-l-2 border-[#E0DCD3] my-2">
              <span className="text-xs font-semibold text-[#78716C] uppercase tracking-wider block">
                Required Subtopics Checklist:
              </span>
              {day.subtopics.map((sub, idx) => {
                const taskId = `${day.dayNumber}_subtopic_${idx}`;
                const isChecked = !!state.completedTasks[taskId];

                return (
                  <div
                    key={taskId}
                    onClick={() => handleToggle(taskId)}
                    className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-[#FAF8F5] cursor-pointer transition-colors"
                  >
                    <div className="shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#A8A29E]" />
                      )}
                    </div>
                    <span className={`text-xs ${isChecked ? 'text-[#78716C] line-through' : 'text-[#292929]'}`}>
                      {sub}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Practical Implementation & Output */}
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#292929] uppercase tracking-wider border-b border-[#E0DCD3] pb-2">
            <Code className="w-4 h-4 text-[#E7826D]" />
            <span>2. Practical Implementation Task</span>
          </div>

          <div
            onClick={() => handleToggle(`${day.dayNumber}_practical`)}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E0DCD3] cursor-pointer transition-colors"
          >
            <div className="mt-0.5 shrink-0">
              {state.completedTasks[`${day.dayNumber}_practical`] ? (
                <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
              ) : (
                <Circle className="w-5 h-5 text-[#A8A29E] hover:text-[#292929]" />
              )}
            </div>
            <div className="space-y-1">
              <span className={`text-sm font-semibold block ${state.completedTasks[`${day.dayNumber}_practical`] ? 'text-[#78716C] line-through' : 'text-[#292929]'}`}>
                {day.practicalTask}
              </span>
              <div className="text-xs text-[#78716C]">
                <strong className="text-[#292929] font-medium">Stated Syllabus Output: </strong>
                <span>{day.output}</span>
              </div>
              <div className="text-xs text-[#78716C] pt-0.5">
                <strong className="text-[#E7826D] font-semibold">Expected Learning Outcome: </strong>
                <span className="text-[#292929]">{day.expectedOutcome}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Required Deliverables */}
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#292929] uppercase tracking-wider border-b border-[#E0DCD3] pb-2">
            <FileCheck className="w-4 h-4 text-[#E7826D]" />
            <span>3. Required Deliverable Artifact</span>
          </div>

          <div
            onClick={() => handleToggle(`${day.dayNumber}_deliverable`)}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E0DCD3] cursor-pointer transition-colors"
          >
            <div className="mt-0.5 shrink-0">
              {state.completedTasks[`${day.dayNumber}_deliverable`] ? (
                <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
              ) : (
                <Circle className="w-5 h-5 text-[#A8A29E] hover:text-[#292929]" />
              )}
            </div>
            <div>
              <span className={`text-sm font-semibold block ${state.completedTasks[`${day.dayNumber}_deliverable`] ? 'text-[#78716C] line-through' : 'text-[#292929]'}`}>
                Deliverable: {day.deliverable}
              </span>
              <span className="text-xs text-[#78716C] mt-1 block">
                Produce concrete evidence: source code file, tested script, or markdown architecture documentation.
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Daily Revision & Consolidation */}
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#292929] uppercase tracking-wider border-b border-[#E0DCD3] pb-2">
            <RotateCcw className="w-4 h-4 text-[#E7826D]" />
            <span>4. Daily Revision & Consolidation Tasks</span>
          </div>

          <div className="space-y-2">
            {day.revisionTasks.map((rev, idx) => {
              const revId = `${day.dayNumber}_revision_${idx}`;
              const isChecked = !!state.completedTasks[revId];

              return (
                <div
                  key={revId}
                  onClick={() => handleToggle(revId)}
                  className="flex items-start gap-3 p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E0DCD3] cursor-pointer transition-colors"
                >
                  <div className="mt-0.5 shrink-0">
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#A8A29E]" />
                    )}
                  </div>
                  <span className={`text-xs ${isChecked ? 'text-[#78716C] line-through' : 'text-[#292929]'}`}>
                    {rev}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 5: Daily Study Notes & Log */}
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#E0DCD3] pb-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#292929] uppercase tracking-wider">
              <FileText className="w-4 h-4 text-[#E7826D]" />
              <span>Personal Study Notes & Questions</span>
            </div>
            {notesSavedAlert && (
              <span className="text-xs text-[#16A34A] font-semibold">Notes Saved Successfully!</span>
            )}
          </div>

          <textarea
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
            placeholder="Record your architectural thoughts, failure cases encountered, and questions for Day review..."
            rows={4}
            className="w-full p-3 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] text-xs placeholder:text-[#A8A29E] focus:outline-none focus:border-[#E7826D] focus:bg-white transition-colors"
          />

          <div className="flex justify-end">
            <button
              onClick={handleSaveNotes}
              className="px-4 py-2 bg-[#292929] hover:bg-[#404040] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Notes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent START PREPARATION Button at Bottom */}
      <div className="pt-4 sticky bottom-4 z-20">
        <div className="p-4 rounded-2xl bg-[#292929] text-white border border-[#292929] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E7826D] block">
              Smart Study Timer · {day.targetHours} Hours Target
            </span>
            <span className="text-xs text-[#E0DCD3] font-medium block">
              {userRole === 'guest'
                ? 'Guest Preview: Test the timer without modifying Steeven’s actual record.'
                : `Ready to focus? Launch the accurate study session timer for Day ${day.dayNumber}.`}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {activeTimer.isActive && activeTimer.dayNumber === day.dayNumber ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#E7826D] animate-pulse" />
                <span>Timer Running in Header</span>
              </div>
            ) : (
              <button
                onClick={() => startTimer(day.dayNumber, day.targetHours * 60, 'daily')}
                className="w-full sm:w-auto px-6 py-3 bg-[#E7826D] hover:bg-[#D66F5A] active:bg-[#C85D48] text-white rounded-xl text-sm font-bold shadow-md shadow-[#E7826D]/30 flex items-center justify-center gap-2 cursor-pointer transition-all uppercase tracking-wider"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>START PREPARATION</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
