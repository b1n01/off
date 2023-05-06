"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRepo } from "lib/client/repo";

export default function Login() {
  const router = useRouter();
  const [providerRes, setProviderRes] = useState<Object | undefined>(undefined);
  const [user, setUser] = useState<Object | undefined>(undefined);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [rss, setRss] = useState<string>("https://ilpost.it/feed");
  const [rssRes, setRssRes] = useState<Object | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const repo = useRepo();
        const user = await repo.getUser();
        setUser(user);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  function enabledProvider(provider: string) {
    router.push(`/api/${provider}/data`);
  }

  const fetchGithubData = async () => {
    const repo = useRepo();
    const data = await repo.fetchGithubData();
    setProviderRes(data);
    router.refresh();
  };

  const fetchFacebookData = async () => {
    const repo = useRepo();
    const data = await repo.fetchFacebookData();
    setProviderRes(data);
    router.refresh();
  };

  const fetchRSSData = async () => {
    const repo = useRepo();
    const data = await repo.fetchRSSData();
    setProviderRes(data);
    router.refresh();
  };

  const enableRss = async () => {
    const repo = useRepo();
    const data = await repo.sendRSSProvider({ url: rss });
    setRssRes(data);
    router.refresh();
  };

  if (isLoading) {
    return <p>Loading...</p>;
  } else if (user) {
    return (
      <main>
        <p>Here you can enable providers:</p>
        <div>
          <button onClick={() => enabledProvider("github")}>Github</button>
        </div>
        <div>
          <button onClick={() => enabledProvider("facebook")}>Facebook</button>
        </div>
        <hr></hr>
        <p>Here you can add RSS:</p>
        <input value={rss} onChange={(e) => setRss(e.target.value)}></input>
        <div>
          <button onClick={enableRss}>Send RSS</button>
        </div>
        <pre><code>{JSON.stringify(rssRes, null, 4)}</code></pre>
        <hr></hr>
        <p>Here you can fetch data from providers:</p>
        <div>
          <button onClick={fetchGithubData}>Github</button>
        </div>
        <div>
          <button onClick={fetchFacebookData}>Facebook</button>
        </div>
        <div>
          <button onClick={fetchRSSData}>RSS</button>
        </div>
        <pre><code>{JSON.stringify(providerRes, null, 4)}</code></pre>
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
