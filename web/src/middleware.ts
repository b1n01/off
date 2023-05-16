import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getData } from "@/lib/server/session";

export async function middleware(request: NextRequest) {
  // Should I math routes programmatically instead of using
  // the "mather" config???
  // See https://nextjs.org/docs/app/building-your-application/routing/middleware#conditional-statements

  // if (request.nextUrl.pathname.startsWith('/about')) {
  //   return NextResponse.rewrite(new URL('/about-2', request.url));
  // }

  const session = await getData({ request });
  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  /**
   * This matches every routes except for:
   *
   * Nextjs routes:
   *  "/_next/static"
   *  "/_next/image"
   *  "/favicon.ico"
   *
   * Public routes:
   *  "/" <- $ is the end of the string, so just the root /
   *  "/login"
   *
   * See https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
   */
  matcher: [
    "/((?!login|$|_next/static|_next/image|favicon.ico).*)",
  ],
};
