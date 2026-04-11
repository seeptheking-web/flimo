"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const PLANS = [
  {
    name: "Starter",
    key: "starter",
    price: "29",
    description: "Pour démarrer et tester Flimo",
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID!,
    features: [
      "70 générations / mois",
      "Tous les outils",
      "Support email",
    ],
    isPro: false,
    buttonStyle: "dark" as const,
  },
  {
    name: "Pro",
    key: "pro",
    price: "59",
    description: "Pour les agents actifs au quotidien",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
    features: [
      "150 générations / mois",
      "Tous les outils",
      "Support prioritaire",
    ],
    isPro: true,
    buttonStyle: "green" as const,
  },
  {
    name: "Agence",
    key: "agence",
    price: "99",
    description: "Pour les équipes et agences",
    priceId: process.env.NEXT_PUBLIC_STRIPE_AGENCE_PRICE_ID!,
    features: [
      "Illimité",
      "Tous les outils",
      "Support dédié",
      "Multi-utilisateurs",
    ],
    isPro: false,
    buttonStyle: "dark" as const,
  },
];

type Subscription = {
  plan: string;
  generations_used: number;
  generations_limit: number;
} | null;

function TarifsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get("success");
  const { isSignedIn } = useUser();
  const [subscription, setSubscription] = useState<Subscription>(undefined as unknown as Subscription);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5_000);

    fetch("/api/subscription", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => setSubscription(data))
      .catch(() => setSubscription(null))
      .finally(() => clearTimeout(timer));
  }, []);

  async function handleCheckout(priceId: string, planKey: string) {
    if (!isSignedIn) {
      router.push("/sign-up");
      return;
    }

    if (!priceId || !priceId.startsWith("price_")) {
      setCheckoutError(
        "Le paiement n'est pas encore configuré. Si le problème persiste, contactez support@flimo.fr"
      );
      return;
    }

    setLoadingPlan(planKey);
    setCheckoutError(null);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12_000);

    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
        signal: controller.signal,
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setCheckoutError(
        data.error ?? "Service de paiement temporairement indisponible. Contactez-nous sur support@flimo.fr"
      );
    } catch (err) {
      const isTimeout = err instanceof Error && (err.name === "AbortError" || err.message.includes("abort"));
      setCheckoutError(
        isTimeout
          ? "Le service de paiement met trop de temps à répondre. Réessayez ou contactez support@flimo.fr"
          : "Service de paiement temporairement indisponible. Contactez-nous sur support@flimo.fr"
      );
    } finally {
      clearTimeout(timer);
      setLoadingPlan(null);
    }
  }

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setPortalLoading(false);
    }
  }

  const missingPriceIds = PLANS.some((p) => !p.priceId || !p.priceId.startsWith("price_"));

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Header nav */}
      <header style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <img src="/logo.png" alt="Flimo" width="32" height="32" style={{ borderRadius: 6 }} />
            <span style={{ fontSize: 18, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.02em" }}>Flimo</span>
          </Link>
          <Link href="/" style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", textDecoration: "none" }}>
            ← Retour
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

        {/* Success banner */}
        {success && (
          <div style={{ marginTop: 40, padding: "12px 16px", backgroundColor: "rgba(122,158,126,0.08)", border: "1px solid rgba(122,158,126,0.3)", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: "#4a7a4e", fontWeight: 500 }}>Abonnement activé avec succès.</span>
          </div>
        )}

        {/* Current subscription */}
        {subscription && (
          <div style={{ marginTop: 40, padding: "12px 20px", backgroundColor: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#7a9e7e", backgroundColor: "rgba(122,158,126,0.1)", padding: "3px 10px", borderRadius: 20, textTransform: "capitalize" as const, letterSpacing: "0.04em" }}>
                Plan {subscription.plan}
              </span>
              <span style={{ fontSize: 13, color: "rgba(0,0,0,0.5)" }}>
                {subscription.generations_limit === 999999
                  ? "Générations illimitées"
                  : `${subscription.generations_used} / ${subscription.generations_limit} générations ce mois`}
              </span>
            </div>
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              {portalLoading ? "Chargement…" : "Gérer mon abonnement →"}
            </button>
          </div>
        )}

        {/* Page header */}
        <div style={{ textAlign: "center" as const, padding: "80px 0 64px" }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: "#0a0a0a", margin: "0 0 16px", letterSpacing: "-0.03em", lineHeight: 1.15 }}>
            Choisissez votre plan
          </h1>
          <p style={{ fontSize: 15, color: "rgba(0,0,0,0.4)", margin: 0, letterSpacing: "0.01em" }}>
            7 jours gratuits · Annulable à tout moment · Sans engagement
          </p>
        </div>

        {/* Missing price IDs warning */}
        {missingPriceIds && (
          <div style={{ marginBottom: 40, padding: "12px 16px", backgroundColor: "rgba(250,200,100,0.08)", border: "1px solid rgba(200,160,0,0.2)", borderRadius: 10 }}>
            <p style={{ fontSize: 13, color: "rgba(0,0,0,0.55)", margin: 0 }}>
              Paiement temporairement indisponible. Contactez{" "}
              <a href="mailto:support@flimo.fr" style={{ color: "rgba(0,0,0,0.65)", textDecoration: "underline" }}>support@flimo.fr</a>
              {" "}pour toute question.
            </p>
          </div>
        )}

        {/* Checkout error */}
        {checkoutError && (
          <div style={{ marginBottom: 40, padding: "12px 16px", backgroundColor: "rgba(220,60,60,0.05)", border: "1px solid rgba(220,60,60,0.15)", borderRadius: 10, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <p style={{ fontSize: 13, color: "rgba(0,0,0,0.6)", margin: 0 }}>{checkoutError}</p>
            <button onClick={() => setCheckoutError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(0,0,0,0.3)", fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
          </div>
        )}

        {/* Plans grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {PLANS.map((plan) => {
            const isCurrent = subscription?.plan === plan.key;

            return (
              <div
                key={plan.key}
                style={{
                  backgroundColor: "#ffffff",
                  border: plan.isPro ? "1px solid #7a9e7e" : "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 16,
                  padding: 32,
                  display: "flex",
                  flexDirection: "column" as const,
                  position: "relative" as const,
                }}
              >
                {/* Pro indicator */}
                {plan.isPro && (
                  <div style={{ position: "absolute" as const, top: 20, right: 20 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#7a9e7e", letterSpacing: "0.06em" }}>●</span>
                  </div>
                )}

                {/* Plan name */}
                <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 20 }}>
                  {plan.name}
                </div>

                {/* Price */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
                  <span style={{ fontSize: 52, fontWeight: 800, color: "#0a0a0a", lineHeight: 1, letterSpacing: "-0.03em" }}>
                    {plan.price}€
                  </span>
                  <span style={{ fontSize: 14, color: "rgba(0,0,0,0.35)", marginBottom: 4 }}>/mois</span>
                </div>

                {/* Description */}
                <p style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", margin: "0 0 24px", lineHeight: 1.5 }}>
                  {plan.description}
                </p>

                {/* Divider */}
                <div style={{ height: 1, backgroundColor: "rgba(0,0,0,0.06)", marginBottom: 24 }} />

                {/* Features */}
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column" as const, gap: 10, flex: 1 }}>
                  {plan.features.map((feature) => (
                    <li key={feature} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "rgba(0,0,0,0.65)" }}>
                      <span style={{ color: "#7a9e7e", fontSize: 16, lineHeight: 1, flexShrink: 0 }}>•</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Trial badge */}
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 12, color: "#7a9e7e", backgroundColor: "rgba(122,158,126,0.08)", borderRadius: 6, padding: "4px 10px", display: "inline-block" }}>
                    7 jours offerts
                  </span>
                </div>

                {/* CTA */}
                {isCurrent ? (
                  <button
                    onClick={handlePortal}
                    disabled={portalLoading}
                    style={{ width: "100%", padding: "13px 0", borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)", backgroundColor: "#ffffff", color: "rgba(0,0,0,0.55)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                  >
                    {portalLoading ? "Chargement…" : "Plan actuel — Gérer"}
                  </button>
                ) : (
                  <div>
                    <button
                      onClick={() => handleCheckout(plan.priceId, plan.key)}
                      disabled={loadingPlan !== null}
                      style={{
                        width: "100%",
                        padding: "13px 0",
                        borderRadius: 10,
                        border: "none",
                        backgroundColor: plan.buttonStyle === "green" ? "#7a9e7e" : "#0a0a0a",
                        color: "#ffffff",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: loadingPlan !== null ? "not-allowed" : "pointer",
                        opacity: loadingPlan !== null ? 0.5 : 1,
                        transition: "opacity 0.15s",
                      }}
                    >
                      {loadingPlan === plan.key ? "Chargement…" : "Commencer l'essai gratuit"}
                    </button>
                    <p style={{ textAlign: "center" as const, fontSize: 11, color: "rgba(0,0,0,0.35)", margin: "8px 0 0" }}>
                      Aucun débit pendant 7 jours
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer trust */}
        <div style={{ textAlign: "center" as const, padding: "56px 0 80px", display: "flex", flexDirection: "column" as const, gap: 8, alignItems: "center" }}>
          <p style={{ fontSize: 13, color: "rgba(0,0,0,0.35)", margin: 0 }}>
            Paiement sécurisé par Stripe · Visa · Mastercard
          </p>
          <p style={{ fontSize: 13, color: "rgba(0,0,0,0.3)", margin: 0 }}>
            Résiliable à tout moment depuis votre compte
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TarifsPage() {
  return (
    <Suspense>
      <TarifsContent />
    </Suspense>
  );
}
