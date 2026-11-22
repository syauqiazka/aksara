import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { findUploadedFile, isValidFilename } from "@/lib/server-uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTENT_TYPE_MAP: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Strict validation: reject empty, path traversal, slashes, or invalid characters
    if (!filename || !isValidFilename(filename)) {
      return new NextResponse("File Not Found", {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const safeFilename = path.basename(filename);
    const existingFilePath = await findUploadedFile(safeFilename);

    if (!existingFilePath) {
      return new NextResponse("File Not Found", {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const fileBuffer = await fs.readFile(existingFilePath);
    const ext = path.extname(safeFilename).toLowerCase();
    const contentType = CONTENT_TYPE_MAP[ext] || "application/octet-stream";

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    // Never leak server paths or stack traces in the response
    return new NextResponse("File Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
