import Link from "next/link";
import { useRepo } from "@/lib/server/repo";
import FollowButton from "@/app/users-to-follow/FollowButton";

export default async function Home() {
  const repo = useRepo();

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
