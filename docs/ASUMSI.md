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

