import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import {
  uploadToStorage,
  deleteBlobFromStorage,
  commitUpload,
  getOrphanBlobs,
} from "@/lib/storage";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: Silakan login terlebih dahulu" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json(
        { error: "File gambar tidak ditemukan dalam formulir" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Tipe file tidak didukung. Harap unggah berkas gambar (JPG, PNG, WebP)" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran berkas melebihi batas maksimal 5 MB" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadToStorage(buffer, file.name);

    return NextResponse.json({
      success: true,
      url: result.url,
      hash: result.hash,
      reused: result.isDuplicate,
      sizeBytes: result.sizeBytes,
    });
  } catch (err: unknown) {
    console.error("[Upload Error]:", err);
    const message = err instanceof Error ? err.message : "Gagal mengunggah berkas";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: Silakan login terlebih dahulu" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    let urlToDelete = searchParams.get("url");
    let urlsToDelete: string[] = [];

    if (!urlToDelete) {
      try {
        const body = await request.json();
        if (Array.isArray(body.urls)) {
          urlsToDelete = body.urls;
        } else if (body.url) {
          urlToDelete = body.url;
        }
      } catch {
        // ignore
      }
    } else {
      urlsToDelete = [urlToDelete];
    }

    if (urlToDelete && urlsToDelete.length === 0) {
      urlsToDelete = [urlToDelete];
    }

    if (urlsToDelete.length === 0) {
      return NextResponse.json(
        { error: "URL gambar yang akan dihapus tidak ditentukan" },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      urlsToDelete.map(async (u) => ({
        url: u,
        deleted: await deleteBlobFromStorage(u),
      }))
    );

    return NextResponse.json({ success: true, results, deletedCount: results.filter((r) => r.deleted).length });
  } catch (err: unknown) {
    console.error("[Delete Blob Error]:", err);
    const message = err instanceof Error ? err.message : "Gagal menghapus blob";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: Silakan login terlebih dahulu" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { url, action } = body;

    if (!url) {
      return NextResponse.json({ error: "URL tidak ditentukan" }, { status: 400 });
    }

    if (action === "commit") {
      await commitUpload(url);
      return NextResponse.json({ success: true, committed: url });
    }

    return NextResponse.json({ error: "Aksi tidak dikenal" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "orphans") {
    const minHours = parseFloat(searchParams.get("minHours") || "0");
    const orphans = await getOrphanBlobs(minHours);
    return NextResponse.json({ success: true, count: orphans.length, orphans });
  }

  return NextResponse.json({ error: "Aksi tidak valid" }, { status: 400 });
}
