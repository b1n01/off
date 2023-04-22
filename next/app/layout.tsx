import React from "react";
import Link from "next/link";

export default async function Layout(
  { children }: { children: React.ReactNode },
) {
  return (
    <html>
      <body>
        <nav>
          <Link href="/">home</Link>
          {" | "}
          <Link href="/auth/login">login page</Link>
          {" | "}
          <Link href="/provider/login">providers page</Link>
          {" | "}
          <Link href="/users-to-follow">users to follow page</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
