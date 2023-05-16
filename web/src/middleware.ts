import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getData } from "@/lib/server/session";

export async function middleware(request: NextRequest) {
  const session = await getData({ request });
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!login|api|_next/static|_next/image|favicon.ico).*)",
  ],
};
