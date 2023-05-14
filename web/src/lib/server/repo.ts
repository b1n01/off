import { NextApiRequest } from "next";
import { withRepo as withMainRepo } from "@/lib/repo";
import { getToken } from "@/lib/server/session";
const API_URL = process.env.API_URL as string;

export function withRepo() {
  return withMainRepo({ fetcher: getToken, url: API_URL });
}

export function withRepoFrompages(
  { request }: { request: NextApiRequest },
) {
  const fetcher = () => getToken({ request });
  return withMainRepo({ fetcher, url: API_URL });
}
