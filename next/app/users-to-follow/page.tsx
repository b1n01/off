import Link from "next/link";
import { useRepo } from "lib/server/repo";
import FollowButton from "app/users-to-follow/FollowButton";

export default async function Home() {
  const repo = await useRepo();

  try {
    const data = await repo.getUsersToFollow() as [
      { uuid: string; following: boolean },
    ];

    const users = data.map((user) => (
      <li key={user.uuid}>
        uuid: {user.uuid} <FollowButton {...user} />
      </li>
    ));

    return <ul>{users}</ul>;
  } catch {
    return (
      <main>
        You are not logged in, go to <Link href="/auth/login">login page</Link>
      </main>
    );
  }
}
