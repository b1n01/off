import { NextRequest, NextResponse } from "next/server";
import { useRepo } from "lib/server/repo";

async function handle({ request }: { request: NextRequest }) {
  const repo: Record<string, any> = useRepo();
  const callables = Object.getOwnPropertyNames(repo);
  const method = new URL(request.url).pathname.replace("/repo/proxy/", "");

  if (!callables.includes(method)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    var data = await repo[method](body);
  } catch {
    var data = await repo[method]();
  }

  return NextResponse.json(data);
}

export function GET(request: NextRequest) {
  return handle({ request });
}

export function POST(request: NextRequest) {
  return handle({ request });
}

export function PUT(request: NextRequest) {
  return handle({ request });
}

export function DELETE(request: NextRequest) {
  return handle({ request });
}
