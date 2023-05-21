import Link from "next/link";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";

export function Header() {
  return (
    <nav className="h-16 bg-neutral-700">
      <div className="max-w-[1200px] p-4 flex h-full mx-auto items-center">
        <Logo width={100} />
        <div className="m-8 flex space-x-4">
          <Link href="/">Home</Link>
          <Link href="/feed">Your feed</Link>
          <Link href="/users-to-follow">Users to follow</Link>
          <Link href="/provider">Providers</Link>
        </div>
        <Button className="ml-auto" href="/login">Sign in</Button>
      </div>
    </nav>
  );
}
