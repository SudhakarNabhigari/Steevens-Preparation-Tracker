# Relaunch Rollback Plan

This is a local release plan only. No production change has been made.

## Before release

1. Create and independently verify a recoverable production backup/export. The current audit has no verified production backup; do not apply the migration before this prerequisite is met.
2. Record the deployed application version, current Vercel schedules, current Supabase daily job, and migration/object state using read-only checks. Preserve the Owner row and do not export its JSON to logs or reports.
3. Save the approved migration and release artifacts; do not overwrite existing local backup folders.

## If the application release has a defect

- Roll back the Vercel application to the last known-good deployment using the deployment platform’s rollback control. Do not alter the Supabase daily 10:00 AM IST job.
- Keep the additive outbox table, functions, and trigger in place while diagnosing. Do not drop objects or revoke service-role access as an improvised rollback.
- If the prelaunch guard blocks an allowed settings write, diagnose the exact JSON field and use a separately reviewed forward fix. Do not broaden the exception list directly in production without review.
- If resources show partial status after release, inspect per-track required-resource completeness and the recorded AI/YouTube provider status. Do not mark failed resources updated by editing the run record.

## Owner progress protection

- Do not reset `user_progress.state`, replace the whole JSON document, or restore an old snapshot over newer Owner activity.
- `preparationCycleHistory` is the preservation record. After the transition starts, preserve it and merge only the active fields that need correction.
- Before unlock, application and trigger protections should prevent preparation writes while leaving the specified unrelated settings/sync fields operational. If any Owner progress was unexpectedly changed, stop writes and restore only from a verified backup with a reviewed JSON merge.
- Guest state is separate and must not be copied into Owner state during recovery.

## Email recovery

- `restart` and `launch` are independent claims. Do not delete or reset outbox rows to force a resend.
- For a failed delivery, inspect the outbox status and provider response; retry through the normal server path so the stable idempotency key and original countdown snapshot are reused.
- A successfully accepted email cannot be recalled. Do not issue manual duplicate sends. Keep the daily learning email pipeline separate.

## Database rollback

The migration is additive and intentionally has no destructive down migration. If a database issue occurs, stop further writes and use a forward-only repair after checking the backup and exact object definitions. Removing the trigger/table/function or replaying the migration blindly risks breaking the write guard or email idempotency. Obtain explicit production authorization before any repair.
