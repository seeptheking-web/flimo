import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { getSubscription } from "@/lib/quota";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const sub = await getSubscription(userId);
  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ error: "Aucun abonnement trouvé." }, { status: 404 });
  }

  const origin = req.headers.get("origin") ?? "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${origin}/tarifs`,
  });

  return NextResponse.json({ url: session.url });
}
