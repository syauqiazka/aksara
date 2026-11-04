# Catatan Asumsi Teknis & Keputusan Desain
**Website Yayasan Sahabat Aksara**

Dokumen ini mencatat asumsi dan keputusan yang diambil oleh Senior Creative Engineer selama proses pembangunan, berpedoman pada `AGENTS.md` dan `DESIGN.md`:

### 1. Nama Badan Hukum & Brand
- **Brand Utama di Publik**: **Yayasan Sahabat Aksara** (dipakai di navbar, hero, metadata, dan materi program).
- **Nama Badan Hukum**: Dicatat sebagai **Yayasan Ajirasa Aksara Semesta** dengan tanda `[KONFIRMASI]` pada footer, akun rekening, dan dokumen legalitas hingga disahkan definitif oleh owner.

### 2. Tanggal Legalitas & Akta
- Teks docx memuat tanggal 15 Januari 2024 (Akta Notaris) dan SK Kemenkumham Tahun 2026.
- Dipasang tanda `[KONFIRMASI]` pada nomor akta, SK, dan NPWP (`827382389`) agar transparan dan siap diperbarui setelah konfirmasi resmi.

### 3. Harga dan Target "Infak 1 Jt Al-Qur'an"
- Dikonfirmasi sesuai isi dokumen: **Rp 200.000 / mushaf**.
- Angka **1 Jt** dimaknai sebagai **Target Gerakan 1.000.000 Mushaf Al-Qur'an** untuk santri dan pelosok nusantara.

### 4. Perlindungan Privasi Donatur
- Sesuai standar fiqih sedekah jariyah dan `AGENTS.md` §5: Kolom `show_donor_name` secara default adalah `false`.
- Bila donatur tidak mengizinkan tampilan nama di publik, sistem secara otomatis menampilkan label **"Hamba Allah"**.

### 5. Rekening & Konfirmasi Donasi
- Dipasang rekening BSI dan Bank Mandiri berstatus placeholder `[KONFIRMASI]` dengan fitur 1-klik salin instan.
- Konfirmasi penyaluran dihubungkan langsung ke WhatsApp resmi melalui pre-filled text.

### 6. Portofolio Produk Aplikasi
- Menampilkan 6 aplikasi resmi: *KajianQu, Bank Saku Digital, DiaryQu, E-AbsensiQu, DKM MasjidQu, SapawargaQu*.
- Mockup divisualisasikan menggunakan CSS/SVG UI wireframe yang estetik dan jujur, bukan foto stok generik palsu.
- Tautan Google Play Store diberi status `[KONFIRMASI]` sampai tautan rilis APK/Play Store diberikan oleh pengurus.

### 7. Keamanan Akses Backoffice (/admin)
- URL `/admin` tidak memiliki tautan di antarmuka publik, footer, navbar, sitemap, maupun robots.
- Seluruh rute `/admin/**` diatur dengan `X-Robots-Tag: noindex, nofollow` dan diproteksi cookie session httpOnly dengan verifikasi server.
- Kredensial default pengurus: `admin@sahabataksara.id` / `aksaramulia2026`.

---

## 8. Temuan & Keputusan Storage Provider (Update Tahap 1)

### Status Aktual Provider di Kode
- **Provider Produksi**: **Vercel Blob** (`@vercel/blob`) jika variabel `BLOB_READ_WRITE_TOKEN` tersedia.
- **Provider Development / Fallback**: Penyimpanan lokal disk di folder `public/uploads/` jika token Vercel Blob tidak tersedia.
- **Klarifikasi**: Supabase Storage **tidak** digunakan untuk file media saat ini; Supabase fokus sebagai PostgreSQL database (tabel data sebaran, laporan, setting, ledger) dan Auth.

### Arsitektur Upload-on-Save & Penghapusan Orphan
1. **Upload on Save**: Pemilihan file di klien hanya menghasilkan pratinjau lokal via `URL.createObjectURL` (di-revoke saat unmount/ganti). Tidak ada request upload HTTP saat file dipilih.
2. **Kompensasi Rollback**: Upload baru dikirim saat tombol Simpan ditekan. Jika insert/update database gagal, sistem langsung memicu kompensasi penghapusan blob yang baru diunggah (`DELETE /api/admin/upload`).
3. **Pembersihan Blob Lama**: Saat edit record mengganti foto, blob lama dihapus setelah database berhasil diperbarui. Saat record dihapus, blob foto ikut dihapus.
4. **Deduplikasi Hash**: Nama file final memakai potongan hash SHA-256 dari konten file (`${hash}.webp`). Konten yang identik tidak tersimpan berulang kali.
5. **Kompresi WebP**: Gambar dikonversi ke format WebP dengan sisi panjang maksimal 2000px dan target ukuran ≤ 300KB sebelum disimpan permanen. File non-gambar atau ukuran > 5MB ditolak dengan validasi ketat.
6. **Upload Ledger & Orphan Cleaner**: Pencatatan status upload di ledger (`pending`, `committed`, `deleted`) serta tersedianya skrip `pnpm storage:orphans` untuk mendeteksi dan membersihkan file yatim.

---

## 9. Keputusan Struktur Tabel Data Sebaran (Update Tahap 5)

Berdasarkan dokumen kerangka terbaru (`Kerangka_Deskripsi_Website_Sahabat_Aksara_104457.docx`):
1. **Tiga Tab Utama Data Sebaran Publik**:
   - **Tab 1: Infak Al-Qur'an Jinan** (1 baris = 1 mushaf dengan 15 atribut lengkap termasuk nomor urut, nama donatur, asal, mushaf ke-, dedikasi, pesantren, maps, santri penerima, progres hafalan surat/ayat/juz bulanan, dan foto dokumentasi).
   - **Tab 2: Program BUSS Al-Qur'an** (filter tahun, no urut, santri, asal, pesantren, surat & ayat terkini, juz, donatur, dokumentasi).
   - **Tab 3: Program Yatim Berdikari** (filter tahun, no urut, nama kegiatan, penyelenggara, tanggal, dokumentasi kegiatan).
2. **Penyembunyian Tabel Geber Masjid dari Publik**:
   - Dokumen docx baru tidak mencantumkan tabel Geber Masjid pada daftar menu Data Sebaran Donasi.
   - Sesuai arahan teknis, tabel Geber Masjid disembunyikan dari publik via flag `NEXT_PUBLIC_SHOW_GEBER_SEBARAN=false` (default: false), dengan kode tetap utuh dan siap ditampilkan kembali bila diinstruksikan oleh owner.
3. **Perlindungan Privasi Nomor HP**:
   - Kolom nomor HP donatur dan nomor HP santri diproteksi ketat: disaring/dihapus pada server component (`getPublicInfakJinan`), dan di antarmuka publik hanya ditampilkan status "Terlampir" (atau tidak ditampilkan sama sekali) untuk mencegah kebocoran data pribadi nomor telepon ke publik.
4. **Validasi Surah & Ayat Al-Qur'an**:
   - Modul data statis 114 surah (`src/lib/quran-surahs.ts`) digunakan untuk memvalidasi nomor surah dan batas jumlah ayat resmi Al-Qur'an (mis. Al-Baqarah maksimal 286 ayat).



---

## 10. Audit & Revisi Tahap 5-A: Arsitektur Dua Tingkat (Donasi → Santri)

### Hasil Pemeriksaan Kode & Basis Data Saat Ini (Bagian 0)
1. **Rute & Halaman Detail Saat Ini**:
   - Belum ada rute mandiri `/data-sebaran/infak-jinan/[id]`. Sebelumnya, detail hafalan dan foto dibuka melalui modal/drawer di dalam halaman `/data-sebaran`.
   - **Keputusan**: Buat rute Server Component baru di `src/app/(public)/data-sebaran/infak-jinan/[id]/page.tsx` dengan metadata dinamis (`generateMetadata`), layout ringkasan donasi di atas, tabel santri di bawah, dan aksi riwayat bulanan.
2. **Skema Database & Relasi Model Data**:
   - Skema awal menyimpan `santri_name` dan `santri_phone` flat di dalam tabel `infak_jinan`, sedangkan `hafalan_updates` merujuk langsung ke `infak_id`.
   - **Yang Diubah**:
     - Buat tabel anak `infak_jinan_santri` (`id`, `infak_id`, `name`, `phone`, `sort`, `status`).
     - Alihkan relasi `hafalan_updates` menjadi `santri_hafalan_updates` (`santri_id` FK ke `infak_jinan_santri.id`).
     - Hitungan santri pada tabel utama dihitung dari relasi/VIEW `count(santri)`, bukan angka input manual.
     - Tambahkan VIEW `public_infak_jinan` (tanpa `donor_phone`) dan `public_infak_jinan_santri` (tanpa `phone`).
3. **Komponen yang Dipakai Ulang**:
   - Modul validasi 114 surah `src/lib/quran-surahs.ts` (tetap digunakan untuk update bulanan dan kalkulasi juz otomatis).
   - Komponen terpadu `Select` dan `Input` dari `src/components/ui/` (dipakai untuk filter dan form admin).
   - Komponen lightbox galeri foto `activeGalleryModal` dari Tahap 5.
   - Peta interaktif `IndonesiaMap` dan tab BUSS / Yatim Berdikari (tetap utuh).
4. **Privasi Nomor HP**:
   - Nomor HP donatur dan santri **sama sekali tidak tampil** di tabel utama maupun halaman detail publik (tidak ada kolom HP di publik, tidak diserialisasi di RSC/JSON). Catatan perbedaan dengan docx ("Terlampir") tetap dipertahankan untuk konfirmasi owner.
