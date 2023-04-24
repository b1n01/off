"use client";
import Link from "next/link";

export default function Header() {
  return (
    <nav>
      <Link href="/">home</Link>
      {" | "}
      <Link href="/auth/login">login page</Link>
      {" | "}
      <Link href="/provider/login">providers page</Link>
      {" | "}
      <Link href="/users-to-follow">users to follow page</Link>
    </nav>
  );
}
