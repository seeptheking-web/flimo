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
        if (typeof window !== "undefined") {
          window.location.href = data.url;
        }
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
      if (data.url && typeof window !== "undefined") {
        window.location.href = data.url;
      }
    } catch {
      setPortalLoading(false);
    }
  }

  const missingPriceIds = PLANS.some((p) => !p.priceId || !p.priceId.startsWith("price_"));

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid #f0f0f0",
        backgroundColor: "#ffffff",
        position: "sticky" as const,
        top: 0,
        zIndex: 10,
      }}>
        <div style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <img src="/logo.png" alt="Flimo" width="28" height="28" style={{ borderRadius: 6 }} />
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111", letterSpacing: "-0.02em" }}>Flimo</span>
          </Link>
          <Link href="/" style={{ fontSize: 13, color: "#999", textDecoration: "none", letterSpacing: "0" }}>
            ← Retour
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px" }}>

        {/* Success banner */}
        {success && (
          <div style={{
            marginTop: 32,
            padding: "11px 16px",
            backgroundColor: "#f6faf6",
            border: "1px solid #d4e8d4",
            borderRadius: 8,
            fontSize: 13,
            color: "#3a6b3e",
            fontWeight: 500,
          }}>
            Abonnement activé avec succès.
          </div>
        )}

        {/* Current subscription */}
        {subscription && (
          <div style={{
            marginTop: 32,
            padding: "12px 20px",
            backgroundColor: "#fafafa",
            border: "1px solid #ebebeb",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#5a8f5e",
                backgroundColor: "#edf5ed",
                padding: "3px 9px",
                borderRadius: 20,
                textTransform: "uppercase" as const,
                letterSpacing: "0.06em",
              }}>
                {subscription.plan}
              </span>
              <span style={{ fontSize: 13, color: "#999" }}>
                {subscription.generations_limit === 999999
                  ? "Générations illimitées"
                  : `${subscription.generations_used} / ${subscription.generations_limit} générations ce mois`}
              </span>
            </div>
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              style={{
                fontSize: 13,
                color: "#888",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                whiteSpace: "nowrap" as const,
              }}
            >
              {portalLoading ? "Chargement…" : "Gérer →"}
            </button>
          </div>
        )}

        {/* Page header */}
        <div style={{ textAlign: "center" as const, padding: "72px 0 56px" }}>
          <p style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#5a8f5e",
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            margin: "0 0 20px",
          }}>
            Tarifs
          </p>
          <h1 style={{
            fontSize: 38,
            fontWeight: 700,
            color: "#111",
            margin: "0 0 14px",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}>
            Choisissez votre plan
          </h1>
          <p style={{
            fontSize: 15,
            color: "#aaa",
            margin: 0,
            fontWeight: 400,
          }}>
            7 jours gratuits · Annulable à tout moment · Sans engagement
          </p>
        </div>

        {/* Missing price IDs warning */}
        {missingPriceIds && (
          <div style={{
            marginBottom: 32,
            padding: "11px 16px",
            backgroundColor: "#fffdf0",
            border: "1px solid #e8e0b0",
            borderRadius: 8,
          }}>
            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
              Paiement temporairement indisponible. Contactez{" "}
              <a href="mailto:support@flimo.fr" style={{ color: "#555", textDecoration: "underline" }}>support@flimo.fr</a>
              {" "}pour toute question.
            </p>
          </div>
        )}

        {/* Checkout error */}
        {checkoutError && (
          <div style={{
            marginBottom: 32,
            padding: "11px 16px",
            backgroundColor: "#fff8f8",
            border: "1px solid #f0d0d0",
            borderRadius: 8,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}>
            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>{checkoutError}</p>
            <button
              onClick={() => setCheckoutError(null)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#bbb",
                fontSize: 18,
                lineHeight: 1,
                padding: 0,
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Plans grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}>
          {PLANS.map((plan) => {
            const isCurrent = subscription?.plan === plan.key;

            return (
              <div
                key={plan.key}
                style={{
                  backgroundColor: "#ffffff",
                  border: plan.isPro ? "1.5px solid #5a8f5e" : "1px solid #e8e8e8",
                  borderRadius: 12,
                  padding: "28px 28px 24px",
                  display: "flex",
                  flexDirection: "column" as const,
                  position: "relative" as const,
                }}
              >
                {/* Plan name + badge */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 24,
                }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#999",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                  }}>
                    {plan.name}
                  </span>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#5a8f5e",
                    backgroundColor: "#edf5ed",
                    padding: "3px 9px",
                    borderRadius: 20,
                    letterSpacing: "0.02em",
                  }}>
                    7 jours offerts
                  </span>
                </div>

                {/* Price */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 8 }}>
                  <span style={{
                    fontSize: 48,
                    fontWeight: 700,
                    color: "#111",
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                  }}>
                    {plan.price}€
                  </span>
                  <span style={{ fontSize: 13, color: "#bbb", marginBottom: 2 }}>/mois</span>
                </div>

                {/* Description */}
                <p style={{
                  fontSize: 13,
                  color: "#bbb",
                  margin: "0 0 24px",
                  lineHeight: 1.5,
                }}>
                  {plan.description}
                </p>

                {/* Divider */}
                <div style={{ height: 1, backgroundColor: "#f0f0f0", marginBottom: 20 }} />

                {/* Features */}
                <ul style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 28px",
                  display: "flex",
                  flexDirection: "column" as const,
                  gap: 11,
                  flex: 1,
                }}>
                  {plan.features.map((feature) => (
                    <li key={feature} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontSize: 14,
                      color: "#444",
                    }}>
                      <span style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        backgroundColor: "#edf5ed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: 10,
                        color: "#5a8f5e",
                        fontWeight: 700,
                      }}>
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {isCurrent ? (
                  <button
                    onClick={handlePortal}
                    disabled={portalLoading}
                    style={{
                      width: "100%",
                      padding: "12px 0",
                      borderRadius: 8,
                      border: "1px solid #e8e8e8",
                      backgroundColor: "#ffffff",
                      color: "#999",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      letterSpacing: "-0.01em",
                    }}
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
                        padding: "12px 0",
                        borderRadius: 8,
                        border: "none",
                        backgroundColor: plan.buttonStyle === "green" ? "#5a8f5e" : "#111",
                        color: "#ffffff",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: loadingPlan !== null ? "not-allowed" : "pointer",
                        opacity: loadingPlan !== null ? 0.45 : 1,
                        transition: "opacity 0.15s",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {loadingPlan === plan.key ? "Chargement…" : "Commencer l'essai gratuit"}
                    </button>
                    <p style={{
                      textAlign: "center" as const,
                      fontSize: 11,
                      color: "#ccc",
                      margin: "8px 0 0",
                    }}>
                      Aucun débit pendant 7 jours
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer trust */}
        <div style={{
          textAlign: "center" as const,
          padding: "52px 0 72px",
          display: "flex",
          flexDirection: "column" as const,
          gap: 6,
          alignItems: "center",
        }}>
          <p style={{ fontSize: 12, color: "#ccc", margin: 0 }}>
            Paiement sécurisé par Stripe · Visa · Mastercard
          </p>
          <p style={{ fontSize: 12, color: "#ddd", margin: 0 }}>
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
