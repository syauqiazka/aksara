/**
 * Skrip Inisialisasi Database PostgreSQL Lokal
 * Menjalankan pembuatan tabel, indeks, dan view pada database lokal (misal: localhost:5432/zyba_account).
 *
 * Cara penggunaan:
 *   node scripts/init-local-db.mjs
 * atau dengan env eksplisit:
 *   DATABASE_URL_ACCOUNT="postgresql://user:pass@localhost:5432/zyba_account" node scripts/init-local-db.mjs
 */

import { readFileSync, existsSync } from "fs";
import pg from "pg";

const { Client } = pg;

// Muat .env.local jika ada
if (existsSync(".env.local")) {
  const envContent = readFileSync(".env.local", "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...rest] = trimmed.split("=");
      const val = rest.join("=").replace(/^["']|["']$/g, "").trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const connectionString =
  process.env.DATABASE_URL_ACCOUNT ||
  process.env.DIRECT_URL_ACCOUNT ||
  process.env.DATABASE_URL;

if (!connectionString || connectionString.includes("<db_user>")) {
  console.error("❌ Environment variable database belum disetel!");
  console.log("Harap setel DATABASE_URL_ACCOUNT atau DIRECT_URL_ACCOUNT di .env.local atau environment server.");
  console.log("Contoh:");
  console.log('DATABASE_URL_ACCOUNT="postgresql://postgres:password@localhost:5432/zyba_account"');
  process.exit(1);
}

console.log("🔌 Menghubungkan ke PostgreSQL:", connectionString.replace(/:[^:@]+@/, ":****@"));

const client = new Client({
  connectionString,
  ssl: connectionString.includes("sslmode=require") ? { rejectUnauthorized: false } : false,
});

async function run() {
  try {
    await client.connect();
    console.log("✅ Terhubung ke PostgreSQL.");

    const ddl = `
      -- 1. Ekstensi UUID
      create extension if not exists "uuid-ossp";

      -- 2. Site Settings
      create table if not exists site_settings (
        key text primary key,
        value jsonb not null,
        updated_at timestamptz default now()
      );

      -- 3. Upload Ledger (pemantau file & deduplikasi)
      create table if not exists upload_ledger (
        id uuid primary key default uuid_generate_v4(),
        url text not null unique,
        content_hash text not null,
        size_bytes int not null,
        mime_type text not null,
        status text not null check (status in ('pending', 'committed', 'deleted')),
        created_at timestamptz default now(),
        committed_at timestamptz null
      );

      -- 4. Infak Al-Qur'an Jinan (Tingkat 1)
      create table if not exists infak_jinan (
        id uuid primary key default uuid_generate_v4(),
        mushaf_no int unique not null,
        donor_name text not null,
        show_donor_name boolean default false,
        donor_origin text not null,
        donor_phone text,
        dedication_name text not null,
        pesantren_name text not null,
        pesantren_province text,
        pesantren_city text,
        address text not null,
        distributed_at date not null,
        maps_url text,
        santri_name text,
        santri_phone text,
        status text check (status in ('draft', 'published')) default 'published',
        created_at timestamptz default now(),
        updated_at timestamptz default now()
      );

      -- 5. Foto Serah Terima Infak Jinan
      create table if not exists infak_jinan_photos (
        id uuid primary key default uuid_generate_v4(),
        infak_id uuid references infak_jinan(id) on delete cascade,
        url text not null,
        caption text,
        sort int default 0,
        created_at timestamptz default now()
      );

      -- 6. Santri Binaan Infak Jinan (Tingkat 2)
      create table if not exists infak_jinan_santri (
        id uuid primary key default uuid_generate_v4(),
        infak_id uuid not null references infak_jinan(id) on delete cascade,
        name text not null,
        phone text,
        sort int default 0,
        status text check (status in ('draft', 'published')) default 'published',
        created_at timestamptz default now(),
        updated_at timestamptz default now()
      );

      -- 7. Progres Bulanan Santri
      create table if not exists santri_hafalan_updates (
        id uuid primary key default uuid_generate_v4(),
        santri_id uuid not null references infak_jinan_santri(id) on delete cascade,
        updated_on date not null,
        surah_no int not null check (surah_no between 1 and 114),
        surah_name text not null,
        ayat int not null,
        juz int not null check (juz between 1 and 30),
        notes text,
        created_at timestamptz default now()
      );

      -- 8. Geber Bersih Masjid
      create table if not exists geber_masjid_distributions (
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
        updated_at timestamptz default now()
      );

      -- 9. BUSS Al-Qur'an
      create table if not exists buss_distributions (
        id uuid primary key default uuid_generate_v4(),
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

      -- 10. Yatim Berdikari
      create table if not exists yatim_distributions (
        id uuid primary key default uuid_generate_v4(),
        year int not null,
        activity_name text not null,
        organizer text not null,
        description text not null,
        photo_urls text[] default array[]::text[],
        status text check (status in ('draft', 'published')) default 'published',
        created_at timestamptz default now()
      );

      -- 11. Laporan Penyaluran
      create table if not exists reports (
        id uuid primary key default uuid_generate_v4(),
        slug text unique not null,
        title text not null,
        program text not null,
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
        updated_at timestamptz default now()
      );

      -- 12. Galeri Dokumentasi
      create table if not exists gallery_items (
        id uuid primary key default uuid_generate_v4(),
        title text not null,
        program text not null,
        date date not null,
        image_url text not null,
        caption text null,
        status text not null default 'published' check (status in ('draft', 'published')),
        created_at timestamptz default now()
      );

      -- 13. Donasi Tematik
      create table if not exists themed_campaigns (
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

      -- 14. View Publik Sanitized
      create or replace view public_infak_jinan as
      select
        j.id,
        j.mushaf_no,
        case when j.show_donor_name then j.donor_name else 'Hamba Allah' end as display_donor_name,
        j.donor_origin,
        j.dedication_name,
        j.pesantren_name,
        j.pesantren_province,
        j.pesantren_city,
        coalesce(j.address, '') as address,
        j.maps_url,
        to_char(j.distributed_at, 'YYYY-MM-DD') as distributed_at,
        j.status,
        j.created_at,
        count(s.id) filter (where s.status = 'published')::int as santri_count
      from infak_jinan j
      left join infak_jinan_santri s on s.infak_id = j.id
      where j.status = 'published'
      group by j.id
      order by j.mushaf_no asc;
    `;

    await client.query(ddl);
    console.log("🎉 Berhasil! Seluruh tabel, view, dan relasi PostgreSQL telah dibuat.");
  } catch (err) {
    console.error("❌ Error saat inisialisasi skema:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();

