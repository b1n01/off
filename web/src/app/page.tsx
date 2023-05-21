import { getData, getToken } from "@/lib/server/session";
import { withRepo } from "@/lib/server/repo";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";

export default async function Home() {
  const repo = withRepo();
  const session = await getData();
  const token = await getToken();

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
      <>
        Off Landing Page Here
        <Button href="/login">Sign in</Button>
      </>
    );
  }
}
