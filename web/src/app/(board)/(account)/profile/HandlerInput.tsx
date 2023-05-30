"use client";
import Image from "next/image";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import okIcon from "@/../public/check.svg";
import warningIcon from "@/../public/warning.svg";
import errorIcon from "@/../public/error.svg";
import { useState } from "react";

export function HanlderInput({ content = "" }: { content?: string }) {
  const [value, setValue] = useState(content);
  const [isDirty, setDirty] = useState(false);
  const [isChecking, setChecking] = useState(false);

  const okImage = <Image src={okIcon} height={8} alt="check icon" />;
  const chackingImage = (
    <Image src={warningIcon} height={8} alt="warning icon" />
  );
  const errorImage = <Image src={errorIcon} height={8} alt="error icon" />;

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecking(true);
    setValue(event.target.value);
    setDirty(event.target.value !== content);

    setTimeout(() => {
      // TODO check if handler is available
      setChecking(false);
    }, 1000);
  };

  return (
    <>
      <div className="mt-4 flex items-end space-x-2">
        <Input
          value={value}
          onChange={onChange}
          label="Handler"
          prefix="@"
          placeholder="handler"
          rightIcon={isChecking ? chackingImage : isDirty ? okImage : true}
          //   error=""
        />
        <Button variant={!isChecking && isDirty ? "default" : "disabled"}>
          Save
        </Button>
      </div>
      <p className="text-sm mt-2 text-neutral-400">
        Choose a unique handler for your account
      </p>
    </>
  );
}
