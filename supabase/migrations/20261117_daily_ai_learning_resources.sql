-- ============================================================================
-- Steeven's 180-Day Preparation Tracker
-- Target Supabase Project: https://bclbfqhetjiobmskecqv.supabase.co
-- Region: Northeast Asia (Tokyo)
-- Safe, Non-Destructive, Idempotent Schema & Strict RLS Migration (Step 2)
--
-- Creates ONLY these three tables:
--   1. public.daily_learning_resources
--   2. public.daily_learning_briefs
--   3. public.daily_automation_runs
-- Does NOT alter or drop user_progress or any existing tables/data.
-- Does NOT schedule a live pg_cron job prematurely (see schedule_10am_ist_cron_after_verify.sql).
-- ============================================================================

create extension if not exists pgcrypto;

-- Helper trigger function for updated_at consistency
create or replace function public.set_daily_resources_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- 1. public.daily_learning_resources
-- ============================================================================
create table if not exists public.daily_learning_resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id text not null check (track_id in ('main', 'dsa', 'azure')),
  plan_day integer not null,
  plan_date date not null,
  topic text not null,
  resource_type text not null check (
    resource_type in ('youtube', 'leetcode', 'official_documentation', 'practical_exercise', 'reference')
  ),
  title text not null,
  url text not null default '',
  channel_or_source text not null default '',
  topic_covered text not null default '',
  description text not null default '',
  why_useful text not null default '',
  difficulty text null check (difficulty in ('Easy', 'Medium', 'Hard') or difficulty is null),
  duration text null,
  language text not null default 'en',
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_learning_resources_track_day_bounds check (
    (track_id = 'main' and plan_day >= 1 and plan_day <= 180)
    or (track_id in ('dsa', 'azure') and plan_day >= 1 and plan_day <= 100)
  ),
  constraint daily_learning_resources_unique_item unique (user_id, track_id, plan_day, resource_type, url)
);

create index if not exists idx_daily_learning_resources_lookup
  on public.daily_learning_resources (user_id, track_id, plan_day, plan_date);

drop trigger if exists trg_daily_learning_resources_updated_at on public.daily_learning_resources;
create trigger trg_daily_learning_resources_updated_at
  before update on public.daily_learning_resources
  for each row
  execute function public.set_daily_resources_updated_at();

-- ============================================================================
-- 2. public.daily_learning_briefs
-- ============================================================================
create table if not exists public.daily_learning_briefs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id text not null check (track_id in ('main', 'dsa', 'azure')),
  plan_day integer not null,
  plan_date date not null,
  topic_title text not null,
  phase_or_module text not null default '',
  topic_explanation text not null default '',
  learning_objectives jsonb not null default '[]'::jsonb,
  suggested_learning_order jsonb not null default '[]'::jsonb,
  daily_guidance text not null default '',
  practical_exercise_summary text not null default '',
  leetcode_triplet jsonb not null default '[]'::jsonb,
  status text not null default 'updated' check (
    status in ('loading', 'updated', 'partially_updated', 'cached', 'failed', 'unavailable')
  ),
  status_message text not null default '',
  ai_provider_status text not null default 'missing_api_key',
  youtube_provider_status text not null default 'search_fallback_no_key',
  model_used text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_learning_briefs_track_day_bounds check (
    (track_id = 'main' and plan_day >= 1 and plan_day <= 180)
    or (track_id in ('dsa', 'azure') and plan_day >= 1 and plan_day <= 100)
  ),
  constraint daily_learning_briefs_unique_day unique (user_id, track_id, plan_day)
);

create index if not exists idx_daily_learning_briefs_lookup
  on public.daily_learning_briefs (user_id, track_id, plan_day);

drop trigger if exists trg_daily_learning_briefs_updated_at on public.daily_learning_briefs;
create trigger trg_daily_learning_briefs_updated_at
  before update on public.daily_learning_briefs
  for each row
  execute function public.set_daily_resources_updated_at();

-- ============================================================================
-- 3. public.daily_automation_runs
-- ============================================================================
create table if not exists public.daily_automation_runs (
  id uuid primary key default gen_random_uuid(),
  run_key text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  run_date date not null,
  trigger_source text not null default 'cron_10am_ist',
  overall_status text not null check (overall_status in ('success', 'partial', 'failed')),
  track_statuses jsonb not null default '{}'::jsonb,
  email_status text not null check (
    email_status in ('sent', 'failed', 'awaiting_credentials', 'awaiting_sender_verification', 'not_sent')
  ),
  recipient_email text not null default 'mypreparation0111@gmail.com',
  email_provider_id text null,
  error_message text null,
  started_at timestamptz not null default now(),
  completed_at timestamptz null,
  ran_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Non-destructive column additions if an earlier version of the table already exists
alter table public.daily_automation_runs add column if not exists track_statuses jsonb not null default '{}'::jsonb;
alter table public.daily_automation_runs add column if not exists started_at timestamptz not null default now();
alter table public.daily_automation_runs add column if not exists completed_at timestamptz null;
alter table public.daily_automation_runs add column if not exists created_at timestamptz not null default now();

create index if not exists idx_daily_automation_runs_date
  on public.daily_automation_runs (user_id, run_date desc);

-- ============================================================================
-- Strict Row Level Security (Owner Only; Anon/Guest & Cross-User Rejected)
-- ============================================================================
alter table public.daily_learning_resources enable row level security;
alter table public.daily_learning_briefs enable row level security;
alter table public.daily_automation_runs enable row level security;

-- Revoke broad anon/public table grants and scope strictly to authenticated RLS checks
revoke all on public.daily_learning_resources from anon;
revoke all on public.daily_learning_briefs from anon;
revoke all on public.daily_automation_runs from anon;

grant select, insert, update, delete on public.daily_learning_resources to authenticated;
grant select, insert, update, delete on public.daily_learning_briefs to authenticated;
grant select, insert, update, delete on public.daily_automation_runs to authenticated;

-- daily_learning_resources RLS policies
drop policy if exists "Owner select daily_learning_resources" on public.daily_learning_resources;
create policy "Owner select daily_learning_resources"
  on public.daily_learning_resources for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Owner insert daily_learning_resources" on public.daily_learning_resources;
create policy "Owner insert daily_learning_resources"
  on public.daily_learning_resources for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Owner update daily_learning_resources" on public.daily_learning_resources;
create policy "Owner update daily_learning_resources"
  on public.daily_learning_resources for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Owner delete daily_learning_resources" on public.daily_learning_resources;
create policy "Owner delete daily_learning_resources"
  on public.daily_learning_resources for delete
  to authenticated
  using (auth.uid() = user_id);

-- daily_learning_briefs RLS policies
drop policy if exists "Owner select daily_learning_briefs" on public.daily_learning_briefs;
create policy "Owner select daily_learning_briefs"
  on public.daily_learning_briefs for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Owner insert daily_learning_briefs" on public.daily_learning_briefs;
create policy "Owner insert daily_learning_briefs"
  on public.daily_learning_briefs for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Owner update daily_learning_briefs" on public.daily_learning_briefs;
create policy "Owner update daily_learning_briefs"
  on public.daily_learning_briefs for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Owner delete daily_learning_briefs" on public.daily_learning_briefs;
create policy "Owner delete daily_learning_briefs"
  on public.daily_learning_briefs for delete
  to authenticated
  using (auth.uid() = user_id);

-- daily_automation_runs RLS policies
drop policy if exists "Owner select daily_automation_runs" on public.daily_automation_runs;
create policy "Owner select daily_automation_runs"
  on public.daily_automation_runs for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Owner insert daily_automation_runs" on public.daily_automation_runs;
create policy "Owner insert daily_automation_runs"
  on public.daily_automation_runs for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Owner update daily_automation_runs" on public.daily_automation_runs;
create policy "Owner update daily_automation_runs"
  on public.daily_automation_runs for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Owner delete daily_automation_runs" on public.daily_automation_runs;
create policy "Owner delete daily_automation_runs"
  on public.daily_automation_runs for delete
  to authenticated
  using (auth.uid() = user_id);
