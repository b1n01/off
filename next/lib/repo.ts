import { getToken } from "lib/session";

const API_URL = process.env.API_URL as string;

/** Fetches the session token */
let fetchToken: () => Promise<string | undefined> = getToken;

/** Get common fetch options */
async function getOptions() {
  return {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${await fetchToken()}`,
    },
  };
}

/** Uses fetch to send requests with the header Authorization header added */
async function send(
  { endpoint, options }: { endpoint: string; options?: object },
): Promise<object> {
  const defaultOptions = await getOptions();

  const response = await fetch(endpoint, {
    ...defaultOptions,
    ...options,
  });

  if (!response.ok) {
    console.log("Error:", endpoint, response.status);
    throw new Error("Failed to fetch data");
  }

  return await response.json();
}

/** The repo. Exposes function to communicate with the API */
const repo = {
  /** Gets the logged user */
  getUser: async function () {
    return send({ endpoint: API_URL });
  },

  /** Adds an adapter to the logged user */
  sendAdapter: async function (
    data: { accessToken: string; provider: string },
  ) {
    return send({
      endpoint: new URL("adapter", API_URL).href,
      options: {
        method: "POST",
        body: JSON.stringify(data),
      },
    });
  },

  /** Get data from facebook api test */
  getFacebookApi: async function () {
    return send({
      endpoint: new URL("facebook-api", API_URL).href,
      options: { method: "POST" },
    });
  },

  /** Get data from github api test */
  getGithubApi: async function () {
    return send({
      endpoint: new URL("github-api", API_URL).href,
      options: { method: "POST" },
    });
  },

  getUsersToFollow: async function () {
    return send({ endpoint: new URL("users-to-follow", API_URL).href });
  },

  followUser: async function ({ uuid }: { uuid: string }) {
    return send({
      endpoint: new URL("users-to-follow", API_URL).href,
      options: { method: "POST", body: JSON.stringify({ uuid }) },
    });
  },
};

/**
 * Returns a repo. It takes a callback that specify how to fetch the session
 * token, by default uses global cookies (not available on client side and
 * in the pages/ folder)
 */
async function useRepo(fetcher?: () => Promise<string | undefined>) {
  fetchToken = fetcher ?? getToken;
  return repo;
}

export default useRepo;
