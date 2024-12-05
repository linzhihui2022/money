import { refresh } from "actions/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const lastCheck = request.cookies.get("last-check")?.value;
  const response = NextResponse.next();
  if (!lastCheck) {
    response.cookies.set({
      name: "last-check",
      value: `${new Date().getTime()}`,
      maxAge: 60 * 5,
    });
    const res = await refresh();
    if (res?.status === "error") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
