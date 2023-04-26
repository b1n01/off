import Link from "next/link";
import { useRepo } from "lib/server/repo";

export default async function Home() {
  const repo = useRepo();

  try {
    const posts = await repo.getFeed();
    return (
      <main>
        <pre><code>{JSON.stringify(posts, null, 4)}</code></pre>
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
