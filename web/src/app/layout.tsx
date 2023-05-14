import { ReactNode } from "react";
import Header from "@/app/Header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
