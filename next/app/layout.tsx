import React from "react";
import Header from "app/Header";

export default async function Layout(
  { children }: { children: React.ReactNode },
) {
  return (
    <html>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
