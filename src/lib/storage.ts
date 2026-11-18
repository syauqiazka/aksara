import "server-only";

import sharp from "sharp";
import crypto from "node:crypto";
import { put, del, list } from "@vercel/blob";
import fs from "node:fs/promises";
import path from "node:path";
import { isPrismaConfigured, prisma } from "./db/prisma";
import { localStore } from "./db/local-store";
import { toStringArray, getErrorMessage, parseDateTimeString } from "./db/formatters";
import { UploadLedgerEntry } from "./db/types";

export interface ProcessedUploadResult {
  url: string;
  hash: string;
  sizeBytes: number;
  mimeType: string;
  isDuplicate: boolean;
}

export interface StorageBlobItem {
  url: string;
  pathname: string;
  sizeBytes: number;
  uploadedAt: Date;
}

export interface OrphanBlobItem {
  url: string;
  pathname: string;
  sizeBytes: number;
  uploadedAt: Date;
  ageHours: number;
  status: "pending_orphan" | "unreferenced";
}

/**
 * Validates and compresses an image buffer using Sharp.
 * Converts to WebP format, limits longest edge to 2000px, targets <= 300KB.
 */
export async function processAndCompressImage(
  buffer: Buffer,
  _originalFilename = "upload.jpg"
): Promise<{ compressedBuffer: Buffer; hash: string; mimeType: string }> {
  // Validate magic bytes to verify genuine image file
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

  if (!isJpeg && !isPng && !isWebp) {
    throw new Error(
      "Format file tidak didukung. Harap unggah berkas gambar valid (JPEG, PNG, atau WebP)."
    );
  }

  // Max raw input limit: 5 MB
  if (buffer.length > 5 * 1024 * 1024) {
    throw new Error("Ukuran berkas melebihi batas maksimal 5 MB.");
  }

  // Resize: Max dimension 2000px, fit inside without distortion
  const pipeline = sharp(buffer).rotate().resize(2000, 2000, {
    fit: "inside",
    withoutEnlargement: true,
  });

  // Convert to WebP with initial quality 82
  let quality = 82;
  let compressedBuffer = await pipeline
    .webp({ quality, effort: 4 })
    .toBuffer();

  // Progressive compression if size exceeds 300KB
  while (compressedBuffer.length > 300 * 1024 && quality > 45) {
    quality -= 10;
    compressedBuffer = await pipeline
      .webp({ quality, effort: 4 })
      .toBuffer();
  }

  // Calculate SHA-256 hash of the final compressed WebP
  const hash = crypto
    .createHash("sha256")
    .update(compressedBuffer)
    .digest("hex");

  return {
    compressedBuffer,
    hash,
    mimeType: "image/webp",
  };
}

/**
 * Uploads processed image buffer to Vercel Blob (or local disk fallback).
 * Records upload into upload_ledger with 'pending' status.
 */
export async function uploadToStorage(
  buffer: Buffer,
  originalFilename = "image.png"
): Promise<ProcessedUploadResult> {
  const { compressedBuffer, hash, mimeType } = await processAndCompressImage(buffer, originalFilename);
  const fileName = `${hash}.webp`;
  const blobPath = `sahabat-aksara/${fileName}`;

  // Check if hash already committed in ledger to deduplicate
  const existingLedger = await getLedgerByHash(hash);
  if (existingLedger && existingLedger.status === "committed") {
    return {
      url: existingLedger.url,
      hash,
      sizeBytes: existingLedger.size_bytes,
      mimeType,
      isDuplicate: true,
    };
  }

  let finalUrl: string;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Vercel Blob
    const blob = await put(blobPath, compressedBuffer, {
      access: "public",
      addRandomSuffix: false, // content hash is already collision-resistant
      contentType: "image/webp",
    });
    finalUrl = blob.url;
  } else {
    // Local storage fallback for local development
    const localUploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(localUploadsDir, { recursive: true });
    await fs.writeFile(path.join(localUploadsDir, fileName), compressedBuffer);
    finalUrl = `/uploads/${fileName}`;
  }

  // Record into upload_ledger as 'pending'
  await recordUploadLedger({
    url: finalUrl,
    content_hash: hash,
    size_bytes: compressedBuffer.length,
    mime_type: mimeType,
    status: "pending",
  });

  return {
    url: finalUrl,
    hash,
    sizeBytes: compressedBuffer.length,
    mimeType,
    isDuplicate: false,
  };
}

/**
 * Commits an upload in the ledger when the database record is saved successfully.
 */
export async function commitUpload(url: string): Promise<void> {
  localStore.commitUploadLedger(url);

  if (isPrismaConfigured && prisma) {
    try {
      await prisma.uploadLedger.update({
        where: { url },
        data: { status: "committed", committed_at: new Date() },
      });
      return;
    } catch (err: unknown) {
      console.warn("[prisma] commitUpload:", getErrorMessage(err));
    }
  }
}

/**
 * Deletes a blob from storage (Vercel Blob or local disk) and updates ledger.
 */
export async function deleteBlobFromStorage(url: string): Promise<boolean> {
  if (!url) return false;

  try {
    if (process.env.BLOB_READ_WRITE_TOKEN && url.startsWith("http")) {
      await del(url);
    } else if (url.startsWith("/uploads/")) {
      const fileName = path.basename(url);
      const filePath = path.join(process.cwd(), "public", "uploads", fileName);
      await fs.unlink(filePath).catch(() => {});
    }

    localStore.deleteUploadLedger(url);

    // Update ledger in Prisma
    if (isPrismaConfigured && prisma) {
      try {
        await prisma.uploadLedger.update({
          where: { url },
          data: { status: "deleted" },
        });
      } catch (err: unknown) {
        console.warn("[prisma] deleteBlobFromStorage ledger:", getErrorMessage(err));
      }
    }

    return true;
  } catch (err) {
    console.warn(`[storage] Gagal menghapus blob ${url}:`, err);
    return false;
  }
}

/**
 * Lists all blobs currently present in storage.
 */
export async function listAllStorageBlobs(): Promise<StorageBlobItem[]> {
  const items: StorageBlobItem[] = [];

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const res = await list({ prefix: "sahabat-aksara/" });
      for (const blob of res.blobs) {
        items.push({
          url: blob.url,
          pathname: blob.pathname,
          sizeBytes: blob.size,
          uploadedAt: new Date(blob.uploadedAt),
        });
      }
    } catch (err) {
      console.warn("[storage] Gagal me-list blob dari Vercel Blob:", err);
    }
  }

  // Also include local uploads directory
  try {
    const localDir = path.join(process.cwd(), "public", "uploads");
    const files = await fs.readdir(localDir);
    for (const f of files) {
      if (f.startsWith(".")) continue;
      const stat = await fs.stat(path.join(localDir, f));
      items.push({
        url: `/uploads/${f}`,
        pathname: `uploads/${f}`,
        sizeBytes: stat.size,
        uploadedAt: stat.mtime,
      });
    }
  } catch {
    // local directory doesn't exist yet
  }

  return items;
}

/**
 * Collects all photo URLs currently referenced in active database records.
 */
export async function getAllReferencedPhotoUrls(): Promise<Set<string>> {
  const referenced = new Set<string>();

  if (isPrismaConfigured && prisma) {
    try {
      const [jinanPhotos, geber, reports, gallery, campaigns] = await Promise.all([
        prisma.infakJinanPhoto.findMany({ select: { url: true } }),
        prisma.geberMasjidDistribution.findMany({ select: { photo_urls: true } }),
        prisma.report.findMany({ select: { cover_url: true, gallery_urls: true } }),
        prisma.galleryItem.findMany({ select: { image_url: true } }),
        prisma.themedCampaign.findMany({ select: { cover_url: true } }),
      ]);

      jinanPhotos.forEach((r) => r.url && referenced.add(r.url));
      geber.forEach((r) => {
        const urls = toStringArray(r.photo_urls);
        urls.forEach((u) => u && referenced.add(u));
      });
      reports.forEach((r) => {
        if (r.cover_url) referenced.add(r.cover_url);
        const urls = toStringArray(r.gallery_urls);
        urls.forEach((u) => u && referenced.add(u));
      });
      gallery.forEach((r) => r.image_url && referenced.add(r.image_url));
      campaigns.forEach((r) => r.cover_url && referenced.add(r.cover_url));

      return referenced;
    } catch (err: unknown) {
      console.warn("[prisma] getAllReferencedPhotoUrls:", getErrorMessage(err));
    }
  }

  // Fallback to localStore
  const infak = localStore.getInfak(false);
  const geber = localStore.getGeber(false);
  const reports = localStore.getReports(false);
  const gallery = localStore.getGallery(false);
  const campaigns = localStore.getCampaigns();

  infak.forEach((i: { photo_url?: string | null }) => i.photo_url && referenced.add(i.photo_url));
  geber.forEach((g: { photo_urls?: string[] | null }) => g.photo_urls?.forEach((u: string) => u && referenced.add(u)));
  reports.forEach((r: { cover_url?: string | null; gallery_urls?: string[] | null }) => {
    if (r.cover_url) referenced.add(r.cover_url);
    r.gallery_urls?.forEach((u: string) => u && referenced.add(u));
  });
  gallery.forEach((g: { image_url?: string | null }) => g.image_url && referenced.add(g.image_url));
  campaigns.forEach((c: { cover_url?: string | null }) => c.cover_url && referenced.add(c.cover_url));

  return referenced;
}

/**
 * Finds orphan blobs: blobs stored in storage that are not referenced in the DB.
 */
export async function getOrphanBlobs(minAgeHours = 0): Promise<OrphanBlobItem[]> {
  const [allBlobs, referencedUrls] = await Promise.all([
    listAllStorageBlobs(),
    getAllReferencedPhotoUrls(),
  ]);

  const now = Date.now();
  const orphans: OrphanBlobItem[] = [];

  for (const blob of allBlobs) {
    if (!referencedUrls.has(blob.url)) {
      const ageHours = (now - blob.uploadedAt.getTime()) / (1000 * 60 * 60);
      if (ageHours >= minAgeHours) {
        orphans.push({
          url: blob.url,
          pathname: blob.pathname,
          sizeBytes: blob.sizeBytes,
          uploadedAt: blob.uploadedAt,
          ageHours: Math.round(ageHours * 10) / 10,
          status: "unreferenced",
        });
      }
    }
  }

  return orphans;
}

// Helper: Query ledger by hash
async function getLedgerByHash(hash: string): Promise<UploadLedgerEntry | null> {
  if (isPrismaConfigured && prisma) {
    try {
      const row = await prisma.uploadLedger.findFirst({
        where: { content_hash: hash, status: "committed" },
      });
      if (row) {
        return {
          id: row.id,
          url: row.url,
          content_hash: row.content_hash,
          size_bytes: row.size_bytes,
          mime_type: row.mime_type,
          status: row.status as "pending" | "committed" | "deleted",
          created_at: parseDateTimeString(row.created_at),
          committed_at: row.committed_at ? parseDateTimeString(row.committed_at) : null,
        };
      }
    } catch (err: unknown) {
      console.warn("[prisma] getLedgerByHash:", getErrorMessage(err));
    }
  }

  return localStore.getUploadLedgerByHash(hash);
}

// Helper: Insert record into ledger
async function recordUploadLedger(
  entry: Omit<UploadLedgerEntry, "id" | "created_at" | "committed_at">
): Promise<void> {
  localStore.addUploadLedger(entry);

  if (isPrismaConfigured && prisma) {
    try {
      await prisma.uploadLedger.upsert({
        where: { url: entry.url },
        create: {
          url: entry.url,
          content_hash: entry.content_hash,
          size_bytes: entry.size_bytes,
          mime_type: entry.mime_type,
          status: entry.status,
        },
        update: {
          content_hash: entry.content_hash,
          size_bytes: entry.size_bytes,
          mime_type: entry.mime_type,
          status: entry.status,
        },
      });
      return;
    } catch (err: unknown) {
      console.warn("[prisma] recordUploadLedger:", getErrorMessage(err));
    }
  }
}
