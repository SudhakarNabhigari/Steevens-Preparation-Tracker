-- ============================================================================
-- Steeven's 180-Day Preparation Tracker
-- Target Supabase Project: https://bclbfqhetjiobmskecqv.supabase.co
-- Safe, Additive, Non-Destructive Migration (Stages 2, 3, 5)
--
-- 1. Adds rich daily brief JSONB columns for C++ examples, Azure architecture,
--    revision notes, common mistakes, and actual daily schedule metadata.
-- 2. Enforces STRICT Single-Owner RLS (beyond generic auth.uid() = user_id)
--    via public.app_owner_registry and public.is_strict_steeven_owner(uuid).
-- Does NOT drop, truncate, or modify user_progress or existing rows.
-- ============================================================================

alter table public.daily_learning_briefs
  add column if not exists practical_examples jsonb not null default '[]'::jsonb;

alter table public.daily_learning_briefs
  add column if not exists revision_notes jsonb not null default '[]'::jsonb;

alter table public.daily_learning_briefs
  add column if not exists common_mistakes jsonb not null default '[]'::jsonb;

alter table public.daily_learning_briefs
  add column if not exists schedule_meta jsonb not null default '{}'::jsonb;

alter table public.daily_learning_resources
  add column if not exists thumbnail_url text null;

-- Single-Owner Registry (prevents any other authenticated user on the project
-- from passing RLS even when auth.uid() = user_id).
create table if not exists public.app_owner_registry (
  id integer primary key check (id = 1),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.app_owner_registry enable row level security;
revoke all on public.app_owner_registry from anon;
revoke all on public.app_owner_registry from authenticated;

create or replace function public.is_strict_steeven_owner(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    auth.uid() is not null
    and auth.uid() = target_user_id
    and (
      not exists (select 1 from public.app_owner_registry where id = 1)
      or exists (
        select 1
        from public.app_owner_registry
        where id = 1 and owner_user_id = auth.uid()
      )
    );
$$;

-- Upgrade RLS policies to strict single-Owner checks
drop policy if exists "Owner select daily_learning_resources" on public.daily_learning_resources;
create policy "Owner select daily_learning_resources"
  on public.daily_learning_resources for select
  to authenticated
  using (public.is_strict_steeven_owner(user_id));

drop policy if exists "Owner insert daily_learning_resources" on public.daily_learning_resources;
create policy "Owner insert daily_learning_resources"
  on public.daily_learning_resources for insert
  to authenticated
  with check (public.is_strict_steeven_owner(user_id));

drop policy if exists "Owner update daily_learning_resources" on public.daily_learning_resources;
create policy "Owner update daily_learning_resources"
  on public.daily_learning_resources for update
  to authenticated
  using (public.is_strict_steeven_owner(user_id))
  with check (public.is_strict_steeven_owner(user_id));

drop policy if exists "Owner delete daily_learning_resources" on public.daily_learning_resources;
create policy "Owner delete daily_learning_resources"
  on public.daily_learning_resources for delete
  to authenticated
  using (public.is_strict_steeven_owner(user_id));

drop policy if exists "Owner select daily_learning_briefs" on public.daily_learning_briefs;
create policy "Owner select daily_learning_briefs"
  on public.daily_learning_briefs for select
  to authenticated
  using (public.is_strict_steeven_owner(user_id));

drop policy if exists "Owner insert daily_learning_briefs" on public.daily_learning_briefs;
create policy "Owner insert daily_learning_briefs"
  on public.daily_learning_briefs for insert
  to authenticated
  with check (public.is_strict_steeven_owner(user_id));

drop policy if exists "Owner update daily_learning_briefs" on public.daily_learning_briefs;
create policy "Owner update daily_learning_briefs"
  on public.daily_learning_briefs for update
  to authenticated
  using (public.is_strict_steeven_owner(user_id))
  with check (public.is_strict_steeven_owner(user_id));

drop policy if exists "Owner delete daily_learning_briefs" on public.daily_learning_briefs;
create policy "Owner delete daily_learning_briefs"
  on public.daily_learning_briefs for delete
  to authenticated
  using (public.is_strict_steeven_owner(user_id));

drop policy if exists "Owner select daily_automation_runs" on public.daily_automation_runs;
create policy "Owner select daily_automation_runs"
  on public.daily_automation_runs for select
  to authenticated
  using (public.is_strict_steeven_owner(user_id));

drop policy if exists "Owner insert daily_automation_runs" on public.daily_automation_runs;
create policy "Owner insert daily_automation_runs"
  on public.daily_automation_runs for insert
  to authenticated
  with check (public.is_strict_steeven_owner(user_id));

drop policy if exists "Owner update daily_automation_runs" on public.daily_automation_runs;
create policy "Owner update daily_automation_runs"
  on public.daily_automation_runs for update
  to authenticated
  using (public.is_strict_steeven_owner(user_id))
  with check (public.is_strict_steeven_owner(user_id));

drop policy if exists "Owner delete daily_automation_runs" on public.daily_automation_runs;
create policy "Owner delete daily_automation_runs"
  on public.daily_automation_runs for delete
  to authenticated
  using (public.is_strict_steeven_owner(user_id));
