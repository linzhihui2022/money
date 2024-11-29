import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  console.log({ cookies: request.cookies });
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/*",
};
