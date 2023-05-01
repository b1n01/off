import { NextRequest, NextResponse } from "next/server";
import { useRepo } from "lib/server/repo";

async function handle({ request }: { request: NextRequest }) {
  const repo: Record<string, any> = useRepo();
  const callables = Object.getOwnPropertyNames(repo);
  const method = new URL(request.url).pathname.replace("/repo/proxy/", "");

  if (!callables.includes(method)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const body = request.bodyUsed ? await request.json() : null;

  try {
    let data;
    if (body) {
      data = await repo[method](body);
    } else {
      data = await repo[method]();
    }
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof Error) {
      console.error("Repo proxy:", e.cause);
      return NextResponse.json(e.cause, { status: 400 });
    } else throw e;
  }
}

export function POST(request: NextRequest) {
  return handle({ request });
}
