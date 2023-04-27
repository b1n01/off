"use client";
import { useRepo } from "lib/client/repo";
import { useState } from "react";

export default function Home() {
  const [data, setData] = useState<Object | undefined>(undefined);

  const fetchData = async () => {
    const repo = useRepo();
    const data = await repo.getGithubApi();
    setData(data);
  };

  if (data) {
    return <main>Github data: {JSON.stringify(data)}</main>;
  } else {
    return (
      <main>
        <p>Fetch Github data:</p>
        <button onClick={fetchData}>Fetch</button>
      </main>
    );
  }
}
