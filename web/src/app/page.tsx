import { getData } from "@/lib/server/session";
import { Header } from "@/components/Header";
import Feed from "@/app/(board)/feed/page";
import Landing from "@/app/Landing";

export default async function Home() {
  const session = await getData();

  if (!session) {
    return <Landing />;
  }

  return (
    <>
      <Header />
      <Feed />
    </>
  );
}
