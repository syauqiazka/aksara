# AUDIT SLOP — Yayasan Sahabat Aksara (Audit-1)

> **Mode**: antislop active: after (session override)  
> **Tanggal Audit**: 2026-11-03  
> **Pemeriksa**: Senior Creative Engineer & antislop Auditor  
> **Dasar Aturan**: `antislop.md` (R-01 s/d R-40), `DESIGN.md`, dan `AGENTS.md`  
> **Artefak Bukti Visual**: Tersimpan di `/docs/antislop/audit/screenshots/` (15 rute desktop 1440 & mobile 390)

---

## Ringkasan Eksekutif

| Tingkat Aturan | Jumlah Temuan |
|---|---|
| **Hard Gate** (Absolut, Tidak Ada Kompromi) | 7 |
| **Purpose-Gate** (Teknik Boleh, Tapi Butuh Tujuan & Batasan) | 6 |
| **Quality Lock** (Konsistensi, Identitas & Kerajinan) | 4 |
| **Total Temuan** | **17** |

### 5 Masalah Terbesar yang Ditemukan
1. **Data Dummy Rekening & Kontak yang Dikarang Tanpa Penanda `[KONFIRMASI]` (R-36, R-38, R-17)**: Menampilkan rekening bank BSI/Mandiri dan nomor WA fiktif seolah-olah data resmi yayasan.
2. **Kontras Warna Teks Emas di Atas Latar Krem Gagal Standar WCAG AA (R-25)**: Rasio kontras teks emas `#DFC054` di atas krem `#FBF8F1` hanya **1.68:1** (syarat minimum 4.5:1).
3. **Pelanggaran Karakter Em Dash (`—` / `&mdash;`) di Banyak Lokasi (R-02)**: Tersebar di metadata layout, judul halaman, tabel laporan, dan marquee.
4. **Ikon Sparkles & Eyebrow Badge Kapsul di Atas H1 di Setiap Halaman (R-04, R-09)**: Pola khas template AI yang diulang tanpa variasi di 7 halaman publik.
5. **Overdosis Bentuk Pill `rounded-full` (86x) dan Glassmorphism `backdrop-blur` (R-10, R-11)**: Menghilangkan diferensiasi hierarki bentuk antar elemen.

### Halaman yang Paling Banyak Masalah
- **Beranda (`/`)**: Mengandung 11 temuan (panjang halaman 12 seksi beruntun, Sparkles, Em dash pada laporan, tombol serba panah, backdrop-blur ganda, animasi running tanpa pause, teks kontras rendah).
- **Tentang Kami (`/tentang`) & Donasi (`/donasi`)**: Kontras teks emas di atas kartu krem, nomor rekening/kontak belum terkonfirmasi, dan penanda pill capsule di atas judul.

---

## Daftar Temuan Bernomor

### KELOMPOK 1: HARD GATE (Tingkat Paling Berat — Mutlak Diperbaiki)

#### #01 | Hard Gate | R-02 (Copywriting: Em Dash)
- **Lokasi**: 
  - `src/app/layout.tsx:31, 53`
  - `src/app/(public)/data-sebaran/page.tsx:6`
  - `src/app/(public)/tentang/page.tsx:196`
  - `src/app/(public)/page.tsx:285`
  - `src/app/(public)/laporan/page.tsx:59`
  - `src/app/(public)/laporan/[slug]/page.tsx:45`
  - `src/app/admin/(protected)/laporan/page.tsx:120`
  - `src/components/motion/AksaraMarquee.tsx:33`
- **Bukti Kode**: 
  ```tsx
  default: "Yayasan Sahabat Aksara — Satu Mushaf, Sejuta Pahala Abadi"
  Periode: {rep.period_start} &mdash; {rep.period_end}
  &mdash; {item.desc.slice(0, 32)}...
  ```
- **Mengapa ini slop**: Aturan R-02 secara mutlak melarang karakter em dash (`—` atau entitas HTML `&mdash;`). Em dash memberi kesan ritme tulisan terjemahan mesin/AI dan bukan gaya bertutur bahasa Indonesia yang luwes.
- **Usulan perbaikan**: Ganti seluruh karakter `—` dan `&mdash;` dengan tanda hubung biasa `-`, titik dua `:`, atau tanda kurung `()`.

---

#### #02 | Hard Gate | R-36, R-38, R-17 (Klaim Rekening & Kontak Fiktif Tanpa Label)
- **Lokasi**:
  - `src/components/sections/AnnouncementTicker.tsx:41`
  - `src/components/ui/Footer.tsx:116, 141, 172`
  - `src/components/sections/BankAccountsList.tsx:24, 38`
- **Bukti Kode**:
  ```tsx
  <span>Layanan Donatur: <strong>+62 812-3456-7890</strong></span>
  <span>BSI: 7283829102</span>
  <span>Mandiri: 1370029384721</span>
  ```
- **Mengapa ini slop**: Melanggar R-36 & R-38 (mempublikasikan data keuangan/kontak fiktif tanpa bukti riil) dan melanggar aturan AGENTS.md §11 (Nomor rekening dan narahubung adalah hal yang HARUS dikonfirmasi owner dan tidak boleh ditebak).
- **Usulan perbaikan**: Tambahkan penanda eksplisit `[MENUNGGU KONFIRMASI OWNER]` pada nomor rekening bank dan kontak layanan donatur sampai data sah diberikan oleh pengurus yayasan.

---

#### #03 | Hard Gate | R-17, R-38 (Data Donatur Dummy Tidak Diberi Label Simulasi)
- **Lokasi**:
  - `src/lib/db/local-store.ts:18, 38, 58, 98`
  - `src/components/sections/DataSebaranView.tsx`
- **Bukti Kode**:
  ```ts
  donor_name: "Dr. Hendra Wijaya",
  donor_name: "Keluarga Bpk. H. Sutrisno",
  donor_name: "Ibu Hj. Siti Rahmah"
  ```
- **Mengapa ini slop**: Nama donatur buatan ini tampil di halaman publik seolah-olah nama donatur nyata, melanggar AGENTS.md §1 ("Data contoh harus jelas bertanda 'contoh' dan hanya di seed/dev") serta R-17/R-38 ("Empty is better than deceptive").
- **Usulan perbaikan**: Tambahkan penanda `[DATA SIMULASI]` pada seluruh entri seed yang tidak berasal dari dokumen resmi, atau standarkan nama default menjadi "Hamba Allah" sesuai etika wakaf Islam.

---

#### #04 | Hard Gate | R-25 (Rasio Kontras Teks Emas di Atas Latar Terang Gagal WCAG AA)
- **Lokasi**:
  - `src/app/(public)/page.tsx:49`
  - `src/components/sections/InfaqCalculator.tsx:55`
  - `src/components/sections/IndonesiaMap.tsx:87, 231`
  - `src/components/sections/InteractiveLogoHotspots.tsx:69`
- **Bukti Uji**:
  ```bash
  python contrast-check.py "#DFC054" "#FBF8F1"
  ratio: 1.68:1
  normal text (4.5:1): FAIL
  large text  (3.0:1): FAIL
  ```
- **Mengapa ini slop**: Teks emas muda (`--gold-400` / `--gold-500`) yang ditempatkan di atas latar krem (`--cream-50`) tidak memenuhi syarat keterbacaan manusia dengan rasio hanya 1.68:1. DESIGN.md §2 telah mewajibkan: *"Teks emas di atas krem pakai --gold-700, bukan --gold-500!"*.
- **Usulan perbaikan**: Ganti semua kelas teks emas di atas latar terang menjadi `text-[var(--gold-700)]` (`#806921`) yang menghasilkan kontras **5.00:1** (PASS WCAG AA).

---

#### #05 | Hard Gate | R-32 (Hilangnya Indikator Fokus Navigasi Keyboard pada Navbar)
- **Lokasi**: `src/components/ui/Navbar.tsx:46, 76`
- **Bukti Kode**:
  ```tsx
  className="flex items-center gap-3 group outline-none focus:outline-none focus-visible:outline-none ..."
  ```
- **Mengapa ini slop**: Mematikan `focus-visible:outline-none` tanpa menggantinya dengan custom ring fokus membuat situs tidak dapat dioperasikan oleh tunanetra/pengguna keyboard (`Tab`), melanggar R-32 secara telak.
- **Usulan perbaikan**: Terapkan custom ring fokus yang kontras dan elegan: `focus-visible:ring-2 focus-visible:ring-[var(--gold-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--green-950)]`.

---

#### #06 | Hard Gate | R-39 (Animasi Berjalan Tanpa Tombol Jeda & Mengabaikan Reduced Motion)
- **Lokasi**:
  - `src/components/sections/AnnouncementTicker.tsx:23, 47`
  - `src/components/sections/HeroShowcase.tsx:121, 136, 153`
- **Bukti Kode**:
  ```tsx
  <div className="inline-flex animate-[ticker_25s_linear_infinite] gap-8">
  <div className="... animate-[float_4s_ease-in-out_infinite]">
  ```
- **Mengapa ini slop**: R-39 mewajibkan animasi yang bergerak lebih dari 5 detik memiliki kontrol jeda (*pause control*) dan wajib menghormati preferensi aksesibilitas `prefers-reduced-motion: reduce`.
- **Usulan perbaikan**: Berikan tombol pause/play pada running ticker pengumuman, serta tambahkan media query CSS `@media (prefers-reduced-motion: reduce) { animation: none !important; }` pada seluruh elemen floating dan ticker.

---

#### #07 | Hard Gate | R-26, R-27 (Admin CRUD Memakai `alert()` Browser Polos Tanpa Error State UI)
- **Lokasi**:
  - `src/app/admin/(protected)/infak/page.tsx:56`
  - `src/app/admin/(protected)/geber-masjid/page.tsx:64`
- **Bukti Kode**:
  ```tsx
  catch {
    alert("Gagal memperbarui status");
  }
  ```
- **Mengapa ini slop**: Menggunakan fungsi browser primitif `alert()` merusak pengalaman pengguna dan melanggar prinsip ketahanan antarmuka (C-4 & R-27: UI wajib memiliki state error yang terintegrasi di komponen).
- **Usulan perbaikan**: Buat banner notifikasi status/toast inline di dalam kartu tabel admin saat operasi gagal atau sukses.

---

### KELOMPOK 2: PURPOSE-GATE (Teknik Diizinkan, Tapi Terapannya Berlebihan/Tanpa Alasan Tertulis)

#### #08 | Purpose-Gate | R-04 (Ikon Sparkles Ditempelkan Otomatis di Setiap Eyebrow Badge)
- **Lokasi**:
  - `src/app/(public)/page.tsx:337`
  - `src/app/(public)/data-sebaran/page.tsx:23`
  - `src/app/(public)/donasi/page.tsx:38`
  - `src/app/(public)/laporan/page.tsx:23`
  - `src/app/(public)/portofolio/page.tsx:39`
  - `src/app/(public)/program/page.tsx:21`
  - `src/components/sections/AnnouncementTicker.tsx:18`
- **Bukti Visual**: Ikon bintang berkilau (`Sparkles`) muncul di 7 halaman publik pada posisi yang sama persis di atas judul H1.
- **Mengapa ini slop**: R-04 melarang penggunaan ikon Sparkles/bintang kilau sebagai ornamen default tanpa tujuan fungsional.
- **Usulan perbaikan**: Hapus ikon Sparkles dari seluruh badge kategori halaman; gunakan teks judul langsung yang percaya diri.

---

#### #09 | Purpose-Gate | R-09 (Eyebrow Badge Kapsul Terparkir Seragam di Atas Setiap H1)
- **Lokasi**: 7 halaman publik utama (`page.tsx`, `tentang`, `program`, `portofolio`, `data-sebaran`, `laporan`, `donasi`).
- **Bukti Visual**: Setiap hero memiliki pill oval kecil bertuliskan nama pilar atau slogan lembaga sebelum judul utama.
- **Mengapa ini slop**: R-09 melarang *"a pill parked above the H1 holding a category label the headline already says"*. Ini adalah pola cetakan template AI paling kentara.
- **Usulan perbaikan**: Hilangkan bentuk kapsul berbingkai di atas H1; posisikan H1 langsung sebagai fokus visual utama (*one focal point per screen*).

---

#### #10 | Purpose-Gate | R-08 (Tanda Panah Dekoratif Menempel di Hampir Semua Link & Tombol)
- **Lokasi**: `src/app/(public)/page.tsx:140, 169, 204, 257, 277, 307`.
- **Bukti Kode**:
  ```tsx
  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
  ```
- **Mengapa ini slop**: R-08 menyatakan panah bukanlah identitas bawaan setiap tombol. Penempelan panah kecil di setiap kartu dan link membuat antarmuka menjadi bising (*cluttered*).
- **Usulan perbaikan**: Hapus panah dekoratif dari kartu pilar dan link sekunder; pertahankan hanya pada aksi navigasi paginasi.

---

#### #11 | Purpose-Gate | R-10 (Overdosis Glassmorphism / `backdrop-blur` Lintas Komponen)
- **Lokasi**:
  - `src/components/ui/Navbar.tsx:38, 116`
  - `src/components/sections/HeroShowcase.tsx:121, 136`
  - `src/app/admin/login/page.tsx:48`
  - `src/components/motion/AksaraMarquee.tsx:45`
  - `src/components/sections/DataSebaranView.tsx:517`
- **Mengapa ini slop**: R-10 menetapkan batasan dosis maksimal 1-2 elemen dengan `backdrop-blur`. Di kode saat ini, navbar, kartu floating, modal dialog, kartu login, dan menu mobile seluruhnya memakai blur secara serempak.
- **Usulan perbaikan**: Hapus `backdrop-blur` dari kartu floating dan modal dialog; gunakan latar solid bertoken (`bg-[var(--green-950)]` atau `bg-[var(--cream-100)]`). Sisakan blur hanya pada sticky navbar saat scroll.

---

#### #12 | Purpose-Gate | R-14 (Kartu Pilar & Laporan Berukuran Seragam Tanpa Variasi Hierarki)
- **Lokasi**: `src/app/(public)/page.tsx:116-144` (4 pilar), `src/app/(public)/page.tsx:281-311` (3 laporan).
- **Bukti Visual**: 4 kartu pilar memiliki ukuran, tinggi, dan tata letak kotak yang simetris kaku (1 baris 4 kartu).
- **Mengapa ini slop**: R-14 melarang kartu fitur yang berukuran sama rata tanpa mencerminkan hierarki kepentingan konten.
- **Usulan perbaikan**: Ubah komposisi pilar menjadi asimetris: Pilar Spiritual (Infak Mushaf) diberi kartu utama berbingkai aksen emas yang lebih menonjol, sementara 3 pilar lainnya tersusun sebagai pendukung.

---

#### #13 | Purpose-Gate | R-07 (Background Geometri Bintang Islam Diulang di Terlalu Banyak Seksi)
- **Lokasi**: `src/app/(public)/page.tsx:35, 175, 334`, `src/components/sections/HeroShowcase.tsx:27`, `src/components/sections/InfaqCalculator.tsx:35`, `src/components/sections/IndonesiaMap.tsx:82`.
- **Bukti Kode**: Kelas `.bg-islamic-stars` dan `.bg-islamic-pattern` diulang hampir di setiap seksi gelap.
- **Mengapa ini slop**: R-07 melarang pengulangan pola latar belakang secara seragam tanpa tujuan pembeda suasana.
- **Usulan perbaikan**: Batasi tekstur bintang hanya pada Hero dan Grand CTA penutup untuk momen penegasan sakral; seksi peta dan kalkulator dibiarkan bersih dengan warna hijau zamrud solid bertoken.

---

### KELOMPOK 3: QUALITY LOCKS (Konsistensi, Tipografi & Kerajinan)

#### #14 | Quality Lock | R-11 (Over-Radius: 86 Elemen Menggunakan `rounded-full`)
- **Lokasi**: 86 kemunculan `rounded-full` di seluruh komponen.
- **Bukti Kode**: Seluruh tombol, badge, tab filter, input pencarian, dan tag dipaksa berbentuk kapsul oval sempurna.
- **Mengapa ini slop**: R-11 melarang menjadikan setiap elemen berbentuk pill (*pill buttons, pill cards, pill inputs, pill badges*).
- **Usulan perbaikan**: Terapkan variasi radius token DESIGN.md: input dan kartu memakai `rounded-xl` (12px) atau `rounded-2xl` (16px); sisakan bentuk pill hanya untuk tombol aksi utama.

---

#### #15 | Quality Lock | R-05, C-3 (Panjang Halaman Beranda Menumpuk 12 Seksi Sekaligus)
- **Lokasi**: `src/app/(public)/page.tsx`
- **Bukti Struktur**: Ticker → Hero → Calculator → Marquee → Stats → Pillars → Programs → Map → Founder → Reports → FAQ → Grand CTA.
- **Mengapa ini slop**: Halaman beranda terlalu padat dan menumpuk seluruh fitur ke satu aliran scroll tanpa jeda narasi yang bernafas (melanggar C-3: Content-Driven Composition).
- **Usulan perbaikan**: Rampingkan susunan beranda: integrasikan ringkasan pilar ke dalam program unggulan, dan fokuskan alur donatur: (1) Misi Utama & Ticker → (2) Hero & Kalkulator Wakaf → (3) Peta Akuntabilitas → (4) Bukti Penyaluran & Laporan → (5) FAQ & Donasi CTA.

---

#### #16 | Quality Lock | C-1, antislop-code (Komentar Template Outline JSX Berbau AI)
- **Lokasi**: `src/app/(public)/page.tsx:39, 42, 45, 64, 67, 105, 148, 173, 198, 256, 313, 332`
- **Bukti Kode**:
  ```tsx
  {/* 1. TOP ANNOUNCEMENT TICKER (Bazma / SMK TI Bazma Style) */}
  {/* 2. SPLIT HERO SHOWCASE WITH FLOATING LIVE BADGES */}
  {/* 3. INTERACTIVE IMPACT CALCULATOR (Kalkulator Kebaikan Langsung di Beranda) */}
  ```
- **Mengapa ini slop**: Penomoran outline seksi di komentar JSX adalah jejak khas AI coding agent yang tidak memberikan informasi arsitektur kode yang bernilai bagi developer manusia.
- **Usulan perbaikan**: Hapus komentar penomoran template; gunakan penamaan tag section yang semantik.

---

#### #17 | Quality Lock | R-24 (Label Menu Navbar 'Donasi & Dokumentasi' Padahal URL Tunggal)
- **Lokasi**: `src/components/ui/Navbar.tsx:15`
- **Bukti Kode**:
  ```ts
  { href: "/donasi", label: "Donasi & Dokumentasi" }
  ```
- **Mengapa ini slop**: Menggabungkan dua konsep berbeda ("Donasi" dan "Dokumentasi") ke dalam satu tautan navbar `/donasi` membuat pengunjung bingung karena dokumentasi program hanya terselip di bagian bawah.
- **Usulan perbaikan**: Ubah label navbar menjadi "Donasi" yang terarah, dan buat tautan dokumentasi berada di dalam halaman program atau sub-navigasi transparan.

---

## Ringkasan Akhir & Menunggu Persetujuan

- **Total Temuan**: 17 temuan (7 Hard Gate, 6 Purpose-Gate, 4 Quality Lock).
- **Screenshots Bukti**: Tersedia 30 file gambar lengkap (15 rute desktop 1440 & mobile 390) di folder `docs/antislop/audit/screenshots/`.
- **Status Kode Saat Ini**: Kode belum diubah sama sekali sesuai instruksi mode **AFTER**.

Silakan tinjau dan sebutkan nomor-nomor temuan yang Anda setujui (misalnya: *"Perbaiki #01, #02, #04, #05 dulu"* atau *"Setujui semua"*), dan saya akan mulai mengeksekusi perbaikan secara bertahap kelompok demi kelompok.

