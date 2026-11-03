-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Infak Distributions
create table if not exists public.infak_distributions (
  id uuid primary key default uuid_generate_v4(),
  mushaf_no int unique not null,
  donor_name text not null,
  show_donor_name boolean default false,
  recipient_name text not null,
  recipient_type text not null check (recipient_type in ('pesantren', 'masjid', 'madrasah', 'lainnya')),
  province text not null,
  city text not null,
  district text not null,
  lat numeric null,
  lng numeric null,
  distributed_at date not null,
  quantity int default 1,
  photo_url text null,
  notes text null,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid null
);

-- 2. Geber Masjid Distributions
create table if not exists public.geber_masjid_distributions (
  id uuid primary key default uuid_generate_v4(),
  mosque_name text not null,
  province text not null,
  city text not null,
  district text not null,
  address text not null,
  lat numeric null,
  lng numeric null,
  activity_date date not null,
  participants int default 0,
  activity_notes text null,
  photo_urls text[] default '{}',
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid null
);

-- 3. Reports
create table if not exists public.reports (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  program text not null check (program in ('infak_alquran', 'geber_masjid', 'tasmi', 'pena_yatim', 'bela_berdikari', 'umkm', 'tematik')),
  period_start date not null,
  period_end date not null,
  summary text not null,
  body text not null,
  beneficiaries int default 0,
  amount_idr bigint null,
  cover_url text null,
  gallery_urls text[] default '{}',
  pdf_url text null,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid null
);

-- 4. Gallery Items
create table if not exists public.gallery_items (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  program text not null,
  date date not null,
  image_url text not null,
  caption text null,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz default now()
);

-- 5. Themed Campaigns
create table if not exists public.themed_campaigns (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  disaster_type text not null,
  location text not null,
  status text not null default 'aktif' check (status in ('aktif', 'selesai')),
  description text not null,
  cover_url text null,
  target_idr bigint default 0,
  collected_idr bigint default 0,
  created_at timestamptz default now()
);

-- 6. Site Settings
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- 7. Admin Users
create table if not exists public.admin_users (
  user_id uuid primary key,
  email text not null unique,
  role text default 'admin',
  created_at timestamptz default now()
);

-- Helper function to check if current user is admin without RLS recursion
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select true from public.admin_users where user_id = auth.uid() limit 1),
    false
  );
$$;

-- Enable RLS
alter table public.infak_distributions enable row level security;
alter table public.geber_masjid_distributions enable row level security;
alter table public.reports enable row level security;
alter table public.gallery_items enable row level security;
alter table public.themed_campaigns enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_users enable row level security;

-- Public read policies (status = 'published')
create policy "Public can view published infak distributions" on public.infak_distributions
  for select using (status = 'published');

create policy "Public can view published geber masjid distributions" on public.geber_masjid_distributions
  for select using (status = 'published');

create policy "Public can view published reports" on public.reports
  for select using (status = 'published');

create policy "Public can view published gallery items" on public.gallery_items
  for select using (status = 'published');

create policy "Public can view themed campaigns" on public.themed_campaigns
  for select using (true);

create policy "Public can view site settings" on public.site_settings
  for select using (true);

-- Admin CRUD policies using security definer function
create policy "Admins can view admin_users" on public.admin_users
  for select using (auth.uid() = user_id);

create policy "Admins have full access to infak" on public.infak_distributions
  for all using (public.is_admin());

create policy "Admins have full access to geber" on public.geber_masjid_distributions
  for all using (public.is_admin());

create policy "Admins have full access to reports" on public.reports
  for all using (public.is_admin());

create policy "Admins have full access to gallery" on public.gallery_items
  for all using (public.is_admin());

create policy "Admins have full access to campaigns" on public.themed_campaigns
  for all using (public.is_admin());

create policy "Admins have full access to settings" on public.site_settings
  for all using (public.is_admin());

