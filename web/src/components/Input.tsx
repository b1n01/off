import { type ReactNode } from "react";

export function Input(
  {
    value,
    onChange,
    className,
    label,
    placeholder,
    prefix,
    rightIcon,
  }: {
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    label?: string;
    placeholder?: string;
    prefix?: string;
    rightIcon?: ReactNode;
  },
) {
  const prefixElem = prefix
    ? <div className="absolute text-sm top-2 left-4">{prefix}</div>
    : null;
  const labelElem = label ? <span className="text-sm">{label}</span> : null;
  const rightIconElem = rightIcon
    ? <div className="absolute top-4 right-4">{rightIcon}</div>
    : null;

  return (
    <div className={`flex flex-col items-start space-y-2 ${className}`}>
      {labelElem}
      <div className="relative">
        {prefixElem}
        <input
          value={value}
          onChange={onChange}
          className={`rounded h-9 text-sm px-4 py-2 bg-neutral-800 border-2 focus:outline-none border-neutral-800 focus:border-violet-700 ${
            rightIcon ? "pr-10" : ""
          } ${prefix ? "pl-8" : ""}`}
          placeholder={placeholder}
        />
        {rightIconElem}
      </div>
    </div>
  );
}
