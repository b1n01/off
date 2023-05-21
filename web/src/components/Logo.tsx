import Image from "next/image";
import logo from "@/../public/logo.svg";

export function Logo({ width = 120 }) {
  return <Image alt="Off logo" src={logo} width={width} />;
}
