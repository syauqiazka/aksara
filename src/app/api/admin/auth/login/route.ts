import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const expectedEmail = process.env.ADMIN_DEFAULT_EMAIL || "admin@sahabataksara.id";
    const expectedPassword = process.env.ADMIN_DEFAULT_PASSWORD || "aksaramulia2026";

    if (
      email?.toLowerCase().trim() === expectedEmail.toLowerCase().trim() &&
      password === expectedPassword
    ) {
      await createAdminSession(email);
      return NextResponse.json({ success: true });
    }

    // Generic error as per AGENTS.md §4
    return NextResponse.json(
      { success: false, message: "Email atau kata sandi salah" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Email atau kata sandi salah" },
      { status: 500 }
    );
  }
}

