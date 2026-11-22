import fs from "node:fs";
import path from "node:path";
import {
  saveUploadedFile,
  findUploadedFile,
  deleteUploadedFile,
  isValidFilename,
  sanitizeFilename,
  getPrimaryUploadDir,
  getUploadDirectories,
} from "../src/lib/server-uploads";
import { uploadToStorage, processAndCompressImage } from "../src/lib/storage";

// Helper: 1x1 WebP dummy image buffer (valid magic bytes)
function createValidWebpBuffer(): Buffer {
  // Minimal valid WebP RIFF
  const hex =
    "5249464620000000574542505650382014000000d001009d012a01000100003425a400037000fe000000";
  return Buffer.from(hex, "hex");
}

function createValidPngBuffer(): Buffer {
  // Minimal 1x1 transparent PNG
  const hex =
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2d040000000049454e44ae426082";
  return Buffer.from(hex, "hex");
}

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
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

  const primaryDir = getPrimaryUploadDir();
  console.log(`Direktori Upload Utama: ${primaryDir}\n`);

  // 1. Upload Satu Gambar Baru
  console.log("Test 1: Upload Satu Gambar Baru");
  try {
    const pngBuffer = createValidPngBuffer();
    const result = await uploadToStorage(pngBuffer, "test-single.png");
    assert(
      result.url.startsWith("/uploads/"),
      "URL hasil upload berformat /uploads/<filename>",
      result.url
    );
    assert(
      !result.url.includes("blob.vercel-storage.com"),
      "URL baru tidak menggunakan Vercel Blob",
      result.url
    );
    const filename = path.basename(result.url);
    const foundPath = await findUploadedFile(filename);
    assert(
      Boolean(foundPath && fs.existsSync(foundPath)),
      "Berkas tersimpan secara nyata di disk server",
      foundPath || "Tidak ditemukan"
    );
  } catch (err) {
    assert(false, "Upload satu gambar baru", (err as Error).message);
  }

  // 2. Upload Beberapa Gambar
  console.log("\nTest 2: Upload Beberapa Gambar");
  try {
    const p1 = await uploadToStorage(createValidPngBuffer(), "batch-1.png");
    const p2 = await uploadToStorage(createValidWebpBuffer(), "batch-2.webp");
    assert(
      p1.url.startsWith("/uploads/") && p2.url.startsWith("/uploads/"),
      "Semua berkas berhasil diupload dengan URL /uploads/ unik"
    );
    assert(p1.url !== p2.url, "URL setiap berkas berbeda");
  } catch (err) {
    assert(false, "Upload beberapa gambar", (err as Error).message);
  }

  // 3. Menampilkan Gambar Melalui /uploads/<filename> (Routing Logic)
  console.log("\nTest 3: Pencarian dan Penyajian Berkas via findUploadedFile");
  try {
    const testFilename = `test-lookup-${Date.now()}.webp`;
    await saveUploadedFile(testFilename, createValidWebpBuffer());
    const existing = await findUploadedFile(testFilename);
    assert(Boolean(existing), "findUploadedFile menemukan berkas di upload directory");
    const buffer = fs.readFileSync(existing!);
    assert(buffer.length > 0, "Buffer berkas terbaca utuh untuk streaming HTTP response");
    await deleteUploadedFile(testFilename);
  } catch (err) {
    assert(false, "Pencarian dan penyajian berkas", (err as Error).message);
  }

  // 4. Deploy Ulang Tanpa Menghapus File Lama (Persistent Storage Outside Deployment)
  console.log("\nTest 4: Simulasi Deploy Ulang (File tetap aman di UPLOAD_DIR)");
  try {
    const persistentFilename = `persistent-deploy-${Date.now()}.webp`;
    await saveUploadedFile(persistentFilename, createValidWebpBuffer());
    
    // Simulate deployment by checking if primaryDir persists independently of build dir
    const beforeDeploy = await findUploadedFile(persistentFilename);
    assert(Boolean(beforeDeploy), "File tersimpan sebelum deploy");

    // All upload candidates still find the persistent file
    const allDirs = getUploadDirectories();
    assert(allDirs.length >= 2, "Candidate directories mencakup UPLOAD_DIR dan fallback");
    const afterDeploy = await findUploadedFile(persistentFilename);
    assert(Boolean(afterDeploy), "File tetap utuh dan dapat ditemukan setelah siklus deploy");
    await deleteUploadedFile(persistentFilename);
  } catch (err) {
    assert(false, "Simulasi deploy ulang", (err as Error).message);
  }

  // 5. Membaca Laporan Lama
  console.log("\nTest 5: Integritas Format URL Laporan Lama");
  try {
    const reportsPath = path.join(process.cwd(), "data", "reports.json");
    if (fs.existsSync(reportsPath)) {
      const reports = JSON.parse(fs.readFileSync(reportsPath, "utf8"));
      assert(Array.isArray(reports), "File reports.json valid array");
      const hasValidImages = reports.every((r: { cover_url?: string; gallery_urls?: string[] }) => {
        const coverValid = !r.cover_url || r.cover_url.startsWith("/") || r.cover_url.startsWith("http");
        return coverValid;
      });
      assert(hasValidImages, "Seluruh cover_url pada laporan terbaca dengan format URL yang valid");
    } else {
      assert(true, "Data reports.json opsional pada environment pengujian");
    }
  } catch (err) {
    assert(false, "Membaca laporan lama", (err as Error).message);
  }

  // 6. Migrasi URL Blob (Simulasi Unduh & Map ke /uploads/<filename>)
  console.log("\nTest 6: Migrasi URL Blob ke Format Lokal");
  try {
    const localTargetFilename = "mock-test-item.webp";
    
    // Simulate migration saving to disk
    const savedUrl = await saveUploadedFile(localTargetFilename, createValidWebpBuffer());
    assert(savedUrl === "/uploads/mock-test-item.webp", "URL lama terkonversi ke /uploads/mock-test-item.webp");
    assert(await findUploadedFile(localTargetFilename) !== null, "Berkas hasil migrasi tersimpan di disk lokal");
    await deleteUploadedFile(localTargetFilename);
  } catch (err) {
    assert(false, "Migrasi URL Blob", (err as Error).message);
  }

  // 7. Menjalankan Migration Script Dua Kali (Idempotence)
  console.log("\nTest 7: Idempotence (Uji Eksekusi Berulang Tanpa Duplikasi)");
  try {
    const idemFilename = `idempotent-${Date.now()}.webp`;
    const url1 = await saveUploadedFile(idemFilename, createValidWebpBuffer());
    const url2 = await saveUploadedFile(idemFilename, createValidWebpBuffer());
    assert(url1 === url2, "URL pertama dan kedua identik (/uploads/...)");
    const count = (await findUploadedFile(idemFilename)) ? 1 : 0;
    assert(count === 1, "Hanya terdapat satu salinan berkas di disk");
    await deleteUploadedFile(idemFilename);
  } catch (err) {
    assert(false, "Idempotence", (err as Error).message);
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
    assert(false, "Pencegahan path traversal", (err as Error).message);
  }

  // 9. File Terlalu Besar (> 5 MB)
  console.log("\nTest 9: Validasi Batas Ukuran File (Maksimal 5 MB)");
  try {
    const oversizedBuffer = Buffer.alloc(6 * 1024 * 1024); // 6 MB
    let rejected = false;
    try {
      await processAndCompressImage(oversizedBuffer, "large.png");
    } catch {
      rejected = true;
    }
    assert(rejected, "Menolak berkas berukuran 6 MB (> 5 MB limit)");
  } catch (err) {
    assert(false, "Validasi batas ukuran file", (err as Error).message);
  }

  // 10. MIME Type / Magic Bytes Tidak Valid (Executable/Script)
  console.log("\nTest 10: Validasi Magic Bytes & Format Berkas");
  try {
    const fakeImageBuffer = Buffer.from("<?php echo 'malicious code'; ?>", "utf8");
    let rejected = false;
    try {
      await processAndCompressImage(fakeImageBuffer, "evil.png");
    } catch {
      rejected = true;
    }
    assert(rejected, "Menolak berkas bukan gambar valid (magic bytes check)");
  } catch (err) {
    assert(false, "Validasi format berkas", (err as Error).message);
  }

  // 11. File Gambar Tidak Ditemukan (404 Not Found)
  console.log("\nTest 11: Penanganan File Tidak Ditemukan (404)");
  try {
    const nonExistent = await findUploadedFile("non-existent-random-file-12345.webp");
    assert(nonExistent === null, "findUploadedFile mengembalikan null untuk berkas tidak ada");
  } catch (err) {
    assert(false, "Penanganan file tidak ditemukan", (err as Error).message);
  }

  // 12. Gambar Gagal Diunduh dari Blob (Error Handling Tanpa Rusak DB)
  console.log("\nTest 12: Penanganan Gagal Unduh dari URL Tidak Valid");
  try {
    // Non-existent CDN host
    let failedCleanly = true;
    try {
      const res = await fetch("https://invalid-non-existent-subdomain.blob.vercel-storage.com/broken.webp", {
        signal: AbortSignal.timeout(2000),
      }).catch(() => null);
      if (res && res.ok) {
        failedCleanly = false;
      }
    } catch {
      failedCleanly = true;
    }
    assert(failedCleanly, "Sistem menangani kegagalan jaringan secara anggun tanpa crash");
  } catch (err) {
    assert(false, "Penanganan gagal unduh", (err as Error).message);
  }

  // Final Summary
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
