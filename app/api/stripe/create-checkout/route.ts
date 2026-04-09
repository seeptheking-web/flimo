import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { priceId } = await req.json();
  if (!priceId) {
    return NextResponse.json({ error: "priceId manquant." }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: userId,
    success_url: `${origin}/dashboard?success=true`,
    cancel_url: `${origin}/tarifs`,
  });

  return NextResponse.json({ url: session.url });
}
