import { NextRequest, NextResponse } from "next/server";
import useRepo from "lib/repo";

async function kebabToCamel({ data }: { data: string }) {
  return data.replace(/-./g, (m) => m.toUpperCase()[1]);
}

async function handle(request: NextRequest) {
  const repo: Record<string, any> = await useRepo();
  const callables = Object.getOwnPropertyNames(repo);
  const methodKebab = new URL(request.url).pathname.replace("/repo/proxy/", "");
  const method = await kebabToCamel({ data: methodKebab });

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

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}
