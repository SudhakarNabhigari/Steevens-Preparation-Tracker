import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  Lock,
  Calendar,
  BookOpen,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const LockScreen: React.FC = () => {
  const {
    lockTimeRemaining,
    setCurrentPage,
    setSimulationMode
  } = useApp();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#F3EFE6]">
      <div className="max-w-3xl w-full z-10 text-center space-y-8">
        {/* Prominent Lock Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white border border-[#E0DCD3] text-[#E7826D] shadow-sm relative">
          <Lock className="w-10 h-10" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E7826D] border-2 border-white animate-pulse" />
        </div>

        {/* Mandatory Exact Headings */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#292929] uppercase">
            YOUR 180-DAY PREPARATION JOURNEY WILL START SOON!
          </h1>
          <p className="text-base sm:text-lg text-[#78716C] font-medium">
            This preparation will start on <span className="text-[#E7826D] font-bold">23 November 2026</span> at <span className="text-[#E7826D] font-bold">12:00 AM IST</span>.
          </p>
          <p className="text-xs sm:text-sm text-[#78716C] max-w-xl mx-auto">
            All daily tasks, timers, completion checkboxes, and weekly assessments will automatically unlock once the official start time arrives.
          </p>
        </div>

        {/* Live Countdown Display */}
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="text-xs uppercase tracking-wider text-[#78716C] mb-6 font-bold flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-[#E7826D]" />
            <span>Time Remaining Until Official Launch</span>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-lg mx-auto">
            {/* Days */}
            <div className="bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl p-3 sm:p-4 flex flex-col items-center">
              <span className="text-2xl sm:text-4xl font-extrabold font-mono text-[#292929] tabular-nums">
                {String(lockTimeRemaining.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-[#78716C] uppercase tracking-wider mt-1 font-semibold">
                Days
              </span>
            </div>

            {/* Hours */}
            <div className="bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl p-3 sm:p-4 flex flex-col items-center">
              <span className="text-2xl sm:text-4xl font-extrabold font-mono text-[#292929] tabular-nums">
                {String(lockTimeRemaining.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-[#78716C] uppercase tracking-wider mt-1 font-semibold">
                Hours
              </span>
            </div>

            {/* Minutes */}
            <div className="bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl p-3 sm:p-4 flex flex-col items-center">
              <span className="text-2xl sm:text-4xl font-extrabold font-mono text-[#292929] tabular-nums">
                {String(lockTimeRemaining.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-[#78716C] uppercase tracking-wider mt-1 font-semibold">
                Minutes
              </span>
            </div>

            {/* Seconds */}
            <div className="bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl p-3 sm:p-4 flex flex-col items-center">
              <span className="text-2xl sm:text-4xl font-extrabold font-mono text-[#E7826D] tabular-nums">
                {String(lockTimeRemaining.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-[#78716C] uppercase tracking-wider mt-1 font-semibold">
                Seconds
              </span>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#E0DCD3] flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#78716C]">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#E7826D]" />
              <span>Start: 23 Nov 2026, 12:00 AM IST</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#E7826D]" />
              <span>End: 21 May 2027</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#E7826D]" />
              <span>745 Total Scheduled Hours</span>
            </span>
          </div>
        </div>

        {/* Read-Only Syllabus Preview while locked */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setCurrentPage('roadmap_pdf')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#292929] hover:bg-[#404040] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer uppercase tracking-wider shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-[#E7826D]" />
            <span>View Stored Roadmap PDF</span>
          </button>
          <button
            onClick={() => setCurrentPage('original_roadmap')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E0DCD3] text-[#292929] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer uppercase tracking-wider shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-[#78716C]" />
            <span>Read Original Roadmap & Audit</span>
            <ArrowRight className="w-4 h-4 text-[#78716C]" />
          </button>
        </div>

        {/* Explore Roadmap & Schedule Safely While Daily Tasks Remain Locked */}
        <div className="mt-8 p-5 rounded-2xl bg-white border border-[#E0DCD3] text-left max-w-xl mx-auto shadow-sm">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#E7826D] shrink-0 mt-0.5" />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#292929] uppercase tracking-wider">
                  Schedule & Structure Exploration
                </span>
                <span className="text-[11px] text-[#E7826D] bg-[#FAF8F5] border border-[#E0DCD3] px-2 py-0.5 rounded font-mono font-bold">
                  Always Accessible
                </span>
              </div>
              <p className="text-xs text-[#78716C] leading-relaxed">
                You can freely explore the dashboard, preparation calendar, track overviews, resources, and weekly schedules now. Actual study tasks, checkboxes, notes, timers, and weekly assessments unlock strictly at 00:00 IST on their scheduled dates.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => setCurrentPage('home_dashboard')}
                  className="px-3.5 py-2 rounded-xl bg-[#E7826D] hover:bg-[#D66F5A] text-white text-xs font-bold cursor-pointer shadow-sm transition-colors uppercase tracking-wider"
                >
                  Open Home Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage('weekly_assessments')}
                  className="px-3.5 py-2 rounded-xl bg-[#292929] hover:bg-[#404040] text-white text-xs font-bold cursor-pointer shadow-sm transition-colors uppercase tracking-wider"
                >
                  View 26-Week Assessment Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
