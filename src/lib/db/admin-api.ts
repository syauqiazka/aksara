import { requirePrisma, prisma, isPrismaConfigured } from "./prisma";
import { Prisma } from "@prisma/client";
import {
  toStringArray,
  parseDateString,
  parseDateTimeString,
  toNumberOrNull,
  toNumber,
  getErrorMessage,
} from "./formatters";
import {
  InfakDistribution,
  InfakJinanRecord,
  HafalanUpdate,
  GeberMasjidDistribution,
  Report,
  ThemedCampaign,
  GalleryItem,
  BankAccount,
  ContactInfo,
  SocialLinks,
  AggregatedStats,
} from "./types";

const DEFAULT_BANK_ACCOUNTS: BankAccount[] = [
  {
    bank: "Bank BCA",
    number: "",
    holder: "Yayasan Ajirasa Aksara Semesta",
    branch: "Kantor Cabang",
  },
];

const DEFAULT_CONTACT_INFO: ContactInfo = {
  whatsapp: "0822-6217-0018",
  phone: "0822-6217-0018",
  email: "ajirasaaksarasemesta@gmail.com",
  address: "Bogor, Jawa Barat, Indonesia",
};

const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  instagram: "https://www.instagram.com/sahabat_aksara_semesta?exln=enR1ZnBkZTA1enp6",
  youtube: "https://youtube.com/@sahabataksara",
  tiktok: "https://tiktok.com/@sahabataksara",
};

export const db = {
  // 1. Infak Al-Qur'an Jinan (Dua Tingkat)
  async getInfakJinan(onlyPublished = false): Promise<InfakJinanRecord[]> {
    const dbClient = requirePrisma();
    try {
      const data = await dbClient.infakJinan.findMany({
        where: onlyPublished ? { status: "published" } : undefined,
        orderBy: { mushaf_no: "asc" },
        include: {
          photos: { orderBy: { sort: "asc" } },
          santri_list: {
            include: { hafalan_updates: { orderBy: { updated_on: "desc" } } },
            orderBy: { sort: "asc" },
          },
        },
      });

      return data.map((item) => ({
        ...item,
        distributed_at: parseDateString(item.distributed_at),
        status: item.status as "draft" | "published",
        created_at: parseDateTimeString(item.created_at),
        updated_at: parseDateTimeString(item.updated_at),
        photos: item.photos.map((p) => ({
          ...p,
          created_at: parseDateTimeString(p.created_at),
        })),
        santri_list: item.santri_list.map((s) => ({
          ...s,
          status: s.status as "draft" | "published",
          created_at: parseDateTimeString(s.created_at),
          updated_at: parseDateTimeString(s.updated_at),
          hafalan_updates: s.hafalan_updates.map((h) => ({
            id: h.id,
            santri_id: h.santri_id,
            updated_on: parseDateString(h.updated_on),
            surah_no: h.surah_no,
            surah_name: h.surah_name,
            ayat: h.ayat,
            juz: h.juz,
            notes: h.notes || undefined,
          })),
        })),
        santri_count: item.santri_list.length,
      }));
    } catch (err: unknown) {
      console.error("[admin-api] getInfakJinan error:", getErrorMessage(err));
      throw new Error(`Gagal mengambil data Infak Jinan: ${getErrorMessage(err)}`);
    }
  },

  async getInfakJinanById(id: string): Promise<InfakJinanRecord | null> {
    const dbClient = requirePrisma();
    try {
      const item = await dbClient.infakJinan.findUnique({
        where: { id },
        include: {
          photos: { orderBy: { sort: "asc" } },
          santri_list: {
            include: { hafalan_updates: { orderBy: { updated_on: "desc" } } },
            orderBy: { sort: "asc" },
          },
        },
      });

      if (!item) return null;

      return {
        ...item,
        distributed_at: parseDateString(item.distributed_at),
        status: item.status as "draft" | "published",
        created_at: parseDateTimeString(item.created_at),
        updated_at: parseDateTimeString(item.updated_at),
        photos: item.photos.map((p) => ({
          ...p,
          created_at: parseDateTimeString(p.created_at),
        })),
        santri_list: item.santri_list.map((s) => ({
          ...s,
          status: s.status as "draft" | "published",
          created_at: parseDateTimeString(s.created_at),
          updated_at: parseDateTimeString(s.updated_at),
          hafalan_updates: s.hafalan_updates.map((h) => ({
            id: h.id,
            santri_id: h.santri_id,
            updated_on: parseDateString(h.updated_on),
            surah_no: h.surah_no,
            surah_name: h.surah_name,
            ayat: h.ayat,
            juz: h.juz,
            notes: h.notes || undefined,
          })),
        })),
        santri_count: item.santri_list.length,
      };
    } catch (err: unknown) {
      console.error("[admin-api] getInfakJinanById error:", getErrorMessage(err));
      throw new Error(`Gagal mengambil detail Infak Jinan: ${getErrorMessage(err)}`);
    }
  },

  async saveInfakJinan(
    item: Omit<InfakJinanRecord, "id" | "created_at" | "updated_at">,
    id?: string
  ): Promise<InfakJinanRecord> {
    const dbClient = requirePrisma();
    const { santri_list: _sl, photos: _ph, ...jinanData } = item;
    const defaultSantriName = (_sl && _sl.length > 0 && _sl[0]?.name?.trim()) || "Santri Binaan";
    const defaultSantriPhone = (_sl && _sl.length > 0 && _sl[0]?.phone) || null;

    try {
      let savedId = id;

      if (id) {
        await dbClient.$transaction(async (tx) => {
          await tx.infakJinan.update({
            where: { id },
            data: {
              mushaf_no: jinanData.mushaf_no,
              donor_name: jinanData.donor_name,
              show_donor_name: Boolean(jinanData.show_donor_name),
              donor_origin: jinanData.donor_origin,
              donor_phone: jinanData.donor_phone || null,
              dedication_name: jinanData.dedication_name,
              pesantren_name: jinanData.pesantren_name,
              pesantren_province: jinanData.pesantren_province || null,
              pesantren_city: jinanData.pesantren_city || null,
              address: jinanData.address,
              distributed_at: new Date(jinanData.distributed_at),
              maps_url: jinanData.maps_url || null,
              santri_name: defaultSantriName,
              santri_phone: defaultSantriPhone,
              status: jinanData.status || "published",
            },
          });

          // Replace photos
          await tx.infakJinanPhoto.deleteMany({ where: { infak_id: id } });
          if (_ph && _ph.length > 0) {
            await tx.infakJinanPhoto.createMany({
              data: _ph.map((p) => ({
                infak_id: id,
                url: p.url,
                caption: p.caption || null,
                sort: p.sort || 1,
              })),
            });
          }

          // Replace santri list and hafalan updates
          await tx.infakJinanSantri.deleteMany({ where: { infak_id: id } });
          if (_sl && _sl.length > 0) {
            for (const s of _sl) {
              const createdSantri = await tx.infakJinanSantri.create({
                data: {
                  infak_id: id,
                  name: s.name?.trim() || "Santri Binaan",
                  phone: s.phone || null,
                  sort: s.sort || 1,
                  status: s.status || "published",
                },
              });

              if (s.hafalan_updates && s.hafalan_updates.length > 0) {
                await tx.santriHafalanUpdate.createMany({
                  data: s.hafalan_updates.map((h) => ({
                    santri_id: createdSantri.id,
                    updated_on: new Date(h.updated_on || new Date()),
                    surah_no: Number(h.surah_no) || 1,
                    surah_name: String(h.surah_name || "Al-Fatihah"),
                    ayat: Number(h.ayat) || 1,
                    juz: Number(h.juz) || 1,
                    notes: h.notes || null,
                  })),
                });
              }
            }
          }
        });
      } else {
        const created = await dbClient.infakJinan.create({
          data: {
            mushaf_no: jinanData.mushaf_no,
            donor_name: jinanData.donor_name,
            show_donor_name: Boolean(jinanData.show_donor_name),
            donor_origin: jinanData.donor_origin,
            donor_phone: jinanData.donor_phone || null,
            dedication_name: jinanData.dedication_name,
            pesantren_name: jinanData.pesantren_name,
            pesantren_province: jinanData.pesantren_province || null,
            pesantren_city: jinanData.pesantren_city || null,
            address: jinanData.address,
            distributed_at: new Date(jinanData.distributed_at),
            maps_url: jinanData.maps_url || null,
            santri_name: defaultSantriName,
            santri_phone: defaultSantriPhone,
            status: jinanData.status || "published",
          },
        });
        savedId = created.id;

        if (_ph && _ph.length > 0) {
          await dbClient.infakJinanPhoto.createMany({
            data: _ph.map((p) => ({
              infak_id: savedId!,
              url: p.url,
              caption: p.caption || null,
              sort: p.sort || 1,
            })),
          });
        }

        if (_sl && _sl.length > 0) {
          for (const s of _sl) {
            const createdSantri = await dbClient.infakJinanSantri.create({
              data: {
                infak_id: savedId!,
                name: s.name?.trim() || "Santri Binaan",
                phone: s.phone || null,
                sort: s.sort || 1,
                status: s.status || "published",
              },
            });

            if (s.hafalan_updates && s.hafalan_updates.length > 0) {
              await dbClient.santriHafalanUpdate.createMany({
                data: s.hafalan_updates.map((h) => ({
                  santri_id: createdSantri.id,
                  updated_on: new Date(h.updated_on || new Date()),
                  surah_no: Number(h.surah_no) || 1,
                  surah_name: String(h.surah_name || "Al-Fatihah"),
                  ayat: Number(h.ayat) || 1,
                  juz: Number(h.juz) || 1,
                  notes: h.notes || null,
                })),
              });
            }
          }
        }
      }

      const refreshed = await this.getInfakJinanById(savedId!);
      if (!refreshed) throw new Error("Data berhasil disimpan tetapi gagal dimuat ulang.");
      return refreshed;
    } catch (err: unknown) {
      console.error("[admin-api] saveInfakJinan error:", getErrorMessage(err));
      throw new Error(`Gagal menyimpan data Infak Jinan: ${getErrorMessage(err)}`);
    }
  },

  async deleteInfakJinan(id: string): Promise<boolean> {
    const dbClient = requirePrisma();
    try {
      await dbClient.infakJinan.delete({ where: { id } });
      return true;
    } catch (err: unknown) {
      console.error("[admin-api] deleteInfakJinan error:", getErrorMessage(err));
      throw new Error(`Gagal menghapus data Infak Jinan: ${getErrorMessage(err)}`);
    }
  },

  async addSantriHafalanUpdate(
    santriId: string,
    update: Omit<HafalanUpdate, "id">
  ): Promise<HafalanUpdate | null> {
    const dbClient = requirePrisma();
    try {
      const created = await dbClient.santriHafalanUpdate.create({
        data: {
          santri_id: santriId,
          updated_on: new Date(update.updated_on || new Date()),
          surah_no: update.surah_no,
          surah_name: update.surah_name,
          ayat: update.ayat,
          juz: update.juz,
          notes: update.notes || null,
        },
      });

      return {
        id: created.id,
        santri_id: created.santri_id,
        updated_on: parseDateString(created.updated_on),
        surah_no: created.surah_no,
        surah_name: created.surah_name,
        ayat: created.ayat,
        juz: created.juz,
        notes: created.notes || undefined,
      };
    } catch (err: unknown) {
      console.error("[admin-api] addSantriHafalanUpdate error:", getErrorMessage(err));
      throw new Error(`Gagal menambahkan progres hafalan santri: ${getErrorMessage(err)}`);
    }
  },

  // 2. Infak Distributions (Legacy CSV Data)
  async getInfakDistributions(onlyPublished = true): Promise<InfakDistribution[]> {
    const dbClient = requirePrisma();
    try {
      const data = await dbClient.infakDistribution.findMany({
        where: onlyPublished ? { status: "published" } : undefined,
        orderBy: { mushaf_no: "asc" },
      });

      return data.map((d) => ({
        ...d,
        lat: toNumberOrNull(d.lat),
        lng: toNumberOrNull(d.lng),
        distributed_at: parseDateString(d.distributed_at),
        recipient_type: d.recipient_type as "pesantren" | "masjid" | "madrasah" | "lainnya",
        status: d.status as "draft" | "published",
        created_at: parseDateTimeString(d.created_at),
        updated_at: parseDateTimeString(d.updated_at),
      }));
    } catch (err: unknown) {
      console.error("[admin-api] getInfakDistributions error:", getErrorMessage(err));
      throw new Error(`Gagal memuat daftar infak: ${getErrorMessage(err)}`);
    }
  },

  async getInfakById(id: string): Promise<InfakDistribution | null> {
    const dbClient = requirePrisma();
    try {
      const d = await dbClient.infakDistribution.findUnique({ where: { id } });
      if (!d) return null;

      return {
        ...d,
        lat: toNumberOrNull(d.lat),
        lng: toNumberOrNull(d.lng),
        distributed_at: parseDateString(d.distributed_at),
        recipient_type: d.recipient_type as "pesantren" | "masjid" | "madrasah" | "lainnya",
        status: d.status as "draft" | "published",
        created_at: parseDateTimeString(d.created_at),
        updated_at: parseDateTimeString(d.updated_at),
      };
    } catch (err: unknown) {
      console.error("[admin-api] getInfakById error:", getErrorMessage(err));
      throw new Error(`Gagal memuat detail infak: ${getErrorMessage(err)}`);
    }
  },

  async saveInfak(
    item: Omit<InfakDistribution, "id" | "created_at" | "updated_at">,
    id?: string
  ): Promise<InfakDistribution> {
    const dbClient = requirePrisma();
    try {
      const payload = {
        mushaf_no: item.mushaf_no,
        donor_name: item.donor_name,
        show_donor_name: item.show_donor_name,
        recipient_name: item.recipient_name,
        recipient_type: item.recipient_type,
        province: item.province,
        city: item.city,
        district: item.district,
        lat: item.lat !== null && item.lat !== undefined ? new Prisma.Decimal(item.lat) : null,
        lng: item.lng !== null && item.lng !== undefined ? new Prisma.Decimal(item.lng) : null,
        distributed_at: new Date(item.distributed_at),
        quantity: item.quantity,
        photo_url: item.photo_url || null,
        notes: item.notes || null,
        status: item.status,
      };

      const result = id
        ? await dbClient.infakDistribution.update({ where: { id }, data: payload })
        : await dbClient.infakDistribution.create({ data: payload });

      return {
        ...result,
        lat: toNumberOrNull(result.lat),
        lng: toNumberOrNull(result.lng),
        distributed_at: parseDateString(result.distributed_at),
        recipient_type: result.recipient_type as "pesantren" | "masjid" | "madrasah" | "lainnya",
        status: result.status as "draft" | "published",
        created_at: parseDateTimeString(result.created_at),
        updated_at: parseDateTimeString(result.updated_at),
      };
    } catch (err: unknown) {
      console.error("[admin-api] saveInfak error:", getErrorMessage(err));
      throw new Error(`Gagal menyimpan data sebaran infak: ${getErrorMessage(err)}`);
    }
  },

  async deleteInfak(id: string): Promise<boolean> {
    const dbClient = requirePrisma();
    try {
      await dbClient.infakDistribution.delete({ where: { id } });
      return true;
    } catch (err: unknown) {
      console.error("[admin-api] deleteInfak error:", getErrorMessage(err));
      throw new Error(`Gagal menghapus data infak: ${getErrorMessage(err)}`);
    }
  },

  // 3. Geber Masjid
  async getGeberDistributions(onlyPublished = true): Promise<GeberMasjidDistribution[]> {
    const dbClient = requirePrisma();
    try {
      const data = await dbClient.geberMasjidDistribution.findMany({
        where: onlyPublished ? { status: "published" } : undefined,
        orderBy: { activity_date: "desc" },
      });

      return data.map((d) => ({
        ...d,
        lat: toNumberOrNull(d.lat),
        lng: toNumberOrNull(d.lng),
        activity_date: parseDateString(d.activity_date),
        photo_urls: toStringArray(d.photo_urls),
        status: d.status as "draft" | "published",
        created_at: parseDateTimeString(d.created_at),
        updated_at: parseDateTimeString(d.updated_at),
      }));
    } catch (err: unknown) {
      console.error("[admin-api] getGeberDistributions error:", getErrorMessage(err));
      throw new Error(`Gagal memuat data Geber Masjid: ${getErrorMessage(err)}`);
    }
  },

  async getGeberById(id: string): Promise<GeberMasjidDistribution | null> {
    const dbClient = requirePrisma();
    try {
      const d = await dbClient.geberMasjidDistribution.findUnique({ where: { id } });
      if (!d) return null;

      return {
        ...d,
        lat: toNumberOrNull(d.lat),
        lng: toNumberOrNull(d.lng),
        activity_date: parseDateString(d.activity_date),
        photo_urls: toStringArray(d.photo_urls),
        status: d.status as "draft" | "published",
        created_at: parseDateTimeString(d.created_at),
        updated_at: parseDateTimeString(d.updated_at),
      };
    } catch (err: unknown) {
      console.error("[admin-api] getGeberById error:", getErrorMessage(err));
      throw new Error(`Gagal memuat detail Geber Masjid: ${getErrorMessage(err)}`);
    }
  },

  async saveGeber(
    item: Omit<GeberMasjidDistribution, "id" | "created_at" | "updated_at">,
    id?: string
  ): Promise<GeberMasjidDistribution> {
    const dbClient = requirePrisma();
    try {
      const payload = {
        mosque_name: item.mosque_name,
        province: item.province,
        city: item.city,
        district: item.district,
        address: item.address,
        lat: item.lat !== null && item.lat !== undefined ? new Prisma.Decimal(item.lat) : null,
        lng: item.lng !== null && item.lng !== undefined ? new Prisma.Decimal(item.lng) : null,
        activity_date: new Date(item.activity_date),
        participants: item.participants,
        activity_notes: item.activity_notes || null,
        photo_urls: (item.photo_urls || []) as unknown as Prisma.InputJsonValue,
        status: item.status,
      };

      const result = id
        ? await dbClient.geberMasjidDistribution.update({ where: { id }, data: payload })
        : await dbClient.geberMasjidDistribution.create({ data: payload });

      return {
        ...result,
        lat: toNumberOrNull(result.lat),
        lng: toNumberOrNull(result.lng),
        activity_date: parseDateString(result.activity_date),
        photo_urls: toStringArray(result.photo_urls),
        status: result.status as "draft" | "published",
        created_at: parseDateTimeString(result.created_at),
        updated_at: parseDateTimeString(result.updated_at),
      };
    } catch (err: unknown) {
      console.error("[admin-api] saveGeber error:", getErrorMessage(err));
      throw new Error(`Gagal menyimpan data Geber Masjid: ${getErrorMessage(err)}`);
    }
  },

  async deleteGeber(id: string): Promise<boolean> {
    const dbClient = requirePrisma();
    try {
      await dbClient.geberMasjidDistribution.delete({ where: { id } });
      return true;
    } catch (err: unknown) {
      console.error("[admin-api] deleteGeber error:", getErrorMessage(err));
      throw new Error(`Gagal menghapus data Geber Masjid: ${getErrorMessage(err)}`);
    }
  },

  // 4. Reports
  async getReports(onlyPublished = true): Promise<Report[]> {
    const dbClient = requirePrisma();
    try {
      const data = await dbClient.report.findMany({
        where: onlyPublished ? { status: "published" } : undefined,
        orderBy: { period_start: "desc" },
      });

      return data.map((d) => ({
        ...d,
        program: d.program as Report["program"],
        period_start: parseDateString(d.period_start),
        period_end: parseDateString(d.period_end),
        amount_idr: toNumberOrNull(d.amount_idr),
        gallery_urls: toStringArray(d.gallery_urls),
        status: d.status as "draft" | "published",
        created_at: parseDateTimeString(d.created_at),
        updated_at: parseDateTimeString(d.updated_at),
      }));
    } catch (err: unknown) {
      console.error("[admin-api] getReports error:", getErrorMessage(err));
      throw new Error(`Gagal memuat laporan penyaluran: ${getErrorMessage(err)}`);
    }
  },

  async getReportBySlug(slug: string): Promise<Report | null> {
    const dbClient = requirePrisma();
    try {
      const d = await dbClient.report.findUnique({ where: { slug } });
      if (!d) return null;

      return {
        ...d,
        program: d.program as Report["program"],
        period_start: parseDateString(d.period_start),
        period_end: parseDateString(d.period_end),
        amount_idr: toNumberOrNull(d.amount_idr),
        gallery_urls: toStringArray(d.gallery_urls),
        status: d.status as "draft" | "published",
        created_at: parseDateTimeString(d.created_at),
        updated_at: parseDateTimeString(d.updated_at),
      };
    } catch (err: unknown) {
      console.error("[admin-api] getReportBySlug error:", getErrorMessage(err));
      throw new Error(`Gagal memuat laporan: ${getErrorMessage(err)}`);
    }
  },

  async getReportById(id: string): Promise<Report | null> {
    const dbClient = requirePrisma();
    try {
      const d = await dbClient.report.findUnique({ where: { id } });
      if (!d) return null;

      return {
        ...d,
        program: d.program as Report["program"],
        period_start: parseDateString(d.period_start),
        period_end: parseDateString(d.period_end),
        amount_idr: toNumberOrNull(d.amount_idr),
        gallery_urls: toStringArray(d.gallery_urls),
        status: d.status as "draft" | "published",
        created_at: parseDateTimeString(d.created_at),
        updated_at: parseDateTimeString(d.updated_at),
      };
    } catch (err: unknown) {
      console.error("[admin-api] getReportById error:", getErrorMessage(err));
      throw new Error(`Gagal memuat detail laporan: ${getErrorMessage(err)}`);
    }
  },

  async saveReport(
    item: Omit<Report, "id" | "created_at" | "updated_at">,
    id?: string
  ): Promise<Report> {
    const dbClient = requirePrisma();
    try {
      const payload = {
        slug: item.slug,
        title: item.title,
        program: item.program,
        period_start: new Date(item.period_start),
        period_end: new Date(item.period_end),
        summary: item.summary,
        body: item.body,
        beneficiaries: item.beneficiaries,
        amount_idr:
          item.amount_idr !== null && item.amount_idr !== undefined
            ? BigInt(item.amount_idr)
            : null,
        cover_url: item.cover_url || null,
        gallery_urls: (item.gallery_urls || []) as unknown as Prisma.InputJsonValue,
        pdf_url: item.pdf_url || null,
        status: item.status,
      };

      const result = id
        ? await dbClient.report.update({ where: { id }, data: payload })
        : await dbClient.report.create({ data: payload });

      return {
        ...result,
        program: result.program as Report["program"],
        period_start: parseDateString(result.period_start),
        period_end: parseDateString(result.period_end),
        amount_idr: toNumberOrNull(result.amount_idr),
        gallery_urls: toStringArray(result.gallery_urls),
        status: result.status as "draft" | "published",
        created_at: parseDateTimeString(result.created_at),
        updated_at: parseDateTimeString(result.updated_at),
      };
    } catch (err: unknown) {
      console.error("[admin-api] saveReport error:", getErrorMessage(err));
      throw new Error(`Gagal menyimpan laporan penyaluran: ${getErrorMessage(err)}`);
    }
  },

  async deleteReport(id: string): Promise<boolean> {
    const dbClient = requirePrisma();
    try {
      await dbClient.report.delete({ where: { id } });
      return true;
    } catch (err: unknown) {
      console.error("[admin-api] deleteReport error:", getErrorMessage(err));
      throw new Error(`Gagal menghapus laporan: ${getErrorMessage(err)}`);
    }
  },

  // 5. Themed Campaigns
  async getThemedCampaigns(): Promise<ThemedCampaign[]> {
    const dbClient = requirePrisma();
    try {
      const data = await dbClient.themedCampaign.findMany({
        orderBy: { created_at: "desc" },
      });

      return data.map((c) => ({
        ...c,
        target_idr: toNumber(c.target_idr),
        collected_idr: toNumber(c.collected_idr),
        status: c.status as "aktif" | "selesai",
        created_at: parseDateTimeString(c.created_at),
      }));
    } catch (err: unknown) {
      console.error("[admin-api] getThemedCampaigns error:", getErrorMessage(err));
      throw new Error(`Gagal memuat kampanye donasi tematik: ${getErrorMessage(err)}`);
    }
  },

  async getThemedCampaignById(id: string): Promise<ThemedCampaign | null> {
    const dbClient = requirePrisma();
    try {
      const c = await dbClient.themedCampaign.findUnique({ where: { id } });
      if (!c) return null;

      return {
        ...c,
        target_idr: toNumber(c.target_idr),
        collected_idr: toNumber(c.collected_idr),
        status: c.status as "aktif" | "selesai",
        created_at: parseDateTimeString(c.created_at),
      };
    } catch (err: unknown) {
      console.error("[admin-api] getThemedCampaignById error:", getErrorMessage(err));
      throw new Error(`Gagal memuat detail donasi tematik: ${getErrorMessage(err)}`);
    }
  },

  async saveThemedCampaign(
    item: Omit<ThemedCampaign, "id" | "created_at">,
    id?: string
  ): Promise<ThemedCampaign> {
    const dbClient = requirePrisma();
    try {
      const payload = {
        title: item.title,
        disaster_type: item.disaster_type,
        location: item.location,
        status: item.status,
        description: item.description,
        cover_url: item.cover_url || null,
        target_idr: BigInt(item.target_idr || 0),
        collected_idr: BigInt(item.collected_idr || 0),
      };

      const result = id
        ? await dbClient.themedCampaign.update({ where: { id }, data: payload })
        : await dbClient.themedCampaign.create({ data: payload });

      return {
        ...result,
        target_idr: toNumber(result.target_idr),
        collected_idr: toNumber(result.collected_idr),
        status: result.status as "aktif" | "selesai",
        created_at: parseDateTimeString(result.created_at),
      };
    } catch (err: unknown) {
      console.error("[admin-api] saveThemedCampaign error:", getErrorMessage(err));
      throw new Error(`Gagal menyimpan kampanye donasi tematik: ${getErrorMessage(err)}`);
    }
  },

  async deleteThemedCampaign(id: string): Promise<boolean> {
    const dbClient = requirePrisma();
    try {
      await dbClient.themedCampaign.delete({ where: { id } });
      return true;
    } catch (err: unknown) {
      console.error("[admin-api] deleteThemedCampaign error:", getErrorMessage(err));
      throw new Error(`Gagal menghapus donasi tematik: ${getErrorMessage(err)}`);
    }
  },

  // 6. Gallery Items
  async getGalleryItems(onlyPublished = false): Promise<GalleryItem[]> {
    const dbClient = requirePrisma();
    try {
      const data = await dbClient.galleryItem.findMany({
        where: onlyPublished ? { status: "published" } : undefined,
        orderBy: { date: "desc" },
      });

      return data.map((g) => ({
        ...g,
        date: parseDateString(g.date),
        status: g.status as "draft" | "published",
        created_at: parseDateTimeString(g.created_at),
      }));
    } catch (err: unknown) {
      console.error("[admin-api] getGalleryItems error:", getErrorMessage(err));
      throw new Error(`Gagal memuat galeri foto: ${getErrorMessage(err)}`);
    }
  },

  async getGalleryItemById(id: string): Promise<GalleryItem | null> {
    const dbClient = requirePrisma();
    try {
      const g = await dbClient.galleryItem.findUnique({ where: { id } });
      if (!g) return null;

      return {
        ...g,
        date: parseDateString(g.date),
        status: g.status as "draft" | "published",
        created_at: parseDateTimeString(g.created_at),
      };
    } catch (err: unknown) {
      console.error("[admin-api] getGalleryItemById error:", getErrorMessage(err));
      throw new Error(`Gagal memuat detail galeri foto: ${getErrorMessage(err)}`);
    }
  },

  async saveGalleryItem(
    item: Omit<GalleryItem, "id" | "created_at">,
    id?: string
  ): Promise<GalleryItem> {
    const dbClient = requirePrisma();
    try {
      const payload = {
        title: item.title,
        program: item.program,
        date: new Date(item.date),
        image_url: item.image_url,
        caption: item.caption || null,
        status: item.status,
      };

      const result = id
        ? await dbClient.galleryItem.update({ where: { id }, data: payload })
        : await dbClient.galleryItem.create({ data: payload });

      return {
        ...result,
        date: parseDateString(result.date),
        status: result.status as "draft" | "published",
        created_at: parseDateTimeString(result.created_at),
      };
    } catch (err: unknown) {
      console.error("[admin-api] saveGalleryItem error:", getErrorMessage(err));
      throw new Error(`Gagal menyimpan foto galeri: ${getErrorMessage(err)}`);
    }
  },

  async deleteGalleryItem(id: string): Promise<boolean> {
    const dbClient = requirePrisma();
    try {
      await dbClient.galleryItem.delete({ where: { id } });
      return true;
    } catch (err: unknown) {
      console.error("[admin-api] deleteGalleryItem error:", getErrorMessage(err));
      throw new Error(`Gagal menghapus foto galeri: ${getErrorMessage(err)}`);
    }
  },

  // 7. Site Settings (Bank, Contact, Social)
  async getBankAccounts(): Promise<BankAccount[]> {
    if (!isPrismaConfigured || !prisma) return DEFAULT_BANK_ACCOUNTS;

    try {
      const row = await prisma.siteSetting.findUnique({ where: { key: "bank_accounts" } });
      if (row?.value) {
        return row.value as unknown as BankAccount[];
      }
      return DEFAULT_BANK_ACCOUNTS;
    } catch (err: unknown) {
      console.error("[admin-api] getBankAccounts error:", getErrorMessage(err));
      return DEFAULT_BANK_ACCOUNTS;
    }
  },

  async updateBankAccounts(accounts: BankAccount[]): Promise<void> {
    const dbClient = requirePrisma();
    try {
      await dbClient.siteSetting.upsert({
        where: { key: "bank_accounts" },
        create: {
          key: "bank_accounts",
          value: accounts as unknown as Prisma.InputJsonValue,
        },
        update: {
          value: accounts as unknown as Prisma.InputJsonValue,
        },
      });
    } catch (err: unknown) {
      console.error("[admin-api] updateBankAccounts error:", getErrorMessage(err));
      throw new Error(`Gagal memperbarui rekening bank: ${getErrorMessage(err)}`);
    }
  },

  async getContactInfo(): Promise<ContactInfo> {
    if (!isPrismaConfigured || !prisma) return DEFAULT_CONTACT_INFO;

    try {
      const row = await prisma.siteSetting.findUnique({ where: { key: "contact_info" } });
      if (row?.value) {
        return row.value as unknown as ContactInfo;
      }
      return DEFAULT_CONTACT_INFO;
    } catch (err: unknown) {
      console.error("[admin-api] getContactInfo error:", getErrorMessage(err));
      return DEFAULT_CONTACT_INFO;
    }
  },

  async updateContactInfo(info: ContactInfo): Promise<void> {
    const dbClient = requirePrisma();
    try {
      await dbClient.siteSetting.upsert({
        where: { key: "contact_info" },
        create: {
          key: "contact_info",
          value: info as unknown as Prisma.InputJsonValue,
        },
        update: {
          value: info as unknown as Prisma.InputJsonValue,
        },
      });
    } catch (err: unknown) {
      console.error("[admin-api] updateContactInfo error:", getErrorMessage(err));
      throw new Error(`Gagal memperbarui kontak: ${getErrorMessage(err)}`);
    }
  },

  async getSocialLinks(): Promise<SocialLinks> {
    if (!isPrismaConfigured || !prisma) return DEFAULT_SOCIAL_LINKS;

    try {
      const row = await prisma.siteSetting.findUnique({ where: { key: "social_links" } });
      if (row?.value) {
        return row.value as unknown as SocialLinks;
      }
      return DEFAULT_SOCIAL_LINKS;
    } catch (err: unknown) {
      console.error("[admin-api] getSocialLinks error:", getErrorMessage(err));
      return DEFAULT_SOCIAL_LINKS;
    }
  },

  async updateSocialLinks(links: SocialLinks): Promise<void> {
    const dbClient = requirePrisma();
    try {
      await dbClient.siteSetting.upsert({
        where: { key: "social_links" },
        create: {
          key: "social_links",
          value: links as unknown as Prisma.InputJsonValue,
        },
        update: {
          value: links as unknown as Prisma.InputJsonValue,
        },
      });
    } catch (err: unknown) {
      console.error("[admin-api] updateSocialLinks error:", getErrorMessage(err));
      throw new Error(`Gagal memperbarui media sosial: ${getErrorMessage(err)}`);
    }
  },

  // 8. Aggregated Stats
  async getAggregatedStats(): Promise<AggregatedStats> {
    const [infak, geber, reports] = await Promise.all([
      this.getInfakJinan(true),
      this.getGeberDistributions(true),
      this.getReports(true),
    ]);

    const totalMushaf = infak.length;
    const totalMasjid = geber.length;
    const provinces = new Set<string>();

    infak.forEach((item) => {
      if (item.pesantren_province) provinces.add(item.pesantren_province.trim());
    });
    geber.forEach((item) => {
      if (item.province) provinces.add(item.province.trim());
    });

    const totalBeneficiaries = reports.reduce(
      (total, report) => total + (report.beneficiaries || 0),
      0
    );

    return {
      totalMushaf,
      totalMasjid,
      totalProvinces: provinces.size,
      totalBeneficiaries,
    };
  },
};
