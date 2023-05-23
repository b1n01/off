import Link from "next/link";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { getData } from "@/lib/server/session";

export async function Header() {
  const session = await getData();

  const links = (
    <div className="ml-8 flex space-x-8 text-sm font-semibold">
      <Link href="/">Home</Link>
      <Link href="/feed">Your feed</Link>
      <Link href="/users-to-follow">Users to follow</Link>
      <Link href="/provider">Providers</Link>
    </div>
  );

  const signInButton = (
    <Button className="ml-auto" href="/login">Sign in</Button>
  );
  const signOutButton = (
    <Button className="ml-auto" subtle={true} href="/logout">Sign out</Button>
  );

  return (
    <nav className="h-16 bg-neutral-800">
      <div className="max-w-[1200px] p-4 flex h-full mx-auto items-center">
        <Logo width={100} />
        {session ? links : undefined}
        {session ? signOutButton : signInButton}
      </div>
    </nav>
  );
}
