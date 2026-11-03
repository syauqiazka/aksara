export interface ProgramDetail {
  slug: string;
  title: string;
  pillar: string;
  shortDesc: string;
  heroImage: string;
  quote?: string;
  overview: string[];
  impactPoints: string[];
  howToJoin: string[];
  targetMushafOrGoal?: string;
  pricePerUnit?: string;
}

export const programsContent: ProgramDetail[] = [
  {
    slug: "infak-alquran",
    title: "Infak 1 Jt Al-Qur'an Custom Nama",
    pillar: "Spiritual",
    shortDesc: "Wakaf mushaf Al-Qur'an hafalan berkualitas dengan nama donatur/keluarga tercetak permanen di cover untuk santri pelosok nusantara.",
    heroImage: "/images/infak-mushaf-custom.jpg",
    quote: "Apabila manusia meninggal dunia, maka terputuslah amalnya kecuali tiga perkara: sedekah jariyah, ilmu yang bermanfaat, atau anak saleh yang mendoakannya.",
    overview: [
      "Banyak pesantren rakyat dan madrasah pelosok di tanah air yang para santrinya harus bergantian memakai mushaf yang sudah robek dan hilang beberapa halamannya.",
      "Program Infak 1 Juta Al-Qur'an hadir menyediakan mushaf baru berstandar Kementerian Agama RI dengan kertas khusus Quranic Paper (QPP) yang nyaman dibaca berjam-jam.",
      "Keistimewaan program ini: setiap mushaf dicetak dengan nama pewakaf atau almarhum/almarhumah keluarga donatur pada bagian cover, menjadi wasilah doa harian yang dipanjatkan para penghafal Al-Qur'an.",
    ],
    impactPoints: [
      "Target penyaluran: 1.000.000 mushaf ke pesantren dan pelosok kepulauan nusantara.",
      "Custom plat nama pewakaf di cover mushaf (misal: 'Donasi Infak dari: Inayah Binti Kartoni').",
      "Setiap mushaf didistribusikan langsung disertai berita acara, dokumentasi foto, dan titik koordinat GPS yang tercatat transparan.",
    ],
    howToJoin: [
      "Tentukan jumlah mushaf yang ingin Anda infakkan (Rp 200.000 / mushaf).",
      "Cantumkan nama donatur atau nama keluarga yang ingin dicetak pada cover.",
      "Pilih apakah nama ingin ditampilkan di papan sebaran publik atau sebagai Hamba Allah.",
      "Lakukan transfer ke rekening resmi yayasan dan pantau status penyaluran Anda di menu Data Sebaran.",
    ],
    targetMushafOrGoal: "1.000.000 Mushaf Al-Qur'an",
    pricePerUnit: "Rp 200.000 / Mushaf",
  },
  {
    slug: "geber-masjid",
    title: "Geber Masjid (Gerakan Bersih-Bersih Masjid)",
    pillar: "Spiritual & Sosial",
    shortDesc: "Aksi relawan terpadu membersihkan karpet, toilet, tempat wudhu, dan peremajaan fasilitas rumah ibadah di pemukiman dan pelosok.",
    heroImage: "/images/tasmi-30-juz-dokumentasi.jpg",
    quote: "Sesungguhnya yang memakmurkan masjid-masjid Allah hanyalah orang-orang yang beriman kepada Allah dan hari kemudian.",
    overview: [
      "Masjid adalah jantung peradaban kaum muslimin. Kebersihan dan keharuman masjid adalah cermin kemuliaan akhlak masyarakat di sekitarnya.",
      "Tim relawan Geber Masjid membawa peralatan sanitasi modern, mesin ekstraktor cuci karpet, cairan disinfektan ramah lingkungan, serta tenaga sukarela pemuda.",
      "Selain membersihkan, tim juga mengedukasi DKM lokal tentang manajemen perawatan fasilitas hemat energi dan ramah air.",
    ],
    impactPoints: [
      "Pembersihan menyeluruh: karpet utama, plafon, mihrab, kaca, dan tempat wudhu.",
      "Sedekah paket alat kebersihan lengkap dan pewangi tahan lama untuk takmir masjid.",
      "Menggerakkan pemuda karang taruna dan remaja masjid untuk kembali mencintai rumah Allah.",
    ],
    howToJoin: [
      "Daftarkan masjid atau musholla di lingkungan Anda yang membutuhkan aksi Geber Masjid.",
      "Bergabung menjadi relawan lapangan akhir pekan bersama tim Sahabat Aksara.",
      "Donasi perlengkapan dan operasional kebersihan masjid melalui rekening yayasan.",
    ],
    targetMushafOrGoal: "1.000 Masjid Bersih & Makmur",
  },
  {
    slug: "tasmi-30-juz",
    title: "Majlis Tasmi' Al-Qur'an 30 Juz Bil Ghaib",
    pillar: "Pendidikan & Spiritual",
    shortDesc: "Ujian dan penyimakan hafalan 30 juz Al-Qur'an sekali duduk oleh santri pilihan di hadapan dewan huffazh bersanad.",
    heroImage: "/images/tasmi-30-juz-dokumentasi.jpg",
    quote: "Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya.",
    overview: [
      "Majlis Tasmi' 30 Juz Bil Ghaib adalah puncak pembuktian mutqinnya hafalan para santri binaan beasiswa Yayasan Sahabat Aksara.",
      "Santri melantunkan ayat-ayat suci dari surat Al-Fatihah hingga An-Nas tanpa melihat mushaf, disimak secara teliti oleh asatidz bersanad qira'ah.",
      "Acara disiarkan langsung melalui platform digital agar menjadi inspirasi bagi jutaan anak muda muslim di tanah air.",
    ],
    impactPoints: [
      "Menjaga kemurnian hafalan para calon ulama dan pemimpin masa depan.",
      "Memberikan penghargaan dan sertifikat sanad bagi santri yang lulus ujian mutqin.",
      "Menumbuhkan kecintaan masyarakat luas terhadap tradisi tasmi' Al-Qur'an bil ghaib.",
    ],
    howToJoin: [
      "Kirimkan santri terbaik pondok pesantren Anda untuk mengikuti kurasi majlis tasmi'.",
      "Hadiri dan simak langsung pelaksanaan majlis tasmi' di lokasi acara atau siaran streaming.",
      "Salurkan infak beasiswa kafalah santri huffazh untuk menjamin pendidikan mereka.",
    ],
    targetMushafOrGoal: "500 Huffazh Bersanad Mutqin",
  },
  {
    slug: "pena-yatim",
    title: "PENA (Pendidikan & Santunan) Anak Yatim",
    pillar: "Pendidikan & Sosial",
    shortDesc: "Pemberian beasiswa pendidikan berkelanjutan, perlengkapan sekolah, dan pembinaan karakter qur'ani bagi anak-anak yatim dhuafa.",
    heroImage: "/images/founder-ahmad-dahlan.jpg",
    quote: "Aku dan orang yang menanggung anak yatim (kedudukannya) di surga seperti ini (beliau merapatkan dua jarinya).",
    overview: [
      "Setiap anak berhak memiliki mimpi yang tinggi. Program PENA memastikan anak-anak yatim tidak terhenti sekolahnya karena ketiadaan biaya.",
      "Bukan hanya santunan tunai berkala, program ini mendampingi anak secara holistik: bimbingan belajar, mentoring akhlak, dan akses ke pondok pesantren tahfidz.",
    ],
    impactPoints: [
      "Beasiswa SPP sekolah dan uang saku bulanan.",
      "Paket perlengkapan belajar, seragam baru, dan gizi bergizi.",
      "Camp pembinaan karakter dan kepemimpinan tahunan.",
    ],
    howToJoin: [
      "Pilih opsi Orang Tua Asuh dengan komitmen donasi rutin per bulan.",
      "Rekomendasikan anak yatim berprestasi di sekitar Anda yang membutuhkan beasiswa.",
    ],
    targetMushafOrGoal: "1.000 Anak Asuh Berkelanjutan",
  },
  {
    slug: "bela-berdikari",
    title: "Bela Berdikari (Pelatihan Keterampilan Mandiri)",
    pillar: "Sosial & Pendidikan",
    shortDesc: "Pelatihan vokasi praktis, coding dasar, servis elektronika, dan wirausaha bagi pemuda putus sekolah agar berdaya secara ekonomi.",
    heroImage: "/images/founder-ahmad-dahlan.jpg",
    overview: [
      "Terinspirasi dari kisah perjuangan founder yang bangkit dari putus sekolah, program Bela Berdikari membekali generasi muda dengan keterampilan bernilai tinggi di era modern.",
      "Peserta dibimbing langsung oleh praktisi industri hingga mampu menghasilkan karya atau mandiri membuka usaha.",
    ],
    impactPoints: [
      "Kurikulum aplikatif: literasi digital, desain grafis, coding, dan teknisi perangkat.",
      "Bantuan modal awal alat kerja untuk lulusan terbaik pelatihan.",
      "Penyaluran magang ke mitra industri dan jaringan wirausaha yayasan.",
    ],
    howToJoin: [
      "Daftar kelas pelatihan vokasi gratis untuk pemuda usia 17–25 tahun.",
      "Menjadi mentor relawan praktisi industri.",
    ],
    targetMushafOrGoal: "500 Lulusan Siap Kerja",
  },
  {
    slug: "umkm-berkah",
    title: "Pemberdayaan UMKM & Koperasi Berkah",
    pillar: "Teknologi & Sosial",
    shortDesc: "Bantuan modal usaha tanpa riba, pendampingan legalitas halal, dan integrasi digital payment untuk pedagang kecil jamaah masjid.",
    heroImage: "/images/infak-mushaf-custom.jpg",
    overview: [
      "Memperkuat ekonomi umat dari akar rumput melalui pembebasan dari jeratan pinjaman rentenir.",
      "Menggunakan akad qardhul hasan (pinjaman kebajikan) yang digulirkan secara transparan melalui sistem pencatatan aplikasi digital buatan yayasan.",
    ],
    impactPoints: [
      "Pembiayaan bergulir 100% tanpa bunga dan tanpa denda.",
      "Pendampingan sertifikasi halal dan perbaikan kemasan produk.",
      "Digitalisasi transaksi melalui QRIS dan aplikasi kasir Bank Saku Digital.",
    ],
    howToJoin: [
      "Ajukan modal usaha mikro melalui DKM masjid mitra.",
      "Investasikan dana infak produktif untuk dana bergulir pedagang kecil.",
    ],
    targetMushafOrGoal: "250 Usaha Mikro Terberdayakan",
  },
];

