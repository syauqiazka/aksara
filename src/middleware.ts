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

    const normalizedSignature = signaturePart.replace(/-/g, "+").replace(/_/g, "/");
    const paddedSignature = normalizedSignature.padEnd(
      Math.ceil(normalizedSignature.length / 4) * 4,
      "="
    );
    const signatureBytes = Uint8Array.from(atob(paddedSignature), (char) => char.charCodeAt(0));
    const validSignature = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      new TextEncoder().encode(payloadPart)
    );
    if (!validSignature) return false;

    const normalizedPayload = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      "="
    );
    const payload = JSON.parse(atob(paddedPayload));
    return (
      typeof payload.email === "string" &&
      typeof payload.exp === "number" &&
      payload.exp > Date.now()
    );
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin/");
  const isPublicAuthEndpoint =
    pathname === "/api/admin/auth/login" || pathname === "/api/admin/auth/logout";

  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const response = NextResponse.next();
  if (isAdminPage) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  const validSession = await hasValidAdminSession(
    request.cookies.get(SESSION_COOKIE_NAME)?.value
  );

  if (pathname === "/admin/login") {
    return validSession
      ? NextResponse.redirect(new URL("/admin", request.url))
      : response;
  }

  if (isPublicAuthEndpoint) return response;

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
