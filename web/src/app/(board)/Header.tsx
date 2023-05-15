"use client";
import Link from "next/link";

export default function Header() {
  return (
    <nav>
      <Link href="/">home</Link>
      {" | "}
      <Link href="/feed">your feed</Link>
      {" | "}
      <Link href="/users-to-follow">users to follow</Link>
      {" | "}
      <Link href="/login">login</Link>
      {" | "}
      <Link href="/provider">providers</Link>
    </nav>
  );
}
