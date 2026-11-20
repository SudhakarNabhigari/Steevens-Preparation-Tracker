# Migration Review — `20261120_owner_relaunch_cycles_and_email_outbox.sql`

## Objects created or changed

1. **Table:** `public.owner_relaunch_emails`
   - Primary key constraint: `owner_relaunch_emails_pkey` on `email_type`; check constraints: `owner_relaunch_emails_email_type_check` (`restart`/`launch`) and `owner_relaunch_emails_status_check` (`pending`/`sending`/`sent`/`failed`).
   - Columns: `status`, `recipient_email`, `provider_message_id`, `failure_reason`, `attempt_count`, `claimed_until`, `generated_at`, `sent_at`, `updated_at`.
   - The migration enables RLS, revokes table access from `anon` and `authenticated`, and grants `SELECT`, `INSERT`, and `UPDATE` to `service_role`.
   - There is an `ADD COLUMN IF NOT EXISTS generated_at` operation; the column is also included in the table definition. This is redundant but non-destructive.
2. **Function:** `public.claim_owner_relaunch_email(text, text)` — `SECURITY DEFINER`, inserts a missing email-type row, atomically claims a pending/failed or expired claim, increments `attempt_count`, and sets `generated_at` once. Execute is revoked from `PUBLIC`, `anon`, and `authenticated`, and granted to `service_role`.
3. **Function:** `public.guard_owner_progress_before_relaunch()` — `SECURITY DEFINER` trigger function. It reads the configured identity from `public.app_owner_registry`, rejects Owner-row insert/delete and Owner identity transfers before unlock, and compares protected JSON fields while allowing the listed settings/sync fields to change. Execute is revoked from `PUBLIC`, `anon`, and `authenticated`; `service_role` is granted execute.
4. **Trigger:** `public.trg_guard_owner_progress_before_relaunch` on `public.user_progress`, before insert/update/delete. It is created only if that trigger name does not already exist.

The migration does not create progress columns/tables, a YouTube channel column, policies, or cron jobs. It contains no destructive statements. It does not replace `is_strict_steeven_owner(uuid)` or edit existing RLS policies. The known production facts (user supplied) state that the Owner row exists and eight Owner policies are present; no production object was inspected during this audit.

## Safety and compatibility risks

- Migration-history verification is unresolved. The absence of a particular history table is not evidence the migration is unapplied. Do not blindly replay it.
- `CREATE TABLE IF NOT EXISTS` does not repair an already existing partial table. If a prior attempt created `owner_relaunch_emails` without all expected columns or constraints, this migration only adds `generated_at`; the functions may still fail. Compare the full catalog shape and use a reviewed forward-only repair if needed.
- The trigger is deliberately fail-open if `app_owner_registry` has no configured row or the configured ID is null. Before application, repeat an existence-only check for the registry row and Owner progress row; do not query the JSONB progress contents.
- The trigger only checks whether an existing trigger with its name is present. A same-name but incorrect trigger would be skipped. Verify trigger definition and function definition, not just object existence, before deciding whether a forward repair is necessary.
- The guard protects JSON state by excluding these allowed keys from the comparison: `username`, `passwordHash`, `authVerifier`, `cloudSyncMeta`, `role`, `isAuthenticated`, `simulationDate`, `simulationEnabled`, `uploadedPdfs`, `activePdfId`, `lastSavedTimestamp`, `resources`, `doubtEntries`, and `sharedSettings`. Confirm this set matches the final `UserState` inventory before production use.
- The atomic claim's lease is five minutes. The sender uses a stable Resend idempotency key across retries. Delivery is not proven exactly-once by local tests against the live provider; inspect provider idempotency semantics and monitor outbox status after release.
- The outbox RPC itself does not contain the launch-time policy. Both application entry points and cron route call the server function that enforces the restart earliest timestamp and Day 1 unlock. Keep the RPC restricted to trusted `service_role` callers.

## Before applying

1. Obtain and verify a recoverable full production backup/export, including schema and data. The prior audit reported no valid backup and failed local pooler authentication; this remains a blocker.
2. Verify migration history through the supported Supabase Dashboard/migration workflow. Treat unknown history as unknown.
3. Run read-only catalog queries to verify table columns/constraints/grants, function definitions/ACLs, trigger definition, registry existence, progress-row existence, and unchanged policies/jobs. Do not select `user_progress.state`.
4. If objects are absent, verify the Owner registry still identifies the existing Owner row. If objects are partially present or same-named but different, prepare a reviewed forward-only repair; do not replay blindly.
5. Review the field exclusion list against complete current `UserState` and confirm the Owner cloud row’s schema can retain `preparationCycleHistory` in JSONB.
6. Apply only in an approved change window after backup and migration-state verification; then verify row/history preservation and both email claims without sending production email.

**Decision:** locally additive and non-destructive, but **not approved for application** by this audit. Production backup and migration-history/object verification are outstanding.
