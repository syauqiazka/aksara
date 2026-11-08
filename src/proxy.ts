import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "sahabat_aksara_admin_session";

function getAllowedOrigins(): string[] {
  const envOrigins = process.env.ALLOWED_ORIGINS;
  if (!envOrigins) return ["localhost:3000", "127.0.0.1:3000"];

  return envOrigins
    .split(",")
    .map((o) => o.trim().replace(/^https?:\/\//, ""))
    .filter(Boolean);
}

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
  const origin = request.headers.get("origin") || "";
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin/");

  // 1. CORS Preflight & Headers
  const allowedOrigins = getAllowedOrigins();
  const normalizedOriginHost = origin.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const isOriginAllowed =
    !origin ||
    allowedOrigins.some((allowed) => normalizedOriginHost === allowed || normalizedOriginHost.endsWith(`.${allowed}`));

  if (request.method === "OPTIONS" && pathname.startsWith("/api/")) {
    const preflightHeaders = new Headers();
    if (isOriginAllowed && origin) {
      preflightHeaders.set("Access-Control-Allow-Origin", origin);
      preflightHeaders.set("Access-Control-Allow-Credentials", "true");
    }
    preflightHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    preflightHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    preflightHeaders.set("Access-Control-Max-Age", "86400");
    return new NextResponse(null, { status: 204, headers: preflightHeaders });
  }

  if (!isAdminPage && !isAdminApi) {
    const response = NextResponse.next();
    if (pathname.startsWith("/api/") && isOriginAllowed && origin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }
    return response;
  }

  const response = NextResponse.next();
  if (isOriginAllowed && origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

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
  matcher: ["/admin/:path*", "/api/:path*"],
};
