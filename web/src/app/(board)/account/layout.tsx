import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import accountIcon from "@/../public/account.svg";
import providerIcon from "@/../public/provider.svg";

function Divider() {
  return <span className="border-l border-neutral-800 ml-[50px]"></span>;
}

function MenuItem(
  { children, icon = null, active = false }: {
    children?: ReactNode;
    icon?: ReactNode;
    active?: boolean;
  },
) {
  return (
    <div
      className={`flex space-x-2 font-bold text-sm rounded px-4 py-3 hover:cursor-pointer hover:bg-neutral-800 ${
        active ? "bg-neutral-800 " : ""
      }`}
    >
      {icon ?? null}
      <div>{children}</div>
    </div>
  );
}

export default function AccountLayour({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[1200px] flex flex-row mx-auto my-8">
      <div className="flex flex-col w-[300px] space-y-2">
        <Link href="/account">
          <MenuItem
            icon={<Image src={accountIcon} alt="profile icon" />}
            active
          >
            Profile
          </MenuItem>
        </Link>
        <Link href="/account/providers">
          <MenuItem icon={<Image src={providerIcon} alt="provider icon" />}>
            Providers
          </MenuItem>
        </Link>
      </div>
      <Divider />
      <div className="w-[800px] ml-[50px]">{children}</div>
    </div>
  );
}
