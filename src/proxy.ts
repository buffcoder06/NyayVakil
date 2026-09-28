// src/proxy.ts
// Cheap first gate: requests without a session cookie never reach protected pages or
// APIs. It only checks the cookie is present — the session itself is validated
// against the database in the dashboard layout and in every API handler (withAuth).

import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "nv_session";

const PUBLIC_API_PREFIXES = ["/api/auth/login", "/api/auth/signup", "/api/auth/logout"];

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (req.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    if (PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))) return NextResponse.next();
    return NextResponse.json({ success: false, message: "Please sign in again." }, { status: 401 });
  }

  const login = new URL("/login", req.url);
  login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
    "/clients/:path*",
    "/matters/:path*",
    "/hearings/:path*",
    "/fees/:path*",
    "/expenses/:path*",
    "/documents/:path*",
    "/tasks/:path*",
    "/reminders/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/help/:path*",
  ],
};
