import { withRepo } from "@/lib/server/repo";
import { Button } from "@/components/Button";
import Image from "next/image";
import verified from "@/../public/verified.svg";

function Post({ id, message }: { id: string; message: string }) {
  return (
    <div key={id} className="bg-neutral-800 rounded p-8 text-sm">{message}</div>
  );
}

export default async function Wall() {
  const repo = withRepo();
  const user = await repo.getUser();
  const posts = user.posts.map((post) => <Post {...post.data} />);

  return (
    <>
      <div className="max-w-[1200px] flex justify-center mt-8 mx-auto">
        <div className="max-w-[704px]">
          <div className="flex flex-col items-start space-y-4">
            <div className="flex space-x-4">
              <span className="text-lg font-bold">{user.auth.name}</span>
              <Image alt="Verified mark" src={verified} width={20} />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-neutral-400">25.267 followers</span>
              <Button>Follow</Button>
            </div>
          </div>
          <div className="mt-4 space-y-4">{posts}</div>
        </div>
      </div>
    </>
  );
}
