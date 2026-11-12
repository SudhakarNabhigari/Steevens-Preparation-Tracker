import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Clock,
  Sparkles,
  AlertTriangle,
  Save,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    state,
    updateCredentials,
    resetAllData,
    setSimulationMode,
    userRole
  } = useApp();

  const isOwner = userRole === 'owner';

  const [username, setUsername] = useState(isOwner ? state.username : '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const [customSimDate, setCustomSimDate] = useState('2026-11-16');

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isOwner) {
      setErrorMsg('Guest mode cannot change owner credentials.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    // If new password provided, update; otherwise update username
    updateCredentials(username.trim() || state.username, newPassword || state.passwordHash);
    setNewPassword('');
    setConfirmPassword('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCustomSimulate = () => {
    setSimulationMode(true, `${customSimDate}T09:00:00+05:30`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#E0DCD3]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#292929] tracking-tight">
          APPLICATION SETTINGS
        </h1>
        <p className="text-xs sm:text-sm text-[#78716C] mt-1">
          {isOwner
            ? 'Manage security preferences, timezone configurations, fast-forward simulation testing, and data storage.'
            : 'Guest Preview Mode: Steeven\'s personal credentials and production settings are protected.'}
        </p>
      </div>

      {!isOwner && (
        <div className="p-4 rounded-xl bg-white border border-[#E0DCD3] text-xs text-[#78716C] shadow-sm">
          <span className="font-bold text-[#292929] block mb-0.5">Guest Read-Only Settings</span>
          <span>You are exploring in Guest Preview Mode. Owner credentials and production settings cannot be modified.</span>
        </div>
      )}

      {/* Profile & Security Credentials Card */}
      {isOwner && (
        <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#292929] uppercase tracking-wider border-b border-[#E0DCD3] pb-3">
            <User className="w-4 h-4 text-[#E7826D]" />
            <span>Account Security & Credentials</span>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-[#16A34A]" />
              <span className="font-semibold">Security credentials updated successfully!</span>
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
              className="px-4 py-2 bg-[#292929] hover:bg-[#404040] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors uppercase tracking-wider"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Credentials</span>
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
            <span className="font-mono font-bold text-[#292929]">Asia/Kolkata (IST, UTC+05:30)</span>
            <span className="text-[10px] text-[#78716C] block mt-1">Used for midnight resets & daily study tracking</span>
          </div>

          <div className="p-3.5 bg-[#FAF8F5] border border-[#E0DCD3] rounded-xl">
            <span className="text-[#78716C] font-semibold block mb-1">Preparation Window</span>
            <span className="font-mono font-bold text-[#292929]">16 Nov 2026 – 14 May 2027</span>
            <span className="text-[10px] text-[#78716C] block mt-1">180 Consecutive Days of Structured Learning</span>
          </div>
        </div>
      </div>

      {/* Date Simulation & Testing Mode */}
      <div className="bg-white border border-[#E0DCD3] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E0DCD3] pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#292929] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#E7826D]" />
            <span>Developer Fast-Forward & Simulation Mode</span>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${state.simulationEnabled ? 'bg-[#E7826D]/15 text-[#E7826D] border border-[#E7826D]/30' : 'bg-stone-100 text-stone-600 border border-stone-200'}`}>
            {state.simulationEnabled ? 'SIMULATION ACTIVE' : 'REAL CLOCK ACTIVE'}
          </span>
        </div>

        <p className="text-xs text-[#78716C] leading-relaxed">
          The application tracks real calendar dates. To preview and test Day 1 Today Work, checkboxes, 4-hour timers, and Saturday assessments right now without waiting for 16 November 2026, you can toggle simulated test dates below.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => setSimulationMode(false)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-colors ${
              !state.simulationEnabled
                ? 'bg-[#292929] text-white border-[#292929]'
                : 'bg-white text-[#292929] border-[#E0DCD3] hover:bg-[#FAF8F5]'
            }`}
          >
            Real Clock
          </button>

          <button
            onClick={() => setSimulationMode(true, '2026-11-16T09:00:00+05:30')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#292929] border border-[#E0DCD3] text-xs font-semibold cursor-pointer transition-colors"
          >
            Simulate Day 1 Launch (16 Nov 2026)
          </button>

          <button
            onClick={() => setSimulationMode(true, '2026-11-21T09:00:00+05:30')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#292929] border border-[#E0DCD3] text-xs font-semibold cursor-pointer transition-colors"
          >
            Simulate Saturday Week 1 (Assessment Day)
          </button>
        </div>

        <div className="pt-3 flex items-center gap-3">
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
            Jump to Selected Date
          </button>
        </div>
      </div>

      {/* Danger Zone: Reset All Data */}
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
