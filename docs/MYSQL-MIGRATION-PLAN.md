# AKSARA — DATABASE MIGRATION STRATEGY & PHASED EXECUTION PLAN

> **Dokumen**: Rencana Strategis & Urutan Eksekusi Migrasi Database ke Hostinger MySQL  
> **Aplikasi**: Web Portal & Backoffice Yayasan Sahabat Aksara Semesta  
> **Status**: Disetujui untuk Fase 1 (Audit & Perencanaan) — Menunggu Konfirmasi untuk Fase 2  

---

## 1. PRINSIP UTAMA & BATASAN KEAMANAN (*SAFETY BOUNDARIES*)

1. **Prinsip Non-Destruktif**:
   Database Supabase tidak boleh dihapus, di-truncate, atau diubah datanya selama proses migrasi. Supabase tetap berfungsi sebagai *immutable backup* dan titik pembanding (*benchmark*).
2. **Kemandirian Database (Single-Engine Focus)**:
   Setelah migrasi selesai, Hostinger MySQL melalui Prisma Client menjadi **satu-satunya engine database**. Tidak boleh ada dual-write atau fallback diam-diam ke Supabase.
3. **Integritas Referensial**:
   Seluruh relasi foreign key (`infak_id`, `santri_id`) wajib dimigrasikan secara terurut: data tabel induk (*parent*) selalu di-insert sebelum tabel anak (*child*).
4. **Isolasi Rahasia & Kredensial**:
   URL koneksi MySQL (`DATABASE_URL`) disimpan eksklusif pada file `.env.local` / Environment Variable server Hostinger, tanpa pernah dikomit ke Git.
5. **Perlindungan Media & Aset**:
   Penyimpanan Vercel Blob tidak diubah. URL foto yang ada tetap aktif dan tidak terpengaruh oleh perpindahan engine database.

---

## 2. PETA TAHAPAN EKSEKUSI (PHASED EXECUTION MATRIX)

```
[FASE 1: Audit & Persiapan] ──▶ [FASE 2: Skema MySQL] ──▶ [FASE 3: Migrasi Data & Verifikasi]
        (SELESAI)                   (Menunggu Persetujuan)         (Script Non-Destruktif)
                                                                             │
[FASE 7: Verifikasi & Test] ◀── [FASE 6: Security] ◀── [FASE 4-5: Refaktor Kode & Storage]
            │
            ▼
[FASE 8: Deployment Hostinger]
```

---

## 3. RINCIAN SETIAP FASE

### Fase 1: Audit & Persiapan (SELESAI)
- Memetakan 14 tabel database (13 tabel skema + 1 tabel auth legacy).
- Menemukan bahwa tabel `yatim_distributions` belum ada di Supabase, dan merancangnya agar terpasang di MySQL.
- Menemukan dan memetakan 8 data mushaf, 8 santri, 7 progres hafalan, 1 laporan, 1 geber masjid, 1 galeri, 1 kampanye tematik, dan 2 pengaturan bank/kontak.
- Menghasilkan 5 dokumen panduan dan spesifikasi lengkap di folder `docs/`.

### Fase 2: Konversi Skema Prisma & MySQL (Menunggu Persetujuan)
- Mengubah `datasource db.provider` dari `"postgresql"` menjadi `"mysql"`.
- Menerapkan tipe data MySQL:
  - UUID -> `CHAR(36)`
  - Array String (`text[]`) -> `Json`
  - JSONB -> `Json`
  - BIGINT -> `BigInt`
  - DECIMAL -> `Decimal(10, 8)`
- Menghasilkan Prisma Migration SQL untuk MySQL (`npx prisma migrate dev` / `prisma db push`).
- Menjalankan `npx prisma generate` untuk memperbarui tipe TypeScript Prisma Client.

### Fase 3: Perkakas Migrasi Data (*Data Migration Tool*)
- Membuat skrip migrasi berorientasi transaksi: `scripts/migrate-supabase-to-mysql.ts`.
- Skrip membaca seluruh baris dari Supabase (sumber), lalu menyimpannya ke MySQL (tujuan) dengan urutan dependensi ketat:
  1. `site_settings`
  2. `upload_ledger`
  3. `infak_jinan` (Parent)
  4. `infak_jinan_photos` (Child dari `infak_jinan`)
  5. `infak_jinan_santri` (Child dari `infak_jinan`)
  6. `santri_hafalan_updates` (Child dari `infak_jinan_santri`)
  7. `geber_masjid_distributions`
  8. `reports`
  9. `gallery_items`
  10. `themed_campaigns`
  11. `buss_distributions`
  12. `yatim_distributions`
  13. `infak_distributions`
- Menghasilkan laporan pencocokan baris (*row count verification*):
  - `Source Count === Destination Count`
  - Validasi ketepatan foreign key (tidak ada *orphan record*).
  - Mode uji coba aman (`--dry-run`).

### Fase 4: Refaktorisasi Kode Database (*Clean Code & Error Handling*)
- **`src/lib/db/prisma.ts`**:
  Konfigurasi Prisma Client untuk MySQL dengan connection pool terkelola (`connection_limit=10`).
- **`src/lib/db/api.ts`**:
  Menghilangkan fallback PostgreSQL murni, Supabase, dan localStore. Seluruh query publik membaca langsung dari Prisma Client. Melempar error resmi jika database tidak dapat dijangkau.
- **`src/lib/db/admin-api.ts`**:
  Mengganti seluruh raw query PostgreSQL (`json_agg`, `json_build_object`, `$1::boolean`, `to_char`) dengan query murni Prisma (`findMany`, `create`, `update`, `transaction`).
- **Penonaktifan Berkas Usang**:
  `postgres.ts`, `client.ts`, dan `admin-client.ts` dinonaktifkan secara aman.
- Penyesuaian serialisasi/deserialisasi kolom array (`photo_urls` dan `gallery_urls`) agar komponen antarmuka publik dan form admin tetap menerima dan mengirimkan `string[]` tanpa perlu refaktor UI.

### Fase 5: Penyesuaian Penyimpanan & Media (*Storage Alignment*)
- Refaktor `src/lib/storage.ts`:
  Pencatatan ledger upload (`upload_ledger`) dialihkan ke Prisma MySQL secara eksklusif.
- Verifikasi bahwa fungsi upload foto admin, rollback upload, dan commit upload tetap berjalan lancar tanpa error.

### Fase 6: Keamanan & Sanitasi (*Security Hardening*)
- Menghapus URL Supabase hardcoded (`soazxbajyhfdnouhbdvo.supabase.co`).
- Memastikan `DATABASE_URL` hanya dapat diakses pada runtime server (`server-only`).
- Memastikan kredensial admin (`ADMIN_DEFAULT_EMAIL`, `ADMIN_DEFAULT_PASSWORD`, `ADMIN_SESSION_SECRET`) tetap terlindungi.

### Fase 7: Pengujian Menyeluruh (*End-to-End Verification*)
- Menjalankan `pnpm tsc --noEmit` untuk memastikan 100% type-safety.
- Menjalankan `pnpm lint` untuk memvalidasi standar kode dan aksesibilitas.
- Menjalankan `pnpm build` untuk memverifikasi proses build produksi Next.js.
- Pengujian fungsional modul:
  1. Login Admin (/admin/login).
  2. Modul Infak Jinan (Melihat, mengedit, menambah progres hafalan santri).
  3. Modul Geber Masjid.
  4. Modul Laporan Penyaluran (termasuk verifikasi render foto sampul & arsip visual).
  5. Modul Galeri & Donasi Tematik.
  6. Pengaturan rekening bank & narahubung.
  7. Halaman publik (Beranda, Data Sebaran Peta, Laporan, Dokumentasi, Donasi).

### Fase 8: Deployment ke Hostinger Shared Hosting
- Mengonfigurasi Node.js Web App di hPanel Hostinger.
- Menyiapkan environment variable di hPanel.
- Membangun aplikasi dengan Next.js Standalone mode.
- Uji coba live di domain/subdomain Hostinger.

---

## 4. MATRIKS RISIKO & MITIGASI

| Skenario Risiko | Dampak | Probabilitas | Strategi Mitigasi Teruji |
|---|---|---|---|
| **Kehabisan Koneksi MySQL (*Connection Exhaustion*) di Hostinger** | Aplikasi menampilkan error 500 koneksi database | Sedang | Batasi ukuran pool Prisma via URL query parameter: `?connection_limit=5&connect_timeout=10`. Pakai pola singleton Prisma Client (`globalThis.prisma`). |
| **Data Array JSON Rusak Saat Konversi** | Galeri foto atau foto geber tidak muncul di UI | Rendah | Konversi dilakukan dengan `JSON.stringify(array)` saat insert dan validasi `Array.isArray(parsed)` saat pembacaan di layer `api.ts`. |
| **Foreign Key Error Saat Migrasi** | Script gagal meng-insert santri atau hafalan | Rendah | Mengurutkan migrasi data dari tabel induk (`infak_jinan` -> `infak_jinan_santri` -> `santri_hafalan_updates`) di dalam satu transaksi terisolasi. |
| **Perbedaan Timezone Tanggal** | Tanggal penyaluran bergeser +/- 1 hari | Sedang | Kolom tanggal bertipe `DATE` disimpan dan dibaca secara spesifik menggunakan format ISO YYYY-MM-DD murni tanpa konversi waktu lokal browser/server. |
| **Kegagalan Deployment di Hostinger** | Situs tidak dapat dijalankan | Rendah | Menggunakan mode `output: 'standalone'` Next.js yang memaketkan runtime mandiri teruji di CloudLinux / Passenger. |

---

## 5. STRATEGI ROLLBACK CEPAT (*DISASTER RECOVERY*)

Jika pada tahap uji coba di MySQL ditemukan anomali kritis:
1. **Database Supabase 100% Utuh**: Karena migrasi hanya melakukan operasi baca (`SELECT`) terhadap Supabase, data asli di Supabase tidak mengalami modifikasi sedikit pun.
2. **Rollback Variabel**: Cukup kembalikan nilai `DATABASE_URL` atau branch Git ke commit sebelum migrasi, aplikasi langsung kembali berjalan normal di Supabase dalam hitungan detik.
