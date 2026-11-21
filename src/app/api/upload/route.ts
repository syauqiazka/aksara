import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getAdminSession } from "@/lib/auth";
import { uploadToStorage } from "@/lib/storage";
import { saveUploadedFile } from "@/lib/server-uploads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        error: "Sesi admin Anda telah berakhir. Silakan login kembali.",
        message: "Sesi admin Anda telah berakhir. Silakan login kembali.",
      },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "File tidak ditemukan", message: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "File harus berupa gambar (JPG, PNG, WebP)", message: "File harus berupa gambar (JPG, PNG, WebP)" },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "Ukuran gambar maksimal 5 MB", message: "Ukuran gambar maksimal 5 MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      // Use uploadToStorage (handles compression & ledger)
      const result = await uploadToStorage(buffer, file.name);
      return NextResponse.json({
        success: true,
        url: result.url,
        hash: result.hash,
        sizeBytes: result.sizeBytes,
      });
    } catch {
      // Direct disk fallback without compression if sharp encounters any issue
      const extension = file.name.split(".").pop()?.toLowerCase() || "webp";
      const filename = `${crypto.randomUUID()}.${extension}`;
      const fileUrl = await saveUploadedFile(filename, buffer);

      return NextResponse.json({
        success: true,
        url: fileUrl,
      });
    }
  } catch (error) {
    console.error("UPLOAD_LOCAL_ERROR:", error);
    const msg = error instanceof Error ? error.message : "Gagal menyimpan file ke server";
    return NextResponse.json(
      { success: false, error: msg, message: msg },
      { status: 500 }
    );
  }
}
