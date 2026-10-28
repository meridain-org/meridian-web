-- Migration: 202610270001_store_settings.sql
-- Description: Configure store_settings row in site_settings with default contact details, announcement bar, and social channels.

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.site_settings enable row level security;

-- Grant standard permissions
revoke all on public.site_settings from anon, authenticated;
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;

-- Public can read all settings whose key starts with 'public.'
drop policy if exists "Public may read public site settings" on public.site_settings;
create policy "Public may read public site settings" on public.site_settings
  for select to anon, authenticated
  using (key like 'public.%');

-- Admins can insert/update/delete site settings
drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings" on public.site_settings
  for all to authenticated
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- Seed default public.store_settings if not already present
insert into public.site_settings (key, value)
values (
  'public.store_settings',
  jsonb_build_object(
    'email', 'info@meridianlogistics.sa',
    'phone_1', '+966 11 000 0000',
    'phone_2', '+966 50 000 0000',
    'whatsapp', '+966500000000',
    'instagram', 'https://instagram.com',
    'linkedin', 'https://linkedin.com',
    'x', 'https://x.com',
    'facebook', ''
  )
)
on conflict (key) do update
set value = excluded.value;
