import { ReactNode } from "react";
import "@/style/globals.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html className="bg-neutral-800 text-slate-50">
      <body>
        {children}
      </body>
    </html>
  );
}
