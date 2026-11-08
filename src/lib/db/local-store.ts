import {
  InfakDistribution,
  GeberMasjidDistribution,
  Report,
  ThemedCampaign,
  GalleryItem,
  BankAccount,
  ContactInfo,
  SocialLinks,
  AggregatedStats,
  UploadLedgerEntry,
  InfakJinanRecord,
  PublicInfakJinanRecord,
  InfakJinanSantri,
  PublicInfakJinanSantri,
  BussDistribution,
  PublicBussDistribution,
  YatimActivity,
  HafalanUpdate,
} from './types';

// Store in-memory bersih tanpa data dummy/simulasi
const infakList: InfakDistribution[] = [];
const geberList: GeberMasjidDistribution[] = [];
const reportList: Report[] = [];
const themedCampaignsList: ThemedCampaign[] = [];
const galleryList: GalleryItem[] = [];

let bankAccounts: BankAccount[] = [
  {
    bank: "Bank BCA",
    number: "",
    holder: "Yayasan Ajirasa Aksara Semesta",
    branch: "Kantor Cabang",
  },
];

let contactInfo: ContactInfo = {
  whatsapp: "0822-6217-0018",
  phone: "0822-6217-0018",
  email: "ajirasaaksarasemesta@gmail.com",
  address: "Bogor, Jawa Barat, Indonesia"
};

let socialLinks: SocialLinks = {
  instagram: "https://www.instagram.com/sahabat_aksara_semesta?exln=enR1ZnBkZTA1enp6",
  youtube: "https://youtube.com/@sahabataksara",
  tiktok: "https://tiktok.com/@sahabataksara"
};

const uploadLedger: UploadLedgerEntry[] = [];

const globalForStore = globalThis as unknown as {
  __infakJinanList?: InfakJinanRecord[];
  __bussList?: BussDistribution[];
  __yatimList?: YatimActivity[];
  __bankAccounts?: BankAccount[];
  __contactInfo?: ContactInfo;
  __socialLinks?: SocialLinks;
};

function loadPersistedSettings(): {
  bankAccounts?: BankAccount[];
  contactInfo?: ContactInfo;
  socialLinks?: SocialLinks;
} | null {
  if (typeof window !== "undefined") return null;
  try {
    const fs = eval("require")("fs");
    const path = eval("require")("path");
    const filePath = path.join(process.cwd(), "data", "site-settings.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf8");
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return null;
}

function savePersistedSettings(settings: {
  bankAccounts?: BankAccount[];
  contactInfo?: ContactInfo;
  socialLinks?: SocialLinks;
}) {
  if (typeof window !== "undefined") return;
  try {
    const fs = eval("require")("fs");
    const path = eval("require")("path");
    const dirPath = path.join(process.cwd(), "data");
    const filePath = path.join(dirPath, "site-settings.json");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const current = loadPersistedSettings() || {};
    const updated = { ...current, ...settings };
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf8");
  } catch {
    // ignore
  }
}

const infakJinanList: InfakJinanRecord[] =
  globalForStore.__infakJinanList || (globalForStore.__infakJinanList = []);
const bussList: BussDistribution[] =
  globalForStore.__bussList || (globalForStore.__bussList = []);
const yatimList: YatimActivity[] =
  globalForStore.__yatimList || (globalForStore.__yatimList = []);

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

  getBankAccounts: () => {
    const persisted = loadPersistedSettings();
    if (persisted?.bankAccounts && Array.isArray(persisted.bankAccounts)) {
      return [...persisted.bankAccounts];
    }
    return globalForStore.__bankAccounts ? [...globalForStore.__bankAccounts] : [...bankAccounts];
  },
  updateBankAccounts: (accounts: BankAccount[]) => {
    bankAccounts = [...accounts];
    globalForStore.__bankAccounts = [...accounts];
    savePersistedSettings({ bankAccounts: accounts });
  },
  getContactInfo: () => {
    const persisted = loadPersistedSettings();
    if (persisted?.contactInfo) {
      return { ...persisted.contactInfo };
    }
    return globalForStore.__contactInfo ? { ...globalForStore.__contactInfo } : { ...contactInfo };
  },
  updateContactInfo: (info: ContactInfo) => {
    contactInfo = { ...info };
    globalForStore.__contactInfo = { ...info };
    savePersistedSettings({ contactInfo: info });
  },
  getSocialLinks: () => {
    const persisted = loadPersistedSettings();
    if (persisted?.socialLinks) {
      return { ...persisted.socialLinks };
    }
    return globalForStore.__socialLinks ? { ...globalForStore.__socialLinks } : { ...socialLinks };
  },
  updateSocialLinks: (links: SocialLinks) => {
    socialLinks = { ...links };
    globalForStore.__socialLinks = { ...links };
    savePersistedSettings({ socialLinks: links });
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
  },

  // Upload Ledger
  addUploadLedger: (entry: Omit<UploadLedgerEntry, 'id' | 'created_at' | 'committed_at'>) => {
    const item: UploadLedgerEntry = {
      ...entry,
      id: `ledg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
      committed_at: null,
    };
    uploadLedger.push(item);
    return item;
  },

  commitUploadLedger: (url: string) => {
    const item = uploadLedger.find((l) => l.url === url);
    if (item) {
      item.status = 'committed';
      item.committed_at = new Date().toISOString();
    }
  },

  deleteUploadLedger: (url: string) => {
    const item = uploadLedger.find((l) => l.url === url);
    if (item) {
      item.status = 'deleted';
    }
  },

  getUploadLedgerByHash: (hash: string) => {
    return uploadLedger.find((l) => l.content_hash === hash && l.status === 'committed') || null;
  },

  getAllUploadLedger: () => [...uploadLedger],

  // Infak Al-Qur'an Jinan (Dua Tingkat: Donasi -> Santri)
  getInfakJinan: (onlyPublished = true): InfakJinanRecord[] => {
    const list = onlyPublished ? infakJinanList.filter(i => i.status === 'published') : [...infakJinanList];
    return list.sort((a, b) => a.mushaf_no - b.mushaf_no);
  },
  getPublicInfakJinan: (): PublicInfakJinanRecord[] => {
    return infakJinanList
      .filter(i => i.status === 'published')
      .sort((a, b) => a.mushaf_no - b.mushaf_no)
      .map(item => {
        const publishedSantri = (item.santri_list || []).filter(s => s.status === 'published');
        return {
          id: item.id,
          mushaf_no: item.mushaf_no,
          display_donor_name: item.show_donor_name ? item.donor_name : "Hamba Allah",
          donor_origin: item.donor_origin,
          dedication_name: item.dedication_name,
          pesantren_name: item.pesantren_name,
          pesantren_province: item.pesantren_province || null,
          pesantren_city: item.pesantren_city || null,
          address: item.address,
          distributed_at: item.distributed_at,
          maps_url: item.maps_url,
          status: item.status,
          photos: item.photos || [],
          santri_count: publishedSantri.length,
        };
      });
  },
  getInfakJinanById: (id: string) => infakJinanList.find(i => i.id === id),
  getPublicInfakJinanDetail: (id: string): { donation: PublicInfakJinanRecord; santri: PublicInfakJinanSantri[] } | null => {
    const item = infakJinanList.find(i => i.id === id);
    if (!item || item.status !== 'published') return null;
    const publishedSantri: PublicInfakJinanSantri[] = (item.santri_list || [])
      .filter(s => s.status === 'published')
      .map(s => {
        const sortedUpdates = [...(s.hafalan_updates || [])].sort(
          (a, b) => new Date(b.updated_on).getTime() - new Date(a.updated_on).getTime()
        );
        const latest = sortedUpdates[0];
        return {
          id: s.id,
          infak_id: s.infak_id,
          santri_name: s.name,
          sort: s.sort,
          status: s.status,
          latest_surah: latest ? latest.surah_name : (s.latest_surah || "-"),
          latest_ayat: latest ? latest.ayat : s.latest_ayat,
          latest_juz: latest ? latest.juz : (s.latest_juz || 1),
          hafalan_updates: sortedUpdates,
        };
      });

    return {
      donation: {
        id: item.id,
        mushaf_no: item.mushaf_no,
        display_donor_name: item.show_donor_name ? item.donor_name : "Hamba Allah",
        donor_origin: item.donor_origin,
        dedication_name: item.dedication_name,
        pesantren_name: item.pesantren_name,
        pesantren_province: item.pesantren_province || null,
        pesantren_city: item.pesantren_city || null,
        address: item.address,
        distributed_at: item.distributed_at,
        maps_url: item.maps_url,
        status: item.status,
        photos: item.photos || [],
        santri_count: publishedSantri.length,
      },
      santri: publishedSantri,
    };
  },
  addInfakJinan: (item: Omit<InfakJinanRecord, 'id' | 'created_at' | 'updated_at'>) => {
    const santriList = item.santri_list || [];
    const newItem: InfakJinanRecord = {
      ...item,
      id: `jinan-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      santri_list: santriList,
      santri_count: santriList.length,
    };
    infakJinanList.unshift(newItem);
    return newItem;
  },
  deleteInfakJinan: (id: string) => {
    const idx = infakJinanList.findIndex(i => i.id === id);
    if (idx !== -1) {
      infakJinanList.splice(idx, 1);
      return true;
    }
    return false;
  },
  addSantriToInfak: (infakId: string, santri: Omit<InfakJinanSantri, 'id'>) => {
    const item = infakJinanList.find(i => i.id === infakId);
    if (!item) return null;
    const newSantri: InfakJinanSantri = {
      ...santri,
      id: `santri-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      infak_id: infakId,
      hafalan_updates: santri.hafalan_updates || [],
    };
    item.santri_list = item.santri_list || [];
    item.santri_list.push(newSantri);
    item.santri_count = item.santri_list.length;
    item.updated_at = new Date().toISOString();
    return newSantri;
  },
  addSantriHafalanUpdate: (santriId: string, update: Omit<HafalanUpdate, 'id'>) => {
    for (const donation of infakJinanList) {
      const santri = (donation.santri_list || []).find(s => s.id === santriId);
      if (santri) {
        const newUpdate: HafalanUpdate = {
          ...update,
          id: `hafalan-${Date.now()}`,
          santri_id: santriId,
        };
        santri.hafalan_updates = santri.hafalan_updates || [];
        santri.hafalan_updates.push(newUpdate);
        santri.latest_surah = newUpdate.surah_name;
        santri.latest_ayat = newUpdate.ayat;
        santri.latest_juz = newUpdate.juz;
        donation.updated_at = new Date().toISOString();
        return newUpdate;
      }
    }
    return null;
  },

  // BUSS Al-Qur'an
  getBuss: (onlyPublished = true): BussDistribution[] => {
    return onlyPublished ? bussList.filter(b => b.status === 'published') : [...bussList];
  },
  getPublicBuss: (): PublicBussDistribution[] => {
    return bussList
      .filter(b => b.status === 'published')
      .map(item => ({
        id: item.id,
        year: item.year,
        santri_name: item.santri_name,
        origin: item.origin,
        pesantren_name: item.pesantren_name,
        current_surah: item.current_surah,
        current_ayat: item.current_ayat,
        juz: item.juz,
        display_donor_name: item.show_donor_name ? item.donor_name : "Hamba Allah",
        photo_urls: item.photo_urls || [],
        status: item.status,
      }));
  },
  addBuss: (item: Omit<BussDistribution, 'id' | 'created_at'>) => {
    const newItem: BussDistribution = {
      ...item,
      id: `buss-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    bussList.unshift(newItem);
    return newItem;
  },

  // Yatim Berdikari
  getYatimActivities: (onlyPublished = true): YatimActivity[] => {
    return onlyPublished ? yatimList.filter(y => y.status === 'published') : [...yatimList];
  },
  addYatimActivity: (item: Omit<YatimActivity, 'id' | 'created_at'>) => {
    const newItem: YatimActivity = {
      ...item,
      id: `yatim-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    yatimList.unshift(newItem);
    return newItem;
  },

};
