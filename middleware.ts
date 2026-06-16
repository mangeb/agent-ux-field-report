import { NextRequest, NextResponse } from "next/server";

// Simple password gate. Reads SITE_PASSWORD from env. If the user has a
// matching cookie, they pass through. Otherwise they get the /login page.
export const config = {
  // Skip Next.js internals and static assets; run everywhere else.
  matcher: ["/((?!_next/|favicon.ico|api/login|login).*)"],
};

export function middleware(req: NextRequest) {
  const password = process.env.SITE_PASSWORD;

  // If no password is configured, leave the site open.
  if (!password) return NextResponse.next();

  const cookie = req.cookies.get("site_auth")?.value;
  if (cookie && cookie === password) {
    return NextResponse.next();
  }

  // Not authenticated — redirect to /login, preserving the original path.
  const url = req.nextUrl.clone();
  const from = url.pathname + url.search;
  url.pathname = "/login";
  url.search = `?from=${encodeURIComponent(from)}`;
  return NextResponse.redirect(url);
}
