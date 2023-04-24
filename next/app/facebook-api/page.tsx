import { useRepo } from "lib/server/repo";

export default async function Home() {
  const repo = useRepo();
  const data = await repo.getFacebookApi();

  return <main>Test facebook API: {JSON.stringify(data)}</main>;
}
