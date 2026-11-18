import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_180_DAYS } from '../data/syllabus';
import { getUnlockedDayCountByIstClock, MAIN_TRACK_MAX_DAYS, SUB_TRACK_MAX_DAYS } from '../utils/dailyLock';
import {
  User,
  Clock,
  Sparkles,
  AlertTriangle,
  Save,
  Check,
  Eye,
  EyeOff,
  Sliders,
  Lock,
  RefreshCw
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    state,
    updateCredentials,
    isSupabaseAuthConfigured,
    isOwnerSupabaseSessionActive,
    updateSharedSettings,
    refreshSharedContent,
    resetAllData,
    testModeEnabled,
    testModeDate,
    setSimulationMode,
    userRole
  } = useApp();

  const isOwner = userRole === 'owner';

  const [username, setUsername] = useState(isOwner ? state.username : '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [isUpdatingCredentials, setIsUpdatingCredentials] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Shared Application Settings form state (Owner editable, Guest read-only)
  const [prepTitle, setPrepTitle] = useState(state.sharedSettings?.preparationTitle || "STEEVEN'S 180-DAY PREPARATION TRACKER");
  const [scheduleNote, setScheduleNote] = useState(state.sharedSettings?.studyScheduleBannerNote || '');
  const [libraryNotice, setLibraryNotice] = useState(state.sharedSettings?.resourceLibraryNotice || '');
  const [dailyGoalHours, setDailyGoalHours] = useState<number>(state.sharedSettings?.defaultDailyGoalHours || 4);
  const [weekendGuidance, setWeekendGuidance] = useState<boolean>(state.sharedSettings?.showWeekendRevisionGuidance ?? true);
  const [sharedSavedSuccess, setSharedSavedSuccess] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [customSimDate, setCustomSimDate] = useState('2026-11-16');

  useEffect(() => {
    if (state.sharedSettings) {
      setPrepTitle(state.sharedSettings.preparationTitle);
      setScheduleNote(state.sharedSettings.studyScheduleBannerNote);
      setLibraryNotice(state.sharedSettings.resourceLibraryNotice);
      setDailyGoalHours(state.sharedSettings.defaultDailyGoalHours);
      setWeekendGuidance(state.sharedSettings.showWeekendRevisionGuidance);
    }
  }, [state.sharedSettings]);

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSavedSuccess(null);

    if (!isOwner) {
      setErrorMsg('Guest mode cannot change owner credentials.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    setIsUpdatingCredentials(true);
    try {
      const result = await updateCredentials(
        username.trim() || state.username,
        newPassword || undefined
      );
      if (!result.success) {
        setErrorMsg(result.message);
        return;
      }
      setNewPassword('');
      setConfirmPassword('');
      setSavedSuccess(result.message);
      setTimeout(() => setSavedSuccess(null), 3500);
    } finally {
      setIsUpdatingCredentials(false);
    }
  };

  const handleSaveSharedPreferences = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;

    const ok = updateSharedSettings({
      preparationTitle: prepTitle.trim() || "STEEVEN'S 180-DAY PREPARATION TRACKER",
      studyScheduleBannerNote: scheduleNote.trim(),
      resourceLibraryNotice: libraryNotice.trim(),
      defaultDailyGoalHours: Math.min(12, Math.max(1, Number(dailyGoalHours) || 4)),
      showWeekendRevisionGuidance: weekendGuidance
    });

    if (ok) {
      setSharedSavedSuccess(true);
      setTimeout(() => setSharedSavedSuccess(false), 2500);
    }
  };

  const handleSyncLatest = async () => {
    setIsSyncing(true);
    await refreshSharedContent();
    setTimeout(() => setIsSyncing(false), 300);
  };

  const handleCustomSimulate = () => {
    if (!isOwner) return;
    setSimulationMode(true, `${customSimDate}T09:00:00+05:30`);
  };

  const testModePreview = useMemo(() => {
    if (!testModeEnabled || !testModeDate) return null;
    const ms = new Date(testModeDate).getTime();
    if (Number.isNaN(ms)) return null;
    const mainDay = getUnlockedDayCountByIstClock(ms, MAIN_TRACK_MAX_DAYS);
    const subDay = getUnlockedDayCountByIstClock(ms, SUB_TRACK_MAX_DAYS);
    const schedule = mainDay >= 1 ? ALL_180_DAYS[mainDay - 1] : ALL_180_DAYS[0];
    return { mainDay, subDay, schedule };
  }, [testModeEnabled, testModeDate]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E0DCD3]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292929] tracking-tight">
            APPLICATION SETTINGS
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            {isOwner
              ? 'Manage security preferences, shared application configuration, simulation testing, and data storage.'
              : "Guest Preview Mode: Viewing shared configuration read-only. Steeven's credentials and owner controls are protected."}
          </p>
        </div>

        {!isOwner && (
          <button
            onClick={handleSyncLatest}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E0DCD3] text-[#292929] text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#E7826D] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync Shared Config</span>
          </button>
        )}
      </div>

      {!isOwner && (
        <div className="p-4 rounded-xl bg-white border border-[#E0DCD3] text-xs text-[#78716C] shadow-sm flex items-start gap-3">
          <Lock className="w-4 h-4 text-[#E7826D] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#292929] block mb-0.5">Guest Read-Only Settings</span>
            <span>
              You are viewing Steeven&apos;s shared application settings in Read-Only mode. Private account credentials and simulation controls cannot be modified or accessed by Guests.
            </span>
          </div>
        </div>
      )}

      {/* Shared Application Configuration (Synced from Owner to Guest Read-Only) */}
      <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E0DCD3] pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#292929] uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-[#E7826D]" />
            <span>Shared Application Preferences</span>
          </div>
          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
              isOwner
                ? 'bg-[#E7826D]/15 text-[#E7826D] border border-[#E7826D]/30'
                : 'bg-stone-100 text-stone-600 border border-stone-200'
            }`}
          >
            {isOwner ? 'OWNER MANAGED · SYNCED TO GUEST' : 'READ-ONLY · SYNCED FROM OWNER'}
          </span>
        </div>

        {sharedSavedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-[#16A34A]" />
            <span className="font-semibold">Shared application preferences saved and synced!</span>
          </div>
        )}

        <form onSubmit={handleSaveSharedPreferences} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#292929] mb-1">
                Preparation Program Title
              </label>
              <input
                type="text"
                value={prepTitle}
                disabled={!isOwner}
                readOnly={!isOwner}
                onChange={(e) => setPrepTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D] disabled:opacity-80 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#292929] mb-1">
                Target Weekday Study Goal (Hours/Day)
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={dailyGoalHours}
                disabled={!isOwner}
                readOnly={!isOwner}
                onChange={(e) => setDailyGoalHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] font-mono focus:outline-none focus:border-[#E7826D] disabled:opacity-80 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#292929] mb-1">
              Study Rhythm Header Note
            </label>
            <input
              type="text"
              value={scheduleNote}
              disabled={!isOwner}
              readOnly={!isOwner}
              onChange={(e) => setScheduleNote(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D] disabled:opacity-80 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#292929] mb-1">
              Resource Library Subtitle / Guidance Note
            </label>
            <input
              type="text"
              value={libraryNotice}
              disabled={!isOwner}
              readOnly={!isOwner}
              onChange={(e) => setLibraryNotice(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-[#292929] focus:outline-none focus:border-[#E7826D] disabled:opacity-80 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <label className={`flex items-center gap-2 ${isOwner ? 'cursor-pointer' : 'cursor-not-allowed opacity-85'}`}>
              <input
                type="checkbox"
                checked={weekendGuidance}
                disabled={!isOwner}
                onChange={(e) => setWeekendGuidance(e.target.checked)}
                className="rounded border-[#E0DCD3] text-[#E7826D] focus:ring-[#E7826D] w-4 h-4"
              />
              <span className="font-semibold text-[#292929]">
                Enable Weekend Assessment & Revision Guidance
              </span>
            </label>

            {isOwner && (
              <button
                type="submit"
                className="px-4 py-2 bg-[#E7826D] hover:bg-[#D66F5A] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors uppercase tracking-wider"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Shared Preferences</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Profile & Security Credentials Card (Owner Only) */}
      {isOwner && (
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E0DCD3] pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#292929] uppercase tracking-wider">
              <User className="w-4 h-4 text-[#E7826D]" />
              <span>Account Security &amp; Credentials</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                isOwnerSupabaseSessionActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : isSupabaseAuthConfigured
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              {isOwnerSupabaseSessionActive
                ? 'SUPABASE AUTH VERIFIED'
                : isSupabaseAuthConfigured
                ? 'SUPABASE CONFIGURED · SIGN IN REQUIRED'
                : 'LOCAL TRANSITION MODE (AWAITING SUPABASE AUTH)'}
            </span>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-[#16A34A]" />
              <span className="font-semibold">{savedSuccess}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSaveCredentials} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-[#292929] mb-1">
                Account Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs sm:text-sm text-[#292929] focus:outline-none focus:border-[#E7826D] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#292929]">
                  New Password (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-[#78716C] hover:text-[#292929] flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Leave blank to keep current password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs sm:text-sm text-[#292929] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#E7826D] focus:bg-white font-mono transition-colors"
              />
            </div>

            {newPassword && (
              <div>
                <label className="block text-xs font-semibold text-[#292929] mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs sm:text-sm text-[#292929] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#E7826D] focus:bg-white font-mono transition-colors"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isUpdatingCredentials}
              className="px-4 py-2 bg-[#292929] hover:bg-[#404040] disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors uppercase tracking-wider"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isUpdatingCredentials ? 'Updating...' : 'Update Credentials'}</span>
            </button>
          </form>
        </div>
      )}

      {/* System Timezone & Dates */}
      <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#292929] uppercase tracking-wider border-b border-[#E0DCD3] pb-3">
          <Clock className="w-4 h-4 text-[#E7826D]" />
          <span>Timezone & Schedule Configuration</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
            <span className="text-[#78716C] font-semibold block mb-1">Standard Timezone</span>
            <span className="font-mono font-bold text-[#292929]">
              {state.sharedSettings?.timezoneLabel || 'Asia/Kolkata (IST, UTC+05:30)'}
            </span>
            <span className="text-[10px] text-[#78716C] block mt-1">Used for midnight resets & daily study tracking</span>
          </div>

          <div className="p-3.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
            <span className="text-[#78716C] font-semibold block mb-1">Preparation Window</span>
            <span className="font-mono font-bold text-[#292929]">16 Nov 2026 – 14 May 2027</span>
            <span className="text-[10px] text-[#78716C] block mt-1">180 Consecutive Days of Structured Learning</span>
          </div>
        </div>
      </div>

      {/* Date Simulation & TEST MODE (Ephemeral Schedule Preview Only) */}
      <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E0DCD3] pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#292929] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#E7826D]" />
            <span>TEST MODE — Read-Only Schedule Preview</span>
          </div>
          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
              testModeEnabled
                ? 'bg-[#E7826D]/15 text-[#E7826D] border border-[#E7826D]/30'
                : 'bg-stone-100 text-stone-600 border border-stone-200'
            }`}
          >
            {testModeEnabled ? 'TEST MODE (PREVIEW)' : 'PRODUCTION REAL CLOCK'}
          </span>
        </div>

        <p className="text-xs text-[#78716C] leading-relaxed">
          {isOwner
            ? 'All daily tasks, checklists, timers, and weekly assessments follow real Asia/Kolkata (IST) dates for both Owner and Guest. TEST MODE lets you preview what schedule day a future calendar date maps to without bypassing real locks or altering saved Owner/Guest progress.'
            : 'All daily tasks and all 26 weekly assessments follow the strict real-clock 00:00 IST unlock schedule for both Owner and Guest.'}
        </p>

        {isOwner && (
          <>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => setSimulationMode(false)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-colors ${
                  !testModeEnabled
                    ? 'bg-[#292929] text-white border-[#292929]'
                    : 'bg-white text-[#292929] border-[#E0DCD3] hover:bg-[#FAF8F5]'
                }`}
              >
                Real Clock Mode
              </button>

              <button
                onClick={() => setSimulationMode(true, '2026-11-16T09:00:00+05:30')}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#292929] border border-[#E0DCD3] text-xs font-semibold cursor-pointer transition-colors"
              >
                Preview Day 1 Date (16 Nov 2026)
              </button>

              <button
                onClick={() => setSimulationMode(true, '2026-11-21T09:00:00+05:30')}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#292929] border border-[#E0DCD3] text-xs font-semibold cursor-pointer transition-colors"
              >
                Preview Day 6 Date (21 Nov 2026)
              </button>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <input
                type="date"
                value={customSimDate}
                min="2026-11-16"
                max="2027-05-14"
                onChange={(e) => setCustomSimDate(e.target.value)}
                className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl text-xs text-[#292929] focus:outline-none focus:border-[#E7826D]"
              />
              <button
                onClick={handleCustomSimulate}
                className="px-3.5 py-1.5 rounded-xl bg-[#E7826D] hover:bg-[#D66F5A] text-white text-xs font-bold cursor-pointer shadow-sm uppercase tracking-wider"
              >
                Preview Selected Date (Test Mode)
              </button>
            </div>

            {testModePreview && (
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7826D]/40 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#E7826D] uppercase tracking-wider">
                    TEST MODE SCHEDULE READOUT (NON-PERSISTENT)
                  </span>
                  <span className="font-mono text-[#78716C]">{customSimDate} (IST)</span>
                </div>
                <p className="text-[#292929] font-semibold">
                  Main Plan: Day {testModePreview.mainDay} / 180 ({testModePreview.schedule.topic}) ·{' '}
                  DSA/Azure: Day {testModePreview.subDay > 0 ? `${testModePreview.subDay} / 100` : 'Completed (100/100)'}
                </p>
                <p className="text-[#78716C]">
                  Real production locks, assessments, LeetCode links, and saved progress remain strictly guarded by the real IST clock.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Danger Zone: Reset All Data (Owner Only) */}
      {isOwner && (
        <div className="bg-white border border-rose-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#DC2626] uppercase tracking-wider border-b border-[#E0DCD3] pb-3">
            <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
            <span>Reset Preparation Progress</span>
          </div>

          <p className="text-xs text-[#78716C]">
            Reset all completed tasks, timer history, notes, and assessment scores back to initial 0% state.
          </p>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-[#DC2626] text-xs font-bold cursor-pointer transition-colors"
            >
              Reset All Preparation Progress
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-3">
              <span className="text-xs font-bold text-[#DC2626] block">Are you sure? This will reset all your saved checkboxes and timer records to 0%.</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    resetAllData();
                    setShowResetConfirm(false);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-[#DC2626] hover:bg-rose-700 text-white text-xs font-bold cursor-pointer shadow-sm"
                >
                  Yes, Reset Everything
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-1.5 rounded-xl bg-white border border-[#E0DCD3] hover:bg-[#FAF8F5] text-[#292929] text-xs font-semibold cursor-pointer"
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
