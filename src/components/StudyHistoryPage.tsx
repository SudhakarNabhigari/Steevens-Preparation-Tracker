import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  History,
  Download,
  Upload,
  Award,
  ShieldCheck
} from 'lucide-react';

export const StudyHistoryPage: React.FC = () => {
  const {
    state,
    exportBackup,
    importBackup
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importBackup(content);
        if (ok) {
          alert('Backup restored successfully!');
        } else {
          alert('Failed to import backup: invalid file format.');
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatDuration = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  // Build daily history summary from studyTimeSeconds
  const activeDaysWithStudy = Object.entries(state.studyTimeSeconds)
    .filter(([_, sec]) => sec > 0)
    .map(([dayStr, sec]) => ({
      dayNumber: Number(dayStr),
      seconds: sec
    }))
    .sort((a, b) => b.dayNumber - a.dayNumber);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0DCD3]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292929] tracking-tight">
            STUDY HISTORY & DATA BACKUP
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            Persisted logs of daily study timer sessions, assessment records, and complete JSON state backups.
          </p>
        </div>

        {/* Export & Import Buttons */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#292929] text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-[#E0DCD3] transition-colors shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Restore Backup</span>
          </button>

          <button
            onClick={exportBackup}
            className="px-3.5 py-2 rounded-xl bg-[#E7826D] hover:bg-[#D66F5A] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#E7826D]/30 transition-colors uppercase tracking-wider"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup JSON</span>
          </button>
        </div>
      </div>

      {/* Persistence Guarantee Banner */}
      <div className="p-4 rounded-xl bg-white border border-[#E0DCD3] text-xs text-[#78716C] flex items-start gap-3 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-[#292929] block">Persistent Storage Active</span>
          <p className="leading-relaxed">
            All your daily task checkboxes, notes, timer states, and assessment submissions are automatically synchronized to persistent browser storage (IndexedDB + LocalStorage) and survive page refreshes, tab closing, and browser restarts. You can also export a downloadable backup anytime.
          </p>
        </div>
      </div>

      {/* Session Logs List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[#292929]">Daily Study Session Records</h2>

        {activeDaysWithStudy.length === 0 ? (
          <div className="p-8 text-center bg-white border border-[#E0DCD3] rounded-2xl text-[#78716C] text-xs shadow-sm">
            <History className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#A8A29E]" />
            <p className="font-semibold text-[#292929]">No study sessions logged yet.</p>
            <p className="text-[11px] text-[#78716C] mt-1">Start the preparation timer on the Today Work page to begin recording daily study time.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeDaysWithStudy.map(record => (
              <div
                key={record.dayNumber}
                className="p-4 rounded-xl bg-white border border-[#E0DCD3] flex items-center justify-between text-xs shadow-sm hover:border-[#292929]/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E0DCD3] flex items-center justify-center font-mono font-bold text-[#E7826D]">
                    D{record.dayNumber}
                  </div>
                  <div>
                    <span className="font-bold text-[#292929] block">Day {record.dayNumber} Preparation</span>
                    <span className="text-[11px] text-[#78716C]">Tracked via Smart Study Timer</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-mono font-bold text-[#292929] text-sm tabular-nums">
                      {formatDuration(record.seconds)}
                    </span>
                    <span className="text-[10px] text-[#78716C] block">Recorded study time</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assessment History */}
      <div className="space-y-4 pt-4">
        <h2 className="text-base font-bold text-[#292929]">Submitted Assessment Submissions</h2>

        {Object.keys(state.assessmentSubmissions).length === 0 ? (
          <div className="p-6 text-center bg-white border border-[#E0DCD3] rounded-2xl text-[#78716C] text-xs shadow-sm">
            No Saturday assessments submitted yet.
          </div>
        ) : (
          <div className="space-y-3">
            {Object.values(state.assessmentSubmissions).map(sub => (
              <div
                key={sub.weekNumber}
                className="p-4 rounded-xl bg-white border border-[#E0DCD3] flex items-center justify-between text-xs shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Award className={`w-6 h-6 ${sub.passed ? 'text-[#16A34A]' : 'text-[#DC2626]'}`} />
                  <div>
                    <span className="font-bold text-[#292929] block">Week {sub.weekNumber} Saturday Assessment</span>
                    <span className="text-[11px] text-[#78716C]">
                      Submitted at {new Date(sub.submittedAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-[#292929] text-sm tabular-nums">
                    {sub.score} / {sub.maxScore} Pts ({sub.percentage}%)
                  </span>
                  <span className={`text-[10px] block font-semibold ${sub.passed ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                    {sub.passed ? 'PASSED' : 'RETAKE REQUIRED'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
