"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  function login(provider: string) {
    router.push(`/api/${provider}/adapter`);
  }

  return (
    <main>
      <p>
        <Link href="/facebook-api">fetch facebook data</Link>
        {" | "}
        <Link href="/github-api">fetch github data</Link>
      </p>
      <p>Here you enable providers:</p>
      <div>
        <button onClick={() => login("github")}>Github</button>
      </div>
      <div>
        <button onClick={() => login("facebook")}>Facebook</button>
      </div>
      <div>
        <button onClick={() => login("google")}>Google</button>
      </div>
    </main>
  );
}
