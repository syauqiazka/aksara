import {
  InfakDistribution,
  GeberMasjidDistribution,
  Report,
  ThemedCampaign,
  GalleryItem,
  BankAccount,
  ContactInfo,
  SocialLinks,
  AggregatedStats
} from './types';

// Initial local seed state
const infakList: InfakDistribution[] = [
  {
    id: "infak-1",
    mushaf_no: 1,
    donor_name: "Inayah Binti Kartoni",
    show_donor_name: true,
    recipient_name: "Pondok Pesantren Al-Hikmah",
    recipient_type: "pesantren",
    province: "Jawa Barat",
    city: "Bogor",
    district: "Ciawi",
    lat: -6.6914,
    lng: 106.8522,
    distributed_at: "2026-03-15",
    quantity: 50,
    photo_url: "/images/infak-mushaf-custom.jpg",
    notes: "Penyerahan perdana mushaf custom nama langsung ke santri tahfidz",
    status: "published",
    created_at: "2026-03-15T10:00:00Z",
    updated_at: "2026-03-15T10:00:00Z"
  },
  {
    id: "infak-2",
    mushaf_no: 2,
    donor_name: "Keluarga Bpk. H. Sutrisno",
    show_donor_name: false,
    recipient_name: "Madrasah Diniyah Nurul Iman",
    recipient_type: "madrasah",
    province: "Banten",
    city: "Serang",
    district: "Kramatwatu",
    lat: -6.0712,
    lng: 106.1284,
    distributed_at: "2026-04-02",
    quantity: 30,
    photo_url: null,
    notes: "Penyaluran tahap santri baru angkatan 2026",
    status: "published",
    created_at: "2026-04-02T11:00:00Z",
    updated_at: "2026-04-02T11:00:00Z"
  },
  {
    id: "infak-3",
    mushaf_no: 3,
    donor_name: "Ibu Hj. Siti Rahmah",
    show_donor_name: true,
    recipient_name: "Masjid Jami Al-Barkah",
    recipient_type: "masjid",
    province: "Jawa Tengah",
    city: "Magelang",
    district: "Muntilan",
    lat: -7.5812,
    lng: 110.2984,
    distributed_at: "2026-04-20",
    quantity: 25,
    photo_url: null,
    notes: "Program penggantian mushaf yang telah lapuk untuk halaqah malam",
    status: "published",
    created_at: "2026-04-20T09:30:00Z",
    updated_at: "2026-04-20T09:30:00Z"
  },
  {
    id: "infak-4",
    mushaf_no: 4,
    donor_name: "Hamba Allah",
    show_donor_name: false,
    recipient_name: "Pesantren Tahfidz Darul Furqon",
    recipient_type: "pesantren",
    province: "Jawa Timur",
    city: "Malang",
    district: "Singosari",
    lat: -7.8924,
    lng: 112.6684,
    distributed_at: "2026-05-10",
    quantity: 60,
    photo_url: null,
    notes: "Penyaluran dukungan santri yatim penghafal Al-Qur'an",
    status: "published",
    created_at: "2026-05-10T14:00:00Z",
    updated_at: "2026-05-10T14:00:00Z"
  },
  {
    id: "infak-5",
    mushaf_no: 5,
    donor_name: "Dr. Hendra Wijaya",
    show_donor_name: true,
    recipient_name: "Rumah Qur'an As-Salam",
    recipient_type: "lainnya",
    province: "DI Yogyakarta",
    city: "Sleman",
    district: "Ngaglik",
    lat: -7.7123,
    lng: 110.3842,
    distributed_at: "2026-06-01",
    quantity: 40,
    photo_url: null,
    notes: "Penyaluran lereng Merapi untuk TPA sore",
    status: "published",
    created_at: "2026-06-01T08:00:00Z",
    updated_at: "2026-06-01T08:00:00Z"
  },
  {
    id: "infak-6",
    mushaf_no: 6,
    donor_name: "Draft Belum Terbit",
    show_donor_name: false,
    recipient_name: "Pondok Belum Terverifikasi",
    recipient_type: "pesantren",
    province: "Sumatera Barat",
    city: "Padang",
    district: "Koto Tangah",
    lat: -0.8412,
    lng: 100.3421,
    distributed_at: "2026-06-15",
    quantity: 20,
    photo_url: null,
    notes: "Menunggu tanda tangan berita acara serah terima",
    status: "draft",
    created_at: "2026-06-15T09:00:00Z",
    updated_at: "2026-06-15T09:00:00Z"
  }
];

const geberList: GeberMasjidDistribution[] = [
  {
    id: "geber-1",
    mosque_name: "Masjid Agung Al-Barkah",
    province: "Jawa Barat",
    city: "Bekasi",
    district: "Bekasi Selatan",
    address: "Jl. Veteran No. 46",
    lat: -6.2412,
    lng: 106.9984,
    activity_date: "2026-02-14",
    participants: 35,
    activity_notes: "Pembersihan karpet, sajadah, tempat wudhu, dan peremajaan cat pagar utama.",
    photo_urls: ["/images/tasmi-30-juz-dokumentasi.jpg"],
    status: "published",
    created_at: "2026-02-14T12:00:00Z",
    updated_at: "2026-02-14T12:00:00Z"
  },
  {
    id: "geber-2",
    mosque_name: "Masjid Baiturrahim",
    province: "Banten",
    city: "Tangerang Selatan",
    district: "Pamulang",
    address: "Jl. Raya Pamulang No. 12",
    lat: -6.3421,
    lng: 106.7312,
    activity_date: "2026-03-08",
    participants: 28,
    activity_notes: "Aksi sanitasi, penggantian keset & penyemprotan pengharum karpet jelang Ramadhan.",
    photo_urls: [],
    status: "published",
    created_at: "2026-03-08T11:00:00Z",
    updated_at: "2026-03-08T11:00:00Z"
  },
  {
    id: "geber-3",
    mosque_name: "Masjid At-Taqwa",
    province: "DKI Jakarta",
    city: "Jakarta Timur",
    district: "Cipayung",
    address: "Jl. Bambu Apus Raya No. 8",
    lat: -6.3124,
    lng: 106.8921,
    activity_date: "2026-03-22",
    participants: 42,
    activity_notes: "Kerja bakti pembersihan kubah, perbaikan kran wudhu hemat air, dan sedekah alat kebersihan.",
    photo_urls: [],
    status: "published",
    created_at: "2026-03-22T13:00:00Z",
    updated_at: "2026-03-22T13:00:00Z"
  },
  {
    id: "geber-4",
    mosque_name: "Masjid Darussalam",
    province: "Jawa Barat",
    city: "Bandung Barat",
    district: "Padalarang",
    address: "Jl. Kertamulya No. 15",
    lat: -6.8412,
    lng: 107.4912,
    activity_date: "2026-04-18",
    participants: 25,
    activity_notes: "Geber masjid pelosok bersama pemuda karang taruna dan DKM setempat.",
    photo_urls: [],
    status: "published",
    created_at: "2026-04-18T10:00:00Z",
    updated_at: "2026-04-18T10:00:00Z"
  },
  {
    id: "geber-5",
    mosque_name: "Masjid Nurul Hidayah Draft",
    province: "Jawa Tengah",
    city: "Semarang",
    district: "Tembalang",
    address: "Jl. Banjarsari No. 3",
    lat: -7.0512,
    lng: 110.4412,
    activity_date: "2026-05-02",
    participants: 15,
    activity_notes: "Dokumentasi belum lengkap diverifikasi DKM",
    photo_urls: [],
    status: "draft",
    created_at: "2026-05-02T09:00:00Z",
    updated_at: "2026-05-02T09:00:00Z"
  }
];

const reportList: Report[] = [
  {
    id: "rep-1",
    slug: "laporan-infak-mushaf-q1-2026",
    title: "Laporan Penyaluran 500 Mushaf Al-Qur'an Pelosok Jawa Barat & Banten",
    program: "infak_alquran",
    period_start: "2026-01-01",
    period_end: "2026-03-31",
    summary: "Penyaluran amanah 500 mushaf Al-Qur'an custom nama ke 12 pesantren dan madrasah pelosok.",
    body: `### Ringkasan Penyaluran\n\nAlhamdulillah, puji syukur ke hadirat Allah SWT. Tim Yayasan Sahabat Aksara telah menyelesaikan penyaluran mushaf Al-Qur'an cetak custom nama donatur/keluarga ke berbagai pesantren di pelosok Jawa Barat dan Banten.\n\nSetiap mushaf dicetak dengan kertas Qur'anic Paper (QPP) berkualitas tinggi, rasm Utsmani standar Kementerian Agama RI, dan dilengkapi dengan doa khusus untuk nama pewakaf di halaman depan.\n\n### Dampak dan Penerima Manfaat\n- **Jumlah Mushaf**: 500 eksemplar\n- **Santri Penerima**: 850 santri tahfidz\n- **Pesantren Terjangkau**: 12 lembaga\n- **Wilayah**: Kab. Bogor, Kab. Lebak, Kab. Pandeglang, dan Kab. Sukabumi.\n\nKami mengucapkan jazakumullahu khairan katsiran kepada seluruh muhsinin yang telah menitipkan amanah jariyah ini.`,
    beneficiaries: 850,
    amount_idr: 100000000,
    cover_url: "/images/infak-mushaf-custom.jpg",
    gallery_urls: ["/images/infak-mushaf-custom.jpg", "/images/tasmi-30-juz-dokumentasi.jpg"],
    pdf_url: null,
    status: "published",
    created_at: "2026-04-01T10:00:00Z",
    updated_at: "2026-04-01T10:00:00Z"
  },
  {
    id: "rep-2",
    slug: "laporan-geber-masjid-ramadhan-1447h",
    title: "Laporan Aksi Geber 20 Masjid Menyambut Bulan Suci Ramadhan",
    program: "geber_masjid",
    period_start: "2026-02-01",
    period_end: "2026-03-10",
    summary: "Aksi bersih-bersih, pewangian karpet, dan sanitasi tempat wudhu di 20 masjid se-Jabodetabek.",
    body: `### Gerakan Bersih-Bersih Masjid (Geber Masjid)\n\nMenyambut bulan suci Ramadhan 1447 H, tim relawan Sahabat Aksara menggelar aksi maraton pembersihan rumah Allah di 20 masjid di area pemukiman padat dan pelosok desa.\n\n### Aksi yang Dilakukan\n1. Cuci dan vakum karpet masjid secara higienis.\n2. Pembersihan kerak tempat wudhu dan sanitasi toilet.\n3. Pengecatan ulang dinding dan pagar yang kusam.\n4. Pembagian paket perlengkapan kebersihan dan sajadah baru.`,
    beneficiaries: 12000,
    amount_idr: 45000000,
    cover_url: "/images/tasmi-30-juz-dokumentasi.jpg",
    gallery_urls: ["/images/tasmi-30-juz-dokumentasi.jpg"],
    pdf_url: null,
    status: "published",
    created_at: "2026-03-12T09:00:00Z",
    updated_at: "2026-03-12T09:00:00Z"
  },
  {
    id: "rep-3",
    slug: "laporan-tasmi-30-juz-angkatan-1",
    title: "Laporan Majlis Tasmi' Al-Qur'an 30 Juz Bil Ghaib Sekali Duduk",
    program: "tasmi",
    period_start: "2026-04-01",
    period_end: "2026-04-05",
    summary: "Wisuda dan penyimakan hafalan 30 juz Al-Qur'an mutqin santri binaan beasiswa tahfidz.",
    body: `### Wisuda Tasmi' 30 Juz Bil Ghaib\n\nAlhamdulillah, telah terselenggara majlis tasmi' Al-Qur'an 30 juz sekali duduk oleh santri-santri binaan beasiswa Yayasan Sahabat Aksara. Diuji langsung oleh para masyaikh dan huffazh bersanad internasional.\n\nSemoga para huffazh menjadi syafaat bagi kedua orang tua dan bangsa.`,
    beneficiaries: 30,
    amount_idr: 25000000,
    cover_url: "/images/tasmi-30-juz-dokumentasi.jpg",
    gallery_urls: ["/images/tasmi-30-juz-dokumentasi.jpg"],
    pdf_url: null,
    status: "published",
    created_at: "2026-04-06T15:00:00Z",
    updated_at: "2026-04-06T15:00:00Z"
  }
];

const themedCampaignsList: ThemedCampaign[] = [
  {
    id: "camp-1",
    title: "Tanggap Bencana Gempa NTT: Bantuan Pangan & Tenda Darurat",
    disaster_type: "Gempa Bumi",
    location: "Kab. Flores Timur, NTT",
    status: "aktif",
    description: "Penyaluran logistik darurat, hygiene kit, dan air bersih bagi penyintas gempa.",
    cover_url: null,
    target_idr: 150000000,
    collected_idr: 68500000,
    created_at: "2026-05-01T08:00:00Z"
  },
  {
    id: "camp-2",
    title: "Bantuan Asap & Karhutla Pedalaman Kalimantan",
    disaster_type: "Kebakaran Hutan",
    location: "Kotawaringin Timur, Kalteng",
    status: "selesai",
    description: "Distribusi ribuan masker N95, tabung oksigen portabel, dan pemeriksaan kesehatan keliling.",
    cover_url: null,
    target_idr: 75000000,
    collected_idr: 82000000,
    created_at: "2026-03-10T08:00:00Z"
  }
];

const galleryList: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Serah Terima Mushaf Al-Qur'an Custom",
    program: "Infak 1 Jt Al-Qur'an",
    date: "2026-03-15",
    image_url: "/images/infak-mushaf-custom.jpg",
    caption: "Santri menerima mushaf custom nama pewakaf keluarga",
    status: "published",
    created_at: "2026-03-15T12:00:00Z"
  },
  {
    id: "gal-2",
    title: "Majlis Tasmi' 30 Juz Bil Ghaib",
    program: "Majlis Tasmi'",
    date: "2026-04-05",
    image_url: "/images/tasmi-30-juz-dokumentasi.jpg",
    caption: "Penyimakan hafalan 30 juz mutqin bersama pengasuh & asatidz",
    status: "published",
    created_at: "2026-04-05T16:00:00Z"
  },
  {
    id: "gal-3",
    title: "Founder & Silaturahmi Pesantren",
    program: "Pilar Pendidikan",
    date: "2026-02-20",
    image_url: "/images/founder-ahmad-dahlan.jpg",
    caption: "Founder Ahmad Dahlan saat kunjungan peninjauan program santri",
    status: "published",
    created_at: "2026-02-20T10:00:00Z"
  }
];

let bankAccounts: BankAccount[] = [
  {
    bank: "BSI (Bank Syariah Indonesia)",
    number: "7283829102",
    holder: "Yayasan Ajirasa Aksara Semesta",
    branch: "KCP Jakarta"
  },
  {
    bank: "Bank Mandiri",
    number: "1370029384721",
    holder: "Yayasan Sahabat Aksara",
    branch: "Jakarta Thamrin"
  }
];

let contactInfo: ContactInfo = {
  whatsapp: "+6281234567890",
  phone: "+62215551234",
  email: "kontak@sahabataksara.id",
  address: "Jl. Aksara No. 1, Jakarta, Indonesia"
};

let socialLinks: SocialLinks = {
  instagram: "https://instagram.com/sahabataksara.id",
  youtube: "https://youtube.com/@sahabataksara",
  tiktok: "https://tiktok.com/@sahabataksara"
};

export const localStore = {
  getInfak: (onlyPublished = true) => {
    return onlyPublished ? infakList.filter(i => i.status === 'published') : [...infakList];
  },
  getInfakById: (id: string) => infakList.find(i => i.id === id),
  addInfak: (item: Omit<InfakDistribution, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: InfakDistribution = {
      ...item,
      id: `infak-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    infakList.unshift(newItem);
    return newItem;
  },
  updateInfak: (id: string, updates: Partial<InfakDistribution>) => {
    const idx = infakList.findIndex(i => i.id === id);
    if (idx === -1) return null;
    infakList[idx] = { ...infakList[idx], ...updates, updated_at: new Date().toISOString() };
    return infakList[idx];
  },
  deleteInfak: (id: string) => {
    const idx = infakList.findIndex(i => i.id === id);
    if (idx === -1) return false;
    infakList.splice(idx, 1);
    return true;
  },

  getGeber: (onlyPublished = true) => {
    return onlyPublished ? geberList.filter(g => g.status === 'published') : [...geberList];
  },
  getGeberById: (id: string) => geberList.find(g => g.id === id),
  addGeber: (item: Omit<GeberMasjidDistribution, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: GeberMasjidDistribution = {
      ...item,
      id: `geber-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    geberList.unshift(newItem);
    return newItem;
  },
  updateGeber: (id: string, updates: Partial<GeberMasjidDistribution>) => {
    const idx = geberList.findIndex(g => g.id === id);
    if (idx === -1) return null;
    geberList[idx] = { ...geberList[idx], ...updates, updated_at: new Date().toISOString() };
    return geberList[idx];
  },
  deleteGeber: (id: string) => {
    const idx = geberList.findIndex(g => g.id === id);
    if (idx === -1) return false;
    geberList.splice(idx, 1);
    return true;
  },

  getReports: (onlyPublished = true) => {
    return onlyPublished ? reportList.filter(r => r.status === 'published') : [...reportList];
  },
  getReportBySlug: (slug: string) => reportList.find(r => r.slug === slug),
  getReportById: (id: string) => reportList.find(r => r.id === id),
  addReport: (item: Omit<Report, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: Report = {
      ...item,
      id: `rep-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    reportList.unshift(newItem);
    return newItem;
  },
  updateReport: (id: string, updates: Partial<Report>) => {
    const idx = reportList.findIndex(r => r.id === id);
    if (idx === -1) return null;
    reportList[idx] = { ...reportList[idx], ...updates, updated_at: new Date().toISOString() };
    return reportList[idx];
  },
  deleteReport: (id: string) => {
    const idx = reportList.findIndex(r => r.id === id);
    if (idx === -1) return false;
    reportList.splice(idx, 1);
    return true;
  },

  getCampaigns: () => [...themedCampaignsList],
  addCampaign: (item: Omit<ThemedCampaign, 'id' | 'created_at'>) => {
    const newItem: ThemedCampaign = {
      ...item,
      id: `camp-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    themedCampaignsList.unshift(newItem);
    return newItem;
  },

  getGallery: (onlyPublished = true) => {
    return onlyPublished ? galleryList.filter(g => g.status === 'published') : [...galleryList];
  },
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'created_at'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    galleryList.unshift(newItem);
    return newItem;
  },

  getBankAccounts: () => [...bankAccounts],
  updateBankAccounts: (accounts: BankAccount[]) => {
    bankAccounts = accounts;
  },
  getContactInfo: () => ({ ...contactInfo }),
  updateContactInfo: (info: ContactInfo) => {
    contactInfo = info;
  },
  getSocialLinks: () => ({ ...socialLinks }),
  updateSocialLinks: (links: SocialLinks) => {
    socialLinks = links;
  },

  getAggregatedStats: (): AggregatedStats => {
    const pubInfak = infakList.filter(i => i.status === 'published');
    const pubGeber = geberList.filter(g => g.status === 'published');
    const pubReports = reportList.filter(r => r.status === 'published');

    const totalMushaf = pubInfak.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
    const totalMasjid = pubGeber.length;

    const provinces = new Set<string>();
    pubInfak.forEach(i => i.province && provinces.add(i.province));
    pubGeber.forEach(g => g.province && provinces.add(g.province));

    const totalBeneficiaries = pubReports.reduce((acc, curr) => acc + (curr.beneficiaries || 0), 0);

    return {
      totalMushaf,
      totalMasjid,
      totalProvinces: provinces.size,
      totalBeneficiaries
    };
  }
};
