create extension if not exists pgcrypto;

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(), reference_number text not null unique default ('MRQ-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  name text not null check (char_length(name) between 2 and 100), company_name text not null check (char_length(company_name) between 1 and 150),
  email text not null check (char_length(email) <= 254), phone text not null check (char_length(phone) between 7 and 35),
  origin_country text not null, origin_city text not null, destination_country text not null, destination_city text not null,
  service_type text not null check (service_type in ('Sea Freight','Air Freight','Land Transportation','Customs Clearance','Warehousing & 3PL','Project Logistics','Heavy-Lift Cargo','Door-to-Door Logistics')),
  cargo_type text not null, cargo_weight text, cargo_volume text, preferred_shipping_date date, message text not null check (char_length(message) between 10 and 4000),
  status text not null default 'new' check (status in ('new','in_progress','responded','closed','spam')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists quote_requests_created_at_idx on public.quote_requests (created_at desc);
create index if not exists quote_requests_status_idx on public.quote_requests (status, created_at desc);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(), name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 254), phone text, subject text not null check (char_length(subject) between 3 and 150),
  company_name text, message text not null check (char_length(message) between 10 and 4000),
  status text not null default 'new' check (status in ('new','in_progress','responded','closed','spam')), created_at timestamptz not null default now()
);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index if not exists contact_messages_status_idx on public.contact_messages (status, created_at desc);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null, short_description text not null,
  content jsonb not null default '{}'::jsonb, cover_image text, icon text, is_published boolean not null default false,
  display_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists services_published_order_idx on public.services (display_order, title) where is_published;

create table if not exists public.industries (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null, short_description text not null,
  content jsonb not null default '{}'::jsonb, cover_image text, is_published boolean not null default false,
  display_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists industries_published_order_idx on public.industries (display_order, title) where is_published;

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null, excerpt text not null,
  content jsonb not null default '{}'::jsonb, cover_image text, author text, published_at timestamptz,
  is_published boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists articles_published_at_idx on public.articles (published_at desc) where is_published;

create table if not exists public.site_settings (
  key text primary key, value jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now()
);

alter table public.quote_requests enable row level security;
alter table public.contact_messages enable row level security;
alter table public.services enable row level security;
alter table public.industries enable row level security;
alter table public.articles enable row level security;
alter table public.site_settings enable row level security;

revoke all on public.quote_requests, public.contact_messages, public.services, public.industries, public.articles, public.site_settings from anon, authenticated;
grant insert (name, company_name, email, phone, origin_country, origin_city, destination_country, destination_city, service_type, cargo_type, cargo_weight, cargo_volume, preferred_shipping_date, message) on public.quote_requests to anon;
grant insert (name, email, phone, subject, company_name, message) on public.contact_messages to anon;
grant select on public.services, public.industries, public.articles, public.site_settings to anon, authenticated;

drop policy if exists "Public may submit quote requests" on public.quote_requests;
create policy "Public may submit quote requests" on public.quote_requests for insert to anon
  with check (status = 'new');
drop policy if exists "Public may submit contact messages" on public.contact_messages;
create policy "Public may submit contact messages" on public.contact_messages for insert to anon
  with check (status = 'new');
drop policy if exists "Public may read published services" on public.services;
create policy "Public may read published services" on public.services for select to anon, authenticated using (is_published);
drop policy if exists "Public may read published industries" on public.industries;
create policy "Public may read published industries" on public.industries for select to anon, authenticated using (is_published);
drop policy if exists "Public may read published articles" on public.articles;
create policy "Public may read published articles" on public.articles for select to anon, authenticated using (is_published);
drop policy if exists "Public may read public site settings" on public.site_settings;
create policy "Public may read public site settings" on public.site_settings for select to anon, authenticated using (key like 'public.%');

comment on table public.quote_requests is 'Private customer enquiries. Never grant public select or update.';
comment on table public.contact_messages is 'Private contact messages. Never grant public select or update.';
