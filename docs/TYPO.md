# Laporan Audit Ejaan dan Typo Situs Yayasan Sahabat Aksara

## 1. Kata Kunci yang Diaudit
- **Al-Qur'an**: Ditulis seragam dengan rasm resmi Indonesia `Al-Qur'an` (bukan *Al Quran* atau *Al-Quran*).
- **Infak**: Ditulis konsisten `Infak` (bukan *Infaq*), sesuai KBBI dan panduan Kementerian Agama RI.
- **Tasmi'**: Memakai tanda petik tunggal penutup konsisten.
- **Mushaf, Santri, Pesantren, Hafalan**: Terverifikasi baku.

## 2. Perubahan yang Dilakukan
1. `src/app/layout.tsx`: Memperbaiki kata kunci metadata `Infak Al-Quran Jinan` -> `Infak Al-Qur'an Jinan`, `BUSS Al-Quran` -> `BUSS Al-Qur'an`.
2. `src/components/sections/BankAccountsList.tsx`: Mengubah `Kanal Infaq Resmi Terdaftar` -> `Kanal Infak Resmi Terdaftar`.
3. `src/components/sections/InfaqCalculator.tsx`: Mengubah `Total Nilai Infaq Wakaf` -> `Total Nilai Infak Wakaf` dan `Donasi Infaq dari` -> `Donasi Infak dari`.
4. `src/components/ui/Footer.tsx`: Mengubah `Rekening Resmi Infaq` -> `Rekening Resmi Infak`.
5. Helper format tanggal baru: `src/lib/format-date.ts` (`formatTanggal(dateString)` format DD MMMM YYYY Indonesia).

