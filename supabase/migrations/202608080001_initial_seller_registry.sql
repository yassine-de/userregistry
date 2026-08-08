-- Scaller Seller Registry
-- Apply this migration only to the NEW, dedicated Supabase project.

create extension if not exists pgcrypto;

create type public.application_status as enum (
  'draft',
  'submitted',
  'under_review',
  'approved',
  'rejected',
  'needs_more_info'
);

create table public.seller_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  company_name text not null default '',
  whatsapp text not null default '',
  email text not null,
  country text not null default '',
  city text not null default '',
  product_types text not null default '',
  estimated_daily_orders integer check (estimated_daily_orders is null or estimated_daily_orders > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.seller_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  status public.application_status not null default 'draft',
  message text,
  internal_notes text,
  reviewed_by uuid references auth.users(id) on delete set null,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.application_status_history (
  id bigint generated always as identity primary key,
  application_id uuid not null references public.seller_applications(id) on delete cascade,
  from_status public.application_status,
  to_status public.application_status not null,
  note text,
  changed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

comment on column public.seller_applications.internal_notes is 'Admin-only notes. Never exposed through seller-facing UI.';
comment on column public.seller_applications.reviewed_by is 'Future admin reviewer from the dedicated Supabase Auth tenant.';

create index seller_profiles_email_idx on public.seller_profiles (lower(email));
create index seller_profiles_created_at_idx on public.seller_profiles (created_at desc);
create index seller_applications_user_id_idx on public.seller_applications (user_id);
create index seller_applications_status_idx on public.seller_applications (status);
create index seller_applications_created_at_idx on public.seller_applications (created_at desc);
create index seller_applications_status_created_at_idx on public.seller_applications (status, created_at desc);
create index application_status_history_application_id_idx on public.application_status_history (application_id, created_at desc);
create index application_status_history_created_at_idx on public.application_status_history (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger seller_profiles_set_updated_at
before update on public.seller_profiles
for each row execute function public.set_updated_at();

create trigger seller_applications_set_updated_at
before update on public.seller_applications
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

create or replace function public.is_email_confirmed()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from auth.users
    where id = auth.uid() and email_confirmed_at is not null
  );
$$;

create or replace function public.handle_new_seller_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.seller_profiles (user_id, email)
  values (new.id, lower(coalesce(new.email, '')))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created_create_seller_profile
after insert on auth.users
for each row execute function public.handle_new_seller_user();

alter table public.seller_profiles enable row level security;
alter table public.seller_applications enable row level security;
alter table public.application_status_history enable row level security;

create policy "sellers select own profile"
on public.seller_profiles for select
to authenticated
using (user_id = auth.uid() and public.is_email_confirmed());

create policy "sellers insert own profile"
on public.seller_profiles for insert
to authenticated
with check (
  user_id = auth.uid()
  and public.is_email_confirmed()
  and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

create policy "sellers update own profile"
on public.seller_profiles for update
to authenticated
using (user_id = auth.uid() and public.is_email_confirmed())
with check (
  user_id = auth.uid()
  and public.is_email_confirmed()
  and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

create policy "admins manage all profiles"
on public.seller_profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "sellers select own application"
on public.seller_applications for select
to authenticated
using (user_id = auth.uid() and public.is_email_confirmed());

create policy "sellers create own draft"
on public.seller_applications for insert
to authenticated
with check (
  user_id = auth.uid()
  and public.is_email_confirmed()
  and status = 'draft'
  and internal_notes is null
  and reviewed_by is null
  and reviewed_at is null
  and approved_at is null
);

create policy "sellers update editable application"
on public.seller_applications for update
to authenticated
using (
  user_id = auth.uid()
  and public.is_email_confirmed()
  and status in ('draft', 'needs_more_info')
)
with check (
  user_id = auth.uid()
  and public.is_email_confirmed()
  and status in ('draft', 'needs_more_info')
);

create policy "admins manage all applications"
on public.seller_applications for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "sellers select own status history"
on public.application_status_history for select
to authenticated
using (
  public.is_email_confirmed()
  and exists (
    select 1 from public.seller_applications a
    where a.id = application_id and a.user_id = auth.uid()
  )
);

create policy "admins manage all status history"
on public.application_status_history for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create or replace function public.submit_seller_application(p_application_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_application public.seller_applications;
  v_previous_status public.application_status;
  v_profile public.seller_profiles;
begin
  if auth.uid() is null or not public.is_email_confirmed() then
    raise exception 'A confirmed email address is required';
  end if;

  select * into v_application
  from public.seller_applications
  where id = p_application_id and user_id = auth.uid()
  for update;

  if not found then raise exception 'Application not found'; end if;
  if v_application.status not in ('draft', 'needs_more_info') then
    raise exception 'Application cannot be submitted from status %', v_application.status;
  end if;

  select * into v_profile
  from public.seller_profiles
  where user_id = auth.uid();

  if not found
    or nullif(btrim(v_profile.full_name), '') is null
    or nullif(btrim(v_profile.company_name), '') is null
    or nullif(btrim(v_profile.whatsapp), '') is null
    or nullif(btrim(v_profile.email), '') is null
    or nullif(btrim(v_profile.country), '') is null
    or nullif(btrim(v_profile.city), '') is null
    or nullif(btrim(v_profile.product_types), '') is null
    or v_profile.estimated_daily_orders is null
  then
    raise exception 'Seller profile is incomplete';
  end if;

  v_previous_status := v_application.status;

  update public.seller_applications
  set status = 'submitted', submitted_at = now()
  where id = p_application_id
  returning * into v_application;

  insert into public.application_status_history (
    application_id, from_status, to_status, changed_by
  ) values (
    p_application_id, v_previous_status, 'submitted', auth.uid()
  );

  return;
end;
$$;

create or replace function public.admin_set_application_status(
  p_application_id uuid,
  p_status public.application_status,
  p_internal_note text default null
)
returns public.seller_applications
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_application public.seller_applications;
  v_previous_status public.application_status;
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;

  select * into v_application
  from public.seller_applications
  where id = p_application_id
  for update;

  if not found then raise exception 'Application not found'; end if;
  v_previous_status := v_application.status;

  update public.seller_applications
  set
    status = p_status,
    internal_notes = coalesce(p_internal_note, internal_notes),
    reviewed_by = auth.uid(),
    reviewed_at = case when p_status in ('under_review', 'approved', 'rejected', 'needs_more_info') then now() else reviewed_at end,
    approved_at = case when p_status = 'approved' then now() else null end
  where id = p_application_id
  returning * into v_application;

  insert into public.application_status_history (
    application_id, from_status, to_status, note, changed_by
  ) values (
    p_application_id, v_previous_status, p_status, p_internal_note, auth.uid()
  );

  return v_application;
end;
$$;

create or replace function public.admin_list_seller_applications()
returns setof public.seller_applications
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  return query
  select * from public.seller_applications order by created_at desc;
end;
$$;

create or replace function public.admin_list_application_status_history(p_application_id uuid default null)
returns setof public.application_status_history
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  return query
  select h.* from public.application_status_history h
  where p_application_id is null or h.application_id = p_application_id
  order by h.created_at desc;
end;
$$;

revoke all on public.seller_profiles from anon, authenticated;
revoke all on public.seller_applications from anon, authenticated;
revoke all on public.application_status_history from anon, authenticated;

grant select, insert on public.seller_profiles to authenticated;
grant update (full_name, company_name, whatsapp, email, country, city, product_types, estimated_daily_orders) on public.seller_profiles to authenticated;

grant select (id, user_id, status, message, submitted_at, created_at, updated_at) on public.seller_applications to authenticated;
grant insert (user_id, message) on public.seller_applications to authenticated;
grant update (message) on public.seller_applications to authenticated;

grant select (id, application_id, from_status, to_status, created_at) on public.application_status_history to authenticated;

revoke all on function public.is_admin() from public;
revoke all on function public.is_email_confirmed() from public;
revoke all on function public.submit_seller_application(uuid) from public;
revoke all on function public.admin_set_application_status(uuid, public.application_status, text) from public;
revoke all on function public.admin_list_seller_applications() from public;
revoke all on function public.admin_list_application_status_history(uuid) from public;
revoke all on function public.handle_new_seller_user() from public;
revoke all on function public.set_updated_at() from public;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_email_confirmed() to authenticated;
grant execute on function public.submit_seller_application(uuid) to authenticated;
grant execute on function public.admin_set_application_status(uuid, public.application_status, text) to authenticated;
grant execute on function public.admin_list_seller_applications() to authenticated;
grant execute on function public.admin_list_application_status_history(uuid) to authenticated;
