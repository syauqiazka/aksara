import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/admin-api";
import { getAdminSession } from "@/lib/auth";
import { BankAccount } from "@/lib/db/types";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const bankAccounts = await db.getBankAccounts();
    const contactInfo = await db.getContactInfo();
    const socialLinks = await db.getSocialLinks();
    return NextResponse.json({ bankAccounts, contactInfo, socialLinks });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal memuat pengaturan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const json = await request.json();
    const { bankAccounts, contactInfo, socialLinks } = json;

    if (Array.isArray(bankAccounts)) {
      // Clean and sanitize bank accounts array
      const cleanedAccounts: BankAccount[] = bankAccounts.map((acc: Partial<BankAccount>) => ({
        bank: (acc.bank || "").trim(),
        number: (acc.number || "").trim(),
        holder: (acc.holder || "").trim(),
        branch: (acc.branch || "").trim(),
      }));
      await db.updateBankAccounts(cleanedAccounts);
    }

    if (contactInfo && typeof contactInfo === "object") {
      await db.updateContactInfo({
        whatsapp: (contactInfo.whatsapp || "").trim(),
        phone: (contactInfo.phone || "").trim(),
        email: (contactInfo.email || "").trim(),
        address: (contactInfo.address || "").trim(),
      });
    }

    if (socialLinks && typeof socialLinks === "object") {
      await db.updateSocialLinks({
        instagram: (socialLinks.instagram || "").trim(),
        youtube: (socialLinks.youtube || "").trim(),
        tiktok: (socialLinks.tiktok || "").trim(),
      });
    }

    revalidatePath("/donasi");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Pengaturan berhasil disimpan",
      bankAccounts: await db.getBankAccounts(),
      contactInfo: await db.getContactInfo(),
      socialLinks: await db.getSocialLinks(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menyimpan pengaturan";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
