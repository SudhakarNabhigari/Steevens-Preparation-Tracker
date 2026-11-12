import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  X
} from 'lucide-react';

export const SmartTimerModal: React.FC = () => {
  const {
    activeTimer,
    pauseTimer,
    resumeTimer,
    resetTimer
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!activeTimer.isActive) return null;

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPct = activeTimer.targetSeconds > 0
    ? Math.min(100, Math.round((activeTimer.elapsedSeconds / activeTimer.targetSeconds) * 100))
    : 0;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Minimized Floating Pill */}
      {!isExpanded ? (
        <div
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-3 px-4 py-2.5 bg-[#292929] text-white border border-[#292929] rounded-2xl shadow-xl cursor-pointer hover:bg-[#333333] transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-white/10 text-[#E7826D] flex items-center justify-center">
            <Timer className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-[#E0DCD3]">
              {activeTimer.type === 'assessment' ? 'Exam Timer' : `Day ${activeTimer.dayNumber} Timer`}
            </div>
            <div className="font-mono text-sm font-bold text-white tabular-nums">
              {formatTime(activeTimer.remainingSeconds)}
            </div>
          </div>
          <div className="pl-1">
            {activeTimer.isPaused ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7826D]/20 text-[#E7826D] border border-[#E7826D]/40">
                Paused
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Active
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Expanded Floating Console */
        <div className="w-84 sm:w-96 bg-[#292929] text-white border border-[#292929] rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-[#E7826D] animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {activeTimer.type === 'assessment' ? 'Weekly Assessment Timer' : `Day ${activeTimer.dayNumber} Preparation Timer`}
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-[#E0DCD3] hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Large Countdown Digits */}
          <div className="text-center py-2 space-y-1">
            <div className="font-mono text-4xl sm:text-5xl font-extrabold text-[#E7826D] tracking-tight tabular-nums">
              {formatTime(activeTimer.remainingSeconds)}
            </div>
            <div className="text-xs text-[#E0DCD3] flex items-center justify-center gap-3">
              <span>Elapsed: <strong className="font-mono text-white">{formatTime(activeTimer.elapsedSeconds)}</strong></span>
              <span>·</span>
              <span>Target: <strong className="font-mono text-white">{formatTime(activeTimer.targetSeconds)}</strong></span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-[#E0DCD3]">
              <span>Session Progress</span>
              <span className="font-mono font-bold text-[#E7826D]">{progressPct}%</span>
            </div>
            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-[#E7826D] rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Timer Controls */}
          {!showResetConfirm ? (
            <div className="flex items-center justify-between gap-3 pt-2">
              {activeTimer.isPaused ? (
                <button
                  onClick={resumeTimer}
                  className="flex-1 py-2.5 px-3 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-colors uppercase tracking-wider"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Resume Timer</span>
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="flex-1 py-2.5 px-3 bg-[#E7826D] hover:bg-[#D66F5A] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-colors uppercase tracking-wider"
                >
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  <span>Pause Timer</span>
                </button>
              )}

              <button
                onClick={() => setShowResetConfirm(true)}
                className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-[#E0DCD3] hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border border-white/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 text-center">
              <span className="text-xs text-[#E0DCD3] block font-medium">Reset study timer to target duration?</span>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    resetTimer();
                    setShowResetConfirm(false);
                    setIsExpanded(false);
                  }}
                  className="px-3 py-1.5 bg-[#DC2626] hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
