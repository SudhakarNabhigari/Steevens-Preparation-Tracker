import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import {
  DailyResourcesDashboardPayload,
  TrackDailyAiResources,
  TrackId
} from '../types';
import { getDayLockStatus, MAIN_TRACK_MAX_DAYS, SUB_TRACK_MAX_DAYS } from '../utils/dailyLock';
import { DAILY_PREPARATION_START_ISO_IST } from '../utils/dailyLock';
import { OWNER_RELAUNCH_START_ISO_IST } from '../utils/relaunch';
import { getOwnerAccessToken } from '../lib/supabase';
import {
  Sparkles,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Circle,
  Youtube,
  BookOpen,
  Code2,
  Cloud,
  CalendarCheck,
  Lock,
  Mail,
  AlertCircle,
  Clock,
  Send,
  Layers,
  ShieldCheck,
  Eye,
  X,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

function isSafeHttpsUrl(url?: string): boolean {
  if (!url) return false;
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}

export const DailyAiResourcesPage: React.FC = () => {
  const {
    state,
    userRole,
    isOwnerSupabaseSessionActive,
    nowTimestamp,
    currentDayNumber,
    currentTrackDayNumber,
    isTrackDayUnlocked,
    aiResourcesTarget,
    toggleDailyAiResourceCompletion,
    openDayForTrack
  } = useApp();

  const [activeTrack, setActiveTrack] = useState<TrackId>(
    aiResourcesTarget?.trackId || 'main'
  );
  const [selectedDays, setSelectedDays] = useState<Record<TrackId, number>>({
    main:
      aiResourcesTarget?.trackId === 'main'
        ? aiResourcesTarget.dayNumber
        : currentDayNumber,
    dsa:
      aiResourcesTarget?.trackId === 'dsa'
        ? aiResourcesTarget.dayNumber
        : currentTrackDayNumber,
    azure:
      aiResourcesTarget?.trackId === 'azure'
        ? aiResourcesTarget.dayNumber
        : currentTrackDayNumber
  });

  const [dashboard, setDashboard] = useState<DailyResourcesDashboardPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshingTrack, setRefreshingTrack] = useState<TrackId | null>(null);
  const [runningAutomation, setRunningAutomation] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [automationFeedback, setAutomationFeedback] = useState<string | null>(null);
  const [emailPreviewOpen, setEmailPreviewOpen] = useState<boolean>(false);
  const [emailPreviewMode, setEmailPreviewMode] = useState<TrackId | 'combined'>('main');
  const [emailPreviewLoading, setEmailPreviewLoading] = useState<boolean>(false);
  const [emailPreviewData, setEmailPreviewData] = useState<{
    subject: string;
    html: string;
    text: string;
    appUrl: string;
  } | null>(null);
  const [emailPreviewError, setEmailPreviewError] = useState<string | null>(null);

  useEffect(() => {
    if (aiResourcesTarget) {
      setActiveTrack(aiResourcesTarget.trackId);
      setSelectedDays(prev => ({
        ...prev,
        [aiResourcesTarget.trackId]: aiResourcesTarget.dayNumber
      }));
    }
  }, [aiResourcesTarget]);

  const activeDay = selectedDays[activeTrack];
  const maxDayForTrack = activeTrack === 'main' ? MAIN_TRACK_MAX_DAYS : SUB_TRACK_MAX_DAYS;
  const isSelectedDayUnlocked = isTrackDayUnlocked(activeTrack, activeDay);
  const scheduleStart = userRole === 'owner' ? OWNER_RELAUNCH_START_ISO_IST : DAILY_PREPARATION_START_ISO_IST;
  const lockStatus = getDayLockStatus(activeDay, nowTimestamp, maxDayForTrack, scheduleStart);

  const fetchTrackData = useCallback(
    async (track: TrackId, day: number) => {
      if (!isTrackDayUnlocked(track, day)) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage(null);
      try {
        const headers: HeadersInit = {};
        if (userRole === 'owner') {
          const accessToken = await getOwnerAccessToken();
          if (!accessToken) throw new Error('Loading Owner resources requires an authenticated Owner session.');
          headers.Authorization = `Bearer ${accessToken}`;
        }
        const resp = await fetch(`/api/daily-resources?track=${track}&day=${day}&role=${userRole}`, { headers });
        const json = await resp.json();
        if (!resp.ok) {
          throw new Error(json.error || `Failed to load daily resources (HTTP ${resp.status})`);
        }
        setDashboard(json as DailyResourcesDashboardPayload);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : 'Unable to reach Daily AI Resources backend.'
        );
      } finally {
        setLoading(false);
      }
    },
    [isTrackDayUnlocked, userRole]
  );

  useEffect(() => {
    fetchTrackData(activeTrack, activeDay);
  }, [activeTrack, activeDay, fetchTrackData]);

  const handleManualRefreshTrack = async () => {
    if (userRole !== 'owner' || !isSelectedDayUnlocked || refreshingTrack) return;
    setRefreshingTrack(activeTrack);
    setErrorMessage(null);
    try {
      const accessToken = await getOwnerAccessToken();
      if (!accessToken) {
        throw new Error(
          'Live AI track refresh requires an authenticated Owner Supabase session.'
        );
      }
      const resp = await fetch('/api/daily-resources/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          trackId: activeTrack,
          dayNumber: activeDay
        })
      });
      const json = await resp.json();
      if (!resp.ok) {
        throw new Error(json.error || `Refresh failed (HTTP ${resp.status})`);
      }
      if (json.dashboard) {
        setDashboard(json.dashboard as DailyResourcesDashboardPayload);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Manual track refresh failed.');
    } finally {
      setRefreshingTrack(null);
    }
  };

  const handleOwnerRunDailyAutomation = async (sendEmail: boolean) => {
    if (userRole !== 'owner' || runningAutomation) return;
    setRunningAutomation(true);
    setAutomationFeedback(null);
    setErrorMessage(null);

    try {
      const accessToken = await getOwnerAccessToken();
      if (!accessToken) {
        throw new Error(
          'Running Owner daily automation and email delivery requires a verified Supabase Owner login session.'
        );
      }
      const resp = await fetch('/api/daily-resources/run-daily', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          sendEmail,
          bypassIdempotency: sendEmail
        })
      });
      const json = await resp.json();
      if (!resp.ok) {
        throw new Error(json.error || `Automation failed (HTTP ${resp.status})`);
      }
      if (json.dashboard) {
        const updated = json.dashboard as DailyResourcesDashboardPayload;
        setDashboard(updated);
        if (sendEmail) {
          setAutomationFeedback(
            updated.automation.emailStatus === 'sent'
              ? `Daily email report sent to ${updated.automation.recipientEmail}.`
              : updated.automation.emailError ||
                  `Email status: ${updated.automation.emailStatus.replace(/_/g, ' ')}.`
          );
        } else {
          setAutomationFeedback('All 3 unlocked tracks refreshed for today.');
        }
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Daily automation failed.');
    } finally {
      setRunningAutomation(false);
    }
  };

  const handleOpenEmailPreview = async (modeOverride?: TrackId | 'combined') => {
    const targetMode = modeOverride ?? activeTrack;
    setEmailPreviewMode(targetMode);
    setEmailPreviewOpen(true);
    setEmailPreviewLoading(true);
    setEmailPreviewError(null);

    try {
      const query =
        targetMode === 'combined'
          ? '/api/daily-resources/email-preview?track=combined'
          : `/api/daily-resources/email-preview?track=${targetMode}&day=${selectedDays[targetMode]}`;
      const resp = await fetch(query);
      const json = await resp.json();
      if (!resp.ok || !json.html) {
        throw new Error(json.error || `Preview failed (HTTP ${resp.status})`);
      }
      setEmailPreviewData({
        subject: json.subject,
        html: json.html,
        text: json.text,
        appUrl: json.appUrl
      });
    } catch (err) {
      setEmailPreviewError(
        err instanceof Error ? err.message : 'Unable to generate read-only email preview.'
      );
    } finally {
      setEmailPreviewLoading(false);
    }
  };

  const currentTrackData: TrackDailyAiResources | null = dashboard?.tracks[activeTrack] || null;
  const completions = state.dailyAiResourceCompletions || {};

  const statusBadge = (() => {
    if (loading || refreshingTrack === activeTrack) {
      return {
        label: 'Loading',
        cls: 'bg-amber-50 text-amber-800 border-amber-200'
      };
    }
    if (errorMessage) {
      return {
        label: 'Failed',
        cls: 'bg-rose-50 text-rose-800 border-rose-200'
      };
    }
    if (!currentTrackData) {
      return {
        label: isSelectedDayUnlocked ? 'Unavailable' : 'Locked',
        cls: 'bg-stone-100 text-stone-700 border-stone-200'
      };
    }
    switch (currentTrackData.status) {
      case 'updated':
        return { label: 'Updated Successfully', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'partially_updated':
        return { label: 'Partially Updated', cls: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'cached':
        return { label: 'Cached', cls: 'bg-sky-50 text-sky-800 border-sky-200' };
      case 'failed':
        return { label: 'Failed', cls: 'bg-rose-50 text-rose-800 border-rose-200' };
      default:
        return { label: 'Unavailable', cls: 'bg-stone-100 text-stone-700 border-stone-200' };
    }
  })();

  const trackTabs: { id: TrackId; label: string; sub: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'main', label: 'Main Plan — 180 Days', sub: 'AI / ML & Production RAG', icon: CalendarCheck },
    { id: 'dsa', label: 'DSA in C++ (100 Days)', sub: 'Includes 3 LeetCode Questions', icon: Code2 },
    { id: 'azure', label: 'Azure — Alternate Plan', sub: 'AZ-900 · DP-900 · AI-102', icon: Cloud }
  ];

  const unlockedMaxForTrack =
    activeTrack === 'main' ? currentDayNumber : currentTrackDayNumber;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header & Section F: Status */}
      <div className="bg-white border border-[#E0DCD3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E7826D]">
              <Sparkles className="w-4 h-4" />
              <span>Daily AI Learning Resources · 10:00 AM IST Sync</span>
            </div>
            <h1 className="text-2xl font-bold text-[#292929] tracking-tight">
              DAILY AI LEARNING RESOURCES
            </h1>
            <p className="text-xs text-[#78716C]">
              Grounded daily study briefs, topic-verified YouTube tutorials, official docs, and DSA LeetCode triplets (Free Tier Gemini &amp; Resend).
            </p>
          </div>

          {/* Status & Last Updated */}
          <div className="flex flex-col items-start md:items-end gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#78716C]">Status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.cls}`}>
                {statusBadge.label}
              </span>
            </div>
            {currentTrackData?.updatedAt && (
              <span className="text-[11px] text-[#78716C] font-mono">
                Last Updated:{' '}
                {new Date(currentTrackData.updatedAt).toLocaleString('en-IN', {
                  timeZone: 'Asia/Kolkata',
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}{' '}
                IST
              </span>
            )}
          </div>
        </div>

        {/* Independent Track Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {trackTabs.map(tab => {
            const isActive = activeTrack === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTrack(tab.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  isActive
                    ? 'bg-[#292929] text-[#F3EFE6] border-[#292929] shadow-sm'
                    : 'bg-[#FAF8F5] text-[#292929] border-[#E0DCD3] hover:bg-white'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-[#E7826D] text-[#292929]' : 'bg-white border border-[#E0DCD3] text-[#E7826D]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold truncate">{tab.label}</div>
                  <div className={`text-[11px] truncate ${isActive ? 'text-[#C2BEB5]' : 'text-[#78716C]'}`}>
                    {tab.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Day Selector + Action Controls (Section E) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E0DCD3]">
          <div className="flex items-center gap-2 flex-wrap">
            <label htmlFor="ai-day-select" className="text-xs font-semibold text-[#57534E]">
              Select Schedule Day:
            </label>
            <select
              id="ai-day-select"
              value={activeDay}
              onChange={(e) =>
                setSelectedDays(prev => ({
                  ...prev,
                  [activeTrack]: Number(e.target.value)
                }))
              }
              className="px-3 py-1.5 rounded-lg border border-[#E0DCD3] bg-[#FAF8F5] text-xs font-semibold text-[#292929] cursor-pointer"
            >
              {Array.from({ length: maxDayForTrack }, (_, idx) => idx + 1).map(dayNum => {
                const unlocked = isTrackDayUnlocked(activeTrack, dayNum);
                return (
                  <option key={dayNum} value={dayNum}>
                    Day {dayNum} {unlocked ? '(Unlocked)' : '(Locked)'}
                  </option>
                );
              })}
            </select>

            <button
              onClick={() => openDayForTrack(activeTrack, activeDay)}
              className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-white border border-[#E0DCD3] text-xs font-semibold text-[#292929] cursor-pointer transition-colors"
            >
              Open Day {activeDay} Checklist &rarr;
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleOpenEmailPreview(activeTrack)}
              disabled={!isSelectedDayUnlocked}
              className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-white border border-[#E0DCD3] disabled:opacity-40 text-xs font-semibold text-[#292929] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#E7826D]" />
              <span>Preview Email</span>
            </button>
            {userRole === 'owner' ? (
              <button
                onClick={handleManualRefreshTrack}
                disabled={!isSelectedDayUnlocked || !isOwnerSupabaseSessionActive || refreshingTrack === activeTrack}
                title={
                  isOwnerSupabaseSessionActive
                    ? 'Refresh live AI resources for this unlocked track'
                    : 'Requires configured Supabase Owner session'
                }
                className="px-3.5 py-1.5 rounded-lg bg-[#292929] hover:bg-[#3D3D3D] disabled:opacity-40 text-[#F3EFE6] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-[#E7826D] ${
                    refreshingTrack === activeTrack ? 'animate-spin' : ''
                  }`}
                />
                <span>
                  {refreshingTrack === activeTrack
                    ? 'Refreshing Track...'
                    : `Refresh ${activeTrack.toUpperCase()} Resources`}
                </span>
              </button>
            ) : (
              <span className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E0DCD3] text-[11px] font-semibold text-[#57534E] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E7826D]" />
                <span>Read-Only View (Owner Auth Required to Refresh)</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Strict Future Date Lock Guard */}
      {!isSelectedDayUnlocked ? (
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-8 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E0DCD3] flex items-center justify-center mx-auto text-[#E7826D]">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#292929]">
            Day {activeDay} AI Learning Resources Locked
          </h2>
          <p className="text-sm text-[#57534E] max-w-lg mx-auto">
            Following strict Asia/Kolkata schedule unlocking, Day {activeDay} learning resources will unlock automatically on{' '}
            <strong className="text-[#292929]">{lockStatus.unlockLabelIst}</strong>.
          </p>
          <p className="text-xs font-mono text-[#78716C]">
            Countdown: {lockStatus.days}d {lockStatus.hours}h {lockStatus.minutes}m {lockStatus.seconds}s
          </p>
          <button
            onClick={() =>
              setSelectedDays(prev => ({
                ...prev,
                [activeTrack]: unlockedMaxForTrack
              }))
            }
            className="mt-2 px-4 py-2 rounded-lg bg-[#E7826D] text-[#292929] text-xs font-bold cursor-pointer hover:opacity-90"
          >
            Jump to Today (Day {unlockedMaxForTrack})
          </button>
        </div>
      ) : (
        <>
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-sm text-rose-800">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Could not fetch latest resources</div>
                <div className="text-xs mt-0.5">{errorMessage}</div>
              </div>
            </div>
          )}

          {currentTrackData?.aiProviderStatus === 'invalid_api_key' && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Gemini API Key Invalid or Disabled</div>
                <div className="mt-0.5">
                  Check <code className="font-mono font-semibold">PREPARATION_GEMINI_KEY</code> in{' '}
                  <strong>Settings &gt; Secrets</strong>. Grounded syllabus topics, timetable, docs, and LeetCode items remain active below.
                </div>
              </div>
            </div>
          )}

          {currentTrackData?.statusMessage && (
            <div className="bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl px-4 py-3 text-xs text-[#57534E] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#E7826D] shrink-0 mt-0.5" />
              <span>{currentTrackData.statusMessage}</span>
            </div>
          )}

          {loading && !currentTrackData ? (
            <div className="bg-white border border-[#E0DCD3] rounded-2xl p-10 text-center text-sm text-[#78716C]">
              Loading daily AI learning resources for {activeTrack.toUpperCase()} Day {activeDay}...
            </div>
          ) : (
            currentTrackData && (
              <div className="space-y-6">
                {/* SECTION A: TODAY'S LEARNING OVERVIEW */}
                <section className="bg-white border border-[#E0DCD3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E0DCD3]">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#E7826D]">
                        A. Today&apos;s Learning Overview · {currentTrackData.trackLabel}
                      </div>
                      <h2 className="text-xl font-bold text-[#292929] mt-0.5">
                        Day {currentTrackData.planDay}: {currentTrackData.topicTitle}
                      </h2>
                      <p className="text-xs text-[#78716C] mt-0.5">
                        {currentTrackData.phaseOrModule} · {currentTrackData.dateLabel}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-[#FAF8F5] border border-[#E0DCD3] text-xs font-mono text-[#292929]">
                      AI: {currentTrackData.aiProviderStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-sm text-[#292929] leading-relaxed">
                    {currentTrackData.topicExplanation}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl p-4 space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#292929]">
                        Learning Objectives
                      </h3>
                      <ul className="space-y-1.5 text-xs text-[#57534E]">
                        {currentTrackData.learningObjectives.map((obj, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#E7826D] font-bold">•</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl p-4 space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#292929]">
                        Suggested Learning Order
                      </h3>
                      <ol className="space-y-1.5 text-xs text-[#57534E] list-decimal list-inside">
                        {currentTrackData.suggestedLearningOrder.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="bg-[#292929] text-[#F3EFE6] rounded-xl p-4 text-xs leading-relaxed">
                    <span className="font-bold text-[#E7826D] uppercase tracking-wider mr-2">
                      Daily Guidance:
                    </span>
                    {currentTrackData.dailyGuidance}
                  </div>

                  {/* Actual Schedule Target & Study Timetable */}
                  {(currentTrackData.scheduleTarget ||
                    (currentTrackData.studyTimetable && currentTrackData.studyTimetable.length > 0)) && (
                    <div className="bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl p-4 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#292929] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#E7826D]" />
                          <span>Today&apos;s Study Plan</span>
                        </h3>
                        {currentTrackData.scheduleTarget && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#292929] text-[#F3EFE6] text-[11px] font-bold">
                            Target: {currentTrackData.scheduleTarget}
                          </span>
                        )}
                      </div>
                      {currentTrackData.studyTimetable && currentTrackData.studyTimetable.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {currentTrackData.studyTimetable.map((slot, idx) => (
                            <div
                              key={idx}
                              className="bg-white border border-[#E0DCD3] rounded-lg px-3 py-2 flex items-start gap-2"
                            >
                              <span className="px-2 py-0.5 rounded bg-[#E7826D]/15 text-[#9A3412] font-mono text-[10px] font-bold shrink-0">
                                {slot.duration}
                              </span>
                              <span className="text-xs text-[#292929] font-medium leading-snug">
                                {slot.activity}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Practical Examples, Revision Notes & Common Mistakes */}
                  {((currentTrackData.practicalExamples && currentTrackData.practicalExamples.length > 0) ||
                    (currentTrackData.revisionNotes && currentTrackData.revisionNotes.length > 0) ||
                    (currentTrackData.commonMistakes && currentTrackData.commonMistakes.length > 0)) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {currentTrackData.practicalExamples && currentTrackData.practicalExamples.length > 0 && (
                        <div className="bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl p-4 space-y-2">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#292929] flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-[#E7826D]" />
                            <span>Practical Examples</span>
                          </h3>
                          <ul className="space-y-1.5 text-xs text-[#57534E]">
                            {currentTrackData.practicalExamples.map((ex, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-[#E7826D] font-bold">•</span>
                                <span>{ex}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {currentTrackData.revisionNotes && currentTrackData.revisionNotes.length > 0 && (
                        <div className="bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl p-4 space-y-2">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#292929]">
                            Key Takeaways &amp; Revision
                          </h3>
                          <ul className="space-y-1.5 text-xs text-[#57534E]">
                            {currentTrackData.revisionNotes.map((note, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span>{note}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {currentTrackData.commonMistakes && currentTrackData.commonMistakes.length > 0 && (
                        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-2">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                            <span>Common Mistakes to Avoid</span>
                          </h3>
                          <ul className="space-y-1.5 text-xs text-amber-900/90">
                            {currentTrackData.commonMistakes.map((mistake, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="font-bold">!</span>
                                <span>{mistake}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </section>

                {/* SECTION B: YOUTUBE TUTORIALS */}
                <section className="bg-white border border-[#E0DCD3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E0DCD3]">
                    <div className="flex items-center gap-2">
                      <Youtube className="w-5 h-5 text-[#E7826D]" />
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#E7826D]">
                          B. YouTube Tutorials
                        </div>
                        <h2 className="text-lg font-bold text-[#292929]">
                          Topic-Verified Tutorials ({currentTrackData.youtubeTutorials.length})
                        </h2>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-[#78716C]">
                      Source: {currentTrackData.youtubeProviderStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {currentTrackData.youtubeTutorials.length === 0 && (
                      <p className="rounded-xl border border-[#E0DCD3] bg-[#FAF8F5] p-4 text-sm text-[#625D56]">
                        No suitable video found
                      </p>
                    )}
                    {currentTrackData.youtubeTutorials.map(yt => {
                      const doneKey = `yt_${activeTrack}_d${activeDay}_${yt.id}`;
                      const isDone = !!completions[doneKey];
                      return (
                        <div
                          key={yt.id}
                          className={`border rounded-xl p-4 transition-colors ${
                            isDone
                              ? 'bg-emerald-50/40 border-emerald-200'
                              : 'bg-[#FAF8F5] border-[#E0DCD3]'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            {yt.isVerifiedVideo && isSafeHttpsUrl(yt.thumbnailUrl) && (
                              <a
                                href={yt.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 block w-full sm:w-44 overflow-hidden rounded-lg border border-[#E0DCD3] bg-black"
                              >
                                <img
                                  src={yt.thumbnailUrl}
                                  alt={yt.title}
                                  loading="lazy"
                                  className="w-full h-24 object-cover"
                                />
                              </a>
                            )}
                            <div className="space-y-1.5 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-bold text-[#292929]">{yt.title}</h3>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    yt.isVerifiedVideo
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-amber-50 text-amber-800 border-amber-200'
                                  }`}
                                >
                                  {yt.isVerifiedVideo ? 'Verified Video' : 'Topic Search Link'}
                                </span>
                              </div>
                              <div className="text-xs text-[#78716C] flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-[#57534E]">{yt.channelName}</span>
                                {yt.duration && (
                                  <>
                                    <span>·</span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" /> {yt.duration}
                                    </span>
                                  </>
                                )}
                                {yt.language && (
                                  <>
                                    <span>·</span>
                                    <span className="uppercase">{yt.language}</span>
                                  </>
                                )}
                              </div>
                              <div className="text-xs text-[#292929] bg-white border border-[#E0DCD3] rounded-lg px-3 py-2 mt-1">
                                <span className="font-bold text-[#E7826D]">Topic Covered: </span>
                                {yt.topicCovered}
                              </div>
                              <p className="text-xs text-[#57534E]">{yt.explanation}</p>
                              <p className="text-xs text-[#57534E]">
                                <strong className="text-[#292929]">Why Watch:</strong> {yt.whyUseful}
                              </p>
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                              <a
                                href={yt.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-2 rounded-lg bg-[#292929] hover:bg-[#3D3D3D] text-[#F3EFE6] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
                              >
                                <span>
                                  {yt.isVerifiedVideo ? 'Open Resource' : 'Open Search'}
                                </span>
                                <ExternalLink className="w-3.5 h-3.5 text-[#E7826D]" />
                              </a>
                              <button
                                onClick={() => toggleDailyAiResourceCompletion(doneKey)}
                                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                                  isDone
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-white text-[#292929] border-[#E0DCD3] hover:bg-[#FAF8F5]'
                                }`}
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                  <Circle className="w-3.5 h-3.5" />
                                )}
                                <span>{isDone ? 'Completed' : 'Mark Completed'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* SECTION C: LEETCODE PRACTICE (STRICTLY DSA TRACK ONLY — 1 EASY, 1 MEDIUM, 1 HARD) */}
                {activeTrack === 'dsa' && (
                  <section className="bg-white border border-[#E0DCD3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E0DCD3]">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-[#E7826D]" />
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-[#E7826D]">
                            C. LeetCode Practice (Strictly 3 Questions Daily)
                          </div>
                          <h2 className="text-lg font-bold text-[#292929]">
                            1 Easy · 1 Medium · 1 Hard Matched to Day {activeDay}
                          </h2>
                        </div>
                      </div>
                      <span className="text-[11px] text-[#78716C]">
                        Independent of Weekly Assessment Question Banks
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {currentTrackData.leetcodeQuestions.map(q => {
                        const lcKey = `lc_daily_dsa_d${activeDay}_slot${q.slot}`;
                        const isDone = !!completions[lcKey];
                        const diffBadgeCls =
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : q.difficulty === 'Medium'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200';

                        return (
                          <div
                            key={q.slot}
                            className={`border rounded-xl p-4 flex flex-col justify-between gap-3 ${
                              !q.available
                                ? 'bg-[#FAF8F5] border-dashed border-[#D6D3CD]'
                                : isDone
                                ? 'bg-emerald-50/40 border-emerald-200'
                                : 'bg-white border-[#E0DCD3]'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase border ${diffBadgeCls}`}
                                >
                                  {q.slot}. {q.difficulty}
                                </span>
                                {q.problemNumber && q.available && (
                                  <span className="text-xs font-mono font-bold text-[#78716C]">
                                    #{q.problemNumber}
                                  </span>
                                )}
                              </div>

                              {q.available ? (
                                <>
                                  <h3 className="text-sm font-bold text-[#292929]">{q.title}</h3>
                                  <p className="text-xs text-[#57534E]">{q.shortExplanation}</p>
                                  <div className="text-[11px] text-[#78716C] bg-[#FAF8F5] rounded-lg p-2 border border-[#E0DCD3]">
                                    <strong className="text-[#292929]">Matches Topic:</strong>{' '}
                                    {q.whyMatchesTopic}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <h3 className="text-sm font-bold text-[#57534E]">
                                    Unavailable for Today&apos;s Topic
                                  </h3>
                                  <p className="text-xs text-[#78716C]">
                                    {q.whyUnavailable || q.shortExplanation}
                                  </p>
                                </>
                              )}
                            </div>

                            {q.available && q.url && (
                              <div className="space-y-2 pt-2 border-t border-[#E0DCD3]">
                                <a
                                  href={q.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-2 px-3 rounded-lg bg-[#E7826D] hover:opacity-90 text-[#292929] text-xs font-bold flex items-center justify-center gap-1.5"
                                >
                                  <span>Solve on LeetCode</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  onClick={() => toggleDailyAiResourceCompletion(lcKey)}
                                  className={`w-full py-1.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                                    isDone
                                      ? 'bg-emerald-600 text-white border-emerald-600'
                                      : 'bg-[#FAF8F5] text-[#292929] border-[#E0DCD3] hover:bg-white'
                                  }`}
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  ) : (
                                    <Circle className="w-3.5 h-3.5" />
                                  )}
                                  <span>{isDone ? 'Solved' : 'Mark Completed'}</span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* SECTION D: ADDITIONAL RESOURCES (OFFICIAL DOCS & PRACTICAL EXERCISE) */}
                <section className="bg-white border border-[#E0DCD3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#E0DCD3]">
                    <BookOpen className="w-5 h-5 text-[#E7826D]" />
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#E7826D]">
                        D. Additional Resources
                      </div>
                      <h2 className="text-lg font-bold text-[#292929]">
                        Official Documentation &amp; Practical Exercises
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#57534E]">
                        Official Documentation Links
                      </h3>
                      {currentTrackData.officialDocs.map(doc => {
                        const docKey = `doc_${activeTrack}_d${activeDay}_${doc.id}`;
                        const isDone = !!completions[docKey];
                        return (
                          <div
                            key={doc.id}
                            className="bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl p-3.5 space-y-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-xs font-bold text-[#292929]">{doc.title}</div>
                                <div className="text-[11px] text-[#78716C]">{doc.sourceLabel}</div>
                              </div>
                              {doc.url && (
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1 rounded-md bg-[#292929] text-[#F3EFE6] text-[11px] font-semibold flex items-center gap-1 shrink-0"
                                >
                                  <span>Open</span>
                                  <ExternalLink className="w-3 h-3 text-[#E7826D]" />
                                </a>
                              )}
                            </div>
                            <p className="text-xs text-[#57534E]">{doc.description}</p>
                            <button
                              onClick={() => toggleDailyAiResourceCompletion(docKey)}
                              className={`px-2.5 py-1 rounded-md border text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer ${
                                isDone
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-white text-[#292929] border-[#E0DCD3]'
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <Circle className="w-3 h-3" />
                              )}
                              <span>{isDone ? 'Read' : 'Mark Completed'}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-2.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#57534E]">
                        Practical Exercise &amp; Deliverable
                      </h3>
                      <div className="bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl p-4 space-y-2.5">
                        <div className="text-xs font-bold text-[#292929]">
                          {currentTrackData.practicalExercises[0]?.title ||
                            `Day ${activeDay} Deliverable`}
                        </div>
                        <p className="text-xs text-[#57534E] leading-relaxed">
                          {currentTrackData.practicalExerciseSummary}
                        </p>
                        {(() => {
                          const exKey = `ex_${activeTrack}_d${activeDay}`;
                          const exDone = !!completions[exKey];
                          return (
                            <button
                              onClick={() => toggleDailyAiResourceCompletion(exKey)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                                exDone
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-white text-[#292929] border-[#E0DCD3]'
                              }`}
                            >
                              {exDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : (
                                <Circle className="w-3.5 h-3.5" />
                              )}
                              <span>{exDone ? 'Exercise Completed' : 'Mark Exercise Completed'}</span>
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )
          )}
        </>
      )}

      {/* Combined Daily Action Plan Summary */}
      {dashboard && (
        <section className="bg-white border border-[#E0DCD3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#E7826D]" />
            <h2 className="text-base font-bold text-[#292929]">
              Combined Action Plan — {dashboard.istDateLabel}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl p-3">
              <strong className="text-[#292929]">Study First:</strong>{' '}
              <span className="text-[#57534E]">{dashboard.actionPlan.studyFirst}</span>
            </div>
            <div className="bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl p-3">
              <strong className="text-[#292929]">Tutorials:</strong>{' '}
              <span className="text-[#57534E]">{dashboard.actionPlan.tutorialsToWatch}</span>
            </div>
            <div className="bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl p-3">
              <strong className="text-[#292929]">LeetCode Order:</strong>{' '}
              <span className="text-[#57534E]">{dashboard.actionPlan.leetcodeFirst}</span>
            </div>
            <div className="bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl p-3">
              <strong className="text-[#292929]">Practical Exercise:</strong>{' '}
              <span className="text-[#57534E]">{dashboard.actionPlan.practicalExercise}</span>
            </div>
          </div>
        </section>
      )}

      {/* Owner-Only 10:00 AM IST Automation & Resend Free Tier Email Delivery Panel */}
      {dashboard && (
        <section className="bg-[#292929] text-[#F3EFE6] border border-[#3D3D3D] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-[#E7826D]" />
              <div>
                <h2 className="text-sm sm:text-base font-bold">
                  10:00 AM IST Daily Email Delivery &amp; Free Tier Automation
                </h2>
                <p className="text-xs text-[#C2BEB5]">
                  Schedule: {dashboard.automation.scheduleLabel} ({dashboard.automation.timezone}) · Recipient:{' '}
                  <span className="font-mono text-[#F3EFE6]">{dashboard.automation.recipientEmail}</span>
                </p>
              </div>
            </div>

            {userRole === 'owner' ? (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleOwnerRunDailyAutomation(false)}
                  disabled={runningAutomation}
                  className="px-3 py-1.5 rounded-lg bg-[#383838] hover:bg-[#4A4A4A] text-xs font-semibold text-[#F3EFE6] cursor-pointer disabled:opacity-40"
                >
                  Refresh All 3 Tracks
                </button>
                <button
                  onClick={() => handleOwnerRunDailyAutomation(true)}
                  disabled={runningAutomation}
                  className="px-3.5 py-1.5 rounded-lg bg-[#E7826D] hover:opacity-90 text-xs font-bold text-[#292929] flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{runningAutomation ? 'Running...' : 'Run Daily Job & Send Email'}</span>
                </button>
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-lg bg-[#1F1F1F] border border-[#3D3D3D] text-[11px] text-[#C2BEB5] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E7826D]" />
                <span>Owner-Only Email Delivery (Guest Isolated)</span>
              </div>
            )}
          </div>

          {automationFeedback && (
            <div className="bg-[#1F1F1F] border border-[#E7826D]/40 rounded-lg px-3 py-2 text-xs text-[#F3EFE6]">
              {automationFeedback}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-[#1F1F1F] border border-[#3D3D3D] rounded-lg p-2.5">
              <div className="text-[#A8A49C] text-[10px] uppercase">Gemini Free Tier</div>
              <div className="font-semibold mt-0.5">
                {dashboard.automation.geminiConfigured ? 'Configured (gemini-4-hydrogen)' : 'Awaiting PREPARATION_GEMINI_KEY'}
              </div>
            </div>
            <div className="bg-[#1F1F1F] border border-[#3D3D3D] rounded-lg p-2.5">
              <div className="text-[#A8A49C] text-[10px] uppercase">YouTube Data API v3</div>
              <div className="font-semibold mt-0.5">
                {dashboard.automation.youtubeConfigured ? 'Configured (Verified)' : 'Search Link Fallback'}
              </div>
            </div>
            <div className="bg-[#1F1F1F] border border-[#3D3D3D] rounded-lg p-2.5">
              <div className="text-[#A8A49C] text-[10px] uppercase">Resend Free Tier</div>
              <div className="font-semibold mt-0.5">
                {dashboard.automation.emailStatus.replace(/_/g, ' ')}
              </div>
            </div>
            <div className="bg-[#1F1F1F] border border-[#3D3D3D] rounded-lg p-2.5">
              <div className="text-[#A8A49C] text-[10px] uppercase">Supabase Cloud Sync</div>
              <div className="font-semibold mt-0.5">
                {dashboard.automation.supabaseServerConfigured ? 'Configured' : 'Local Cache Active'}
              </div>
            </div>
          </div>

          {dashboard.automation.emailError && (
            <div className="text-xs text-[#E7826D]">
              Email Delivery Note: {dashboard.automation.emailError}
            </div>
          )}
        </section>
      )}

      {/* Safe Read-Only Daily Email Preview Modal (Never Sends Emails) */}
      {emailPreviewOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Daily Email Report Preview"
        >
          <div className="bg-[#F3EFE6] border border-[#E0DCD3] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-[#292929] text-[#F3EFE6] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#E7826D]">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#E7826D]">
                  Read-Only Preview · No Email Sent
                </div>
                <div className="text-sm font-bold truncate max-w-xl">
                  {emailPreviewData?.subject || 'Loading Daily Email Preview...'}
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['main', 'dsa', 'azure', 'combined'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => handleOpenEmailPreview(mode)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                      emailPreviewMode === mode
                        ? 'bg-[#E7826D] text-[#292929]'
                        : 'bg-[#3A3A3A] text-[#F3EFE6] hover:bg-[#4A4A4A]'
                    }`}
                  >
                    {mode === 'combined' ? 'All 3 Tracks' : mode.toUpperCase()}
                  </button>
                ))}
                <button
                  onClick={() => setEmailPreviewOpen(false)}
                  aria-label="Close email preview"
                  className="ml-1 p-1.5 rounded-lg bg-[#3A3A3A] hover:bg-[#4A4A4A] text-[#F3EFE6] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-3 sm:p-4 bg-[#FAF8F5]">
              {emailPreviewLoading ? (
                <div className="py-16 text-center text-sm text-[#78716C]">
                  Rendering HTML email template preview...
                </div>
              ) : emailPreviewError ? (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-800">
                  {emailPreviewError}
                </div>
              ) : emailPreviewData ? (
                <iframe
                  title="Daily Email HTML Preview"
                  srcDoc={emailPreviewData.html}
                  sandbox="allow-popups allow-popups-to-escape-sandbox"
                  className="w-full h-[68vh] rounded-xl border border-[#E0DCD3] bg-[#F3EFE6]"
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
