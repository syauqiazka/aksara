import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/admin-api";
import { reportSchema, formatZodError } from "@/lib/validation/schemas";
import { getAdminSession } from "@/lib/auth";
import { commitUpload, deleteBlobFromStorage } from "@/lib/storage";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    const item = await db.getReportById(id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  }

  const data = await db.getReports(false);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const json = await request.json();
    const validated = reportSchema.parse(json);

    const result = await db.saveReport({
      ...validated,
      amount_idr: validated.amount_idr || null,
      cover_url: validated.cover_url || null,
      gallery_urls: validated.gallery_urls || [],
      pdf_url: null,
    });

    if (result.cover_url) {
      await commitUpload(result.cover_url);
    }
    for (const gUrl of result.gallery_urls) {
      if (gUrl) await commitUpload(gUrl);
    }

    revalidatePath("/laporan");
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

    const validated = reportSchema.parse(data);
    const previousRecord = await db.getReportById(id);

    const result = await db.saveReport(
      {
        ...validated,
        amount_idr: validated.amount_idr || null,
        cover_url: validated.cover_url || null,
        gallery_urls: validated.gallery_urls || [],
        pdf_url: null,
      },
      id
    );

    if (result.cover_url) {
      await commitUpload(result.cover_url);
    }
    for (const gUrl of result.gallery_urls) {
      if (gUrl) await commitUpload(gUrl);
    }

    // Clean up replaced cover
    if (
      previousRecord?.cover_url &&
      previousRecord.cover_url !== result.cover_url &&
      (previousRecord.cover_url.startsWith("http") || previousRecord.cover_url.startsWith("/uploads/"))
    ) {
      await deleteBlobFromStorage(previousRecord.cover_url);
    }

    revalidatePath("/laporan");
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

    const previousRecord = await db.getReportById(id);
    const success = await db.deleteReport(id);

    if (success && previousRecord) {
      if (
        previousRecord.cover_url &&
        (previousRecord.cover_url.startsWith("http") || previousRecord.cover_url.startsWith("/uploads/"))
      ) {
        await deleteBlobFromStorage(previousRecord.cover_url);
      }
      for (const gUrl of previousRecord.gallery_urls) {
        if (gUrl && (gUrl.startsWith("http") || gUrl.startsWith("/uploads/"))) {
          await deleteBlobFromStorage(gUrl);
        }
      }
    }

    revalidatePath("/laporan");
    revalidatePath("/");

    return NextResponse.json({ success });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
