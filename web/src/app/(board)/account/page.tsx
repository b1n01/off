import Image from "next/image";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import profilePic from "@/../public/pic.png";
import checkIcon from "@/../public/check.svg";

function Divider() {
  return <span className="border-t border-neutral-800 flex my-8"></span>;
}

export default function Account() {
  return (
    <div>
      <h1 className="font-bold text-xl">Profile</h1>

      <div className="mt-8">
        <span className="text-sm">Picture</span>
        <div className="flex items-end space-x-2 mt-2">
          <Image src={profilePic} width={96} alt="profile picture" />
          <Button>Edit</Button>
        </div>
      </div>

      <div className="mt-4 flex items-end space-x-2">
        <Input
          label="Handler"
          placeholder="@handler"
          rightIcon={<Image src={checkIcon} width={12} alt="check icon" />}
        />
        <Button>Save</Button>
      </div>
      <p className="text-sm mt-2 text-neutral-400">
        Choose a unique handler for your account
      </p>

      <Divider />

      <h1 className="font-bold text-xl text-amber-600">Danger zone</h1>

      <Button className="bg-amber-600 mt-8">Delete account</Button>

      <p className="text-sm mt-2 text-neutral-400">
        Delete your account forever
      </p>
    </div>
  );
}
