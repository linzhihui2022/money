import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase.middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const origin = url.origin;
  const response = createMiddleware(routing)(request);
  response.headers.set("x-origin", origin);
  return await updateSession(request, response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
