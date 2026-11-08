import "server-only";

import { Pool, QueryResult, QueryResultRow } from "pg";

const rawUrl =
  process.env.DATABASE_URL_ACCOUNT ||
  process.env.DIRECT_URL_ACCOUNT ||
  process.env.DATABASE_URL;

export const isPostgresConfigured = Boolean(
  rawUrl &&
  !rawUrl.includes("<db_user>") &&
  !rawUrl.includes("<db_pass>") &&
  (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://"))
);

let pool: Pool | null = null;

export function getPgPool(): Pool | null {
  if (!isPostgresConfigured) return null;
  if (!pool) {
    const connectionString = rawUrl;
    pool = new Pool({
      connectionString,
      ssl: connectionString?.includes("sslmode=require") ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on("error", (err) => {
      console.warn("[pg-pool] Error koneksi PostgreSQL latar belakang:", err.message);
    });
  }
  return pool;
}

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export async function pgQuery<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const p = getPgPool();
  if (!p) {
    throw new Error("PostgreSQL lokal tidak dikonfigurasi.");
  }
  return p.query<T>(text, params);
}

/**
 * Idempotently initializes the local PostgreSQL schema if it hasn't been created yet.
 */
export async function initPostgresSchema(): Promise<void> {
  if (!isPostgresConfigured) return;

  const initSql = `
    create extension if not exists "uuid-ossp";

    create table if not exists site_settings (
      key text primary key,
      value jsonb not null,
      updated_at timestamptz default now()
    );

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

    create table if not exists infak_jinan_photos (
      id uuid primary key default uuid_generate_v4(),
      infak_id uuid references infak_jinan(id) on delete cascade,
      url text not null,
      caption text,
      sort int default 0,
      created_at timestamptz default now()
    );

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
  `;

  try {
    await pgQuery(initSql);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[postgres-schema] Gagal inisialisasi skema postgres lokal:", msg);
  }
}

