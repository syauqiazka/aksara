import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/admin-api";
import { gallerySchema } from "@/lib/validation/schemas";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await db.getGalleryItems(false);
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal memuat galeri";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const json = await request.json();
    const validated = gallerySchema.parse(json);

    const result = await db.saveGalleryItem({
      ...validated,
      caption: validated.caption || null,
    });

    revalidatePath("/portofolio");
    revalidatePath("/");

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Validasi data gagal";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, ...data } = await request.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const validated = gallerySchema.parse(data);
    const result = await db.saveGalleryItem(
      {
        ...validated,
        caption: validated.caption || null,
      },
      id
    );

    revalidatePath("/portofolio");
    revalidatePath("/");

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Pembaruan data gagal";
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

    const success = await db.deleteGalleryItem(id);
    revalidatePath("/portofolio");
    revalidatePath("/");

    return NextResponse.json({ success });
  } catch {
    return NextResponse.json({ error: "Penghapusan data gagal" }, { status: 500 });
  }
}

