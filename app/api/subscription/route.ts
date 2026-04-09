import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSubscription } from "@/lib/quota";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(null, { status: 401 });
  }

  const sub = await getSubscription(userId);
  if (!sub) {
    return NextResponse.json(null);
  }

  return NextResponse.json({
    plan: sub.plan,
    generations_used: sub.generations_used,
    generations_limit: sub.generations_limit,
    current_period_end: sub.current_period_end,
  });
}
