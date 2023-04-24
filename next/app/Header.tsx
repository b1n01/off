"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  return (
    <nav>
      <Link href="/" prefetch={false} onClick={router.refresh}>home</Link>
      {" | "}
      <Link href="/auth/login">login page</Link>
      {" | "}
      <Link href="/provider/login">providers page</Link>
      {" | "}
      <Link href="/users-to-follow" prefetch={false} onClick={router.refresh}>
        users to follow page
      </Link>
    </nav>
  );
}
