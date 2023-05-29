import { getData, getToken } from "@/lib/server/session";
import { withRepo } from "@/lib/server/repo";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import Feed from "@/app/(board)/feed/page";

export default async function Home() {
  const session = await getData();

  if (!session) {
    return (
      <div className="text-center">
        <div className="m-8">
          This will be an awesome landing page, for now just sign in:
        </div>
        <Button href="/login">Sign in</Button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main>
        <Feed />
      </main>
    </>
  );
}
