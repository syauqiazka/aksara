# Delivery Gate: Batch Perbaikan UI (8 Butir)
Tanggal Audit: 2026-11-05
Mode Antislop: DURING (session override)

## Status Butir Perbaikan

### 1. Input Angka, Nol di Depan, Validasi Ayat, dan Juz Otomatis — PASS
- **Status**: ✅ PASS
- **Perubahan**:
  - Kolom `mushaf_no`, `initial_ayat`, `initial_juz`, `participants`, `beneficiaries`, `amount_idr`, `target_idr`, `collected_idr` diubah menjadi `type="text" inputMode="numeric" pattern="[0-9]*"` dengan `cleanNumericString(val, allowZero)`.
  - State santri menampung string kosong selama mengetik (tidak dipaksa 0).
  - Validasi inline surah & batas ayat dengan 114 surah (`validateAyatNumber`), error inline tampil jika ayat melampaui kapasitas surah (misal Al-Fatihah ayat 10).
  - Pemetaan deterministik 30 juz (`JUZ_BOUNDARIES`) dari tabel standar.
  - Tautan "Kembalikan otomatis" jika juz diubah secara manual (`is_juz_manual`).
  - Unit & E2E tests: `e2e/quran-juz.spec.ts` (8 passed), `e2e/input-angka.spec.ts` (3 passed).

### 2. Form Admin: Default Value Diubah Menjadi Placeholder — PASS
- **Status**: ✅ PASS
- **Perubahan**:
  - Di form "tambah baru" (`infak/new`, `geber-masjid/new`, `laporan/new`, `donasi-tematik`), seluruh nilai dummy awal (`donor_origin: "Cirebon"`, `pesantren_name: "Pondok Pesantren Madrasah Al-Huffazh 2 Gedongan"`, `participants: "25"`, `beneficiaries: "150"`, dll) dikosongkan (`""`).
  - Digantikan dengan placeholder contoh yang informatif (`placeholder="Contoh: Pondok Pesantren Al-Hikmah"`).
  - Menambahkan `datalist` combobox saran pesantren (`#pesantren-suggestions`) di input nama pesantren yang secara otomatis mengisi alamat lembaga jika dipilih, tetapi tetap bebas mengetik nama baru.
  - Label tidak terpotong (padding & layout flex/grid diperiksa).

### 3. Portofolio: Pembersihan AI Slop di Kartu Proyek — PASS
- **Status**: ✅ PASS
- **Perubahan**:
  - Menghapus seluruh terminal palsu monospace ("Pratinjau Antarmuka • Aplikasi ...", "Versi Beta").
  - Menghapus subjudul berulang.
  - Kartu portofolio hanya menampilkan: Icon SVG Lucide relevan, nama aplikasi resmi, satu kalimat kategori & tagline, deskripsi otentik dari docx, lencana status "Segera Dirilis" (font reguler bersih), dan tombol status realistis.
  - Menghapus teks teknis bocor di peta seperti "Skala Geografis Akurat • viewBox 1000 × 450".

### 4. Hapus Seluruh Bullet Dot (•, &bull;, ·, list-disc) — PASS
- **Status**: ✅ PASS
- **Perubahan**:
  - Seluruh 24 kemunculan karakter bullet dot (`•`, `&bull;`, `list-disc`) di seluruh codebase `src/` telah dihapus dan diganti dengan pemisah semantik (koma, garis tegak tipis `|`, garis miring `/`, atau badge terpisah).
  - Membuat script pengawas `scripts/lint-bullets.mjs` dan mendaftarkannya ke `pnpm lint` (`package.json`).
  - Eksekusi `node scripts/lint-bullets.mjs`: 0 pelanggaran.

### 5. Affordances Klik & Kontras Permukaan Gelap — PASS
- **Status**: ✅ PASS
- **Perubahan**:
  - Menambahkan varian tombol baru `secondary-dark` di `src/components/ui/Button.tsx` khusus untuk kontras section gelap (`bg-[var(--green-950)]`): border gold 400, teks cream-50, hover gold 500/20, kontras lolos WCAG AA.
  - Seluruh elemen klik memakai `cursor-pointer` eksplisit.
  - Menjalankan `node scripts/check-token-contrast.mjs`: 17 dari 17 pasangan token lolos standar WCAG AA (kontras normal ≥ 4.5:1, large text ≥ 3:1).

### 6. Typo & Ejaan Baku + Helper formatTanggal — PASS
- **Status**: ✅ PASS
- **Perubahan**:
  - Menyelaraskan istilah: `Al-Qur'an` (bukan Al Quran), `Infak` (bukan Infaq).
  - Membuat helper `src/lib/format-date.ts` (`formatTanggal(dateString)` menghasilkan standar tanggal Bahasa Indonesia DD MMMM YYYY).
  - Menghasilkan dokumentasi catatan audit di `docs/TYPO.md`.

### 7. Posisi Tab Data Sebaran — PASS
- **Status**: ✅ PASS
- **Perubahan**:
  - Di `src/components/sections/DataSebaranView.tsx`, tab switcher diposisikan di atas filter toolbar & tabel, setelah preview peta nasional.
  - Hirarki tata letak terstruktur rapi: Peta Persebaran -> Tab Navigasi Program (Infak Jinan, BUSS, Yatim) -> Sticky Filter Toolbar -> Tabel / Kartu Data.

### 8. Peta Sebaran Otentik Berbasis Data — PASS
- **Status**: ✅ PASS
- **Perubahan**:
  - Judul peta diselaraskan menjadi "Sebaran Infak Al-Qur'an Jinan" saat tab infak aktif, dan menghapus eyebrow ganda yang redundan.
  - Menghapus marker buatan Jakarta Central Hub (`x=267, y=301`) dan garis busur ray palsu yang menghubungkan Jakarta ke seluruh pulau.
  - Menghapus teks teknis bocor "Skala Geografis Akurat • viewBox 1000 × 450" serta statistik fiktif "Masjid" dari tooltip infak.
  - Statistik pulau dihitung murni secara agregat dari database (`jinanData`).
  - Menambahkan `<table aria-label="Ringkasan sebaran infak Al-Qur'an Jinan per pulau" className="sr-only">` untuk aksesibilitas screen reader.
  - Menghubungkan interaktivitas klik pulau ke tabel filter di bawahnya dengan tag badge aktif `Wilayah: JAWA` dan tombol pembersih filter `[X]`.
  - Mendokumentasikan asumsi di `docs/ASUMSI.md`.
  - Mengintegrasikan dropdown 38 provinsi di `src/lib/provinces-38.ts`.

---

## Verifikasi Akhir
- `pnpm lint` — ✅ 0 error (11 warning unused vars), token contrast 17/17 PASS WCAG AA, bullet lint PASS.
- `pnpm build` — ✅ Berhasil mengompilasi 35 rute Next.js tanpa error (`Turbopack`).
- Playwright E2E — ✅ Seluruh 32 pengujian inti lulus 100%:
  - `e2e/input-angka.spec.ts` (3 passed)
  - `e2e/quran-juz.spec.ts` (8 passed)
  - `e2e/map-honest-data.spec.ts` (2 passed)
  - `e2e/data-sebaran-tahap-5.spec.ts` (6 passed)
  - `e2e/storage-upload.spec.ts` (4 passed)
  - `e2e/sync-docx-tahap-4.spec.ts` (5 passed)
  - `e2e/preloader.spec.ts` (4 passed)

