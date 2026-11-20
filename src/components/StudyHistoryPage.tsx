import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrackId } from '../types';
import {
  History,
  Download,
  Upload,
  Award,
  ShieldCheck,
  Layers,
  Code2,
  Cloud
} from 'lucide-react';

export const StudyHistoryPage: React.FC = () => {
  const { state, exportBackup, importBackup } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [trackFilter, setTrackFilter] = useState<'all' | TrackId>('all');
  const [backupMessage, setBackupMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importBackup(content);
        setBackupMessage({
          text: ok ? 'Backup restored successfully!' : 'Failed to import backup: invalid file format.',
          ok
        });
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

  // Independent track daily study totals (never merged)
  const mainStudyDays = Object.entries(state.studyTimeSeconds || {})
    .filter(([, sec]) => sec > 0)
    .map(([dayStr, sec]) => ({ track: 'main' as TrackId, dayNumber: Number(dayStr), seconds: sec }));

  const dsaStudyDays = Object.entries(state.dsaProgress?.studyTimeSeconds || {})
    .filter(([, sec]) => sec > 0)
    .map(([dayStr, sec]) => ({ track: 'dsa' as TrackId, dayNumber: Number(dayStr), seconds: sec }));

  const azureStudyDays = Object.entries(state.azureProgress?.studyTimeSeconds || {})
    .filter(([, sec]) => sec > 0)
    .map(([dayStr, sec]) => ({ track: 'azure' as TrackId, dayNumber: Number(dayStr), seconds: sec }));

  const totalMainSecs = mainStudyDays.reduce((s, r) => s + r.seconds, 0);
  const totalDsaSecs = dsaStudyDays.reduce((s, r) => s + r.seconds, 0);
  const totalAzureSecs = azureStudyDays.reduce((s, r) => s + r.seconds, 0);
  const archivedCycles = state.preparationCycleHistory || [];

  const combinedRecords = [...mainStudyDays, ...dsaStudyDays, ...azureStudyDays]
    .filter(r => trackFilter === 'all' || r.track === trackFilter)
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
            Independent per-track study timer totals, assessment checkpoints, and complete JSON state backups.
          </p>
        </div>

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

      {backupMessage && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold border ${
            backupMessage.ok
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {backupMessage.text}
        </div>
      )}

      {/* Per-Track Isolated Study Time Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#E0DCD3] shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#292929]">
            <Layers className="w-4 h-4 text-[#E7826D]" />
            <span>MAIN PLAN (180 Days)</span>
          </div>
          <div className="font-mono text-xl font-bold text-[#292929]">{formatDuration(totalMainSecs)}</div>
          <span className="text-[11px] text-[#78716C] block">{mainStudyDays.length} active study days</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E0DCD3] shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#292929]">
            <Code2 className="w-4 h-4 text-[#E7826D]" />
            <span>DSA IN C++ (100 Days)</span>
          </div>
          <div className="font-mono text-xl font-bold text-[#292929]">{formatDuration(totalDsaSecs)}</div>
          <span className="text-[11px] text-[#78716C] block">{dsaStudyDays.length} active study days</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E0DCD3] shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#292929]">
            <Cloud className="w-4 h-4 text-[#E7826D]" />
            <span>AZURE (100 Days)</span>
          </div>
          <div className="font-mono text-xl font-bold text-[#292929]">{formatDuration(totalAzureSecs)}</div>
          <span className="text-[11px] text-[#78716C] block">{azureStudyDays.length} active study days</span>
        </div>
      </div>

      {/* Persistence Guarantee Banner */}
      <div className="p-4 rounded-xl bg-white border border-[#E0DCD3] text-xs text-[#78716C] flex items-start gap-3 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-[#292929] block">Persistent Storage Active</span>
          <p className="leading-relaxed">
            All daily task checkboxes, notes, timer sessions, and assessments across all three tracks are saved automatically to IndexedDB + LocalStorage. Study hours are strictly isolated per track.
          </p>
        </div>
      </div>

      {archivedCycles.length > 0 && (
        <section className="space-y-3 rounded-2xl border border-[#E0DCD3] bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-[#292929]">Archived Preparation Cycles</h2>
            <p className="mt-1 text-xs text-[#78716C]">Previous progress remains saved separately from the active cycle.</p>
          </div>
          {archivedCycles.map((cycle) => {
            const mainHours = Object.values(cycle.main.studyTimeSeconds).reduce((sum, seconds) => sum + (Number(seconds) || 0), 0);
            const dsaHours = Object.values(cycle.dsa.studyTimeSeconds).reduce((sum, seconds) => sum + (Number(seconds) || 0), 0);
            const azureHours = Object.values(cycle.azure.studyTimeSeconds).reduce((sum, seconds) => sum + (Number(seconds) || 0), 0);
            const completedDays = Object.values(cycle.main.completedDays).filter(Boolean).length +
              Object.values(cycle.dsa.completedDays).filter(Boolean).length +
              Object.values(cycle.azure.completedDays).filter(Boolean).length;
            const noteCount = Object.keys(cycle.main.dayNotes).length + Object.keys(cycle.dsa.dayNotes).length + Object.keys(cycle.azure.dayNotes).length;
            return (
              <div key={cycle.cycleId} className="rounded-xl border border-[#E0DCD3] bg-[#FAF8F5] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[#292929]">{cycle.cycleId === 'owner-cycle-2026-11-16' ? 'Previous cycle · 16 Nov 2026' : cycle.cycleId}</span>
                  <span className="text-[11px] text-[#78716C]">Archived {new Date(cycle.archivedAt).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' })} IST</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#625D56]">
                  <span>{completedDays} completed days across all plans</span>
                  <span>{formatDuration(mainHours + dsaHours + azureHours)} tracked</span>
                  <span>{noteCount} saved day notes</span>
                  <span>{Object.keys(cycle.main.assessmentSubmissions).length} assessment submissions</span>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Session Logs List with Track Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-base font-bold text-[#292929]">Daily Study Session Records</h2>
          <div className="flex items-center gap-1.5 text-xs">
            {(['all', 'main', 'dsa', 'azure'] as const).map(id => (
              <button
                key={id}
                onClick={() => setTrackFilter(id)}
                className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer border transition-colors ${
                  trackFilter === id
                    ? 'bg-[#292929] text-[#F3EFE6] border-[#292929]'
                    : 'bg-white text-[#5A5650] border-[#E0DCD3] hover:bg-[#FAF8F5]'
                }`}
              >
                {id === 'all' ? 'All Tracks' : id === 'main' ? 'Main Plan' : id === 'dsa' ? 'DSA in C++' : 'Azure'}
              </button>
            ))}
          </div>
        </div>

        {combinedRecords.length === 0 ? (
          <div className="p-8 text-center bg-white border border-[#E0DCD3] rounded-2xl text-[#78716C] text-xs shadow-sm">
            <History className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#A8A29E]" />
            <p className="font-semibold text-[#292929]">No study sessions logged yet.</p>
            <p className="text-[11px] text-[#78716C] mt-1">
              Start a preparation timer on Main Plan, DSA in C++, or Azure to record study time.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {combinedRecords.map(record => (
              <div
                key={`${record.track}_${record.dayNumber}`}
                className="p-4 rounded-xl bg-white border border-[#E0DCD3] flex items-center justify-between text-xs shadow-sm hover:border-[#292929]/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E0DCD3] flex items-center justify-center font-mono font-bold text-[#E7826D]">
                    D{record.dayNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#292929]">Day {record.dayNumber} Preparation</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#FAF8F5] border border-[#E0DCD3] text-[#292929]">
                        {record.track === 'main' ? 'MAIN 180' : record.track === 'dsa' ? 'DSA C++' : 'AZURE'}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#78716C]">Tracked via Smart Study Timer</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-[#292929] text-sm tabular-nums">
                    {formatDuration(record.seconds)}
                  </span>
                  <span className="text-[10px] text-[#78716C] block">Recorded study time</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Plan Assessment History */}
      <div className="space-y-4 pt-4">
        <h2 className="text-base font-bold text-[#292929]">Main Plan Weekly Assessment Submissions</h2>

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
