import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const response = NextResponse.next();
    // Enforce noindex, nofollow on all admin responses
    response.headers.set("X-Robots-Tag", "noindex, nofollow");

    // Allow /admin/login
    if (pathname === "/admin/login") {
      const session = request.cookies.get("sahabat_aksara_admin_session");
      if (session?.value) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return response;
    }

    // Require session for any other /admin routes
    const session = request.cookies.get("sahabat_aksara_admin_session");
    if (!session || !session.value) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

