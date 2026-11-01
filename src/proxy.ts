import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// This function can be marked `async` if using `await` inside
export default async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/register", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/add-book/:path*",
    "/books/:path*",
    "/forgot-password/:path*",
    "/my-books/:path*",
    "/my-borrows/:path*",
    "/my-profile/:path*",
    "/reset-password/:path*",
  ],
};
