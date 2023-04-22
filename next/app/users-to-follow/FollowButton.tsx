"use client";
import { useState } from "react";

export default function FollowButton(
  { uuid, following }: { uuid: string; following: boolean },
) {
  const [saving, setSaving] = useState(false);
  const [isFollowing, setFollowing] = useState(following);

  const follow = async () => {
    setSaving(true);
    await fetch("/repo/proxy/followUser", {
      method: "POST",
      body: JSON.stringify({ uuid }),
    });
    setSaving(false);
    setFollowing(true);
  };

  const button = <button onClick={follow}>follow</button>;
  return <>{saving ? "saving..." : (isFollowing ? "following" : button)}</>;
}
