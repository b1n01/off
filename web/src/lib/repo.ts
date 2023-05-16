import type { TokenFetcher } from "@/types/main";
import type { Post, User } from "@backend/types";

export function withRepo(
  { fetcher, url }: { fetcher: TokenFetcher; url: string },
) {
  /** Get common fetch options */
  async function getOptions() {
    return {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${await fetcher()}`,
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
      const body = await response.json();
      throw {
        type: "FetchException",
        status: response.status,
        message: body.message,
      };
    }

    return response.json();
  }

  return {
    /** Gets the logged user */
    getUser: function () {
      return send({ endpoint: url }) as Promise<User>;
    },

    /** Adds an oauth provider to the logged user */
    sendOAuthProvider: function (
      data: { accessToken: string; name: string; provider: string },
    ) {
      return send({
        endpoint: new URL("provider/oauth", url).href,
        options: {
          method: "POST",
          body: JSON.stringify(data),
        },
      }) as Promise<{ message: string }>;
    },

    /** Adds a Syndication provider to the logged user */
    sendSyndicationProvider: function ({ url: syndication }: { url: string }) {
      return send({
        endpoint: new URL("provider/syndication", url).href,
        options: { method: "POST", body: JSON.stringify({ url: syndication }) },
      }) as Promise<{ message: string }>;
    },

    /** Fetch facebook data */
    fetchFacebookData: function () {
      return send({
        endpoint: new URL("fetch-facebook-posts", url).href,
        options: { method: "POST" },
      }) as Promise<{ message: string }>;
    },

    /** Fetch github data */
    fetchGithubData: function () {
      return send({
        endpoint: new URL("fetch-github-posts", url).href,
        options: { method: "POST" },
      }) as Promise<{ message: string }>;
    },

    fetchSyndicationData: function () {
      return send({
        endpoint: new URL("fetch-syndication-posts", url).href,
        options: { method: "POST" },
      }) as Promise<{ message: string }>;
    },

    /** Get a list of user to follow */
    getUsersToFollow: async function () {
      return send({
        endpoint: new URL("users", url).href,
      }) as Promise<[{ uuid: string; following: boolean }]>;
    },

    /** Follow a user */
    followUser: function ({ uuid }: { uuid: string }) {
      return send({
        endpoint: new URL("follow", url).href,
        options: { method: "POST", body: JSON.stringify({ uuid }) },
      }) as Promise<{ message: string }>;
    },

    /** Get user feed */
    getFeed: function () {
      return send({ endpoint: new URL("feed", url).href }) as Promise<[Post]>;
    },
  };
}
