import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// 1. Load environment variables from .env.local if not already in process.env
function loadEnv() {
  const envPath = path.join(rootDir, ".env.local");
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

// 2. Storage helper configuration
const uploadDir =
  process.env.UPLOAD_DIR?.trim() ||
  path.join(rootDir, "public", "uploads");

function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

ensureDirectory(uploadDir);

function isVercelBlobUrl(url) {
  if (typeof url !== "string") return false;
  const clean = url.trim().toLowerCase();
  return (
    clean.includes("blob.vercel-storage.com") ||
    clean.includes("vercel-storage.com")
  );
}

function extractFilenameFromBlobUrl(url) {
  try {
    const parsed = new URL(url);
    const basename = path.basename(parsed.pathname);
    const clean = basename.replace(/[^a-zA-Z0-9._-]/g, "");
    if (clean && clean.includes(".")) {
      return clean;
    }
  } catch {
    // Fallback
  }
  const hash = crypto.createHash("sha256").update(url).digest("hex").slice(0, 16);
  return `${hash}.webp`;
}

// Check if file exists locally in uploadDir or fallback locations
function fileExistsLocally(filename) {
  const candidateDirs = [
    uploadDir,
    path.join(rootDir, "public", "uploads"),
    path.join(rootDir, "uploads"),
  ];

  for (const d of candidateDirs) {
    if (fs.existsSync(path.join(d, filename))) {
      return true;
    }
  }
  return false;
}

// Download image buffer with retries
async function downloadBlobImage(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "SahabatAksara-BlobMigrator/1.0",
        },
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      const arrayBuffer = await res.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (err) {
      if (attempt === retries) {
        console.warn(`[Gagal Unduh] ${url} (Percobaan ${attempt}/${retries}):`, err.message);
        return null;
      }
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
  return null;
}

async function main() {
  console.log("==================================================================");
  console.log("  MIGRASI PENYIMPANAN GAMBAR: VERCEL BLOB -> DISK LOKAL HOSTINGER");
  console.log("==================================================================");
  console.log(`Mode Operasi       : ${isDryRun ? "DRY-RUN (Simulasi Tanpa Mengubah Data)" : "LIVE MIGRATION"}`);
  console.log(`Direktori Target   : ${uploadDir}`);
  console.log("------------------------------------------------------------------\n");

  const stats = {
    foundUrls: 0,
    downloaded: 0,
    skippedAlreadyLocal: 0,
    failedDownloads: [],
    updatedDbRecords: 0,
    updatedJsonRecords: 0,
  };

  const blobUrlSet = new Set();

  // Initialize Prisma dynamically if DATABASE_URL is configured
  let prisma = null;
  let isPrismaActive = false;

  if (process.env.DATABASE_URL) {
    try {
      const { PrismaClient } = await import("@prisma/client");
      prisma = new PrismaClient();
      await prisma.$connect();
      isPrismaActive = true;
      console.log("✓ Berhasil terhubung ke database MySQL/Prisma.\n");
    } catch (err) {
      console.warn("⚠️ Tidak dapat terhubung ke MySQL. Script akan memindai data lokal / JSON.\n", err.message);
      prisma = null;
      isPrismaActive = false;
    }
  } else {
    console.log("ℹ DATABASE_URL belum terpasang di environment. Memindai data lokal/JSON.\n");
  }

  // 1. Database Backup Before Changes
  const backupDir = path.join(rootDir, "backups");
  ensureDirectory(backupDir);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFilePath = path.join(backupDir, `db-image-backup-${timestamp}.json`);

  const dbSnapshot = {};

  if (isPrismaActive && prisma) {
    console.log("1. Membuat snapshot backup data database sebelum migrasi...");
    try {
      const [
        infakPhotos,
        geber,
        buss,
        yatim,
        reports,
        gallery,
        campaigns,
        infakDist,
        ledger,
      ] = await Promise.all([
        prisma.infakJinanPhoto.findMany(),
        prisma.geberMasjidDistribution.findMany(),
        prisma.bussDistribution.findMany(),
        prisma.yatimDistribution.findMany(),
        prisma.report.findMany(),
        prisma.galleryItem.findMany(),
        prisma.themedCampaign.findMany(),
        prisma.infakDistribution.findMany(),
        prisma.uploadLedger.findMany(),
      ]);

      dbSnapshot.infakJinanPhoto = infakPhotos;
      dbSnapshot.geberMasjidDistribution = geber;
      dbSnapshot.bussDistribution = buss;
      dbSnapshot.yatimDistribution = yatim;
      dbSnapshot.report = reports;
      dbSnapshot.galleryItem = gallery;
      dbSnapshot.themedCampaign = campaigns;
      dbSnapshot.infakDistribution = infakDist;
      dbSnapshot.uploadLedger = ledger;

      fs.writeFileSync(backupFilePath, JSON.stringify(dbSnapshot, null, 2), "utf8");
      console.log(`✓ Backup database berhasil disimpan di: ${backupFilePath}\n`);

      // Collect all Blob URLs from DB
      infakPhotos.forEach((r) => isVercelBlobUrl(r.url) && blobUrlSet.add(r.url));
      geber.forEach((r) => {
        if (Array.isArray(r.photo_urls)) {
          r.photo_urls.forEach((u) => isVercelBlobUrl(u) && blobUrlSet.add(u));
        }
      });
      buss.forEach((r) => {
        if (Array.isArray(r.photo_urls)) {
          r.photo_urls.forEach((u) => isVercelBlobUrl(u) && blobUrlSet.add(u));
        }
      });
      yatim.forEach((r) => {
        if (Array.isArray(r.photo_urls)) {
          r.photo_urls.forEach((u) => isVercelBlobUrl(u) && blobUrlSet.add(u));
        }
        if (Array.isArray(r.documentation_urls)) {
          r.documentation_urls.forEach((u) => isVercelBlobUrl(u) && blobUrlSet.add(u));
        }
      });
      reports.forEach((r) => {
        if (isVercelBlobUrl(r.cover_url)) blobUrlSet.add(r.cover_url);
        if (Array.isArray(r.gallery_urls)) {
          r.gallery_urls.forEach((u) => isVercelBlobUrl(u) && blobUrlSet.add(u));
        }
      });
      gallery.forEach((r) => isVercelBlobUrl(r.image_url) && blobUrlSet.add(r.image_url));
      campaigns.forEach((r) => isVercelBlobUrl(r.cover_url) && blobUrlSet.add(r.cover_url));
      infakDist.forEach((r) => isVercelBlobUrl(r.photo_url) && blobUrlSet.add(r.photo_url));
      ledger.forEach((r) => isVercelBlobUrl(r.url) && blobUrlSet.add(r.url));
    } catch (err) {
      console.error("Gagal membaca atau membackup data Prisma:", err);
    }
  }

  // 2. Scan Local JSON Data Files as well
  const jsonFiles = [
    path.join(rootDir, "data", "reports.json"),
    path.join(rootDir, "data", "gallery-items.json"),
    path.join(rootDir, "data", "themed-campaigns.json"),
    path.join(rootDir, "scripts", "supabase-audit-dump.json"),
  ];

  for (const jf of jsonFiles) {
    if (fs.existsSync(jf)) {
      try {
        const content = fs.readFileSync(jf, "utf8");
        const matches = content.match(/https:\/\/[^"\s]*public\.blob\.vercel-storage\.com\/[^"\s]+/g);
        if (matches) {
          matches.forEach((u) => blobUrlSet.add(u));
        }
      } catch {
        // ignore
      }
    }
  }

  stats.foundUrls = blobUrlSet.size;
  console.log(`2. Ditemukan ${stats.foundUrls} URL gambar Vercel Blob unik untuk dimigrasikan.`);

  if (stats.foundUrls === 0) {
    console.log("✓ Tidak ditemukan URL Vercel Blob yang membutuhkan migrasi (semua gambar sudah lokal atau kosong).");
    if (prisma) await prisma.$disconnect();
    return;
  }

  // 3. Download Blob Images to UPLOAD_DIR
  console.log("\n3. Mengunduh berkas gambar dari Vercel Blob ke direktori permanen...");
  const urlMap = new Map(); // oldBlobUrl -> newLocalUrl (/uploads/<filename>)

  for (const blobUrl of Array.from(blobUrlSet)) {
    const filename = extractFilenameFromBlobUrl(blobUrl);
    const localUrl = `/uploads/${filename}`;
    const destinationPath = path.join(uploadDir, filename);

    if (fileExistsLocally(filename)) {
      stats.skippedAlreadyLocal++;
      urlMap.set(blobUrl, localUrl);
      console.log(`  [Dilewati/Sudah Ada] ${filename}`);
      continue;
    }

    if (isDryRun) {
      stats.downloaded++;
      urlMap.set(blobUrl, localUrl);
      console.log(`  [Simulasi Download] ${blobUrl} -> ${localUrl}`);
      continue;
    }

    console.log(`  [Mengunduh] ${blobUrl}...`);
    const buffer = await downloadBlobImage(blobUrl);

    if (buffer) {
      try {
        fs.writeFileSync(destinationPath, buffer);

        // Also sync to public/uploads if different for dev convenience
        const fallbackPublic = path.join(rootDir, "public", "uploads", filename);
        if (path.resolve(destinationPath) !== path.resolve(fallbackPublic)) {
          try {
            ensureDirectory(path.dirname(fallbackPublic));
            fs.writeFileSync(fallbackPublic, buffer);
          } catch {
            // ignore
          }
        }

        stats.downloaded++;
        urlMap.set(blobUrl, localUrl);
        console.log(`  ✓ Tersimpan ke ${destinationPath}`);
      } catch (writeErr) {
        stats.failedDownloads.push({
          url: blobUrl,
          error: `Gagal menulis berkas ke disk: ${writeErr.message}`,
        });
      }
    } else {
      stats.failedDownloads.push({
        url: blobUrl,
        error: "Gagal mengunduh berkas dari CDN Vercel Blob",
      });
    }
  }

  // 4. Update Database Records
  if (isPrismaActive && prisma && !isDryRun && urlMap.size > 0) {
    console.log("\n4. Memperbarui URL di database MySQL...");

    const photos = await prisma.infakJinanPhoto.findMany();
    for (const p of photos) {
      if (urlMap.has(p.url)) {
        await prisma.infakJinanPhoto.update({
          where: { id: p.id },
          data: { url: urlMap.get(p.url) },
        });
        stats.updatedDbRecords++;
      }
    }

    const gebers = await prisma.geberMasjidDistribution.findMany();
    for (const g of gebers) {
      if (Array.isArray(g.photo_urls)) {
        let changed = false;
        const newUrls = g.photo_urls.map((u) => {
          if (urlMap.has(u)) {
            changed = true;
            return urlMap.get(u);
          }
          return u;
        });
        if (changed) {
          await prisma.geberMasjidDistribution.update({
            where: { id: g.id },
            data: { photo_urls: newUrls },
          });
          stats.updatedDbRecords++;
        }
      }
    }

    const busses = await prisma.bussDistribution.findMany();
    for (const b of busses) {
      if (Array.isArray(b.photo_urls)) {
        let changed = false;
        const newUrls = b.photo_urls.map((u) => {
          if (urlMap.has(u)) {
            changed = true;
            return urlMap.get(u);
          }
          return u;
        });
        if (changed) {
          await prisma.bussDistribution.update({
            where: { id: b.id },
            data: { photo_urls: newUrls },
          });
          stats.updatedDbRecords++;
        }
      }
    }

    const yatims = await prisma.yatimDistribution.findMany();
    for (const y of yatims) {
      let changed = false;
      let newPhotos = y.photo_urls;
      let newDocs = y.documentation_urls;

      if (Array.isArray(y.photo_urls)) {
        newPhotos = y.photo_urls.map((u) => {
          if (urlMap.has(u)) {
            changed = true;
            return urlMap.get(u);
          }
          return u;
        });
      }

      if (Array.isArray(y.documentation_urls)) {
        newDocs = y.documentation_urls.map((u) => {
          if (urlMap.has(u)) {
            changed = true;
            return urlMap.get(u);
          }
          return u;
        });
      }

      if (changed) {
        await prisma.yatimDistribution.update({
          where: { id: y.id },
          data: { photo_urls: newPhotos, documentation_urls: newDocs },
        });
        stats.updatedDbRecords++;
      }
    }

    const reps = await prisma.report.findMany();
    for (const r of reps) {
      let changed = false;
      let newCover = r.cover_url;
      let newGallery = r.gallery_urls;

      if (r.cover_url && urlMap.has(r.cover_url)) {
        newCover = urlMap.get(r.cover_url);
        changed = true;
      }

      if (Array.isArray(r.gallery_urls)) {
        newGallery = r.gallery_urls.map((u) => {
          if (urlMap.has(u)) {
            changed = true;
            return urlMap.get(u);
          }
          return u;
        });
      }

      if (changed) {
        await prisma.report.update({
          where: { id: r.id },
          data: { cover_url: newCover, gallery_urls: newGallery },
        });
        stats.updatedDbRecords++;
      }
    }

    const gals = await prisma.galleryItem.findMany();
    for (const g of gals) {
      if (urlMap.has(g.image_url)) {
        await prisma.galleryItem.update({
          where: { id: g.id },
          data: { image_url: urlMap.get(g.image_url) },
        });
        stats.updatedDbRecords++;
      }
    }

    const camps = await prisma.themedCampaign.findMany();
    for (const c of camps) {
      if (c.cover_url && urlMap.has(c.cover_url)) {
        await prisma.themedCampaign.update({
          where: { id: c.id },
          data: { cover_url: urlMap.get(c.cover_url) },
        });
        stats.updatedDbRecords++;
      }
    }

    const infaks = await prisma.infakDistribution.findMany();
    for (const i of infaks) {
      if (i.photo_url && urlMap.has(i.photo_url)) {
        await prisma.infakDistribution.update({
          where: { id: i.id },
          data: { photo_url: urlMap.get(i.photo_url) },
        });
        stats.updatedDbRecords++;
      }
    }

    const ledgers = await prisma.uploadLedger.findMany();
    for (const l of ledgers) {
      if (urlMap.has(l.url)) {
        try {
          await prisma.uploadLedger.update({
            where: { id: l.id },
            data: { url: urlMap.get(l.url) },
          });
          stats.updatedDbRecords++;
        } catch {
          // unique url conflict ignore
        }
      }
    }
  }

  // 5. Update local JSON data files
  if (!isDryRun && urlMap.size > 0) {
    const dataDir = path.join(rootDir, "data");
    const jsonTargets = ["reports.json", "gallery-items.json", "themed-campaigns.json"];

    for (const target of jsonTargets) {
      const p = path.join(dataDir, target);
      if (fs.existsSync(p)) {
        try {
          let str = fs.readFileSync(p, "utf8");
          let modified = false;

          for (const [oldUrl, newUrl] of urlMap.entries()) {
            if (str.includes(oldUrl)) {
              str = str.split(oldUrl).join(newUrl);
              modified = true;
            }
          }

          if (modified) {
            fs.writeFileSync(p, str, "utf8");
            stats.updatedJsonRecords++;
            console.log(`✓ Data lokal ${target} berhasil diperbarui.`);
          }
        } catch (err) {
          console.warn(`Gagal memperbarui ${target}:`, err);
        }
      }
    }
  }

  // 6. Summary Report
  console.log("\n==================================================================");
  console.log("  LAPORAN HASIL MIGRASI GAMBAR");
  console.log("==================================================================");
  console.log(`Total URL Blob Ditemukan      : ${stats.foundUrls}`);
  console.log(`Berhasil Diunduh              : ${stats.downloaded}`);
  console.log(`Dilewati (Sudah Ada di Lokal) : ${stats.skippedAlreadyLocal}`);
  console.log(`Gagal Diunduh                 : ${stats.failedDownloads.length}`);
  console.log(`Record Database Diperbarui    : ${stats.updatedDbRecords}`);
  console.log(`File JSON Lokal Diperbarui    : ${stats.updatedJsonRecords}`);
  console.log("------------------------------------------------------------------");

  if (stats.failedDownloads.length > 0) {
    console.log("\n⚠️ DAFTAR URL GAGAL DIUNDUH:");
    stats.failedDownloads.forEach((f, idx) => {
      console.log(`  ${idx + 1}. ${f.url} -> Error: ${f.error}`);
    });
    console.log("Catatan: URL yang gagal diunduh TIDAK dihapus dari database agar data tetap aman.");
  } else {
    console.log("\n🎉 SELURUH GAMBAR BERHASIL DIMIGRASIKAN KE PENYIMPANAN LOKAL SERVER!");
  }

  const reportPath = path.join(backupDir, `migration-report-${timestamp}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(stats, null, 2), "utf8");
  console.log(`Laporan lengkap tersimpan di: ${reportPath}`);

  if (prisma) {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("Fatal migration error:", e);
  process.exit(1);
});
