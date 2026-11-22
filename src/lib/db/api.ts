import { cache } from "react";
import { isPrismaConfigured, prisma } from "./prisma";
import { localStore } from "./local-store";
import {
  toStringArray,
  parseDateString,
  parseDateTimeString,
  toNumberOrNull,
  toNumber,
  getErrorMessage,
  sanitizeImageUrl,
  sanitizeImageUrls,
} from "./formatters";
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
  InfakJinanRecord,
  PublicInfakJinanRecord,
  PublicInfakJinanSantri,
  HafalanUpdate,
  BussDistribution,
  PublicBussDistribution,
  YatimActivity,
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
  // 1. Infak Distributions (Legacy CSV Data)
  getInfakDistributions: cache(async (onlyPublished = true): Promise<InfakDistribution[]> => {
    if (!isPrismaConfigured || !prisma) return [];

    try {
      const data = await prisma.infakDistribution.findMany({
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
      console.warn("[db.api] getInfakDistributions fallback:", getErrorMessage(err));
      return [];
    }
  }),

  getInfakById: cache(async (id: string): Promise<InfakDistribution | null> => {
    if (!isPrismaConfigured || !prisma) return null;

    try {
      const d = await prisma.infakDistribution.findUnique({ where: { id } });
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
      console.warn("[db.api] getInfakById fallback:", getErrorMessage(err));
      return null;
    }
  }),

  // 2. Geber Masjid
  getGeberDistributions: cache(async (onlyPublished = true): Promise<GeberMasjidDistribution[]> => {
    if (!isPrismaConfigured || !prisma) return [];

    try {
      const data = await prisma.geberMasjidDistribution.findMany({
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
      console.warn("[db.api] getGeberDistributions fallback:", getErrorMessage(err));
      return [];
    }
  }),

  getGeberById: cache(async (id: string): Promise<GeberMasjidDistribution | null> => {
    if (!isPrismaConfigured || !prisma) return null;

    try {
      const d = await prisma.geberMasjidDistribution.findUnique({ where: { id } });
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
      console.warn("[db.api] getGeberById fallback:", getErrorMessage(err));
      return null;
    }
  }),

  // 3. Reports
  getReports: cache(async (onlyPublished = true): Promise<Report[]> => {
    if (!isPrismaConfigured || !prisma) return localStore.getReports(onlyPublished);

    try {
      const data = await prisma.report.findMany({
        where: onlyPublished ? { status: "published" } : undefined,
        orderBy: { period_start: "desc" },
      });
      if (data.length === 0) {
        return localStore.getReports(onlyPublished);
      }
      return data.map((d) => ({
        ...d,
        program: d.program as Report["program"],
        period_start: parseDateString(d.period_start),
        period_end: parseDateString(d.period_end),
        amount_idr: toNumberOrNull(d.amount_idr),
        cover_url: sanitizeImageUrl(d.cover_url),
        gallery_urls: sanitizeImageUrls(d.gallery_urls),
        status: d.status as "draft" | "published",
        created_at: parseDateTimeString(d.created_at),
        updated_at: parseDateTimeString(d.updated_at),
      }));
    } catch (err: unknown) {
      console.warn("[db.api] getReports fallback:", getErrorMessage(err));
      return localStore.getReports(onlyPublished);
    }
  }),

  getReportBySlug: cache(async (slug: string): Promise<Report | null> => {
    if (!isPrismaConfigured || !prisma) return localStore.getReportBySlug(slug);

    try {
      const d = await prisma.report.findUnique({ where: { slug } });
      if (!d) return localStore.getReportBySlug(slug);
      return {
        ...d,
        program: d.program as Report["program"],
        period_start: parseDateString(d.period_start),
        period_end: parseDateString(d.period_end),
        amount_idr: toNumberOrNull(d.amount_idr),
        cover_url: sanitizeImageUrl(d.cover_url),
        gallery_urls: sanitizeImageUrls(d.gallery_urls),
        status: d.status as "draft" | "published",
        created_at: parseDateTimeString(d.created_at),
        updated_at: parseDateTimeString(d.updated_at),
      };
    } catch (err: unknown) {
      console.warn("[db.api] getReportBySlug fallback:", getErrorMessage(err));
      return localStore.getReportBySlug(slug);
    }
  }),

  getReportById: cache(async (id: string): Promise<Report | null> => {
    if (!isPrismaConfigured || !prisma) return localStore.getReportById(id);

    try {
      const d = await prisma.report.findUnique({ where: { id } });
      if (!d) return localStore.getReportById(id);
      return {
        ...d,
        program: d.program as Report["program"],
        period_start: parseDateString(d.period_start),
        period_end: parseDateString(d.period_end),
        amount_idr: toNumberOrNull(d.amount_idr),
        cover_url: sanitizeImageUrl(d.cover_url),
        gallery_urls: sanitizeImageUrls(d.gallery_urls),
        status: d.status as "draft" | "published",
        created_at: parseDateTimeString(d.created_at),
        updated_at: parseDateTimeString(d.updated_at),
      };
    } catch (err: unknown) {
      console.warn("[db.api] getReportById fallback:", getErrorMessage(err));
      return localStore.getReportById(id);
    }
  }),

  // 4. Themed Campaigns
  getThemedCampaigns: cache(async (): Promise<ThemedCampaign[]> => {
    if (!isPrismaConfigured || !prisma) return localStore.getCampaigns();

    try {
      const data = await prisma.themedCampaign.findMany({
        orderBy: { created_at: "desc" },
      });
      if (data.length === 0) {
        return localStore.getCampaigns();
      }
      return data.map((c) => ({
        ...c,
        cover_url: sanitizeImageUrl(c.cover_url),
        target_idr: toNumber(c.target_idr),
        collected_idr: toNumber(c.collected_idr),
        status: c.status as "aktif" | "selesai",
        created_at: parseDateTimeString(c.created_at),
      }));
    } catch (err: unknown) {
      console.warn("[db.api] getThemedCampaigns fallback:", getErrorMessage(err));
      return localStore.getCampaigns();
    }
  }),

  // 5. Gallery Items
  getGalleryItems: cache(async (): Promise<GalleryItem[]> => {
    if (!isPrismaConfigured || !prisma) return localStore.getGallery(true);

    try {
      const data = await prisma.galleryItem.findMany({
        where: { status: "published" },
        orderBy: { date: "desc" },
      });
      if (data.length === 0) {
        return localStore.getGallery(true);
      }
      return data
        .map((g) => ({
          ...g,
          image_url: sanitizeImageUrl(g.image_url) || "",
          date: parseDateString(g.date),
          status: g.status as "draft" | "published",
          created_at: parseDateTimeString(g.created_at),
        }))
        .filter((g) => Boolean(g.image_url));
    } catch (err: unknown) {
      console.warn("[db.api] getGalleryItems fallback:", getErrorMessage(err));
      return localStore.getGallery(true);
    }
  }),

  // 6. Settings (Bank, Contact, Social)
  getBankAccounts: cache(async (): Promise<BankAccount[]> => {
    if (!isPrismaConfigured || !prisma) return DEFAULT_BANK_ACCOUNTS;

    try {
      const row = await prisma.siteSetting.findUnique({ where: { key: "bank_accounts" } });
      if (row?.value) {
        return row.value as unknown as BankAccount[];
      }
      return DEFAULT_BANK_ACCOUNTS;
    } catch (err: unknown) {
      console.warn("[db.api] getBankAccounts fallback:", getErrorMessage(err));
      return DEFAULT_BANK_ACCOUNTS;
    }
  }),

  getContactInfo: cache(async (): Promise<ContactInfo> => {
    if (!isPrismaConfigured || !prisma) return DEFAULT_CONTACT_INFO;

    try {
      const row = await prisma.siteSetting.findUnique({ where: { key: "contact_info" } });
      if (row?.value) {
        return row.value as unknown as ContactInfo;
      }
      return DEFAULT_CONTACT_INFO;
    } catch (err: unknown) {
      console.warn("[db.api] getContactInfo fallback:", getErrorMessage(err));
      return DEFAULT_CONTACT_INFO;
    }
  }),

  getSocialLinks: cache(async (): Promise<SocialLinks> => {
    if (!isPrismaConfigured || !prisma) return DEFAULT_SOCIAL_LINKS;

    try {
      const row = await prisma.siteSetting.findUnique({ where: { key: "social_links" } });
      if (row?.value) {
        return row.value as unknown as SocialLinks;
      }
      return DEFAULT_SOCIAL_LINKS;
    } catch (err: unknown) {
      console.warn("[db.api] getSocialLinks fallback:", getErrorMessage(err));
      return DEFAULT_SOCIAL_LINKS;
    }
  }),

  // 7. Infak Al-Qur'an Jinan (Dua Tingkat)
  getInfakJinan: cache(async (onlyPublished = true): Promise<InfakJinanRecord[]> => {
    if (!isPrismaConfigured || !prisma) return [];

    try {
      const data = await prisma.infakJinan.findMany({
        where: onlyPublished ? { status: "published" } : undefined,
        orderBy: { mushaf_no: "asc" },
        include: {
          photos: { orderBy: { sort: "asc" } },
          santri_list: {
            where: onlyPublished ? { status: "published" } : undefined,
            orderBy: { sort: "asc" },
            include: {
              hafalan_updates: { orderBy: { updated_on: "desc" } },
            },
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
      console.warn("[db.api] getInfakJinan fallback:", getErrorMessage(err));
      return [];
    }
  }),

  getPublicInfakJinan: cache(async (): Promise<PublicInfakJinanRecord[]> => {
    const list = await db.getInfakJinan(true);
    return list.map((item) => ({
      id: item.id,
      mushaf_no: item.mushaf_no,
      display_donor_name: item.show_donor_name ? item.donor_name : "Hamba Allah",
      donor_origin: item.donor_origin,
      dedication_name: item.dedication_name,
      pesantren_name: item.pesantren_name,
      pesantren_province: item.pesantren_province,
      pesantren_city: item.pesantren_city,
      address: item.address,
      distributed_at: item.distributed_at,
      maps_url: item.maps_url,
      status: item.status,
      photos: item.photos,
      santri_count: item.santri_count,
    }));
  }),

  getPublicInfakJinanDetail: cache(
    async (
      id: string
    ): Promise<{ donation: PublicInfakJinanRecord; santri: PublicInfakJinanSantri[] } | null> => {
      if (!isPrismaConfigured || !prisma) return null;

      try {
        const item = await prisma.infakJinan.findUnique({
          where: { id },
          include: {
            photos: { orderBy: { sort: "asc" } },
            santri_list: {
              where: { status: "published" },
              orderBy: { sort: "asc" },
              include: {
                hafalan_updates: { orderBy: { updated_on: "desc" } },
              },
            },
          },
        });

        if (!item || item.status !== "published") return null;

        const donation: PublicInfakJinanRecord = {
          id: item.id,
          mushaf_no: item.mushaf_no,
          display_donor_name: item.show_donor_name ? item.donor_name : "Hamba Allah",
          donor_origin: item.donor_origin,
          dedication_name: item.dedication_name,
          pesantren_name: item.pesantren_name,
          pesantren_province: item.pesantren_province,
          pesantren_city: item.pesantren_city,
          address: item.address,
          distributed_at: parseDateString(item.distributed_at),
          maps_url: item.maps_url,
          status: item.status as "draft" | "published",
          photos: item.photos.map((p) => ({
            id: p.id,
            infak_id: p.infak_id,
            url: p.url,
            caption: p.caption,
            sort: p.sort,
            created_at: parseDateTimeString(p.created_at),
          })),
          santri_count: item.santri_list.length,
        };

        const santri: PublicInfakJinanSantri[] = item.santri_list.map((s) => {
          const updates: HafalanUpdate[] = s.hafalan_updates.map((h) => ({
            id: h.id,
            santri_id: h.santri_id,
            updated_on: parseDateString(h.updated_on),
            surah_no: h.surah_no,
            surah_name: h.surah_name,
            ayat: h.ayat,
            juz: h.juz,
            notes: h.notes || undefined,
          }));
          const latest = updates[0];
          return {
            id: s.id,
            infak_id: s.infak_id,
            santri_name: s.name,
            sort: s.sort,
            status: s.status as "draft" | "published",
            latest_surah: latest ? latest.surah_name : "-",
            latest_ayat: latest ? latest.ayat : undefined,
            latest_juz: latest ? latest.juz : undefined,
            hafalan_updates: updates,
          };
        });

        return { donation, santri };
      } catch (err: unknown) {
        console.warn("[db.api] getPublicInfakJinanDetail fallback:", getErrorMessage(err));
        return null;
      }
    }
  ),

  getInfakJinanById: cache(async (id: string): Promise<InfakJinanRecord | null> => {
    if (!isPrismaConfigured || !prisma) return null;

    try {
      const item = await prisma.infakJinan.findUnique({
        where: { id },
        include: {
          photos: { orderBy: { sort: "asc" } },
          santri_list: {
            orderBy: { sort: "asc" },
            include: {
              hafalan_updates: { orderBy: { updated_on: "desc" } },
            },
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
      console.warn("[db.api] getInfakJinanById fallback:", getErrorMessage(err));
      return null;
    }
  }),

  // 8. BUSS Al-Qur'an
  getBussDistributions: cache(async (onlyPublished = true): Promise<BussDistribution[]> => {
    if (!isPrismaConfigured || !prisma) return [];

    try {
      const data = await prisma.bussDistribution.findMany({
        where: onlyPublished ? { status: "published" } : undefined,
        orderBy: [{ year: "desc" }, { created_at: "desc" }],
      });
      return data.map((b) => ({
        ...b,
        photo_urls: toStringArray(b.photo_urls),
        status: b.status as "draft" | "published",
        created_at: parseDateTimeString(b.created_at),
      }));
    } catch (err: unknown) {
      console.warn("[db.api] getBussDistributions fallback:", getErrorMessage(err));
      return [];
    }
  }),

  getPublicBussDistributions: cache(async (): Promise<PublicBussDistribution[]> => {
    const all = await db.getBussDistributions(true);
    return all.map((item) => ({
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
  }),

  // 9. Yatim Berdikari
  getYatimActivities: cache(async (onlyPublished = true): Promise<YatimActivity[]> => {
    if (!isPrismaConfigured || !prisma) return [];

    try {
      const data = await prisma.yatimDistribution.findMany({
        where: onlyPublished ? { status: "published" } : undefined,
        orderBy: { created_at: "desc" },
      });
      return data.map((y) => {
        const docUrls = toStringArray(y.documentation_urls);
        const photoUrls = toStringArray(y.photo_urls);
        return {
          id: y.id,
          year: y.year,
          activity_name: y.activity_name,
          organizer: y.organizer,
          documentation_urls: docUrls.length > 0 ? docUrls : photoUrls,
          description: y.description,
          activity_date: y.activity_date
            ? parseDateString(y.activity_date)
            : parseDateString(y.created_at),
          status: y.status as "draft" | "published",
          created_at: parseDateTimeString(y.created_at),
        };
      });
    } catch (err: unknown) {
      console.warn("[db.api] getYatimActivities fallback:", getErrorMessage(err));
      return [];
    }
  }),

  getPublicYatimDistributions: cache(async (): Promise<YatimActivity[]> => {
    return db.getYatimActivities(true);
  }),

  // 10. Aggregated Stats
  getAggregatedStats: cache(async (): Promise<AggregatedStats> => {
    if (!isPrismaConfigured || !prisma) {
      return {
        totalMushaf: 0,
        totalMasjid: 0,
        totalProvinces: 0,
        totalBeneficiaries: 0,
      };
    }

    try {
      const [jinanList, geberList, reportsList] = await Promise.all([
        prisma.infakJinan.findMany({
          where: { status: "published" },
          select: { pesantren_province: true },
        }),
        prisma.geberMasjidDistribution.findMany({
          where: { status: "published" },
          select: { province: true },
        }),
        prisma.report.findMany({
          where: { status: "published" },
          select: { beneficiaries: true },
        }),
      ]);

      const totalMushaf = jinanList.length;
      const totalMasjid = geberList.length;
      const provinces = new Set<string>();

      jinanList.forEach((item) => {
        if (item.pesantren_province) provinces.add(item.pesantren_province.trim());
      });
      geberList.forEach((item) => {
        if (item.province) provinces.add(item.province.trim());
      });

      const totalBeneficiaries = reportsList.reduce(
        (total, report) => total + (report.beneficiaries || 0),
        0
      );

      return {
        totalMushaf,
        totalMasjid,
        totalProvinces: provinces.size,
        totalBeneficiaries,
      };
    } catch (err: unknown) {
      console.warn("[db.api] getAggregatedStats fallback:", getErrorMessage(err));
      return {
        totalMushaf: 0,
        totalMasjid: 0,
        totalProvinces: 0,
        totalBeneficiaries: 0,
      };
    }
  }),
};
