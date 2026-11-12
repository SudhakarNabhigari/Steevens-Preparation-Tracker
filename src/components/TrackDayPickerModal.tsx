import React from 'react';
import { useApp } from '../context/AppContext';
import { ALL_180_DAYS } from '../data/syllabus';
import { DSA_100_DAYS } from '../data/dsaSyllabus';
import { AZURE_100_DAYS } from '../data/azureSyllabus';
import { TrackId } from '../types';
import { X, Layers, Code2, Cloud, Clock, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

interface TrackDayPickerModalProps {
  dayNumber: number | null;
  onClose: () => void;
}

export const TrackDayPickerModal: React.FC<TrackDayPickerModalProps> = ({ dayNumber, onClose }) => {
  const {
    openDayForTrack,
    getTrackDayStatus,
    getTrackDayTaskCompletion
  } = useApp();

  if (!dayNumber) return null;

  const mainDay = ALL_180_DAYS[dayNumber - 1];
  const dsaDay = dayNumber <= 100 ? DSA_100_DAYS[dayNumber - 1] : null;
  const azureDay = dayNumber <= 100 ? AZURE_100_DAYS[dayNumber - 1] : null;

  const renderStatusBadge = (track: TrackId, dayNum: number) => {
    const status = getTrackDayStatus(track, dayNum);
    const { completed, total } = getTrackDayTaskCompletion(track, dayNum);

    const badgeClasses =
      status === 'completed'
        ? 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]'
        : status === 'in-progress'
        ? 'bg-[#FFEDD5] text-[#C2410C] border-[#E7826D]'
        : status === 'incomplete'
        ? 'bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5]'
        : 'bg-[#FAF8F5] text-[#736E65] border-[#E0DCD3]';

    return (
      <div className="flex items-center gap-2 text-[11px]">
        <span className={`px-2 py-0.5 rounded-full border font-bold uppercase ${badgeClasses}`}>
          {status.replace('-', ' ')}
        </span>
        <span className="font-mono text-[#78716C]">
          {completed}/{total} tasks
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#292929]/70 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white border border-[#E0DCD3] rounded-2xl p-5 sm:p-6 max-w-xl w-full shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E0DCD3] pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E7826D] block">
              Open Preparation Track
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#292929]">
              Day {dayNumber} · {mainDay?.dateString} ({mainDay?.dayOfWeek})
            </h3>
            <p className="text-xs text-[#78716C] mt-0.5">
              Choose which independent preparation plan you want to open for Day {dayNumber}.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#78716C] hover:text-[#292929] hover:bg-[#FAF8F5] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Track Option Cards */}
        <div className="space-y-3">
          {/* Option 1: Main Plan (180 Days) */}
          {mainDay && (
            <button
              onClick={() => {
                openDayForTrack('main', dayNumber);
                onClose();
              }}
              className="w-full text-left p-4 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E0DCD3] hover:border-[#292929] transition-all cursor-pointer group space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#292929] text-[#F3EFE6] flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4 text-[#E7826D]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#292929] block">
                      180 Days Plan — Main
                    </span>
                    <span className="text-[11px] text-[#78716C]">
                      AI / ML / Generative AI / RAG · Target {mainDay.targetHours}h
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#78716C] group-hover:text-[#E7826D] shrink-0" />
              </div>

              <p className="text-xs font-semibold text-[#292929] line-clamp-1">
                {mainDay.topic}
              </p>

              <div className="flex items-center justify-between pt-1">
                {renderStatusBadge('main', dayNumber)}
                <span className="text-[10px] font-mono text-[#78716C]">Module {mainDay.moduleNumber}</span>
              </div>
            </button>
          )}

          {/* Option 2: DSA in C++ (100 Days) */}
          {dsaDay ? (
            <button
              onClick={() => {
                openDayForTrack('dsa', dayNumber);
                onClose();
              }}
              className="w-full text-left p-4 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E0DCD3] hover:border-[#E7826D] transition-all cursor-pointer group space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#E7826D]/15 text-[#E7826D] border border-[#E7826D]/30 flex items-center justify-center shrink-0">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#292929] block">
                      DSA in C++ — 100 Days
                    </span>
                    <span className="text-[11px] text-[#78716C] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#E7826D]" />
                      <span>{dsaDay.scheduleLabel}</span>
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#78716C] group-hover:text-[#E7826D] shrink-0" />
              </div>

              <p className="text-xs font-semibold text-[#292929] line-clamp-1">
                {dsaDay.topic}
              </p>

              <div className="flex items-center justify-between pt-1">
                {renderStatusBadge('dsa', dayNumber)}
                <span className="text-[10px] font-mono text-[#78716C]">Week {dsaDay.weekNumber}</span>
              </div>
            </button>
          ) : (
            <div className="w-full p-3.5 rounded-xl bg-[#FAF8F5]/60 border border-[#E0DCD3] text-xs text-[#78716C] flex items-center justify-between opacity-75">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A8A29E]" />
                <span>
                  <strong className="text-[#292929]">DSA in C++ — 100 Days</strong> concludes on Day 100 (23 Feb 2027).
                </span>
              </div>
              <Lock className="w-3.5 h-3.5 text-[#A8A29E]" />
            </div>
          )}

          {/* Option 3: Azure (100 Days) */}
          {azureDay ? (
            <button
              onClick={() => {
                openDayForTrack('azure', dayNumber);
                onClose();
              }}
              className="w-full text-left p-4 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E0DCD3] hover:border-[#E7826D] transition-all cursor-pointer group space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#292929] text-[#F3EFE6] flex items-center justify-center shrink-0">
                    <Cloud className="w-4 h-4 text-[#E7826D]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#292929] block">
                      Azure — 100 Days
                    </span>
                    <span className="text-[11px] text-[#78716C] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#E7826D]" />
                      <span>AZ-900 / DP-900 / AI-102 · {azureDay.scheduleLabel}</span>
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#78716C] group-hover:text-[#E7826D] shrink-0" />
              </div>

              <p className="text-xs font-semibold text-[#292929] line-clamp-1">
                {azureDay.topic}
              </p>

              <div className="flex items-center justify-between pt-1">
                {renderStatusBadge('azure', dayNumber)}
                <span className="text-[10px] font-mono text-[#78716C]">Week {azureDay.weekNumber}</span>
              </div>
            </button>
          ) : (
            <div className="w-full p-3.5 rounded-xl bg-[#FAF8F5]/60 border border-[#E0DCD3] text-xs text-[#78716C] flex items-center justify-between opacity-75">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A8A29E]" />
                <span>
                  <strong className="text-[#292929]">Azure — 100 Days</strong> concludes on Day 100 (23 Feb 2027).
                </span>
              </div>
              <Lock className="w-3.5 h-3.5 text-[#A8A29E]" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-[#E0DCD3]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-[#E0DCD3] hover:bg-[#FAF8F5] text-xs font-semibold text-[#292929] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
