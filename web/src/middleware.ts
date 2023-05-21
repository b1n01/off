import { type NextRequest, NextResponse } from "next/server";
import { getData } from "@/lib/server/session";

const publicPaths = [
  // Next.js paths
  new RegExp("^/_next/(image|static)"),
  new RegExp("^/favicon.ico$"),

  // Auth
  new RegExp("^/api/(github|facebook|google)/(auth|data)(/callback)?$"),

  // Public routes
  new RegExp("^/$"),
  new RegExp("^/login$"),
];

export async function middleware(request: NextRequest) {
  const isPublicPath = publicPaths.some((path) =>
    path.test(request.nextUrl.pathname)
  );

  if (!isPublicPath) {
    const session = await getData({ request });
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}
