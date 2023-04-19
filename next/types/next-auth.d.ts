import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { GithubProfile } from "next-auth/providers/github";

declare module "next-auth" {
  interface Profile extends GithubProfile {}

  interface Session {
    user: {
      id: number;
      provider: string;
    };
    expires: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    provider: string;
  }
}
