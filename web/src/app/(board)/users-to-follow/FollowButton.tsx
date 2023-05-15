"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { withRepo } from "@/lib/client/repo";

export default function FollowButton(
  { uuid, following }: { uuid: string; following: boolean },
) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [isFollowing, setFollowing] = useState(following);
  const repo = withRepo();

  const follow = async () => {
    setSaving(true);
    await repo.followUser({ uuid });
    setSaving(false);
    setFollowing(true);
    router.refresh();
  };

  const button = <button onClick={follow}>follow</button>;
  return <>{saving ? "saving..." : (isFollowing ? "following" : button)}</>;
}
