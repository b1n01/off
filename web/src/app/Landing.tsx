import Image from "next/image";
import { Button } from "@/components/Button";
import logoIcon from "@/../public/logo-bicolor.svg";

export default async function Landing() {
  return (
    <div className="h-screen bg-neutral-900">
      <div className="max-w-[800px] h-screen m-auto flex flex-col justify-center">
        <Image src={logoIcon} alt="logo" width={180} />
        <h1 className="text-4xl font-bold mt-4">The meta-feed platform</h1>
        <div className="space-x-4 mt-4">
          <Button href="/login">Sign in</Button>
          <Button variant="subtle">Features</Button>
        </div>
      </div>
    </div>
  );
}
