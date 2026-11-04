import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/admin-api";
import { getAdminSession } from "@/lib/auth";
import { getSurahByNumber, validateAyatNumber, getSuggestedJuz } from "@/lib/quran-surahs";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const json = await request.json();
    const { santriId, updated_on, surah_no, ayat, juz: manualJuz, notes } = json;

    if (!santriId || !updated_on || !surah_no || !ayat) {
      return NextResponse.json({ error: "Data santriId, tanggal, surah, dan ayat wajib diisi" }, { status: 400 });
    }

    const surah = getSurahByNumber(parseInt(surah_no, 10));
    if (!surah) {
      return NextResponse.json({ error: "Nomor surah tidak valid (1-114)" }, { status: 400 });
    }

    const validation = validateAyatNumber(surah.number, parseInt(ayat, 10));
    if (!validation.valid) {
      return NextResponse.json({ error: validation.message }, { status: 400 });
    }

    const calculatedJuz = manualJuz ? parseInt(manualJuz, 10) : getSuggestedJuz(surah.number, parseInt(ayat, 10));

    const result = await db.addSantriHafalanUpdate(santriId, {
      updated_on,
      surah_no: surah.number,
      surah_name: surah.nameLatin,
      ayat: parseInt(ayat, 10),
      juz: calculatedJuz,
      notes: notes || null,
    });

    if (!result) {
      return NextResponse.json({ error: "Santri tidak ditemukan" }, { status: 404 });
    }

    revalidatePath("/data-sebaran");

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menambah update hafalan";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

