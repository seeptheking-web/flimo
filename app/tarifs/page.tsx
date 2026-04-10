"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { useTheme } from "@/components/ThemeProvider";

const PLANS = [
  {
    name: "Starter",
    key: "starter",
    price: "29",
    limit: 70,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID!,
    features: [
      "70 générations / mois",
      "Tous les outils IA",
      "Annonces, emails, posts…",
      "Support par email",
    ],
    highlight: false,
  },
  {
    name: "Pro",
    key: "pro",
    price: "59",
    limit: 150,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
    features: [
      "150 générations / mois",
      "Tous les outils IA",
      "Annonces, emails, posts…",
      "Support prioritaire",
    ],
    highlight: true,
  },
  {
    name: "Agence",
    key: "agence",
    price: "99",
    limit: null,
    priceId: process.env.NEXT_PUBLIC_STRIPE_AGENCE_PRICE_ID!,
    features: [
      "Générations illimitées",
      "Tous les outils IA",
      "Annonces, emails, posts…",
      "Support dédié",
    ],
    highlight: false,
  },
];

type Subscription = {
  plan: string;
  generations_used: number;
  generations_limit: number;
} | null;

function TarifsContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const [subscription, setSubscription] = useState<Subscription>(undefined as unknown as Subscription);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetch("/api/subscription")
      .then((r) => r.json())
      .then((data) => setSubscription(data))
      .catch(() => setSubscription(null));
  }, []);

  async function handleCheckout(priceId: string, planKey: string) {
    setLoadingPlan(planKey);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoadingPlan(null);
    }
  }

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setPortalLoading(false);
    }
  }

  const isLoading = subscription === (undefined as unknown as Subscription);
  const { theme, toggle: toggleTheme } = useTheme();

  function ThemeToggleButton() {
    return (
      <button
        onClick={toggleTheme}
        aria-label="Basculer le mode sombre/clair"
        className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {theme === "dark" ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F1923]">
      {/* Header */}
      <header className="bg-white dark:bg-[#0F1923] border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Flimo" width="36" height="36" />
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Flimo</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggleButton />
            <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              ← Retour aux outils
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        {/* Success banner */}
        {success && (
          <div className="mb-10 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-medium text-green-800">Abonnement activé avec succès !</p>
          </div>
        )}

        {/* Current subscription banner */}
        {subscription && (
          <div className="mb-10 bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full capitalize">
                Plan {subscription.plan}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {subscription.generations_limit === 999999
                  ? "Générations illimitées"
                  : `${subscription.generations_used} / ${subscription.generations_limit} générations utilisées ce mois`}
              </span>
            </div>
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
            >
              {portalLoading ? "Chargement…" : "Gérer mon abonnement →"}
            </button>
          </div>
        )}

        {/* Page title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choisissez votre plan
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Générez du contenu immobilier professionnel, sans effort.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const isCurrent = subscription?.plan === plan.key;
            const isHighlight = plan.highlight;

            return (
              <div
                key={plan.key}
                className={`relative bg-white dark:bg-[#1a2836] rounded-2xl border-2 p-8 flex flex-col transition-shadow ${
                  isHighlight
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "border-gray-100 dark:border-gray-700 shadow-sm"
                }`}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {isHighlight && (
                    <span className="bg-primary text-white text-xs font-semibold px-4 py-1 rounded-full">
                      Populaire
                    </span>
                  )}
                  <span className="bg-green-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                    7 jours gratuits
                  </span>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{plan.name}</h2>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}€</span>
                    <span className="text-gray-400 text-sm">/mois</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {plan.limit ? `${plan.limit} générations / mois` : "Générations illimitées"}
                  </p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                      <svg
                        className="w-4 h-4 text-green-500 mt-0.5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <button
                    onClick={handlePortal}
                    disabled={portalLoading}
                    className="w-full py-3 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-colors disabled:opacity-50"
                  >
                    {portalLoading ? "Chargement…" : "Plan actuel — Gérer"}
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      onClick={() => handleCheckout(plan.priceId, plan.key)}
                      disabled={isLoading || loadingPlan !== null}
                      className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 ${
                        isHighlight
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                    >
                      {loadingPlan === plan.key ? "Chargement…" : "Commencer l'essai gratuit"}
                    </button>
                    <span className="text-xs text-gray-400 dark:text-gray-500">Aucun débit pendant 7 jours</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-10">
          Paiement sécurisé par Stripe · Résiliable à tout moment
        </p>
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
