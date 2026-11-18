# AKSARA — HOSTINGER BUSINESS SHARED HOSTING DEPLOYMENT & COMPATIBILITY REPORT

> **Dokumen**: Laporan Kompatibilitas & Panduan Deployment Hostinger  
> **Aplikasi**: Web Portal & Backoffice Yayasan Sahabat Aksara Semesta  
> **Target Hosting**: Hostinger Business Shared Hosting (Node.js Web App)  
> **Framework**: Next.js 16 (App Router) + Prisma ORM 6  

---

## 1. ARSITEKTUR RUNTIME HOSTINGER BUSINESS SHARED HOSTING

Hostinger Business Shared Hosting mengoperasikan lingkungan Linux berbasis **CloudLinux OS** dengan isolasi **CageFS** dan manajemen proses Node.js melalui **Phusion Passenger** atau **hPanel Node.js Application Manager**.

### Spesifikasi Runtime Hostinger
- **Arsitektur CPU**: x86_64 (Intel Xeon / AMD EPYC).
- **Sistem Operasi**: CloudLinux (kompatibel RHEL / CentOS / AlmaLinux).
- **Engine Database**: MySQL 8.0 atau MariaDB 10.6+ terkelola.
- **Port Database**: `3306` via TCP socket `localhost` / `127.0.0.1`.
- **Node.js Selector**: Tersedia versi Node.js 18.x, 20.x (LTS direkomendasikan), dan 22.x.
- **Package Manager**: `npm` dan `pnpm` (dapat dijalankan via SSH terminal).

---

## 2. ANALISIS KOMPATIBILITAS TEKNIS

### 2.1. Next.js 16 (App Router) & Standalone Build
Next.js 16 membutuhkan Node.js versi 18.18+ atau 20+.
Pada shared hosting, ukuran disk dan memori proses terbatas (umumnya memori per proses dibatasi 1 GB - 1.5 GB). Oleh karena itu:
- **Wajib menggunakan mode Standalone**:
  Menambahkan `output: "standalone"` pada `next.config.ts`.
- **Keuntungan Standalone**:
  Next.js akan membuat folder `.next/standalone` yang hanya memaketkan berkas `.js` yang benar-benar dipakai di runtime, tanpa membutuhkan folder `node_modules` raksasa (500MB+) di server hosting.
- **Ukuran Deployment**:
  Berkas aplikasi siap saji menjadi di bawah 80 MB, menghemat kuota inode dan disk hosting secara signifikan.

### 2.2. Prisma ORM 6 Binary Targets
Prisma menggunakan engine query biner native berbasis C++ / Rust. Pada mesin pengembang lokal (Windows/Mac), engine yang di-generate adalah Windows (`windows`) atau Darwin (`darwin`).
Saat dideploy ke Hostinger Linux, Prisma membutuhkan binary engine Linux:
- Ditambahkan pada `prisma/schema.prisma`:
  ```prisma
  generator client {
    provider      = "prisma-client-js"
    binaryTargets = ["native", "debian-openssl-3.0.x", "rhel-openssl-3.0.x"]
  }
  ```
  Ini memastikan Prisma Client dapat berjalan tanpa kendala error `Prisma Client could not locate the Query Engine for platform ...` di Hostinger.

### 2.3. Batas Koneksi Database MySQL (*Connection Limits*)
Pada Hostinger Business Shared Hosting:
- MySQL membatasi jumlah *concurrent connections* per akun (biasanya antara 30 hingga 50 koneksi simultan).
- Jika Next.js membuat connection pool default yang besar, server dapat terkena error `Too many connections` atau `Connection pool timeout`.
- **Solusi Teruji**:
  Setel parameter koneksi Prisma pada `DATABASE_URL`:
  ```
  mysql://<user>:<password>@localhost:3306/<database>?connection_limit=10&connect_timeout=10&pool_timeout=10
  ```
  Dan pastikan instansiasi Prisma di `src/lib/db/prisma.ts` menggunakan pola singleton `globalThis.prisma`.

### 2.4. File Upload & Storage di Hostinger
Aplikasi Aksara memiliki dua opsi penyimpanan foto:
1. **Opsi Utama (Cloud - Vercel Blob)**:
   Jika variabel `BLOB_READ_WRITE_TOKEN` diisi di hPanel, foto diunggah ke Vercel Blob CDN. Ini adalah opsi terbaik karena tidak membebani kapasitas disk dan bandwidth shared hosting Hostinger.
2. **Opsi Lokal (Hostinger Local Disk)**:
   Jika `BLOB_READ_WRITE_TOKEN` kosong, sistem otomatis menyimpan foto ke direktori `public/uploads/`.
   - Pada Hostinger, pastikan direktori `public/uploads` memiliki hak akses tulis: `chmod 755 public/uploads`.
   - File tersimpan dalam format WebP terkompresi (target ≤ 300KB) yang telah diproses oleh Sharp.

---

## 3. PANDUAN LANGKAH DEPLOYMENT KE HOSTINGER

### Langkah 1: Buat Database MySQL di hPanel
1. Masuk ke **hPanel Hostinger** -> Menu **Databases** -> **MySQL Databases**.
2. Masukkan nama database baru, misal: `aksara_db`.
3. Masukkan username baru, misal: `aksara_user`.
4. Masukkan password kuat (catat password ini).
5. Klik **Create**.
6. Nama database lengkap dan username lengkap akan berformat: `u123456789_aksara_db` dan `u123456789_aksara_user`.

### Langkah 2: Buat Node.js Web App di hPanel
1. Masuk ke menu **Websites** -> Klik domain/subdomain yang dituju.
2. Cari menu **Node.js**.
3. Klik **Create Application**:
   - **Node.js version**: Pilih `20.x` (LTS) atau `22.x`.
   - **Application mode**: `Production`.
   - **Application root**: `public_html/aksara` (atau direktori yang ditentukan).
   - **Application startup file**: `server.js`.
4. Klik **Create**.

### Langkah 3: Setup Konfigurasi Build Standalone
Pada `next.config.ts`, pastikan baris ini terpasang:
```ts
const nextConfig: NextConfig = {
  output: "standalone",
  // ... konfigurasi lainnya
};
```

Jalankan build di lokal:
```bash
pnpm build
```
Hasil build akan berada di `.next/standalone`.

### Langkah 4: Unggah Berkas ke Hostinger
Unggah file-file berikut ke folder root aplikasi di Hostinger (`public_html/aksara`):
1. Seluruh isi dari `.next/standalone/` (termasuk `server.js` dan subfolder `src/app`).
2. Folder `.next/static/` disalin ke `.next/standalone/.next/static/` (wajib agar CSS/JS client terlayani).
3. Folder `public/` disalin ke `.next/standalone/public/`.
4. File `.env.production` (atau buat `.env` di folder server) yang berisi kredensial live.

### Langkah 5: Konfigurasi Environment Variables di Hostinger
Tambahkan variabel berikut pada file `.env` di root server:
```env
NODE_ENV=production
PORT=3000

# DATABASE MYSQL HOSTINGER
DATABASE_URL="mysql://u123456789_aksara_user:PasswordAnda@localhost:3306/u123456789_aksara_db?connection_limit=10&connect_timeout=10"

# KREDENSIAL ADMIN
ADMIN_DEFAULT_EMAIL="admin@sahabataksara.id"
ADMIN_DEFAULT_PASSWORD="PasswordAdminAman"
ADMIN_SESSION_SECRET="kunci-rahasia-minimal-32-karakter-keamanan-tinggi-aksara"

# STORAGE FOTO
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# URL SITUS
NEXT_PUBLIC_SITE_URL="https://domainanda.com"
```

### Langkah 6: Jalankan Migrasi Skema di Database Hostinger
Buka SSH terminal di Hostinger atau jalankan remote migrasi dari laptop pengembang yang diarahkan ke database MySQL Hostinger:
```bash
npx prisma db push
```
Seluruh 13 tabel akan terpasang di MySQL Hostinger.

### Langkah 7: Restart Node.js Application di hPanel
1. Buka menu **Node.js** di hPanel Hostinger.
2. Klik tombol **Restart Application**.
3. Buka domain di browser: situs Aksara kini berjalan live 100% menggunakan Hostinger MySQL dan Node.js Web App!
