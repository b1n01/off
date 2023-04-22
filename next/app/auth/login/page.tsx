"use client";
import { useRouter } from "next/navigation";

export default async function Login() {
  const router = useRouter();

  function login(provider: string) {
    router.push(`/api/${provider}/auth`);
  }

  return (
    <main>
      <p>Here you can login:</p>
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
