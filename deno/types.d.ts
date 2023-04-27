// Mongo
// export type User = {
//   uuid: string;
//   id: string;
//   provider: string;
//   follows: [string];
//   posts: [Post];
//   providers: [Provider];
// };

// export type Provider = {
//   name: string;
//   accessToken: string;
// };

// export type Post = FacebookPost | GithubPost;

// export type FacebookPost = {
//   id: string;
//   created_time: string;
//   type: "link" | "offer" | "photo" | "status" | "video";
//   full_picture: string;
//   permalink_url: string;
// };

// export type GithubPost = {
//   id: string;
//   type:
//     | "CommitCommentEvent"
//     | "CreateEvent"
//     | "DeleteEvent"
//     | "ForkEvent"
//     | "GollumEvent"
//     | "IssueCommentEvent"
//     | "IssuesEvent"
//     | "MemberEvent"
//     | "PublicEvent"
//     | "PullRequestEvent"
//     | "PullRequestReviewEvent"
//     | "PullRequestReviewCommentEvent"
//     | "PullRequestReviewThreadEvent"
//     | "PushEvent"
//     | "ReleaseEvent"
//     | "SponsorshipEvent"
//     | "WatchEvent";
//   actor: {
//     id: number;
//     login: string;
//     display_login: string;
//     gravatar_id: string;
//     url: string;
//     avatar_url: string;
//   };
//   repo: {
//     id: number;
//     name: string;
//     url: string;
//   };
//   payload:
//     | GithubCommitCommentEventPayload
//     | GithubCreateEventPayload
//     | GithubDeleteEventPayload
//     | GithubForkEventPayload
//     | GithubGollumEventPayload
//     | GithubIssueCommentEventPayload
//     | GithubIssuesEventPayload
//     | GithubMemberEventPayload
//     | GithubPublicEventPayload
//     | GithubPullRequestEventPayload
//     | GithubPullRequestReviewEventPayload
//     | GithubPullRequestReviewCommentEventPayload
//     | GithubPullRequestReviewThreadEventPayload
//     | GithubPushEventPayload
//     | GithubReleaseEventPayload
//     | GithubSponsorshipEventPayload
//     | GithubWatchEventPayload;
//   public: boolean;
//   created_at: string;
// };

// export type GithubCommitCommentEventPayload = {
//   action: string;
// };

// export type GithubCreateEventPayload = {};
// export type GithubDeleteEventPayload = {};
// export type GithubForkEventPayload = {};
// export type GithubGollumEventPayload = {};
// export type GithubIssueCommentEventPayload = {};
// export type GithubIssuesEventPayload = {};
// export type GithubMemberEventPayload = {};
// export type GithubPublicEventPayload = {};
// export type GithubPullRequestEventPayload = {};
// export type GithubPullRequestReviewEventPayload = {};
// export type GithubPullRequestReviewCommentEventPayload = {};
// export type GithubPullRequestReviewThreadEventPayload = {};
// export type GithubPushEventPayload = {
//   repository_id: number;
//   push_id: number;
//   size: number;
//   distinct_size: number;
//   ref: string;
//   head: string;
//   before: string;
//   commits: [
//     {
//       sha: string;
//       message: string;
//       author: { name: string; email: string };
//       url: string;
//       distinct: boolean;
//     },
//   ];
// };
// export type GithubReleaseEventPayload = {};
// export type GithubSponsorshipEventPayload = {};
// export type GithubWatchEventPayload = {};

import type { User } from "./types.ts";

// Express
declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
