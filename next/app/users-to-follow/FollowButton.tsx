"use client";
import { useState } from "react";

function postFollow(uuid: string) {
  return fetch("/users-to-follow/follow", {
    method: "POST",
    body: JSON.stringify({ uuid }),
  });
}

export default function FollowButton(
  { uuid, following }: { uuid: string; following: boolean },
) {
  const [saving, setSaving] = useState(false);
  const [isFollowing, setFollowing] = useState(following);

  const follow = async () => {
    setSaving(true);
    await postFollow(uuid);
    setSaving(false);
    setFollowing(true);
  };

  const button = <button onClick={follow}>follow</button>;
  return <>{saving ? "saving..." : (isFollowing ? "following" : button)}</>;
}
