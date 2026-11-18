-- ============================================================================
-- RUN ONLY AFTER:
--   1. supabase/migrations/20261117_daily_ai_learning_resources.sql is applied & verified
--   2. Edge Function "daily-learning-resources" is deployed and CRON_SECRET is set
--   3. Supabase Vault secrets exist:
--        - project_url = 'https://bclbfqhetjiobmskecqv.supabase.co'
--        - cron_secret = '<matching CRON_SECRET>'
-- ============================================================================

do $$
begin
  if not exists (select 1 from pg_extension where extname = 'pg_cron') then
    raise exception 'pg_cron extension must be enabled before scheduling the 10:00 AM IST job.';
  end if;

  if not exists (select 1 from pg_extension where extname = 'pg_net') then
    raise exception 'pg_net extension must be enabled before scheduling the 10:00 AM IST job.';
  end if;

  if not exists (select 1 from vault.decrypted_secrets where name = 'project_url')
     or not exists (select 1 from vault.decrypted_secrets where name = 'cron_secret') then
    raise exception 'Both Vault secrets (project_url and cron_secret) must exist before scheduling.';
  end if;

  perform cron.unschedule('steeven-daily-ai-resources-10am-ist')
  where exists (
    select 1 from cron.job where jobname = 'steeven-daily-ai-resources-10am-ist'
  );

  perform cron.schedule(
    'steeven-daily-ai-resources-10am-ist',
    '30 4 * * *', -- Every day at 04:30 UTC = 10:00 AM Asia/Kolkata (IST)
    $cron$
    select
      net.http_post(
        url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url') || '/functions/v1/daily-learning-resources',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret')
        ),
        body := jsonb_build_object('triggerSource', 'supabase_pg_cron_10am_ist')
      );
    $cron$
  );
end $$;
