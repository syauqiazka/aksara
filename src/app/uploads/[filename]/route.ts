import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { findUploadedFile } from "@/lib/server-uploads";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    if (!filename) {
      return new NextResponse("Filename is required", { status: 400 });
    }

    // Sanitize to prevent path traversal
    const safeFilename = path.basename(filename);
    const existingFilePath = await findUploadedFile(safeFilename);

    if (!existingFilePath) {
      return new NextResponse("File Not Found", { status: 404 });
    }

    const fileBuffer = await fs.readFile(existingFilePath);

    const ext = path.extname(safeFilename).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      ".webp": "image/webp",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".svg": "image/svg+xml",
      ".gif": "image/gif",
    };

    const contentType = contentTypeMap[ext] || "application/octet-stream";

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("File Not Found", { status: 404 });
  }
}
