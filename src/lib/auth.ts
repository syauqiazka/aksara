import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "sahabat_aksara_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be configured with at least 32 characters");
  }
  return secret;
}

function encode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

export async function getAdminSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const [payloadPart, signaturePart, extra] = token.split(".");
    if (!payloadPart || !signaturePart || extra) return null;

    const expected = Buffer.from(sign(payloadPart), "base64url");
    const received = Buffer.from(signaturePart, "base64url");
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

    const parsed = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8"));
    if (
      typeof parsed.email !== "string" ||
      typeof parsed.exp !== "number" ||
      parsed.exp <= Date.now()
    ) {
      return null;
    }

    return { email: parsed.email };
  } catch {
    return null;
  }
}

export async function createAdminSession(email: string): Promise<void> {
  const cookieStore = await cookies();
  const payload = encode(JSON.stringify({
    email: email.trim().toLowerCase(),
    exp: Date.now() + SESSION_TTL_SECONDS * 1000,
  }));
  const token = `${payload}.${sign(payload)}`;

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
