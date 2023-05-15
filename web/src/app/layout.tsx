import { ReactNode } from "react";
import "@/style/globals.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
