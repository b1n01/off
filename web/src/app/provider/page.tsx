"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { withRepo } from "@/lib/client/repo";

export default function Login() {
  const router = useRouter();
  const [providerRes, setProviderRes] = useState<Object | undefined>(undefined);
  const [user, setUser] = useState<Object | undefined>(undefined);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [syndication, setSyndication] = useState<string>(
    "https://ilpost.it/feed",
  );
  const [syndicationRes, setSyndicationRes] = useState<Object | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const repo = withRepo();
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
    const repo = withRepo();
    const data = await repo.fetchGithubData();
    setProviderRes(data);
    router.refresh();
  };

  const fetchFacebookData = async () => {
    const repo = withRepo();
    const data = await repo.fetchFacebookData();
    setProviderRes(data);
    router.refresh();
  };

  const fetchSyndicationData = async () => {
    const repo = withRepo();
    const data = await repo.fetchSyndicationData();
    setProviderRes(data);
    router.refresh();
  };

  const enableSyndication = async () => {
    const repo = withRepo();
    const data = await repo.sendSyndicationProvider({ url: syndication });
    setSyndicationRes(data);
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
        <p>Here you can add Syndication Feed:</p>
        <input
          value={syndication}
          onChange={(e) => setSyndication(e.target.value)}
        >
        </input>
        <div>
          <button onClick={enableSyndication}>Add</button>
        </div>
        <pre><code>{JSON.stringify(syndicationRes, null, 4)}</code></pre>
        <hr></hr>
        <p>Here you can fetch data from providers:</p>
        <div>
          <button onClick={fetchGithubData}>Github</button>
        </div>
        <div>
          <button onClick={fetchFacebookData}>Facebook</button>
        </div>
        <div>
          <button onClick={fetchSyndicationData}>Syndication</button>
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
