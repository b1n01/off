import Link from "next/link";
import { getData, getToken } from "lib/server/session";
import { useRepo } from "lib/server/repo";

export default async function Home() {
  const repo = await useRepo();
  const session = await getData();
  const token = await getToken();

  try {
    const user = await repo.getUser();
    return (
      <main>
        <p>Here is the session token: {JSON.stringify(token)}</p>
        <p>Here the session data: {JSON.stringify(session)}</p>
        <hr></hr>
        <div>
          <p>You follows:</p>
          <pre><code>{JSON.stringify(user.follows, null, 4)}</code></pre>
        </div>
        <hr></hr>
        <div>
          Your posts:
          <pre><code>{JSON.stringify(user.posts, null, 4)}</code></pre>
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
