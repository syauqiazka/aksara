export interface ProgramDetail {
  slug: string;
  aliases?: string[];
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
    slug: "infak-jinan",
    aliases: ["infak-alquran"],
    title: "Infak Al-Qur'an Jinan (Jelajah Langsung Infak Al-Qur'an Sampai ke Tangan)",
    pillar: "Spiritual",
    shortDesc:
      "Program Infak 1 Jt Al-Qur'an Jinan memastikan amanah infak tersampaikan langsung ke tangan para santri penghafal Al-Qur'an dengan custom nama donatur di cover dan laporan berkala.",
    heroImage: "/images/infak-mushaf-custom.jpg",
    quote:
      "Setiap huruf yang dibaca dari mushaf yang Anda infakkan akan menjadi pahala jariyah yang terus mengalir, bahkan setelah kita tiada.",
    overview: [
      "Salah satu pahala yang akan mengalir abadi adalah Amal Jariyah, seperti donasi infak Al-Qur'an untuk pesantren penghafal Al-Qur'an di seluruh Indonesia.",
      "Program Infak 1 Jt Al-Qur'an Jinan memastikan amanah infak dari para donatur tersampaikan dengan amanah langsung ke tangan para santri penghafal Al-Qur'an.",
      "Disertai data sebaran donasi infak yang memungkinkan para donatur melihat langsung sebaran keterangan tempat dan wilayah lengkap dengan nama santri penerima, progres jumlah hafalan Al-Qur'an yang diperbarui secara bulanan, serta dokumentasi kegiatan.",
      "Mari kita bersama menebar cahaya ilmu dan iman serta pahala abadi dengan ikut berkontribusi dalam program Infak 1 Jt Al-Qur'an Jinan sebesar Rp 100.000,- dengan custom nama donatur, keluarga, atau lembaga untuk disebarkan ke pesantren dan masjid di seluruh Indonesia.",
    ],
    impactPoints: [
      "Target penyaluran: 1.000.000 Mushaf Al-Qur'an untuk santri tahfidz nusantara.",
      "Custom nama donatur, keluarga, atau lembaga tercetak permanen pada cover mushaf.",
      "Data sebaran terbuka: nama santri, lokasi pesantren, progres hafalan bulanan, dan dokumentasi.",
    ],
    howToJoin: [
      "Tentukan jumlah mushaf yang ingin Anda infakkan (Rp 100.000 / mushaf).",
      "Cantumkan nama donatur, keluarga, atau dedikasi yang ingin dicetak pada cover.",
      "Pilih apakah nama ingin ditampilkan di tabel publik atau sebagai Hamba Allah.",
      "Lakukan transfer dan pantau penyaluran amanah Anda di menu Data Sebaran.",
    ],
    targetMushafOrGoal: "1.000.000 Mushaf Al-Qur'an",
    pricePerUnit: "Rp 100.000 / Mushaf",
  },
  {
    slug: "buss-quran",
    aliases: ["buss-alquran"],
    title: "Program BUSS Al-Qur'an (Bantuan Uang Saku Santri Penghafal Al-Qur'an)",
    pillar: "Spiritual & Pendidikan",
    shortDesc:
      "Skema apresiasi beasiswa uang saku bagi santri penghafal Al-Qur'an penerima mushaf Jinan agar fokus menghafal hingga khatam 30 juz tanpa terkendala biaya hidup.",
    heroImage: "/images/program-buss-alquran.webp",
    quote:
      "Apabila manusia meninggal dunia, terputuslah amalnya kecuali tiga perkara: sedekah jariyah, ilmu yang dimanfaatkan, atau anak saleh yang mendoakannya. (HR. Muslim)",
    overview: [
      "Program bantuan uang saku/beasiswa untuk santri penghafal Al-Qur'an (BUSS Al-Qur'an) merupakan skema apresiasi dan dukungan lembaga melalui para dermawan dan donatur yang menyisihkan sebagian rezekinya.",
      "Diberikan kepada para santri penghafal Al-Qur'an yang sebelumnya pernah menerima Infak Mushaf Al-Qur'an Jinan.",
      "Tersedia 4 Kategori BUSS Al-Qur'an: BUSS Kelas Ekonomis (Rp 200.000,- / Bulan), BUSS Kelas Bisnis (Rp 400.000,- / Bulan), BUSS Kelas Eksekutif (Rp 600.000,- / Bulan), dan BUSS Kelas Luxury (Rp 1.000.000,- / Bulan).",
      "Mari menjadi bagian bersejarah para penghafal Al-Qur'an dengan mensupport mereka hingga mencapai tujuan akhir (Gerbang Khatam 30 Juz) dengan update progres hafalan yang dapat dipantau secara berkala.",
    ],
    impactPoints: [
      "BUSS Kelas Ekonomis: Bantuan Uang Saku Santri Rp 200.000,- / Bulan / Santri.",
      "BUSS Kelas Bisnis: Bantuan Uang Saku Santri Rp 400.000,- / Bulan / Santri.",
      "BUSS Kelas Eksekutif: Bantuan Uang Saku Santri Rp 600.000,- / Bulan / Santri.",
      "BUSS Kelas Luxury: Bantuan Uang Saku Santri Rp 1.000.000,- / Bulan / Santri.",
      "Monitoring berkala capaian juz dan ayat hafalan santri menuju Gerbang Khatam.",
    ],
    howToJoin: [
      "Pilih kategori kelas BUSS Al-Qur'an yang ingin Anda dukung (Ekonomis, Bisnis, Eksekutif, atau Luxury).",
      "Pilih komitmen donasi rutin per bulan atau per semester.",
      "Dapatkan laporan berkala perkembangan santri tahfidz penerima beasiswa hingga khatam.",
    ],
    targetMushafOrGoal: "Santri Tahfidz Menuju Gerbang Khatam",
    pricePerUnit: "Mulai Rp 200.000 / Bulan",
  },
  {
    slug: "geber-masjid",
    title: "Gerakan Bersih Masjid (Geber Masjid)",
    pillar: "Spiritual & Sosial",
    shortDesc:
      "Aksi nyata gotong-royong merawat, membersihkan, dan memakmurkan masjid dari masjid agung hingga pelosok negeri sebagai pusat peradaban dan ibadah kaum muslimin.",
    heroImage: "/images/geber-masjid-kegiatan.webp",
    quote:
      "Masjid yang bersih, suci, rapi, dan nyaman merupakan wujud kepedulian bersama serta landasan khusyuknya setiap ibadah yang dijalankan.",
    overview: [
      "Masjid bukan hanya sekadar tempat menunaikan ibadah sholat, melainkan pusat peradaban, pembinaan umat, dan simbol kebersamaan masyarakat muslim.",
      "Masjid yang bersih, suci, rapi, dan nyaman merupakan wujud kepedulian bersama serta landasan khusyuknya setiap ibadah yang dijalankan.",
      "Mari bergabung dengan kami dengan berkontribusi nyata melalui Gerakan Bersih-Bersih Masjid, untuk bergotong-royong merawat, menjaga, menumbuhkan semangat keimanan kepada Allah SWT, sekaligus mempererat tali silaturahmi antar jamaah.",
    ],
    impactPoints: [
      "Pembersihan menyeluruh karpet, toilet, tempat wudhu, dan area utama masjid.",
      "Bantuan sarana dan perlengkapan kebersihan bagi takmir masjid.",
      "Menggerakkan partisipasi pemuda dan jamaah untuk mencintai dan memakmurkan rumah Allah.",
    ],
    howToJoin: [
      "Ajukan masjid di lingkungan Anda yang membutuhkan aksi Geber Masjid.",
      "Bergabung menjadi relawan kebersihan lapangan di akhir pekan.",
      "Donasi perlengkapan sanitasi dan kebersihan melalui kanal resmi yayasan.",
    ],
    targetMushafOrGoal: "1.000 Masjid Bersih & Makmur",
  },
  {
    slug: "tasmi-30-juz",
    title: "Majlis Tasmi' Al-Qur'an 30 Juz Bil-Ghoib",
    pillar: "Spiritual & Pendidikan",
    shortDesc:
      "Ikhtiar penguatan hafalan Al-Qur'an 30 juz utuh tanpa melihat mushaf secara estafet dalam kurun 1 hari khatam sebagai doa untuk negeri Indonesia.",
    heroImage: "/images/tasmi-30-juz-dokumentasi.jpg",
    quote:
      "Investasi peradaban untuk mencetak generasi Rabbani yang jujur, tangguh, dan menjaga kemurnian Al-Qur'an di dalam dada.",
    overview: [
      "Majlis Tasmi’ 30 Juz Bil-Ghoib adalah program ikhtiar penguatan hafalan Al-Qur'an secara utuh (sekaligus/berkelanjutan dalam satu tatanan waktu) tanpa melihat mushaf yang dibacakan para penghafal Al-Qur'an secara estafet dalam kurun 1 hari khatam.",
      "Program ini juga sekaligus menjadi ikhtiar dukungan doa untuk negeri Indonesia tercinta.",
      "Dirancang untuk menguji kelancaran, ketepatan tajwid, fashahah, serta ketahanan mental dan fisik para hafidz/hafidzah (penghafal Al-Qur'an).",
      "Dukungan penuh terhadap gerakan ini menjadi investasi peradaban untuk mencetak generasi Rabbani yang jujur, tangguh, dan menjaga kemurnian Al-Qur'an di dalam dada.",
    ],
    impactPoints: [
      "Khataman 30 juz bil-ghoib secara estafet tuntas dalam satu hari.",
      "Penyimakan teliti oleh para asatidz dan huffazh bersanad.",
      "Rangkaian doa bersama untuk keberkahan dan kedamaian bangsa Indonesia.",
    ],
    howToJoin: [
      "Dukung kafalah operasional santri peserta majlis tasmi'.",
      "Hadiri dan simak langsung pelaksanaan majlis tasmi' di lokasi acara.",
    ],
    targetMushafOrGoal: "Khataman 30 Juz Bil-Ghoib",
  },
  {
    slug: "yatim-berdikari",
    aliases: ["pena-yatim"],
    title: "Program Yatim Berdikari",
    pillar: "Sosial & Pendidikan",
    shortDesc:
      "Pemberdayaan berkelanjutan bagi remaja yatim dan piatu membekali keterampilan praktis (hard skills) dan keberanian (soft skills) menuju kemandirian finansial.",
    heroImage: "/images/founder-ahmad-dahlan.jpg",
    quote:
      "Memberikan kail, bukan sekadar ikan: memutus rantai kemiskinan dengan bekal keterampilan nyata menuju masa depan yang cerah.",
    overview: [
      "Merupakan program selain santunan yakni dengan pemberdayaan berkelanjutan yang dirancang khusus untuk membekali anak-anak yatim dan piatu khususnya usia remaja hingga usia produktif dengan keterampilan praktis (hard skills) dan karakter keberanian (soft skills).",
      "Kami percaya bahwa memberi bantuan materi belaka hanya menyelesaikan masalah sesaat. Melalui program pelatihan ini, kami berikhtiar memutus rantai ketergantungan dan kemiskinan dengan memberikan 'kail', bukan sekadar 'ikan'.",
      "Sehingga mereka mampu berkarya meraih kemandirian finansial, dan merancang masa depan yang cerah.",
    ],
    impactPoints: [
      "Pelatihan vokasi praktis sesuai bakat dan kebutuhan lapangan kerja.",
      "Pembinaan karakter mandiri, etika kerja, dan ketahanan mental.",
      "Pendampingan hingga alumni mampu menghasilkan karya dan mandiri finansial.",
    ],
    howToJoin: [
      "Salurkan donasi beasiswa pelatihan program Yatim Berdikari.",
      "Bergabung menjadi mentor industri atau relawan pengajar.",
    ],
    targetMushafOrGoal: "Anak Asuh Berdaya Mandiri",
  },
  {
    slug: "pelatihan-it",
    aliases: ["bela-berdikari"],
    title: "Beasiswa Pelatihan IT Mitra Produktif",
    pillar: "Pendidikan & Teknologi",
    shortDesc:
      "Pembinaan intensif mitra dengan Project-Based Learning dan bimbingan mentor industri hingga Exhibition & Demo Day produk karya nyata.",
    heroImage: "/images/founder-ahmad-dahlan.jpg",
    quote:
      "Mencetak talenta unggul yang tidak hanya menguasai teori, tetapi mampu melahirkan karya nyata yang inovatif dan berdaya guna bagi ummat.",
    overview: [
      "Program pembinaan intensif bagi mitra yang dirancang untuk mencetak talenta unggul yang tidak hanya menguasai teori, tetapi juga mampu melahirkan karya nyata yang inovatif dan berdaya guna.",
      "Melalui pendekatan Project-Based Learning, setiap penerima beasiswa (awardee) diarahkan untuk mengikuti pelatihan khusus terkait kurikulum praktis, bimbingan langsung dari mentor industri, serta fasilitas penuh untuk merancang, mengeksekusi, dan menyelesaikan proyek karya akhir.",
      "Karya akhir dapat berupa produk teknologi, desain UI/UX, karya seni, maupun solusi bisnis sosial.",
      "Program ini diakhiri dengan Exhibition & Demo Day sebagai ajang publikasi dan peluncuran karya penerima beasiswa yang nanti penerima manfaatnya akan kembali ke masyarakat dan sekolah.",
    ],
    impactPoints: [
      "Kurikulum aplikatif: programming, desain UI/UX, dan solusi digital kemasyarakatan.",
      "Mentoring intensif 1-on-1 dari praktisi industri teknologi.",
      "Exhibition & Demo Day peluncuran karya produk nyata penerima beasiswa.",
    ],
    howToJoin: [
      "Daftar beasiswa program pelatihan IT bagi mitra produktif.",
      "Menjadi mitra industri penyedia mentor atau proyek riset terapan.",
    ],
    targetMushafOrGoal: "Talenta Digital Berdaya Guna",
  },
  {
    slug: "umkm",
    aliases: ["umkm-berkah"],
    title: "Program Dukungan Pembinaan dan Pemberdayaan UMKM",
    pillar: "Sosial & Teknologi",
    shortDesc:
      "Penguatan daya saing UMKM melalui manajemen keuangan, modernisasi alat, legalitas, digitalisasi pemasaran, serta dukungan finansial tanpa bunga.",
    heroImage: "/images/infak-mushaf-custom.jpg",
    quote:
      "Mendorong kemandirian ekonomi masyarakat berbasis komunitas dengan pelatihan terpadu dan pembiayaan syariah tanpa bunga.",
    overview: [
      "Program ini dirancang untuk mendampingi serta memperkuat daya saing para pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) dalam menghadapi tantangan pasar.",
      "Melalui pendekatan terpadu mencakup pelatihan manajemen keuangan, modernisasi alat usaha, pendampingan legalitas/perizinan, hingga digitalisasi pemasaran.",
      "Program ini bertujuan meningkatkan produktivitas, memperluas jangkauan pasar, serta mendorong kemandirian ekonomi masyarakat berbasis komunitas.",
      "Disertai dukungan finansial dengan akad hibah atau pinjaman tanpa bunga sesuai syarat dan ketentuan yang berlaku.",
    ],
    impactPoints: [
      "Pelatihan pembukuan keuangan dan perizinan legalitas usaha.",
      "Digitalisasi pemasaran, optimasi kemasan, dan adopsi pembayaran digital.",
      "Bantuan modal bergulir dengan akad tanpa bunga (qardhul hasan) atau hibah.",
    ],
    howToJoin: [
      "Daftarkan usaha mikro Anda untuk seleksi pendampingan UMKM.",
      "Salurkan dana infak produktif untuk modal bergulir pelaku usaha mikro.",
    ],
    targetMushafOrGoal: "UMKM Mandiri & Berdaya Saing",
  },
  {
    slug: "bantuan-tematik",
    aliases: ["tematik"],
    title: "Program Bantuan Tematik Nusantara",
    pillar: "Sosial",
    shortDesc:
      "Respon cepat tanggap kemanusiaan untuk setiap kondisi darurat: bencana alam, bencana sosial, bantuan pembangunan, dan pendidikan berbatas waktu.",
    heroImage: "/images/tasmi-30-juz-dokumentasi.jpg",
    quote:
      "Respon tanggap dari setiap kondisi terkini yang membutuhkan uluran tangan kasih sayang para dermawan.",
    overview: [
      "Program bantuan ini merupakan respon dari setiap kondisi terkini yang sekiranya membutuhkan uluran tangan para dermawan.",
      "Dari mulai bencana alam, bencana sosial, pembangunan, pendidikan, dan bantuan kemanusiaan lainnya yang bersifat tematik dan dalam batas waktu tertentu saja.",
      "Contoh aksi tanggap yang disiagakan antara lain: respon gempa bumi di NTT, karhutla Kalimantan, erupsi Krakatau Selat Sunda, dan banjir di Aceh.",
    ],
    impactPoints: [
      "Aksi tanggap darurat evakuasi, logistik pangan, dan perlengkapan hangat.",
      "Layanan kesehatan darurat dan tenda perlindungan keluarga pengungsi.",
      "Rehabilitasi sarana ibadah dan pendidikan pasca-bencana secara terpadu.",
    ],
    howToJoin: [
      "Salurkan bantuan donasi untuk posko kampanye tematik bencana aktif.",
      "Daftar sebagai relawan medis atau logistik tanggap darurat nusantara.",
    ],
    targetMushafOrGoal: "Respon Cepat Tanggap Darurat Bencana",
  },
];
