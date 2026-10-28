-- Migration: 202610280001_client_logos.sql
-- Description: Create simplified client_logos table for homepage infinite auto-scroll carousel

create table if not exists public.client_logos (
  id uuid primary key default gen_random_uuid(),
  logo_url text not null,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.client_logos enable row level security;

-- Permissions
revoke all on public.client_logos from anon, authenticated;
grant select on public.client_logos to anon, authenticated;
grant insert, delete on public.client_logos to authenticated;

-- Policies
-- 1. Public can view client logos
drop policy if exists "Public can view client logos" on public.client_logos;
create policy "Public can view client logos" on public.client_logos
  for select to anon, authenticated
  using (true);

-- 2. Authenticated admins can manage client logos
drop policy if exists "Admins manage client logos" on public.client_logos;
create policy "Admins manage client logos" on public.client_logos
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

-- Seed initial client logos
insert into public.client_logos (logo_url)
values
  ('https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=320&auto=format&fit=crop&q=80'),
  ('https://images.unsplash.com/photo-1516876437184-593fda40c7ce?w=320&auto=format&fit=crop&q=80'),
  ('https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=320&auto=format&fit=crop&q=80'),
  ('https://images.unsplash.com/photo-1542744094-3a31f272c490?w=320&auto=format&fit=crop&q=80'),
  ('https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=320&auto=format&fit=crop&q=80'),
  ('https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=320&auto=format&fit=crop&q=80')
on conflict do nothing;
