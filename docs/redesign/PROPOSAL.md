# PROPOSAL PEROMBAKAN TATA LETAK MENYELURUH (MASTER REDESIGN PROPOSAL)
**Website Publik & Sistem Backoffice Yayasan Sahabat Aksara**  
*Berdasarkan Skill UI/UX Pro Max (`--variance 8`, `--motion 8`, `--density 3`), Kaidah Antislop, dan Dokumen Resmi Kerangka Yayasan 104457*

---

## 1. Sistem Bersama (Shared Design System)

Sebelum merombak halaman spesifik, seluruh antarmuka disatukan dalam satu bahasa desain yang konsisten, namun **komposisi setiap halaman berbeda** untuk menghindari template AI yang membosankan.

### A. Shell Publik (Navbar & Footer)
- **Navbar Publik**:
  - Desktop (1440px): Mengambang transparan di atas hero gelap, bertransisi halus (*blur & solid background*) saat scroll. Memuat Logo Sahabat Aksara, 6 menu terstruktur (*Tentang, Program, Sebaran, Laporan, Donasi, Dokumentasi*), dan tombol CTA "Donasi" bergradien emas.
  - Mobile (390px): Header ramping 56px dengan logo dan burger menu; saat ditekan membuka *fullscreen overlay* hijau zamrud dengan transisi stagger list menu yang elegan.
- **Footer Publik**:
  - Latar `--green-950` solid dengan ornamen geometri Islam samar (khatam 8 sudut).
  - Garis ganda emas tipis di bagian atas.
  - Tiga kolom asimetris: (1) Profil yayasan, SK Kemenkumham & NPWP resmi, (2) Rekening resmi Bank BCA dengan fitur 1-klik salin instan, (3) Kontak WhatsApp narahubung & tautan media sosial resmi.

### B. Pola Header Halaman Dalam (Subpage Header Pattern)
- Menghindari hero gradien polos atau banner kaku.
- Menggunakan latar `--green-950` terstruktur dengan ketinggian proporsional (240px–320px).
- Memuat breadcrumb kontekstual (*Beranda / Program / Infak Jinan*), judul utama dengan font display **Fraunces**, dan subjudul naratif ringkas yang ramah pembaca tanpa pill/kapsul berulang.

### C. Komponen Interaktif Terpadu
- **Tabel Publik & Admin**: Header lengket (*sticky header*), kolom zebra `--sage-100` halus, kontras baris AA, dan mode kartu modular pada mobile.
- **Form & Select**: Label selalu eksplisit (tidak hanya placeholder), border `--cream-200` tegas, focus ring emas 2px, feedback error inline di bawah field (bukan alert popup).
- **Lightbox Dokumentasi**: Dialog modal tanpa backdrop-blur berlebihan; navigasi panah keyboard kiri/kanan, tombol tutup esc, dan takarir foto jelas.

---

## 2. Proposal Tata Letak Halaman Publik

---

### 2.1 Beranda (`/`)
> **Tujuan Halaman**: Pintu gerbang utama memperkenalkan visi, bukti sebaran Al-Qur'an, dan mengajak donasi keumatan.

#### [ARAH A - Terpilih]: Editorial Archival & Storytelling ("The Living Ledger")
- **Pola**: 7 Section terarah dengan rasio asimetris 7:5 dan 8:4, ritme kontras tinggi (*Full-bleed Green-950* selang-seling dengan *Warm Cream-50*), pilar editorial modular (tanpa 4 kartu seragam), dan bukti peta sebaran sebagai jangkar visual.
- **Wireframe Desktop (1440px)**:
```
+--------------------------------------------------------------------------------------+
| [NAVBAR] Logo Sahabat Aksara           Tentang  Program  Sebaran  Laporan  [DONASI]   |
+--------------------------------------------------------------------------------------+
| [SECTION 1: HERO DISPLAY - Asimetris 7:5 (Green-950)]                                |
|  MENEBAR CAHAYA AL-QUR'AN,                 +--------------------------------------+  |
|  MEMAKMURKAN RUMAH ALLAH                   | [COVER MUSHAF CUSTOM - MIHRAB FRAME] |  |
|  DI PELOSOK NUSANTARA                      | "Donasi dari: Inayah Binti Kartoni"  |  |
|  Gerakan 1 Juta Mushaf & Geber Masjid.     | Mushaf ke-1 | Tersalurkan ke Cirebon |  |
|  [Salurkan Donasi (Emas)] [Data Sebaran]   +--------------------------------------+  |
+--------------------------------------------------------------------------------------+
| [SECTION 2: PROOF & MARQUEE STRIP] 1 Jt Target | 12 Masjid | 4 Wilayah | 1.200 Santri|
| --- MARQUEE A - K - S - A - R - A (Al-Qur'an, Kemanusiaan, Sinergi, Akhlak...) -----  |
+--------------------------------------------------------------------------------------+
| [SECTION 3: EMPAT PILAR ASIMETRIS (Cream-50, 7:5)]                                   |
|  [Kiri 7 Kolom: Visi & Narasi Lapang]      [Kanan 5 Kolom: Modular Bento]            |
|  "Empat Pilar Membangun Peradaban"         - 01. Spiritual (Jinan, BUSS, Geber)      |
|  Dedikasi terpadu untuk umat.              - 02. Sosial (Yatim & Bencana)            |
|  [Pelajari Makna Filosofis Logo ->]        - 03 & 04. Pendidikan & Teknologi         |
+--------------------------------------------------------------------------------------+
| [SECTION 4: PROGRAM UTAMA FOCUS (Sage-100)]                                          |
|  [Card 1 (7 Kolom): Infak 1 Jt Mushaf Jinan] [Card 2 (5 Kolom): Beasiswa BUSS Santri]|
|  [Strip Akses 6 Program Lainnya: Geber, Tasmi' 30 Juz, Yatim, IT, UMKM, Bencana]    |
+--------------------------------------------------------------------------------------+
| [SECTION 5: LIVE BUKTI SEBARAN NASIONAL (Green-950)] PETA INTERAKTIF NUSANTARA       |
|  [Buka Seluruh Ledger Data Sebaran & Santri Penerima ->]                            |
+--------------------------------------------------------------------------------------+
| [SECTION 6: KISAH FOUNDER & AUDIT TRANSPARANSI (Cream-100, 2-Column)]                |
|  [Foto Mihrab 3:4 Ahmad Dahlan]  |  [Narasi Perjalanan] + [Mini Kartu Audit Laporan] |
+--------------------------------------------------------------------------------------+
| [SECTION 7: GRAND CALL TO ACTION (Green-950)] Rekening BCA & Konfirmasi Donasi WA    |
+--------------------------------------------------------------------------------------+
```

#### [ARAH B]: Monumental Trust & Transparency ("Command Impact Hub")
- **Pola**: Menempatkan live telemetry widget dan peta sebaran di urutan kedua tepat di bawah hero, menggunakan Bento Grid modular untuk 8 program.

---

### 2.2 Data Sebaran Donasi (`/data-sebaran`)
> **Tujuan Halaman**: Command center transparansi penyaluran donasi melalui peta nusantara dan 3 tab ledger (Jinan, BUSS, Yatim).

#### [ARAH A - Terpilih]: Command Center Transparansi ("Unified Ledger & Geo Hub")
- **Pola**:
  - *Top Metric Strip* monolitik 4 indikator (Mushaf, Santri, Wilayah, Verifikasi).
  - *Interactive Map Stage* rasio sinematik 21:9 dengan filter pulau.
  - *Sticky Filter Toolbar* yang menempel di atas layar saat menggulir tabel panjang.
  - *Frozen Columns Desktop Table*: Kolom Nomor dan Donatur/Mushaf beku (`sticky left`) saat menggeser tabel ke arah santri dan alamat.
  - *Mobile Card View*: Kartu modular dengan tombol aksi santri ramah jempol (min. 48px).
- **Wireframe Desktop (1440px)**:
```
+--------------------------------------------------------------------------------------+
| [HERO HEADER DATA SEBARAN - Green-950] Data Sebaran & Peta Penyaluran Amanah         |
+--------------------------------------------------------------------------------------+
| [KPI METRIC STRIP: 100 Mushaf | 18 Santri Terbina | 4 Wilayah | 100% Terverifikasi]  |
+--------------------------------------------------------------------------------------+
| [TAB SWITCHER: Infak Al-Qur'an Jinan | Program BUSS Al-Qur'an | Program Yatim]       |
+--------------------------------------------------------------------------------------+
| [PETA SEBARAN NUSANTARA - ASPECT 21:9] Titik Koordinat Penyaluran Aktif              |
+--------------------------------------------------------------------------------------+
| [STICKY FILTER BAR: Cari Nama/Pesantren | Dropdown Wilayah | Urutkan | Reset]        |
+--------------------------------------------------------------------------------------+
| [TABEL 10 KOLOM DENGAN FROZEN LEFT COLUMNS]                                          |
| [No] [Donatur & Mushaf (BEKU)] | [Dedikasi] [Pesantren] [Peta] [Santri] [Foto]       |
| 1    | Inayah Binti Kartoni     | Almarhum  | Ponpes A   | [Map] | 3 Santri| [Lihat]    |
|      | Mushaf ke-1              | Ayahanda  | Cirebon    |       | (Tautan)|            |
+--------------------------------------------------------------------------------------+
| [PAGINASI SERVER-SIDE: < Sebelumnya  1 2 3 ...  Selanjutnya >]                       |
+--------------------------------------------------------------------------------------+
```

#### [ARAH B]: Split Editorial ("Dual-Pane Explorer")
- **Pola**: Split View 5:7 pada desktop (Peta sticky di kiri, ledger tabel semi-kartu scrollable di kanan).

---

### 2.3 Halaman Detail Donasi Santri (`/data-sebaran/infak-jinan/[id]`)
> **Tujuan Halaman**: Lembar verifikasi detail donasi per mushaf dan tabel perkembangan hafalan santri penerima manfaat.

- **Pola Tata Letak (Direkomendasikan)**:
  - Header ringkasan donasi bergaya paspor wakaf: Nama donatur ("Hamba Allah" / Nama Asli), Nomor Mushaf ke-N, Asal, Pesantren, Titik Maps, dan Foto serah terima.
  - Tabel Daftar Santri Penerima Manfaat: Kolom Nomor, Nama Santri (Nomor HP disaring ketat dari server), Surat & Ayat Hafalan Terkini, Juz Otomatis.
  - Tombol aksi "Riwayat Hafalan" di tiap santri membuka drawer timeline bulanan.
  - Tombol kembali sticky yang menjaga status filter tabel sebelumnya.

```
+--------------------------------------------------------------------------------------+
| [BREADCRUMB: Data Sebaran / Infak Jinan / Mushaf ke-1]                               |
| [RINGKASAN DONASI MUSHAF KE-1 - Panel Latar Hijau Tua / Krem]                        |
|  Donatur: Inayah Binti Kartoni &bull; Asal: Cirebon &bull; Dedikasi: Almarhum Ayahanda|
|  Penerima: Ponpes Al-Huffazh 2 Cirebon &bull; Disalurkan: 15 Januari 2026            |
|  [Buka Titik Google Maps] [Lihat Foto Serah Terima]                                  |
+--------------------------------------------------------------------------------------+
| [TABEL SANTRI PENERIMA MANFAAT] (3 Santri Terdaftar)                                 |
| [No] [Nama Santri]         [Hafalan Terupdate]    [Juz]      [Aksi Riwayat]          |
| 1    | Muhammad Fatih      | QS. Al-Baqarah: 141  | Juz 2    | [Lihat Linimasa ->]   |
| 2    | Ahmad Raihan        | QS. Ali 'Imran: 55   | Juz 3    | [Lihat Linimasa ->]   |
+--------------------------------------------------------------------------------------+
```

---

### 2.4 Tentang Kami (`/tentang`)
> **Tujuan Halaman**: Memaparkan sejarah otentik pendiri Ahmad Dahlan, fokus 4 pilar, serta makna filosofis nama & logo yayasan.

- **Pola Tata Letak (Direkomendasikan)**:
  - *Section 1: Hero Profil & Legalitas Resmi*: Pernyataan misi Yayasan Ajirasa Aksara Semesta (Sahabat Aksara) dengan akta & SK Kemenkumham transparan.
  - *Section 2: Scrollytelling Kisah Founder*: Foto Ahmad Dahlan dalam bingkai mihrab menempel tetap (*sticky*) di sisi kiri, sementara sisi kanan menggulirkan linimasa perjuangan: MA Al-Huffazh 2 Gedongan Cirebon -> Paket C -> PTIQ Jakarta -> Lahirnya yayasan.
  - *Section 3: Makna Filosofis Nama A-K-S-A-R-A*: Huruf besar emas berkarakter; interaksi hover/klik memunculkan penjelasan nilai.
  - *Section 4: Makna Filosofis Logo Interaktif*: Logo besar di tengah dengan hotspot interaktif berdenyut (Tangan menopang globe, buku terbuka, tunas hijau, cincin ganda emas).

---

### 2.5 Halaman Program Indeks & Detail (`/program` & `/program/[slug]`)
> **Tujuan Halaman**: Menampilkan 8 program aksi resmi lembaga dalam etalase terstruktur berbasis pilar khidmat serta rincian partisipasinya.

- **Pola Tata Letak Indeks (`/program`)**:
  - Dikelompokkan berdasarkan 4 Pilar (bukan 8 kartu identik acak):
    * Kelompok Spiritual (Jinan, BUSS, Geber, Tasmi') - Tampilan Asimetris Utama.
    * Kelompok Sosial (Yatim Berdikari, Tematik Bencana).
    * Kelompok Pendidikan & Teknologi (Pelatihan IT Santri, UMKM, 6 Aplikasi Qu).
- **Pola Tata Letak Detail (`/program/[slug]`)**:
  - Split Hero: Foto dokumentasi asli dalam bingkai mihrab di kiri, formulir ringkas & kalkulator biaya donasi di kanan.
  - Tiga tab isi: *Ikhtisar & Dalil*, *Poin Dampak & Sasaran*, *Cara Berpartisipasi & Penyaluran*.
  - Sticky Bottom Bar di mobile untuk tombol donasi langsung.

---

### 2.6 Portofolio Produk Aplikasi (`/portofolio`)
> **Tujuan Halaman**: Menampilkan 6 aplikasi digital Qu sebagai kontribusi nyata pilar teknologi yayasan bagi umat.

- **Pola Tata Letak (Direkomendasikan)**:
  - Menampilkan 6 aplikasi resmi (*KajianQu, Bank Saku Digital, DiaryQu, E-AbsensiQu, DKM MasjidQu, SapawargaQu*).
  - Menggantikan kartu template biasa dengan **Editorial Device Showcase**: Mockup layar handphone presisi (SVG/CSS wireframe elegan), takarir fitur utama, status versi APK/Play Store, dan tombol "Pelajari Ekosistem Aplikasi".

---

### 2.7 Laporan Penyaluran & Detail (`/laporan` & `/laporan/[slug]`)
> **Tujuan Halaman**: Indeks akuntabilitas publik memuat laporan keuangan, realisasi program, dan berkas audit PDF transparan.

- **Pola Tata Letak Indeks (`/laporan`)**:
  - Baris ringkasan total dana tersalurkan dan total penerima manfaat teragregasi.
  - Filter tahun dan filter kategori program.
  - Kartu laporan editorial berukuran bervariasi: Laporan tahunan/kuartal utama berukuran lebar penuh, laporan kegiatan tematik dalam grid 2 kolom.
- **Pola Tata Letak Detail (`/laporan/[slug]`)**:
  - Lembar audit resmi: Periode, PIC pelaksana, rincian alokasi anggaran, ringkasan capaian santri/masjid, galeri dokumentasi foto, dan tombol unduh dokumen PDF resmi.

---

### 2.8 Info Donasi & Dokumentasi (`/donasi` & `/dokumentasi`)
> **Tujuan Halaman**: Pusat kemudahan berdonasi, informasi rekening resmi, donasi bencana tematik, dan arsip visual kegiatan lapangan.

- **Pola Tata Letak Donasi (`/donasi`)**:
  - Panel Rekening Bank Resmi (BCA a.n. Yayasan Ajirasa Aksara Semesta) dengan tombol salin satu-klik dan toast konfirmasi.
  - Tombol WhatsApp Konfirmasi Otomatis dengan pre-filled message rapi.
  - Kampanye Donasi Tematik Nusantara (Bencana alam NTT, gempa, banjir) dengan progress bar dana terkumpul.
  - Fiqih transparansi donasi (pemberitahuan privasi "Hamba Allah").
- **Pola Tata Letak Dokumentasi (`/dokumentasi`)**:
  - Masonry grid visual dengan filter kategori program (Jinan, Geber, Tasmi', Sosial).
  - Setiap foto dapat diklik membuka Lightbox resolusi tinggi dengan takarir tempat dan tanggal kegiatan.

---

### 2.9 Halaman Error & 404 (`src/app/not-found.tsx` & `error.tsx`)
> **Tujuan Halaman**: Menuntun pengguna yang tersesat atau mengalami kendala sistem kembali dengan tenang dan bermartabat.

- Ornamen lengkung mihrab emas samar di latar belakang.
- Pesan hangat berbahasa Indonesia: *"Halaman yang Anda Cari Sedang Dalam Ikhtiar Perbaikan atau Tidak Ditemukan."*
- Tombol navigasi cepat: "Kembali ke Beranda" (Emas) dan "Buka Data Sebaran" (Sekunder).

---

## 3. Proposal Tata Letak Admin Backoffice (`/admin`)

Khusus admin, tata letak dirancang sebagai **alat kerja operasional yang cepat, padat, dan akurat**, tanpa animasi lambat atau hiasan berlebih.

---

### 3.1 Shell Admin (Navigasi & Tata Letak Kerja)

#### [ARAH A - Terpilih]: Ergonomic Sidebar Layout ("The Operational Command")
- **Pola**:
  - Sidebar vertikal tetap di sisi kiri (lebar 260px pada desktop, dapat dilipat/collapse menjadi ikon 72px).
  - Mengelompokkan menu berdasarkan alur kerja pengurus:
    1. *Operasional Donasi*: Infak Jinan (+ Santri), Update Hafalan Santri, Geber Masjid, BUSS, Yatim.
    2. *Akuntabilitas*: Laporan Penyaluran, Dokumentasi Galeri, Donasi Tematik.
    3. *Sistem*: Pengaturan Rekening/Kontak, Pembersih File Yatim (Storage Cleaner), Logout.
  - Header atas ringkas memuat identitas admin login dan indikator status sinkronisasi.
  - Area kerja utama luas (*fluid full-width*) dengan padding efisien.
  - Mobile (390px): Sidebar menjadi off-canvas drawer dengan target sentuh jempol minimum 48px.

```
+--------------------------------------------------------------------------------------+
| [SIDEBAR KIRI (260px)]       | [TOPBAR: Breadcrumb Admin / Profil Admin / Logout]    |
| Sahabat Aksara Admin         +-------------------------------------------------------+
|                              | [AREA KERJA UTAMA (FLUID)]                            |
| [DASHBOARD]                  |                                                       |
|                              |                                                       |
| --- OPERASIONAL DATA ---     |                                                       |
| [x] Infak Jinan & Santri     |                                                       |
| [ ] Update Hafalan Bulanan   |                                                       |
| [ ] Geber Masjid             |                                                       |
| [ ] Program BUSS             |                                                       |
|                              |                                                       |
| --- PUBLIKASI & LAPORAN ---  |                                                       |
| [ ] Laporan Penyaluran       |                                                       |
| [ ] Dokumentasi Galeri       |                                                       |
|                              |                                                       |
| --- SISTEM & STORAGE ---     |                                                       |
| [ ] Pengaturan Website       |                                                       |
| [ ] Bersihkan File Orphan    |                                                       |
+------------------------------+-------------------------------------------------------+
```

#### [ARAH B]: Monolithic Topbar Layout
- **Pola**: Navigasi horizontal penuh di bagian atas dengan sub-menu ribbon di bawahnya.

---

### 3.2 Dashboard Ringkas Admin (`/admin`)
> **Tujuan Halaman**: Menampilkan ringkasan operasional dan daftar tindakan mendesak (*actionable items*) bagi pengurus.

- **Komposisi Layout**:
  - Baris Atas: 3 Kotak Aksi Prioritas (Bukan sekadar statistik pajangan):
    1. *Draft Menunggu Publish* (Jumlah donasi/laporan berstatus draft yang butuh verifikasi rilis).
    2. *Donasi Belum Ada Santri* (Peringatan data donasi terbit yang belum memiliki baris santri penerima).
    3. *Peringatan Storage Orphan* (Jumlah file gambar lokal/blob yang tidak terikat record database).
  - Baris Tengah: Tindakan Cepat (Tombol besar 1-klik: `+ Donasi Jinan Baru`, `+ Input Hafalan Cepat`, `+ Buat Laporan`).
  - Baris Bawah: Log 5 Aktivitas Entri Data Terakhir dengan status draft/published yang jelas.

---

### 3.3 Daftar & Form Donasi Infak Jinan (`/admin/infak`, `/admin/infak/new`, `[id]`)

#### A. Halaman Daftar Donasi (`/admin/infak`)
- Tabel data berdensitas tinggi:
  - Header sticky dengan opsi pencarian instan (nama donatur, mushaf ke-, pesantren).
  - Filter cepat: Semua, Draft, Published.
  - Kolom tabel: No, Mushaf ke-, Nama Donatur, Pesantren, Santri Terkait, Foto, Status (Ikon CheckCircle hijau / Clock oranye), dan Tombol Aksi (Edit, Update Hafalan, Hapus).
  - Tombol Aksi Massal: Terbitkan yang dipilih, Ekspor CSV, Impor CSV.

#### B. Form Input/Edit Donasi (`/admin/infak/new` & `[id]`)

##### [ARAH A - Terpilih]: Accordion Section with Sticky Action Bar
- Form dibagi menjadi 4 seksi terstruktur yang dapat dilipat/dibuka:
  1. **Seksi 1: Informasi Donasi & Pewakaf**: Mushaf No (otomatis/manual unik), Nama Donatur, Tampilkan Nama ke Publik (Checkbox), Nomor HP Donatur (Privasi khusus admin), Asal Donatur, Dedikasi Nama di Cover.
  2. **Seksi 2: Pesantren Tujuan Penyaluran**: Nama Pesantren/Madrasah, Alamat Lengkap, Tautan Google Maps, Tanggal Penyaluran.
  3. **Seksi 3: Santri Penerima Manfaat (Repeater Dinamis)**:
     - Daftar baris santri yang dapat ditambah/dihapus/diurutkan secara instan.
     - Setiap baris santri memuat: Nama Santri, No. HP Santri (Privasi khusus admin), Pilihan Surat Awal (Dropdown 114 surah), Ayat, dan Juz Otomatis.
  4. **Seksi 4: Dokumentasi Foto (Upload-on-Save)**:
     - Drag-and-drop foto serah terima dengan pratinjau lokal `URL.createObjectURL` (file fisik baru diunggah saat formulir berhasil disimpan).
- **Sticky Bottom Action Bar**: Tombol Simpan Draft dan Terbitkan selalu menempel di bawah layar saat pengurus mengisi form panjang, lengkap dengan indikator *"Perubahan belum disimpan"*.

```
+--------------------------------------------------------------------------------------+
| FORMULIR PENYALURAN INFAK JINAN (MUSHAF KE-N)                                         |
+--------------------------------------------------------------------------------------+
| [SEKSI 1: DATA DONATUR & MUSHAF] (Bisa di-collapse)                                  |
| Mushaf Ke-: [ 1 ]       Nama Donatur: [ Inayah Binti Kartoni ]                        |
| [x] Tampilkan nama di publik (Jika unchecked -> tampil "Hamba Allah")                 |
| No. HP Donatur (Admin Only): [ 08123456789 ]   Asal: [ Cirebon ]                     |
| Dedikasi Cover: [ Untuk Almarhum Ayahanda tercinta ]                                  |
+--------------------------------------------------------------------------------------+
| [SEKSI 2: PESANTREN TUJUAN & LOKASI]                                                 |
| Nama Pesantren: [ Pondok Pesantren Al-Huffazh 2 ]                                     |
| Alamat: [ Jl. KH. Wahid Hasyim, Gedongan, Klangenan, Cirebon ]                        |
| Link Google Maps: [ https://maps.google.com/?q=... ]   Tgl: [ 15/01/2026 ]           |
+--------------------------------------------------------------------------------------+
| [SEKSI 3: DAFTAR SANTRI PENERIMA MANFAAT]                                             |
| +----------------------------------------------------------------------------------+ |
| | No | Nama Santri    | No. HP (Admin) | Surah Awal     | Ayat | Juz  | Aksi       | |
| | 1  | Muh. Fatih     | 0821xxxxxxx    | [Al-Baqarah v] | [141]| Jz 2 | [Hapus]    | |
| | 2  | Ahmad Raihan   | 0857xxxxxxx    | [Ali 'Imran v] | [55] | Jz 3 | [Hapus]    | |
| +----------------------------------------------------------------------------------+ |
| [ + Tambah Baris Santri Penerima ]                                                   |
+--------------------------------------------------------------------------------------+
| [SEKSI 4: DOKUMENTASI PENYERAHAN (UPLOAD-ON-SAVE)]                                   |
| [ Kotak Drop Foto: Pratinjau Gambar Lokal ] (File baru diunggah saat tombol simpan)   |
+--------------------------------------------------------------------------------------+
| [STICKY BOTTOM BAR: Status: Draft | [Batal] [Simpan Draft] [Terbitkan Sekarang (Emas)]|
+--------------------------------------------------------------------------------------+
```

##### [ARAH B]: Multi-Step Tabbed Stepper
- Form dibagi menjadi 3 tab langkah terpisah (Langkah 1: Donasi -> Langkah 2: Santri -> Langkah 3: Foto & Review).

---

### 3.4 Halaman Update Hafalan Bulanan Santri (`/admin/infak/santri/hafalan`)
> **Tujuan Halaman**: Dirancang untuk kecepatan entri data pembaruan hafalan bulanan bagi puluhan santri binaan.

- **Pola Tata Letak (Direkomendasikan)**:
  - Filter berdasarkan Bulan/Tahun dan Pesantren.
  - Tabel entri langsung (*Inline Grid Editing*):
    - Kolom: Nama Santri, Pesantren, Mushaf Terkait, Update Bulan Lalu (mis. Al-Baqarah: 100), Input Surat Terkini (Dropdown 114 surah), Input Ayat Terkini, Saran Juz Otomatis, dan Tanggal Update.
  - Tombol Cepat: *"Salin Update Bulan Lalu"* (berguna untuk santri yang sedang muraja'ah juz yang sama).
  - Tombol *"Simpan Semua Pembaruan Bulanan"* di pojok kanan atas.

---

### 3.5 Rute Admin Pendukung Lainnya
- **Geber Masjid, BUSS, Yatim Berdikari**: Tabel administrasi bersih dengan status draft/published dan form input modal/halaman baru.
- **Laporan & Dokumentasi**: Editor laporan dengan upload cover, kalkulasi penerima manfaat, dan upload lampiran berkas PDF audit.
- **Pengaturan & Storage Cleaner (`/admin/pengaturan` & `/admin/pengaturan/storage`)**:
  - Tab Pengaturan: Rekening Bank (BCA), Narahubung WA, Akun Medsos, Mitra.
  - Tab Storage Cleaner: Indikator kesehatan Vercel Blob / Local Storage, tabel audit berkas orphan, dan tombol aman *"Bersihkan File Orphan Sekarang"*.
- **Login Admin (`/admin/login`)**:
  - Halaman login minimalis dengan bingkai mihrab di tengah, form email & password berlabel jelas, proteksi rate limit, tanpa link registrasi publik.

---

## 4. Rekomendasi Eksekusi & Pilihan

Untuk memulai perombakan menyeluruh bertahap (Langkah 1 s/d 10):
1. **Beranda**: **Arah A (Editorial Archival & Storytelling)** — *Sudah selesai diterapkan & lolos build*.
2. **Data Sebaran**: **Arah A (Command Center Transparansi)** — Peta 21:9 + Frozen Left Columns + Mobile Modular.
3. **Shell Admin**: **Arah A (Ergonomic Sidebar Layout)** — Sidebar kerja vertikal 260px yang rapi dan lapang.
4. **Form Donasi Admin**: **Arah A (Accordion Section with Sticky Action Bar)** — 4 Seksi runtut dengan repeater santri inline dan upload-on-save.

---

## 5. Titik Berhenti Menunggu Persetujuan

Sesuai instruksi Langkah 4 (GANTI), kami **BERHENTI DI SINI** dan menunggu konfirmasi persetujuan dari Anda:
- Apakah Anda menyetujui arah rekomendasi di atas (Beranda A, Sebaran A, Shell Admin A, Form Donasi A, beserta pola halaman lainnya)?
- Atau ada koreksi/penyesuaian khusus pada halaman tertentu sebelum kami memulai eksekusi bertahap dari Langkah 1 (Sistem Bersama)?
