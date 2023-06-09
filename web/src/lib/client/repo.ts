import { withRepo as withMainRepo } from "@/lib/repo";

/**
 * This is a proxy of the real repo. It calls an API that executes the real
 * repo loginc and returns the result.
 */
export function withRepo() {
  const fakeFetcher = () => "";
  const mainRepo = withMainRepo({ fetcher: fakeFetcher, url: "" });

  const repo = {} as typeof mainRepo;
  for (const method of Object.getOwnPropertyNames(mainRepo)) {
    repo[method as keyof typeof repo] = async (data?: object) => {
      const body = data ? JSON.stringify(data) : null;
      const options = { method: "POST", body };
      const response = await fetch(
        new URL(`/repo/proxy/${method}`, process.env.NEXT_PUBLIC_APP_URL).href,
        options,
      );
      return response.json();
    };
  }

  return repo;
}
