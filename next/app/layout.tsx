import React from "react";
import Link from "next/link";

export default async function Layout(
  { children }: { children: React.ReactNode },
) {
  return (
    <html>
      <body>
        <nav>
          <p>
            <Link href="/">home</Link>
          </p>
          <p>
            <Link href="/auth/login">login page</Link>
          </p>
          <p>
            <Link href="/provider/login">providers page</Link>
          </p>
        </nav>
        {children}
      </body>
    </html>
  );
}
