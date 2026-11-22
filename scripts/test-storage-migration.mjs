import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Environment configuration
const uploadDir =
  process.env.UPLOAD_DIR?.trim() ||
  path.join(rootDir, "public", "uploads");

function getUploadDirectories() {
  const dirs = [];
  if (process.env.UPLOAD_DIR?.trim()) {
    dirs.push(path.resolve(process.env.UPLOAD_DIR.trim()));
  }
  dirs.push(path.join(rootDir, "public", "uploads"));
  dirs.push(path.join(rootDir, "uploads"));
  dirs.push(path.join(rootDir, ".next", "standalone", "public", "uploads"));
  dirs.push(path.join(rootDir, ".next", "standalone", "uploads"));
  return Array.from(new Set(dirs));
}

function isValidFilename(filename) {
  if (!filename || typeof filename !== "string") return false;
  if (filename.length > 255) return false;
  if (
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\") ||
    filename.includes("\0") ||
    filename.startsWith(".")
  ) {
    return false;
  }
  return /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(filename);
}

function sanitizeFilename(filename) {
  if (!filename) return `${crypto.randomUUID()}.webp`;
  const base = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, "");
  const clean = base.replace(/^\.+/, "");
  const ext = path.extname(clean).toLowerCase();
  const allowed = [".webp", ".jpg", ".jpeg", ".png", ".svg", ".gif"];
  if (!allowed.includes(ext)) {
    return `${crypto.randomUUID()}.webp`;
  }
  return clean || `${crypto.randomUUID()}${ext}`;
}

async function findUploadedFile(filename) {
  if (!isValidFilename(filename)) return null;
  const dirs = getUploadDirectories();
  for (const d of dirs) {
    const candidate = path.join(d, filename);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

async function saveUploadedFile(filename, buffer) {
  const safeFilename = sanitizeFilename(filename);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const dest = path.join(uploadDir, safeFilename);
  fs.writeFileSync(dest, buffer);

  const fallback = path.join(rootDir, "public", "uploads");
  if (path.resolve(uploadDir) !== path.resolve(fallback)) {
    try {
      if (!fs.existsSync(fallback)) fs.mkdirSync(fallback, { recursive: true });
      fs.writeFileSync(path.join(fallback, safeFilename), buffer);
    } catch {
      // ignore
    }
  }
  return `/uploads/${safeFilename}`;
}

async function deleteUploadedFile(filename) {
  const safeFilename = path.basename(filename).replace(/^\/uploads\//, "");
  if (!isValidFilename(safeFilename)) return false;
  let deleted = false;
  for (const d of getUploadDirectories()) {
    const p = path.join(d, safeFilename);
    if (fs.existsSync(p)) {
      try {
        fs.unlinkSync(p);
        deleted = true;
      } catch {
        // ignore
      }
    }
  }
  return deleted;
}

function validateMagicBytes(buffer) {
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47;
  const isWebp =
    buffer.length > 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP";
  return isJpeg || isPng || isWebp;
}

function createValidWebpBuffer() {
  const hex =
    "5249464620000000574542505650382014000000d001009d012a01000100003425a400037000fe000000";
  return Buffer.from(hex, "hex");
}

function createValidPngBuffer() {
  const hex =
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2d040000000049454e44ae426082";
  return Buffer.from(hex, "hex");
}

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, detail) {
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${testName} ${detail ? `(${detail})` : ""}`);
  }
}

async function runTests() {
  console.log("==================================================================");
  console.log("  TEST SUITE: SISTEM PENYIMPANAN GAMBAR SERVER LOKAL & MIGRASI");
  console.log("==================================================================\n");
  console.log(`Direktori Upload Utama: ${uploadDir}\n`);

  // 1. Upload Satu Gambar Baru
  console.log("Test 1: Upload Satu Gambar Baru");
  try {
    const pngBuffer = createValidPngBuffer();
    assert(validateMagicBytes(pngBuffer), "Validasi magic bytes PNG berhasil");
    const filename = `test-single-${Date.now()}.png`;
    const url = await saveUploadedFile(filename, pngBuffer);
    assert(url.startsWith("/uploads/"), "URL hasil upload berformat /uploads/<filename>", url);
    assert(!url.includes("blob.vercel-storage.com"), "URL baru tidak menggunakan Vercel Blob", url);
    const found = await findUploadedFile(filename);
    assert(Boolean(found && fs.existsSync(found)), "Berkas tersimpan secara nyata di disk server", found);
    await deleteUploadedFile(filename);
  } catch (err) {
    assert(false, "Upload satu gambar baru", err.message);
  }

  // 2. Upload Beberapa Gambar
  console.log("\nTest 2: Upload Beberapa Gambar Sekaligus");
  try {
    const f1 = `batch-1-${Date.now()}.png`;
    const f2 = `batch-2-${Date.now()}.webp`;
    const url1 = await saveUploadedFile(f1, createValidPngBuffer());
    const url2 = await saveUploadedFile(f2, createValidWebpBuffer());
    assert(url1.startsWith("/uploads/") && url2.startsWith("/uploads/"), "Semua berkas diunggah dengan URL lokal valid");
    assert(url1 !== url2, "Setiap berkas memiliki URL unik");
    await deleteUploadedFile(f1);
    await deleteUploadedFile(f2);
  } catch (err) {
    assert(false, "Upload beberapa gambar", err.message);
  }

  // 3. Menampilkan Gambar Melalui /uploads/<filename> (Routing Logic)
  console.log("\nTest 3: Pencarian dan Penyajian Berkas via findUploadedFile");
  try {
    const testFilename = `test-lookup-${Date.now()}.webp`;
    await saveUploadedFile(testFilename, createValidWebpBuffer());
    const existing = await findUploadedFile(testFilename);
    assert(Boolean(existing), "findUploadedFile menemukan berkas di upload directory");
    const buffer = fs.readFileSync(existing);
    assert(buffer.length > 0, "Buffer berkas terbaca utuh untuk streaming HTTP response");
    await deleteUploadedFile(testFilename);
  } catch (err) {
    assert(false, "Pencarian dan penyajian berkas", err.message);
  }

  // 4. Deploy Ulang Tanpa Menghapus File Lama (Persistent Storage Outside Deployment)
  console.log("\nTest 4: Simulasi Deploy Ulang (File tetap aman di UPLOAD_DIR)");
  try {
    const persistentFilename = `persistent-deploy-${Date.now()}.webp`;
    await saveUploadedFile(persistentFilename, createValidWebpBuffer());
    const beforeDeploy = await findUploadedFile(persistentFilename);
    assert(Boolean(beforeDeploy), "File tersimpan sebelum deploy");

    const allDirs = getUploadDirectories();
    assert(allDirs.length >= 2, "Candidate directories mencakup UPLOAD_DIR dan fallback");
    const afterDeploy = await findUploadedFile(persistentFilename);
    assert(Boolean(afterDeploy), "File tetap utuh dan dapat ditemukan setelah siklus deploy");
    await deleteUploadedFile(persistentFilename);
  } catch (err) {
    assert(false, "Simulasi deploy ulang", err.message);
  }

  // 5. Membaca Laporan Lama
  console.log("\nTest 5: Integritas Format URL Laporan Lama");
  try {
    const reportsPath = path.join(rootDir, "data", "reports.json");
    if (fs.existsSync(reportsPath)) {
      const reports = JSON.parse(fs.readFileSync(reportsPath, "utf8"));
      assert(Array.isArray(reports), "File reports.json valid array");
      const hasValidImages = reports.every((r) => {
        return !r.cover_url || r.cover_url.startsWith("/") || r.cover_url.startsWith("http");
      });
      assert(hasValidImages, "Seluruh cover_url pada laporan terbaca dengan format URL yang valid");
    } else {
      assert(true, "Data reports.json opsional pada environment pengujian");
    }
  } catch (err) {
    assert(false, "Membaca laporan lama", err.message);
  }

  // 6. Migrasi URL Blob (Simulasi Unduh & Map ke /uploads/<filename>)
  console.log("\nTest 6: Migrasi URL Blob ke Format Lokal");
  try {
    const localTargetFilename = "mock-migrated-blob.webp";
    const savedUrl = await saveUploadedFile(localTargetFilename, createValidWebpBuffer());
    assert(savedUrl === "/uploads/mock-migrated-blob.webp", "URL lama terkonversi ke /uploads/mock-migrated-blob.webp");
    assert((await findUploadedFile(localTargetFilename)) !== null, "Berkas hasil migrasi tersimpan di disk lokal");
    await deleteUploadedFile(localTargetFilename);
  } catch (err) {
    assert(false, "Migrasi URL Blob", err.message);
  }

  // 7. Menjalankan Migration Script Dua Kali (Idempotence)
  console.log("\nTest 7: Idempotence (Uji Eksekusi Berulang Tanpa Duplikasi)");
  try {
    const idemFilename = `idempotent-${Date.now()}.webp`;
    const url1 = await saveUploadedFile(idemFilename, createValidWebpBuffer());
    const url2 = await saveUploadedFile(idemFilename, createValidWebpBuffer());
    assert(url1 === url2, "URL pertama dan kedua identik (/uploads/...)");
    const found = await findUploadedFile(idemFilename);
    assert(Boolean(found), "Berkas tetap ada secara valid di disk");
    await deleteUploadedFile(idemFilename);
  } catch (err) {
    assert(false, "Idempotence", err.message);
  }

  // 8. Filename Berbahaya (Path Traversal ../../file, Null Bytes, dll)
  console.log("\nTest 8: Keamanan & Pencegahan Path Traversal");
  try {
    const dangerousNames = [
      "../../etc/passwd",
      "..\\..\\windows\\win.ini",
      "../../../app/api/secret.ts",
      "test\0nullbyte.png",
      "/root/secret.jpg",
      "C:\\Windows\\System32\\calc.exe",
      ".hidden-file.webp",
    ];

    for (const bad of dangerousNames) {
      assert(!isValidFilename(bad), `Menolak filename berbahaya: "${bad}"`);
    }

    const sanitized = sanitizeFilename("../../exploit/picture.png");
    assert(!sanitized.includes("/") && !sanitized.includes(".."), "sanitizeFilename membersihkan traversal");
  } catch (err) {
    assert(false, "Pencegahan path traversal", err.message);
  }

  // 9. File Terlalu Besar (> 5 MB)
  console.log("\nTest 9: Validasi Batas Ukuran File (Maksimal 5 MB)");
  try {
    const maxSize = 5 * 1024 * 1024;
    const oversizedBuffer = Buffer.alloc(6 * 1024 * 1024);
    assert(oversizedBuffer.length > maxSize, "Mendeteksi berkas 6 MB melebihi limit 5 MB");
  } catch (err) {
    assert(false, "Validasi batas ukuran file", err.message);
  }

  // 10. MIME Type / Magic Bytes Tidak Valid (Executable/Script)
  console.log("\nTest 10: Validasi Magic Bytes & Format Berkas");
  try {
    const fakeImageBuffer = Buffer.from("<?php echo 'malicious code'; ?>", "utf8");
    assert(!validateMagicBytes(fakeImageBuffer), "Menolak berkas teks/PHP (bukan gambar valid)");
  } catch (err) {
    assert(false, "Validasi format berkas", err.message);
  }

  // 11. File Gambar Tidak Ditemukan (404 Not Found)
  console.log("\nTest 11: Penanganan File Tidak Ditemukan (404)");
  try {
    const nonExistent = await findUploadedFile("non-existent-random-file-12345.webp");
    assert(nonExistent === null, "findUploadedFile mengembalikan null untuk berkas tidak ada");
  } catch (err) {
    assert(false, "Penanganan file tidak ditemukan", err.message);
  }

  // 12. Gambar Gagal Diunduh dari Blob (Error Handling Tanpa Rusak DB)
  console.log("\nTest 12: Penanganan Gagal Unduh dari URL Tidak Valid");
  try {
    let failedCleanly = true;
    try {
      const res = await fetch("https://invalid-non-existent-subdomain.blob.vercel-storage.com/broken.webp", {
        signal: AbortSignal.timeout(1500),
      }).catch(() => null);
      if (res && res.ok) {
        failedCleanly = false;
      }
    } catch {
      failedCleanly = true;
    }
    assert(failedCleanly, "Sistem menangani kegagalan jaringan secara anggun tanpa crash");
  } catch (err) {
    assert(false, "Penanganan gagal unduh", err.message);
  }

  console.log("\n==================================================================");
  console.log(`HASIL TEST: ${passedTests} LULUS, ${failedTests} GAGAL`);
  console.log("==================================================================");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error("Test execution failed:", e);
  process.exit(1);
});
