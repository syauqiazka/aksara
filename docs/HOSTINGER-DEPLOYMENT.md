# PANDUAN DEPLOYMENT AKSARA KE HOSTINGER (NODE.JS & MYSQL)

Dokumen ini memandu proses deployment aplikasi **Yayasan Sahabat Aksara** ke hosting **Hostinger** menggunakan database **MySQL Hostinger** dan **Prisma ORM**.

---

## 1. PRASYARAT & SPESIFIKASI HOSTING

- **Paket Hostinger:** Hostinger Business Shared Hosting, Cloud Hosting, atau VPS dengan fitur **Node.js Web App** (cPanel / hPanel).
- **Versi Node.js:** Node.js v20.x LTS atau v22.x LTS.
- **Database Engine:** MySQL 8.0+ atau MariaDB 10.5+ dengan storage engine **InnoDB**.
- **Character Set / Collation:** `utf8mb4` / `utf8mb4_unicode_ci`.

---

## 2. LANGKAH 1 — SETUP DATABASE MYSQL DI HOSTINGER

1. Masuk ke **hPanel / cPanel** Hostinger Anda.
2. Buka menu **Databases** -> **MySQL Databases**.
3. Buat database baru:
   - **Database Name:** contoh `u123456789_aksaradb`
   - **Database Username:** contoh `u123456789_aksara`
   - **Password:** Buat kata sandi yang kuat dan aman (hindari karakter simbol yang memerlukan URL-encode seperti `@` atau `/`).
4. Catat host database:
   - Jika Node.js berjalan di akun hosting yang sama: host biasanya `localhost` atau `127.0.0.1:3306`.
   - Jika diakses dari luar Hostinger (remote MySQL): gunakan IP server Hostinger atau host domain yang tertera di hPanel, dan pastikan IP lokal Anda telah diizinkan di menu **Remote MySQL**.

---

## 3. LANGKAH 2 — INISIALISASI STRUKTUR TABEL (SKEMA MYSQL)

Ada dua metode yang dapat dipilih:

### Opsi A: Lewat phpMyAdmin (Paling Mudah & Cepat)
1. Buka **phpMyAdmin** dari menu Database Hostinger.
2. Pilih database Anda (`u123456789_aksaradb`).
3. Klik tab **Import** (atau **SQL**).
4. Unggah atau salin isi file:
   [`scripts/mysql-schema.sql`](file:///e:/syauqi/web-yayasan/scripts/mysql-schema.sql)
5. Klik **Go** / **Kirim**. Seluruh 14 tabel, foreign key cascade, dan indeks akan dibuat secara otomatis.

### Opsi B: Lewat Terminal / Prisma CLI
Jika Anda memiliki akses SSH di Hostinger:
```bash
export DATABASE_URL="mysql://u123456789_aksara:PasswordKuatAnda@localhost:3306/u123456789_aksaradb?connection_limit=10&connect_timeout=10"
npx prisma db push
```

---

## 4. LANGKAH 3 — MIGRASI DATA DARI SUPABASE KE MYSQL

Jalankan skrip migrasi otomatis dari komputer lokal Anda (atau server yang memiliki akses internet ke Supabase dan Hostinger):

1. Pastikan file `.env.local` memiliki kredensial Supabase sumber:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://soazxbajyhfdnouhbdvo.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
   ```
2. Jalankan simulasi terlebih dahulu (*Dry-Run*):
   ```bash
   node scripts/migrate-supabase-to-mysql.mjs --dry-run
   ```
3. Jika dry-run berhasil tanpa error, jalankan transfer data nyata dengan menentukan target MySQL:
   ```bash
   # Di Windows PowerShell:
   $env:DATABASE_URL="mysql://u123456789_aksara:PasswordKuatAnda@<HOST_HOSTINGER>:3306/u123456789_aksaradb?connection_limit=10&connect_timeout=10"
   node scripts/migrate-supabase-to-mysql.mjs

   # Di Linux / macOS:
   DATABASE_URL="mysql://u123456789_aksara:PasswordKuatAnda@<HOST_HOSTINGER>:3306/u123456789_aksaradb?connection_limit=10&connect_timeout=10" node scripts/migrate-supabase-to-mysql.mjs
   ```
4. Periksa ringkasan hasil migrasi:
   - Seluruh 37 baris akan tertransfer dengan ID, UUID, foto, dan relasi santri yang utuh.

---

## 5. LANGKAH 4 — KONFIGURASI ENVIRONMENT VARIABLE DI HOSTINGER

Di menu **Node.js Web App** -> **Environment Variables** (atau file `.env` di root hosting), tambahkan:

```env
# Database Hostinger MySQL
DATABASE_URL="mysql://u123456789_aksara:PasswordKuatAnda@localhost:3306/u123456789_aksaradb?connection_limit=10&connect_timeout=10"

# Domain & URL Resmi
NEXT_PUBLIC_SITE_URL="https://sahabataksara.id"
NEXTAUTH_URL="https://sahabataksara.id"
ALLOWED_ORIGINS="sahabataksara.id,www.sahabataksara.id"

# Autentikasi Pengurus Admin
ADMIN_DEFAULT_EMAIL="admin@sahabataksara.id"
ADMIN_DEFAULT_PASSWORD="GantiDenganPasswordKuatAnda123"
ADMIN_SESSION_SECRET="string-acak-rahasia-minimal-32-karakter-keamanan-2026"

# Penyimpanan Foto (Media)
# Kosongkan BLOB_READ_WRITE_TOKEN agar foto disimpan lokal di folder public/uploads/
# Atau isi token Vercel Blob jika Anda tetap ingin menggunakan CDN cloud Vercel Blob
BLOB_READ_WRITE_TOKEN=
```

---

## 6. LANGKAH 5 — BUILD DAN MENJALANKAN APLIKASI DI HOSTINGER

1. Unggah kode ke direktori aplikasi Hostinger (misal via Git Deployment atau ZIP File Manager).
2. Di terminal SSH Hostinger atau console Node.js App:
   ```bash
   npm install --production=false
   npx prisma generate
   npm run build
   ```
3. Set **Startup File / Script** di panel Node.js Hostinger:
   - Jika menggunakan npm script: `npm start`
   - Port: Default port dari Hostinger (biasanya dibaca otomatis via `process.env.PORT`).
4. Klik **Start Application** / **Restart**.

---

## 7. CHECKLIST PASCA-DEPLOYMENT (VERIFIKASI LIVE)

- [ ] Buka beranda publik `https://sahabataksara.id` -> Seluruh banner, program, dan statistik beranda muncul normal.
- [ ] Buka `/data-sebaran` -> Data 8 Mushaf Infak Jinan dan Geber Masjid muncul lengkap dengan pencarian dan filter wilayah.
- [ ] Buka detail salah satu mushaf `/data-sebaran/infak-jinan/<id>` -> Data santri dan riwayat hafalan Al-Qur'an tampil benar.
- [ ] Buka `/laporan` -> Laporan penyaluran resmi dapat dibuka beserta galeri foto.
- [ ] Buka `/admin/login` -> Masuk menggunakan kredensial admin -> Dashboard statistik admin tampil.
- [ ] Tes Buat / Edit salah satu data di Admin -> Data berhasil tersimpan langsung ke MySQL Hostinger.
- [ ] Periksa database Hostinger via phpMyAdmin -> Baris baru tersimpan di tabel terkait dengan status `published`/`draft`.
