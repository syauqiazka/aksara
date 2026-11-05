import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/admin-api";
import { geberSchema } from "@/lib/validation/schemas";
import { getAdminSession } from "@/lib/auth";
import { commitUpload, deleteBlobFromStorage } from "@/lib/storage";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    const item = await db.getGeberById(id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  }

  const data = await db.getGeberDistributions(false);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const json = await request.json();
    const validated = geberSchema.parse(json);

    const result = await db.saveGeber({
      ...validated,
      lat: validated.lat || null,
      lng: validated.lng || null,
      activity_notes: validated.activity_notes || null,
      photo_urls: validated.photo_urls || [],
    });

    for (const url of result.photo_urls) {
      if (url) await commitUpload(url);
    }

    revalidatePath("/data-sebaran");
    revalidatePath("/");

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Validation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, ...data } = await request.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const validated = geberSchema.parse(data);

    const previousRecord = await db.getGeberById(id);

    const result = await db.saveGeber(
      {
        ...validated,
        lat: validated.lat || null,
        lng: validated.lng || null,
        activity_notes: validated.activity_notes || null,
        photo_urls: validated.photo_urls || [],
      },
      id
    );

    // Commit any new photos
    for (const url of result.photo_urls) {
      if (url) await commitUpload(url);
    }

    // Clean up removed photos
    if (previousRecord?.photo_urls) {
      const removed = previousRecord.photo_urls.filter((oldU) => !result.photo_urls.includes(oldU));
      for (const oldU of removed) {
        if (oldU && (oldU.startsWith("http") || oldU.startsWith("/uploads/"))) {
          await deleteBlobFromStorage(oldU);
        }
      }
    }

    revalidatePath("/data-sebaran");
    revalidatePath("/");

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const previousRecord = await db.getGeberById(id);
    const success = await db.deleteGeber(id);

    // Clean up photo blobs upon deletion
    if (success && previousRecord?.photo_urls) {
      for (const u of previousRecord.photo_urls) {
        if (u && (u.startsWith("http") || u.startsWith("/uploads/"))) {
          await deleteBlobFromStorage(u);
        }
      }
    }

    revalidatePath("/data-sebaran");
    revalidatePath("/");

    return NextResponse.json({ success });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
