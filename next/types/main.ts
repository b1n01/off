import type { NextApiRequest } from "next";

export type TokenFetcher = (
  props?: { request?: NextApiRequest },
) => string | undefined;

export type Exception = {
  type: string;
  status: number;
  message: string;
  [key: string]: unknown;
};

export type FetchException = Exception & {
  type: "FetchException";
};

export function isFetchException(e: unknown): e is FetchException {
  return (e as Exception)?.type === "FetchException";
}
