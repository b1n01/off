import { Endpoints, z } from "./deps.ts";

export const Post = z.object({
  provider: z.string(),
  id: z.string(),
  type: z.string(),
  // TODO save post date
  // date: z.string().datetime(),
  data: z.unknown(),
});

export const FacebookPost = z.object({
  id: z.string(),
  message: z.string().optional(),
  created_time: z.string().datetime({ offset: true }),
  type: z.enum(["link", "offer", "photo", "status", "video"]),
  full_picture: z.string().url().optional(),
  permalink_url: z.string().url(),
});

export const RSSPost = z.any();

const BaseProvider = z.object({
  name: z.string(),
  lastFetch: z.string().datetime().nullable(),
});

export const OAuthProvider = BaseProvider.extend({
  type: z.literal("oauth"),
  accessToken: z.string(),
});

export const RSSProvider = BaseProvider.extend({
  type: z.literal("rss"),
  url: z.string().url(),
  lastFetch: z.string().datetime().nullable(),
});

export const Provider = z.union([OAuthProvider, RSSProvider]);

export const User = z.object({
  uuid: z.string().uuid(),
  auth: z.object({
    // TODO save the user name
    // name: z.string(),
    id: z.string(),
    provider: z.enum(["facebook", "github", "google"]),
  }),
  follows: z.array(z.string().uuid()),
  syndication: z.array(RSSPost),
  posts: z.array(Post),
  providers: z.array(Provider),
});

export type GithubPost =
  Endpoints["GET /users/{username}/events"]["response"]["data"][0];
export type GithubUser = Endpoints["GET /user"]["response"]["data"];
export type User = z.infer<typeof User>;
export type FacebookPost = z.infer<typeof FacebookPost>;
export type RSSPost = z.infer<typeof RSSPost>;
export type Post = z.infer<typeof Post>;
export type Provider = z.infer<typeof Provider>;
export type OAuthProvider = z.infer<typeof OAuthProvider>;
export type RSSProvider = z.infer<typeof RSSProvider>;
