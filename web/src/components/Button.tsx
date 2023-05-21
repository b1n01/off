import { type ReactNode } from "react";
import Link from "next/link";

export function Button(
  { children, className = "", href = "", useLink = true }: {
    children: ReactNode;
    className?: string;
    href?: string;
    useLink?: boolean;
  },
) {
  const props = {
    children,
    href,
    className: `rounded px-4 py-2 text-center text-sm font-bold bg-violet-700 
    hover:bg-violet-600 active:bg-violet-500 ${className}`,
  };

  return props.href
    ? useLink ? <Link {...props} /> : <a {...props} />
    : <button {...props} />;
}
