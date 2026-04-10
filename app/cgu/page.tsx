"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "@/components/ThemeProvider";

function ThemeToggleButton() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
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

export default function CGU() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F1923] text-gray-900 dark:text-white">

      {/* ── HEADER ── */}
      <header className="fixed left-0 right-0 z-50 bg-white/90 dark:bg-[#0F1923]/90 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Flimo" width="36" height="36" />
            <span className="text-xl font-bold tracking-tight dark:text-white">Flimo</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
            <Link href="/#tarifs" className="hover:text-gray-900 dark:hover:text-white transition-colors">Tarifs</Link>
            <Link href="/contact" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggleButton />
            {isSignedIn ? (
              <Link href="/annonces" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors">
                Accéder à mes outils
              </Link>
            ) : (
              <Link href="/sign-up" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors">
                Essayer gratuitement
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main className="pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">

          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-primary transition-colors mb-8">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l&apos;accueil
          </Link>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
            Conditions Générales d&apos;Utilisation
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-base mb-12">Dernière mise à jour : avril 2026</p>

          <div className="space-y-12 text-base leading-[1.7] text-gray-700 dark:text-gray-300">

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Objet</h2>
              <p>
                Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et l&apos;utilisation du service Flimo, accessible à l&apos;adresse <strong className="text-gray-900 dark:text-white">flimo.fr</strong>.
              </p>
              <p className="mt-3">
                Flimo est un service SaaS (Software as a Service) de génération de contenus textuels destiné aux professionnels de l&apos;immobilier. Il permet de produire automatiquement des annonces, emails, scripts d&apos;appel, posts réseaux sociaux et autres contenus liés à l&apos;activité immobilière.
              </p>
              <p className="mt-3">
                Toute utilisation du service implique l&apos;acceptation pleine et entière des présentes CGU.
              </p>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Accès au service</h2>
              <ul className="space-y-2 list-none pl-0">
                {[
                  "L'accès au service Flimo est conditionné à la création d'un compte et à la souscription d'un abonnement mensuel.",
                  "Un essai gratuit de 7 jours est proposé lors de l'inscription. Une carte bancaire valide est requise pour activer l'essai.",
                  "L'abonnement est activé automatiquement à l'issue de la période d'essai, sauf résiliation avant terme.",
                  "La résiliation est possible à tout moment depuis l'espace personnel de l'utilisateur.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-primary shrink-0 mt-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Tarifs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {[
                  { name: "Starter", price: "29€/mois", quota: "70 générations" },
                  { name: "Pro", price: "59€/mois", quota: "150 générations" },
                  { name: "Agence", price: "99€/mois", quota: "Illimité" },
                ].map((plan) => (
                  <div key={plan.name} className="bg-gray-50 dark:bg-[#1a2836] border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
                    <div className="font-bold text-gray-900 dark:text-white">{plan.name}</div>
                    <div className="text-primary font-semibold mt-1">{plan.price}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{plan.quota}</div>
                  </div>
                ))}
              </div>
              <p>Tous les prix sont indiqués TTC. La facturation est mensuelle et automatiquement renouvelée.</p>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Propriété des contenus générés</h2>
              <p>
                Les textes générés par Flimo à partir des informations fournies par l&apos;utilisateur appartiennent intégralement à l&apos;utilisateur. Flimo ne revendique aucun droit de propriété sur ces contenus.
              </p>
              <p className="mt-3">
                Flimo n&apos;est pas responsable de l&apos;usage qui est fait des contenus générés. L&apos;utilisateur reste seul responsable de leur publication, diffusion ou utilisation commerciale.
              </p>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Limitations de responsabilité</h2>
              <ul className="space-y-2 list-none pl-0">
                {[
                  "Le service Flimo est fourni « en l'état », sans garantie d'aucune sorte.",
                  "Flimo ne garantit pas la disponibilité permanente et ininterrompue du service. Des opérations de maintenance peuvent entraîner des interruptions temporaires.",
                  "L'utilisateur reste seul responsable de l'utilisation des textes générés, de leur exactitude et de leur conformité aux réglementations applicables.",
                  "Flimo ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser le service.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-primary shrink-0 mt-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. Données personnelles</h2>
              <p>
                Flimo collecte et traite les données personnelles de ses utilisateurs conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679).
              </p>
              <p className="mt-3">
                Les données collectées sont utilisées exclusivement pour la fourniture du service Flimo. Aucune donnée personnelle n&apos;est revendue à des tiers.
              </p>
              <p className="mt-3">
                Pour toute question relative à vos données, consultez notre{" "}
                <Link href="/confidentialite" className="text-primary hover:underline">politique de confidentialité</Link>.
              </p>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. Résiliation</h2>
              <ul className="space-y-2 list-none pl-0">
                {[
                  "L'utilisateur peut résilier son abonnement à tout moment depuis son espace personnel, sans préavis.",
                  "Aucun remboursement ne sera effectué pour les périodes d'abonnement entamées.",
                  "En cas de résiliation, l'accès au service est maintenu jusqu'à la fin de la période en cours.",
                  "Les données de l'utilisateur sont supprimées dans un délai de 30 jours suivant la résiliation effective.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-primary shrink-0 mt-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">8. Modification des CGU</h2>
              <p>
                Flimo se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle par email. La poursuite de l&apos;utilisation du service après notification vaut acceptation des nouvelles CGU.
              </p>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">9. Droit applicable et juridiction</h2>
              <p>
                Les présentes CGU sont soumises au droit français. En cas de litige relatif à l&apos;interprétation ou à l&apos;exécution des présentes, les parties s&apos;efforceront de trouver une solution amiable. À défaut, les tribunaux de Paris seront seuls compétents.
              </p>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">10. Contact</h2>
              <p>
                Pour toute question relative aux présentes CGU, vous pouvez nous contacter à l&apos;adresse suivante :{" "}
                <a href="mailto:support@flimo.fr" className="text-primary hover:underline">support@flimo.fr</a>
              </p>
            </section>

          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: "#0F1923" }} className="px-4 sm:px-6 pt-12 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Flimo" width="28" height="28" />
              <span className="text-white font-bold">Flimo</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {[
                { label: "Tarifs", href: "/#tarifs" },
                { label: "Contact", href: "/contact" },
                { label: "Mentions légales", href: "/mentions-legales" },
                { label: "CGU", href: "/cgu" },
                { label: "Confidentialité", href: "/confidentialite" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="transition-colors text-sm"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "white")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="border-t mt-8 pt-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)" }}>
                © 2026 Flimo — Tous droits réservés
              </span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)" }}>
                Fait avec ♥ en France 🇫🇷
              </span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
