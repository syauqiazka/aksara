# AKSARA — DATABASE AUDIT & MYSQL MIGRATION PREPARATION REPORT

> **Dokumen**: Laporan Audit Komprehensif Migrasi Database  
> **Aplikasi**: Web Portal & Backoffice Yayasan Sahabat Aksara Semesta  
> **Target Migrasi**: Supabase PostgreSQL -> Hostinger MySQL (Prisma ORM)  
> **Status Fase**: Fase 1 — Audit & Persiapan Selesai (Non-Destruktif)  
> **Tanggal Audit**: November 2026  

---

## 1. RINGKASAN EKSEKUTIF

Aplikasi Aksara saat ini beroperasi dengan stack **Next.js 16 (App Router)**, **Prisma ORM 6**, dan terhubung ke **Supabase PostgreSQL**. Selain Prisma, aplikasi memiliki 3 lapisan akses database redundan (*multi-fallback*): Prisma Client -> Direct PostgreSQL (`pgQuery`) -> Supabase Client (`@supabase/supabase-js`) -> `localStore` (file JSON / memori).

Tujuan migrasi ini adalah:
1. Menjadikan **Hostinger MySQL** sebagai **satu-satunya database tunggal** aplikasi melalui **Prisma ORM**.
2. Mengeliminasi seluruh ketergantungan pada PostgreSQL murni (`pg`, query SQL khusus Postgres).
3. Mengeliminasi seluruh ketergantungan database pada Supabase SDK dan fallback Supabase.
4. Menghilangkan `localStore` sebagai database fallback pada environment produksi.
5. Mempertahankan 100% data produksi, relasi *foreign key*, keutuhan ID (UUID), timestamp, data donatur, dan URL foto kegiatan tanpa kehilangan satu pun record.
6. Memastikan aplikasi siap dideploy secara stabil di **Hostinger Business Shared Hosting (Node.js Web App)**.

---

## 2. INVENTARISASI DATABASE PRODUKSI (LIVE SUPABASE AUDIT)

Audit langsung dilakukan terhadap database produksi Supabase aktif menggunakan service connection. Hasil inventarisasi per tabel adalah sebagai berikut:

| No | Nama Tabel | Status Live | Jumlah Baris (Live) | Primary Key | Keterangan & Karakteristik Data |
|---|---|---|---|---|---|
| 1 | `site_settings` | **Ada** | **2** | `key` (TEXT) | Pengaturan bank BCA yayasan (`bank_accounts`) dan narahubung (`contact_info`). Kolom `value` bertipe `JSONB`. |
| 2 | `upload_ledger` | **Ada** | **0** | `id` (UUID) | Pencatatan deduplikasi hash SHA-256 upload foto. Siap dimigrasikan skemanya ke MySQL. |
| 3 | `infak_jinan` | **Ada** | **8** | `id` (UUID) | Data induk wakaf Mushaf Jinan (Mushaf ke-1 s/d ke-8). Memiliki relasi cascade ke `photos` dan `santri_list`. |
| 4 | `infak_jinan_photos` | **Ada** | **8** | `id` (UUID) | Foto serah-terima tiap mushaf ke pesantren/madrasah. Relasi `infak_id` -> `infak_jinan(id)` (ON DELETE CASCADE). |
| 5 | `infak_jinan_santri` | **Ada** | **8** | `id` (UUID) | Data santri penerima manfaat mushaf. Relasi `infak_id` -> `infak_jinan(id)` (ON DELETE CASCADE). |
| 6 | `santri_hafalan_updates`| **Ada** | **7** | `id` (UUID) | Rekam jejak progres hafalan santri (surah, ayat, juz). Relasi `santri_id` -> `infak_jinan_santri(id)` (ON DELETE CASCADE). |
| 7 | `buss_distributions` | **Ada** | **0** | `id` (UUID) | Program BUSS Al-Qur'an (beasiswa bertingkat). Memiliki kolom array `photo_urls` bertipe `text[]`. |
| 8 | `yatim_distributions` | **TIDAK ADA** | **0** (Error PGRST205) | `id` (UUID) | **Temuan Kritis**: Tabel ini ada di `prisma/schema.prisma` dan SQL lokal, namun **belum pernah dibuat di Supabase**. Harus dibuat di MySQL. |
| 9 | `geber_masjid_distributions` | **Ada** | **1** | `id` (UUID) | Kegiatan bersih-bersih masjid (Mushola Al-Hikmah). Memiliki array `photo_urls` bertipe `text[]`. |
| 10 | `reports` | **Ada** | **1** | `id` (UUID) | Laporan penyaluran resmi (`laporan-1`, Pelatihan Desain Grafis). Memiliki array `gallery_urls` bertipe `text[]` dan `amount_idr` BIGINT. |
| 11 | `gallery_items` | **Ada** | **1** | `id` (UUID) | Dokumentasi galeri visual kegiatan (`Pelatihan Design Grafis 20 Anak Yatim`). |
| 12 | `themed_campaigns` | **Ada** | **1** | `id` (UUID) | Donasi tematik tanggap bencana (`Karhutla Kalimantan`). Memiliki `target_idr` & `collected_idr` BIGINT. |
| 13 | `infak_distributions` | **Ada** | **0** | `id` (UUID) | Tabel legacy single-tier untuk impor batch CSV mushaf Al-Qur'an. |
| 14 | `admin_users` | **Ada** | **0** | `user_id` (UUID) | Tabel peninggalan skema awal Supabase Auth. Tidak digunakan lagi karena autentikasi memakai custom HMAC JWT session. |

### Detail Data Produksi yang Wajib Dipindahkan (8 Baris Inti + Data Terkait)
- **8 Data Infak Jinan**:
  - Mushaf #1: Donatur Muhamad Firdaus (Dedikasi: Inayah Binti Kartoni, Madrasah Al-Huffadz 2 Gedongan).
  - Mushaf #2: Donatur Saefuddin Abdullah (Dedikasi: Asep Hasanudin Bin Saefuddin).
  - Mushaf #3: Hamba Allah (Dedikasi: Sobari Bin Taswan).
  - Mushaf #4: Khumaedah (Dedikasi: Kartoni Bin Rakmad).
  - Mushaf #5: Damiri (Dedikasi: Darsih Binti Casban).
  - Mushaf #6: Maesaroh (Dedikasi: Slamet Bin Umar).
  - Mushaf #7: Hamba Allah (Dedikasi: Moh Amin Bin Ruslan).
  - Mushaf #8: Hamba Allah (Dedikasi: Moh Amin Bin Ruslan).
- **8 Foto Dokumentasi Serah Terima** pada tabel `infak_jinan_photos` dengan URL Vercel Blob aktif.
- **8 Data Santri Binaan** pada tabel `infak_jinan_santri`.
- **7 Catatan Progres Hafalan** pada tabel `santri_hafalan_updates`.
- **1 Laporan Penyaluran** pada tabel `reports` (slug: `laporan-1`, Pelatihan Design Grafis Anak Yatim, Rp 10.000.000, 20 Penerima Manfaat).
- **1 Data Geber Masjid** (Mushola Al-Hikmah Bekasi).
- **1 Data Galeri Foto** (Pelatihan Design Grafis 20 Anak Yatim).
- **1 Data Donasi Tematik** (Karhutla Kalimantan, target Rp 100.000.000, terkumpul Rp 15.000.000).
- **2 Data Pengaturan Situs** (`bank_accounts` & `contact_info`).

---

## 3. ANALISIS PERBEDAAN SKEMA (DISCREPANCY AUDIT)

Perbandingan antara **Supabase Live**, **`prisma/schema.prisma`**, dan **`src/lib/db/postgres.ts`**:

| Fitur / Objek | Supabase Live | `prisma/schema.prisma` | `postgres.ts` (Lokal) | Analisis & Keputusan untuk MySQL |
|---|---|---|---|---|
| **Tabel `yatim_distributions`** | ❌ Tidak Ada (Error PGRST205) | ✅ Ada | ✅ Ada | **Wajib Dibuat di MySQL**. Modul Yatim Berdikari di admin saat ini fallback ke file JSON lokal karena Supabase tidak memiliki tabel ini. Migrasi ke MySQL akan mengaktifkan persistensi database nyata untuk modul ini. |
| **Tabel `admin_users`** | ✅ Ada (0 baris) | ❌ Tidak Ada | ❌ Tidak Ada | **Tidak Diperlukan**. Autentikasi admin Aksara tidak memakai Supabase Auth melainkan session cookie terenkripsi HMAC-SHA256 (`src/lib/auth.ts`) yang membaca kredensial terisolasi di server. |
| **Tabel `infak_distributions` vs `infak_jinan`** | Keduanya ada | Keduanya ada | Hanya `infak_jinan` | Keduanya tetap dipertahankan di skema Prisma MySQL. `infak_jinan` adalah tabel primer dua-tingkat (mushaf + santri + hafalan), sedangkan `infak_distributions` adalah penampung impor CSV single-tier legacy. |
| **Array `text[]` (`photo_urls`, `gallery_urls`)** | Native PostgreSQL array | Ditulis `String[] @default([])` | Native PostgreSQL array | **MySQL tidak mendukung tipe data array primitif**. Di Prisma MySQL, kolom-kolom ini dipetakan ke tipe `Json` dengan nilai bawaan array kosong `[]`. Layer `api.ts` dan `admin-api.ts` membaca/menulis `string[]` secara transparan. |
| **Kolom `JSONB` (`site_settings.value`)** | `jsonb` | `Json` | `jsonb` | Dipetakan langsung ke tipe `Json` pada MySQL. MySQL 5.7+ & 8.0 mendukung tipe data JSON biner asli secara native. |
| **Tipe Data UUID** | `uuid` (128-bit native) | `String @db.Uuid` | `uuid` (`uuid_generate_v4()`) | Dipetakan ke `VARCHAR(36)` atau `CHAR(36)` pada MySQL. String UUID yang sudah ada (`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`) dipertahankan 100% tanpa perubahan karakter. |
| **Kolom `amount_idr`, `target_idr`, `collected_idr`** | `bigint` | `BigInt` | `bigint` | Dipetakan ke `BigInt` (MySQL `BIGINT`). Aman menampung nominal rupiah hingga puluhan triliun. |
| **Foreign Keys & Cascade** | Foreign key dengan `ON DELETE CASCADE` | `@relation(..., onDelete: Cascade)` | Foreign key dengan `on delete cascade` | Didukung penuh oleh engine InnoDB MySQL. |

---

## 4. AUDIT FITUR KHUSUS POSTGRESQL PADA KODE

Ditemukan sejumlah query SQL mentah (*raw queries*) dan operator spesifik PostgreSQL di `src/lib/db/postgres.ts`, `src/lib/db/api.ts`, dan `src/lib/db/admin-api.ts`:

1. **Fungsi Agregasi JSON PostgreSQL**:
   - `json_agg(...)` dan `json_build_object(...)` pada `admin-api.ts` (digunakan untuk merakit data bertingkat `infak_jinan` -> `photos` -> `santri` -> `hafalan_updates`).
   - *Solusi MySQL*: Prisma query dengan `include: { photos: true, santri_list: { include: { hafalan_updates: true } } }` menggantikan seluruh query SQL kompleks tersebut secara bersih dan aman.
2. **Operator & Fungsi Array PostgreSQL**:
   - `array_to_json(...)`, `array_remove(...)`, `photo_urls text[] default '{}'`, `any($1)`.
   - *Solusi MySQL*: Prisma mengelola kolom bertipe `Json` dengan manipulasi JavaScript murni di sisi server, tanpa ketergantungan operator array DB.
3. **Format Tanggal PostgreSQL**:
   - `to_char(distributed_at, 'YYYY-MM-DD')`.
   - *Solusi MySQL*: Menggunakan Date object bawaan JavaScript (`.toISOString().split("T")[0]`) atau fungsi Prisma.
4. **Ekstensi & Fungsi UUID**:
   - `create extension if not exists "uuid-ossp"` dan `default uuid_generate_v4()`.
   - *Solusi MySQL*: Di MySQL, UUID digenerate di sisi aplikasi oleh Prisma (`@default(uuid())`) atau fungsi bawaan MySQL `UUID()`.
5. **Casting Tipe Data Postgres**:
   - `$1::boolean` dan `$1::text[]`.
   - *Solusi MySQL*: Dihapus total karena Prisma menangani parameter binding secara otomatis sesuai tipe data skema.

---

## 5. AUDIT LAPISAN AKSES DATABASE (*ACCESS LAYER AUDIT*)

Saat ini terdapat **32 file** yang mengimpor database layer:
- **7 Halaman Publik**: Mengimpor `{ db } from "@/lib/db/api"`.
- **6 Rute Admin API** (`src/app/api/admin/...`): Mengimpor `{ db } from "@/lib/db/admin-api"`.
- **Halaman Admin & Komponen**: Mengimpor tipe data TypeScript dari `@/lib/db/types`.

### Masalah Arsitektur Saat Ini
1. **Multi-Fallback yang Berbahaya**:
   Di dalam `api.ts` dan `admin-api.ts`, setiap kali ada query database, sistem mencoba:
   - Level 1: Prisma (Postgres)
   - Level 2: Direct pg query (Postgres)
   - Level 3: Supabase JS Client
   - Level 4: LocalStore (file JSON lokal)
   
   Jika Prisma mengalami kegagalan kecil (misal: timeout), sistem langsung jatuh (*fallback*) ke `localStore` dan menampilkan data kosong/mock tanpa memberikan error yang jelas ke admin.
2. **Kredensial Supabase Hardcoded**:
   Pada `src/lib/db/admin-client.ts` baris 7, URL Supabase di-hardcode ke `"https://soazxbajyhfdnouhbdvo.supabase.co"`.
3. **Dua Klien Supabase Terpisah**:
   `client.ts` (publik) dan `admin-client.ts` (service role) membebani bundle server Next.js.

### Target Arsitektur Baru (MySQL murni)
- `src/lib/db/prisma.ts`: Dikonfigurasi secara eksklusif untuk MySQL dengan manajemen koneksi pool yang aman untuk Hostinger.
- `src/lib/db/api.ts`: Menggunakan `prisma` sebagai satu-satunya eksekutor query publik. Fallback PostgreSQL, Supabase, dan localStore dihapus total. Jika database error, sistem melempar error resmi (*fail-fast*) agar tidak menyamarkan masalah koneksi.
- `src/lib/db/admin-api.ts`: Menggunakan `prisma` sebagai satu-satunya eksekutor CRUD admin. Seluruh raw query Postgres digantikan oleh Prisma Client methods (`findMany`, `findUnique`, `create`, `update`, `delete`, `upsert`, `transaction`).
- `src/lib/db/postgres.ts`, `src/lib/db/client.ts`, `src/lib/db/admin-client.ts`: Dinonaktifkan dan dihapus dari alur eksekusi aplikasi.

---

## 6. AUDIT PENYIMPANAN & MEDIA (*STORAGE & MEDIA AUDIT*)

Audit khusus pada `src/lib/storage.ts`:
1. **Media Provider**:
   - Aplikasi menggunakan **Vercel Blob** (`@vercel/blob`) jika variabel `BLOB_READ_WRITE_TOKEN` terisi.
   - Jika tidak terisi (lingkungan lokal), aplikasi menyimpan foto ke `public/uploads/` (terkompresi WebP ≤ 300KB via Sharp).
2. **Pemisahan Database vs Media**:
   - URL foto pada database (`https://4viey5j46zhcxap3.public.blob.vercel-storage.com/...`) adalah URL CDN publik yang berdiri sendiri.
   - **Migrasi database tidak mempengaruhi validitas URL foto**. Semua foto di Vercel Blob tetap aktif dan dapat dibuka langsung melalui browser maupun tag `<SafeImage />`.
3. **Pencatatan Ledger**:
   - Fungsi `commitUpload`, `deleteBlobFromStorage`, `getLedgerByHash`, dan `recordUploadLedger` pada `storage.ts` saat ini memiliki 4 layer fallback.
   - Pada migrasi ini, `storage.ts` akan direfaktor agar pencatatan status ledger (`upload_ledger`) menggunakan Prisma MySQL secara langsung.

---

## 7. AUDIT KESESUAIAN HOSTINGER BUSINESS SHARED HOSTING

1. **Dukungan Node.js**:
   - Hostinger Business Shared Hosting menyediakan fitur **Node.js Web App** (menggunakan Phusion Passenger / CloudLinux CageFS).
   - Versi Node.js yang didukung: Node.js 18.x, 20.x, dan 22.x (Cocok dengan Next.js 16).
2. **Dukungan MySQL**:
   - Hostinger menyediakan MySQL 8.0 / MariaDB 10.x yang dikelola via hPanel.
   - Protokol koneksi: TCP `localhost:3306` (atau 127.0.0.1).
3. **Batas Koneksi (*Connection Limit*)**:
   - Shared hosting memiliki kuota concurrent database connections (umumnya 30 s/d 50 koneksi per cPanel/hPanel account).
   - Konfigurasi Prisma pada Hostinger **wajib** menyertakan parameter `connection_limit=5` atau `connection_limit=10` pada `DATABASE_URL` untuk mencegah kehabisan koneksi (*connection exhaustion*).
4. **Metode Build Next.js**:
   - Mode build yang direkomendasikan adalah **Standalone Output** (`output: 'standalone'` pada `next.config.ts`).
   - Hasil build standalone mereduksi ukuran deployment dari ratusan MB menjadi hanya file yang dibutuhkan server, sangat efisien untuk shared hosting.
5. **Prisma Engine Binary**:
   - Pada Hostinger (Linux x86_64 glibc), Prisma Client memerlukan binary target `debian-openssl-3.0.x` atau `rhel-openssl-3.0.x`.
   - Konfigurasi generator Prisma akan disetel mencakup `binaryTargets = ["native", "debian-openssl-3.0.x", "rhel-openssl-3.0.x"]`.

---

## 8. KESIMPULAN FASE 1

1. Seluruh skema database dan data aktual di Supabase telah terpetakan secara lengkap.
2. Tidak ditemukan kendala yang menghalangi konversi skema dari PostgreSQL ke MySQL.
3. Seluruh 8 data mushaf, relasi santri binaan, laporan resmi, dan donasi tematik dipastikan aman dan siap dimigrasikan menggunakan skrip migrasi berorientasi transaksi.
4. Kode aplikasi dan skrip audit telah disiapkan tanpa ada perubahan destruktif pada database Supabase.
