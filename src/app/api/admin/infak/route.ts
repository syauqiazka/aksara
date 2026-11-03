import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/api";
import { infakSchema } from "@/lib/validation/schemas";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await db.getInfakDistributions(false);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const json = await request.json();
    const validated = infakSchema.parse(json);

    const result = await db.saveInfak({
      ...validated,
      lat: validated.lat || null,
      lng: validated.lng || null,
      photo_url: validated.photo_url || null,
      notes: validated.notes || null,
    });

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

    const validated = infakSchema.parse(data);
    const result = await db.saveInfak(
      {
        ...validated,
        lat: validated.lat || null,
        lng: validated.lng || null,
        photo_url: validated.photo_url || null,
        notes: validated.notes || null,
      },
      id
    );

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

    const success = await db.deleteInfak(id);
    revalidatePath("/data-sebaran");
    revalidatePath("/");

    return NextResponse.json({ success });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

