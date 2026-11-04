import { localStore } from "./local-store";
import { isSupabaseConfigured } from "./client";
import { adminSupabase } from "./admin-client";
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

function getClient() {
  return adminSupabase;
}

function throwIfError(error: { message: string } | null, operation: string): void {
  if (error) {
    console.error(`[database] ${operation}: ${error.message}`);
    throw new Error(`Operasi database gagal: ${operation}`);
  }
}

export const db = {
  // Infak Al-Qur'an Jinan (Dua Tingkat)
  async getInfakJinan(onlyPublished = false): Promise<InfakJinanRecord[]> {
    if (!isSupabaseConfigured || !adminSupabase) {
      return localStore.getInfakJinan(onlyPublished);
    }
    try {
      const client = getClient();
      let query = client
        .from("infak_jinan")
        .select("*, photos:infak_jinan_photos(*), santri_list:infak_jinan_santri(*, hafalan_updates:santri_hafalan_updates(*))")
        .order("mushaf_no", { ascending: true });
      if (onlyPublished) query = query.eq("status", "published");
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return localStore.getInfakJinan(onlyPublished);
      }
      return data as InfakJinanRecord[];
    } catch {
      return localStore.getInfakJinan(onlyPublished);
    }
  },

  async getInfakJinanById(id: string): Promise<InfakJinanRecord | null> {
    return localStore.getInfakJinanById(id) || null;
  },

  async saveInfakJinan(item: Omit<InfakJinanRecord, "id" | "created_at" | "updated_at">, id?: string): Promise<InfakJinanRecord> {
    if (!isSupabaseConfigured || !adminSupabase) {
      if (id) {
        const existing = localStore.getInfakJinanById(id);
        if (existing) {
          Object.assign(existing, item, { updated_at: new Date().toISOString() });
          return existing;
        }
      }
      return localStore.addInfakJinan(item);
    }

    try {
      const client = getClient();
      const { santri_list: _sl, photos: _ph, ...jinanData } = item;
      const query = id
        ? client.from("infak_jinan").update({ ...jinanData, updated_at: new Date().toISOString() }).eq("id", id)
        : client.from("infak_jinan").insert(jinanData);
      const { data, error } = await query.select().single();
      throwIfError(error, id ? "memperbarui data infak jinan" : "menambahkan data infak jinan");
      return data as InfakJinanRecord;
    } catch (err) {
      console.warn("Supabase saveInfakJinan fallback ke localStore:", err);
      if (id) {
        const existing = localStore.getInfakJinanById(id);
        if (existing) {
          Object.assign(existing, item, { updated_at: new Date().toISOString() });
          return existing;
        }
      }
      return localStore.addInfakJinan(item);
    }
  },

  async deleteInfakJinan(id: string): Promise<boolean> {
    localStore.deleteInfakJinan(id);
    if (!isSupabaseConfigured || !adminSupabase) {
      return true;
    }
    try {
      const client = getClient();
      const { error } = await client.from("infak_jinan").delete().eq("id", id);
      throwIfError(error, "menghapus data infak jinan");
      return true;
    } catch (err) {
      console.warn("Supabase deleteInfakJinan fallback ke localStore:", err);
      return true;
    }
  },

  async addSantriHafalanUpdate(santriId: string, update: Omit<HafalanUpdate, "id">): Promise<HafalanUpdate | null> {
    return localStore.addSantriHafalanUpdate(santriId, update);
  },
  async getInfakDistributions(onlyPublished = true): Promise<InfakDistribution[]> {
    const client = getClient();
    let query = client.from("infak_distributions").select("*").order("mushaf_no", { ascending: true });
    if (onlyPublished) query = query.eq("status", "published");
    const { data, error } = await query;
    throwIfError(error, "memuat data infak");
    return (data ?? []) as InfakDistribution[];
  },

  async getInfakById(id: string): Promise<InfakDistribution | null> {
    const client = getClient();
    const { data, error } = await client.from("infak_distributions").select("*").eq("id", id).maybeSingle();
    throwIfError(error, "memuat detail infak");
    return (data as InfakDistribution | null) ?? null;
  },

  async saveInfak(item: Omit<InfakDistribution, "id" | "created_at" | "updated_at">, id?: string): Promise<InfakDistribution> {
    const client = getClient();
    const query = id
      ? client.from("infak_distributions").update({ ...item, updated_at: new Date().toISOString() }).eq("id", id)
      : client.from("infak_distributions").insert(item);
    const { data, error } = await query.select().single();
    throwIfError(error, id ? "memperbarui data infak" : "menambahkan data infak");
    if (!data) throw new Error("Data infak tidak dikembalikan oleh database.");
    return data as InfakDistribution;
  },

  async deleteInfak(id: string): Promise<boolean> {
    const client = getClient();
    const { data, error } = await client.from("infak_distributions").delete().eq("id", id).select("id");
    throwIfError(error, "menghapus data infak");
    return Boolean(data?.length);
  },

  async getGeberDistributions(onlyPublished = true): Promise<GeberMasjidDistribution[]> {
    const client = getClient();
    let query = client.from("geber_masjid_distributions").select("*").order("activity_date", { ascending: false });
    if (onlyPublished) query = query.eq("status", "published");
    const { data, error } = await query;
    throwIfError(error, "memuat data Geber Masjid");
    return (data ?? []) as GeberMasjidDistribution[];
  },

  async getGeberById(id: string): Promise<GeberMasjidDistribution | null> {
    const client = getClient();
    const { data, error } = await client.from("geber_masjid_distributions").select("*").eq("id", id).maybeSingle();
    throwIfError(error, "memuat detail Geber Masjid");
    return (data as GeberMasjidDistribution | null) ?? null;
  },

  async saveGeber(item: Omit<GeberMasjidDistribution, "id" | "created_at" | "updated_at">, id?: string): Promise<GeberMasjidDistribution> {
    const client = getClient();
    const query = id
      ? client.from("geber_masjid_distributions").update({ ...item, updated_at: new Date().toISOString() }).eq("id", id)
      : client.from("geber_masjid_distributions").insert(item);
    const { data, error } = await query.select().single();
    throwIfError(error, id ? "memperbarui data Geber Masjid" : "menambahkan data Geber Masjid");
    if (!data) throw new Error("Data Geber Masjid tidak dikembalikan oleh database.");
    return data as GeberMasjidDistribution;
  },

  async deleteGeber(id: string): Promise<boolean> {
    const client = getClient();
    const { data, error } = await client.from("geber_masjid_distributions").delete().eq("id", id).select("id");
    throwIfError(error, "menghapus data Geber Masjid");
    return Boolean(data?.length);
  },

  async getReports(onlyPublished = true): Promise<Report[]> {
    const client = getClient();
    let query = client.from("reports").select("*").order("period_start", { ascending: false });
    if (onlyPublished) query = query.eq("status", "published");
    const { data, error } = await query;
    throwIfError(error, "memuat laporan");
    return (data ?? []) as Report[];
  },

  async getReportBySlug(slug: string): Promise<Report | null> {
    const client = getClient();
    const { data, error } = await client.from("reports").select("*").eq("slug", slug).maybeSingle();
    throwIfError(error, "memuat laporan berdasarkan slug");
    return (data as Report | null) ?? null;
  },

  async getReportById(id: string): Promise<Report | null> {
    const client = getClient();
    const { data, error } = await client.from("reports").select("*").eq("id", id).maybeSingle();
    throwIfError(error, "memuat detail laporan");
    return (data as Report | null) ?? null;
  },

  async saveReport(item: Omit<Report, "id" | "created_at" | "updated_at">, id?: string): Promise<Report> {
    const client = getClient();
    const query = id
      ? client.from("reports").update({ ...item, updated_at: new Date().toISOString() }).eq("id", id)
      : client.from("reports").insert(item);
    const { data, error } = await query.select().single();
    throwIfError(error, id ? "memperbarui laporan" : "menambahkan laporan");
    if (!data) throw new Error("Laporan tidak dikembalikan oleh database.");
    return data as Report;
  },

  async deleteReport(id: string): Promise<boolean> {
    const client = getClient();
    const { data, error } = await client.from("reports").delete().eq("id", id).select("id");
    throwIfError(error, "menghapus laporan");
    return Boolean(data?.length);
  },

  async getThemedCampaigns(): Promise<ThemedCampaign[]> {
    const client = getClient();
    const { data, error } = await client.from("themed_campaigns").select("*").order("created_at", { ascending: false });
    throwIfError(error, "memuat kampanye tematik");
    return (data ?? []) as ThemedCampaign[];
  },

  async getThemedCampaignById(id: string): Promise<ThemedCampaign | null> {
    const client = getClient();
    const { data, error } = await client.from("themed_campaigns").select("*").eq("id", id).maybeSingle();
    throwIfError(error, "memuat detail kampanye tematik");
    return (data as ThemedCampaign | null) ?? null;
  },

  async saveThemedCampaign(
    item: Omit<ThemedCampaign, "id" | "created_at">,
    id?: string
  ): Promise<ThemedCampaign> {
    const client = getClient();
    const query = id
      ? client.from("themed_campaigns").update(item).eq("id", id)
      : client.from("themed_campaigns").insert(item);
    const { data, error } = await query.select().single();
    throwIfError(error, id ? "memperbarui kampanye tematik" : "menambahkan kampanye tematik");
    if (!data) throw new Error("Data kampanye tidak dikembalikan oleh database.");
    return data as ThemedCampaign;
  },

  async deleteThemedCampaign(id: string): Promise<boolean> {
    const client = getClient();
    const { data, error } = await client.from("themed_campaigns").delete().eq("id", id).select("id");
    throwIfError(error, "menghapus kampanye tematik");
    return Boolean(data?.length);
  },

  async getGalleryItems(onlyPublished = false): Promise<GalleryItem[]> {
    const client = getClient();
    let query = client.from("gallery_items").select("*").order("date", { ascending: false });
    if (onlyPublished) query = query.eq("status", "published");
    const { data, error } = await query;
    throwIfError(error, "memuat galeri");
    return (data ?? []) as GalleryItem[];
  },

  async getGalleryItemById(id: string): Promise<GalleryItem | null> {
    const client = getClient();
    const { data, error } = await client.from("gallery_items").select("*").eq("id", id).maybeSingle();
    throwIfError(error, "memuat detail foto galeri");
    return (data as GalleryItem | null) ?? null;
  },

  async saveGalleryItem(
    item: Omit<GalleryItem, "id" | "created_at">,
    id?: string
  ): Promise<GalleryItem> {
    const client = getClient();
    const query = id
      ? client.from("gallery_items").update(item).eq("id", id)
      : client.from("gallery_items").insert(item);
    const { data, error } = await query.select().single();
    throwIfError(error, id ? "memperbarui foto galeri" : "menambahkan foto galeri");
    if (!data) throw new Error("Data galeri tidak dikembalikan oleh database.");
    return data as GalleryItem;
  },

  async deleteGalleryItem(id: string): Promise<boolean> {
    const client = getClient();
    const { data, error } = await client.from("gallery_items").delete().eq("id", id).select("id");
    throwIfError(error, "menghapus foto galeri");
    return Boolean(data?.length);
  },

  async getBankAccounts(): Promise<BankAccount[]> {
    const client = getClient();
    const { data, error } = await client.from("site_settings").select("value").eq("key", "bank_accounts").maybeSingle();
    throwIfError(error, "memuat rekening bank");
    return (data?.value as BankAccount[] | undefined) ?? [];
  },

  async updateBankAccounts(accounts: BankAccount[]): Promise<void> {
    const client = getClient();
    const { error } = await client.from("site_settings").upsert({
      key: "bank_accounts",
      value: accounts,
      updated_at: new Date().toISOString(),
    });
    throwIfError(error, "menyimpan rekening bank");
  },

  async getContactInfo(): Promise<ContactInfo> {
    const client = getClient();
    const { data, error } = await client.from("site_settings").select("value").eq("key", "contact_info").maybeSingle();
    throwIfError(error, "memuat informasi kontak");
    return (data?.value as ContactInfo | undefined) ?? {
      whatsapp: "",
      phone: "",
      email: "",
      address: "",
    };
  },

  async updateContactInfo(info: ContactInfo): Promise<void> {
    const client = getClient();
    const { error } = await client.from("site_settings").upsert({
      key: "contact_info",
      value: info,
      updated_at: new Date().toISOString(),
    });
    throwIfError(error, "menyimpan informasi kontak");
  },

  async getSocialLinks(): Promise<SocialLinks> {
    const client = getClient();
    const { data, error } = await client.from("site_settings").select("value").eq("key", "social_links").maybeSingle();
    throwIfError(error, "memuat tautan media sosial");
    return (data?.value as SocialLinks | undefined) ?? {
      instagram: "",
      youtube: "",
      tiktok: "",
    };
  },

  async updateSocialLinks(links: SocialLinks): Promise<void> {
    const client = getClient();
    const { error } = await client.from("site_settings").upsert({
      key: "social_links",
      value: links,
      updated_at: new Date().toISOString(),
    });
    throwIfError(error, "menyimpan tautan media sosial");
  },

  async getAggregatedStats(): Promise<AggregatedStats> {
    const [infak, geber, reports] = await Promise.all([
      this.getInfakDistributions(true),
      this.getGeberDistributions(true),
      this.getReports(true),
    ]);

    const totalMushaf = infak.reduce((total, item) => total + (item.quantity || 1), 0);
    const totalMasjid = geber.length;
    const provinces = new Set<string>();

    infak.forEach((item) => item.province && provinces.add(item.province));
    geber.forEach((item) => item.province && provinces.add(item.province));

    // Report beneficiaries can overlap between reporting periods. Do not present their sum as unique people.
    const totalBeneficiaries = reports.reduce((total, report) => total + (report.beneficiaries || 0), 0);

    return {
      totalMushaf,
      totalMasjid,
      totalProvinces: provinces.size,
      totalBeneficiaries,
    };
  },
};
