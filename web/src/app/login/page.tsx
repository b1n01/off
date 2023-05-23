import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";

export default function Login() {
  return (
    <div className="h-screen min-h-[400px] grid content-center justify-center">
      <div className="w-56">
        <div className="flex justify-center mb-16">
          <Logo />
        </div>
        <div className="flex flex-col space-y-4">
          <Button href="/api/github/auth" useLink={false}>
            Sign in with Github
          </Button>
          <Button href="/api/facebook/auth" useLink={false}>
            Sign in with Facebook
          </Button>
          <Button href="/api/google/auth" useLink={false}>
            Sign in with Google
          </Button>
        </div>
        <div className="text-center text-xs mt-12 text-neutral-400">
          By continuing, you agree to Off Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}
