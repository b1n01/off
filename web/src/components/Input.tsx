import { type ReactNode } from "react";

export function Input(
  {
    className,
    label,
    placeholder,
    rightIcon,
  }: {
    className?: string;
    label?: string;
    placeholder?: string;
    rightIcon?: ReactNode;
  },
) {
  return (
    <div className={`flex flex-col items-start space-y-2 ${className}`}>
      {label ? <span className="text-sm">{label}</span> : null}
      <div className="relative">
        <input
          className="rounded h-9 text-sm px-4 py-2 bg-neutral-800"
          placeholder={placeholder}
        />
        <div className="absolute top-4 right-4">{rightIcon}</div>
      </div>
    </div>
  );
}
