import Link from "next/link";
import { useRepo } from "lib/server/repo";

export default async function Home() {
  const repo = useRepo();

  try {
    const posts = await repo.getFeed();
    return (
      <main>
        <p>Total posts: {posts.length}</p>
        <pre><code>{JSON.stringify(posts, null, 4)}</code></pre>
      </main>
    );
  } catch {
    return (
      <p>
        You are not logged in, go to <Link href="/login">login page</Link>
      </p>
    );
  }
}
