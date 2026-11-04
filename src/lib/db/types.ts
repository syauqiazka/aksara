export type RecipientType = 'pesantren' | 'masjid' | 'madrasah' | 'lainnya';
export type DistributionStatus = 'draft' | 'published';
export type ReportProgram =
  | 'infak_jinan'
  | 'buss_quran'
  | 'geber_masjid'
  | 'tasmi'
  | 'yatim_berdikari'
  | 'pelatihan_it'
  | 'umkm'
  | 'tematik'
  | 'infak_alquran'
  | 'pena_yatim'
  | 'bela_berdikari';

export interface InfakDistribution {
  id: string;
  mushaf_no: number;
  donor_name: string;
  show_donor_name: boolean;
  recipient_name: string;
  recipient_type: RecipientType;
  province: string;
  city: string;
  district: string;
  lat: number | null;
  lng: number | null;
  distributed_at: string;
  quantity: number;
  photo_url: string | null;
  notes: string | null;
  status: DistributionStatus;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export interface GeberMasjidDistribution {
  id: string;
  mosque_name: string;
  province: string;
  city: string;
  district: string;
  address: string;
  lat: number | null;
  lng: number | null;
  activity_date: string;
  participants: number;
  activity_notes: string | null;
  photo_urls: string[];
  status: DistributionStatus;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export interface Report {
  id: string;
  slug: string;
  title: string;
  program: ReportProgram;
  period_start: string;
  period_end: string;
  summary: string;
  body: string;
  beneficiaries: number;
  amount_idr: number | null;
  cover_url: string | null;
  gallery_urls: string[];
  pdf_url: string | null;
  status: DistributionStatus;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export interface ThemedCampaign {
  id: string;
  title: string;
  disaster_type: string;
  location: string;
  status: 'aktif' | 'selesai';
  description: string;
  cover_url: string | null;
  target_idr: number;
  collected_idr: number;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  program: string;
  date: string;
  image_url: string;
  caption: string | null;
  status: DistributionStatus;
  created_at: string;
}

export interface BankAccount {
  bank: string;
  number: string;
  holder: string;
  branch: string;
}

export interface ContactInfo {
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
}

export interface SocialLinks {
  instagram: string;
  youtube: string;
  tiktok: string;
}

export interface AggregatedStats {
  totalMushaf: number;
  totalMasjid: number;
  totalProvinces: number;
  totalBeneficiaries: number;
}

export interface UploadLedgerEntry {
  id: string;
  url: string;
  content_hash: string;
  size_bytes: number;
  mime_type: string;
  status: 'pending' | 'committed' | 'deleted';
  created_at: string;
  committed_at: string | null;
}

export interface HafalanUpdate {
  id?: string;
  santri_id?: string;
  updated_on: string; // YYYY-MM-DD
  surah_no: number;
  surah_name: string;
  ayat: number;
  juz: number;
  notes?: string | null;
}

export interface InfakJinanPhoto {
  id: string;
  url: string;
  caption?: string | null;
  sort?: number;
}

export interface InfakJinanSantri {
  id: string;
  infak_id: string;
  name: string;
  phone?: string | null; // SENSITIF: ADMIN SAJA
  sort: number;
  status: DistributionStatus;
  created_at?: string;
  updated_at?: string;
  hafalan_updates?: HafalanUpdate[];
  latest_surah?: string;
  latest_ayat?: number;
  latest_juz?: number;
}

export interface PublicInfakJinanSantri {
  id: string;
  infak_id: string;
  santri_name: string;
  sort: number;
  status: DistributionStatus;
  latest_surah: string;
  latest_ayat?: number;
  latest_juz?: number;
  hafalan_updates: HafalanUpdate[];
}

export interface InfakJinanRecord {
  id: string;
  mushaf_no: number;
  donor_name: string;
  show_donor_name: boolean;
  donor_origin: string;
  donor_phone?: string | null; // SENSITIF: ADMIN SAJA
  dedication_name: string;
  pesantren_name: string;
  address: string;
  distributed_at: string;
  maps_url?: string | null;
  status: DistributionStatus;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  photos: InfakJinanPhoto[];
  santri_list: InfakJinanSantri[];
  santri_count: number;
}

// Data aman untuk konsumsi publik (nomor HP donatur & santri tidak pernah dikirim ke browser publik)
export interface PublicInfakJinanRecord {
  id: string;
  mushaf_no: number;
  display_donor_name: string; // "Hamba Allah" jika show_donor_name=false
  donor_origin: string;
  dedication_name: string;
  pesantren_name: string;
  address: string;
  distributed_at: string;
  maps_url?: string | null;
  status: DistributionStatus;
  photos: InfakJinanPhoto[];
  santri_count: number;
}

export interface BussDistribution {
  id: string;
  year: number;
  santri_name: string;
  origin: string;
  pesantren_name: string;
  current_surah: string;
  current_ayat: number;
  juz: number;
  donor_name: string;
  show_donor_name: boolean;
  photo_urls: string[];
  status: DistributionStatus;
  created_at: string;
  updated_at?: string;
  created_by?: string | null;
}

export interface PublicBussDistribution {
  id: string;
  year: number;
  santri_name: string;
  origin: string;
  pesantren_name: string;
  current_surah: string;
  current_ayat: number;
  juz: number;
  display_donor_name: string; // "Hamba Allah" jika show_donor_name=false
  photo_urls: string[];
  status: DistributionStatus;
}

export interface YatimActivity {
  id: string;
  year: number;
  activity_name: string;
  organizer: string;
  documentation_urls: string[];
  description: string;
  activity_date: string;
  status: DistributionStatus;
  created_at: string;
  updated_at?: string;
  created_by?: string | null;
}



