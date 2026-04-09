import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PLAN_LIMITS: Record<string, number> = {
  starter: 70,
  pro: 150,
  agence: 999999,
};

function getPlanFromPriceId(priceId: string): string | null {
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID) return "starter";
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) return "pro";
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_AGENCE_PRICE_ID) return "agence";
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook signature invalide." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (!userId || !subscriptionId) break;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const item = subscription.items.data[0];
      const priceId = item?.price.id;
      const plan = priceId ? getPlanFromPriceId(priceId) : null;

      if (!plan) break;

      const limit = PLAN_LIMITS[plan];
      const periodEnd = item?.current_period_end
        ? new Date(item.current_period_end * 1000).toISOString()
        : null;

      await supabase.from("subscriptions").upsert(
        {
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          plan,
          generations_used: 0,
          generations_limit: limit,
          current_period_end: periodEnd,
        },
        { onConflict: "user_id" }
      );
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await supabase
        .from("subscriptions")
        .delete()
        .eq("stripe_subscription_id", subscription.id);
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = (invoice as { subscription?: string }).subscription;
      if (!subscriptionId || invoice.billing_reason !== "subscription_cycle") break;

      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      const subItem = sub.items.data[0];
      const periodEnd = subItem?.current_period_end
        ? new Date(subItem.current_period_end * 1000).toISOString()
        : null;

      await supabase
        .from("subscriptions")
        .update({ generations_used: 0, current_period_end: periodEnd })
        .eq("stripe_subscription_id", subscriptionId);
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
