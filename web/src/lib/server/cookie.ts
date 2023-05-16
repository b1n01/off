import type { NextApiRequest, NextApiResponse } from "next";
import type { NextRequest } from "next/server";
import { serialize } from "cookie";

/** Set a cookie */
export function setCookie(
  { name, value, response }: {
    name: string;
    value: string;
    response: NextApiResponse;
  },
) {
  const cookie = serialize(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
  response.setHeader("Set-Cookie", cookie);
  return cookie;
}

/** Returns the value of a cookie */
export async function getCookie(
  { name, request }: { name: string; request?: NextApiRequest | NextRequest },
) {
  if (request) {
    if ("query" in request) {
      // "query" axists as attributes only in NextApiRequest
      return request.cookies?.[name];
    } else {
      // Here request is a NextRequest
      return request.cookies.get(name)?.value;
    }
  } else {
    const headers = await import("next/headers");
    const cookieStore = headers.cookies();
    const cookie = cookieStore.get(name);
    return cookie?.value;
  }
}
