import Image from "next/image";
import { Button } from "@/components/Button";
import { HanlderInput } from "@/app/(board)/(account)/profile/HandlerInput";
import profilePic from "@/../public/pic.png";

function Divider() {
  return <span className="border-t border-neutral-800 flex my-8"></span>;
}

export default function Profile() {
  return (
    <div>
      <h1 className="font-bold text-xl">Profile</h1>

      <div className="mt-8">
        <span className="text-sm">Picture</span>
        <div className="flex items-end space-x-2 mt-2">
          <Image src={profilePic} width={96} alt="profile picture" />
          <Button variant="disabled">Edit (comint soon)</Button>
        </div>
      </div>

      <HanlderInput content="pizza" />

      <Divider />

      <h1 className="font-bold text-xl text-amber-600">Danger zone</h1>

      <Button variant="danger" className="mt-8">Delete account</Button>

      <p className="text-sm mt-2 text-neutral-400">
        Delete your account permanently
      </p>
    </div>
  );
}
