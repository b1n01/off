import Image from "next/image";
import { Button } from "@/components/Button";
import logo from "@/../public/logo.svg";

export default function Login() {
  return (
    <div className="h-screen min-h-[400px] grid content-center justify-center">
      <div className="w-56">
        <div className="mb-16 flex justify-center">
          <Image alt="Off logo" src={logo} width={120} />
        </div>
        <div className="flex flex-col space-y-4">
          <a className="grid" href="/api/github/auth">
            <Button>Sign in with Github</Button>
          </a>
          <a className="grid" href="/api/facebook/auth">
            <Button>
              Sign in with Facebook
            </Button>
          </a>
          <a className="grid" href="/api/google/auth">
            <Button>
              Sign in with Google
            </Button>
          </a>
        </div>
        <div className="text-center text-xs mt-12 text-slate-400">
          By continuing, you agree to Off Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}
