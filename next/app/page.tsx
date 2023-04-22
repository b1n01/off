import Link from "next/link";
import { getData, getToken } from "lib/session";
import useRepo from "lib/repo";

export default async function Home() {
  const repo = await useRepo();
  const session = await getData();
  const token = await getToken();

  try {
    const user = await repo.getUser();
    const posts = user.posts.map((post) => (
      <div>
        <a href={post.permalink_url}>
          <div
            style={{
              display: "inline-block",
              margin: 10,
              padding: 10,
              border: "1px solid black",
            }}
          >
            <img src={post.full_picture} height={160} width={160}></img>
            <p>{post.message}</p>
          </div>
        </a>
      </div>
    ));

    return (
      <main>
        <p>Here is the session token: {JSON.stringify(token)}</p>
        <p>Home, here the session data: {JSON.stringify(session)}</p>
        <p>Remote user id: {user.id}</p>
        <div>
          <p>Feed:</p>
          {posts}
        </div>
      </main>
    );
  } catch {
    return (
      <main>
        You are not logged in, go to <Link href="/auth/login">login page</Link>
      </main>
    );
  }
}
