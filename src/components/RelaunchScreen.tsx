import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { OWNER_RESTART_EMAIL_EARLIEST_MS } from '../utils/relaunch';

export const RelaunchScreen: React.FC = () => {
  const { lockTimeRemaining, ownerRelaunchServerReady, ownerRelaunchTransitionReady, nowTimestamp, logout } = useApp();
  const attemptedAtRef = useRef(0);
  const [announcementMessage, setAnnouncementMessage] = useState('');

  useEffect(() => {
    if (!ownerRelaunchServerReady || nowTimestamp < OWNER_RESTART_EMAIL_EARLIEST_MS || nowTimestamp >= Date.parse('2026-11-23T00:00:00+05:30')) return;
    if (Date.now() - attemptedAtRef.current < 30_000) return;
    attemptedAtRef.current = Date.now();
    let active = true;
    void (async () => {
      const session = await supabase?.auth.getSession();
      const token = session?.data.session?.access_token;
      if (!token) return;
      try {
        const response = await fetch('/api/relaunch/announcement', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'restart' })
        });
        const payload = await response.json();
        if (active) {
          const message = response.ok
            ? payload.sent ? 'Restart announcement email sent.' : 'Restart announcement email was already recorded.'
            : payload.error || 'Automatic restart email will retry through the scheduled delivery.';
          setAnnouncementMessage(message);
        }
      } catch {
        if (active) setAnnouncementMessage('Announcement email will retry automatically.');
      }
    })();
    return () => { active = false; };
  }, [ownerRelaunchServerReady, nowTimestamp]);

  const countdown = [
    ['Days', lockTimeRemaining.days],
    ['Hours', lockTimeRemaining.hours],
    ['Minutes', lockTimeRemaining.minutes],
    ['Seconds', lockTimeRemaining.seconds]
  ] as const;

  return (
    <main className="min-h-screen bg-[#F3EFE6] text-[#292929] flex items-center justify-center px-5 py-12 font-sans">
      <section className="w-full max-w-3xl rounded-3xl border border-[#E0DCD3] bg-[#FAF8F5] px-6 py-12 text-center shadow-sm sm:px-12">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#78716C]">Steeven's Preparation Tracker</p>
        <h1 className="mt-5 text-3xl font-bold sm:text-4xl">Your New Preparation Journey Starts Soon</h1>
        <p className="mx-auto mt-4 max-w-xl text-[#625D56]">Your Owner plans and learning activities unlock automatically at midnight IST. Your previous preparation history is being preserved.</p>
        <p className="mt-8 font-semibold">Monday, 23 November 2026 · 12:00 AM IST</p>
        {!ownerRelaunchServerReady ? (
          <p className="mt-8 rounded-xl bg-white px-4 py-5 text-sm text-[#625D56]">Connecting to the official launch clock… Plans remain locked until it responds.</p>
        ) : !ownerRelaunchTransitionReady && nowTimestamp >= Date.parse('2026-11-23T00:00:00+05:30') ? (
          <p className="mt-8 rounded-xl bg-white px-4 py-5 text-sm text-[#625D56]">Preparing your new Day 1 cycle while keeping your previous history safe…</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {countdown.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-[#E0DCD3] bg-white px-3 py-5">
                <div className="font-mono text-3xl font-bold tabular-nums">{String(value).padStart(2, '0')}</div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#78716C]">{label}</div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-7 text-sm text-[#625D56]">Main Plan, DSA in C++, and Azure Preparation will open on Day 1.</p>
        {announcementMessage && <p role="status" className="mt-3 text-xs text-[#78716C]">{announcementMessage}</p>}
        <button
          type="button"
          onClick={logout}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#D6D0C6] bg-white px-5 py-3 text-sm font-semibold text-[#292929] transition-colors hover:bg-[#F3EFE6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78716C] focus-visible:ring-offset-2 sm:w-auto"
        >
          Back to Login
        </button>
      </section>
    </main>
  );
};
