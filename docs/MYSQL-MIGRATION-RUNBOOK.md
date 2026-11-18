# AKSARA — MYSQL MIGRATION RUNBOOK & OPERATIONAL GUIDE

> **Dokumen**: Panduan Operasional Eksekusi Migrasi Database ke Hostinger MySQL  
> **Aplikasi**: Web Portal & Backoffice Yayasan Sahabat Aksara Semesta  
> **Sasaran**: Administrator & Developer yang mengeksekusi migrasi  

---

## 1. DAFTAR PERSIAPAN (PREREQUISITES)

Sebelum mengeksekusi script migrasi data, pastikan hal-hal berikut telah siap:

1. **Akses Database MySQL Hostinger**:
   - Host: `localhost` (atau IP/domain remote database Hostinger jika dijalankan dari laptop).
   - Port: `3306`.
   - Nama Database: misal `u123456789_aksara`.
   - Username Database: misal `u123456789_admin`.
   - Password Database.
2. **Koneksi Supabase Sumber (Source)**:
   - `NEXT_PUBLIC_SUPABASE_URL` aktif di `.env.local`.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` atau `SUPABASE_SERVICE_ROLE_KEY` aktif di `.env.local`.
3. **Node.js & Package Manager**:
   - Node.js versi 18 atau 20+ terpasang di mesin eksekutor.
   - `pnpm` terpasang.

---

## 2. PENGATURAN ENVIRONMENT VARIABLE EKSEKUSI

Pada file `.env.local` di lingkungan lokal atau server migrasi:

```env
# 1. DATABASE TUJUAN (HOSTINGER MYSQL)
# Format: mysql://<username>:<password>@<host>:3306/<database>?connection_limit=10&connect_timeout=10
DATABASE_URL="mysql://u123456789_admin:PasswordKuatAnda@localhost:3306/u123456789_aksara?connection_limit=10&connect_timeout=10"

# 2. DATABASE SUMBER (SUPABASE)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."
# Opsional jika RLS bypass dibutuhkan:
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."

# 3. KREDENSIAL ADMIN AKSARA
ADMIN_DEFAULT_EMAIL="admin@gmail.com"
ADMIN_DEFAULT_PASSWORD="PasswordAdminAnda"
ADMIN_SESSION_SECRET="kunci-rahasia-minimal-32-karakter-keamanan-tinggi"

# 4. STORAGE VERCEL BLOB
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

---

## 3. LANGKAH-LANGKAH EKSEKUSI MIGRASI

### Langkah 3.1: Sinkronisasi Skema ke MySQL (Fase 2)
Setelah persetujuan, jalankan perintah Prisma untuk membuat seluruh tabel di MySQL:

```bash
# Generate prisma client sesuai skema MySQL
npx prisma generate

# Dorong skema model ke database MySQL Hostinger
npx prisma db push
```

*Verifikasi*:
Buka phpMyAdmin di hPanel Hostinger, pastikan seluruh 13 tabel telah terbuat dengan engine InnoDB dan collation `utf8mb4_unicode_ci`.

---

### Langkah 3.2: Eksekusi Uji Coba Migrasi Data (*Dry-Run*) (Fase 3)
Jalankan skrip migrasi dengan flag `--dry-run`:

```bash
# Menjalankan pembacaan data tanpa menulis ke MySQL
pnpm tsx scripts/migrate-supabase-to-mysql.ts --dry-run
```

*Harapan*:
Script akan menampilkan daftar seluruh data yang terbaca dari Supabase, memvalidasi format data dan relasi foreign key, lalu menampilkan laporan sukses tanpa mengubah database.

---

### Langkah 3.3: Eksekusi Migrasi Data Nyata (Fase 3)
Jalankan transfer data penuh:

```bash
pnpm tsx scripts/migrate-supabase-to-mysql.ts
```

Output log akan menampilkan:
```
[1/13] Memindahkan site_settings (2 baris)... SELESAI
[2/13] Memindahkan upload_ledger (0 baris)... SELESAI
[3/13] Memindahkan infak_jinan (8 baris)... SELESAI
[4/13] Memindahkan infak_jinan_photos (8 baris)... SELESAI
[5/13] Memindahkan infak_jinan_santri (8 baris)... SELESAI
[6/13] Memindahkan santri_hafalan_updates (7 baris)... SELESAI
[7/13] Memindahkan geber_masjid_distributions (1 baris)... SELESAI
[8/13] Memindahkan reports (1 baris)... SELESAI
[9/13] Memindahkan gallery_items (1 baris)... SELESAI
[10/13] Memindahkan themed_campaigns (1 baris)... SELESAI
[11/13] Memindahkan buss_distributions (0 baris)... SELESAI
[12/13] Memindahkan yatim_distributions (0 baris)... SELESAI
[13/13] Memindahkan infak_distributions (0 baris)... SELESAI

==================================================
LAPORAN VERIFIKASI MIGRASI DATABASE:
- Total Baris Sumber: 29
- Total Baris Tujuan: 29
- Baris Gagal: 0
- Status Integritas Relasi: 100% VALID
==================================================
```

---

### Langkah 3.4: Verifikasi Integritas Data
Jalankan skrip verifikasi otomatis:

```bash
pnpm tsx scripts/verify-mysql-integrity.ts
```

Script ini melakukan:
1. Pengecekan row count setiap tabel di MySQL.
2. Pengecekan *orphan foreign keys* (memastikan setiap `infak_id` dan `santri_id` memiliki parent yang sah).
3. Pengecekan bahwa seluruh URL foto Vercel Blob masih utuh.

---

### Langkah 3.5: Pengujian Aplikasi (*Smoke Testing*)
1. Jalankan `pnpm build && pnpm start`.
2. Buka `http://localhost:3000`:
   - Cek statistik beranda (angka mushaf, masjid, dll. terbaca dari MySQL).
3. Buka `http://localhost:3000/data-sebaran`:
   - Tab Infak Jinan: 8 data mushaf tampil lengkap, klik salah satu untuk melihat santri dan progres hafalan.
   - Tab Geber Masjid: 1 data masjid tampil.
4. Buka `http://localhost:3000/laporan`:
   - 1 laporan tampil dengan foto cover dan summary. Klik untuk melihat isi laporan lengkap dan arsip visual.
5. Buka `http://localhost:3000/donasi`:
   - Rekening BCA resmi dan kampanye bencana Karhutla tampil.
6. Buka `http://localhost:3000/admin`:
   - Login dengan `ADMIN_DEFAULT_EMAIL` dan `ADMIN_DEFAULT_PASSWORD`.
   - Lakukan tes penambahan/pengeditan data pada modul Infak Jinan atau Laporan Penyaluran untuk memastikan operasi CRUD di MySQL bekerja 100%.

---

## 4. PANDUAN PEMECAHAN MASALAH (*TROUBLESHOOTING*)

### Kasus 1: Error `ER_CON_COUNT_ERROR: Too many connections` di Hostinger
- **Penyebab**: Batas koneksi MySQL pada paket shared hosting terlampaui karena instansiasi Prisma Client berulang.
- **Solusi**: 
  1. Pastikan `prisma.ts` menggunakan pola singleton (`globalThis.prisma`).
  2. Tambahkan parameter `?connection_limit=5` pada string `DATABASE_URL`.

### Kasus 2: Error `P2003: Foreign key constraint failed` saat Migrasi Data
- **Penyebab**: Urutan insert salah (mencoba meng-insert tabel anak sebelum tabel induk selesai).
- **Solusi**: Ikuti urutan dependensi yang telah dirancang di Fase 3 (`infak_jinan` -> `photos` & `santri` -> `hafalan_updates`).

### Kasus 3: Data Array Foto (`photo_urls` / `gallery_urls`) Tidak Muncul di Frontend
- **Penyebab**: Nilai tersimpan sebagai string literal `"[...]"` alih-alih parsed JSON array.
- **Solusi**: Helper `normalizeStringArray(val)` pada layer `api.ts` secara otomatis melakukan `Array.isArray(val) ? val : JSON.parse(val || "[]")` sebelum dikirimkan ke komponen.

### Kasus 4: Error `Access denied for user ... to database ...`
- **Penyebab**: User database di hPanel Hostinger belum diberikan hak akses (*privileges*) ke nama database yang bersangkutan.
- **Solusi**: Buka hPanel -> Databases -> MySQL Databases -> Edit User Privileges -> Centang **ALL PRIVILEGES**.
