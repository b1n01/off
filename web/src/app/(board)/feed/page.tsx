/* eslint-disable @next/next/no-img-element */
import type { Post } from "@backend/types";
import { withRepo } from "@/lib/server/repo";
import { ReactNode } from "react";

function formatDate(date: string): string {
  return (new Date(date)).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Box({ children }: { children: ReactNode }) {
  return (
    <div className="bg-neutral-800 rounded-lg p-8 text-sm">
      {children}
    </div>
  );
}

function Header(
  { pic, author, date }: { pic?: string; author: string; date: string },
) {
  return (
    <div className="flex items-center">
      <img
        className="rounded-lg"
        src={pic ??
          "https://placehold.co/64x64/7c3aed/ffffff?text=pic&font=roboto"}
        width={32}
        alt="provider logo"
      />
      <span className="text-base pl-4">{author}</span>
      <span className="text-neutral-400 px-2">·</span>
      <span className="text-neutral-400">
        {formatDate(date)}
      </span>
    </div>
  );
}

function Syndication(post: Post) {
  return (
    <Box>
      <Header author={post.provider} date={post.timestamp} />
      <div className="flex flex-col mt-4">
        <a href={post.data.link}>
          <div className="text-lg font-bold">{post.data.title}</div>
        </a>
        {post.data.description
          ? (
            <div className="text-sm mt-2 text-neutral-300">
              {post.data.description}
            </div>
          )
          : undefined}
      </div>
    </Box>
  );
}

function Facebook(post: Post) {
  let content = undefined;
  switch (post.data.type) {
    case "photo":
      const message = post.data.message
        ? <div className="mb-4 text-lg">{post.data.message}</div>
        : undefined;

      content = (
        <>
          {message}
          <a href={post.data.permalink_url}>
            <img
              className="rounded-lg w-full"
              src={post.data.full_picture}
              alt="pacebook post"
            />
          </a>
        </>
      );
      break;
    case "status":
      content = (
        <div className="text-lg">
          <a href={post.data.permalink_url}>
            {post.data.message ?? "Posted a new status"}
          </a>
        </div>
      );
      break;
    case "link":
      content = (
        <div className="text-lg">
          <a href={post.data.permalink_url}>
            <object
              className="rounded-lg w-auto"
              data="https://placehold.co/160x64/404040/a3a3a3?text=broken-preview&font=open-sans"
              type="image/png"
            >
              <img
                className="rounded-lg w-full"
                src={post.data.full_picture}
                alt="facebook preview"
              />
            </object>
          </a>
        </div>
      );
      break;
    case "video":
      content = (
        <div className="text-lg">
          <a href={post.data.permalink_url}>
            {post.data.message ?? "Go to video 👉"}
          </a>
        </div>
      );
      break;
    default:
      console.log(post);
      break;
  }

  return (
    <Box>
      <Header
        author={`${post.user.name} via Facebook`}
        date={post.timestamp}
      />
      <div className="mt-4">
        {content}
        <p className="text-sm text-neutral-400 mt-2">{post.data.type} post</p>
      </div>
    </Box>
  );
}

function Github(post: Post) {
  let content = undefined;
  switch (post.data.type) {
    case "CreateEvent":
      content = (
        <a href={post.data.repo.url} className="text-lg">
          Created repo {'"' + post.data.repo.name + '"'}
        </a>
      );
      break;
    case "PushEvent":
      content = (
        <a href={post.data.repo.url} className="text-lg">
          {`Pushed ${
            post.data.payload.size > 1 ? post.data.payload.size : " a "
          } commit${post.data.payload.size > 1 ? "s" : ""} on 
          ${'"' + post.data.repo.name + '"'}`}
        </a>
      );
      break;
    default:
      console.log(post);
      break;
  }
  return (
    <Box>
      <Header
        author={`${post.user.name} via Github`}
        date={post.timestamp}
      />
      <div className="mt-4">
        {content}
        <p className="text-sm text-neutral-400 mt-2">type {post.data.type}</p>
      </div>
    </Box>
  );
}

function PostFactory(post: Post) {
  switch (post.type) {
    case "syndication":
      return <Syndication key={post.id} {...post} />;
    case "oauth":
      switch (post.provider) {
        case "facebook":
          return <Facebook key={post.id} {...post} />;
        case "github":
          return <Github key={post.id} {...post} />;
        default:
          console.log(post);
          return undefined;
      }
    default:
      console.log(post);
      return undefined;
  }
}

export default async function Home() {
  const repo = withRepo();
  const posts = await repo.getFeed();
  return (
    <div className="max-w-[1200px] flex justify-center my-8 mx-auto">
      <div className="w-full max-w-[704px]">
        <div className="space-y-4">
          {posts.map(PostFactory)}
        </div>
      </div>
    </div>
  );
}
