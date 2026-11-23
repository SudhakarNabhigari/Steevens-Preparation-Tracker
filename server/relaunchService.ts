import {
  OWNER_RELAUNCH_START_MS,
  OWNER_RESTART_EMAIL_EARLIEST_MS
} from '../src/utils/relaunchConfig.ts';
import { getResolvedServerPipelineConfig } from './dailyResourcesService.ts';
import { buildSupabaseRestHeaders } from './supabaseConfig.ts';
import { getSharedCurriculumDayContext } from '../supabase/functions/daily-learning-resources/catalogData.ts';

export type RelaunchEmailType = 'restart' | 'launch';
const PRODUCTION_APP_URL = 'https://my-preparation.vercel.app';

function remainingParts(nowMs: number) {
  const totalSeconds = Math.max(0, Math.floor((OWNER_RELAUNCH_START_MS - nowMs) / 1000));
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60
  };
}

function buildEmail(type: RelaunchEmailType, nowMs: number, appUrl: string) {
  if (type === 'launch') {
    const dayOneTracks = [
      ['Main Plan', getSharedCurriculumDayContext('main', 1)],
      ['DSA in C++', getSharedCurriculumDayContext('dsa', 1)],
      ['Azure', getSharedCurriculumDayContext('azure', 1)]
    ] as const;
    const trackText = dayOneTracks.map(([name, context]) =>
      `${name} — ${context?.topic || 'Day 1'}\nFocus: ${context?.objectives.join('; ') || 'See today’s plan'}\nWork: ${context?.practicalWork || 'Open the tracker for today’s tasks.'}`
    ).join('\n\n');
    const trackHtml = dayOneTracks.map(([name, context]) =>
      `<li><strong>${name}: ${context?.topic || 'Day 1'}</strong><br>Focus: ${context?.objectives.join('; ') || 'See today’s plan'}<br>Work: ${context?.practicalWork || 'Open the tracker for today’s tasks.'}</li>`
    ).join('');
    return {
      subject: 'Day 1 — Monday, November 23, 2026 | Your Preparation Journey Starts Today',
      text: `Hello Steeven,\n\nDay 1 — Monday, November 23, 2026\nYour 180-day preparation cycle is live.\n\nToday’s plan\n\n${trackText}\n\nAll the best!\n— Steeven's Preparation Tracker\n\nOpen the production tracker: ${appUrl}`,
      html: `<p>Hello Steeven,</p><h1>Day 1 — Monday, November 23, 2026</h1><p>Your 180-day preparation cycle is live. Here is the correct Day 1 plan for each track:</p><ul>${trackHtml}</ul><p>All the best!<br>— Steeven's Preparation Tracker</p><p><a href="${appUrl}">Open the production tracker</a></p>`
    };
  }
  const remaining = remainingParts(nowMs);
  return {
    subject: "Steeven's Preparation Tracker Is Restarting — Day 1 Begins Soon!",
    text: `Hello Steeven,\n\nSteeven's Preparation Tracker is restarting. Your Owner plans will begin again from Day 1 on Monday, 23 November 2026 at 12:00 AM IST.\n\nYour New Journey Starts In\nRemaining Days: ${remaining.days}\nRemaining Hours: ${remaining.hours}\nRemaining Minutes: ${remaining.minutes}\nRemaining Seconds: ${remaining.seconds}\n\nThis countdown is a snapshot taken when this email was generated using the server clock. The countdown in the application continues updating live.\n\nLaunch Date: Monday, 23 November 2026 at 12:00 AM IST\n\n${appUrl}`,
    html: `<p>Hello Steeven,</p><p>Steeven's Preparation Tracker is restarting. Your Owner plans will begin again from Day 1 on Monday, 23 November 2026 at 12:00 AM IST.</p><h2>Your New Journey Starts In</h2><ul><li>Remaining Days: ${remaining.days}</li><li>Remaining Hours: ${remaining.hours}</li><li>Remaining Minutes: ${remaining.minutes}</li><li>Remaining Seconds: ${remaining.seconds}</li></ul><p>This countdown is a snapshot taken when this email was generated using the authoritative server clock. The countdown in the application continues updating live.</p><p><strong>Launch Date: Monday, 23 November 2026 at 12:00 AM IST</strong></p><p><a href="${appUrl}">Open your tracker</a></p>`
  };
}

async function updateOutbox(
  baseUrl: string,
  serviceKey: string,
  type: RelaunchEmailType,
  values: Record<string, unknown>
): Promise<void> {
  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/rest/v1/owner_relaunch_emails?email_type=eq.${type}`, {
    method: 'PATCH',
    headers: buildSupabaseRestHeaders(serviceKey, {
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    }),
    body: JSON.stringify({ ...values, updated_at: new Date().toISOString() })
  });
  if (!response.ok) throw new Error('Could not update relaunch email delivery status.');
}

export async function sendOwnerRelaunchAnnouncement(
  type: RelaunchEmailType,
  nowMs = Date.now()
): Promise<{ sent: boolean; alreadySent: boolean; status: string }> {
  if (type === 'launch' && nowMs < OWNER_RELAUNCH_START_MS) {
    throw new Error('The Day 1 launch announcement is not available before the official unlock.');
  }
  if (type === 'launch' && new Date(nowMs).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) !== '2026-11-23') {
    throw new Error('The Day 1 launch announcement is only available on the official launch date.');
  }
  if (type === 'restart' && nowMs < OWNER_RESTART_EMAIL_EARLIEST_MS) {
    throw new Error('The restart announcement is not available before 21 November 2026 at 10:00 AM IST.');
  }
  if (type === 'restart' && nowMs >= OWNER_RELAUNCH_START_MS) {
    throw new Error('The restart announcement is only available before the official unlock.');
  }

  const config = await getResolvedServerPipelineConfig();
  const baseUrl = config.supabaseUrl?.trim();
  const serviceKey = config.supabaseServiceRoleKey?.trim();
  const recipient = config.dailyRecipientEmail?.trim();
  const ownerEmail = (process.env.OWNER_SUPABASE_EMAIL || process.env.VITE_OWNER_AUTH_EMAIL)?.trim();
  const resendKey = config.resendApiKey?.trim();
  const from = config.resendFromEmail?.trim();
  if (!baseUrl || !serviceKey) throw new Error('Relaunch email idempotency storage is not configured on the server.');
  if (!recipient || !ownerEmail || recipient.toLowerCase() !== ownerEmail.toLowerCase()) {
    throw new Error('Relaunch email recipient must be explicitly configured and match the configured Owner email.');
  }

  const claimResponse = await fetch(`${baseUrl.replace(/\/$/, '')}/rest/v1/rpc/claim_owner_relaunch_email`, {
    method: 'POST',
    headers: buildSupabaseRestHeaders(serviceKey, {
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ p_email_type: type, p_recipient_email: recipient })
  });
  if (!claimResponse.ok) throw new Error('Could not claim the relaunch email delivery record.');
  const claimed = await claimResponse.json();
  if (claimed !== true) return { sent: false, alreadySent: true, status: 'already_sent_or_in_progress' };

  try {
    if (!resendKey || !from) throw new Error('Resend announcement delivery is not configured on the server.');
    const snapshotResponse = await fetch(
      `${baseUrl.replace(/\/$/, '')}/rest/v1/owner_relaunch_emails?email_type=eq.${type}&select=generated_at`,
      { headers: buildSupabaseRestHeaders(serviceKey) }
    );
    if (!snapshotResponse.ok) throw new Error('Could not read the stored relaunch email countdown snapshot.');
    const snapshotRows = await snapshotResponse.json() as Array<{ generated_at?: unknown }>;
    const emailSnapshotMs = typeof snapshotRows[0]?.generated_at === 'string'
      ? Date.parse(snapshotRows[0].generated_at)
      : Number.NaN;
    if (!Number.isFinite(emailSnapshotMs)) throw new Error('The stored relaunch email countdown snapshot is unavailable.');
    const emailAppUrl = type === 'launch' ? PRODUCTION_APP_URL : config.appUrl || PRODUCTION_APP_URL;
    const email = buildEmail(type, emailSnapshotMs, emailAppUrl);
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `steeven-preparation-${type}-2026-11-23`
      },
      body: JSON.stringify({ from, to: [recipient], ...email })
    });
    const payload = await response.json().catch(() => ({})) as { id?: string; message?: string };
    if (!response.ok) throw new Error(payload.message || `Resend returned HTTP ${response.status}.`);
    if (!payload.id) throw new Error('Resend accepted the request without returning a provider message ID.');
    await updateOutbox(baseUrl, serviceKey, type, {
      status: 'sent',
      sent_at: new Date(nowMs).toISOString(),
      provider_message_id: payload.id,
      failure_reason: null,
      claimed_until: null
    });
    return { sent: true, alreadySent: false, status: 'sent' };
  } catch (error) {
    const reason = error instanceof Error ? error.message.slice(0, 500) : 'Unknown delivery error.';
    await updateOutbox(baseUrl, serviceKey, type, { status: 'failed', failure_reason: reason, claimed_until: null });
    throw new Error('Relaunch announcement delivery failed and was recorded for a safe retry.');
  }
}
