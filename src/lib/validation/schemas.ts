import { z } from "zod";

export const infakSchema = z.object({
  mushaf_no: z.coerce.number().min(1, "Nomor mushaf harus lebih dari 0"),
  donor_name: z.string().min(2, "Nama donatur minimal 2 karakter"),
  show_donor_name: z.boolean().default(false),
  recipient_name: z.string().min(2, "Nama penerima minimal 2 karakter"),
  recipient_type: z.enum(["pesantren", "masjid", "madrasah", "lainnya"]),
  province: z.string().min(2, "Provinsi harus diisi"),
  city: z.string().min(2, "Kota / Kabupaten harus diisi"),
  district: z.string().min(2, "Kecamatan harus diisi"),
  lat: z.coerce.number().nullable().optional(),
  lng: z.coerce.number().nullable().optional(),
  distributed_at: z.string().min(8, "Tanggal penyaluran harus valid"),
  quantity: z.coerce.number().min(1, "Jumlah minimal 1 mushaf"),
  photo_url: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  status: z.enum(["draft", "published"]),
});

export type InfakInput = z.infer<typeof infakSchema>;

export const geberSchema = z.object({
  mosque_name: z.string().min(2, "Nama masjid minimal 2 karakter"),
  province: z.string().min(2, "Provinsi harus diisi"),
  city: z.string().min(2, "Kota / Kabupaten harus diisi"),
  district: z.string().min(2, "Kecamatan harus diisi"),
  address: z.string().min(5, "Alamat lengkap minimal 5 karakter"),
  lat: z.coerce.number().nullable().optional(),
  lng: z.coerce.number().nullable().optional(),
  activity_date: z.string().min(8, "Tanggal kegiatan harus valid"),
  participants: z.coerce.number().min(1, "Jumlah relawan minimal 1 orang"),
  activity_notes: z.string().nullable().optional(),
  photo_urls: z.array(z.string()).default([]),
  status: z.enum(["draft", "published"]),
});

export type GeberInput = z.infer<typeof geberSchema>;

export const reportSchema = z.object({
  slug: z.string().min(3, "Slug minimal 3 karakter"),
  title: z.string().min(5, "Judul laporan minimal 5 karakter"),
  program: z.enum([
    "infak_jinan",
    "buss_quran",
    "geber_masjid",
    "tasmi",
    "yatim_berdikari",
    "pelatihan_it",
    "umkm",
    "tematik",
    "infak_alquran",
    "pena_yatim",
    "bela_berdikari",
  ]),
  period_start: z.string().min(8, "Tanggal awal periode harus valid"),
  period_end: z.string().min(8, "Tanggal akhir periode harus valid"),
  summary: z.string().min(10, "Ringkasan minimal 10 karakter"),
  body: z.string().min(20, "Isi laporan minimal 20 karakter"),
  beneficiaries: z.coerce.number().min(0, "Jumlah penerima manfaat minimal 0"),
  amount_idr: z.coerce.number().nullable().optional(),
  cover_url: z.string().nullable().optional(),
  gallery_urls: z.array(z.string()).default([]),
  status: z.enum(["draft", "published"]),
});

export type ReportInput = z.infer<typeof reportSchema>;

export const gallerySchema = z.object({
  title: z.string().min(2, "Judul foto minimal 2 karakter"),
  program: z.string().min(2, "Nama program harus diisi"),
  date: z.string().min(8, "Tanggal harus valid"),
  image_url: z.string().min(2, "URL foto atau gambar harus diisi"),
  caption: z.string().nullable().optional(),
  status: z.enum(["draft", "published"]).default("published"),
});

export type GalleryInput = z.infer<typeof gallerySchema>;

export const campaignSchema = z.object({
  title: z.string().min(3, "Judul kampanye minimal 3 karakter"),
  disaster_type: z.string().min(2, "Jenis bencana harus diisi"),
  location: z.string().min(2, "Lokasi harus diisi"),
  status: z.enum(["aktif", "selesai"]).default("aktif"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  cover_url: z.string().nullable().optional(),
  target_idr: z.coerce.number().min(0, "Target donasi minimal 0"),
  collected_idr: z.coerce.number().min(0, "Donasi terkumpul minimal 0").default(0),
});

export type CampaignInput = z.infer<typeof campaignSchema>;

export const hafalanUpdateSchema = z.object({
  id: z.string().optional(),
  santri_id: z.string().optional(),
  updated_on: z.string().min(8, "Tanggal update harus valid"),
  surah_no: z.coerce.number().min(1).max(114, "Nomor surah antara 1 s/d 114"),
  surah_name: z.string().default("Al-Fatihah"),
  ayat: z.coerce.number().min(1, "Ayat minimal 1"),
  juz: z.coerce.number().min(1).max(30, "Juz antara 1 s/d 30"),
  notes: z.string().nullable().optional(),
});

export const infakJinanPhotoSchema = z.object({
  id: z.string().optional(),
  url: z.string().min(1, "URL foto harus diisi"),
  caption: z.string().nullable().optional(),
  sort: z.coerce.number().default(0),
});

export const santriSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nama santri penerima harus diisi"),
  phone: z.string().nullable().optional(),
  sort: z.coerce.number().default(0),
  status: z.enum(["draft", "published"]).default("published"),
  initial_surah_no: z.coerce.number().min(1).max(114).optional(),
  initial_surah_name: z.string().optional(),
  initial_ayat: z.coerce.number().min(1).optional(),
  initial_juz: z.coerce.number().min(1).max(30).optional(),
  hafalan_updates: z.array(hafalanUpdateSchema).default([]),
});

export type SantriInput = z.infer<typeof santriSchema>;

export const infakJinanSchema = z.object({
  mushaf_no: z.coerce.number().min(1, "Nomor mushaf harus lebih dari 0"),
  donor_name: z.string().min(2, "Nama donatur minimal 2 karakter"),
  show_donor_name: z.boolean().default(false),
  donor_origin: z.string().min(2, "Asal donatur harus diisi"),
  donor_phone: z.string().nullable().optional(),
  dedication_name: z.string().min(2, "Dedikasi atas nama harus diisi"),
  pesantren_name: z.string().min(2, "Nama pesantren tujuan harus diisi"),
  pesantren_province: z.string().nullable().optional(),
  pesantren_city: z.string().nullable().optional(),
  address: z.string().min(5, "Alamat lengkap minimal 5 karakter"),
  distributed_at: z.string().min(8, "Tanggal penyaluran harus valid"),
  maps_url: z.string().nullable().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).default("published"),
  photos: z.array(infakJinanPhotoSchema).default([]),
  santri_list: z.array(santriSchema).default([]),
});

export type InfakJinanInput = z.infer<typeof infakJinanSchema>;

export const bussSchema = z.object({
  year: z.coerce.number().min(2020).max(2100, "Tahun harus valid"),
  santri_name: z.string().min(2, "Nama santri minimal 2 karakter"),
  origin: z.string().min(2, "Asal santri harus diisi"),
  pesantren_name: z.string().min(2, "Nama pesantren harus diisi"),
  current_surah: z.string().min(2, "Surat terkini harus diisi"),
  current_ayat: z.coerce.number().min(1, "Ayat minimal 1"),
  juz: z.coerce.number().min(1).max(30, "Juz antara 1 s/d 30"),
  donor_name: z.string().min(2, "Nama donatur minimal 2 karakter"),
  show_donor_name: z.boolean().default(false),
  photo_urls: z.array(z.string()).default([]),
  status: z.enum(["draft", "published"]).default("published"),
});

export type BussInput = z.infer<typeof bussSchema>;

export const yatimActivitySchema = z.object({
  year: z.coerce.number().min(2020).max(2100, "Tahun harus valid"),
  activity_name: z.string().min(3, "Nama kegiatan minimal 3 karakter"),
  organizer: z.string().min(2, "Penyelenggara harus diisi"),
  documentation_urls: z.array(z.string()).default([]),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  activity_date: z.string().min(8, "Tanggal kegiatan harus valid"),
  status: z.enum(["draft", "published"]).default("published"),
});

export type YatimActivityInput = z.infer<typeof yatimActivitySchema>;

export function formatZodError(err: unknown): string {
  if (err instanceof z.ZodError) {
    return err.issues.map((i) => i.message).join(". ");
  }
  if (err instanceof Error) {
    try {
      const parsed = JSON.parse(err.message);
      if (Array.isArray(parsed)) {
        return parsed
          .map((i: { message?: string }) => i.message || JSON.stringify(i))
          .join(". ");
      }
    } catch { }
    return err.message;
  }
  return "Terjadi kesalahan validasi data";
}

export function formatHumanError(raw: string): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item: { message?: string }) => item.message || JSON.stringify(item))
          .join(", ");
      }
    } catch { }
  }
  return raw;
}


