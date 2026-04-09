import { NextResponse } from "next/server";
import { supabase } from "./supabase";

export type Subscription = {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: "starter" | "pro" | "agence";
  generations_used: number;
  generations_limit: number;
  current_period_end: string | null;
  created_at: string;
};

export async function getSubscription(userId: string): Promise<Subscription | null> {
  // DEBUG
  console.log("[quota] getSubscription — user_id:", userId);

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  // DEBUG
  console.log("[quota] Supabase response — data:", JSON.stringify(data));
  console.log("[quota] Supabase response — error:", JSON.stringify(error));

  return data;
}

export async function checkQuota(userId: string): Promise<NextResponse | null> {
  const sub = await getSubscription(userId);

  if (!sub) {
    return NextResponse.json(
      {
        error: "Abonnement requis pour utiliser cet outil.",
        upgrade: true,
      },
      { status: 402 }
    );
  }

  if (sub.generations_used >= sub.generations_limit) {
    return NextResponse.json(
      {
        error: "Quota mensuel atteint. Passez à un plan supérieur pour continuer.",
        upgrade: true,
      },
      { status: 403 }
    );
  }

  return null;
}

export async function incrementGenerations(userId: string): Promise<void> {
  await supabase.rpc("increment_generations", { p_user_id: userId });
}
