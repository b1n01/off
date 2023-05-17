import { type NextRequest, NextResponse } from "next/server";
import { getData } from "@/lib/server/session";

const publicPaths = [
  // NextJs paths
  new RegExp("^/_next/(image|static).*"),
  new RegExp("^/favicon.ico$"),

  // Public routes
  new RegExp("^/login$"),
  new RegExp("^/$"),
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
