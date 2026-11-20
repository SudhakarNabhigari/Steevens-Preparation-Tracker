# Production Configuration Checklist

This checklist lists configuration **names only**. No environment file or secret value was read. Presence and correctness in Vercel, Supabase, Google, or Resend were not checked.

## Required names to verify in the correct server-side scope

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (server/Edge Function only)
- `OWNER_SUPABASE_USER_ID`
- `CRON_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `DAILY_REPORT_RECIPIENT_EMAIL`
- `APP_URL`
- `PREPARATION_GEMINI_KEY`
- `YOUTUBE_API_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Check names, configured scope, and whether each is set; do not print values. Do not put service-role, cron, Resend, Gemini, or YouTube secrets into client-prefixed variables.

## Schedule checks

- **Existing daily resources run:** keep the existing Supabase schedule `30 4 * * *` UTC (10:00 AM IST). Do not edit or recreate it. Verify its current job target and active state using the Supabase Dashboard.
- **Restart announcement:** Vercel cron in `vercel.json`: `30 4 21 11 *` UTC, equivalent to Nov 21, 2026 10:00 AM IST. Server code also rejects calls before that timestamp.
- **Day 1 email:** Vercel cron in `vercel.json`: `30 18 22 11 *` UTC, equivalent to Nov 23, 2026 00:00 AM IST. Server code rejects calls before unlock and outside the launch date.
- Confirm Vercel Cron is enabled for the intended production project and its authenticated request reaches `/api/relaunch/cron` with the expected `CRON_SECRET` configuration. Do not alter the Supabase daily job.

## Email and storage checks

- Confirm the configured recipient is the existing Owner email. Guest recipients/accounts are not included by the relaunch email API.
- Confirm the sender is already verified in Resend.
- After applying the approved migration, confirm `owner_relaunch_emails` is service-role-only and `claim_owner_relaunch_email` is callable only by service role.
- Observe `restart` and `launch` rows independently. Confirm the restart snapshot is set once and retries reuse it; confirm `sent` state and provider message ID only after actual provider acceptance.
- Do not run a live send as a test before the release window. Use mocks/local tests for preflight.

## Not verified in this audit

No live setting, key presence, Supabase object, Vercel cron, Resend sender, Gemini key, YouTube quota, or current production email was inspected. These items require authorized dashboard access and should be checked without copying or displaying secret values.
