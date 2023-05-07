import { EncryptJWT, jwtDecrypt } from "jose";
import hkdf from "@panva/hkdf";
import { v4 as uuid } from "uuid";

/**
 * This file offers utility to encode and decode encripted JWT
 * It inspider by https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/jwt/index.ts
 */

/** Get a derived key */
function getDerivedKey(secret: string) {
  return hkdf("sha256", secret, "", "Off Encryption Key", 32);
}

/** Create an encripted JWT with the given payload */
export async function encode(
  { value, secret }: { value: object | string; secret: string },
) {
  const payload = { data: value };
  const now = Math.floor(Date.now() / 1000);
  const maxAge = 30 * 24 * 60 * 60; // 30 days
  const derivedKey = await getDerivedKey(secret);

  return new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(now + maxAge)
    .setJti(uuid())
    .encrypt(derivedKey);
}

/** Decode a JWT and returns it's payload */
export async function decode(
  { token, secret }: { token: string; secret: string },
) {
  const derivedKey = await getDerivedKey(secret);
  const { payload } = await jwtDecrypt(token, derivedKey);

  return payload.data;
}
