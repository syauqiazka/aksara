export interface PortfolioApp {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  features: string[];
  mockupIcon: string;
  logoImage?: string;
  status: "Coming Soon";
  playStoreUrl?: string;
  webUrl?: string;
}

export const portfolioContent: PortfolioApp[] = [
  {
    id: "kajianqu",
    name: "Aplikasi KajianQu",
    category: "Pendidikan Al-Qur'an & AI",
    tagline: "Koreksi Bacaan AI & Perpustakaan Digital Kitab Kuning",
    description:
      "Aplikasi Islami komprehensif yang dirancang khusus untuk para huffazh (penghafal Al-Qur'an), penuntut ilmu, serta umat muslim yang ingin memperbaiki kualitas tilawah dan memperdalam pemahaman agama melalui kajian kitab kuning.",
    features: [
      "AI-assisted voice recognition untuk koreksi bacaan dan makharijul huruf",
      "Metode muraja'ah teruji untuk penguatan hafalan huffazh",
      "Perpustakaan digital kitab kuning dan tafsir klasik",
      "Solusi all-in-one perjalanan spiritual dan intelektual santri",
    ],
    mockupIcon: "Radio",
    logoImage: "/images/portfolio/kajianqu.webp",
    status: "Coming Soon",
    playStoreUrl: "Akan segera tersedia di Google Play Store",
  },
  {
    id: "banksaku",
    name: "Aplikasi Bank Saku Digital",
    category: "Finansial Pendidikan & Ekosistem Sekolah",
    tagline: "Sistem Tabungan Sekolah Model M-Banking Internal",
    description:
      "Aplikasi Android sistem tabungan sekolah dengan model M-Banking internal sekolah yang dapat diakses online di mana pun dan kapan pun, dilengkapi website tambahan penunjang pencatatan keuangan sekolah.",
    features: [
      "Fitur debit, kredit, dan rekening koran transaksi santri/siswa",
      "Rekomendasi kesehatan finansial otomatis bagi pengguna",
      "Pembayaran rutin sekolah: SPP, daftar ulang, dan uang gedung",
      "Fitur daftar target investasi serta website monitoring admin sekolah",
    ],
    mockupIcon: "Wallet",
    logoImage: "/images/portfolio/banksaku.webp",
    status: "Coming Soon",
    playStoreUrl: "Akan segera tersedia di Google Play Store",
  },
  {
    id: "diaryqu",
    name: "Aplikasi DiaryQu",
    category: "Manajemen Harian & Keluarga",
    tagline: "Agenda Harian, Keuangan Pribadi, & Monitoring Keluarga",
    description:
      "Media catatan sehari-hari agenda kegiatan, pencatatan pemasukan dan pengeluaran harian, ceklis kegiatan harian berhadiah (reward), serta fitur kepala rumah tangga untuk memantau posisi terkini anggota keluarga.",
    features: [
      "Pencatatan agenda kegiatan dan mutaba'ah ibadah harian",
      "Buku kas pemasukan dan pengeluaran keuangan keluarga",
      "Daftar ceklis kegiatan hari ini beserta sistem reward anak",
      "Fitur kepala rumah tangga dengan live lokasi anggota keluarga terdaftar",
    ],
    mockupIcon: "BookCheck",
    logoImage: "/images/portfolio/diaryqu.webp",
    status: "Coming Soon",
    playStoreUrl: "Akan segera tersedia di Google Play Store",
  },
  {
    id: "eabsensiqu",
    name: "Aplikasi E-AbsensiQu",
    category: "Presensi Digital Berbasis Cloud",
    tagline: "Kehadiran Modern GPS & Pengenalan Wajah Akurat",
    description:
      "Solusi digital presensi modern berbasis Android untuk instansi, perusahaan, sekolah, atau organisasi dalam mengelola kehadiran karyawan dan anggota secara akurat, real-time, dan efisien.",
    features: [
      "Pemanfaatan teknologi berbasis lokasi (GPS presisi)",
      "Verifikasi kehadiran biometrik pengenalan wajah (facial recognition)",
      "Integrasi cloud aman dan transparan tanpa manipulasi data",
      "Laporan kehadiran multi-instansi dapat diakses di mana saja",
    ],
    mockupIcon: "ScanFace",
    status: "Coming Soon",
    playStoreUrl: "Akan segera tersedia di Google Play Store",
  },
  {
    id: "dkm-masjidqu",
    name: "Aplikasi DKM MasjidQu",
    category: "Tata Kelola Rumah Ibadah",
    tagline: "Manajemen Masjid Profesional, Akuntabel, & Berbasis Jamaah",
    description:
      "Solusi berbasis digital yang dirancang khusus untuk mempermudah pengurus Dewan Kemakmuran Masjid (DKM) dalam mengelola administrasi, keuangan, kegiatan dakwah, serta mempererat komunikasi dengan jamaah secara transparan.",
    features: [
      "Administrasi surat-menyurat dan keanggotaan DKM modern",
      "Pencatatan keuangan kas masjid terbuka dan transparan bagi jamaah",
      "Penjadwalan kegiatan dakwah, khotib, dan pengajian rutin",
      "Kanal komunikasi langsung pengurus masjid dengan jamaah sekitar",
    ],
    mockupIcon: "Building2",
    status: "Coming Soon",
    playStoreUrl: "Akan segera tersedia di Google Play Store",
  },
  {
    id: "sapawargaqu",
    name: "Aplikasi SapawargaQu",
    category: "Komunitas & Pemukiman Warga",
    tagline: "Manajemen Perumahan, Warga, Fasilitas, & Kas RT/RW",
    description:
      "Platform digital terintegrasi untuk pengelola kawasan hunian (Developer, Badan Pengelola, atau Pengurus RT/RW/Cluster) dalam mengelola data warga, administrasi properti, pemeliharaan fasilitas, serta pelaporan keuangan real-time.",
    features: [
      "Database warga dan pencatatan kepemilikan properti hunian",
      "Manajemen laporan perbaikan dan pemeliharaan fasilitas lingkungan",
      "Pencatatan iuran warga dan pelaporan keuangan real-time bebas human error",
      "Jembatan komunikasi interaktif antara pengelola dan seluruh penghuni",
    ],
    mockupIcon: "UsersRound",
    status: "Coming Soon",
    playStoreUrl: "Akan segera tersedia di Google Play Store",
  },
];
