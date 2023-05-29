import { ReactNode } from "react";
import Image from "next/image";
import { MenuItem } from "@/app/(board)/(account)/MenuItems";
import accountIcon from "@/../public/account.svg";
import providerIcon from "@/../public/provider.svg";

function Divider() {
  return <span className="border-l border-neutral-800 ml-[50px]"></span>;
}

export default function AccountLayour({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[1200px] flex flex-row mx-auto my-8">
      <div className="flex flex-col w-[300px] space-y-2">
        <MenuItem
          icon={<Image src={accountIcon} alt="profile icon" />}
          href="/profile"
        >
          Profile
        </MenuItem>
        <MenuItem
          icon={<Image src={providerIcon} alt="provider icon" />}
          href="/providers"
        >
          Providers
        </MenuItem>
      </div>
      <Divider />
      <div className="w-[800px] ml-[50px]">{children}</div>
    </div>
  );
}
