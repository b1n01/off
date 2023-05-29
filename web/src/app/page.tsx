import { Header } from "@/components/Header";
import Feed from "@/app/(board)/feed/page";

export default async function Home() {
  return (
    <>
      <Header />
      <main>
        <Feed />
      </main>
    </>
  );
}
