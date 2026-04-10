import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

const TIMEOUT_MS = 10_000;

export async function POST(req: NextRequest) {
  // ── Log de diagnostic des variables Stripe ────────────────────────────────
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const starterPriceId = process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID;
  const proPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
  const agencePriceId = process.env.NEXT_PUBLIC_STRIPE_AGENCE_PRICE_ID;

  console.log("[Stripe] Variables d'environnement :");
  console.log("  STRIPE_SECRET_KEY         :", stripeKey ? `définie (${stripeKey.slice(0, 7)}...)` : "MANQUANTE ❌");
  console.log("  STARTER_PRICE_ID          :", starterPriceId ? `définie (${starterPriceId.slice(0, 10)}...)` : "MANQUANTE ❌");
  console.log("  PRO_PRICE_ID              :", proPriceId ? `définie (${proPriceId.slice(0, 10)}...)` : "MANQUANTE ❌");
  console.log("  AGENCE_PRICE_ID           :", agencePriceId ? `définie (${agencePriceId.slice(0, 10)}...)` : "MANQUANTE ❌");

  // ── Validation de STRIPE_SECRET_KEY ───────────────────────────────────────
  if (!stripeKey) {
    console.error("[Stripe] ❌ STRIPE_SECRET_KEY manquante — ajoutez-la dans .env.local ou dans les variables Vercel");
    return NextResponse.json(
      { error: "Service de paiement temporairement indisponible. Contactez-nous sur support@flimo.fr" },
      { status: 503 }
    );
  }

  if (!stripeKey.startsWith("sk_")) {
    console.error("[Stripe] ❌ STRIPE_SECRET_KEY invalide — doit commencer par 'sk_test_' ou 'sk_live_', valeur actuelle :", stripeKey.slice(0, 12) + "...");
    return NextResponse.json(
      { error: "Service de paiement temporairement indisponible. Contactez-nous sur support@flimo.fr" },
      { status: 503 }
    );
  }

  const stripe = new Stripe(stripeKey);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  // ── Body ──────────────────────────────────────────────────────────────────
  const body = await req.json().catch(() => ({}));
  const { priceId } = body as { priceId?: string };

  if (!priceId) {
    console.error("[Stripe] ❌ priceId manquant dans le body — vérifiez NEXT_PUBLIC_STRIPE_*_PRICE_ID");
    return NextResponse.json({ error: "Identifiant de plan manquant." }, { status: 400 });
  }

  if (!priceId.startsWith("price_")) {
    console.error("[Stripe] ❌ priceId invalide :", priceId, "— doit commencer par 'price_'. Vérifiez NEXT_PUBLIC_STRIPE_*_PRICE_ID");
    return NextResponse.json(
      { error: "Service de paiement temporairement indisponible. Contactez-nous sur support@flimo.fr" },
      { status: 400 }
    );
  }

  const origin = req.headers.get("origin") ?? "http://localhost:3000";

  // ── Création session Stripe avec timeout 10s ──────────────────────────────
  try {
    const session = await Promise.race([
      stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        client_reference_id: userId,
        subscription_data: { trial_period_days: 7 },
        success_url: `${origin}/dashboard?success=true`,
        cancel_url: `${origin}/tarifs`,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("STRIPE_TIMEOUT")), TIMEOUT_MS)
      ),
    ]);

    console.log("[Stripe] ✅ Session créée :", session.id);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    if (message === "STRIPE_TIMEOUT") {
      console.error("[Stripe] ❌ Timeout — Stripe n'a pas répondu en", TIMEOUT_MS / 1000, "secondes");
      return NextResponse.json(
        { error: "Le service de paiement met trop de temps à répondre. Réessayez dans quelques instants ou contactez support@flimo.fr" },
        { status: 504 }
      );
    }

    console.error("[Stripe] ❌ Erreur Stripe :", message);
    return NextResponse.json(
      { error: "Service de paiement temporairement indisponible. Contactez-nous sur support@flimo.fr" },
      { status: 500 }
    );
  }
}
