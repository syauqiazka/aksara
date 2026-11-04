-- Migration 20261104000003_infak_jinan_two_tier.sql
-- Revisi Tahap 5-A: Arsitektur Dua Tingkat (Donasi -> Santri)

-- 1. Buat tabel anak: infak_jinan_santri
create table if not exists infak_jinan_santri (
  id uuid primary key default gen_random_uuid(),
  infak_id uuid not null references infak_jinan(id) on delete cascade,
  name text not null,
  phone text, -- SENSITIF: ADMIN SAJA
  sort int default 0,
  status text check (status in ('draft', 'published')) default 'published',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Buat tabel santri_hafalan_updates
create table if not exists santri_hafalan_updates (
  id uuid primary key default gen_random_uuid(),
  santri_id uuid not null references infak_jinan_santri(id) on delete cascade,
  updated_on date not null,
  surah_no int not null check (surah_no between 1 and 114),
  surah_name text not null,
  ayat int not null,
  juz int not null check (juz between 1 and 30),
  notes text,
  created_at timestamptz default now()
);

-- 3. Migrasi data lama dari infak_jinan (jika ada kolom santri_name) ke infak_jinan_santri
do $$
begin
  if exists (
    select 1 from information_schema.columns 
    where table_name = 'infak_jinan' and column_name = 'santri_name'
  ) then
    -- Pindahkan santri yang tersimpan di baris infak_jinan ke infak_jinan_santri
    insert into infak_jinan_santri (infak_id, name, phone, sort, status)
    select id, santri_name, santri_phone, 0, status
    from infak_jinan
    where santri_name is not null and santri_name <> ''
    on conflict do nothing;

    -- Hubungkan data hafalan_updates lama ke santri baru
    if exists (select 1 from information_schema.tables where table_name = 'hafalan_updates') then
      insert into santri_hafalan_updates (santri_id, updated_on, surah_no, surah_name, ayat, juz, notes)
      select s.id, h.updated_on, h.surah_no, h.surah_name, h.ayat, h.juz, h.notes
      from hafalan_updates h
      join infak_jinan_santri s on s.infak_id = h.infak_id;
    end if;
  end if;
end $$;

-- 4. Enable Row Level Security
alter table infak_jinan_santri enable row level security;
alter table santri_hafalan_updates enable row level security;

-- 5. Kebijakan RLS (Hanya baca data yang published jika induk published)
create policy "Public read published santri" on infak_jinan_santri
  for select using (
    status = 'published' and
    exists (
      select 1 from infak_jinan j
      where j.id = infak_jinan_santri.infak_id and j.status = 'published'
    )
  );

create policy "Public read santri hafalan" on santri_hafalan_updates
  for select using (
    exists (
      select 1 from infak_jinan_santri s
      join infak_jinan j on j.id = s.infak_id
      where s.id = santri_hafalan_updates.santri_id
        and s.status = 'published'
        and j.status = 'published'
    )
  );

-- 6. VIEW Publik yang Sanitized (TANPA nomor HP donatur atau santri)
create or replace view public_infak_jinan as
select
  j.id,
  j.mushaf_no,
  case when j.show_donor_name then j.donor_name else 'Hamba Allah' end as display_donor_name,
  j.donor_origin,
  j.dedication_name,
  j.pesantren_name,
  coalesce(j.address, '') as address,
  j.maps_url,
  j.distributed_at,
  j.status,
  j.created_at,
  count(s.id) filter (where s.status = 'published') as santri_count
from infak_jinan j
left join infak_jinan_santri s on s.infak_id = j.id
where j.status = 'published'
group by j.id;

create or replace view public_infak_jinan_santri as
select
  s.id,
  s.infak_id,
  s.name as santri_name,
  s.sort,
  s.status,
  s.created_at
from infak_jinan_santri s
join infak_jinan j on j.id = s.infak_id
where s.status = 'published' and j.status = 'published';

