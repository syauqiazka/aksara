import { NextResponse } from "next/server";
import { db } from "@/lib/db/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const bankAccounts = await db.getBankAccounts();
    return NextResponse.json(
      { bankAccounts },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { bankAccounts: [] },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  }
}
