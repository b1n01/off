import Link from "next/link";
import { getData, getToken } from "@/lib/server/session";
import { withRepo } from "@/lib/server/repo";
import Header from "@/app/(board)/Header";

export default async function Home() {
  const repo = withRepo();
  const session = await getData();
  const token = getToken();

  try {
    const user = await repo.getUser();
    return (
      <>
        <Header />
        <main>
          <p>Here the session data: {JSON.stringify(session)}</p>
          <p>Here is the session token: {JSON.stringify(token)}</p>
          <hr></hr>
          <p>You follow:</p>
          <pre><code>{JSON.stringify(user.follows, null, 4)}</code></pre>
          <hr></hr>
          <p>Your providers:</p>
          <pre><code>{JSON.stringify(user.providers, null, 4)}</code></pre>
          <hr></hr>
          <p>Your posts:</p>
          <pre><code>{JSON.stringify(user.posts, null, 4)}</code></pre>
        </main>
      </>
    );
  } catch {
    return (
      <main>
        <p>Off Landing Page Here</p>
        <p>
          Go <Link href="/login">HERE</Link> to sign-in
        </p>
      </main>
    );
  }
}
