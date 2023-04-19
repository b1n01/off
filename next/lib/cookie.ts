import { serialize } from "cookie";
import { cookies } from "next/headers";
import { NextApiRequest, NextApiResponse } from "next";

/** Set a cookie */
export async function setCookie(
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
  { name, request }: { name: string; request?: NextApiRequest },
) {
  if (request) {
    return request.cookies?.[name];
  } else {
    const cookieStore = cookies();
    const cookie = cookieStore.get(name);
    return cookie?.value;
  }
}
