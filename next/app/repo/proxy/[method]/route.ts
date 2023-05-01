import { NextRequest, NextResponse } from "next/server";
import { isFetchException } from "types/main";
import { useRepo } from "lib/server/repo";

async function handle({ request }: { request: NextRequest }) {
  const repo: Record<string, any> = useRepo();
  const callables = Object.getOwnPropertyNames(repo);
  const method = new URL(request.url).pathname.replace("/repo/proxy/", "");

  if (!callables.includes(method)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  try {
    const body = request.bodyUsed ? await request.json() : null;
    const data = body ? await repo[method](body) : await repo[method]();
    return NextResponse.json(data);
  } catch (e) {
    if (isFetchException(e)) {
      const { status, message } = e;
      return NextResponse.json({ message }, { status });
    } else throw e;
  }
}

export function POST(request: NextRequest) {
  return handle({ request });
}
