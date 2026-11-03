import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "sahabat_aksara_admin_session";

async function hasValidAdminSession(token?: string): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!token || !secret || secret.length < 32) return false;

  try {
    const [payloadPart, signaturePart, extra] = token.split(".");
    if (!payloadPart || !signaturePart || extra) return false;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const decodeBase64Url = (value: string) => {
      const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
      return Uint8Array.from(
        atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")),
        (char) => char.charCodeAt(0)
      );
    };
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      decodeBase64Url(signaturePart),
      new TextEncoder().encode(payloadPart)
    );
    if (!valid) return false;

    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(payloadPart)));
    return typeof payload.email === "string" &&
      typeof payload.exp === "number" &&
      payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin/");
  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const response = NextResponse.next();
  if (isAdminPage) response.headers.set("X-Robots-Tag", "noindex, nofollow");

  const validSession = await hasValidAdminSession(
    request.cookies.get(SESSION_COOKIE_NAME)?.value
  );

  if (pathname === "/admin/login") {
    return validSession
      ? NextResponse.redirect(new URL("/admin", request.url))
      : response;
  }

  if (pathname === "/api/admin/auth/login" || pathname === "/api/admin/auth/logout") {
    return response;
  }

  if (!validSession) {
    if (isAdminApi) {
      return NextResponse.json(
        { success: false, message: "Sesi admin tidak valid atau telah berakhir" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
