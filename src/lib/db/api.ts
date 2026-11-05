import { isSupabaseConfigured, supabase } from "./client";
import { localStore } from "./local-store";
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

function getClient() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase belum dikonfigurasi. Periksa NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  return supabase;
}

function throwIfError(error: { message: string } | null, operation: string): void {
  if (error) {
    console.error(`[database] ${operation}: ${error.message}`);
    throw new Error(`Operasi database gagal: ${operation}`);
  }
}

export const db = {
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

  async getGalleryItems(): Promise<GalleryItem[]> {
    const client = getClient();
    const { data, error } = await client.from("gallery_items").select("*").eq("status", "published").order("date", { ascending: false });
    throwIfError(error, "memuat galeri");
    return (data ?? []) as GalleryItem[];
  },

  async getBankAccounts(): Promise<BankAccount[]> {
    if (!isSupabaseConfigured || !supabase) {
      return localStore.getBankAccounts();
    }
    try {
      const client = getClient();
      const { data, error } = await client.from("site_settings").select("value").eq("key", "bank_accounts").maybeSingle();
      if (error || !data || !data.value) {
        return localStore.getBankAccounts();
      }
      return data.value as BankAccount[];
    } catch {
      return localStore.getBankAccounts();
    }
  },

  async updateBankAccounts(accounts: BankAccount[]): Promise<void> {
    localStore.updateBankAccounts(accounts);
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const client = getClient();
      const { error } = await client.from("site_settings").upsert({
        key: "bank_accounts",
        value: accounts,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.warn("Supabase updateBankAccounts fallback ke localStore:", error.message);
      }
    } catch (err) {
      console.warn("Supabase updateBankAccounts fallback ke localStore:", err);
    }
  },

  async getContactInfo(): Promise<ContactInfo> {
    if (!isSupabaseConfigured || !supabase) {
      return localStore.getContactInfo();
    }
    try {
      const client = getClient();
      const { data, error } = await client.from("site_settings").select("value").eq("key", "contact_info").maybeSingle();
      if (error || !data || !data.value) {
        return localStore.getContactInfo();
      }
      return data.value as ContactInfo;
    } catch {
      return localStore.getContactInfo();
    }
  },

  async updateContactInfo(info: ContactInfo): Promise<void> {
    localStore.updateContactInfo(info);
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const client = getClient();
      const { error } = await client.from("site_settings").upsert({
        key: "contact_info",
        value: info,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.warn("Supabase updateContactInfo fallback ke localStore:", error.message);
      }
    } catch (err) {
      console.warn("Supabase updateContactInfo fallback ke localStore:", err);
    }
  },

  async getSocialLinks(): Promise<SocialLinks> {
    if (!isSupabaseConfigured || !supabase) {
      return localStore.getSocialLinks();
    }
    try {
      const client = getClient();
      const { data, error } = await client.from("site_settings").select("value").eq("key", "social_links").maybeSingle();
      if (error || !data || !data.value) {
        return localStore.getSocialLinks();
      }
      return data.value as SocialLinks;
    } catch {
      return localStore.getSocialLinks();
    }
  },

  async updateSocialLinks(links: SocialLinks): Promise<void> {
    localStore.updateSocialLinks(links);
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const client = getClient();
      const { error } = await client.from("site_settings").upsert({
        key: "social_links",
        value: links,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.warn("Supabase updateSocialLinks fallback ke localStore:", error.message);
      }
    } catch (err) {
      console.warn("Supabase updateSocialLinks fallback ke localStore:", err);
    }
  },


    // Infak Al-Qur'an Jinan (Dua Tingkat: Donasi -> Santri)
  async getInfakJinan(onlyPublished = true): Promise<InfakJinanRecord[]> {
    if (!isSupabaseConfigured || !supabase) {
      return localStore.getInfakJinan(onlyPublished);
    }
    try {
      const client = getClient();
      let query = client.from("infak_jinan").select("*, photos:infak_jinan_photos(*), santri_list:infak_jinan_santri(*, hafalan_updates:santri_hafalan_updates(*))").order("mushaf_no", { ascending: true });
      if (onlyPublished) query = query.eq("status", "published");
      const { data, error } = await query;
      if (error || !data) {
        return localStore.getInfakJinan(onlyPublished);
      }
      return data as InfakJinanRecord[];
    } catch {
      return localStore.getInfakJinan(onlyPublished);
    }
  },

  async getPublicInfakJinan(): Promise<PublicInfakJinanRecord[]> {
    // Zero-Exposure: Raw phone numbers (donor_phone, santri_phone) are NEVER returned in public view
    if (!isSupabaseConfigured || !supabase) {
      return localStore.getPublicInfakJinan();
    }
    try {
      const client = getClient();
      const { data, error } = await client.from("public_infak_jinan").select("*, photos:infak_jinan_photos(*)");
      if (error || !data) {
        return localStore.getPublicInfakJinan();
      }
      return data as PublicInfakJinanRecord[];
    } catch {
      return localStore.getPublicInfakJinan();
    }
  },

  async getPublicInfakJinanDetail(id: string): Promise<{ donation: PublicInfakJinanRecord; santri: PublicInfakJinanSantri[] } | null> {
    if (!isSupabaseConfigured || !supabase) {
      return localStore.getPublicInfakJinanDetail(id);
    }
    try {
      const client = getClient();
      const { data: donation, error: dErr } = await client
        .from("public_infak_jinan")
        .select("*, photos:infak_jinan_photos(*)")
        .eq("id", id)
        .maybeSingle();

      if (dErr || !donation) {
        return localStore.getPublicInfakJinanDetail(id);
      }

      const { data: santriList, error: sErr } = await client
        .from("infak_jinan_santri")
        .select("id, infak_id, name, sort, status, hafalan_updates:santri_hafalan_updates(*)")
        .eq("infak_id", id)
        .eq("status", "published")
        .order("sort", { ascending: true });

      if (sErr || !santriList) {
        return localStore.getPublicInfakJinanDetail(id);
      }

      interface RawSantriWithHafalan {
        id: string;
        infak_id: string;
        name: string;
        sort: number;
        status: "draft" | "published";
        hafalan_updates?: HafalanUpdate[];
      }

      const formattedSantri: PublicInfakJinanSantri[] = (santriList as unknown as RawSantriWithHafalan[]).map((s) => {
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
          latest_surah: latest ? latest.surah_name : "-",
          latest_ayat: latest ? latest.ayat : undefined,
          latest_juz: latest ? latest.juz : undefined,
          hafalan_updates: sortedUpdates,
        };
      });

      return {
        donation: donation as PublicInfakJinanRecord,
        santri: formattedSantri,
      };
    } catch {
      return localStore.getPublicInfakJinanDetail(id);
    }
  },

  async getInfakJinanById(id: string): Promise<InfakJinanRecord | null> {
    return localStore.getInfakJinanById(id) || null;
  },

  // BUSS Al-Qur'an
  async getBussDistributions(onlyPublished = true): Promise<BussDistribution[]> {
    if (!isSupabaseConfigured || !supabase) {
      return localStore.getBuss(onlyPublished);
    }
    try {
      const client = getClient();
      let query = client.from("buss_distributions").select("*").order("year", { ascending: false });
      if (onlyPublished) query = query.eq("status", "published");
      const { data, error } = await query;
      if (error || !data) {
        return localStore.getBuss(onlyPublished);
      }
      return data as BussDistribution[];
    } catch {
      return localStore.getBuss(onlyPublished);
    }
  },

  async getPublicBussDistributions(): Promise<PublicBussDistribution[]> {
    const all = await this.getBussDistributions(true);
    return all.map(item => ({
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

  // Yatim Berdikari
  async getYatimActivities(onlyPublished = true): Promise<YatimActivity[]> {
    if (!isSupabaseConfigured || !supabase) {
      return localStore.getYatimActivities(onlyPublished);
    }
    try {
      const client = getClient();
      let query = client.from("yatim_berdikari_activities").select("*").order("activity_date", { ascending: false });
      if (onlyPublished) query = query.eq("status", "published");
      const { data, error } = await query;
      if (error || !data) {
        return localStore.getYatimActivities(onlyPublished);
      }
      return data as YatimActivity[];
    } catch {
      return localStore.getYatimActivities(onlyPublished);
    }
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
