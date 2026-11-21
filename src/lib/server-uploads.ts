import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";

/**
 * Returns all potential candidate upload directories on the server.
 * Handles different runtime environments (local, Hostinger public_html, standalone .next, Passenger).
 */
export function getUploadDirectories(): string[] {
  const dirs: string[] = [];
  const cwd = process.cwd();

  // 1. Primary standard directory: <cwd>/public/uploads
  dirs.push(path.join(cwd, "public", "uploads"));

  // 2. Direct uploads directory: <cwd>/uploads
  dirs.push(path.join(cwd, "uploads"));

  // 3. Relative to execution root
  dirs.push(path.resolve("public/uploads"));
  dirs.push(path.resolve("uploads"));

  // 4. Next.js standalone runtime path
  dirs.push(path.join(cwd, ".next", "standalone", "public", "uploads"));
  dirs.push(path.join(cwd, ".next", "standalone", "uploads"));

  // 5. Parent directory traversal (common in Hostinger hbuilds or Passenger where cwd is subfolder)
  dirs.push(path.resolve("../public/uploads"));
  dirs.push(path.resolve("../uploads"));
  dirs.push(path.resolve("../../public/uploads"));
  dirs.push(path.resolve("../../uploads"));

  // De-duplicate while preserving order
  return Array.from(new Set(dirs));
}

/**
 * Searches for an uploaded file across all candidate directories.
 * Returns the absolute path if found, or null if not found.
 */
export async function findUploadedFile(filename: string): Promise<string | null> {
  if (!filename) return null;
  const safeFilename = path.basename(filename);
  const dirs = getUploadDirectories();

  for (const dir of dirs) {
    try {
      const candidatePath = path.join(dir, safeFilename);
      if (existsSync(candidatePath)) {
        return candidatePath;
      }
    } catch {
      // Ignore permission or file system errors and keep searching
    }
  }

  return null;
}

/**
 * Saves an uploaded buffer to primary public/uploads and synchronizes to fallback directories.
 * Ensures the file is available regardless of which directory serves requests.
 */
export async function saveUploadedFile(filename: string, buffer: Buffer): Promise<string> {
  const safeFilename = path.basename(filename);
  const cwd = process.cwd();

  const primaryDir = path.join(cwd, "public", "uploads");
  const fallbackDir = path.join(cwd, "uploads");

  // Always write to primary
  await fs.mkdir(primaryDir, { recursive: true });
  await fs.writeFile(path.join(primaryDir, safeFilename), buffer);

  // Synchronize to fallback if different
  try {
    await fs.mkdir(fallbackDir, { recursive: true });
    await fs.writeFile(path.join(fallbackDir, safeFilename), buffer);
  } catch {
    // Ignore fallback directory write errors
  }

  // Also sync to standalone if standalone directory exists
  try {
    const standaloneDir = path.join(cwd, ".next", "standalone", "public", "uploads");
    if (existsSync(path.join(cwd, ".next", "standalone"))) {
      await fs.mkdir(standaloneDir, { recursive: true });
      await fs.writeFile(path.join(standaloneDir, safeFilename), buffer);
    }
  } catch {
    // Ignore standalone sync failure
  }

  return `/uploads/${safeFilename}`;
}
