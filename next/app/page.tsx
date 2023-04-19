import Link from "next/link";
import { getData, getToken } from "lib/session";
import useRepo from "lib/repo";

export default async function Home() {
  const repo = await useRepo();
  const session = await getData();
  const token = await getToken();

  try {
    const user = await repo.getUser();
    return (
      <main>
        <p>Here is the session token: {JSON.stringify(token)}</p>
        <p>Home, here the session data: {JSON.stringify(session)}</p>
        <p>Remote user: {JSON.stringify(user)}</p>
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
