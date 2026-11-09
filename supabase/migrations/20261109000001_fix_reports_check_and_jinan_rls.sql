-- Migration 20261109000001_fix_reports_check_and_jinan_rls.sql
-- 1. Perbarui check constraint program pada tabel reports agar mendukung semua 11 program yayasan
alter table public.reports drop constraint if exists reports_program_check;
alter table public.reports add constraint reports_program_check check (
  program in (
    'infak_jinan',
    'buss_quran',
    'geber_masjid',
    'tasmi',
    'yatim_berdikari',
    'pelatihan_it',
    'umkm',
    'tematik',
    'infak_alquran',
    'pena_yatim',
    'bela_berdikari'
  )
);

-- 2. Kebijakan CRUD penuh untuk tabel infak_jinan (dua tingkat)
alter table public.infak_jinan enable row level security;
drop policy if exists "Enable all for admin on infak_jinan" on public.infak_jinan;
create policy "Enable all for admin on infak_jinan" on public.infak_jinan
  for all using (true) with check (true);

-- 3. Kebijakan CRUD penuh untuk tabel anak: infak_jinan_santri
alter table public.infak_jinan_santri enable row level security;
drop policy if exists "Enable all for admin on infak_jinan_santri" on public.infak_jinan_santri;
create policy "Enable all for admin on infak_jinan_santri" on public.infak_jinan_santri
  for all using (true) with check (true);

-- 4. Kebijakan CRUD penuh untuk tabel foto: infak_jinan_photos
alter table public.infak_jinan_photos enable row level security;
drop policy if exists "Enable all for admin on infak_jinan_photos" on public.infak_jinan_photos;
create policy "Enable all for admin on infak_jinan_photos" on public.infak_jinan_photos
  for all using (true) with check (true);

-- 5. Kebijakan CRUD penuh untuk riwayat hafalan santri: santri_hafalan_updates
alter table public.santri_hafalan_updates enable row level security;
drop policy if exists "Enable all for admin on santri_hafalan_updates" on public.santri_hafalan_updates;
create policy "Enable all for admin on santri_hafalan_updates" on public.santri_hafalan_updates
  for all using (true) with check (true);

