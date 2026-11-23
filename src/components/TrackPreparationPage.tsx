import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  DSA_100_DAYS,
  DSA_PLAN_OVERVIEW,
  DSA_PDF_URL,
  DSA_PDF_FILENAME,
  DSA_START_DATE,
  DSA_END_DATE,
  DSA_TOTAL_PLANNED_HOURS
} from '../data/dsaSyllabus';
import {
  AZURE_100_DAYS,
  AZURE_PLAN_OVERVIEW,
  AZURE_PDF_URL,
  AZURE_PDF_FILENAME,
  AZURE_START_DATE,
  AZURE_END_DATE,
  AZURE_TOTAL_PLANNED_HOURS
} from '../data/azureSyllabus';
import { DAILY_PREPARATION_START_ISO_IST, getDayLockStatus, SUB_TRACK_MAX_DAYS } from '../utils/dailyLock';
import { TrackDaySchedule } from '../types';
import { OWNER_RELAUNCH_START_ISO_IST } from '../utils/relaunch';
import {
  Code2,
  Cloud,
  Clock,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  Play,
  Save,
  FileText,
  ExternalLink,
  Download,
  Award,
  Target,
  BookOpen,
  ShieldCheck,
  Calendar,
  ArrowLeft,
  Search,
  Lock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TrackPreparationPageProps {
  trackId: 'dsa' | 'azure';
}

export const TrackPreparationPage: React.FC<TrackPreparationPageProps> = ({ trackId }) => {
  const {
    state,
    userRole,
    nowTimestamp,
    currentTrackDayNumber,
    selectedDsaDay,
    setSelectedDsaDay,
    selectedAzureDay,
    setSelectedAzureDay,
    isTrackDayUnlocked,
    getTrackDayStatus,
    getTrackDayTaskCompletion,
    toggleTrackTaskCompletion,
    saveTrackDayNotes,
    saveTrackRevisionRecord,
    startTimer,
    activeTimer,
    setCurrentPage,
    openDailyAiResources
  } = useApp();

  const isDsa = trackId === 'dsa';
  const legacyDays: TrackDaySchedule[] = isDsa ? DSA_100_DAYS : AZURE_100_DAYS;
  const days: TrackDaySchedule[] = legacyDays;
  const overview = isDsa ? DSA_PLAN_OVERVIEW : AZURE_PLAN_OVERVIEW;
  const pdfUrl = isDsa ? DSA_PDF_URL : AZURE_PDF_URL;
  const pdfFilename = isDsa ? DSA_PDF_FILENAME : AZURE_PDF_FILENAME;
  const startDate = isDsa ? DSA_START_DATE : AZURE_START_DATE;
  const endDate = isDsa ? DSA_END_DATE : AZURE_END_DATE;
  const totalPlannedHours = isDsa ? DSA_TOTAL_PLANNED_HOURS : AZURE_TOTAL_PLANNED_HOURS;

  const trackProgress = isDsa ? state.dsaProgress : state.azureProgress;
  const selectedDay = isDsa ? selectedDsaDay : selectedAzureDay;
  const setSelectedDay = isDsa ? setSelectedDsaDay : setSelectedAzureDay;

  const day = days[selectedDay - 1] || days[0];
  const isDayUnlocked = isTrackDayUnlocked(trackId, day.dayNumber);
  const weekFirstDay = Math.max(1, (day.weekNumber - 1) * 7 + 1);
  const isWeekUnlocked = isTrackDayUnlocked(trackId, weekFirstDay);
  const lockStatus = getDayLockStatus(day.dayNumber, nowTimestamp, SUB_TRACK_MAX_DAYS, userRole === 'owner' ? OWNER_RELAUNCH_START_ISO_IST : DAILY_PREPARATION_START_ISO_IST);
  const { completed, total, percentage } = getTrackDayTaskCompletion(trackId, day.dayNumber);
  const status = getTrackDayStatus(trackId, day.dayNumber);

  const isLockedDay = !isDayUnlocked;

  const [notesInput, setNotesInput] = useState(trackProgress.dayNotes[day.dayNumber] || '');
  const [notesSavedAlert, setNotesSavedAlert] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Weekly revision record state
  const existingRevision = trackProgress.revisionRecords[day.weekNumber];
  const [revScore, setRevScore] = useState<string>(
    existingRevision?.score !== undefined ? String(existingRevision.score) : ''
  );
  const [revMaxScore, setRevMaxScore] = useState<string>(
    existingRevision?.maxScore !== undefined ? String(existingRevision.maxScore) : '100'
  );
  const [revNotes, setRevNotes] = useState<string>(existingRevision?.notes || '');
  const [revPassed, setRevPassed] = useState<boolean>(existingRevision?.passed ?? true);
  const [revSavedAlert, setRevSavedAlert] = useState(false);

  useEffect(() => {
    setNotesInput(trackProgress.dayNotes[day.dayNumber] || '');
  }, [day.dayNumber, trackProgress.dayNotes]);

  useEffect(() => {
    const rec = trackProgress.revisionRecords[day.weekNumber];
    setRevScore(rec?.score !== undefined ? String(rec.score) : '');
    setRevMaxScore(rec?.maxScore !== undefined ? String(rec.maxScore) : '100');
    setRevNotes(rec?.notes || '');
    setRevPassed(rec?.passed ?? true);
  }, [day.weekNumber, trackProgress.revisionRecords]);

  // Overall track metrics
  const metrics = useMemo(() => {
    let completedCount = 0;
    let inProgressCount = 0;
    let incompleteCount = 0;

    for (let d = 1; d <= 100; d++) {
      const s = getTrackDayStatus(trackId, d);
      if (s === 'completed') completedCount++;
      else if (s === 'in-progress') inProgressCount++;
      else if (s === 'incomplete') incompleteCount++;
    }

    const totalActualSeconds = Object.values(trackProgress.studyTimeSeconds || {}).reduce(
      (sum, v) => sum + v,
      0
    );
    const actualHours = (totalActualSeconds / 3600).toFixed(1);
    const progressPct = Math.round((completedCount / 100) * 100);
    const revisionsLogged = Object.keys(trackProgress.revisionRecords || {}).length;

    return {
      completedCount,
      inProgressCount,
      incompleteCount,
      remainingCount: 100 - completedCount,
      actualHours,
      progressPct,
      revisionsLogged
    };
  }, [getTrackDayStatus, trackId, trackProgress.studyTimeSeconds, trackProgress.revisionRecords]);

  const filteredGridDays = useMemo(() => {
    if (!searchTerm.trim()) return days;
    const q = searchTerm.toLowerCase();
    return days.filter(d => {
      const unlocked = isTrackDayUnlocked(trackId, d.dayNumber);
      const baseMatch =
        d.topic.toLowerCase().includes(q) ||
        d.phaseTitle.toLowerCase().includes(q) ||
        `day ${d.dayNumber}`.includes(q);
      if (baseMatch) return true;
      if (!unlocked) return false;
      return (
        d.objective.toLowerCase().includes(q) ||
        d.studentWork.toLowerCase().includes(q)
      );
    });
  }, [days, searchTerm, isTrackDayUnlocked, trackId]);

  const handleToggleChecklist = (taskId: string) => {
    if (isLockedDay) return;
    const wasDone = !!trackProgress.completedTasks[taskId];
    toggleTrackTaskCompletion(trackId, day.dayNumber, taskId);
    if (!wasDone && completed + 1 === total) {
      try {
        confetti({ particleCount: 70, spread: 65, origin: { y: 0.65 } });
      } catch {
        // Ignore if unavailable
      }
    }
  };

  const handleSaveNotes = () => {
    if (isLockedDay) return;
    saveTrackDayNotes(trackId, day.dayNumber, notesInput);
    setNotesSavedAlert(true);
    setTimeout(() => setNotesSavedAlert(false), 2000);
  };

  const handleSaveRevision = () => {
    if (!isWeekUnlocked) return;
    saveTrackRevisionRecord(trackId, day.weekNumber, {
      score: revScore !== '' ? Number(revScore) : undefined,
      maxScore: revMaxScore !== '' ? Number(revMaxScore) : undefined,
      notes: revNotes,
      passed: revPassed
    });
    setRevSavedAlert(true);
    setTimeout(() => setRevSavedAlert(false), 2000);
  };

  const isRunningThisTrackDay =
    activeTimer.isActive && activeTimer.trackId === trackId && activeTimer.dayNumber === day.dayNumber;

  const dayStudiedSeconds = trackProgress.studyTimeSeconds[day.dayNumber] || 0;
  const formatShortDuration = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Back & Track Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E0DCD3]">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCurrentPage('home_dashboard')}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#E0DCD3] hover:bg-[#FAF8F5] text-xs font-semibold text-[#292929] flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E7826D] flex items-center gap-1.5">
              {isDsa ? <Code2 className="w-4 h-4" /> : <Cloud className="w-4 h-4" />}
              <span>{isDsa ? 'INDEPENDENT TRACK · DSA IN C++' : 'INDEPENDENT TRACK · AZURE'}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292929] tracking-tight">
            {overview.title}
          </h1>
          <p className="text-xs text-[#5A5650]">
            {userRole === 'owner'
              ? `Calendar: 23 November 2026 – ${endDate} | ${isDsa ? 'Monday–Friday: 90 minutes | Saturday: 2 hours revision | Sunday: 2 hours revision' : '1 hour daily, including weekend revision'} | Total: 100 consecutive calendar days.`
              : overview.calendarSummary}
          </p>
        </div>

        {/* Authoritative PDF Reference Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => openDailyAiResources(trackId, day.dayNumber)}
            className="px-3 py-2 rounded-xl bg-[#292929] hover:bg-[#3A3A3A] text-[#F3EFE6] text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E7826D]" />
            <span>Day {day.dayNumber} AI Resources</span>
          </button>
          <button
            onClick={() => setShowOverview(!showOverview)}
            className="px-3 py-2 rounded-xl bg-white border border-[#E0DCD3] hover:bg-[#FAF8F5] text-xs font-semibold text-[#292929] cursor-pointer shadow-sm"
          >
            {showOverview ? 'Hide Plan Overview' : 'View Plan Overview & Phases'}
          </button>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-xl bg-[#292929] hover:bg-[#3A3A3A] text-[#F3EFE6] text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#E7826D]" />
            <span>Open PDF</span>
          </a>
          <a
            href={pdfUrl}
            download={pdfFilename}
            className="px-3 py-2 rounded-xl bg-white border border-[#E0DCD3] hover:bg-[#FAF8F5] text-xs font-semibold text-[#292929] flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* Collapsible PDF Plan Overview */}
      {showOverview && (
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-5 shadow-sm space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-[#E0DCD3] pb-2">
            <span className="font-bold text-[#292929] uppercase tracking-wider">
              {overview.subtitle}
            </span>
            <span className="font-mono text-[#78716C]">
              {startDate} – {endDate}
            </span>
          </div>
          <p className="text-[#5A5650] leading-relaxed">{overview.scopeNote}</p>
          <p className="text-[#5A5650] leading-relaxed">{overview.dailyStructure}</p>
          <div className="space-y-1.5 pt-1">
            <span className="font-bold text-[#292929] block">Phase Overview:</span>
            <ul className="space-y-1 list-disc pl-5 text-[#5A5650]">
              {overview.phases.map((phase, idx) => (
                <li key={idx}>{phase}</li>
              ))}
            </ul>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] text-[#292929]">
            <strong className="text-[#E7826D]">Completion & Evidence Rule: </strong>
            <span>{overview.completionRule}</span>
          </div>
        </div>
      )}

      {/* Strict IST Schedule Info Banner */}
      {isLockedDay && (
        <div className="p-4 rounded-2xl bg-[#292929] text-[#F3EFE6] border border-[#E7826D]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#E7826D] shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <span className="font-bold block">
                Day {day.dayNumber} Unlocks {lockStatus.unlockLabelIst}
              </span>
              <span className="text-[#C2BEB5]">
                Explore the complete 100-day {isDsa ? 'DSA in C++' : 'Azure'} roadmap structure and topics now. Detailed daily tasks, instructions, notes, and timers unlock automatically at 00:00 IST on each scheduled date.
              </span>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-lg bg-[#E7826D]/15 border border-[#E7826D]/40 text-[#E7826D] font-mono font-bold text-xs shrink-0 self-start sm:self-auto">
            {String(lockStatus.days).padStart(2, '0')}d : {String(lockStatus.hours).padStart(2, '0')}h : {String(lockStatus.minutes).padStart(2, '0')}m
          </span>
        </div>
      )}

      {/* Independent Track Progress Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-[#E0DCD3] rounded-xl p-3.5">
          <span className="text-[11px] font-medium text-[#736E65] block mb-1">Track Progress</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#292929] tabular-nums">
            {metrics.progressPct}%
          </span>
          <span className="text-[10px] text-[#9B968D] mt-1 block">100 total days</span>
        </div>

        <div className="bg-white border border-[#BBF7D0] rounded-xl p-3.5">
          <span className="text-[11px] font-medium text-[#15803D] block mb-1">Completed</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#15803D] tabular-nums">
            {metrics.completedCount} / 100
          </span>
          <span className="text-[10px] text-[#9B968D] mt-1 block">Verified days</span>
        </div>

        <div className="bg-white border border-[#FED7AA] rounded-xl p-3.5">
          <span className="text-[11px] font-medium text-[#C2410C] block mb-1">In Progress</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#E7826D] tabular-nums">
            {metrics.inProgressCount}
          </span>
          <span className="text-[10px] text-[#9B968D] mt-1 block">Started days</span>
        </div>

        <div className="bg-white border border-[#FECACA] rounded-xl p-3.5">
          <span className="text-[11px] font-medium text-[#B91C1C] block mb-1">Incomplete</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#B91C1C] tabular-nums">
            {metrics.incompleteCount}
          </span>
          <span className="text-[10px] text-[#9B968D] mt-1 block">Past pending</span>
        </div>

        <div className="bg-white border border-[#E0DCD3] rounded-xl p-3.5">
          <span className="text-[11px] font-medium text-[#736E65] block mb-1">Actual Study Time</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold font-mono text-[#292929] tabular-nums">
              {metrics.actualHours}h
            </span>
            <span className="text-[11px] text-[#736E65] font-mono">/ {totalPlannedHours}h</span>
          </div>
          <span className="text-[10px] text-[#9B968D] mt-1 block">Track timer recorded</span>
        </div>

        <div className="bg-white border border-[#E0DCD3] rounded-xl p-3.5">
          <span className="text-[11px] font-medium text-[#736E65] block mb-1">Weekly Reviews</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#292929] tabular-nums">
            {metrics.revisionsLogged} / 14
          </span>
          <span className="text-[10px] text-[#9B968D] mt-1 block">Checkpoints saved</span>
        </div>
      </div>

      {/* Selected Day Header & Navigation */}
      <div className="bg-white border border-[#E0DCD3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0DCD3]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSelectedDay(Math.max(1, day.dayNumber - 1))}
                disabled={day.dayNumber <= 1}
                className="p-2 rounded-lg bg-[#FAF8F5] border border-[#E0DCD3] hover:bg-[#F3EFE6] text-[#292929] disabled:opacity-30 cursor-pointer"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedDay(Math.min(100, day.dayNumber + 1))}
                disabled={day.dayNumber >= 100}
                className="p-2 rounded-lg bg-[#FAF8F5] border border-[#E0DCD3] hover:bg-[#F3EFE6] text-[#292929] disabled:opacity-30 cursor-pointer"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#78716C]">
                <span className="font-bold text-[#E7826D] uppercase">{day.phaseTitle}</span>
                <span>·</span>
                <span className="font-mono">PDF Page {day.pdfPage}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#292929]">
                DAY {day.dayNumber} OF 100 — {day.topic}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {day.dayNumber !== currentTrackDayNumber && (
              <button
                onClick={() => setSelectedDay(currentTrackDayNumber)}
                className="text-xs font-semibold text-[#E7826D] hover:underline cursor-pointer"
              >
                Jump to Day {currentTrackDayNumber}
              </button>
            )}
            <button
              onClick={() => setCurrentPage('preparation_calendar')}
              className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E0DCD3] hover:bg-[#F3EFE6] text-xs font-semibold text-[#292929] flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#E7826D]" />
              <span>Track Calendar</span>
            </button>
          </div>
        </div>

        {/* Metadata Pills & Status */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E0DCD3] font-mono font-semibold text-[#292929]">
              {day.dateString} ({day.dayOfWeek})
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E0DCD3] font-semibold text-[#292929] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#E7826D]" />
              <span>Schedule: {day.scheduleLabel}</span>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E0DCD3] text-[#5A5650]">
              Week {day.weekNumber}
            </span>
            {day.isWeekendRevision && (
              <span className="px-2.5 py-1 rounded-md bg-[#E7826D]/15 text-[#E7826D] border border-[#E7826D]/30 font-bold">
                {day.dayOfWeek === 'Saturday' ? 'Saturday Practical Revision & Assessment' : 'Sunday Revision & Consolidation'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="font-mono text-[#78716C]">
              Logged: <strong className="text-[#292929]">{formatShortDuration(dayStudiedSeconds)}</strong>
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold uppercase ${
                status === 'completed'
                  ? 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]'
                  : status === 'in-progress'
                  ? 'bg-[#FFEDD5] text-[#C2410C] border border-[#E7826D]'
                  : status === 'incomplete'
                  ? 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]'
                  : 'bg-stone-100 text-stone-600 border border-stone-200'
              }`}
            >
              {status.replace('-', ' ')}
            </span>
            <span className="font-mono font-bold text-[#292929]">
              {isDayUnlocked ? `${completed}/${total} (${percentage}%)` : 'LOCKED'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E0DCD3]">
          <div
            className={`h-full transition-all duration-300 ${
              isDayUnlocked && percentage === 100
                ? 'bg-[#16A34A]'
                : isDayUnlocked && percentage > 0
                ? 'bg-[#E7826D]'
                : 'bg-transparent'
            }`}
            style={{ width: `${isDayUnlocked ? percentage : 0}%` }}
          />
        </div>

        {/* Exact Curriculum Fields Grid (Only revealed once unlocked at 00:00 IST) */}
        {isDayUnlocked ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E7826D] block">
                  Class Focus
                </span>
                <p className="font-semibold text-[#292929]">{day.classFocus}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E7826D] block">
                  Objective
                </span>
                <p className="text-[#292929] leading-relaxed">{day.objective}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E7826D] block">
                  Student Work
                </span>
                <p className="text-[#292929] leading-relaxed">{day.studentWork}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E7826D] block">
                  Milestone / Output
                </span>
                <p className="font-semibold text-[#292929] leading-relaxed">{day.milestoneOutput}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] text-xs">
              <span className="font-bold text-[#292929]">Daily Scope: </span>
              <span className="text-[#5A5650]">{day.dailyScope}</span>
            </div>
          </>
        ) : (
          <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E0DCD3] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#292929]">
                <Lock className="w-4 h-4 text-[#E7826D]" />
                <span>Day {day.dayNumber} Detailed Tasks & Completion Controls Locked</span>
              </div>
              <span className="font-mono text-xs font-semibold text-[#78716C]">
                Unlocks {lockStatus.unlockLabelIst}
              </span>
            </div>
            <p className="text-xs text-[#5A5650] leading-relaxed">
              Future task details, daily work instructions, deliverables, checklists, notes, and timers unlock automatically at{' '}
              <strong className="text-[#292929] font-mono">{lockStatus.unlockLabelIst}</strong>.
            </p>
            <div className="grid grid-cols-4 gap-2.5 max-w-md mx-auto">
              <div className="bg-white border border-[#E0DCD3] rounded-xl p-2.5 text-center">
                <span className="text-xl font-extrabold font-mono text-[#292929] tabular-nums block">
                  {String(lockStatus.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">Days</span>
              </div>
              <div className="bg-white border border-[#E0DCD3] rounded-xl p-2.5 text-center">
                <span className="text-xl font-extrabold font-mono text-[#292929] tabular-nums block">
                  {String(lockStatus.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">Hours</span>
              </div>
              <div className="bg-white border border-[#E0DCD3] rounded-xl p-2.5 text-center">
                <span className="text-xl font-extrabold font-mono text-[#292929] tabular-nums block">
                  {String(lockStatus.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">Min</span>
              </div>
              <div className="bg-white border border-[#E0DCD3] rounded-xl p-2.5 text-center">
                <span className="text-xl font-extrabold font-mono text-[#E7826D] tabular-nums block">
                  {String(lockStatus.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">Sec</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checklist + Notes + Weekly Revision Two-Column Workspace (Unlocked Days Only) */}
      {isDayUnlocked && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Checklist & Study Notes */}
        <div className="lg:col-span-2 space-y-5">
          {/* Interactive Completion Checklist */}
          <div className="bg-white border border-[#E0DCD3] rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#E0DCD3] pb-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#292929] uppercase tracking-wider">
                <Target className="w-4 h-4 text-[#E7826D]" />
                <span>Day {day.dayNumber} Completion Checklist</span>
              </div>
              <span className="text-xs font-mono text-[#78716C]">
                {completed}/{total} Done
              </span>
            </div>

            <div className="space-y-2.5">
              {day.checklist.map(item => {
                const isDone = !!trackProgress.completedTasks[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleChecklist(item.id)}
                    className="flex items-start gap-3 p-3.5 rounded-xl border transition-colors bg-[#FAF8F5] hover:bg-[#F3EFE6] border-[#E0DCD3] cursor-pointer"
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#A8A29E]" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <span
                        className={`text-xs sm:text-sm font-semibold block ${
                          isDone ? 'text-[#78716C] line-through' : 'text-[#292929]'
                        }`}
                      >
                        {item.title}
                      </span>
                      <span className="text-xs text-[#5A5650] block leading-relaxed">
                        {item.description}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-[#78716C] pt-1">
              {overview.completionRule}
            </p>
          </div>

          {/* Personal Study Notes */}
          <div className="bg-white border border-[#E0DCD3] rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#E0DCD3] pb-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#292929] uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-[#E7826D]" />
                <span>Personal Notes & Milestone Evidence (Day {day.dayNumber})</span>
              </div>
              {notesSavedAlert && (
                <span className="text-xs text-[#16A34A] font-semibold">Saved Successfully!</span>
              )}
            </div>

            <textarea
              value={notesInput}
              onChange={e => setNotesInput(e.target.value)}
              placeholder={
                isDsa
                  ? 'Record C++ implementation notes, time/space complexity, dry-run traces, or compile errors fixed...'
                  : 'Record Azure service comparison notes, CLI/portal observations, lab cleanup confirmation, or notes...'
              }
              rows={4}
              className="w-full p-3 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] text-xs placeholder:text-[#A8A29E] focus:outline-none focus:border-[#E7826D] focus:bg-white"
            />

            <div className="flex justify-end">
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-[#292929] hover:bg-[#404040] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Revision / Assessment Checkpoint Log */}
        <div className="space-y-5">
          {isWeekUnlocked && (
          <div className="bg-white border border-[#E0DCD3] rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#E0DCD3] pb-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#292929] uppercase tracking-wider">
                <Award className="w-4 h-4 text-[#E7826D]" />
                <span>Week {day.weekNumber} Checkpoint</span>
              </div>
              {existingRevision && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    existingRevision.passed
                      ? 'bg-[#DCFCE7] text-[#15803D]'
                      : 'bg-[#FEE2E2] text-[#B91C1C]'
                  }`}
                >
                  {existingRevision.passed ? 'Completed' : 'Needs Review'}
                </span>
              )}
            </div>

            <p className="text-xs text-[#5A5650] leading-relaxed">
              Log your Week {day.weekNumber} Saturday practical revision/assessment score and Sunday consolidation reflections for this track only.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#78716C] block mb-1">
                  Score Achieved
                </label>
                <input
                  type="number"
                  min={0}
                  value={revScore}
                  onChange={e => setRevScore(e.target.value)}
                  placeholder="e.g. 85"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs text-[#292929] focus:outline-none focus:border-[#E7826D]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#78716C] block mb-1">
                  Max Score
                </label>
                <input
                  type="number"
                  min={1}
                  value={revMaxScore}
                  onChange={e => setRevMaxScore(e.target.value)}
                  placeholder="100"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs text-[#292929] focus:outline-none focus:border-[#E7826D]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#78716C] block mb-1">
                Revision & Error Log Notes
              </label>
              <textarea
                value={revNotes}
                onChange={e => setRevNotes(e.target.value)}
                rows={3}
                placeholder="Weak areas revisited, edge cases missed, or lab cleanup verified..."
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs text-[#292929] focus:outline-none focus:border-[#E7826D]"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-[#292929] cursor-pointer">
              <input
                type="checkbox"
                checked={revPassed}
                onChange={e => setRevPassed(e.target.checked)}
                className="accent-[#E7826D]"
              />
              <span>Mark Week {day.weekNumber} checkpoint passed</span>
            </label>

            <div className="flex items-center justify-between pt-1">
              {revSavedAlert ? (
                <span className="text-xs text-[#16A34A] font-semibold">Checkpoint Saved!</span>
              ) : (
                <span className="text-[11px] text-[#78716C]">
                  {existingRevision
                    ? `Last saved: ${new Date(existingRevision.completedAt).toLocaleDateString()}`
                    : 'Not saved yet'}
                </span>
              )}
              <button
                onClick={handleSaveRevision}
                className="px-3.5 py-2 bg-[#E7826D] hover:bg-[#d8735e] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Save Checkpoint
              </button>
            </div>
          </div>
          )}

          {/* Authoritative PDF Info Box */}
          <div className="bg-white border border-[#E0DCD3] rounded-2xl p-4 shadow-sm space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#292929]">
              <FileText className="w-4 h-4 text-[#E7826D]" />
              <span>Source Syllabus Reference</span>
            </div>
            <p className="text-[#5A5650] text-[11px] leading-relaxed">
              {pdfFilename} · 100 individual daily entries ({startDate} – {endDate}).
            </p>
          </div>
        </div>
      </div>
      )}

      {/* 100-Day Interactive Track Grid */}
      <div className="bg-white border border-[#E0DCD3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#292929]">
              100-Day {isDsa ? 'DSA in C++' : 'Azure'} Schedule Map
            </h2>
            <p className="text-xs text-[#5A5650]">
              Click any day (D1–D100) to switch directly within this track.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Filter 100 days by topic..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs text-[#292929] focus:outline-none focus:border-[#E7826D]"
            />
          </div>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-10 lg:grid-cols-10 gap-2">
          {filteredGridDays.map(item => {
            const dStatus = getTrackDayStatus(trackId, item.dayNumber);
            const isSelected = item.dayNumber === day.dayNumber;
            const { completed: dDone, total: dTotal } = getTrackDayTaskCompletion(
              trackId,
              item.dayNumber
            );

            let boxStyle = 'bg-[#FAF8F5] text-[#736E65] border-[#E0DCD3] hover:border-[#292929]';
            let dotColor = 'bg-[#D5D0C7]';

            if (dStatus === 'completed') {
              boxStyle = 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC] font-bold';
              dotColor = 'bg-[#16A34A]';
            } else if (dStatus === 'in-progress') {
              boxStyle = 'bg-[#FFEDD5] text-[#C2410C] border-[#E7826D] font-bold';
              dotColor = 'bg-[#E7826D]';
            } else if (dStatus === 'incomplete') {
              boxStyle = 'bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5] font-bold';
              dotColor = 'bg-[#DC2626]';
            } else if (dStatus === 'locked') {
              boxStyle = 'bg-[#F3EFE6] text-[#A8A49C] border-[#EAE5DC] opacity-75';
            }

            return (
              <button
                key={item.dayNumber}
                onClick={() => setSelectedDay(item.dayNumber)}
                className={`group relative p-2 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${boxStyle} ${
                  isSelected ? 'ring-2 ring-[#E7826D] ring-offset-2 ring-offset-white' : ''
                }`}
                title={`Day ${item.dayNumber}: ${item.topic} (${item.dateString}) · ${dDone}/${dTotal}`}
              >
                <span className="font-mono text-xs font-semibold tabular-nums">D{item.dayNumber}</span>
                <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${dotColor}`} />
                <div className="hidden group-hover:block absolute bottom-full mb-1 z-30 w-44 p-2 bg-[#292929] text-[#F3EFE6] rounded-lg text-left shadow-lg pointer-events-none">
                  <div className="text-[10px] font-bold">
                    Day {item.dayNumber} · {item.dayOfWeek.slice(0, 3)}
                  </div>
                  <div className="text-[9px] text-[#E0DCD3] truncate">{item.topic}</div>
                  <div className="text-[9px] text-[#A8A49C] mt-1 flex justify-between">
                    <span>{item.dateString}</span>
                    <span className="font-mono">{item.targetMinutes}m</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky Start Preparation Timer Bar for This Track */}
      <div className="pt-2 sticky bottom-4 z-20">
        <div className="p-4 rounded-2xl bg-[#292929] text-white border border-[#292929] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E7826D] block">
              {isDsa ? 'DSA in C++' : 'Azure'} Track Timer · {day.scheduleLabel}
            </span>
            <span className="text-xs text-[#E0DCD3] font-medium block">
              {!isDayUnlocked
                ? `Locked until ${lockStatus.unlockLabelIst} (Asia/Kolkata).`
                : userRole === 'guest'
                ? `Guest Preview: Run the ${day.targetMinutes}-minute timer for Day ${day.dayNumber}.`
                : `Independent timer for ${isDsa ? 'DSA in C++' : 'Azure'} Day ${day.dayNumber} (${day.topic}).`}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!isDayUnlocked ? (
              <span className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-[#E0DCD3] text-xs font-mono font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#E7826D]" />
                <span>LOCKED UNTIL {lockStatus.unlockDateLabelIst.toUpperCase()}</span>
              </span>
            ) : isRunningThisTrackDay ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#E7826D] animate-pulse" />
                <span>{isDsa ? 'DSA' : 'Azure'} Timer Running in Header</span>
              </div>
            ) : (
              <button
                onClick={() => startTimer(day.dayNumber, day.targetMinutes, 'daily', trackId)}
                className="w-full sm:w-auto px-6 py-3 bg-[#E7826D] hover:bg-[#D66F5A] text-white rounded-xl text-sm font-bold shadow-md shadow-[#E7826D]/30 flex items-center justify-center gap-2 cursor-pointer transition-all uppercase tracking-wider"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>START {isDsa ? 'DSA' : 'AZURE'} TIMER ({day.targetMinutes}m)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
