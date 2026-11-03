import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "sahabat_aksara_admin_session";

export async function getAdminSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString("utf-8"));
    if (parsed.email && parsed.exp && parsed.exp > Date.now()) {
      return { email: parsed.email };
    }
  } catch {
    return null;
  }
  return null;
}

export async function createAdminSession(email: string) {
  const cookieStore = await cookies();
  const payload = {
    email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const token = Buffer.from(JSON.stringify(payload)).toString("base64");

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

