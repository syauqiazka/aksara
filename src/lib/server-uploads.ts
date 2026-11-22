import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import crypto from "node:crypto";

const DEFAULT_PERSISTENT_UPLOAD_DIR =
  "/home/u866076018/domains/sahabataksarasemesta.org/uploads";

/**
 * Returns the primary persistent upload directory on the server.
 * Prioritizes the UPLOAD_DIR environment variable (outside deployment folder on Hostinger).
 * Defaults to the persistent server uploads directory.
 */
export function getPrimaryUploadDir(): string {
  const configured = process.env.UPLOAD_DIR?.trim();

  if (configured) {
    return path.resolve(configured);
  }

  return DEFAULT_PERSISTENT_UPLOAD_DIR;
}

/**
 * Returns all potential candidate upload directories on the server.
 * Always searches UPLOAD_DIR first, followed by standard fallback locations.
 */
export function getUploadDirectories(): string[] {
  const dirs: string[] = [];

  // 1. Configured persistent server directory (Hostinger outside deployment)
  const configured = process.env.UPLOAD_DIR?.trim();
  if (configured) {
    dirs.push(path.resolve(configured));
  }

  // 2. Default persistent upload directory on Hostinger server
  dirs.push(DEFAULT_PERSISTENT_UPLOAD_DIR);

  const cwd = process.cwd();

  // 3. Standard public/uploads inside repository / build
  dirs.push(path.join(cwd, "public", "uploads"));

  // 3. Root uploads folder
  dirs.push(path.join(cwd, "uploads"));

  // 4. Relative paths
  dirs.push(path.resolve("public/uploads"));
  dirs.push(path.resolve("uploads"));

  // 5. Next.js standalone runtime path
  dirs.push(path.join(cwd, ".next", "standalone", "public", "uploads"));
  dirs.push(path.join(cwd, ".next", "standalone", "uploads"));

  // 6. Parent traversal directories (common in Hostinger hbuilds or Passenger)
  dirs.push(path.resolve("../public/uploads"));
  dirs.push(path.resolve("../uploads"));
  dirs.push(path.resolve("../../public/uploads"));
  dirs.push(path.resolve("../../uploads"));

  // De-duplicate while preserving priority order
  return Array.from(new Set(dirs));
}

/**
 * Validates whether a filename is safe against path traversal and dangerous extensions.
 */
export function isValidFilename(filename: string): boolean {
  if (!filename || typeof filename !== "string") return false;
  if (filename.length > 255) return false;

  // Disallow path traversal, null bytes, backslashes, slashes, leading dots
  if (
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\") ||
    filename.includes("\0") ||
    filename.startsWith(".")
  ) {
    return false;
  }

  // Must match safe naming: alphanumeric, underscores, hyphens, and single extension dot
  return /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(filename);
}

/**
 * Sanitizes a filename and ensures it has a safe name and valid extension.
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return `${crypto.randomUUID()}.webp`;

  const base = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, "");
  const clean = base.replace(/^\.+/, "");
  const ext = path.extname(clean).toLowerCase();

  const allowedExtensions = [".webp", ".jpg", ".jpeg", ".png", ".svg", ".gif"];
  if (!allowedExtensions.includes(ext)) {
    return `${crypto.randomUUID()}.webp`;
  }

  return clean || `${crypto.randomUUID()}${ext}`;
}

/**
 * Ensures the primary upload directory exists on disk.
 */
export async function ensureUploadDir(): Promise<string> {
  const dir = getPrimaryUploadDir();
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    console.error(`[server-uploads] Gagal membuat direktori upload ${dir}:`, err);
    throw err;
  }
  return dir;
}

/**
 * Searches for an uploaded file across all candidate directories.
 * Returns the absolute path if found, or null if not found.
 */
export async function findUploadedFile(filename: string): Promise<string | null> {
  if (!filename || !isValidFilename(filename)) return null;

  const safeFilename = path.basename(filename);
  const dirs = getUploadDirectories();

  for (const dir of dirs) {
    try {
      const candidatePath = path.join(dir, safeFilename);
      if (existsSync(candidatePath)) {
        return candidatePath;
      }
    } catch {
      // Continue to next candidate directory
    }
  }

  return null;
}

/**
 * Saves an uploaded buffer to the primary persistent upload directory (UPLOAD_DIR).
 * In development or when fallback directory is accessible, also mirrors to public/uploads.
 * Returns public URL format: /uploads/<safe-filename>.
 */
export async function saveUploadedFile(
  filename: string,
  buffer: Buffer
): Promise<string> {
  const safeFilename = sanitizeFilename(filename);
  const primaryDir = await ensureUploadDir();
  const primaryFilePath = path.join(primaryDir, safeFilename);

  // Write file to persistent primary directory
  await fs.writeFile(primaryFilePath, buffer);

  // If primaryDir is outside public/uploads (e.g. Hostinger persistent dir or custom UPLOAD_DIR),
  // optionally attempt mirroring to public/uploads for local runtime convenience
  const localPublicUploads = path.join(process.cwd(), "public", "uploads");
  if (path.resolve(primaryDir) !== path.resolve(localPublicUploads)) {
    try {
      await fs.mkdir(localPublicUploads, { recursive: true });
      await fs.writeFile(path.join(localPublicUploads, safeFilename), buffer);
    } catch {
      // Mirroring is best-effort; persistent primaryDir is the authoritative copy
    }
  }

  // Return public URL path without leaking server filesystem path
  return `/uploads/${safeFilename}`;
}

/**
 * Deletes an uploaded file from all upload directories where it exists.
 */
export async function deleteUploadedFile(filenameOrUrl: string): Promise<boolean> {
  if (!filenameOrUrl) return false;

  // Extract plain filename (strip /uploads/ prefix or full URL if present)
  let cleanName = filenameOrUrl;
  if (cleanName.startsWith("/uploads/")) {
    cleanName = cleanName.replace(/^\/uploads\//, "");
  } else if (cleanName.startsWith("http")) {
    try {
      const parsed = new URL(cleanName);
      cleanName = path.basename(parsed.pathname);
    } catch {
      cleanName = path.basename(cleanName);
    }
  }

  if (!isValidFilename(cleanName)) return false;

  const dirs = getUploadDirectories();
  let deletedAny = false;

  for (const dir of dirs) {
    try {
      const targetPath = path.join(dir, cleanName);
      if (existsSync(targetPath)) {
        await fs.unlink(targetPath);
        deletedAny = true;
      }
    } catch {
      // Ignore individual unlink errors
    }
  }

  return deletedAny;
}
