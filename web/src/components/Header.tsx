import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { getData } from "@/lib/server/session";
import profilePic from "@/../public/pic.png";
import searchIcon from "@/../public/search.svg";

function Divider() {
  return <span className="border-l h-8 border-neutral-700"></span>;
}

function Account() {
  return (
    <Link href="/profile">
      <Image
        src={profilePic}
        width={32}
        alt="Account icon"
        className="rounded"
      />
    </Link>
  );
}

export async function Header() {
  const session = await getData();

  const actions = (
    <div className="flex space-x-8 text-sm font-bold items-center">
      <Link href="/">Feed</Link>
      <Link href="/wall">Wall</Link>
      <Link href="/users-to-follow">Follow</Link>
      <Image
        src={searchIcon}
        width={16}
        alt="Search icon"
        className="hover:cursor-pointer"
      />
      <Divider />
    </div>
  );

  return (
    <nav className="h-16 bg-neutral-800">
      <div className="max-w-[1200px] flex h-full mx-auto">
        <Logo width={100} />
        <div className="flex space-x-8 ml-auto items-center">
          {session ? actions : undefined}
          {session ? <Account /> : <Button href="/login">Sign in</Button>}
        </div>
      </div>
    </nav>
  );
}
