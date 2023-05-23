import { ReactNode } from "react";
import { Open_Sans } from "next/font/google";
import "@/style/globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html className={`bg-neutral-900 text-neutral-50 ${openSans.className}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
