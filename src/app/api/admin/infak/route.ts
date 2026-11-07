import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/admin-api";
import { infakJinanSchema, formatZodError } from "@/lib/validation/schemas";
import { getAdminSession } from "@/lib/auth";
import { commitUpload, deleteBlobFromStorage } from "@/lib/storage";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await db.getInfakJinan(false);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const json = await request.json();
    const validated = infakJinanSchema.parse(json);

    const result = await db.saveInfakJinan({
      ...validated,
      santri_count: (validated.santri_list || []).length,
      photos: (validated.photos || []).map((p, idx) => ({
        id: `photo-${Date.now()}-${idx}`,
        infak_id: "",
        url: p.url,
        caption: p.caption,
        sort: p.sort ?? (idx + 1),
      })),
      santri_list: (validated.santri_list || []).map((s, idx) => ({
        ...s,
        id: s.id || `santri-${Date.now()}-${idx}`,
        infak_id: "",
        sort: s.sort ?? idx + 1,
        status: s.status ?? "published",
        latest_surah: s.initial_surah_name || "Al-Fatihah",
        latest_ayat: s.initial_ayat || 7,
        latest_juz: s.initial_juz || 1,
        hafalan_updates: s.initial_surah_no ? [
          {
            id: `hafalan-${Date.now()}-${idx}`,
            santri_id: s.id,
            updated_on: validated.distributed_at,
            surah_no: s.initial_surah_no,
            surah_name: s.initial_surah_name || "Al-Fatihah",
            ayat: s.initial_ayat || 7,
            juz: s.initial_juz || 1,
            notes: "Capaian awal saat serah terima mushaf",
          }
        ] : [],
      })),
    });

    // Commit photos if any
    if (result.photos && result.photos.length > 0) {
      for (const p of result.photos) {
        if (p.url) await commitUpload(p.url);
      }
    }

    revalidatePath("/data-sebaran");
    revalidatePath(`/data-sebaran/infak-jinan/${result.id}`);
    revalidatePath("/");

    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json({ error: formatZodError(err) }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, ...data } = await request.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const validated = infakJinanSchema.parse(data);
    const rawPrevious = await db.getInfakJinanById(id);
    const previousRecord = rawPrevious ? JSON.parse(JSON.stringify(rawPrevious)) : null;

    const santriList = validated.santri_list && validated.santri_list.length > 0
      ? validated.santri_list.map((s, idx) => ({
          ...s,
          id: s.id || `santri-${Date.now()}-${idx}`,
          infak_id: id,
          sort: s.sort ?? (idx + 1),
          status: s.status ?? ("published" as const),
          latest_surah: s.initial_surah_name || "Al-Fatihah",
          latest_ayat: s.initial_ayat || 7,
          latest_juz: s.initial_juz || 1,
          hafalan_updates: s.initial_surah_no ? [
            {
              id: `hafalan-${Date.now()}-${idx}`,
              santri_id: s.id,
              updated_on: validated.distributed_at,
              surah_no: s.initial_surah_no,
              surah_name: s.initial_surah_name || "Al-Fatihah",
              ayat: s.initial_ayat || 7,
              juz: s.initial_juz || 1,
              notes: "Capaian awal saat serah terima mushaf",
            }
          ] : [],
        }))
      : (previousRecord?.santri_list || []);

    const result = await db.saveInfakJinan(
      {
        ...validated,
        santri_count: santriList.length,
        santri_list: santriList,
        photos: (validated.photos || []).map((p, idx) => ({
          id: `photo-${Date.now()}-${idx}`,
          infak_id: id,
          url: p.url,
          caption: p.caption,
          sort: p.sort ?? (idx + 1),
        })),
      },
      id
    );

    // Commit new photos
    if (result.photos && result.photos.length > 0) {
      for (const p of result.photos) {
        if (p.url) await commitUpload(p.url);
      }
    }

    // Clean up replaced photos if needed
    if (previousRecord?.photos) {
      const currentUrls = new Set(result.photos.map((p) => p.url));
      for (const oldPhoto of previousRecord.photos) {
        if (!currentUrls.has(oldPhoto.url) && (oldPhoto.url.startsWith("http") || oldPhoto.url.startsWith("/uploads/"))) {
          await deleteBlobFromStorage(oldPhoto.url);
        }
      }
    }

    revalidatePath("/data-sebaran");
    revalidatePath(`/data-sebaran/infak-jinan/${id}`);
    revalidatePath("/");

    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json({ error: formatZodError(err) }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const previousRecord = await db.getInfakJinanById(id);
    const success = await db.deleteInfakJinan(id);

    // Clean up photo blobs from storage
    if (success && previousRecord?.photos) {
      for (const p of previousRecord.photos) {
        if (p.url && (p.url.startsWith("http") || p.url.startsWith("/uploads/"))) {
          await deleteBlobFromStorage(p.url);
        }
      }
    }

    revalidatePath("/data-sebaran");
    revalidatePath(`/data-sebaran/infak-jinan/${id}`);
    revalidatePath("/");

    return NextResponse.json({ success });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
