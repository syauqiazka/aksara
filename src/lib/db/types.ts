export type RecipientType = 'pesantren' | 'masjid' | 'madrasah' | 'lainnya';
export type DistributionStatus = 'draft' | 'published';
export type ReportProgram = 'infak_alquran' | 'geber_masjid' | 'tasmi' | 'pena_yatim' | 'bela_berdikari' | 'umkm' | 'tematik';

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

