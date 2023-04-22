import { NextRequest, NextResponse } from "next/server";
import useRepo from "lib/repo";

export async function POST(request: NextRequest) {
  const repo = await useRepo();
  const data = await request.json() as { uuid: string };
  await repo.followUser({ uuid: data.uuid });

  return NextResponse.json({ message: "ok" });
}
