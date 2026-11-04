# DELIVERY GATE — REVISI TAHAP 5-A: TABEL INFAK JINAN DUA TINGKAT & PRIVASI DATA

## 1. Ringkasan Implementasi
Struktur data donasi Infak Al-Qur'an Jinan berhasil diubah menjadi dua tingkat (**1 baris donasi/mushaf → N santri penerima**) sesuai dengan instruksi revisi Tahap 5-A, menggantikan model flat satu santri per donasi.

### Arsitektur Dua Tingkat:
1. **Entitas Induk (`infak_jinan`)**: Menyimpan data donasi, nomor mushaf unik, donatur (`donor_name`, `show_donor_name`), asal donatur (`donor_origin`), nomor HP donatur (admin only: `donor_phone`), nama dedikasi (`dedication_name`), pesantren tujuan, alamat lengkap, tautan Google Maps, tanggal distribusi, dan foto serah terima.
2. **Entitas Anak (`infak_jinan_santri`)**: Menampung daftar santri penerima yang diasosiasikan dengan mushaf (`infak_id`), nama santri, nomor HP (admin only), nomor urut, serta status.
3. **Entitas Cucu (`santri_hafalan_updates`)**: Mencatat riwayat pembaruan capaian hafalan santri (surah 1–114, ayat, juz otomatis/manual, tanggal pembaruan, dan catatan perkembangan).

---

## 2. Kepatuhan Standar Anti-Slop & Aturan Proyek

| Kode Aturan | Kebutuhan | Implementasi & Verifikasi |
|---|---|---|
| **R-PRIVACY** | Nomor HP donatur & santri tidak boleh bocor ke publik | Kolom `donor_phone` & `phone` dihapus dari semua tipe publik (`PublicInfakJinanRecord`, `PublicInfakJinanSantri`). Diuji via E2E Playwright: regex `08[1-9][0-9]{7,11}` tidak ditemukan pada DOM publik. |
| **R-ACCESSIBILITY** | Dialog modal dan navigasi keyboard | Modal riwayat hafalan dan modal lightbox dokumentasi menggunakan `role="dialog"`, `aria-modal="true"`, tombol tutup aksesibel dengan label keyboard. |
| **R-NO-FAKES** | Hitungan santri asli dari agregasi data | Kolom "Tersalurkan" dihitung otomatis (`santri_count` via count santri), bukan angka yang diinput manual. |
| **R-DESIGN-TOKENS** | Desain token dan tipografi | Menggunakan token resmi (`--green-950`, `--gold-500`, `--cream-50`, dsb.) dengan kontras rasio WCAG AA terverifikasi. |
| **R-MOBILE-FIRST** | Tampilan responsif mobile | Tabel desktop bergeser menjadi kartu bertumpuk di mobile (viewport 360–390px) dengan tombol navigasi santri yang nyaman disentuh (tinggi ≥44px). |

---

## 3. Rute & Komponen Baru

1. **Rute Publik Detail Donasi**: `/data-sebaran/infak-jinan/[id]`
   - Server Component dengan `generateMetadata` SEO dinamis dan `notFound()` jika id tidak ditemukan atau draft.
   - Ringkasan donasi di kartu mihrab gradien hijau-emas: nomor mushaf, donatur, dedikasi, pesantren penerima, koordinat maps, tanggal penyaluran, dan jumlah santri.
   - Tabel santri binaan (desktop) & kartu bertumpuk (mobile).
   - Modal drawer riwayat bulanan santri dengan visualisasi timeline per surah, ayat, juz, dan tanggal.
2. **Tabel Publik Utama**: `/data-sebaran`
   - Memiliki 10 kolom resmi: No, Donatur, Asal, Urutan Mushaf, Dedikasi untuk, Pesantren Tujuan, Alamat & Peta, Tanggal Distribusi, Tersalurkan (tautan X Santri), Dokumentasi (tombol "Lihat").
3. **Admin Manajemen Form**: `/admin/infak/new` & `/admin/infak/[id]`
   - Form donasi terintegrasi alur Upload-on-Save foto serah terima.
   - Input baris santri dinamis (tambah, hapus, validasi ayat otomatis terhadap 114 surah Al-Qur'an, auto-suggest juz 1–30).
   - Form cepat "Input Pembaruan Hafalan Santri Bulanan" dengan tombol pintas "Salin update bulan lalu".
4. **Endpoint API**:
   - `GET /api/admin/infak` & `POST /api/admin/infak`
   - `PUT /api/admin/infak` (dengan pembersihan otomatis blob foto yang diganti)
   - `POST /api/admin/infak/santri/hafalan` (input cepat hafalan santri bulanan)

---

## 4. Hasil Pengujian Otomatis (E2E)

Semua 24 pengujian Playwright lulus (24 passed):
- `e2e/capture-tahap-2.spec.ts` (5 tests)
- `e2e/data-sebaran-tahap-5.spec.ts` (6 tests)
- `e2e/preloader.spec.ts` (4 tests)
- `e2e/storage-upload.spec.ts` (4 tests)
- `e2e/sync-docx-tahap-4.spec.ts` (5 tests)

Status build & lint:
- `pnpm lint`: 0 errors
- `pnpm build`: 0 errors (34 static & dynamic pages generated)

