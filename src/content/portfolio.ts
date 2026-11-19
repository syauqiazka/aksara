export interface GuidebookChapter {
  title: string;
  subtitle: string;
  bullets: string[];
}

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
  // Partnership & Guidebook/Poster extensions
  partnershipNote?: string;
  hasGuidebook?: boolean;
  hasPoster?: boolean;
  guidebookSubtitle?: string;
  guidebookChapters?: GuidebookChapter[];
  posterHeadline?: string;
  posterHighlight?: string;
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
    partnershipNote: "Dapatkan dengan berinfak Al-Qur'an (Rp. 200.000,-) + Donasi Seikhlasnya",
    hasGuidebook: true,
    hasPoster: true,
    guidebookSubtitle: "Buku Panduan Teknis & Implementasi Sistem Tabungan M-Banking Sekolah",
    posterHeadline: "Sistem Tabungan Sekolah Model M-Banking Internal",
    posterHighlight: "Dapatkan dengan berinfak Al-Qur'an (Rp. 200.000,-) + Donasi Seikhlasnya",
    guidebookChapters: [
      {
        title: "Gambaran Umum & Arsitektur Sistem",
        subtitle: "Konsep dasar operasional perbankan mini berbasis digital internal sekolah",
        bullets: [
          "Aplikasi Android yang memfasilitasi santri dan siswa belajar literasi finansial islami sejak dini",
          "Dua kanal akses terintegrasi: Aplikasi mobile pengguna dan Web Console untuk bendahara sekolah",
          "Pencatatan mutasi transaksi realtime bebas selisih pembukuan kas manual",
          "Rekomendasi kesehatan finansial cerdas berdasarkan pola tabungan dan pengeluaran berkala",
        ],
      },
      {
        title: "Modul Transaksi & Pembayaran Sekolah",
        subtitle: "Kelengkapan fitur transaksi harian dan kewajiban administrasi pendidikan",
        bullets: [
          "Buku tabungan digital lengkap dengan nomor rekening internal dan cetak rekening koran",
          "Modul pembayaran rutin SPP, uang gedung, daftar ulang, serta ekstrakurikuler",
          "Fitur impian dan target investasi masa depan santri (beli kitab, laptop, atau kurban)",
          "Fitur kartu transaksi digital dengan QR Code unik per siswa untuk kemudahan verifikasi",
        ],
      },
      {
        title: "SOP Implementasi & Skema Kemitraan",
        subtitle: "Langkah pengaktifan sistem di sekolah atau pesantren mitra",
        bullets: [
          "Program kemitraan nirlaba: Dapatkan dengan berinfak Al-Qur'an (Rp. 200.000,-) + Donasi Seikhlasnya",
          "Pendampingan setup awal database santri dan pelatihan staf tata usaha / bendahara",
          "Penyediaan modul buku panduan cetak serta banner poster sosialisasi bagi wali murid",
          "Dukungan teknis dan konsultasi berkala melalui hotline resmi Yayasan Sahabat Aksara",
        ],
      },
    ],
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
    partnershipNote: "Dapatkan dengan berinfak Al-Qur'an (Rp. 200.000,-) + Donasi Seikhlasnya",
    hasGuidebook: true,
    hasPoster: true,
    guidebookSubtitle: "Buku Panduan Teknis Presensi Biometrik & Radius Geolocation Cloud",
    posterHeadline: "Solusi Presensi Modern Biometrik GPS Cloud Anti-Kecurangan",
    posterHighlight: "Dapatkan dengan berinfak Al-Qur'an (Rp. 200.000,-) + Donasi Seikhlasnya",
    guidebookChapters: [
      {
        title: "Arsitektur Geofencing & Biometrik",
        subtitle: "Pencegahan manipulasi absensi dengan validasi lokasi dan wajah ganda",
        bullets: [
          "Teknologi penandaan radius GPS sekolah/kantor dengan toleransi presisi tinggi",
          "Pencocokan biometrik wajah (facial recognition) langsung dari kamera smartphone",
          "Deteksi spoofing lokasi dan pemblokiran penggunaan fake GPS pihak ketiga",
          "Penyimpanan rekam presensi secara terenkripsi langsung ke server cloud",
        ],
      },
      {
        title: "Manajemen Shift, Cuti, & Laporan",
        subtitle: "Otomasi administrasi kepegawaian dan kehadiran santri/staf",
        bullets: [
          "Pengaturan jadwal shift kerja fleksibel, waktu toleransi keterlambatan, dan lembur",
          "Pengajuan izin, sakit, dan cuti online dengan lampiran foto bukti surat dokter",
          "Rekapitulasi otomatis bulanan siap cetak dalam format PDF dan lembar kerja Excel",
          "Notifikasi kehadiran masuk dan pulang secara otomatis ke nomor wali/pimpinan",
        ],
      },
      {
        title: "Panduan Deployment & Kemitraan",
        subtitle: "Tata cara aktivasi sistem presensi di lingkungan instansi Anda",
        bullets: [
          "Dapatkan dengan berinfak Al-Qur'an (Rp. 200.000,-) + Donasi Seikhlasnya",
          "Konfigurasi titik koordinat instansi dan import data master pengguna dalam hitungan menit",
          "Buku petunjuk pengoperasian ringkas bagi pegawai serta staf administrasi",
          "Bimbingan implementasi langsung melalui tim IT Yayasan Sahabat Aksara",
        ],
      },
    ],
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
    logoImage: "/images/portfolio/dkm-masjidqu.webp",
    status: "Coming Soon",
    playStoreUrl: "Akan segera tersedia di Google Play Store",
  },
  {
    id: "sapawargaqu",
    name: "Aplikasi SapawargaQu",
    category: "Komunitas & Pemukiman Warga",
    tagline: "Sistem Administrasi dan Pengelolaan Arus Kas Warga",
    description:
      "Platform digital terintegrasi untuk pengelola kawasan hunian (Developer, Badan Pengelola, atau Pengurus RT/RW/Cluster) dalam mengelola data warga, administrasi properti, pemeliharaan fasilitas, serta pelaporan keuangan real-time.",
    features: [
      "Database warga dan pencatatan kepemilikan properti hunian",
      "Manajemen laporan perbaikan dan pemeliharaan fasilitas lingkungan",
      "Pencatatan iuran warga dan pelaporan keuangan real-time bebas human error",
      "Jembatan komunikasi interaktif antara pengelola dan seluruh penghuni",
    ],
    mockupIcon: "UsersRound",
    logoImage: "/images/portfolio/sapawargaqu.webp",
    status: "Coming Soon",
    playStoreUrl: "Akan segera tersedia di Google Play Store",
    partnershipNote: "Dapatkan dengan berinfak Al-Qur'an (Rp. 200.000,-) + Donasi Seikhlasnya",
    hasGuidebook: true,
    hasPoster: true,
    guidebookSubtitle: "Buku Panduan Tata Kelola Lingkungan, Iuran Warga, & Kas Terbuka",
    posterHeadline: "Platform Administrasi Lingkungan & Pengelolaan Arus Kas Warga",
    posterHighlight: "Dapatkan dengan berinfak Al-Qur'an (Rp. 200.000,-) + Donasi Seikhlasnya",
    guidebookChapters: [
      {
        title: "Database Hunian & Komunikasi Warga",
        subtitle: "Digitalisasi arsip kependudukan warga RT, RW, dan komplek perumahan",
        bullets: [
          "Pencatatan data keluarga, status kepemilikan rumah (pemilik/penyewa), dan nomor darurat",
          "Kanal pengumuman resmi pengurus komplek yang langsung tampil di ponsel warga",
          "Sistem tiket laporan warga (lampu jalan mati, keamanan, sampah) dengan pelacakan progres",
          "Forum warga tertutup untuk musyawarah dan pengambilan suara mufakat warga",
        ],
      },
      {
        title: "Pengelolaan Iuran & Transparansi Kas",
        subtitle: "Sistem keuangan kas lingkungan bebas praduga dan salah catat",
        bullets: [
          "Notifikasi tagihan iuran bulanan (keamanan, sampah, pemeliharaan fasilitas) otomatis",
          "Catatan penerimaan kas realtime yang dapat dipantau oleh setiap warga secara terbuka",
          "Laporan pembukuan pengeluaran lingkungan disertai bukti kuitansi digital",
          "Rekapitulasi tunggakan iuran yang tertata rapi untuk kemudahan bendahara",
        ],
      },
      {
        title: "Alur Penerapan di Lingkungan",
        subtitle: "Panduan pengurus lingkungan mengadopsi platform SapawargaQu",
        bullets: [
          "Dapatkan dengan berinfak Al-Qur'an (Rp. 200.000,-) + Donasi Seikhlasnya",
          "Input data blok/nomor rumah dan pengurus lingkungan didampingi tim teknis yayasan",
          "Penyebaran poster sosialisasi dan modul instalasi mandiri bagi warga",
          "Layanan pendampingan penuh melalui narahubung resmi: 0822-6217-0018",
        ],
      },
    ],
  },
];
