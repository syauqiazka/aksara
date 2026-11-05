import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/auth";
import { getAdminCredentials } from "@/lib/auth-credentials";

function safeCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export async function POST(request: Request) {
  const { email: expectedEmail, password: expectedPassword } = getAdminCredentials();
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!expectedEmail || !expectedPassword || !sessionSecret || sessionSecret.length < 32) {
    return NextResponse.json(
      { success: false, message: "Akses admin belum dikonfigurasi oleh pengelola." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (
      safeCompare(email, expectedEmail.trim().toLowerCase()) &&
      safeCompare(password, expectedPassword)
    ) {
      await createAdminSession(email);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, message: "Email atau kata sandi salah" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Permintaan tidak dapat diproses" },
      { status: 400 }
    );
  }
}
