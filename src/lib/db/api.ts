import { cache } from "react";
import { isPostgresConfigured, pgQuery, getErrorMessage } from "./postgres";
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

function getSupabaseClient() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase belum dikonfigurasi.");
  }
  return supabase;
}

export const db = {
  // 1. Infak Distributions
  getInfakDistributions: cache(async (onlyPublished = true): Promise<InfakDistribution[]> => {
    if (isPostgresConfigured) {
      try {
        const res = await pgQuery<InfakDistribution>(
          `select * from infak_distributions 
           where ($1::boolean = false or status = 'published') 
           order by mushaf_no asc`,
          [onlyPublished]
        );
        return res.rows;
      } catch (err: unknown) {
        console.warn("[postgres] getInfakDistributions fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const client = getSupabaseClient();
        let query = client.from("infak_distributions").select("*").order("mushaf_no", { ascending: true });
        if (onlyPublished) query = query.eq("status", "published");
        const { data, error } = await query;
        if (!error && data) return data as InfakDistribution[];
      } catch (err: unknown) {
        console.warn("[supabase] getInfakDistributions fallback:", getErrorMessage(err));
      }
    }

    return localStore.getInfak(onlyPublished);
  }),

  getInfakById: cache(async (id: string): Promise<InfakDistribution | null> => {
    if (isPostgresConfigured) {
      try {
        const res = await pgQuery<InfakDistribution>(
          `select * from infak_distributions where id = $1 limit 1`,
          [id]
        );
        if (res.rows.length) return res.rows[0];
      } catch (err: unknown) {
        console.warn("[postgres] getInfakById fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const client = getSupabaseClient();
        const { data, error } = await client.from("infak_distributions").select("*").eq("id", id).maybeSingle();
        if (!error && data) return data as InfakDistribution;
      } catch (err: unknown) {
        console.warn("[supabase] getInfakById fallback:", getErrorMessage(err));
      }
    }

    return localStore.getInfakById(id) || null;
  }),

  // 2. Geber Masjid
  getGeberDistributions: cache(async (onlyPublished = true): Promise<GeberMasjidDistribution[]> => {
    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(
          `select *, to_char(activity_date, 'YYYY-MM-DD') as activity_date 
           from geber_masjid_distributions 
           where ($1::boolean = false or status = 'published') 
           order by activity_date desc`,
          [onlyPublished]
        );
        return res.rows as GeberMasjidDistribution[];
      } catch (err: unknown) {
        console.warn("[postgres] getGeberDistributions fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const client = getSupabaseClient();
        let query = client.from("geber_masjid_distributions").select("*").order("activity_date", { ascending: false });
        if (onlyPublished) query = query.eq("status", "published");
        const { data, error } = await query;
        if (!error && data) return data as GeberMasjidDistribution[];
      } catch (err: unknown) {
        console.warn("[supabase] getGeberDistributions fallback:", getErrorMessage(err));
      }
    }

    return localStore.getGeber(onlyPublished);
  }),

  getGeberById: cache(async (id: string): Promise<GeberMasjidDistribution | null> => {
    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(
          `select *, to_char(activity_date, 'YYYY-MM-DD') as activity_date 
           from geber_masjid_distributions where id = $1 limit 1`,
          [id]
        );
        if (res.rows.length) return res.rows[0] as GeberMasjidDistribution;
      } catch (err: unknown) {
        console.warn("[postgres] getGeberById fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const client = getSupabaseClient();
        const { data, error } = await client.from("geber_masjid_distributions").select("*").eq("id", id).maybeSingle();
        if (!error && data) return data as GeberMasjidDistribution;
      } catch (err: unknown) {
        console.warn("[supabase] getGeberById fallback:", getErrorMessage(err));
      }
    }

    return localStore.getGeberById(id) || null;
  }),

  // 3. Reports
  getReports: cache(async (onlyPublished = true): Promise<Report[]> => {
    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(
          `select *, 
             to_char(period_start, 'YYYY-MM-DD') as period_start,
             to_char(period_end, 'YYYY-MM-DD') as period_end
           from reports 
           where ($1::boolean = false or status = 'published') 
           order by period_start desc`,
          [onlyPublished]
        );
        return res.rows as Report[];
      } catch (err: unknown) {
        console.warn("[postgres] getReports fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const client = getSupabaseClient();
        let query = client.from("reports").select("*").order("period_start", { ascending: false });
        if (onlyPublished) query = query.eq("status", "published");
        const { data, error } = await query;
        if (!error && data) return data as Report[];
      } catch (err: unknown) {
        console.warn("[supabase] getReports fallback:", getErrorMessage(err));
      }
    }

    return localStore.getReports(onlyPublished);
  }),

  getReportBySlug: cache(async (slug: string): Promise<Report | null> => {
    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(
          `select *, 
             to_char(period_start, 'YYYY-MM-DD') as period_start,
             to_char(period_end, 'YYYY-MM-DD') as period_end
           from reports where slug = $1 limit 1`,
          [slug]
        );
        if (res.rows.length) return res.rows[0] as Report;
      } catch (err: unknown) {
        console.warn("[postgres] getReportBySlug fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const client = getSupabaseClient();
        const { data, error } = await client.from("reports").select("*").eq("slug", slug).maybeSingle();
        if (!error && data) return data as Report;
      } catch (err: unknown) {
        console.warn("[supabase] getReportBySlug fallback:", getErrorMessage(err));
      }
    }

    return localStore.getReportBySlug(slug) || null;
  }),

  getReportById: cache(async (id: string): Promise<Report | null> => {
    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(
          `select *, 
             to_char(period_start, 'YYYY-MM-DD') as period_start,
             to_char(period_end, 'YYYY-MM-DD') as period_end
           from reports where id = $1 limit 1`,
          [id]
        );
        if (res.rows.length) return res.rows[0] as Report;
      } catch (err: unknown) {
        console.warn("[postgres] getReportById fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const client = getSupabaseClient();
        const { data, error } = await client.from("reports").select("*").eq("id", id).maybeSingle();
        if (!error && data) return data as Report;
      } catch (err: unknown) {
        console.warn("[supabase] getReportById fallback:", getErrorMessage(err));
      }
    }

    return localStore.getReportById(id) || null;
  }),

  // 4. Themed Campaigns
  getThemedCampaigns: cache(async (): Promise<ThemedCampaign[]> => {
    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(`select * from themed_campaigns order by created_at desc`);
        return res.rows as ThemedCampaign[];
      } catch (err: unknown) {
        console.warn("[postgres] getThemedCampaigns fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const client = getSupabaseClient();
        const { data, error } = await client.from("themed_campaigns").select("*").order("created_at", { ascending: false });
        if (!error && data) return data as ThemedCampaign[];
      } catch (err: unknown) {
        console.warn("[supabase] getThemedCampaigns fallback:", getErrorMessage(err));
      }
    }

    return localStore.getCampaigns();
  }),

  // 5. Gallery Items
  getGalleryItems: cache(async (): Promise<GalleryItem[]> => {
    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(
          `select *, to_char(date, 'YYYY-MM-DD') as date 
           from gallery_items 
           where status = 'published' 
           order by date desc`
        );
        return res.rows as GalleryItem[];
      } catch (err: unknown) {
        console.warn("[postgres] getGalleryItems fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const client = getSupabaseClient();
        const { data, error } = await client.from("gallery_items").select("*").eq("status", "published").order("date", { ascending: false });
        if (!error && data) return data as GalleryItem[];
      } catch (err: unknown) {
        console.warn("[supabase] getGalleryItems fallback:", getErrorMessage(err));
      }
    }

    return localStore.getGallery(true);
  }),

  // 6. Settings (Bank, Contact, Social)
  getBankAccounts: cache(async (): Promise<BankAccount[]> => {
    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(`select value from site_settings where key = 'bank_accounts' limit 1`);
        if (res.rows.length && res.rows[0].value) return res.rows[0].value as BankAccount[];
      } catch (err: unknown) {
        console.warn("[postgres] getBankAccounts fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const client = getSupabaseClient();
        const { data, error } = await client.from("site_settings").select("value").eq("key", "bank_accounts").maybeSingle();
        if (!error && data?.value) return data.value as BankAccount[];
      } catch (err: unknown) {
        console.warn("[supabase] getBankAccounts fallback:", getErrorMessage(err));
      }
    }

    return localStore.getBankAccounts();
  }),

  getContactInfo: cache(async (): Promise<ContactInfo> => {
    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(`select value from site_settings where key = 'contact_info' limit 1`);
        if (res.rows.length && res.rows[0].value) return res.rows[0].value as ContactInfo;
      } catch (err: unknown) {
        console.warn("[postgres] getContactInfo fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const client = getSupabaseClient();
        const { data, error } = await client.from("site_settings").select("value").eq("key", "contact_info").maybeSingle();
        if (!error && data?.value) return data.value as ContactInfo;
      } catch (err: unknown) {
        console.warn("[supabase] getContactInfo fallback:", getErrorMessage(err));
      }
    }

    return localStore.getContactInfo();
  }),

  getSocialLinks: cache(async (): Promise<SocialLinks> => {
    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(`select value from site_settings where key = 'social_links' limit 1`);
        if (res.rows.length && res.rows[0].value) return res.rows[0].value as SocialLinks;
      } catch (err: unknown) {
        console.warn("[postgres] getSocialLinks fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const client = getSupabaseClient();
        const { data, error } = await client.from("site_settings").select("value").eq("key", "social_links").maybeSingle();
        if (!error && data?.value) return data.value as SocialLinks;
      } catch (err: unknown) {
        console.warn("[supabase] getSocialLinks fallback:", getErrorMessage(err));
      }
    }

    return localStore.getSocialLinks();
  }),

  // 7. Infak Al-Qur'an Jinan (Dua Tingkat)
  getInfakJinan: cache(async (onlyPublished = true): Promise<InfakJinanRecord[]> => {
    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(`
          select 
            j.*,
            to_char(j.distributed_at, 'YYYY-MM-DD') as distributed_at,
            coalesce(
              json_agg(distinct p.*) filter (where p.id is not null),
              '[]'
            ) as photos,
            coalesce(
              json_agg(distinct s.*) filter (where s.id is not null),
              '[]'
            ) as santri_list
          from infak_jinan j
          left join infak_jinan_photos p on p.infak_id = j.id
          left join infak_jinan_santri s on s.infak_id = j.id
          where ($1::boolean = false or j.status = 'published')
          group by j.id
          order by j.mushaf_no asc
        `, [onlyPublished]);
        return res.rows as InfakJinanRecord[];
      } catch (err: unknown) {
        console.warn("[postgres] getInfakJinan fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const client = getSupabaseClient();
        let query = client
          .from("infak_jinan")
          .select("*, photos:infak_jinan_photos(*), santri_list:infak_jinan_santri(*, hafalan_updates:santri_hafalan_updates(*))")
          .order("mushaf_no", { ascending: true });
        if (onlyPublished) query = query.eq("status", "published");
        const { data, error } = await query;
        if (!error && data) return data as InfakJinanRecord[];
      } catch (err: unknown) {
        console.warn("[supabase] getInfakJinan fallback:", getErrorMessage(err));
      }
    }

    return localStore.getInfakJinan(onlyPublished);
  }),

  getPublicInfakJinan: cache(async (): Promise<PublicInfakJinanRecord[]> => {
    // 1. Primary: Local PostgreSQL
    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(`
          select 
            j.id,
            j.mushaf_no,
            case when j.show_donor_name then j.donor_name else 'Hamba Allah' end as display_donor_name,
            j.donor_origin,
            j.dedication_name,
            j.pesantren_name,
            j.pesantren_province,
            j.pesantren_city,
            coalesce(j.address, '') as address,
            j.maps_url,
            to_char(j.distributed_at, 'YYYY-MM-DD') as distributed_at,
            j.status,
            coalesce(
              (
                select json_agg(p.*) 
                from infak_jinan_photos p 
                where p.infak_id = j.id
              ),
              '[]'
            ) as photos,
            (
              select count(*)::int 
              from infak_jinan_santri s 
              where s.infak_id = j.id and s.status = 'published'
            ) as santri_count
          from infak_jinan j
          where j.status = 'published'
          order by j.mushaf_no asc
        `);
        return res.rows as PublicInfakJinanRecord[];
      } catch (err: unknown) {
        console.warn("[postgres] getPublicInfakJinan fallback:", getErrorMessage(err));
      }
    }

    // 2. Fallback: Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const client = getSupabaseClient();
        const { data, error } = await client
          .from("public_infak_jinan")
          .select("*, photos:infak_jinan_photos(*)")
          .order("mushaf_no", { ascending: true });
        if (!error && data) {
          return data as PublicInfakJinanRecord[];
        }
      } catch (err: unknown) {
        console.warn("[supabase] getPublicInfakJinan fallback:", getErrorMessage(err));
      }
    }

    // 3. Fallback: localStore (already sorted by mushaf_no)
    return localStore.getPublicInfakJinan();
  }),

  getPublicInfakJinanDetail: cache(async (id: string): Promise<{ donation: PublicInfakJinanRecord; santri: PublicInfakJinanSantri[] } | null> => {
    // 1. Primary: Local PostgreSQL
    if (isPostgresConfigured) {
      try {
        const donRes = await pgQuery(`
          select 
            j.id,
            j.mushaf_no,
            case when j.show_donor_name then j.donor_name else 'Hamba Allah' end as display_donor_name,
            j.donor_origin,
            j.dedication_name,
            j.pesantren_name,
            j.pesantren_province,
            j.pesantren_city,
            coalesce(j.address, '') as address,
            j.maps_url,
            to_char(j.distributed_at, 'YYYY-MM-DD') as distributed_at,
            j.status,
            coalesce(
              (
                select json_agg(p.*) 
                from infak_jinan_photos p 
                where p.infak_id = j.id
              ),
              '[]'
            ) as photos
          from infak_jinan j
          where j.id = $1 and j.status = 'published'
          limit 1
        `, [id]);

        if (donRes.rows.length) {
          const donation = donRes.rows[0] as PublicInfakJinanRecord;
          const santriRes = await pgQuery(`
            select 
              s.id,
              s.infak_id,
              s.name as santri_name,
              s.sort,
              s.status,
              coalesce(
                (
                  select json_agg(
                    json_build_object(
                      'id', h.id,
                      'santri_id', h.santri_id,
                      'updated_on', to_char(h.updated_on, 'YYYY-MM-DD'),
                      'surah_no', h.surah_no,
                      'surah_name', h.surah_name,
                      'ayat', h.ayat,
                      'juz', h.juz,
                      'notes', h.notes
                    ) order by h.updated_on desc
                  )
                  from santri_hafalan_updates h
                  where h.santri_id = s.id
                ),
                '[]'
              ) as hafalan_updates
            from infak_jinan_santri s
            where s.infak_id = $1 and s.status = 'published'
            order by s.sort asc
          `, [id]);

          const formattedSantri: PublicInfakJinanSantri[] = santriRes.rows.map((s) => {
            const updates = (s.hafalan_updates || []) as HafalanUpdate[];
            const latest = updates[0];
            return {
              id: s.id,
              infak_id: s.infak_id,
              santri_name: s.santri_name,
              sort: s.sort,
              status: s.status,
              latest_surah: latest ? latest.surah_name : "-",
              latest_ayat: latest ? latest.ayat : undefined,
              latest_juz: latest ? latest.juz : undefined,
              hafalan_updates: updates,
            };
          });

          return { donation, santri: formattedSantri };
        }
      } catch (err: unknown) {
        console.warn("[postgres] getPublicInfakJinanDetail fallback:", getErrorMessage(err));
      }
    }

    // 2. Fallback: Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const client = getSupabaseClient();
        const { data: donation, error: dErr } = await client
          .from("public_infak_jinan")
          .select("*, photos:infak_jinan_photos(*)")
          .eq("id", id)
          .maybeSingle();

        if (!dErr && donation) {
          const { data: santriList, error: sErr } = await client
            .from("infak_jinan_santri")
            .select("id, infak_id, name, sort, status, hafalan_updates:santri_hafalan_updates(*)")
            .eq("infak_id", id)
            .eq("status", "published")
            .order("sort", { ascending: true });

          if (!sErr && santriList) {
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
          }
        }
      } catch (err: unknown) {
        console.warn("[supabase] getPublicInfakJinanDetail fallback:", getErrorMessage(err));
      }
    }

    // 3. Fallback: localStore
    return localStore.getPublicInfakJinanDetail(id);
  }),

  getInfakJinanById: cache(async (id: string): Promise<InfakJinanRecord | null> => {
    return localStore.getInfakJinanById(id) || null;
  }),

  // 8. BUSS Al-Qur'an
  getBussDistributions: cache(async (onlyPublished = true): Promise<BussDistribution[]> => {
    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(
          `select * from buss_distributions 
           where ($1::boolean = false or status = 'published') 
           order by year desc, created_at desc`,
          [onlyPublished]
        );
        return res.rows as BussDistribution[];
      } catch (err: unknown) {
        console.warn("[postgres] getBussDistributions fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const client = getSupabaseClient();
        let query = client.from("buss_distributions").select("*").order("year", { ascending: false });
        if (onlyPublished) query = query.eq("status", "published");
        const { data, error } = await query;
        if (!error && data) return data as BussDistribution[];
      } catch (err: unknown) {
        console.warn("[supabase] getBussDistributions fallback:", getErrorMessage(err));
      }
    }

    return localStore.getBuss(onlyPublished);
  }),

  getPublicBussDistributions: cache(async (): Promise<PublicBussDistribution[]> => {
    const all = await db.getBussDistributions(true);
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
  }),

  // 9. Yatim Berdikari
  getYatimActivities: cache(async (onlyPublished = true): Promise<YatimActivity[]> => {
    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(
          `select * from yatim_distributions 
           where ($1::boolean = false or status = 'published') 
           order by created_at desc`,
          [onlyPublished]
        );
        return res.rows as YatimActivity[];
      } catch (err: unknown) {
        console.warn("[postgres] getYatimActivities fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const client = getSupabaseClient();
        let query = client.from("yatim_distributions").select("*").order("created_at", { ascending: false });
        if (onlyPublished) query = query.eq("status", "published");
        const { data, error } = await query;
        if (!error && data) return data as YatimActivity[];
      } catch (err: unknown) {
        console.warn("[supabase] getYatimActivities fallback:", getErrorMessage(err));
      }
    }

    return localStore.getYatimActivities(onlyPublished);
  }),

  getPublicYatimDistributions: cache(async (): Promise<YatimActivity[]> => {
    return db.getYatimActivities(true);
  }),

  getAggregatedStats: cache(async (): Promise<AggregatedStats> => {
    const [infak, geber, reports] = await Promise.all([
      db.getPublicInfakJinan(),
      db.getGeberDistributions(true),
      db.getReports(true),
    ]);

    const totalMushaf = infak.length;
    const totalMasjid = geber.length;
    const provinces = new Set<string>();

    infak.forEach((item) => item.pesantren_province && provinces.add(item.pesantren_province));
    geber.forEach((item) => item.province && provinces.add(item.province));

    const totalBeneficiaries = reports.reduce((total, report) => total + (report.beneficiaries || 0), 0);

    return {
      totalMushaf,
      totalMasjid,
      totalProvinces: provinces.size,
      totalBeneficiaries,
    };
  }),
};
