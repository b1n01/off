"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function MenuItem(
  { children, icon, href }: {
    children: ReactNode;
    icon: ReactNode;
    href: string;
  },
) {
  const pathname = usePathname();
  const activeStyle = href === pathname ? "bg-neutral-800" : "";
  return (
    <Link href={href}>
      <div
        className={"flex space-x-2 font-bold text-sm rounded px-4 py-3 hover:cursor-pointer hover:bg-neutral-800 " +
          activeStyle}
      >
        {icon}
        <div>{children}</div>
      </div>
    </Link>
  );
}
