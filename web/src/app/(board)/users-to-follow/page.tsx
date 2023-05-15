import Link from "next/link";
import { withRepo } from "@/lib/server/repo";
import FollowButton from "@/app/(board)/users-to-follow/FollowButton";

export default async function Home() {
  const repo = withRepo();

  try {
    const data = await repo.getUsersToFollow();
    const users = data.map((user) => (
      <li key={user.uuid}>
        uuid: {user.uuid} <FollowButton {...user} />
      </li>
    ));

    return <ul>{users}</ul>;
  } catch {
    return (
      <p>
        You are not logged in, go to <Link href="/login">login page</Link>
      </p>
    );
  }
}
