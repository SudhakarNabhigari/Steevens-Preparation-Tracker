# Relaunch Test Report

## Local automated results

Command used for the complete suite:

```powershell
$testFiles = (Get-ChildItem -LiteralPath tests -Filter '*.test.ts' | ForEach-Object { $_.FullName })
node --import tsx --test $testFiles
```

**Result: 50 tests passed, 0 failed.** Coverage includes:

- Owner relaunch cycle archive and active timer reset.
- Server-authoritative launch date and distinct Owner/Guest day-one locks.
- Owner authentication and unauthenticated/Guest access rejection.
- Restart earliest-send guard, launch-after-unlock guard, separate schedules, and database outbox claims/retries using mocks.
- Owner identity-transfer guard and function privilege SQL assertions.
- Six approved coding channels, Telugu-first non-coding recommendations, Azure-approved channels, and cached metadata revalidation.
- New track completion gate and a generated verified Azure resource during simulated Gemini outage; fallback warning remains present.
- Existing daily-resource, schedule, data isolation, curriculum, assessment, and Guest sandbox regressions.

No production services were called. Email and database behavior above is tested with local mocks/static SQL assertions only.

## Static checks and build

- `npm run lint`: **passed** (`tsc --noEmit`).
- `npm run build`: **passed**.
- Build warnings: Vite config uses `__dirname` with native config-loader mode; generated JS chunk exceeds 500 KB. These are informational and were not changed as unrelated.

The initial unprivileged Node test invocation failed before running tests because the sandbox denied worker spawning (`EPERM`). The rerun with the authorized local process permission passed all 50 tests.

## Not tested

- Live Owner and Guest login against production.
- Production migration, backup restore, Supabase policy behavior, or current cron state.
- Actual Resend delivery, provider idempotency, or recipient delivery.
- Live YouTube API/Google quota and Gemini service availability.
- Vercel deployment or cron invocation.
