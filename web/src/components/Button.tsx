import { ReactNode } from "react";

export function Button({ children }: { children: ReactNode }) {
  return (
    <button className="rounded px-4 py-2 text-sm font-bold bg-violet-700 hover:bg-violet-600 active:bg-violet-500">
      {children}
    </button>
  );
}
