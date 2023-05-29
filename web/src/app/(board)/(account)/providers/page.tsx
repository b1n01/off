import Image from "next/image";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import profilePic from "@/../public/pic.png";
import checkIcon from "@/../public/check.svg";

function Divider() {
  return <span className="border-t border-neutral-800 flex my-8"></span>;
}

export default function Providers() {
  return (
    <div>
      <h1 className="font-bold text-xl">Providers</h1>
    </div>
  );
}
