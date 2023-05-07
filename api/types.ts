import { Endpoints, z } from "./deps.ts";

//------
// POSTS
//------

export const FacebookPostData = z.object({
  id: z.string(),
  message: z.string().optional(),
  created_time: z.string().datetime({ offset: true }),
  type: z.enum(["link", "offer", "photo", "status", "video"]),
  full_picture: z.string().url().optional(),
  permalink_url: z.string().url(),
});

export const Post = z.object({
  id: z.string(),
  type: z.string(),
  provider: z.string(),
  timestamp: z.string().datetime(),
  data: z.any(),
});

export const FacebookPost = Post.extend({
  type: z.literal("oauth"),
  provider: z.literal("facebook"),
  data: FacebookPostData,
});

export const GithubPost = Post.extend({
  type: z.literal("oauth"),
  provider: z.literal("github"),
  data: z.any(),
});

export const SyndicationPost = Post.extend({
  type: z.literal("syndication"),
  data: z.any(),
});

//----------
// PROVIDERS
//----------

export const Provider = z.object({
  type: z.string(),
  name: z.string(),
  lastFetch: z.string().datetime().nullable(),
});

export const OAuthProvider = Provider.extend({
  type: z.literal("oauth"),
  accessToken: z.string(),
});

export const SyndicationProvider = Provider.extend({
  type: z.literal("syndication"),
  url: z.string().url(),
});

//-----
// USER
//-----

export const User = z.object({
  uuid: z.string().uuid(),
  auth: z.object({
    id: z.string(),
    name: z.string(),
    provider: z.enum(["facebook", "github", "google"]),
  }),
  follows: z.array(z.string().uuid()),
  syndication: z.array(SyndicationPost),
  posts: z.array(z.union([FacebookPost, GithubPost])),
  providers: z.array(z.union([OAuthProvider, SyndicationProvider])),
});

//------
// TYPES
//------

export type User = z.infer<typeof User>;

export type Provider = z.infer<typeof Provider>;
export type OAuthProvider = z.infer<typeof OAuthProvider>;
export type SyndicationProvider = z.infer<typeof SyndicationProvider>;

export type Post = z.infer<typeof Post>;
export type FacebookPost = z.infer<typeof FacebookPost>;
export type FacebookPostData = z.infer<typeof FacebookPostData>;
export type GithubPost = z.infer<typeof GithubPost>;
export type SyndicationPost = z.infer<typeof SyndicationPost>;

export type GithubPostData =
  Endpoints["GET /users/{username}/events"]["response"]["data"][0];
export type GithubUser = Endpoints["GET /user"]["response"]["data"];
