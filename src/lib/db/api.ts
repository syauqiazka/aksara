import { localStore } from './local-store';
import { isSupabaseConfigured, supabase } from './client';
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

export const db = {
  // Infak
  async getInfakDistributions(onlyPublished = true): Promise<InfakDistribution[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('infak_distributions').select('*').order('mushaf_no', { ascending: true });
      if (onlyPublished) query = query.eq('status', 'published');
      const { data, error } = await query;
      if (!error && data) return data as InfakDistribution[];
    }
    return localStore.getInfak(onlyPublished);
  },

  async getInfakById(id: string): Promise<InfakDistribution | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('infak_distributions').select('*').eq('id', id).single();
      if (!error && data) return data as InfakDistribution;
    }
    return localStore.getInfakById(id) || null;
  },

  async saveInfak(item: Omit<InfakDistribution, 'id' | 'created_at' | 'updated_at'>, id?: string): Promise<InfakDistribution> {
    if (isSupabaseConfigured && supabase) {
      if (id) {
        const { data, error } = await supabase
          .from('infak_distributions')
          .update({ ...item, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as InfakDistribution;
      } else {
        const { data, error } = await supabase.from('infak_distributions').insert(item).select().single();
        if (!error && data) return data as InfakDistribution;
      }
    }
    if (id) {
      return localStore.updateInfak(id, item) || localStore.addInfak(item);
    }
    return localStore.addInfak(item);
  },

  async deleteInfak(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('infak_distributions').delete().eq('id', id);
      return !error;
    }
    return localStore.deleteInfak(id);
  },

  // Geber
  async getGeberDistributions(onlyPublished = true): Promise<GeberMasjidDistribution[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('geber_masjid_distributions').select('*').order('activity_date', { ascending: false });
      if (onlyPublished) query = query.eq('status', 'published');
      const { data, error } = await query;
      if (!error && data) return data as GeberMasjidDistribution[];
    }
    return localStore.getGeber(onlyPublished);
  },

  async getGeberById(id: string): Promise<GeberMasjidDistribution | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('geber_masjid_distributions').select('*').eq('id', id).single();
      if (!error && data) return data as GeberMasjidDistribution;
    }
    return localStore.getGeberById(id) || null;
  },

  async saveGeber(item: Omit<GeberMasjidDistribution, 'id' | 'created_at' | 'updated_at'>, id?: string): Promise<GeberMasjidDistribution> {
    if (isSupabaseConfigured && supabase) {
      if (id) {
        const { data, error } = await supabase
          .from('geber_masjid_distributions')
          .update({ ...item, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as GeberMasjidDistribution;
      } else {
        const { data, error } = await supabase.from('geber_masjid_distributions').insert(item).select().single();
        if (!error && data) return data as GeberMasjidDistribution;
      }
    }
    if (id) {
      return localStore.updateGeber(id, item) || localStore.addGeber(item);
    }
    return localStore.addGeber(item);
  },

  async deleteGeber(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('geber_masjid_distributions').delete().eq('id', id);
      return !error;
    }
    return localStore.deleteGeber(id);
  },

  // Reports
  async getReports(onlyPublished = true): Promise<Report[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('reports').select('*').order('period_start', { ascending: false });
      if (onlyPublished) query = query.eq('status', 'published');
      const { data, error } = await query;
      if (!error && data) return data as Report[];
    }
    return localStore.getReports(onlyPublished);
  },

  async getReportBySlug(slug: string): Promise<Report | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('reports').select('*').eq('slug', slug).single();
      if (!error && data) return data as Report;
    }
    return localStore.getReportBySlug(slug) || null;
  },

  async getReportById(id: string): Promise<Report | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('reports').select('*').eq('id', id).single();
      if (!error && data) return data as Report;
    }
    return localStore.getReportById(id) || null;
  },

  async saveReport(item: Omit<Report, 'id' | 'created_at' | 'updated_at'>, id?: string): Promise<Report> {
    if (isSupabaseConfigured && supabase) {
      if (id) {
        const { data, error } = await supabase
          .from('reports')
          .update({ ...item, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as Report;
      } else {
        const { data, error } = await supabase.from('reports').insert(item).select().single();
        if (!error && data) return data as Report;
      }
    }
    if (id) {
      return localStore.updateReport(id, item) || localStore.addReport(item);
    }
    return localStore.addReport(item);
  },

  async deleteReport(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('reports').delete().eq('id', id);
      return !error;
    }
    return localStore.deleteReport(id);
  },

  // Themed campaigns
  async getThemedCampaigns(): Promise<ThemedCampaign[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('themed_campaigns').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as ThemedCampaign[];
    }
    return localStore.getCampaigns();
  },

  // Gallery
  async getGalleryItems(): Promise<GalleryItem[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('gallery_items').select('*').eq('status', 'published').order('date', { ascending: false });
      if (!error && data) return data as GalleryItem[];
    }
    return localStore.getGallery();
  },

  // Settings
  async getBankAccounts(): Promise<BankAccount[]> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'bank_accounts').single();
      if (data?.value) return data.value as BankAccount[];
    }
    return localStore.getBankAccounts();
  },

  async updateBankAccounts(accounts: BankAccount[]): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('site_settings').upsert({ key: 'bank_accounts', value: accounts, updated_at: new Date().toISOString() });
    }
    localStore.updateBankAccounts(accounts);
  },

  async getContactInfo(): Promise<ContactInfo> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'contact_info').single();
      if (data?.value) return data.value as ContactInfo;
    }
    return localStore.getContactInfo();
  },

  async updateContactInfo(info: ContactInfo): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('site_settings').upsert({ key: 'contact_info', value: info, updated_at: new Date().toISOString() });
    }
    localStore.updateContactInfo(info);
  },

  async getSocialLinks(): Promise<SocialLinks> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'social_links').single();
      if (data?.value) return data.value as SocialLinks;
    }
    return localStore.getSocialLinks();
  },

  async updateSocialLinks(links: SocialLinks): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('site_settings').upsert({ key: 'social_links', value: links, updated_at: new Date().toISOString() });
    }
    localStore.updateSocialLinks(links);
  },

  // Aggregated dynamic stats
  async getAggregatedStats(): Promise<AggregatedStats> {
    const infak = await this.getInfakDistributions(true);
    const geber = await this.getGeberDistributions(true);
    const reports = await this.getReports(true);

    const totalMushaf = infak.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
    const totalMasjid = geber.length;

    const provinces = new Set<string>();
    infak.forEach(i => i.province && provinces.add(i.province));
    geber.forEach(g => g.province && provinces.add(g.province));

    const totalBeneficiaries = reports.reduce((acc, curr) => acc + (curr.beneficiaries || 0), 0);

    return {
      totalMushaf,
      totalMasjid,
      totalProvinces: provinces.size,
      totalBeneficiaries
    };
  }
};

