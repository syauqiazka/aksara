-- Seed Data for Sahabat Aksara

-- 1. Infak Distributions (Data Sebaran Al-Qur'an)
insert into public.infak_distributions (mushaf_no, donor_name, show_donor_name, recipient_name, recipient_type, province, city, district, lat, lng, distributed_at, quantity, photo_url, notes, status)
values
(1, 'Inayah Binti Kartoni', true, 'Pondok Pesantren Al-Hikmah', 'pesantren', 'Jawa Barat', 'Bogor', 'Ciawi', -6.6914, 106.8522, '2026-03-15', 50, '/images/infak-mushaf-custom.jpg', 'Penyerahan perdana mushaf custom nama', 'published'),
(2, 'Keluarga Bpk. H. Sutrisno [CONTOH DATA]', false, 'Madrasah Diniyah Nurul Iman [CONTOH DATA]', 'madrasah', 'Banten', 'Serang', 'Kramatwatu', -6.0712, 106.1284, '2026-04-02', 30, null, 'Penyaluran tahap santri tahfidz', 'published'),
(3, 'Ibu Hj. Siti Rahmah [CONTOH DATA]', true, 'Masjid Jami Al-Barkah [CONTOH DATA]', 'masjid', 'Jawa Tengah', 'Magelang', 'Muntilan', -7.5812, 110.2984, '2026-04-20', 25, null, 'Program penggantian mushaf lapuk', 'published'),
(4, 'Hamba Allah [CONTOH DATA]', false, 'Pesantren Tahfidz Darul Furqon [CONTOH DATA]', 'pesantren', 'Jawa Timur', 'Malang', 'Singosari', -7.8924, 112.6684, '2026-05-10', 60, null, 'Dukungan santri baru', 'published'),
(5, 'Dr. Hendra Wijaya [CONTOH DATA]', true, 'Rumah Qur''an As-Salam [CONTOH DATA]', 'lainnya', 'DI Yogyakarta', 'Sleman', 'Ngaglik', -7.7123, 110.3842, '2026-06-01', 40, null, 'Penyaluran ke pelosok lereng Merapi', 'published'),
(6, 'Draft Mushaf Belum Publish [CONTOH DATA]', false, 'Pondok Belum Terverifikasi', 'pesantren', 'Sumatera Barat', 'Padang', 'Koto Tangah', -0.8412, 100.3421, '2026-06-15', 20, null, 'Menunggu berkas serah terima', 'draft')
on conflict (mushaf_no) do nothing;

-- 2. Geber Masjid Distributions (Gerakan Bersih-Bersih Masjid)
insert into public.geber_masjid_distributions (mosque_name, province, city, district, address, lat, lng, activity_date, participants, activity_notes, status)
values
('Masjid Agung Al-Barkah [CONTOH DATA]', 'Jawa Barat', 'Bekasi', 'Bekasi Selatan', 'Jl. Veteran No. 46', -6.2412, 106.9984, '2026-02-14', 35, 'Pembersihan karpet, sajadah, tempat wudhu, dan pengecatan ulang pagar utama.', 'published'),
('Masjid Baiturrahim [CONTOH DATA]', 'Banten', 'Tangerang Selatan', 'Pamulang', 'Jl. Raya Pamulang No. 12', -6.3421, 106.7312, '2026-03-08', 28, 'Aksi sanitasi, penggantian keset & pengharum karpet masjid jelang Ramadhan.', 'published'),
('Masjid At-Taqwa [CONTOH DATA]', 'DKI Jakarta', 'Jakarta Timur', 'Cipayung', 'Jl. Bambu Apus Raya No. 8', -6.3124, 106.8921, '2026-03-22', 42, 'Kerja bakti pembersihan kubah, toilet, dan peremajaan instalasi air wudhu.', 'published'),
('Masjid Darussalam [CONTOH DATA]', 'Jawa Barat', 'Bandung Barat', 'Padalarang', 'Jl. Kertamulya No. 15', -6.8412, 107.4912, '2026-04-18', 25, 'Geber masjid pelosok bersama pemuda karang taruna dan remaja masjid.', 'published'),
('Masjid Nurul Hidayah Draft [CONTOH DATA]', 'Jawa Tengah', 'Semarang', 'Tembalang', 'Jl. Banjarsari No. 3', -7.0512, 110.4412, '2026-05-02', 15, 'Dokumentasi belum lengkap', 'draft');

-- 3. Reports
insert into public.reports (slug, title, program, period_start, period_end, summary, body, beneficiaries, amount_idr, cover_url, status)
values
('laporan-infak-mushaf-q1-2026', 'Laporan Penyaluran 500 Mushaf Al-Qur''an Pelosok Jawa Barat & Banten', 'infak_alquran', '2026-01-01', '2026-03-31', 'Penyaluran amanah 500 mushaf Al-Qur''an custom nama ke 12 pesantren dan madrasah pelosok.', 'Alhamdulillah, puji syukur ke hadirat Allah SWT. Tim Yayasan Sahabat Aksara telah menuntaskan penyaluran 500 mushaf Al-Qur''an hafalan dengan cetak custom nama donatur/keluarga. Setiap mushaf diserahkan langsung ke santri tahfidz pelosok yang membutuhkan mushaf layak.', 850, 100000000, '/images/infak-mushaf-custom.jpg', 'published'),
('laporan-geber-masjid-ramadhan-1447h', 'Laporan Aksi Geber 20 Masjid Menyambut Bulan Suci Ramadhan', 'geber_masjid', '2026-02-01', '2026-03-10', 'Aksi bersih-bersih, pewangian karpet, dan sanitasi tempat wudhu di 20 masjid se-Jabodetabek.', 'Gerakan Bersih-Bersih Masjid (Geber Masjid) menggerakkan puluhan relawan muda untuk memastikan rumah Allah suci, nyaman, dan harum bagi para jamaah tarawih dan iktikaf.', 12000, 45000000, '/images/tasmi-30-juz-dokumentasi.jpg', 'published'),
('laporan-tasmi-30-juz-angkatan-1', 'Laporan Majlis Tasmi'' Al-Qur''an 30 Juz Bil Ghaib Sekali Duduk', 'tasmi', '2026-04-01', '2026-04-05', 'Wisuda dan penyimakan hafalan 30 juz Al-Qur''an mutqin para santri binaan.', 'Program tasmi'' 30 juz bil ghaib menguji keteguhan hafalan santri tahfidz dengan tim penyimak huffazh bersanad.', 30, 25000000, '/images/tasmi-30-juz-dokumentasi.jpg', 'published');

-- 4. Site Settings (Konfirmasi Owner Needed for final bank accounts)
insert into public.site_settings (key, value)
values
('bank_accounts', '[{"bank": "BSI (Bank Syariah Indonesia)", "number": "7283829102", "holder": "[KONFIRMASI] Yayasan Ajirasa Aksara Semesta", "branch": "KCP Jakarta"},{"bank": "Bank Mandiri", "number": "1370029384721", "holder": "[KONFIRMASI] Yayasan Sahabat Aksara", "branch": "Jakarta Thamrin"}]'::jsonb),
('contact_info', '{"whatsapp": "+6281234567890", "phone": "+62215551234", "email": "kontak@sahabataksara.id", "address": "[KONFIRMASI] Jakarta, Indonesia"}'::jsonb),
('social_links', '{"instagram": "https://instagram.com/sahabataksara.id", "youtube": "https://youtube.com/@sahabataksara", "tiktok": "https://tiktok.com/@sahabataksara"}'::jsonb)
on conflict (key) do nothing;

