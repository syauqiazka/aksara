import "server-only";

import sharp from "sharp";
import crypto from "node:crypto";
import { put, del, list } from "@vercel/blob";
import fs from "node:fs/promises";
import path from "node:path";
import { isSupabaseConfigured, supabase } from "./db/client";
import { localStore } from "./db/local-store";
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
  // 1. Max 5MB hard limit
  if (buffer.length > 5 * 1024 * 1024) {
    throw new Error("Ukuran gambar melebihi batas maksimal 5 MB.");
  }

  // 2. Validate with Sharp
  let metadata;
  try {
    metadata = await sharp(buffer).metadata();
  } catch {
    throw new Error("Format file tidak valid atau rusak. Harap unggah gambar JPG, PNG, atau WebP.");
  }

  const validFormats = ["jpeg", "png", "webp", "gif"];
  if (!metadata.format || !validFormats.includes(metadata.format)) {
    throw new Error("Format gambar tidak didukung. Harap pilih gambar JPEG, PNG, atau WebP.");
  }

  // 3. Resize & convert to WebP (max 2000px dimension)
  let pipeline = sharp(buffer)
    .resize({
      width: 2000,
      height: 2000,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 });

  let compressedBuffer = await pipeline.toBuffer();

  // If still larger than 300KB, compress with quality 65
  if (compressedBuffer.length > 300 * 1024) {
    pipeline = sharp(buffer)
      .resize({
        width: 2000,
        height: 2000,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 65 });
    compressedBuffer = await pipeline.toBuffer();
  }

  // 4. Content SHA-256 hash (truncated to 16 hex chars)
  const hash = crypto
    .createHash("sha256")
    .update(compressedBuffer)
    .digest("hex")
    .slice(0, 16);

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
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("upload_ledger")
        .update({ status: "committed", committed_at: new Date().toISOString() })
        .eq("url", url);
      if (error) localStore.commitUploadLedger(url);
    } catch {
      localStore.commitUploadLedger(url);
    }
  } else {
    localStore.commitUploadLedger(url);
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

    // Update ledger
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("upload_ledger")
          .update({ status: "deleted" })
          .eq("url", url);
        if (error) localStore.deleteUploadLedger(url);
      } catch {
        localStore.deleteUploadLedger(url);
      }
    } else {
      localStore.deleteUploadLedger(url);
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

  if (isSupabaseConfigured && supabase) {
    const [infak, geber, reports, gallery, campaigns] = await Promise.all([
      supabase.from("infak_distributions").select("photo_url"),
      supabase.from("geber_masjid_distributions").select("photo_urls"),
      supabase.from("reports").select("cover_url, gallery_urls"),
      supabase.from("gallery_items").select("image_url"),
      supabase.from("themed_campaigns").select("cover_url"),
    ]);

    infak.data?.forEach((i: { photo_url: string | null }) => i.photo_url && referenced.add(i.photo_url));
    geber.data?.forEach((g: { photo_urls: string[] | null }) => g.photo_urls?.forEach((u) => u && referenced.add(u)));
    reports.data?.forEach((r: { cover_url: string | null; gallery_urls: string[] | null }) => {
      if (r.cover_url) referenced.add(r.cover_url);
      r.gallery_urls?.forEach((u) => u && referenced.add(u));
    });
    gallery.data?.forEach((g: { image_url: string | null }) => g.image_url && referenced.add(g.image_url));
    campaigns.data?.forEach((c: { cover_url: string | null }) => c.cover_url && referenced.add(c.cover_url));
  } else {
    // Local store
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
  }

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
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("upload_ledger")
        .select("*")
        .eq("content_hash", hash)
        .eq("status", "committed")
        .maybeSingle();
      if (error) return localStore.getUploadLedgerByHash(hash);
      return (data as UploadLedgerEntry | null) ?? null;
    } catch {
      return localStore.getUploadLedgerByHash(hash);
    }
  }
  return localStore.getUploadLedgerByHash(hash);
}

// Helper: Insert record into ledger
async function recordUploadLedger(entry: Omit<UploadLedgerEntry, "id" | "created_at" | "committed_at">): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("upload_ledger").insert({
        ...entry,
        created_at: new Date().toISOString(),
      });
      if (error) localStore.addUploadLedger(entry);
    } catch {
      localStore.addUploadLedger(entry);
    }
  } else {
    localStore.addUploadLedger(entry);
  }
}
