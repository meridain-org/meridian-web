create extension if not exists pgcrypto;

-- This migration depends on the tables from 202610230001_initial_schema.sql.
do $$
begin
  if to_regclass('public.articles') is null
     or to_regclass('public.services') is null
     or to_regclass('public.industries') is null
     or to_regclass('public.site_settings') is null
     or to_regclass('public.quote_requests') is null
     or to_regclass('public.contact_messages') is null then
    raise exception 'Base Meridian schema is missing. Run 202610230001_initial_schema.sql first, or run supabase/complete_setup.sql.';
  end if;
end;
$$;

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin')),
  created_at timestamptz not null default now()
);
alter table public.articles add column if not exists display_order integer not null default 0;
alter table public.user_roles enable row level security;
revoke all on public.user_roles from anon, authenticated;
grant select on public.user_roles to authenticated;
drop policy if exists "Users may read their own role" on public.user_roles;
create policy "Users may read their own role" on public.user_roles
  for select to authenticated using (user_id = (select auth.uid()));

-- Keep the authorization helper outside the PostgREST-exposed public schema.
create schema if not exists private;
drop function if exists public.is_admin() cascade;
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid()) and role = 'admin'
  );
$$;
revoke all on function private.is_admin() from public, anon;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  secure_url text not null,
  resource_type text not null check (resource_type in ('image','video')),
  format text,
  bytes bigint not null default 0 check (bytes >= 0),
  width integer,
  height integer,
  duration numeric,
  alt_text text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists media_assets_created_at_idx on public.media_assets(created_at desc);
alter table public.media_assets enable row level security;
revoke all on public.media_assets from anon, authenticated;
grant select on public.media_assets to anon, authenticated;
grant insert, update, delete on public.media_assets to authenticated;
drop policy if exists "Admins manage media assets" on public.media_assets;
create policy "Admins manage media assets" on public.media_assets
  for all to authenticated using (private.is_admin()) with check (private.is_admin());

create table if not exists public.site_media (
  slot text primary key check (slot ~ '^[a-z0-9][a-z0-9._-]{1,100}$'),
  asset_id uuid not null references public.media_assets(id) on delete restrict,
  alt_text text not null default '',
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);
alter table public.site_media enable row level security;
revoke all on public.site_media from anon, authenticated;
grant select on public.site_media to anon, authenticated;
grant insert, update, delete on public.site_media to authenticated;
drop policy if exists "Public reads site media" on public.site_media;
drop policy if exists "Admins manage site media" on public.site_media;
drop policy if exists "Public may read assigned site media" on public.media_assets;
create policy "Public reads site media" on public.site_media for select to anon, authenticated using (true);
create policy "Admins manage site media" on public.site_media
  for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Public may read assigned site media" on public.media_assets for select to anon, authenticated
  using (exists (select 1 from public.site_media where site_media.asset_id = media_assets.id));

-- Authenticated CMS access requires the admin role; public reads remain publish-only.
grant insert, update, delete on public.services, public.industries, public.articles to authenticated;
drop policy if exists "Admins insert services" on public.services;
drop policy if exists "Admins update services" on public.services;
drop policy if exists "Admins delete services" on public.services;
drop policy if exists "Admins read all services" on public.services;
create policy "Admins insert services" on public.services for insert to authenticated with check (private.is_admin());
create policy "Admins update services" on public.services for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins delete services" on public.services for delete to authenticated using (private.is_admin());
create policy "Admins read all services" on public.services for select to authenticated using (private.is_admin());

drop policy if exists "Admins insert industries" on public.industries;
drop policy if exists "Admins update industries" on public.industries;
drop policy if exists "Admins delete industries" on public.industries;
drop policy if exists "Admins read all industries" on public.industries;
create policy "Admins insert industries" on public.industries for insert to authenticated with check (private.is_admin());
create policy "Admins update industries" on public.industries for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins delete industries" on public.industries for delete to authenticated using (private.is_admin());
create policy "Admins read all industries" on public.industries for select to authenticated using (private.is_admin());

drop policy if exists "Admins insert articles" on public.articles;
drop policy if exists "Admins update articles" on public.articles;
drop policy if exists "Admins delete articles" on public.articles;
drop policy if exists "Admins read all articles" on public.articles;
create policy "Admins insert articles" on public.articles for insert to authenticated with check (private.is_admin());
create policy "Admins update articles" on public.articles for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins delete articles" on public.articles for delete to authenticated using (private.is_admin());
create policy "Admins read all articles" on public.articles for select to authenticated using (private.is_admin());

grant insert, update, delete on public.site_settings to authenticated;
drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings" on public.site_settings
  for all to authenticated using (private.is_admin()) with check (private.is_admin());

grant select, update, delete on public.quote_requests, public.contact_messages to authenticated;
drop policy if exists "Admins read quote requests" on public.quote_requests;
drop policy if exists "Admins update quote requests" on public.quote_requests;
drop policy if exists "Admins delete quote requests" on public.quote_requests;
drop policy if exists "Admins read contact messages" on public.contact_messages;
drop policy if exists "Admins update contact messages" on public.contact_messages;
drop policy if exists "Admins delete contact messages" on public.contact_messages;
create policy "Admins read quote requests" on public.quote_requests for select to authenticated using (private.is_admin());
create policy "Admins update quote requests" on public.quote_requests for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins delete quote requests" on public.quote_requests for delete to authenticated using (private.is_admin());
create policy "Admins read contact messages" on public.contact_messages for select to authenticated using (private.is_admin());
create policy "Admins update contact messages" on public.contact_messages for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Admins delete contact messages" on public.contact_messages for delete to authenticated using (private.is_admin());

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists site_media_updated_at on public.site_media;
create trigger site_media_updated_at before update on public.site_media
for each row execute function public.set_updated_at();
