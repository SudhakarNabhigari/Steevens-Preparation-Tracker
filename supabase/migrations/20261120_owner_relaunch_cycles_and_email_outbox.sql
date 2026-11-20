-- Additive Owner relaunch support. Existing progress rows, RLS policies, and scheduled jobs are untouched.

create table if not exists public.owner_relaunch_emails (
  email_type text primary key check (email_type in ('restart', 'launch')),
  status text not null default 'pending' check (status in ('pending', 'sending', 'sent', 'failed')),
  recipient_email text,
  provider_message_id text,
  failure_reason text,
  attempt_count integer not null default 0,
  claimed_until timestamptz,
  generated_at timestamptz,
  sent_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.owner_relaunch_emails
  add column if not exists generated_at timestamptz;

alter table public.owner_relaunch_emails enable row level security;
revoke all on public.owner_relaunch_emails from anon, authenticated;
grant select, insert, update on public.owner_relaunch_emails to service_role;

create or replace function public.claim_owner_relaunch_email(
  p_email_type text,
  p_recipient_email text
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  claimed boolean := false;
begin
  if p_email_type not in ('restart', 'launch') then
    raise exception 'Invalid relaunch email type';
  end if;

  insert into public.owner_relaunch_emails (email_type)
  values (p_email_type)
  on conflict (email_type) do nothing;

  update public.owner_relaunch_emails
  set status = 'sending',
      recipient_email = p_recipient_email,
      attempt_count = attempt_count + 1,
      claimed_until = clock_timestamp() + interval '5 minutes',
      generated_at = coalesce(generated_at, clock_timestamp()),
      failure_reason = null,
      updated_at = clock_timestamp()
  where email_type = p_email_type
    and status <> 'sent'
    and (status <> 'sending' or claimed_until < clock_timestamp())
  returning true into claimed;

  return coalesce(claimed, false);
end;
$$;

revoke all on function public.claim_owner_relaunch_email(text, text) from public, anon, authenticated;
grant execute on function public.claim_owner_relaunch_email(text, text) to service_role;

create or replace function public.guard_owner_progress_before_relaunch()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  owner_id uuid;
begin
  -- Read the configured identity directly. is_strict_steeven_owner() requires auth.uid(),
  -- which is NULL for trusted service-role writes and SQL Editor sessions.
  select owner_user_id into owner_id
  from public.app_owner_registry
  where id = 1;

  if tg_op = 'DELETE' then
    if clock_timestamp() < timestamptz '2026-11-23 00:00:00+05:30'
       and old.user_id = owner_id then
      raise exception 'Owner preparation is locked until 2026-11-23 00:00 IST.'
        using errcode = '42501';
    end if;
    return old;
  end if;

  if tg_op = 'INSERT' then
    if clock_timestamp() < timestamptz '2026-11-23 00:00:00+05:30'
       and new.user_id = owner_id then
      raise exception 'Owner preparation is locked until 2026-11-23 00:00 IST.'
        using errcode = '42501';
    end if;
    return new;
  end if;

  if clock_timestamp() < timestamptz '2026-11-23 00:00:00+05:30'
     and (old.user_id = owner_id) is distinct from (new.user_id = owner_id) then
    raise exception 'Owner identity cannot be transferred before 2026-11-23 00:00 IST.'
      using errcode = '42501';
  end if;

  if clock_timestamp() < timestamptz '2026-11-23 00:00:00+05:30'
     and (old.user_id = owner_id or new.user_id = owner_id)
     and (old.state - array[
       'username', 'passwordHash', 'authVerifier', 'cloudSyncMeta', 'role',
       'isAuthenticated', 'simulationDate', 'simulationEnabled', 'uploadedPdfs',
       'activePdfId', 'lastSavedTimestamp', 'resources', 'doubtEntries', 'sharedSettings'
     ]) is distinct from (new.state - array[
       'username', 'passwordHash', 'authVerifier', 'cloudSyncMeta', 'role',
       'isAuthenticated', 'simulationDate', 'simulationEnabled', 'uploadedPdfs',
       'activePdfId', 'lastSavedTimestamp', 'resources', 'doubtEntries', 'sharedSettings'
     ]) then
    raise exception 'Owner preparation is locked until 2026-11-23 00:00 IST.'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

revoke all on function public.guard_owner_progress_before_relaunch() from public, anon, authenticated;
grant execute on function public.guard_owner_progress_before_relaunch() to service_role;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.user_progress'::regclass
      and tgname = 'trg_guard_owner_progress_before_relaunch'
      and not tgisinternal
  ) then
    execute 'create trigger trg_guard_owner_progress_before_relaunch
      before insert or update or delete on public.user_progress
      for each row execute function public.guard_owner_progress_before_relaunch()';
  end if;
end;
$$;
