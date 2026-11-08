import { localStore } from "./local-store";
import { isPrismaConfigured, prisma } from "./prisma";
import { isSupabaseConfigured } from "./client";
import { adminSupabase } from "./admin-client";
import { isPostgresConfigured, pgQuery, getErrorMessage } from "./postgres";
import { Prisma } from "@prisma/client";
import {
  InfakDistribution,
  InfakJinanRecord,
  HafalanUpdate,
  GeberMasjidDistribution,
  Report,
  ReportProgram,
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
    if (isPrismaConfigured && prisma) {
      try {
        const data = await prisma.infakJinan.findMany({
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
          distributed_at: item.distributed_at.toISOString().split("T")[0],
          status: item.status as "draft" | "published",
          created_at: item.created_at.toISOString(),
          updated_at: item.updated_at.toISOString(),
          photos: item.photos.map((p) => ({
            ...p,
            created_at: p.created_at.toISOString(),
          })),
          santri_list: item.santri_list.map((s) => ({
            ...s,
            status: s.status as "draft" | "published",
            created_at: s.created_at.toISOString(),
            updated_at: s.updated_at.toISOString(),
            hafalan_updates: s.hafalan_updates.map((h) => ({
              ...h,
              updated_on: h.updated_on.toISOString().split("T")[0],
              created_at: h.created_at.toISOString(),
            })),
          })),
          santri_count: item.santri_list.length,
        })) as InfakJinanRecord[];
      } catch (err: unknown) {
        console.warn("[prisma] getInfakJinan fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(`
          select 
            j.*,
            to_char(j.distributed_at, 'YYYY-MM-DD') as distributed_at,
            coalesce(
              (
                select json_agg(p.*) 
                from infak_jinan_photos p 
                where p.infak_id = j.id
              ),
              '[]'
            ) as photos,
            coalesce(
              (
                select json_agg(
                  json_build_object(
                    'id', s.id,
                    'infak_id', s.infak_id,
                    'name', s.name,
                    'phone', s.phone,
                    'sort', s.sort,
                    'status', s.status,
                    'hafalan_updates', coalesce(
                      (
                        select json_agg(h.*) 
                        from santri_hafalan_updates h 
                        where h.santri_id = s.id
                      ),
                      '[]'
                    )
                  ) order by s.sort asc
                )
                from infak_jinan_santri s 
                where s.infak_id = j.id
              ),
              '[]'
            ) as santri_list
          from infak_jinan j
          where ($1::boolean = false or j.status = 'published')
          order by j.mushaf_no asc
        `, [onlyPublished]);

        return res.rows.map((row) => ({
          ...row,
          santri_count: Array.isArray(row.santri_list) ? row.santri_list.length : 0,
        })) as InfakJinanRecord[];
      } catch (err: unknown) {
        console.warn("[postgres] getInfakJinan fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        let query = client
          .from("infak_jinan")
          .select("*, photos:infak_jinan_photos(*), santri_list:infak_jinan_santri(*, hafalan_updates:santri_hafalan_updates(*))")
          .order("mushaf_no", { ascending: true });
        if (onlyPublished) query = query.eq("status", "published");
        const { data, error } = await query;
        if (!error && data) {
          return data.map((raw) => {
            const d = raw as Record<string, unknown>;
            const rawSantriList = Array.isArray(d.santri_list) ? d.santri_list : [];
            const santriList = rawSantriList.length > 0
              ? rawSantriList
              : (typeof d.santri_name === "string" && d.santri_name
                  ? [{
                      id: `${String(d.id)}-santri-1`,
                      infak_id: String(d.id),
                      name: d.santri_name,
                      phone: typeof d.santri_phone === "string" ? d.santri_phone : null,
                      sort: 1,
                      status: (d.status || "published") as "draft" | "published",
                      hafalan_updates: [],
                    }]
                  : []);

            return {
              ...d,
              santri_list: santriList,
              santri_count: santriList.length,
              photos: Array.isArray(d.photos) ? d.photos : [],
            } as unknown as InfakJinanRecord;
          });
        }
      } catch (err: unknown) {
        console.warn("[supabase] getInfakJinan fallback:", getErrorMessage(err));
      }
    }

    return localStore.getInfakJinan(onlyPublished);
  },

  async getInfakJinanById(id: string): Promise<InfakJinanRecord | null> {
    if (isPrismaConfigured && prisma) {
      try {
        const item = await prisma.infakJinan.findUnique({
          where: { id },
          include: {
            photos: { orderBy: { sort: "asc" } },
            santri_list: {
              include: { hafalan_updates: { orderBy: { updated_on: "desc" } } },
              orderBy: { sort: "asc" },
            },
          },
        });
        if (item) {
          return {
            ...item,
            distributed_at: item.distributed_at.toISOString().split("T")[0],
            status: item.status as "draft" | "published",
            created_at: item.created_at.toISOString(),
            updated_at: item.updated_at.toISOString(),
            photos: item.photos.map((p) => ({
              ...p,
              created_at: p.created_at.toISOString(),
            })),
            santri_list: item.santri_list.map((s) => ({
              ...s,
              status: s.status as "draft" | "published",
              created_at: s.created_at.toISOString(),
              updated_at: s.updated_at.toISOString(),
              hafalan_updates: s.hafalan_updates.map((h) => ({
                ...h,
                updated_on: h.updated_on.toISOString().split("T")[0],
                created_at: h.created_at.toISOString(),
              })),
            })),
            santri_count: item.santri_list.length,
          } as InfakJinanRecord;
        }
      } catch (err: unknown) {
        console.warn("[prisma] getInfakJinanById fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(`
          select 
            j.*,
            to_char(j.distributed_at, 'YYYY-MM-DD') as distributed_at,
            coalesce(
              (
                select json_agg(p.*) 
                from infak_jinan_photos p 
                where p.infak_id = j.id
              ),
              '[]'
            ) as photos,
            coalesce(
              (
                select json_agg(
                  json_build_object(
                    'id', s.id,
                    'infak_id', s.infak_id,
                    'name', s.name,
                    'phone', s.phone,
                    'sort', s.sort,
                    'status', s.status,
                    'hafalan_updates', coalesce(
                      (
                        select json_agg(h.*) 
                        from santri_hafalan_updates h 
                        where h.santri_id = s.id
                      ),
                      '[]'
                    )
                  ) order by s.sort asc
                )
                from infak_jinan_santri s 
                where s.infak_id = j.id
              ),
              '[]'
            ) as santri_list
          from infak_jinan j
          where j.id = $1
          limit 1
        `, [id]);

        if (res.rows.length) {
          const row = res.rows[0];
          return {
            ...row,
            santri_count: Array.isArray(row.santri_list) ? row.santri_list.length : 0,
          } as InfakJinanRecord;
        }
      } catch (err: unknown) {
        console.warn("[postgres] getInfakJinanById fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        const { data, error } = await client
          .from("infak_jinan")
          .select("*, photos:infak_jinan_photos(*), santri_list:infak_jinan_santri(*, hafalan_updates:santri_hafalan_updates(*))")
          .eq("id", id)
          .maybeSingle();

        if (!error && data) {
          const d = data as Record<string, unknown>;
          const rawSantriList = Array.isArray(d.santri_list) ? d.santri_list : [];
          const santriList = rawSantriList.length > 0
            ? rawSantriList
            : (typeof d.santri_name === "string" && d.santri_name
                ? [{
                    id: `${String(d.id)}-santri-1`,
                    infak_id: String(d.id),
                    name: d.santri_name,
                    phone: typeof d.santri_phone === "string" ? d.santri_phone : null,
                    sort: 1,
                    status: (d.status || "published") as "draft" | "published",
                    hafalan_updates: [],
                  }]
                : []);

          return {
            ...d,
            santri_list: santriList,
            santri_count: santriList.length,
            photos: Array.isArray(d.photos) ? d.photos : [],
          } as unknown as InfakJinanRecord;
        }
      } catch (err: unknown) {
        console.warn("[supabase] getInfakJinanById fallback:", getErrorMessage(err));
      }
    }

    return localStore.getInfakJinanById(id) || null;
  },

  async saveInfakJinan(item: Omit<InfakJinanRecord, "id" | "created_at" | "updated_at">, id?: string): Promise<InfakJinanRecord> {
    const { santri_list: _sl, photos: _ph, santri_count: _sc, ...jinanData } = item;
    const defaultSantriName = (_sl && _sl.length > 0 && _sl[0]?.name?.trim()) || "Santri Binaan";
    const defaultSantriPhone = (_sl && _sl.length > 0 && _sl[0]?.phone) || null;

    // 1. Primary: Prisma
    if (isPrismaConfigured && prisma) {
      try {
        let savedId = id;
        if (id) {
          await prisma.$transaction(async (tx) => {
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
          const created = await prisma.infakJinan.create({
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
              photos: _ph && _ph.length > 0 ? {
                create: _ph.map((p) => ({
                  url: p.url,
                  caption: p.caption || null,
                  sort: p.sort || 1,
                })),
              } : undefined,
              santri_list: _sl && _sl.length > 0 ? {
                create: _sl.map((s) => ({
                  name: s.name?.trim() || "Santri Binaan",
                  phone: s.phone || null,
                  sort: s.sort || 1,
                  status: s.status || "published",
                  hafalan_updates: s.hafalan_updates && s.hafalan_updates.length > 0 ? {
                    create: s.hafalan_updates.map((h) => ({
                      updated_on: new Date(h.updated_on || new Date()),
                      surah_no: Number(h.surah_no) || 1,
                      surah_name: String(h.surah_name || "Al-Fatihah"),
                      ayat: Number(h.ayat) || 1,
                      juz: Number(h.juz) || 1,
                      notes: h.notes || null,
                    })),
                  } : undefined,
                })),
              } : undefined,
            },
          });
          savedId = created.id;
        }

        const mirror = { ...item, id: savedId, santri_count: _sl?.length || 0 } as InfakJinanRecord;
        if (id) {
          const ex = localStore.getInfakJinanById(id);
          if (ex) Object.assign(ex, mirror);
        } else {
          localStore.addInfakJinan(item);
        }
        return mirror;
      } catch (err: unknown) {
        console.warn("[prisma] saveInfakJinan fallback to Postgres/Supabase:", getErrorMessage(err));
      }
    }

    // 2. Direct PostgreSQL Fallback
    if (isPostgresConfigured) {
      try {
        let savedId = id;
        if (id) {
          await pgQuery(
            `update infak_jinan set 
               mushaf_no = $1, donor_name = $2, show_donor_name = $3, donor_origin = $4, donor_phone = $5,
               dedication_name = $6, pesantren_name = $7, pesantren_province = $8, pesantren_city = $9,
               address = $10, distributed_at = $11, maps_url = $12, santri_name = $13, santri_phone = $14,
               status = $15, updated_at = now()
             where id = $16`,
            [
              jinanData.mushaf_no, jinanData.donor_name, Boolean(jinanData.show_donor_name), jinanData.donor_origin, jinanData.donor_phone || null,
              jinanData.dedication_name, jinanData.pesantren_name, jinanData.pesantren_province || null, jinanData.pesantren_city || null,
              jinanData.address, jinanData.distributed_at, jinanData.maps_url || null, defaultSantriName, defaultSantriPhone,
              jinanData.status || "published", id
            ]
          );
        } else {
          const ins = await pgQuery(
            `insert into infak_jinan (
               mushaf_no, donor_name, show_donor_name, donor_origin, donor_phone,
               dedication_name, pesantren_name, pesantren_province, pesantren_city,
               address, distributed_at, maps_url, santri_name, santri_phone, status
             ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
             returning id`,
            [
              jinanData.mushaf_no, jinanData.donor_name, Boolean(jinanData.show_donor_name), jinanData.donor_origin, jinanData.donor_phone || null,
              jinanData.dedication_name, jinanData.pesantren_name, jinanData.pesantren_province || null, jinanData.pesantren_city || null,
              jinanData.address, jinanData.distributed_at, jinanData.maps_url || null, defaultSantriName, defaultSantriPhone,
              jinanData.status || "published"
            ]
          );
          savedId = ins.rows[0].id;
        }

        if (savedId) {
          if (id) {
            await pgQuery(`delete from infak_jinan_santri where infak_id = $1`, [savedId]);
          }
          if (_sl && _sl.length > 0) {
            for (const s of _sl) {
              const sIns = await pgQuery(
                `insert into infak_jinan_santri (infak_id, name, phone, sort, status)
                 values ($1, $2, $3, $4, $5) returning id`,
                [savedId, s.name?.trim() || "Santri Binaan", s.phone || null, s.sort || 1, s.status || "published"]
              );
              const santriDbId = sIns.rows[0]?.id;
              if (santriDbId && s.hafalan_updates && s.hafalan_updates.length > 0) {
                for (const h of s.hafalan_updates) {
                  await pgQuery(
                    `insert into santri_hafalan_updates (santri_id, updated_on, surah_no, surah_name, ayat, juz, notes)
                     values ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                      santriDbId, h.updated_on || new Date().toISOString().split("T")[0],
                      Number(h.surah_no) || 1, String(h.surah_name || "Al-Fatihah"),
                      Number(h.ayat) || 1, Number(h.juz) || 1, h.notes || null
                    ]
                  );
                }
              }
            }
          }

          if (id) {
            await pgQuery(`delete from infak_jinan_photos where infak_id = $1`, [savedId]);
          }
          if (_ph && _ph.length > 0) {
            for (const p of _ph) {
              await pgQuery(
                `insert into infak_jinan_photos (infak_id, url, caption, sort) values ($1, $2, $3, $4)`,
                [savedId, p.url, p.caption || null, p.sort || 1]
              );
            }
          }
        }

        if (savedId) {
          const mirror = { ...item, id: savedId, santri_count: _sl?.length || 0 } as InfakJinanRecord;
          if (id) {
            const ex = localStore.getInfakJinanById(id);
            if (ex) Object.assign(ex, mirror);
          } else {
            localStore.addInfakJinan(item);
          }
          return mirror;
        }
      } catch (err: unknown) {
        console.warn("[postgres] saveInfakJinan error, falling back to Supabase/localStore:", getErrorMessage(err));
      }
    }

    // 3. Fallback: Supabase
    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        const payload = {
          ...jinanData,
          santri_name: (item as unknown as { santri_name?: string }).santri_name || defaultSantriName,
          santri_phone: (item as unknown as { santri_phone?: string }).santri_phone || defaultSantriPhone,
        };

        const query = id
          ? client.from("infak_jinan").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", id)
          : client.from("infak_jinan").insert(payload);
        const { data, error } = await query.select().single();
        throwIfError(error, id ? "memperbarui data infak jinan" : "menambahkan data infak jinan");

        if (_sl && _sl.length > 0 && data?.id) {
          if (id) await client.from("infak_jinan_santri").delete().eq("infak_id", id);
          for (const s of _sl) {
            const { data: insS } = await client.from("infak_jinan_santri").insert({
              infak_id: data.id,
              name: s.name?.trim() || "Santri Binaan",
              phone: s.phone || null,
              sort: s.sort || 1,
              status: s.status || "published",
            }).select().single();

            if (insS && s.hafalan_updates && s.hafalan_updates.length > 0) {
              for (const h of s.hafalan_updates) {
                await client.from("santri_hafalan_updates").insert({
                  santri_id: insS.id,
                  updated_on: h.updated_on || new Date().toISOString().split("T")[0],
                  surah_no: Number(h.surah_no) || 1,
                  surah_name: String(h.surah_name || "Al-Fatihah"),
                  ayat: Number(h.ayat) || 1,
                  juz: Number(h.juz) || 1,
                  notes: h.notes || null,
                });
              }
            }
          }
        }

        if (_ph && _ph.length > 0 && data?.id) {
          if (id) await client.from("infak_jinan_photos").delete().eq("infak_id", id);
          for (const p of _ph) {
            await client.from("infak_jinan_photos").insert({
              infak_id: data.id,
              url: p.url,
              caption: p.caption || null,
              sort: p.sort || 1,
            });
          }
        }

        return data as InfakJinanRecord;
      } catch (err) {
        console.warn("[supabase] saveInfakJinan fallback to localStore:", err);
      }
    }

    // 4. Fallback: localStore
    if (id) {
      const existing = localStore.getInfakJinanById(id);
      if (existing) {
        Object.assign(existing, item, { updated_at: new Date().toISOString() });
        return existing;
      }
    }
    return localStore.addInfakJinan(item);
  },

  async deleteInfakJinan(id: string): Promise<boolean> {
    localStore.deleteInfakJinan(id);

    if (isPrismaConfigured && prisma) {
      try {
        await prisma.infakJinan.delete({ where: { id } });
        return true;
      } catch (err: unknown) {
        console.warn("[prisma] deleteInfakJinan fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        await pgQuery(`delete from infak_jinan where id = $1`, [id]);
        return true;
      } catch (err: unknown) {
        console.warn("[postgres] deleteInfakJinan fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        await client.from("infak_jinan").delete().eq("id", id);
      } catch {
        // already deleted in localStore
      }
    }
    return true;
  },

  async addSantriHafalanUpdate(santriId: string, update: Omit<HafalanUpdate, "id">): Promise<HafalanUpdate | null> {
    if (isPrismaConfigured && prisma) {
      try {
        const h = await prisma.santriHafalanUpdate.create({
          data: {
            santri_id: santriId,
            updated_on: new Date(update.updated_on || new Date()),
            surah_no: Number(update.surah_no) || 1,
            surah_name: String(update.surah_name || "Al-Fatihah"),
            ayat: Number(update.ayat) || 1,
            juz: Number(update.juz) || 1,
            notes: update.notes || null,
          },
        });
        return {
          id: h.id,
          santri_id: h.santri_id,
          updated_on: h.updated_on.toISOString().split("T")[0],
          surah_no: h.surah_no,
          surah_name: h.surah_name,
          ayat: h.ayat,
          juz: h.juz,
          notes: h.notes || undefined,
        };
      } catch (err: unknown) {
        console.warn("[prisma] addSantriHafalanUpdate fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(
          `insert into santri_hafalan_updates (santri_id, updated_on, surah_no, surah_name, ayat, juz, notes)
           values ($1, $2, $3, $4, $5, $6, $7)
           returning id, santri_id, to_char(updated_on, 'YYYY-MM-DD') as updated_on, surah_no, surah_name, ayat, juz, notes`,
          [
            santriId, update.updated_on || new Date().toISOString().split("T")[0],
            Number(update.surah_no) || 1, String(update.surah_name || "Al-Fatihah"),
            Number(update.ayat) || 1, Number(update.juz) || 1, update.notes || null
          ]
        );
        if (res.rows.length) return res.rows[0] as HafalanUpdate;
      } catch (err: unknown) {
        console.warn("[postgres] addSantriHafalanUpdate fallback:", getErrorMessage(err));
      }
    }
    return localStore.addSantriHafalanUpdate(santriId, update);
  },

  // Infak Distributions (Single-Tier / Bulk Import Support)
  async getInfakDistributions(onlyPublished = true): Promise<InfakDistribution[]> {
    if (isPrismaConfigured && prisma) {
      try {
        const data = await prisma.infakDistribution.findMany({
          where: onlyPublished ? { status: "published" } : undefined,
          orderBy: { mushaf_no: "asc" },
        });
        return data.map((d) => ({
          ...d,
          lat: d.lat ? Number(d.lat) : null,
          lng: d.lng ? Number(d.lng) : null,
          distributed_at: d.distributed_at.toISOString().split("T")[0],
          recipient_type: d.recipient_type as "pesantren" | "masjid" | "madrasah" | "lainnya",
          status: d.status as "draft" | "published",
          created_at: d.created_at.toISOString(),
          updated_at: d.updated_at.toISOString(),
        }));
      } catch (err: unknown) {
        console.warn("[prisma] getInfakDistributions fallback:", getErrorMessage(err));
      }
    }

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

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        let query = client.from("infak_distributions").select("*").order("mushaf_no", { ascending: true });
        if (onlyPublished) query = query.eq("status", "published");
        const { data, error } = await query;
        if (!error && data) return data as InfakDistribution[];
      } catch (err: unknown) {
        console.warn("[supabase] getInfakDistributions fallback:", getErrorMessage(err));
      }
    }

    return localStore.getInfak(onlyPublished);
  },

  async getInfakById(id: string): Promise<InfakDistribution | null> {
    if (isPrismaConfigured && prisma) {
      try {
        const d = await prisma.infakDistribution.findUnique({ where: { id } });
        if (d) {
          return {
            ...d,
            lat: d.lat ? Number(d.lat) : null,
            lng: d.lng ? Number(d.lng) : null,
            distributed_at: d.distributed_at.toISOString().split("T")[0],
            recipient_type: d.recipient_type as "pesantren" | "masjid" | "madrasah" | "lainnya",
            status: d.status as "draft" | "published",
            created_at: d.created_at.toISOString(),
            updated_at: d.updated_at.toISOString(),
          };
        }
      } catch (err: unknown) {
        console.warn("[prisma] getInfakById fallback:", getErrorMessage(err));
      }
    }

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

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        const { data, error } = await client.from("infak_distributions").select("*").eq("id", id).maybeSingle();
        if (!error && data) return data as InfakDistribution;
      } catch (err: unknown) {
        console.warn("[supabase] getInfakById fallback:", getErrorMessage(err));
      }
    }

    return localStore.getInfakById(id) || null;
  },

  async saveInfak(item: Omit<InfakDistribution, "id" | "created_at" | "updated_at">, id?: string): Promise<InfakDistribution> {
    if (isPrismaConfigured && prisma) {
      try {
        if (id) {
          const updated = await prisma.infakDistribution.update({
            where: { id },
            data: {
              mushaf_no: item.mushaf_no,
              donor_name: item.donor_name,
              show_donor_name: Boolean(item.show_donor_name),
              recipient_name: item.recipient_name,
              recipient_type: item.recipient_type,
              province: item.province,
              city: item.city,
              district: item.district,
              lat: item.lat ? new Prisma.Decimal(item.lat) : null,
              lng: item.lng ? new Prisma.Decimal(item.lng) : null,
              distributed_at: new Date(item.distributed_at),
              quantity: item.quantity || 1,
              photo_url: item.photo_url || null,
              notes: item.notes || null,
              status: item.status || "published",
            },
          });
          const mirror = { ...item, id: updated.id } as InfakDistribution;
          localStore.updateInfak(id, item);
          return mirror;
        } else {
          const created = await prisma.infakDistribution.create({
            data: {
              mushaf_no: item.mushaf_no,
              donor_name: item.donor_name,
              show_donor_name: Boolean(item.show_donor_name),
              recipient_name: item.recipient_name,
              recipient_type: item.recipient_type,
              province: item.province,
              city: item.city,
              district: item.district,
              lat: item.lat ? new Prisma.Decimal(item.lat) : null,
              lng: item.lng ? new Prisma.Decimal(item.lng) : null,
              distributed_at: new Date(item.distributed_at),
              quantity: item.quantity || 1,
              photo_url: item.photo_url || null,
              notes: item.notes || null,
              status: item.status || "published",
            },
          });
          const res = { ...item, id: created.id } as InfakDistribution;
          localStore.addInfak(item);
          return res;
        }
      } catch (err: unknown) {
        console.warn("[prisma] saveInfak fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        if (id) {
          await pgQuery(
            `update infak_distributions set 
               mushaf_no = $1, donor_name = $2, show_donor_name = $3, recipient_name = $4,
               recipient_type = $5, province = $6, city = $7, district = $8, lat = $9, lng = $10,
               distributed_at = $11, quantity = $12, photo_url = $13, notes = $14, status = $15, updated_at = now()
             where id = $16`,
            [
              item.mushaf_no, item.donor_name, Boolean(item.show_donor_name), item.recipient_name,
              item.recipient_type, item.province, item.city, item.district, item.lat || null, item.lng || null,
              item.distributed_at, item.quantity || 1, item.photo_url || null, item.notes || null, item.status || "published", id
            ]
          );
          const mirror = { ...item, id } as InfakDistribution;
          localStore.updateInfak(id, item);
          return mirror;
        } else {
          const res = await pgQuery(
            `insert into infak_distributions (
               mushaf_no, donor_name, show_donor_name, recipient_name, recipient_type,
               province, city, district, lat, lng, distributed_at, quantity, photo_url, notes, status
             ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
             returning id`,
            [
              item.mushaf_no, item.donor_name, Boolean(item.show_donor_name), item.recipient_name,
              item.recipient_type, item.province, item.city, item.district, item.lat || null, item.lng || null,
              item.distributed_at, item.quantity || 1, item.photo_url || null, item.notes || null, item.status || "published"
            ]
          );
          const created = { ...item, id: res.rows[0].id } as InfakDistribution;
          localStore.addInfak(item);
          return created;
        }
      } catch (err: unknown) {
        console.warn("[postgres] saveInfak fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        const query = id
          ? client.from("infak_distributions").update({ ...item, updated_at: new Date().toISOString() }).eq("id", id)
          : client.from("infak_distributions").insert(item);
        const { data, error } = await query.select().single();
        if (!error && data) return data as InfakDistribution;
      } catch (err: unknown) {
        console.warn("[supabase] saveInfak fallback:", getErrorMessage(err));
      }
    }

    if (id) {
      const updated = localStore.updateInfak(id, item);
      if (updated) return updated as InfakDistribution;
    }
    return localStore.addInfak(item);
  },

  async deleteInfak(id: string): Promise<boolean> {
    localStore.deleteInfak(id);

    if (isPrismaConfigured && prisma) {
      try {
        await prisma.infakDistribution.delete({ where: { id } });
        return true;
      } catch (err: unknown) {
        console.warn("[prisma] deleteInfak fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        await pgQuery(`delete from infak_distributions where id = $1`, [id]);
        return true;
      } catch (err: unknown) {
        console.warn("[postgres] deleteInfak fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        await client.from("infak_distributions").delete().eq("id", id);
      } catch {
        // already deleted in localStore
      }
    }
    return true;
  },

  // Geber Masjid
  async getGeberDistributions(onlyPublished = true): Promise<GeberMasjidDistribution[]> {
    if (isPrismaConfigured && prisma) {
      try {
        const data = await prisma.geberMasjidDistribution.findMany({
          where: onlyPublished ? { status: "published" } : undefined,
          orderBy: { activity_date: "desc" },
        });
        return data.map((g) => ({
          ...g,
          lat: g.lat ? Number(g.lat) : null,
          lng: g.lng ? Number(g.lng) : null,
          activity_date: g.activity_date.toISOString().split("T")[0],
          status: g.status as "draft" | "published",
          created_at: g.created_at.toISOString(),
          updated_at: g.updated_at.toISOString(),
        }));
      } catch (err: unknown) {
        console.warn("[prisma] getGeberDistributions fallback:", getErrorMessage(err));
      }
    }

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

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        let query = client.from("geber_masjid_distributions").select("*").order("activity_date", { ascending: false });
        if (onlyPublished) query = query.eq("status", "published");
        const { data, error } = await query;
        if (!error && data) return data as GeberMasjidDistribution[];
      } catch (err: unknown) {
        console.warn("[supabase] getGeberDistributions fallback:", getErrorMessage(err));
      }
    }

    return localStore.getGeber(onlyPublished);
  },

  async getGeberById(id: string): Promise<GeberMasjidDistribution | null> {
    if (isPrismaConfigured && prisma) {
      try {
        const g = await prisma.geberMasjidDistribution.findUnique({ where: { id } });
        if (g) {
          return {
            ...g,
            lat: g.lat ? Number(g.lat) : null,
            lng: g.lng ? Number(g.lng) : null,
            activity_date: g.activity_date.toISOString().split("T")[0],
            status: g.status as "draft" | "published",
            created_at: g.created_at.toISOString(),
            updated_at: g.updated_at.toISOString(),
          };
        }
      } catch (err: unknown) {
        console.warn("[prisma] getGeberById fallback:", getErrorMessage(err));
      }
    }

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

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        const { data, error } = await client.from("geber_masjid_distributions").select("*").eq("id", id).maybeSingle();
        if (!error && data) return data as GeberMasjidDistribution;
      } catch (err: unknown) {
        console.warn("[supabase] getGeberById fallback:", getErrorMessage(err));
      }
    }

    return localStore.getGeberById(id) || null;
  },

  async saveGeber(item: Omit<GeberMasjidDistribution, "id" | "created_at" | "updated_at">, id?: string): Promise<GeberMasjidDistribution> {
    if (isPrismaConfigured && prisma) {
      try {
        if (id) {
          const updated = await prisma.geberMasjidDistribution.update({
            where: { id },
            data: {
              mosque_name: item.mosque_name,
              province: item.province,
              city: item.city,
              district: item.district,
              address: item.address,
              lat: item.lat ? new Prisma.Decimal(item.lat) : null,
              lng: item.lng ? new Prisma.Decimal(item.lng) : null,
              activity_date: new Date(item.activity_date),
              participants: item.participants || 0,
              activity_notes: item.activity_notes || null,
              photo_urls: item.photo_urls || [],
              status: item.status || "published",
            },
          });
          const mirror = {
            ...item,
            id: updated.id,
            lat: updated.lat ? Number(updated.lat) : null,
            lng: updated.lng ? Number(updated.lng) : null,
            activity_date: updated.activity_date.toISOString().split("T")[0],
          } as GeberMasjidDistribution;
          localStore.updateGeber(id, item);
          return mirror;
        } else {
          const created = await prisma.geberMasjidDistribution.create({
            data: {
              mosque_name: item.mosque_name,
              province: item.province,
              city: item.city,
              district: item.district,
              address: item.address,
              lat: item.lat ? new Prisma.Decimal(item.lat) : null,
              lng: item.lng ? new Prisma.Decimal(item.lng) : null,
              activity_date: new Date(item.activity_date),
              participants: item.participants || 0,
              activity_notes: item.activity_notes || null,
              photo_urls: item.photo_urls || [],
              status: item.status || "published",
            },
          });
          const res = {
            ...item,
            id: created.id,
            lat: created.lat ? Number(created.lat) : null,
            lng: created.lng ? Number(created.lng) : null,
            activity_date: created.activity_date.toISOString().split("T")[0],
          } as GeberMasjidDistribution;
          localStore.addGeber(item);
          return res;
        }
      } catch (err: unknown) {
        console.warn("[prisma] saveGeber fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        if (id) {
          await pgQuery(
            `update geber_masjid_distributions set 
               mosque_name = $1, province = $2, city = $3, district = $4, address = $5,
               lat = $6, lng = $7, activity_date = $8, participants = $9, activity_notes = $10,
               photo_urls = $11, status = $12, updated_at = now()
             where id = $13`,
            [
              item.mosque_name, item.province, item.city, item.district, item.address,
              item.lat || null, item.lng || null, item.activity_date, item.participants || 0,
              item.activity_notes || null, item.photo_urls || [], item.status || "published", id
            ]
          );
          const mirror = { ...item, id } as GeberMasjidDistribution;
          localStore.updateGeber(id, item);
          return mirror;
        } else {
          const res = await pgQuery(
            `insert into geber_masjid_distributions (
               mosque_name, province, city, district, address, lat, lng,
               activity_date, participants, activity_notes, photo_urls, status
             ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             returning id`,
            [
              item.mosque_name, item.province, item.city, item.district, item.address,
              item.lat || null, item.lng || null, item.activity_date, item.participants || 0,
              item.activity_notes || null, item.photo_urls || [], item.status || "published"
            ]
          );
          const created = { ...item, id: res.rows[0].id } as GeberMasjidDistribution;
          localStore.addGeber(item);
          return created;
        }
      } catch (err: unknown) {
        console.warn("[postgres] saveGeber fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        const query = id
          ? client.from("geber_masjid_distributions").update({ ...item, updated_at: new Date().toISOString() }).eq("id", id)
          : client.from("geber_masjid_distributions").insert(item);
        const { data, error } = await query.select().single();
        if (!error && data) return data as GeberMasjidDistribution;
      } catch (err: unknown) {
        console.warn("[supabase] saveGeber fallback:", getErrorMessage(err));
      }
    }

    if (id) {
      const updated = localStore.updateGeber(id, item);
      if (updated) return updated;
    }
    return localStore.addGeber(item);
  },

  async deleteGeber(id: string): Promise<boolean> {
    localStore.deleteGeber(id);

    if (isPrismaConfigured && prisma) {
      try {
        await prisma.geberMasjidDistribution.delete({ where: { id } });
        return true;
      } catch (err: unknown) {
        console.warn("[prisma] deleteGeber fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        await pgQuery(`delete from geber_masjid_distributions where id = $1`, [id]);
        return true;
      } catch (err: unknown) {
        console.warn("[postgres] deleteGeber fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        await client.from("geber_masjid_distributions").delete().eq("id", id);
      } catch {
        // already deleted in localStore
      }
    }
    return true;
  },

  // Reports
  async getReports(onlyPublished = true): Promise<Report[]> {
    if (isPrismaConfigured && prisma) {
      try {
        const data = await prisma.report.findMany({
          where: onlyPublished ? { status: "published" } : undefined,
          orderBy: { period_start: "desc" },
        });
        return data.map((r) => ({
          ...r,
          program: r.program as ReportProgram,
          amount_idr: r.amount_idr ? Number(r.amount_idr) : null,
          period_start: r.period_start.toISOString().split("T")[0],
          period_end: r.period_end.toISOString().split("T")[0],
          status: r.status as "draft" | "published",
          created_at: r.created_at.toISOString(),
          updated_at: r.updated_at.toISOString(),
        }));
      } catch (err: unknown) {
        console.warn("[prisma] getReports fallback:", getErrorMessage(err));
      }
    }

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

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        let query = client.from("reports").select("*").order("period_start", { ascending: false });
        if (onlyPublished) query = query.eq("status", "published");
        const { data, error } = await query;
        if (!error && data) return data as Report[];
      } catch (err: unknown) {
        console.warn("[supabase] getReports fallback:", getErrorMessage(err));
      }
    }

    return localStore.getReports(onlyPublished);
  },

  async getReportBySlug(slug: string): Promise<Report | null> {
    if (isPrismaConfigured && prisma) {
      try {
        const r = await prisma.report.findUnique({ where: { slug } });
        if (r) {
          return {
            ...r,
            program: r.program as ReportProgram,
            amount_idr: r.amount_idr ? Number(r.amount_idr) : null,
            period_start: r.period_start.toISOString().split("T")[0],
            period_end: r.period_end.toISOString().split("T")[0],
            status: r.status as "draft" | "published",
            created_at: r.created_at.toISOString(),
            updated_at: r.updated_at.toISOString(),
          };
        }
      } catch (err: unknown) {
        console.warn("[prisma] getReportBySlug fallback:", getErrorMessage(err));
      }
    }

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

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        const { data, error } = await client.from("reports").select("*").eq("slug", slug).maybeSingle();
        if (!error && data) return data as Report;
      } catch (err: unknown) {
        console.warn("[supabase] getReportBySlug fallback:", getErrorMessage(err));
      }
    }

    return localStore.getReportBySlug(slug) || null;
  },

  async getReportById(id: string): Promise<Report | null> {
    if (isPrismaConfigured && prisma) {
      try {
        const r = await prisma.report.findUnique({ where: { id } });
        if (r) {
          return {
            ...r,
            program: r.program as ReportProgram,
            amount_idr: r.amount_idr ? Number(r.amount_idr) : null,
            period_start: r.period_start.toISOString().split("T")[0],
            period_end: r.period_end.toISOString().split("T")[0],
            status: r.status as "draft" | "published",
            created_at: r.created_at.toISOString(),
            updated_at: r.updated_at.toISOString(),
          };
        }
      } catch (err: unknown) {
        console.warn("[prisma] getReportById fallback:", getErrorMessage(err));
      }
    }

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

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        const { data, error } = await client.from("reports").select("*").eq("id", id).maybeSingle();
        if (!error && data) return data as Report;
      } catch (err: unknown) {
        console.warn("[supabase] getReportById fallback:", getErrorMessage(err));
      }
    }

    return localStore.getReportById(id) || null;
  },

  async saveReport(item: Omit<Report, "id" | "created_at" | "updated_at">, id?: string): Promise<Report> {
    if (isPrismaConfigured && prisma) {
      try {
        if (id) {
          const updated = await prisma.report.update({
            where: { id },
            data: {
              slug: item.slug,
              title: item.title,
              program: item.program,
              period_start: new Date(item.period_start),
              period_end: new Date(item.period_end),
              summary: item.summary,
              body: item.body,
              beneficiaries: item.beneficiaries || 0,
              amount_idr: item.amount_idr ? BigInt(item.amount_idr) : null,
              cover_url: item.cover_url || null,
              gallery_urls: item.gallery_urls || [],
              pdf_url: item.pdf_url || null,
              status: item.status || "published",
            },
          });
          const mirror = {
            ...item,
            id: updated.id,
            amount_idr: updated.amount_idr ? Number(updated.amount_idr) : null,
            period_start: updated.period_start.toISOString().split("T")[0],
            period_end: updated.period_end.toISOString().split("T")[0],
          } as Report;
          localStore.updateReport(id, item);
          return mirror;
        } else {
          const created = await prisma.report.create({
            data: {
              slug: item.slug,
              title: item.title,
              program: item.program,
              period_start: new Date(item.period_start),
              period_end: new Date(item.period_end),
              summary: item.summary,
              body: item.body,
              beneficiaries: item.beneficiaries || 0,
              amount_idr: item.amount_idr ? BigInt(item.amount_idr) : null,
              cover_url: item.cover_url || null,
              gallery_urls: item.gallery_urls || [],
              pdf_url: item.pdf_url || null,
              status: item.status || "published",
            },
          });
          const res = {
            ...item,
            id: created.id,
            amount_idr: created.amount_idr ? Number(created.amount_idr) : null,
            period_start: created.period_start.toISOString().split("T")[0],
            period_end: created.period_end.toISOString().split("T")[0],
          } as Report;
          localStore.addReport(item);
          return res;
        }
      } catch (err: unknown) {
        console.warn("[prisma] saveReport fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        if (id) {
          await pgQuery(
            `update reports set 
               slug = $1, title = $2, program = $3, period_start = $4, period_end = $5,
               summary = $6, body = $7, beneficiaries = $8, amount_idr = $9,
               cover_url = $10, gallery_urls = $11, pdf_url = $12, status = $13, updated_at = now()
             where id = $14`,
            [
              item.slug, item.title, item.program, item.period_start, item.period_end,
              item.summary, item.body, item.beneficiaries || 0, item.amount_idr || null,
              item.cover_url || null, item.gallery_urls || [], item.pdf_url || null,
              item.status || "published", id
            ]
          );
          const mirror = { ...item, id } as Report;
          localStore.updateReport(id, item);
          return mirror;
        } else {
          const res = await pgQuery(
            `insert into reports (
               slug, title, program, period_start, period_end, summary, body,
               beneficiaries, amount_idr, cover_url, gallery_urls, pdf_url, status
             ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
             returning id`,
            [
              item.slug, item.title, item.program, item.period_start, item.period_end,
              item.summary, item.body, item.beneficiaries || 0, item.amount_idr || null,
              item.cover_url || null, item.gallery_urls || [], item.pdf_url || null,
              item.status || "published"
            ]
          );
          const created = { ...item, id: res.rows[0].id } as Report;
          localStore.addReport(item);
          return created;
        }
      } catch (err: unknown) {
        console.warn("[postgres] saveReport fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        const query = id
          ? client.from("reports").update({ ...item, updated_at: new Date().toISOString() }).eq("id", id)
          : client.from("reports").insert(item);
        const { data, error } = await query.select().single();
        if (!error && data) return data as Report;
      } catch (err: unknown) {
        console.warn("[supabase] saveReport fallback:", getErrorMessage(err));
      }
    }

    if (id) {
      const updated = localStore.updateReport(id, item);
      if (updated) return updated;
    }
    return localStore.addReport(item);
  },

  async deleteReport(id: string): Promise<boolean> {
    localStore.deleteReport(id);

    if (isPrismaConfigured && prisma) {
      try {
        await prisma.report.delete({ where: { id } });
        return true;
      } catch (err: unknown) {
        console.warn("[prisma] deleteReport fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        await pgQuery(`delete from reports where id = $1`, [id]);
        return true;
      } catch (err: unknown) {
        console.warn("[postgres] deleteReport fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        await client.from("reports").delete().eq("id", id);
      } catch {
        // already deleted in localStore
      }
    }
    return true;
  },

  // Themed Campaigns
  async getThemedCampaigns(): Promise<ThemedCampaign[]> {
    if (isPrismaConfigured && prisma) {
      try {
        const data = await prisma.themedCampaign.findMany({ orderBy: { created_at: "desc" } });
        return data.map((c) => ({
          ...c,
          target_idr: Number(c.target_idr),
          collected_idr: Number(c.collected_idr),
          status: c.status as "aktif" | "selesai",
          created_at: c.created_at.toISOString(),
        }));
      } catch (err: unknown) {
        console.warn("[prisma] getThemedCampaigns fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(`select * from themed_campaigns order by created_at desc`);
        return res.rows as ThemedCampaign[];
      } catch (err: unknown) {
        console.warn("[postgres] getThemedCampaigns fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        const { data, error } = await client.from("themed_campaigns").select("*").order("created_at", { ascending: false });
        if (!error && data) return data as ThemedCampaign[];
      } catch (err: unknown) {
        console.warn("[supabase] getThemedCampaigns fallback:", getErrorMessage(err));
      }
    }

    return localStore.getCampaigns();
  },

  async getThemedCampaignById(id: string): Promise<ThemedCampaign | null> {
    if (isPrismaConfigured && prisma) {
      try {
        const c = await prisma.themedCampaign.findUnique({ where: { id } });
        if (c) {
          return {
            ...c,
            target_idr: Number(c.target_idr),
            collected_idr: Number(c.collected_idr),
            status: c.status as "aktif" | "selesai",
            created_at: c.created_at.toISOString(),
          };
        }
      } catch (err: unknown) {
        console.warn("[prisma] getThemedCampaignById fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(`select * from themed_campaigns where id = $1 limit 1`, [id]);
        if (res.rows.length) return res.rows[0] as ThemedCampaign;
      } catch (err: unknown) {
        console.warn("[postgres] getThemedCampaignById fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        const { data, error } = await client.from("themed_campaigns").select("*").eq("id", id).maybeSingle();
        if (!error && data) return data as ThemedCampaign;
      } catch (err: unknown) {
        console.warn("[supabase] getThemedCampaignById fallback:", getErrorMessage(err));
      }
    }

    return null;
  },

  async saveThemedCampaign(
    item: Omit<ThemedCampaign, "id" | "created_at">,
    id?: string
  ): Promise<ThemedCampaign> {
    if (isPrismaConfigured && prisma) {
      try {
        if (id) {
          const res = await prisma.themedCampaign.update({
            where: { id },
            data: {
              title: item.title,
              disaster_type: item.disaster_type,
              location: item.location,
              status: item.status || "aktif",
              description: item.description,
              cover_url: item.cover_url || null,
              target_idr: BigInt(item.target_idr || 0),
              collected_idr: BigInt(item.collected_idr || 0),
            },
          });
          return {
            ...item,
            id: res.id,
            target_idr: Number(res.target_idr),
            collected_idr: Number(res.collected_idr),
            created_at: res.created_at.toISOString(),
          } as ThemedCampaign;
        } else {
          const res = await prisma.themedCampaign.create({
            data: {
              title: item.title,
              disaster_type: item.disaster_type,
              location: item.location,
              status: item.status || "aktif",
              description: item.description,
              cover_url: item.cover_url || null,
              target_idr: BigInt(item.target_idr || 0),
              collected_idr: BigInt(item.collected_idr || 0),
            },
          });
          return {
            ...item,
            id: res.id,
            target_idr: Number(res.target_idr),
            collected_idr: Number(res.collected_idr),
            created_at: res.created_at.toISOString(),
          } as ThemedCampaign;
        }
      } catch (err: unknown) {
        console.warn("[prisma] saveThemedCampaign fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        if (id) {
          await pgQuery(
            `update themed_campaigns set 
               title = $1, disaster_type = $2, location = $3, status = $4,
               description = $5, cover_url = $6, target_idr = $7, collected_idr = $8
             where id = $9`,
            [
              item.title, item.disaster_type, item.location, item.status || "aktif",
              item.description, item.cover_url || null, item.target_idr || 0,
              item.collected_idr || 0, id
            ]
          );
          return { ...item, id } as ThemedCampaign;
        } else {
          const res = await pgQuery(
            `insert into themed_campaigns (
               title, disaster_type, location, status, description,
               cover_url, target_idr, collected_idr
             ) values ($1, $2, $3, $4, $5, $6, $7, $8)
             returning id`,
            [
              item.title, item.disaster_type, item.location, item.status || "aktif",
              item.description, item.cover_url || null, item.target_idr || 0,
              item.collected_idr || 0
            ]
          );
          return { ...item, id: res.rows[0].id } as ThemedCampaign;
        }
      } catch (err: unknown) {
        console.warn("[postgres] saveThemedCampaign fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        const query = id
          ? client.from("themed_campaigns").update(item).eq("id", id)
          : client.from("themed_campaigns").insert(item);
        const { data, error } = await query.select().single();
        if (!error && data) return data as ThemedCampaign;
      } catch (err: unknown) {
        console.warn("[supabase] saveThemedCampaign fallback:", getErrorMessage(err));
      }
    }

    return localStore.addCampaign(item);
  },

  async deleteThemedCampaign(id: string): Promise<boolean> {
    if (isPrismaConfigured && prisma) {
      try {
        await prisma.themedCampaign.delete({ where: { id } });
        return true;
      } catch (err: unknown) {
        console.warn("[prisma] deleteThemedCampaign fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        await pgQuery(`delete from themed_campaigns where id = $1`, [id]);
        return true;
      } catch (err: unknown) {
        console.warn("[postgres] deleteThemedCampaign fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        await client.from("themed_campaigns").delete().eq("id", id);
      } catch {
        // fallback
      }
    }
    return true;
  },

  // Gallery
  async getGalleryItems(onlyPublished = false): Promise<GalleryItem[]> {
    if (isPrismaConfigured && prisma) {
      try {
        const data = await prisma.galleryItem.findMany({
          where: onlyPublished ? { status: "published" } : undefined,
          orderBy: { date: "desc" },
        });
        return data.map((g) => ({
          ...g,
          date: g.date.toISOString().split("T")[0],
          status: g.status as "draft" | "published",
          created_at: g.created_at.toISOString(),
        }));
      } catch (err: unknown) {
        console.warn("[prisma] getGalleryItems fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(
          `select *, to_char(date, 'YYYY-MM-DD') as date 
           from gallery_items 
           where ($1::boolean = false or status = 'published') 
           order by date desc`,
          [onlyPublished]
        );
        return res.rows as GalleryItem[];
      } catch (err: unknown) {
        console.warn("[postgres] getGalleryItems fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        let query = client.from("gallery_items").select("*").order("date", { ascending: false });
        if (onlyPublished) query = query.eq("status", "published");
        const { data, error } = await query;
        if (!error && data) return data as GalleryItem[];
      } catch (err: unknown) {
        console.warn("[supabase] getGalleryItems fallback:", getErrorMessage(err));
      }
    }

    return localStore.getGallery(onlyPublished);
  },

  async getGalleryItemById(id: string): Promise<GalleryItem | null> {
    if (isPrismaConfigured && prisma) {
      try {
        const g = await prisma.galleryItem.findUnique({ where: { id } });
        if (g) {
          return {
            ...g,
            date: g.date.toISOString().split("T")[0],
            status: g.status as "draft" | "published",
            created_at: g.created_at.toISOString(),
          };
        }
      } catch (err: unknown) {
        console.warn("[prisma] getGalleryItemById fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(
          `select *, to_char(date, 'YYYY-MM-DD') as date 
           from gallery_items where id = $1 limit 1`,
          [id]
        );
        if (res.rows.length) return res.rows[0] as GalleryItem;
      } catch (err: unknown) {
        console.warn("[postgres] getGalleryItemById fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        const { data, error } = await client.from("gallery_items").select("*").eq("id", id).maybeSingle();
        if (!error && data) return data as GalleryItem;
      } catch (err: unknown) {
        console.warn("[supabase] getGalleryItemById fallback:", getErrorMessage(err));
      }
    }

    return null;
  },

  async saveGalleryItem(
    item: Omit<GalleryItem, "id" | "created_at">,
    id?: string
  ): Promise<GalleryItem> {
    if (isPrismaConfigured && prisma) {
      try {
        if (id) {
          const res = await prisma.galleryItem.update({
            where: { id },
            data: {
              title: item.title,
              program: item.program,
              date: new Date(item.date),
              image_url: item.image_url,
              caption: item.caption || null,
              status: item.status || "published",
            },
          });
          return {
            ...item,
            id: res.id,
            date: res.date.toISOString().split("T")[0],
            created_at: res.created_at.toISOString(),
          } as GalleryItem;
        } else {
          const res = await prisma.galleryItem.create({
            data: {
              title: item.title,
              program: item.program,
              date: new Date(item.date),
              image_url: item.image_url,
              caption: item.caption || null,
              status: item.status || "published",
            },
          });
          return {
            ...item,
            id: res.id,
            date: res.date.toISOString().split("T")[0],
            created_at: res.created_at.toISOString(),
          } as GalleryItem;
        }
      } catch (err: unknown) {
        console.warn("[prisma] saveGalleryItem fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        if (id) {
          await pgQuery(
            `update gallery_items set 
               title = $1, program = $2, date = $3, image_url = $4,
               caption = $5, status = $6
             where id = $7`,
            [item.title, item.program, item.date, item.image_url, item.caption || null, item.status || "published", id]
          );
          return { ...item, id } as GalleryItem;
        } else {
          const res = await pgQuery(
            `insert into gallery_items (title, program, date, image_url, caption, status)
             values ($1, $2, $3, $4, $5, $6)
             returning id`,
            [item.title, item.program, item.date, item.image_url, item.caption || null, item.status || "published"]
          );
          return { ...item, id: res.rows[0].id } as GalleryItem;
        }
      } catch (err: unknown) {
        console.warn("[postgres] saveGalleryItem fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        const query = id
          ? client.from("gallery_items").update(item).eq("id", id)
          : client.from("gallery_items").insert(item);
        const { data, error } = await query.select().single();
        if (!error && data) return data as GalleryItem;
      } catch (err: unknown) {
        console.warn("[supabase] saveGalleryItem fallback:", getErrorMessage(err));
      }
    }

    return localStore.addGalleryItem(item);
  },

  async deleteGalleryItem(id: string): Promise<boolean> {
    if (isPrismaConfigured && prisma) {
      try {
        await prisma.galleryItem.delete({ where: { id } });
        return true;
      } catch (err: unknown) {
        console.warn("[prisma] deleteGalleryItem fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        await pgQuery(`delete from gallery_items where id = $1`, [id]);
        return true;
      } catch (err: unknown) {
        console.warn("[postgres] deleteGalleryItem fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        await client.from("gallery_items").delete().eq("id", id);
      } catch {
        // fallback
      }
    }
    return true;
  },

  // Settings: Bank, Contact, Social
  async getBankAccounts(): Promise<BankAccount[]> {
    if (isPrismaConfigured && prisma) {
      try {
        const row = await prisma.siteSetting.findUnique({ where: { key: "bank_accounts" } });
        if (row?.value) return row.value as unknown as BankAccount[];
      } catch (err: unknown) {
        console.warn("[prisma] getBankAccounts fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(`select value from site_settings where key = 'bank_accounts' limit 1`);
        if (res.rows.length && res.rows[0].value) return res.rows[0].value as BankAccount[];
      } catch (err: unknown) {
        console.warn("[postgres] getBankAccounts fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        const { data, error } = await client.from("site_settings").select("value").eq("key", "bank_accounts").maybeSingle();
        if (!error && data?.value) return data.value as BankAccount[];
      } catch (err: unknown) {
        console.warn("[supabase] getBankAccounts fallback:", getErrorMessage(err));
      }
    }

    return localStore.getBankAccounts();
  },

  async updateBankAccounts(accounts: BankAccount[]): Promise<void> {
    localStore.updateBankAccounts(accounts);

    if (isPrismaConfigured && prisma) {
      try {
        await prisma.siteSetting.upsert({
          where: { key: "bank_accounts" },
          create: { key: "bank_accounts", value: accounts as unknown as Prisma.InputJsonValue },
          update: { value: accounts as unknown as Prisma.InputJsonValue },
        });
        return;
      } catch (err: unknown) {
        console.warn("[prisma] updateBankAccounts fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        await pgQuery(
          `insert into site_settings (key, value, updated_at)
           values ('bank_accounts', $1, now())
           on conflict (key) do update set value = $1, updated_at = now()`,
          [JSON.stringify(accounts)]
        );
        return;
      } catch (err: unknown) {
        console.warn("[postgres] updateBankAccounts fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        await client.from("site_settings").upsert({
          key: "bank_accounts",
          value: accounts,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn("Supabase updateBankAccounts fallback:", err);
      }
    }
  },

  async getContactInfo(): Promise<ContactInfo> {
    if (isPrismaConfigured && prisma) {
      try {
        const row = await prisma.siteSetting.findUnique({ where: { key: "contact_info" } });
        if (row?.value) return row.value as unknown as ContactInfo;
      } catch (err: unknown) {
        console.warn("[prisma] getContactInfo fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(`select value from site_settings where key = 'contact_info' limit 1`);
        if (res.rows.length && res.rows[0].value) return res.rows[0].value as ContactInfo;
      } catch (err: unknown) {
        console.warn("[postgres] getContactInfo fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        const { data, error } = await client.from("site_settings").select("value").eq("key", "contact_info").maybeSingle();
        if (!error && data?.value) return data.value as ContactInfo;
      } catch (err: unknown) {
        console.warn("[supabase] getContactInfo fallback:", getErrorMessage(err));
      }
    }

    return localStore.getContactInfo();
  },

  async updateContactInfo(info: ContactInfo): Promise<void> {
    localStore.updateContactInfo(info);

    if (isPrismaConfigured && prisma) {
      try {
        await prisma.siteSetting.upsert({
          where: { key: "contact_info" },
          create: { key: "contact_info", value: info as unknown as Prisma.InputJsonValue },
          update: { value: info as unknown as Prisma.InputJsonValue },
        });
        return;
      } catch (err: unknown) {
        console.warn("[prisma] updateContactInfo fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        await pgQuery(
          `insert into site_settings (key, value, updated_at)
           values ('contact_info', $1, now())
           on conflict (key) do update set value = $1, updated_at = now()`,
          [JSON.stringify(info)]
        );
        return;
      } catch (err: unknown) {
        console.warn("[postgres] updateContactInfo fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        await client.from("site_settings").upsert({
          key: "contact_info",
          value: info,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn("Supabase updateContactInfo fallback:", err);
      }
    }
  },

  async getSocialLinks(): Promise<SocialLinks> {
    if (isPrismaConfigured && prisma) {
      try {
        const row = await prisma.siteSetting.findUnique({ where: { key: "social_links" } });
        if (row?.value) return row.value as unknown as SocialLinks;
      } catch (err: unknown) {
        console.warn("[prisma] getSocialLinks fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        const res = await pgQuery(`select value from site_settings where key = 'social_links' limit 1`);
        if (res.rows.length && res.rows[0].value) return res.rows[0].value as SocialLinks;
      } catch (err: unknown) {
        console.warn("[postgres] getSocialLinks fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        const { data, error } = await client.from("site_settings").select("value").eq("key", "social_links").maybeSingle();
        if (!error && data?.value) return data.value as SocialLinks;
      } catch (err: unknown) {
        console.warn("[supabase] getSocialLinks fallback:", getErrorMessage(err));
      }
    }

    return localStore.getSocialLinks();
  },

  async updateSocialLinks(links: SocialLinks): Promise<void> {
    localStore.updateSocialLinks(links);

    if (isPrismaConfigured && prisma) {
      try {
        await prisma.siteSetting.upsert({
          where: { key: "social_links" },
          create: { key: "social_links", value: links as unknown as Prisma.InputJsonValue },
          update: { value: links as unknown as Prisma.InputJsonValue },
        });
        return;
      } catch (err: unknown) {
        console.warn("[prisma] updateSocialLinks fallback:", getErrorMessage(err));
      }
    }

    if (isPostgresConfigured) {
      try {
        await pgQuery(
          `insert into site_settings (key, value, updated_at)
           values ('social_links', $1, now())
           on conflict (key) do update set value = $1, updated_at = now()`,
          [JSON.stringify(links)]
        );
        return;
      } catch (err: unknown) {
        console.warn("[postgres] updateSocialLinks fallback:", getErrorMessage(err));
      }
    }

    if (isSupabaseConfigured && adminSupabase) {
      try {
        const client = getClient();
        await client.from("site_settings").upsert({
          key: "social_links",
          value: links,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn("Supabase updateSocialLinks fallback:", err);
      }
    }
  },

  async getAggregatedStats(): Promise<AggregatedStats> {
    const [infak, geber, reports] = await Promise.all([
      this.getInfakJinan(true),
      this.getGeberDistributions(true),
      this.getReports(true),
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
  },
};
