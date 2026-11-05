import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminSession, createAdminSession } from "@/lib/auth";
import { getAdminCredentials, updateAdminCredentials } from "@/lib/auth-credentials";

function safeCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

// GET: Returns currently active admin email
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Sesi tidak valid atau telah berakhir" }, { status: 401 });
  }

  const { email } = getAdminCredentials();
  return NextResponse.json({ email: email || session.email });
}

// POST: Changes admin email and/or password
export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Sesi tidak valid atau telah berakhir" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newEmail = typeof body.newEmail === "string" ? body.newEmail.trim().toLowerCase() : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
    const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";

    // 1. Verify current password
    const { password: activePassword, email: activeEmail } = getAdminCredentials();
    if (!currentPassword || !safeCompare(currentPassword, activePassword)) {
      return NextResponse.json(
        { error: "Kata sandi saat ini tidak cocok. Silakan periksa kembali." },
        { status: 403 }
      );
    }

    // 2. Validate email
    const targetEmail = newEmail || activeEmail;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(targetEmail)) {
      return NextResponse.json(
        { error: "Format alamat email tidak valid." },
        { status: 400 }
      );
    }

    // 3. Validate new password if provided
    let targetPassword: string | undefined = undefined;
    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: "Kata sandi baru minimal harus 8 karakter." },
          { status: 400 }
        );
      }
      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { error: "Konfirmasi kata sandi baru tidak cocok." },
          { status: 400 }
        );
      }
      targetPassword = newPassword;
    }

    // 4. Update credentials
    const updated = await updateAdminCredentials(targetEmail, targetPassword);

    // 5. Re-issue session with updated email
    await createAdminSession(updated.email);

    return NextResponse.json({
      success: true,
      email: updated.email,
      message: "Kredensial akun admin berhasil diperbarui.",
    });
  } catch (err) {
    console.error("[update-credentials] Error:", err);
    return NextResponse.json(
      { error: "Gagal memperbarui kredensial akun." },
      { status: 500 }
    );
  }
}

