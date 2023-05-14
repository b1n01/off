import { ReactNode } from "react";
import Header from "@/app/Header";
import "@/style/globals.css";

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
