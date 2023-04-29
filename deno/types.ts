import { Endpoints, z } from "./deps.ts";

export const FacebookPost = z.object({
  id: z.string(),
  message: z.string().optional(),
  created_time: z.string().datetime({ offset: true }),
  type: z.enum(["link", "offer", "photo", "status", "video"]),
  full_picture: z.string().url().optional(),
  permalink_url: z.string().url(),
});

const providers = z.enum(["facebook", "github", "google"]);

export const User = z.object({
  uuid: z.string().uuid(),
  auth: z.object({
    id: z.string(),
    provider: providers,
  }),
  follows: z.array(z.string()),
  posts: z.array(z.object({
    provider: providers,
    data: z.unknown(),
  })),
  providers: z.array(z.object({
    name: providers,
    accessToken: z.string(),
  })),
});

export type GithubPost =
  Endpoints["GET /users/{username}/events"]["response"]["data"][0];
export type GithubUser = Endpoints["GET /user"]["response"]["data"];

export type User = z.infer<typeof User>;
export type FacebookPost = z.infer<typeof FacebookPost>;
