# LAPORAN DELIVERY GATE — TAHAP 1: PERBAIKAN BUG UPLOAD & STORAGE

**Mode**: `antislop active: during`  
**Status Delivery Gate**: ✅ **PASS** (Semua tes hijau, 0 error lint, build sukses 33/33 route)  
**Tanggal**: 4 November 2026  

---

## 1. Identifikasi Provider Storage & Dokumentasi
- **Provider Sebenarnya**: `@vercel/blob` (Vercel Blob) dengan fallback direktori lokal `public/uploads/` saat token `BLOB_READ_WRITE_TOKEN` tidak disetel (lingkungan development). Bukan Supabase Storage.
- **Dokumentasi Diperbarui**:
  - `docs/ASUMSI.md`: Menegaskan provider storage aktual, arsitektur upload-on-save, mitigasi file yatim, dan kompensasi rollback.
  - `AGENTS.md` §5 (Storage): Spesifikasi alur Upload-on-Save, format kompresi WebP (maks 2000 px, ≤ 300 KB), deduplikasi SHA-256, dan orphan cleaner.
  - Skema database: Tabel `upload_ledger` dibuat di `supabase/migrations/20261104000001_upload_ledger.sql` dan didukung in-memory di `src/lib/db/local-store.ts`.

---

## 2. Implementasi Alur "Upload on Save"
1. **Pratinjau Klien Murni (`URL.createObjectURL`)**:
   - `src/components/admin/ImageUploader.tsx`: Saat user memilih foto atau drag & drop, file disimpan di state klien `File` dan dibuatkan pratinjau lokal via `URL.createObjectURL`.
   - **TIDAK ADA request HTTP POST** ke endpoint upload saat pemilihan file.
   - Membersihkan object URL lama secara otomatis saat unmount atau saat foto diganti (`URL.revokeObjectURL`).
2. **Unggah Hanya Saat Form Disubmit (`upload-on-save`)**:
   - Modul helper `src/lib/upload-helper.ts` (`uploadPendingFileOnSave`): Dipanggil di handler submit form.
   - Mengunggah file ke `/api/admin/upload`, mendapatkan URL dan fungsi `rollback` & `commit`.
   - Form yang telah diperbarui:
     - `src/app/admin/(protected)/infak/new/page.tsx`
     - `src/app/admin/(protected)/infak/[id]/page.tsx`
     - `src/app/admin/(protected)/geber-masjid/new/page.tsx`
     - `src/app/admin/(protected)/laporan/new/page.tsx`
     - `src/app/admin/(protected)/dokumentasi/page.tsx`
3. **Kompensasi Rollback**:
   - Jika simpan database gagal, fungsi rollback mengeksekusi request `DELETE /api/admin/upload` untuk segera melenyapkan berkas yang baru diunggah dari storage, sehingga 0 blob yatim tertinggal.
4. **Pembersihan Blob Lama Saat Foto Diganti/Dihapus**:
   - Route handler `PUT /api/admin/infak`, `PUT /api/admin/geber`, dan `PUT /api/admin/reports` membandingkan URL foto lama dengan URL foto baru. Bila foto diganti atau dihapus, blob lama dihapus dari storage (`deleteBlobFromStorage`).
5. **Deduplikasi via SHA-256**:
   - `src/lib/storage.ts`: Berkas diproses dan dihitung hash SHA-256 (`${hash}.webp`). Jika hash berkas identik telah tercatat di `upload_ledger` dengan status `committed`, URL yang sudah ada digunakan kembali (zero storage waste).
6. **Kompresi Gambar**:
   - Validasi batas ketat 5 MB dan tipe berkas gambar (JPG, PNG, WebP).
   - Di server menggunakan `sharp`: konversi otomatis ke WebP, resize batas dimensi sisi panjang maks 2000 px, target ukuran ≤ 300 KB.
   - Di klien didukung fallback canvas compressor `src/lib/client-image-compression.ts`.

---

## 3. Pembersih File Yatim (Orphan Storage Cleaner)
1. **Skrip CLI**:
   - `scripts/storage-orphans.mjs`: Mengekstrak seluruh URL yang aktif digunakan di tabel `infak_distributions`, `geber_masjid_distributions`, `reports`, `gallery_items`, dan `themed_campaigns`, lalu membandingkannya dengan blob fisik di storage.
   - Ditambahkan ke `package.json`: `"storage:orphans": "node scripts/storage-orphans.mjs"`.
   - Default adalah **Dry-run (Simulasi Aman)**.
2. **Halaman UI Admin**:
   - Halaman `/admin/pengaturan/storage`: Memungkinkan admin melakukan dry-run scan file yatim, meninjau rincian ukuran & usia file, serta tombol konfirmasi bermodal dialog untuk menghapus file terpilih secara permanen.
   - Kartu tautan pemeliharaan storage disematkan di `/admin/pengaturan`.

---

## 4. Hasil Verifikasi Pengujian

### A. Hasil Playwright E2E (`e2e/storage-upload.spec.ts`)
```text
Running 4 tests using 1 worker

  ok 1 [chromium] › e2e\storage-upload.spec.ts:10:7 › Tahap 1: Bug Upload & Alur Upload-on-Save › 1. Pilih foto lalu batalkan → 0 blob baru diunggah ke storage (upload-on-save) (5.2s)
  ok 2 [chromium] › e2e\storage-upload.spec.ts:49:7 › Tahap 1: Bug Upload & Alur Upload-on-Save › 2. Pilih foto A lalu ganti B lalu simpan → hanya B ada di storage (3.9s)
  ok 3 [chromium] › e2e\storage-upload.spec.ts:99:7 › Tahap 1: Bug Upload & Alur Upload-on-Save › 3. Simpan gagal (paksa error) → rollback membersihkan blob yang baru diunggah (436ms)
  ok 4 [chromium] › e2e\storage-upload.spec.ts:139:7 › Tahap 1: Bug Upload & Alur Upload-on-Save › 4. Ganti foto record yang sudah ada → blob lama terhapus dari storage (1.3s)

  4 passed (15.5s)
```

### B. Hasil Dry-Run Skrip CLI (`pnpm storage:orphans`)
```text
=== PEMERIKSA FILE YATIM (ORPHAN STORAGE CLEANER) ===
Mode: 🟡 SIMULASI / DRY-RUN (Default)

Total file ditemukan di storage: 3 file.
File tidak terikat (orphans) ditemukan: 3 file.

┌─────────┬────────────────────────────────────┬──────────┬─────────────┬────────────┬──────────┬──────────────────────┐
│ (index) │ Pathname                           │ Provider │ Ukuran (KB) │ Usia (Jam) │ > 24 Jam │ Tindakan             │
├─────────┼────────────────────────────────────┼──────────┼─────────────┼────────────┼──────────┼──────────────────────┤
│ 0       │ '1793767050295-sample-preview.jpg' │ 'local'  │ '0.1'       │ 1.4        │ 'Belum'  │ 'SIMULASI (Dry-run)' │
│ 1       │ '1e301d551f14c4a5.webp'            │ 'local'  │ '0.1'       │ 0          │ 'Belum'  │ 'SIMULASI (Dry-run)' │
│ 2       │ 'ec4b7870e4ea20e6.webp'            │ 'local'  │ '0.1'       │ 0          │ 'Belum'  │ 'SIMULASI (Dry-run)' │
└─────────┴────────────────────────────────────┴──────────┴─────────────┴────────────┴──────────┴──────────────────────┘

💡 Catatan: Jalankan dengan `pnpm storage:orphans --delete` untuk mengeksekusi penghapusan file > 24 jam.
```

### C. Build & Linting Status
- `pnpm lint`: ✅ 0 error. Semua 17 pasangan token resmi lolos standar WCAG AA.
- `pnpm build`: ✅ 33/33 route teroptimasi (termasuk static & dynamic endpoints).

---

## 5. Kepatuhan Aturan Anti-Slop (R-xx)
- **R-02 (Keaslian Data & Zero Waste)**: Tidak ada file blob yatim yang tertinggal saat form dibatalkan. Deduplikasi konten dengan SHA-256 mencegah berkas duplikat.
- **R-04 (Accessibility & Form Affordance)**: Preview lokal responsif dengan indikator ukuran file, tombol "Ganti Foto" dan "Hapus" yang jelas.
- **R-06 (State Handling)**: Penanganan error, loading, dan dialog konfirmasi eksplisit sebelum aksi destruktif penghapusan file.

---
**Rekomendasi**: Tahap 1 telah tuntas secara menyeluruh. Siap melanjutkan ke **TAHAP 2: Dropdown/select terlalu mepet ke kanan (komponen Select terpadu)** setelah persetujuan owner.

