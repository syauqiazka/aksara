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
  program: z.enum(["infak_alquran", "geber_masjid", "tasmi", "pena_yatim", "bela_berdikari", "umkm", "tematik"]),
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

