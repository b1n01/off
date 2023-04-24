import type { NextApiRequest } from "next";

export type TokenFetcher = (
  { request }?: { request?: NextApiRequest },
) => Promise<string | undefined>;
