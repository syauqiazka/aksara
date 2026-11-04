import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getAdminSession } from "@/lib/auth";
import fs from "node:fs/promises";
import path from "node:path";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized: Silakan login terlebih dahulu" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File gambar tidak ditemukan dalam permintaan" }, { status: 400 });
    }

    // Validate image mimetype
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Format file tidak didukung. Harap pilih gambar (JPEG, PNG, WebP, GIF, SVG)" },
        { status: 400 }
      );
    }

    // Max 8MB
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran gambar terlalu besar. Maksimal 8MB" }, { status: 400 });
    }

    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const blobPathName = `sahabat-aksara/${timestamp}-${cleanFileName}`;

    // Priority 1: Vercel Blob (if token configured)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(blobPathName, file, {
        access: "public",
        addRandomSuffix: true,
      });

      return NextResponse.json({
        success: true,
        url: blob.url,
        provider: "vercel-blob",
      });
    }

    // Priority 2: Local storage fallback for local development without token
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const localFileName = `${timestamp}-${cleanFileName}`;
    const localUploadsDir = path.join(process.cwd(), "public", "uploads");

    await fs.mkdir(localUploadsDir, { recursive: true });
    await fs.writeFile(path.join(localUploadsDir, localFileName), buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${localFileName}`,
      provider: "local",
      message: "Tersimpan di local storage (Tambahkan BLOB_READ_WRITE_TOKEN di .env.local untuk auto-upload ke Vercel Blob)",
    });
  } catch (err: unknown) {
    console.error("[Upload Error]:", err);
    const message = err instanceof Error ? err.message : "Terjadi kesalahan saat mengunggah gambar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

