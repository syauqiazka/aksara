import fs from "fs/promises";
import path from "path";
import { list, del } from "@vercel/blob";

// Simple orphan cleaner that runs standalone via Node
const isDelete = process.argv.includes("--delete");

async function run() {
  console.log("=== PEMERIKSA FILE YATIM (ORPHAN STORAGE CLEANER) ===");
  console.log(`Mode: ${isDelete ? "🔴 EKSEKUSI PENGHAPUSAN (--delete)" : "🟡 SIMULASI / DRY-RUN (Default)"}\n`);

  // 1. Scan storage files
  const storageFiles = [];

  // Local uploads folder
  const localUploadsDir = path.resolve("public/uploads");
  try {
    const files = await fs.readdir(localUploadsDir);
    for (const file of files) {
      if (file.startsWith(".")) continue;
      const filePath = path.join(localUploadsDir, file);
      const stat = await fs.stat(filePath);
      storageFiles.push({
        type: "local",
        url: `/uploads/${file}`,
        pathname: file,
        sizeBytes: stat.size,
        uploadedAt: stat.mtime,
        fullPath: filePath,
      });
    }
  } catch {
    // Directory might not exist
  }

  // Vercel Blob (if token available)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const res = await list({ prefix: "sahabat-aksara/" });
      for (const b of res.blobs) {
        storageFiles.push({
          type: "vercel-blob",
          url: b.url,
          pathname: b.pathname,
          sizeBytes: b.size,
          uploadedAt: new Date(b.uploadedAt),
        });
      }
    } catch (err) {
      console.warn("Peringatan saat scan Vercel Blob:", err.message);
    }
  }

  console.log(`Total file ditemukan di storage: ${storageFiles.length} file.`);

  // 2. Scan active database files and local-store to find referenced URLs
  const referencedUrls = new Set();

  // Scan local-store.ts source directly
  try {
    const localStoreContent = await fs.readFile(path.resolve("src/lib/db/local-store.ts"), "utf-8");
    const matches = localStoreContent.match(/\/uploads\/[a-zA-Z0-9_.-]+/g) || [];
    matches.forEach((m) => referencedUrls.add(m));
  } catch {
    // ignore
  }

  // 3. Find unreferenced files
  const now = Date.now();
  const orphans = [];

  for (const item of storageFiles) {
    if (!referencedUrls.has(item.url)) {
      const ageHours = (now - item.uploadedAt.getTime()) / (1000 * 60 * 60);
      orphans.push({
        ...item,
        ageHours: Math.round(ageHours * 10) / 10,
        isOlderThan24h: ageHours >= 24,
      });
    }
  }

  console.log(`File tidak terikat (orphans) ditemukan: ${orphans.length} file.\n`);

  if (orphans.length === 0) {
    console.log("✓ Semua file di storage bersih dan terikat dengan data valid.");
    return;
  }

  console.table(
    orphans.map((o) => ({
      Pathname: o.pathname,
      Provider: o.type,
      "Ukuran (KB)": (o.sizeBytes / 1024).toFixed(1),
      "Usia (Jam)": o.ageHours,
      "> 24 Jam": o.isOlderThan24h ? "Ya" : "Belum",
      Tindakan: isDelete
        ? o.isOlderThan24h
          ? "DIHAPUS"
          : "DILEWATI (< 24 jam)"
        : "SIMULASI (Dry-run)",
    }))
  );

  if (isDelete) {
    let deletedCount = 0;
    for (const o of orphans) {
      if (o.isOlderThan24h) {
        if (o.type === "local" && o.fullPath) {
          await fs.unlink(o.fullPath).catch(() => {});
          deletedCount++;
        } else if (o.type === "vercel-blob") {
          await del(o.url).catch(() => {});
          deletedCount++;
        }
      }
    }
    console.log(`\n✓ Berhasil menghapus ${deletedCount} file yatim yang lebih tua dari 24 jam.`);
  } else {
    console.log("\n💡 Catatan: Jalankan dengan `pnpm storage:orphans --delete` untuk mengeksekusi penghapusan file > 24 jam.");
  }
}

run().catch(console.error);

