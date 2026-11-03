import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/api";
import { getAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { csvText } = await request.json();
    if (!csvText) return NextResponse.json({ error: "CSV text is required" }, { status: 400 });

    const lines = csvText.trim().split("\n");
    if (lines.length < 2) {
      return NextResponse.json({ error: "File CSV kosong atau tidak memiliki baris data" }, { status: 400 });
    }

    const imported = [];
    const errors = [];

    // Format: mushaf_no,donor_name,show_donor_name,recipient_name,recipient_type,province,city,district,distributed_at,quantity,notes,status
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = line.split(",").map((c: string) => c.trim().replace(/^"|"$/g, ""));

      try {
        const mushaf_no = parseInt(cols[0], 10);
        const donor_name = cols[1] || "Hamba Allah";
        const show_donor_name = cols[2]?.toLowerCase() === "true";
        const recipient_name = cols[3] || "Lembaga Penerima";
        const recipient_type = (["pesantren", "masjid", "madrasah", "lainnya"].includes(cols[4]) ? cols[4] : "pesantren") as "pesantren" | "masjid" | "madrasah" | "lainnya";
        const province = cols[5] || "Jawa Barat";
        const city = cols[6] || "Bogor";
        const district = cols[7] || "Ciawi";
        const distributed_at = cols[8] || new Date().toISOString().split("T")[0];
        const quantity = parseInt(cols[9], 10) || 1;
        const notes = cols[10] || null;
        const status = (cols[11]?.toLowerCase() === "draft" ? "draft" : "published") as "draft" | "published";

        const res = await db.saveInfak({
          mushaf_no,
          donor_name,
          show_donor_name,
          recipient_name,
          recipient_type,
          province,
          city,
          district,
          lat: null,
          lng: null,
          distributed_at,
          quantity,
          photo_url: null,
          notes,
          status,
        });

        imported.push(res);
      } catch (err: unknown) {
        errors.push({ line: i + 1, error: err instanceof Error ? err.message : "Invalid format" });
      }
    }

    revalidatePath("/data-sebaran");
    revalidatePath("/");

    return NextResponse.json({ success: true, count: imported.length, errors });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Import failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

