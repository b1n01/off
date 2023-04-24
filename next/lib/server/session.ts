import { getCookie, setCookie } from "lib/server/cookie";
import { decode, encode } from "lib/jwt";
import { NextApiRequest, NextApiResponse } from "next";

const SECRET = process.env.APP_SECRET as string;

/** Gets the name of the session cookie */
function getCookieName() {
  return process.env.APP_URL?.startsWith("https://")
    ? "secure-off.session-token"
    : "off.session-token";
}

/** Returns the session token (JWT stored in the session cookie) */
export function getToken({ request }: { request?: NextApiRequest } = {}) {
  const name = getCookieName();

  return getCookie({ name, request });
}

/** Returns the content of the session */
export async function getData({ request }: { request?: NextApiRequest } = {}) {
  const token = getToken({ request });

  return token ? await decode({ token, secret: SECRET }) : undefined;
}

/** Set data into the session cookie */
export async function setData(
  { value, response }: { value: object | string; response: NextApiResponse },
) {
  const name = getCookieName();
  const token = await encode({ value, secret: SECRET });
  const cookie = setCookie({ name, value: token, response });

  return cookie;
}
