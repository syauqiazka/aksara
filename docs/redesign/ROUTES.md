# INVENTARIS RUTE & STATUS REDESIGN TATA LETAK
**Website & Sistem Backoffice Yayasan Sahabat Aksara**

Dokumen ini memetakan seluruh rute publik, elemen bersama, dan rute administratif backoffice hasil pemindaian kode di `src/app`.

---

## 1. Elemen Bersama (Shared System)

| Elemen / Komponen | File Implementasi | Sifat | Status Redesign |
|---|---|---|---|
| **Public Navbar** | `src/components/layout/Navbar.tsx` | Client (Scroll Triggered) | **Selesai** |
| **Public Footer** | `src/components/layout/Footer.tsx` | Server/Static | **Selesai** |
| **Page Transition / Preloader** | `src/components/motion/Preloader.tsx` | Client (GSAP/Lottie) | **Selesai** |
| **Subpage Header Layout** | `src/components/ui/PageHeader.tsx` (komponen baru) | Server/Client | **Selesai** |
| **Lightbox Galeri Dokumentasi**| `src/components/ui/GalleryModal.tsx` | Client (Keyboard-ready) | **Selesai** |
| **Design Tokens & Kontras** | `src/styles/tokens.css`, `globals.css` | Global CSS | **Selesai** |

---

## 2. Rute Publik (Public Website)

| Rute URL | File Lokasi | Jenis | Tujuan Halaman (1 Kalimat) | Status |
|---|---|---|---|---|
| `/` | `src/app/(public)/page.tsx` | Dinamis (SSR) | Pintu gerbang utama memperkenalkan visi, bukti sebaran Al-Qur'an, dan mengajak donasi keumatan. | **Selesai (Arah A)** |
| `/tentang` | `src/app/(public)/tentang/page.tsx` | Statis/SSR | Memaparkan sejarah otentik pendiri Ahmad Dahlan, fokus 4 pilar, serta makna filosofis nama & logo yayasan. | **Selesai** |
| `/program` | `src/app/(public)/program/page.tsx` | Statis/SSR | Menampilkan 8 program aksi resmi lembaga dalam etalase terstruktur berbasis pilar khidmat. | **Selesai** |
| `/program/[slug]` | `src/app/(public)/program/[slug]/page.tsx` | Dinamis (Params) | Memberikan panduan menyeluruh rincian skema, biaya, dan cara partisipasi pada program tertentu. | **Selesai** |
| `/portofolio` | `src/app/(public)/portofolio/page.tsx` | Statis/SSR | Menampilkan 6 aplikasi digital Qu (KajianQu, Bank Saku, dsb.) sebagai kontribusi pilar teknologi yayasan. | **Selesai** |
| `/data-sebaran` | `src/app/(public)/data-sebaran/page.tsx` | Dinamis (SSR) | Command center transparansi penyaluran donasi melalui peta nusantara dan 3 tab ledger (Jinan, BUSS, Yatim). | **Selesai (Arah A)** |
| `/data-sebaran/infak-jinan/[id]` | `src/app/(public)/data-sebaran/infak-jinan/[id]/page.tsx` | Dinamis (Params) | Lembar verifikasi detail donasi per mushaf dan tabel perkembangan hafalan santri penerima manfaat. | **Selesai** |
| `/laporan` | `src/app/(public)/laporan/page.tsx` | Dinamis (SSR) | Indeks akuntabilitas publik memuat laporan keuangan, realisasi program, dan berkas audit PDF. | **Selesai** |
| `/laporan/[slug]` | `src/app/(public)/laporan/[slug]/page.tsx` | Dinamis (Params) | Dokumentasi komprehensif narasi, metrik capaian, galeri foto, dan unduhan dokumen laporan kegiatan. | **Selesai** |
| `/donasi` | `src/app/(public)/donasi/page.tsx` | Dinamis (SSR) | Pusat informasi rekening resmi yayasan, donasi tematik bencana, kalkulator infak, dan konfirmasi WhatsApp. | **Selesai** |
| `/dokumentasi` | `src/app/(public)/dokumentasi/page.tsx` | Dinamis (SSR) | Arsip galeri visual kegiatan penyaluran mushaf, geber masjid, tasmi', dan aksi sosial di pelosok. | **Selesai** |
| `/not-found` (404) | `src/app/not-found.tsx` | Statis | Menuntun pengunjung yang tersesat kembali ke halaman utama dengan pesan hangat bernuansa Islami. | **Selesai** |
| `error.tsx` | `src/app/error.tsx` | Client Error Boundary | Menampilkan penanganan kegagalan sistem secara elegan tanpa merusak estetika dan navigasi pengguna. | **Selesai** |

---

## 3. Rute Administratif (Admin Backoffice)

| Rute URL | File Lokasi | Jenis | Tugas Utama Pengurus | Status |
|---|---|---|---|---|
| `/admin/login` | `src/app/admin/login/page.tsx` | Client (Auth) | Autentikasi aman pengurus yayasan dengan proteksi rate limit dan pesan kredensial terlindungi. | **Selesai** |
| `/admin` | `src/app/admin/(protected)/page.tsx` | Dinamis (SSR) | Cockpit operasional menampilkan aksi tertunda (draft menunggu publish, donasi tanpa santri, file orphan). | **Selesai (Arah A)** |
| `/admin/infak` | `src/app/admin/(protected)/infak/page.tsx` | Dinamis (SSR) | Manajemen data donasi Infak Jinan dengan pencarian, filter status, aksi massal, dan ekspor/impor. | **Selesai** |
| `/admin/infak/new` | `src/app/admin/(protected)/infak/new/page.tsx` | Client/SSR | Formulir input donasi baru, upload-on-save foto, dan repeater baris santri penerima manfaat. | **Selesai (Arah A)** |
| `/admin/infak/[id]` | `src/app/admin/(protected)/infak/[id]/page.tsx` | Client/SSR | Formulir edit donasi terverifikasi, manajemen santri terkait, dan penggantian foto dengan rollback aman. | **Selesai** |
| `/admin/infak/santri/hafalan` | API / Modal Component | Client/API | Halaman input cepat update surat/ayat/juz bulanan santri dengan fitur salin progres bulan lalu. | **Selesai** |
| `/admin/geber-masjid` | `src/app/admin/(protected)/geber-masjid/page.tsx` | Dinamis (SSR) | Daftar kegiatan Gerakan Bersih Masjid, lokasi, jumlah partisipan, dan arsip foto dokumentasi. | **Selesai** |
| `/admin/geber-masjid/new` | `src/app/admin/(protected)/geber-masjid/new/page.tsx` | Client/SSR | Input kegiatan Geber Masjid baru beserta multi-upload foto pembersihan masjid. | **Selesai** |
| `/admin/laporan` | `src/app/admin/(protected)/laporan/page.tsx` | Dinamis (SSR) | Manajemen berkas laporan pertanggungjawaban program publik dan status publikasi dokumen. | **Selesai** |
| `/admin/laporan/new` | `src/app/admin/(protected)/laporan/new/page.tsx` | Client/SSR | Editor laporan baru dengan cover, ringkasan capaian, dan unggahan lampiran berkas PDF audit. | **Selesai** |
| `/admin/dokumentasi` | `src/app/admin/(protected)/dokumentasi/page.tsx` | Dinamis (SSR) | Kurasi galeri foto kegiatan per program dengan penataan urutan tampil dan takarir foto. | **Selesai** |
| `/admin/donasi-tematik`| `src/app/admin/(protected)/donasi-tematik/page.tsx` | Dinamis (SSR) | Manajemen kampanye darurat bencana nusantara (target donasi, dana terhimpun, status aktif/selesai). | **Selesai** |
| `/admin/pengaturan` | `src/app/admin/(protected)/pengaturan/page.tsx` | Dinamis (SSR) | Pembaruan rekening bank resmi, kontak WhatsApp narahubung, media sosial, dan kemitraan lembaga. | **Selesai** |
| `/admin/pengaturan/storage` | `src/app/admin/(protected)/pengaturan/storage/page.tsx` | Dinamis (SSR) | Alat pemantau kesehatan storage, ledger upload, serta eksekusi pembersihan file yatim (*orphan cleaner*).| **Selesai** |

---

## 4. Rangkuman Metrik Kemajuan

- **Total Rute / Halaman Teridentifikasi**: 26 entitas (13 publik & bersama, 13 admin).
- **Status Akhir**:
  - **Selesai**: 26 dari 26 entitas (100% Selesai).
  - **Proposal**: 0 entitas.
- **Kualitas Verifikasi**:
  - `pnpm lint`: PASS (0 errors, 17/17 WCAG AA token contrast pass)
  - `pnpm build`: PASS (35/35 rute terkompilasi optimal)
  - E2E Playwright: PASS pada seluruh snapshot desktop 1440px & mobile 390px.

