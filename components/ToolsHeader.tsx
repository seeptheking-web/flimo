"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "@/components/ThemeProvider";

const toolsLeft = [
  { href: "/annonces", label: "Annonces immobilières" },
  { href: "/emails", label: "Emails de prospection" },
  { href: "/social", label: "Posts réseaux sociaux" },
  { href: "/avis", label: "Réponses aux avis" },
  { href: "/compte-rendu", label: "Compte-rendu de visite" },
];

const toolsRight = [
  { href: "/script-appel", label: "Script d'appel" },
  { href: "/negociation", label: "Argumentaire de négociation" },
  { href: "/demande-avis", label: "Demande d'avis client" },
  { href: "/traducteur", label: "Traducteur d'annonces" },
  { href: "/pitch-mandat", label: "Pitch de mandat" },
];

type Subscription = {
  plan: string;
  generations_used: number;
  generations_limit: number;
} | null;

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter",
  pro: "Pro",
  agence: "Agence",
};

function progressColor(used: number, limit: number): string {
  const ratio = used / limit;
  if (ratio >= 1) return "bg-red-500";
  if (ratio >= 0.8) return "bg-orange-500";
  return "bg-primary";
}

function ThemeToggleButton() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Basculer le mode sombre/clair"
      className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
    >
      {theme === "dark" ? (
        /* Sun icon — shown in dark mode */
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
        </svg>
      ) : (
        /* Moon icon — shown in light mode */
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}

export default function ToolsHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [subscription, setSubscription] = useState<Subscription>(undefined as unknown as Subscription);

  // Fetch subscription data
  useEffect(() => {
    fetch("/api/subscription")
      .then((r) => r.json())
      .then((data) => setSubscription(data))
      .catch(() => setSubscription(null));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const allTools = [...toolsLeft, ...toolsRight];
  const isToolActive = allTools.some((t) => t.href === pathname);

  const remaining =
    subscription && subscription.generations_limit !== 999999
      ? subscription.generations_limit - subscription.generations_used
      : null;
  const isOverQuota =
    subscription !== null &&
    subscription !== (undefined as unknown as Subscription) &&
    subscription !== null &&
    subscription?.generations_used >= subscription?.generations_limit &&
    subscription?.generations_limit !== 999999;

  return (
    <header className="bg-white dark:bg-[#0F1923] border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Left: Logo + Dropdown */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.svg" alt="Flimo" width="36" height="36" />
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Flimo</span>
          </Link>

          {/* Outils dropdown */}
          <div ref={ref} className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              onMouseEnter={() => setOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isToolActive
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Outils
              <svg
                className="w-4 h-4 transition-transform duration-200"
                style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown panel */}
            {open && (
              <div
                onMouseLeave={() => setOpen(false)}
                className="absolute left-0 top-full mt-1 w-[480px] bg-white dark:bg-[#1a2836] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-4 z-50"
              >
                <div className="grid grid-cols-2 gap-1">
                  {/* Left column */}
                  <div className="flex flex-col gap-0.5">
                    {toolsLeft.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          pathname === tool.href
                            ? "bg-primary/10 text-primary"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                        {tool.label}
                      </Link>
                    ))}
                  </div>
                  {/* Right column */}
                  <div className="flex flex-col gap-0.5">
                    {toolsRight.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          pathname === tool.href
                            ? "bg-primary/10 text-primary"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                        {tool.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Subscription counter + Badge + Theme toggle + UserButton */}
        <div className="flex items-center gap-3 shrink-0">

          {/* Generation counter */}
          {subscription && subscription !== (undefined as unknown as Subscription) && (
            <div className="hidden sm:flex items-center gap-2">
              {/* Plan badge */}
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                {PLAN_LABELS[subscription.plan] ?? subscription.plan}
              </span>

              {/* Counter + progress bar */}
              {subscription.generations_limit === 999999 ? (
                <span className="text-xs text-gray-400 font-medium">Illimité</span>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-medium ${isOverQuota ? "text-red-600" : "text-gray-600 dark:text-gray-400"}`}>
                    {remaining} / {subscription.generations_limit}
                  </span>
                  <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${progressColor(
                        subscription.generations_used,
                        subscription.generations_limit
                      )}`}
                      style={{
                        width: `${Math.min(100, (subscription.generations_used / subscription.generations_limit) * 100)}%`,
                      }}
                    />
                  </div>
                  {isOverQuota && (
                    <Link
                      href="/tarifs"
                      className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
                    >
                      Upgrade
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {/* No subscription — show upgrade link */}
          {subscription === null && (
            <Link
              href="/tarifs"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
            >
              Choisir un plan
            </Link>
          )}

          {/* Dark/Light mode toggle */}
          <ThemeToggleButton />

          <UserButton />
        </div>
      </div>
    </header>
  );
}
