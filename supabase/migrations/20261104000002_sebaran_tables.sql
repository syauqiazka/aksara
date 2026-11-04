-- Migration 20261104000002_sebaran_tables.sql
-- Skema Tabel Data Sebaran Docx Baru (Infak Jinan, BUSS Al-Qur'an, Yatim Berdikari)

create table if not exists infak_jinan (
  id uuid primary key default gen_random_uuid(),
  mushaf_no int unique not null,
  donor_name text not null,
  show_donor_name boolean default false,
  donor_origin text not null,
  donor_phone text, -- SENSITIF: ADMIN SAJA
  dedication_name text not null,
  pesantren_name text not null,
  address text not null,
  distributed_at date not null,
  maps_url text,
  santri_name text not null,
  santri_phone text, -- SENSITIF: ADMIN SAJA
  status text check (status in ('draft', 'published')) default 'published',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists infak_jinan_photos (
  id uuid primary key default gen_random_uuid(),
  infak_id uuid references infak_jinan(id) on delete cascade,
  url text not null,
  caption text,
  sort int default 0,
  created_at timestamptz default now()
);

create table if not exists hafalan_updates (
  id uuid primary key default gen_random_uuid(),
  infak_id uuid references infak_jinan(id) on delete cascade,
  updated_on date not null,
  surah_no int not null check (surah_no between 1 and 114),
  surah_name text not null,
  ayat int not null,
  juz int not null check (juz between 1 and 30),
  notes text,
  created_at timestamptz default now()
);

create table if not exists buss_distributions (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  santri_name text not null,
  origin text not null,
  pesantren_name text not null,
  current_surah text not null,
  current_ayat int not null,
  juz int not null check (juz between 1 and 30),
  donor_name text not null,
  show_donor_name boolean default false,
  photo_urls text[] default array[]::text[],
  status text check (status in ('draft', 'published')) default 'published',
  created_at timestamptz default now()
);

create table if not exists yatim_berdikari_activities (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  activity_name text not null,
  organizer text not null,
  documentation_urls text[] default array[]::text[],
  description text not null,
  activity_date date not null,
  status text check (status in ('draft', 'published')) default 'published',
  created_at timestamptz default now()
);

alter table infak_jinan enable row level security;
alter table infak_jinan_photos enable row level security;
alter table hafalan_updates enable row level security;
alter table buss_distributions enable row level security;
alter table yatim_berdikari_activities enable row level security;

create policy "Public read published infak_jinan" on infak_jinan for select using (status = 'published');
create policy "Public read photos" on infak_jinan_photos for select using (true);
create policy "Public read hafalan_updates" on hafalan_updates for select using (true);
create policy "Public read published buss" on buss_distributions for select using (status = 'published');
create policy "Public read published yatim" on yatim_berdikari_activities for select using (status = 'published');

