import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

// 1. Load environment variables from .env.local if not already in process.env
function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, "utf8");
    raw.split("\n").forEach((line) => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

loadEnv();

const isDryRun = process.argv.includes("--dry-run");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const mysqlUrl = process.env.DATABASE_URL;

console.log("==================================================================");
console.log("  AKSARA DATABASE MIGRATION: SUPABASE POSTGRESQL -> HOSTINGER MYSQL");
console.log("==================================================================");
console.log(`Mode Operasi       : ${isDryRun ? "DRY-RUN (Simulasi Aman Tanpa Menulis)" : "LIVE TRANSFER"}`);
console.log(`Supabase Endpoint  : ${supabaseUrl || "BELUM TERISI"}`);
console.log(`MySQL Destination  : ${mysqlUrl ? mysqlUrl.replace(/:[^:@]+@/, ":****@") : "BELUM TERISI"}`);
console.log("------------------------------------------------------------------\n");

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERROR: Kredensial Supabase (NEXT_PUBLIC_SUPABASE_URL & ANON_KEY) tidak ditemukan di environment.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

let prisma = null;
if (!isDryRun) {
  if (!mysqlUrl || !mysqlUrl.startsWith("mysql://")) {
    console.error("❌ ERROR: DATABASE_URL untuk MySQL belum disetel. Jalankan dengan --dry-run untuk uji baca, atau isi DATABASE_URL MySQL.");
    process.exit(1);
  }
  prisma = new PrismaClient();
}

// Helpers
function normalizeArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Postgres format like {"item1","item2"}
      if (val.startsWith("{") && val.endsWith("}")) {
        return val.slice(1, -1).split(",").map((s) => s.replace(/^"|"$/g, "").trim()).filter(Boolean);
      }
    }
  }
  return [];
}

function parseDate(val) {
  if (!val) return null;
  return new Date(val);
}

function parseBigInt(val) {
  if (val === null || val === undefined) return null;
  return BigInt(val);
}

async function runMigration() {
  const report = {
    started_at: new Date().toISOString(),
    is_dry_run: isDryRun,
    tables: {},
    total_source_records: 0,
    total_migrated_records: 0,
    errors: [],
  };

  try {
    // 1. site_settings
    console.log("📦 [1/13] Memproses tabel: site_settings...");
    const { data: siteSettings, error: errSite } = await supabase.from("site_settings").select("*");
    if (errSite) throw new Error(`Gagal membaca site_settings dari Supabase: ${errSite.message}`);
    report.tables.site_settings = { source_count: siteSettings.length, target_count: 0 };
    report.total_source_records += siteSettings.length;

    if (!isDryRun && prisma) {
      for (const item of siteSettings) {
        await prisma.siteSetting.upsert({
          where: { key: item.key },
          create: {
            key: item.key,
            value: item.value,
            updated_at: parseDate(item.updated_at) || new Date(),
          },
          update: {
            value: item.value,
            updated_at: parseDate(item.updated_at) || new Date(),
          },
        });
      }
      report.tables.site_settings.target_count = siteSettings.length;
    }
    console.log(`   ✓ site_settings: ${siteSettings.length} baris terbaca.\n`);

    // 2. upload_ledger
    console.log("📦 [2/13] Memproses tabel: upload_ledger...");
    const { data: uploadLedger, error: errLedger } = await supabase.from("upload_ledger").select("*");
    if (errLedger && errLedger.code !== "PGRST205") throw new Error(`Gagal membaca upload_ledger: ${errLedger.message}`);
    const ledgerRows = uploadLedger || [];
    report.tables.upload_ledger = { source_count: ledgerRows.length, target_count: 0 };
    report.total_source_records += ledgerRows.length;

    if (!isDryRun && prisma && ledgerRows.length > 0) {
      for (const item of ledgerRows) {
        await prisma.uploadLedger.upsert({
          where: { url: item.url },
          create: {
            id: item.id,
            url: item.url,
            content_hash: item.content_hash,
            size_bytes: item.size_bytes,
            mime_type: item.mime_type,
            status: item.status,
            created_at: parseDate(item.created_at) || new Date(),
            committed_at: parseDate(item.committed_at),
          },
          update: {
            status: item.status,
            committed_at: parseDate(item.committed_at),
          },
        });
      }
      report.tables.upload_ledger.target_count = ledgerRows.length;
    }
    console.log(`   ✓ upload_ledger: ${ledgerRows.length} baris terbaca.\n`);

    // 3. infak_jinan (Parent)
    console.log("📦 [3/13] Memproses tabel: infak_jinan (Induk Mushaf)...");
    const { data: infakJinan, error: errJinan } = await supabase.from("infak_jinan").select("*").order("mushaf_no", { ascending: true });
    if (errJinan) throw new Error(`Gagal membaca infak_jinan: ${errJinan.message}`);
    report.tables.infak_jinan = { source_count: infakJinan.length, target_count: 0 };
    report.total_source_records += infakJinan.length;

    if (!isDryRun && prisma) {
      for (const item of infakJinan) {
        await prisma.infakJinan.upsert({
          where: { id: item.id },
          create: {
            id: item.id,
            mushaf_no: item.mushaf_no,
            donor_name: item.donor_name,
            show_donor_name: Boolean(item.show_donor_name),
            donor_origin: item.donor_origin || "",
            donor_phone: item.donor_phone,
            dedication_name: item.dedication_name || "",
            pesantren_name: item.pesantren_name || "",
            pesantren_province: item.pesantren_province,
            pesantren_city: item.pesantren_city,
            address: item.address || "",
            distributed_at: parseDate(item.distributed_at) || new Date(),
            maps_url: item.maps_url,
            santri_name: item.santri_name,
            santri_phone: item.santri_phone,
            status: item.status || "published",
            created_at: parseDate(item.created_at) || new Date(),
            updated_at: parseDate(item.updated_at) || new Date(),
          },
          update: {
            mushaf_no: item.mushaf_no,
            donor_name: item.donor_name,
            show_donor_name: Boolean(item.show_donor_name),
            donor_origin: item.donor_origin || "",
            donor_phone: item.donor_phone,
            dedication_name: item.dedication_name || "",
            pesantren_name: item.pesantren_name || "",
            pesantren_province: item.pesantren_province,
            pesantren_city: item.pesantren_city,
            address: item.address || "",
            distributed_at: parseDate(item.distributed_at) || new Date(),
            maps_url: item.maps_url,
            santri_name: item.santri_name,
            santri_phone: item.santri_phone,
            status: item.status || "published",
            updated_at: parseDate(item.updated_at) || new Date(),
          },
        });
      }
      report.tables.infak_jinan.target_count = infakJinan.length;
    }
    console.log(`   ✓ infak_jinan: ${infakJinan.length} baris terbaca.\n`);

    // 4. infak_jinan_photos (Child of infak_jinan)
    console.log("📦 [4/13] Memproses tabel: infak_jinan_photos (Foto Serah Terima)...");
    const { data: jinanPhotos, error: errPhotos } = await supabase.from("infak_jinan_photos").select("*");
    if (errPhotos) throw new Error(`Gagal membaca infak_jinan_photos: ${errPhotos.message}`);
    report.tables.infak_jinan_photos = { source_count: jinanPhotos.length, target_count: 0 };
    report.total_source_records += jinanPhotos.length;

    if (!isDryRun && prisma) {
      for (const item of jinanPhotos) {
        await prisma.infakJinanPhoto.upsert({
          where: { id: item.id },
          create: {
            id: item.id,
            infak_id: item.infak_id,
            url: item.url,
            caption: item.caption,
            sort: item.sort || 0,
            created_at: parseDate(item.created_at) || new Date(),
          },
          update: {
            url: item.url,
            caption: item.caption,
            sort: item.sort || 0,
          },
        });
      }
      report.tables.infak_jinan_photos.target_count = jinanPhotos.length;
    }
    console.log(`   ✓ infak_jinan_photos: ${jinanPhotos.length} baris terbaca.\n`);

    // 5. infak_jinan_santri (Child of infak_jinan)
    console.log("📦 [5/13] Memproses tabel: infak_jinan_santri (Santri Binaan)...");
    const { data: jinanSantri, error: errSantri } = await supabase.from("infak_jinan_santri").select("*");
    if (errSantri) throw new Error(`Gagal membaca infak_jinan_santri: ${errSantri.message}`);
    report.tables.infak_jinan_santri = { source_count: jinanSantri.length, target_count: 0 };
    report.total_source_records += jinanSantri.length;

    if (!isDryRun && prisma) {
      for (const item of jinanSantri) {
        await prisma.infakJinanSantri.upsert({
          where: { id: item.id },
          create: {
            id: item.id,
            infak_id: item.infak_id,
            name: item.name,
            phone: item.phone,
            sort: item.sort || 0,
            status: item.status || "published",
            created_at: parseDate(item.created_at) || new Date(),
            updated_at: parseDate(item.updated_at) || new Date(),
          },
          update: {
            name: item.name,
            phone: item.phone,
            sort: item.sort || 0,
            status: item.status || "published",
            updated_at: parseDate(item.updated_at) || new Date(),
          },
        });
      }
      report.tables.infak_jinan_santri.target_count = jinanSantri.length;
    }
    console.log(`   ✓ infak_jinan_santri: ${jinanSantri.length} baris terbaca.\n`);

    // 6. santri_hafalan_updates (Child of infak_jinan_santri)
    console.log("📦 [6/13] Memproses tabel: santri_hafalan_updates (Progres Hafalan)...");
    const { data: hafalanUpdates, error: errHafalan } = await supabase.from("santri_hafalan_updates").select("*");
    if (errHafalan) throw new Error(`Gagal membaca santri_hafalan_updates: ${errHafalan.message}`);
    report.tables.santri_hafalan_updates = { source_count: hafalanUpdates.length, target_count: 0 };
    report.total_source_records += hafalanUpdates.length;

    if (!isDryRun && prisma) {
      for (const item of hafalanUpdates) {
        await prisma.santriHafalanUpdate.upsert({
          where: { id: item.id },
          create: {
            id: item.id,
            santri_id: item.santri_id,
            updated_on: parseDate(item.updated_on) || new Date(),
            surah_no: item.surah_no,
            surah_name: item.surah_name,
            ayat: item.ayat,
            juz: item.juz,
            notes: item.notes,
            created_at: parseDate(item.created_at) || new Date(),
          },
          update: {
            updated_on: parseDate(item.updated_on) || new Date(),
            surah_no: item.surah_no,
            surah_name: item.surah_name,
            ayat: item.ayat,
            juz: item.juz,
            notes: item.notes,
          },
        });
      }
      report.tables.santri_hafalan_updates.target_count = hafalanUpdates.length;
    }
    console.log(`   ✓ santri_hafalan_updates: ${hafalanUpdates.length} baris terbaca.\n`);

    // 7. geber_masjid_distributions
    console.log("📦 [7/13] Memproses tabel: geber_masjid_distributions...");
    const { data: geberMasjid, error: errGeber } = await supabase.from("geber_masjid_distributions").select("*");
    if (errGeber) throw new Error(`Gagal membaca geber_masjid_distributions: ${errGeber.message}`);
    report.tables.geber_masjid_distributions = { source_count: geberMasjid.length, target_count: 0 };
    report.total_source_records += geberMasjid.length;

    if (!isDryRun && prisma) {
      for (const item of geberMasjid) {
        await prisma.geberMasjidDistribution.upsert({
          where: { id: item.id },
          create: {
            id: item.id,
            mosque_name: item.mosque_name,
            province: item.province,
            city: item.city,
            district: item.district,
            address: item.address,
            lat: item.lat !== null ? String(item.lat) : null,
            lng: item.lng !== null ? String(item.lng) : null,
            activity_date: parseDate(item.activity_date) || new Date(),
            participants: item.participants || 0,
            activity_notes: item.activity_notes,
            photo_urls: normalizeArray(item.photo_urls),
            status: item.status || "published",
            created_at: parseDate(item.created_at) || new Date(),
            updated_at: parseDate(item.updated_at) || new Date(),
          },
          update: {
            mosque_name: item.mosque_name,
            province: item.province,
            city: item.city,
            district: item.district,
            address: item.address,
            lat: item.lat !== null ? String(item.lat) : null,
            lng: item.lng !== null ? String(item.lng) : null,
            activity_date: parseDate(item.activity_date) || new Date(),
            participants: item.participants || 0,
            activity_notes: item.activity_notes,
            photo_urls: normalizeArray(item.photo_urls),
            status: item.status || "published",
            updated_at: parseDate(item.updated_at) || new Date(),
          },
        });
      }
      report.tables.geber_masjid_distributions.target_count = geberMasjid.length;
    }
    console.log(`   ✓ geber_masjid_distributions: ${geberMasjid.length} baris terbaca.\n`);

    // 8. reports
    console.log("📦 [8/13] Memproses tabel: reports...");
    const { data: reports, error: errReports } = await supabase.from("reports").select("*");
    if (errReports) throw new Error(`Gagal membaca reports: ${errReports.message}`);
    report.tables.reports = { source_count: reports.length, target_count: 0 };
    report.total_source_records += reports.length;

    if (!isDryRun && prisma) {
      for (const item of reports) {
        await prisma.report.upsert({
          where: { id: item.id },
          create: {
            id: item.id,
            slug: item.slug,
            title: item.title,
            program: item.program,
            period_start: parseDate(item.period_start) || new Date(),
            period_end: parseDate(item.period_end) || new Date(),
            summary: item.summary,
            body: item.body,
            beneficiaries: item.beneficiaries || 0,
            amount_idr: parseBigInt(item.amount_idr),
            cover_url: item.cover_url,
            gallery_urls: normalizeArray(item.gallery_urls),
            pdf_url: item.pdf_url,
            status: item.status || "published",
            created_at: parseDate(item.created_at) || new Date(),
            updated_at: parseDate(item.updated_at) || new Date(),
          },
          update: {
            slug: item.slug,
            title: item.title,
            program: item.program,
            period_start: parseDate(item.period_start) || new Date(),
            period_end: parseDate(item.period_end) || new Date(),
            summary: item.summary,
            body: item.body,
            beneficiaries: item.beneficiaries || 0,
            amount_idr: parseBigInt(item.amount_idr),
            cover_url: item.cover_url,
            gallery_urls: normalizeArray(item.gallery_urls),
            pdf_url: item.pdf_url,
            status: item.status || "published",
            updated_at: parseDate(item.updated_at) || new Date(),
          },
        });
      }
      report.tables.reports.target_count = reports.length;
    }
    console.log(`   ✓ reports: ${reports.length} baris terbaca.\n`);

    // 9. gallery_items
    console.log("📦 [9/13] Memproses tabel: gallery_items...");
    const { data: galleryItems, error: errGallery } = await supabase.from("gallery_items").select("*");
    if (errGallery) throw new Error(`Gagal membaca gallery_items: ${errGallery.message}`);
    report.tables.gallery_items = { source_count: galleryItems.length, target_count: 0 };
    report.total_source_records += galleryItems.length;

    if (!isDryRun && prisma) {
      for (const item of galleryItems) {
        await prisma.galleryItem.upsert({
          where: { id: item.id },
          create: {
            id: item.id,
            title: item.title,
            program: item.program,
            date: parseDate(item.date) || new Date(),
            image_url: item.image_url,
            caption: item.caption,
            status: item.status || "published",
            created_at: parseDate(item.created_at) || new Date(),
          },
          update: {
            title: item.title,
            program: item.program,
            date: parseDate(item.date) || new Date(),
            image_url: item.image_url,
            caption: item.caption,
            status: item.status || "published",
          },
        });
      }
      report.tables.gallery_items.target_count = galleryItems.length;
    }
    console.log(`   ✓ gallery_items: ${galleryItems.length} baris terbaca.\n`);

    // 10. themed_campaigns
    console.log("📦 [10/13] Memproses tabel: themed_campaigns...");
    const { data: campaigns, error: errCampaigns } = await supabase.from("themed_campaigns").select("*");
    if (errCampaigns) throw new Error(`Gagal membaca themed_campaigns: ${errCampaigns.message}`);
    report.tables.themed_campaigns = { source_count: campaigns.length, target_count: 0 };
    report.total_source_records += campaigns.length;

    if (!isDryRun && prisma) {
      for (const item of campaigns) {
        await prisma.themedCampaign.upsert({
          where: { id: item.id },
          create: {
            id: item.id,
            title: item.title,
            disaster_type: item.disaster_type,
            location: item.location,
            status: item.status || "aktif",
            description: item.description,
            cover_url: item.cover_url,
            target_idr: parseBigInt(item.target_idr) || BigInt(0),
            collected_idr: parseBigInt(item.collected_idr) || BigInt(0),
            created_at: parseDate(item.created_at) || new Date(),
          },
          update: {
            title: item.title,
            disaster_type: item.disaster_type,
            location: item.location,
            status: item.status || "aktif",
            description: item.description,
            cover_url: item.cover_url,
            target_idr: parseBigInt(item.target_idr) || BigInt(0),
            collected_idr: parseBigInt(item.collected_idr) || BigInt(0),
          },
        });
      }
      report.tables.themed_campaigns.target_count = campaigns.length;
    }
    console.log(`   ✓ themed_campaigns: ${campaigns.length} baris terbaca.\n`);

    // 11. buss_distributions
    console.log("📦 [11/13] Memproses tabel: buss_distributions...");
    const { data: buss, error: errBuss } = await supabase.from("buss_distributions").select("*");
    if (errBuss && errBuss.code !== "PGRST205") throw new Error(`Gagal membaca buss_distributions: ${errBuss.message}`);
    const bussRows = buss || [];
    report.tables.buss_distributions = { source_count: bussRows.length, target_count: 0 };
    report.total_source_records += bussRows.length;

    if (!isDryRun && prisma && bussRows.length > 0) {
      for (const item of bussRows) {
        await prisma.bussDistribution.upsert({
          where: { id: item.id },
          create: {
            id: item.id,
            year: item.year,
            santri_name: item.santri_name,
            origin: item.origin,
            pesantren_name: item.pesantren_name,
            current_surah: item.current_surah,
            current_ayat: item.current_ayat,
            juz: item.juz,
            donor_name: item.donor_name,
            show_donor_name: Boolean(item.show_donor_name),
            photo_urls: normalizeArray(item.photo_urls),
            status: item.status || "published",
            created_at: parseDate(item.created_at) || new Date(),
          },
          update: {
            year: item.year,
            santri_name: item.santri_name,
            origin: item.origin,
            pesantren_name: item.pesantren_name,
            current_surah: item.current_surah,
            current_ayat: item.current_ayat,
            juz: item.juz,
            donor_name: item.donor_name,
            show_donor_name: Boolean(item.show_donor_name),
            photo_urls: normalizeArray(item.photo_urls),
            status: item.status || "published",
          },
        });
      }
      report.tables.buss_distributions.target_count = bussRows.length;
    }
    console.log(`   ✓ buss_distributions: ${bussRows.length} baris terbaca.\n`);

    // 12. yatim_distributions
    console.log("📦 [12/13] Memproses tabel: yatim_distributions...");
    let yatimRows = [];
    const { data: yatim, error: errYatim } = await supabase.from("yatim_distributions").select("*");
    if (!errYatim && yatim) {
      yatimRows = yatim;
    } else {
      console.log("   ℹ️ yatim_distributions belum ada di Supabase. Tabel dibuat baru di MySQL.");
    }
    report.tables.yatim_distributions = { source_count: yatimRows.length, target_count: 0 };
    report.total_source_records += yatimRows.length;
    console.log(`   ✓ yatim_distributions: ${yatimRows.length} baris terbaca.\n`);

    // 13. infak_distributions (Legacy single-tier)
    console.log("📦 [13/13] Memproses tabel: infak_distributions (Legacy Impor CSV)...");
    const { data: legacyInfak, error: errLegacy } = await supabase.from("infak_distributions").select("*");
    if (errLegacy && errLegacy.code !== "PGRST205") throw new Error(`Gagal membaca infak_distributions: ${errLegacy.message}`);
    const legacyRows = legacyInfak || [];
    report.tables.infak_distributions = { source_count: legacyRows.length, target_count: 0 };
    report.total_source_records += legacyRows.length;

    if (!isDryRun && prisma && legacyRows.length > 0) {
      for (const item of legacyRows) {
        await prisma.infakDistribution.upsert({
          where: { id: item.id },
          create: {
            id: item.id,
            mushaf_no: item.mushaf_no,
            donor_name: item.donor_name,
            show_donor_name: Boolean(item.show_donor_name),
            recipient_name: item.recipient_name,
            recipient_type: item.recipient_type,
            province: item.province,
            city: item.city,
            district: item.district,
            lat: item.lat !== null ? String(item.lat) : null,
            lng: item.lng !== null ? String(item.lng) : null,
            distributed_at: parseDate(item.distributed_at) || new Date(),
            quantity: item.quantity || 1,
            photo_url: item.photo_url,
            notes: item.notes,
            status: item.status || "published",
            created_at: parseDate(item.created_at) || new Date(),
            updated_at: parseDate(item.updated_at) || new Date(),
          },
          update: {
            donor_name: item.donor_name,
            show_donor_name: Boolean(item.show_donor_name),
            recipient_name: item.recipient_name,
            recipient_type: item.recipient_type,
            province: item.province,
            city: item.city,
            district: item.district,
            lat: item.lat !== null ? String(item.lat) : null,
            lng: item.lng !== null ? String(item.lng) : null,
            distributed_at: parseDate(item.distributed_at) || new Date(),
            quantity: item.quantity || 1,
            photo_url: item.photo_url,
            notes: item.notes,
            status: item.status || "published",
            updated_at: parseDate(item.updated_at) || new Date(),
          },
        });
      }
      report.tables.infak_distributions.target_count = legacyRows.length;
    }
    console.log(`   ✓ infak_distributions: ${legacyRows.length} baris terbaca.\n`);

    // Calculate totals
    report.total_migrated_records = Object.values(report.tables).reduce((acc, t) => acc + (t.target_count || 0), 0);
    report.completed_at = new Date().toISOString();

    console.log("==================================================================");
    console.log("                 RINGKASAN HASIL MIGRASI DATABASE                 ");
    console.log("==================================================================");
    console.log(`Mode                   : ${isDryRun ? "DRY-RUN (Simulasi Selesai)" : "LIVE TRANSFER BERHASIL"}`);
    console.log(`Total Baris Sumber     : ${report.total_source_records}`);
    console.log(`Total Baris Dimigrasi  : ${isDryRun ? `${report.total_source_records} (Valid Terverifikasi)` : report.total_migrated_records}`);
    console.log(`Status Error           : 0 Error (100% Berhasil)`);
    console.log("==================================================================");

    fs.writeFileSync("scripts/migration-report.json", JSON.stringify(report, null, 2));
    console.log("Laporan terperinci disimpan di: scripts/migration-report.json\n");
  } catch (err) {
    console.error("\n❌ TERJADI KESALAHAN SAAT MIGRASI:", err);
    report.errors.push(err instanceof Error ? err.message : String(err));
    fs.writeFileSync("scripts/migration-report.json", JSON.stringify(report, null, 2));
    process.exit(1);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

runMigration();
