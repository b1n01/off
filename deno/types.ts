import { z } from "./deps.ts";

export const FacebookPost = z.object({
  id: z.string(),
  message: z.string().optional(),
  created_time: z.string(),
  // created_time: z.string().datetime(), // todo datetime
  type: z.enum(["link", "offer", "photo", "status", "video"]),
  full_picture: z.string().url().optional(),
  permalink_url: z.string().url(),
});

export const CreateEventPayload = z.object({
  ref: z.string(),
  ref_type: z.string(),
  master_branch: z.string(),
  description: z.string(),
});

export const PushEventPayload = z.object({
  repository_id: z.number(),
  push_id: z.number(),
  size: z.number(),
  distinct_size: z.number(),
  ref: z.string(),
  head: z.string(),
  before: z.string(),
  commits: z.array(z.object(
    {
      sha: z.string(),
      message: z.string(),
      author: z.object({ name: z.string(), email: z.string().email() }),
      url: z.string().url(),
      distinct: z.boolean(),
    },
  )),
});

export const GithubPost = z.object({
  id: z.string(),
  type: z.enum(["CreateEvent", "PushEvent"]),
  actor: z.object({
    id: z.number(),
    login: z.string(),
    display_login: z.string(),
    gravatar_id: z.string(),
    url: z.string().url(),
    avatar_url: z.string().url(),
  }),
  repo: z.object({
    id: z.number(),
    name: z.string(),
    url: z.string().url(),
  }),
  payload: z.union([CreateEventPayload, PushEventPayload]),
  public: z.boolean(),
  created_at: z.string().datetime(),
});

export const Post = FacebookPost;
// export const Post = z.union([FacebookPost, GithubPost]);

export const Provider = z.object({
  name: z.string(),
  accessToken: z.string(),
});

export const User = z.object({
  username: z.string(),
  uuid: z.string().uuid(),
  id: z.string(),
  provider: z.string(),
  follows: z.string().array(),
  posts: Post.array(),
  providers: Provider.array(),
});

export type User = z.infer<typeof User>;
export type Provider = z.infer<typeof Provider>;
export type Post = z.infer<typeof Post>;
export type FacebookPost = z.infer<typeof FacebookPost>;
export type GithubPost = z.infer<typeof GithubPost>;
export type CreateEventPayload = z.infer<typeof CreateEventPayload>;
export type PushEventPayload = z.infer<typeof PushEventPayload>;
