import { ReactNode } from "react";
import Header from "@/app/(board)/Header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
