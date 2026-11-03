export interface PortfolioApp {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  features: string[];
  mockupIcon: string;
  status: "Coming Soon";
  playStoreUrl?: string;
  webUrl?: string;
}

export const portfolioContent: PortfolioApp[] = [
  {
    id: "kajianqu",
    name: "KajianQu",
    category: "Media Dakwah & Audio",
    tagline: "Arsip Kajian & Siaran Langsung Majelis Taklim dalam Genggaman",
    description:
      "Aplikasi pemutar audio dakwah berkualitas tinggi yang menghimpun rekaman taklim tematik, murottal Al-Qur'an 30 juz, serta notifikasi jadwal majlis ilmu terdekat di sekitar pengguna.",
    features: [
      "Streaming audio hemat kuota & fitur unduh offline",
      "Jadwal majlis taklim berbasis lokasi terdekat",
      "Rangkuman materi tausiyah & catatan kajian interaktif",
      "Integrasi tanya-jawab asatidz secara terverifikasi",
    ],
    mockupIcon: "Radio",
    status: "Coming Soon",
    playStoreUrl: "Akan segera tersedia di Google Play Store",
  },
  {
    id: "banksaku",
    name: "Bank Saku Digital",
    category: "Finansial Syariah & Komunitas",
    tagline: "Manajemen Tabungan Santri & Transaksi Ekosistem Pesantren Non-Tunai",
    description:
      "Platform pencatatan keuangan syariah untuk memantau saku uang jajan santri oleh orang tua dari rumah, dilengkapi fitur dompet digital tertutup (closed-loop) yang aman dari riba.",
    features: [
      "Monitoring saldo & riwayat jajan santri real-time",
      "Limit harian belanja santri di koperasi pesantren",
      "Autodebit infak jumat & sedekah berkala",
      "Pencatatan kas kelas dan tabungan qurban",
    ],
    mockupIcon: "Wallet",
    status: "Coming Soon",
    playStoreUrl: "Akan segera tersedia di Google Play Store",
  },
  {
    id: "diaryqu",
    name: "DiaryQu",
    category: "Ibadah Harian & Kebiasaan",
    tagline: "Mutaba'ah Yaumiyah & Pengawal Konsistensi Tilawah Qur'ani",
    description:
      "Buku catatan harian spiritual untuk mencatat lembar tilawah, sholat tepat waktu, puasa sunnah, serta zikir pagi-petang. Dirancang dengan visual yang menenangkan tanpa iklan yang mengganggu kekhusyukan.",
    features: [
      "Jurnal tilawah harian dengan target one-day-one-juz",
      "Checklist mutaba'ah yaumiyah lengkap dengan pengingat adzan",
      "Catatan tadabbur ayat Al-Qur'an dan doa harian",
      "Grafik perkembangan konsistensi ibadah bulanan",
    ],
    mockupIcon: "BookCheck",
    status: "Coming Soon",
    playStoreUrl: "Akan segera tersedia di Google Play Store",
  },
  {
    id: "eabsensiqu",
    name: "E-AbsensiQu",
    category: "Pendidikan & Lembaga",
    tagline: "Sistem Kehadiran Cerdas Santri & Dewan Guru Berbasis Geofencing",
    description:
      "Solusi otomatisasi pencatatan kehadiran santri pada halaqah tahfidz dan asatidz di sekolah Islam terpadu. Dilengkapi verifikasi lokasi presisi untuk memastikan kedisiplinan dan transparansi laporan ke wali murid.",
    features: [
      "Geofencing radius area pondok & ruang halaqah",
      "Notifikasi otomatis ke WhatsApp wali santri saat hadir/izin",
      "Manajemen jadwal piket pengajar dan rekapitulasi honor jam mengajar",
      "Ekspor laporan rekapitulasi kehadiran PDF & Excel otomatis",
    ],
    mockupIcon: "ScanFace",
    status: "Coming Soon",
    playStoreUrl: "Akan segera tersedia di Google Play Store",
  },
  {
    id: "dkm-masjidqu",
    name: "DKM MasjidQu",
    category: "Tata Kelola Rumah Ibadah",
    tagline: "Transparansi Kas, Jadwal Khotib, & Inventaris Masjid Modern",
    description:
      "Perangkat lunak berbasis web dan mobile untuk pengurus Dewan Kemakmuran Masjid (DKM). Mengelola pembukuan infak kotak amal secara transparan, jadwal imam-khotib, serta layanan konsultasi jamaah lingkungan.",
    features: [
      "Papan display digital infak masuk & pengeluaran kas real-time",
      "Penjadwalan khotib jumat otomatis & konfirmasi kehadiran",
      "Pencatatan inventaris alat kebersihan Geber Masjid",
      "Penyebaran warta duka & undangan kajian warga jamaah",
    ],
    mockupIcon: "Building2",
    status: "Coming Soon",
    playStoreUrl: "Akan segera tersedia di Google Play Store",
  },
  {
    id: "sapawargaqu",
    name: "SapawargaQu",
    category: "Sosial Lingkungan & Guyub",
    tagline: "Jembatan Kepedulian Warga, Ronda, & Tanggap Darurat Lingkungan",
    description:
      "Aplikasi pemberdayaan tetangga untuk memudahkan koordinasi rukun tetangga, lapor warga sakit, aksi gotong royong, dan penyaluran bantuan sosial tepat sasaran di level akar rumput.",
    features: [
      "Tombol darurat (Panic Button) keamanan & medis cepat tanggap",
      "Sensus data dhuafa lingkungan untuk pemerataan santunan",
      "Forum musyawarah warga transparan & pemilihan ketua RT online",
      "Pengumuman kerja bakti bersih lingkungan berkala",
    ],
    mockupIcon: "UsersRound",
    status: "Coming Soon",
    playStoreUrl: "Akan segera tersedia di Google Play Store",
  },
];
