import { type ReactNode } from "react";
import Link from "next/link";
import { out } from "outclass";

export function Button(
  {
    children,
    className,
    href = "",
    useLink = true,
    variant = "default",
  }: {
    children?: ReactNode;
    className?: string;
    href?: string;
    useLink?: boolean;
    variant?: "default" | "subtle" | "disabled" | "danger";
  },
) {
  let variantStyle;

  switch (variant) {
    case "subtle":
      variantStyle =
        "bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-800";
      break;
    case "disabled":
      variantStyle = "bg-neutral-800 text-neutral-500 hover:cursor-default";
      break;
    case "danger":
      variantStyle = "bg-amber-600 hover:bg-orange-600 active:bg-orange-500";
      break;
    default:
      variantStyle = "bg-violet-700 hover:bg-violet-600 active:bg-violet-700";
      break;
  }

  const props = {
    children,
    href,
    className:
      `rounded px-4 py-2 text-center text-sm font-bold ${variantStyle} ${className}`,
  };

  return props.href
    ? useLink ? <Link {...props} /> : <a {...props} />
    : <button {...props} />;
}
