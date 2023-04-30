"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRepo } from "lib/client/repo";

export default function Login() {
  const router = useRouter();
  const [data, setData] = useState<Object | undefined>(undefined);
  const [user, setUser] = useState<Object | undefined>(undefined);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const repo = useRepo();
        const user = await repo.getUser();
        setUser(user);
      } catch {
        setUser(undefined);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  function login(provider: string) {
    router.push(`/api/${provider}/data`);
  }

  const fetchGithubData = async () => {
    const repo = useRepo();
    const data = await repo.getGithubApi();
    setData(data);
    router.refresh();
  };

  const fetchFacebookData = async () => {
    const repo = useRepo();
    const data = await repo.getFacebookApi();
    setData(data);
    router.refresh();
  };

  if (isLoading) {
    return <p>Loading...</p>;
  } else if (user) {
    return (
      <main>
        <p>Here you enable providers:</p>
        <div>
          <button onClick={() => login("github")}>Github</button>
        </div>
        <div>
          <button onClick={() => login("facebook")}>Facebook</button>
        </div>
        <p>Here you fetch can data from providers:</p>
        <div>
          <button onClick={fetchGithubData}>Github</button>
        </div>
        <div>
          <button onClick={fetchFacebookData}>Facebook</button>
        </div>
        <p>{data ? "Ok, data fetched" : ""}</p>
      </main>
    );
  } else {
    return (
      <p>
        You are not logged in, go to <Link href="/login">login page</Link>
      </p>
    );
  }
}
