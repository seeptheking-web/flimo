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

export default function Confidentialite() {
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
            Politique de confidentialité
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-base mb-12">Dernière mise à jour : avril 2026</p>

          <div className="space-y-12 text-base leading-[1.7] text-gray-700 dark:text-gray-300">

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Responsable du traitement</h2>
              <p>
                Le responsable du traitement des données personnelles collectées via Flimo est :
              </p>
              <div className="mt-3 bg-gray-50 dark:bg-[#1a2836] border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-1">
                <p><span className="font-semibold text-gray-900 dark:text-white">Service :</span> Flimo</p>
                <p><span className="font-semibold text-gray-900 dark:text-white">Email :</span>{" "}
                  <a href="mailto:support@flimo.fr" className="text-primary hover:underline">support@flimo.fr</a>
                </p>
              </div>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Données collectées</h2>
              <p className="mb-4">Flimo collecte les données suivantes :</p>
              <div className="space-y-3">
                {[
                  {
                    titre: "Données d'inscription",
                    detail: "Email et prénom lors de la création de votre compte, gérés via notre prestataire d'authentification Clerk.",
                  },
                  {
                    titre: "Données de paiement",
                    detail: "Informations de carte bancaire traitées exclusivement par Stripe. Flimo ne stocke jamais vos données de paiement.",
                  },
                  {
                    titre: "Données d'utilisation",
                    detail: "Historique de vos générations de contenu (textes produits, formulaires remplis) pour vous permettre de retrouver vos contenus.",
                  },
                  {
                    titre: "Données de navigation",
                    detail: "Cookies techniques uniquement, nécessaires au fonctionnement du service (session, authentification). Aucun cookie publicitaire.",
                  },
                ].map((item) => (
                  <div key={item.titre} className="flex gap-3">
                    <span className="text-primary shrink-0 mt-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span><span className="font-semibold text-gray-900 dark:text-white">{item.titre} :</span> {item.detail}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Finalités du traitement</h2>
              <p className="mb-4">Vos données sont utilisées pour :</p>
              <ul className="space-y-2 list-none pl-0">
                {[
                  "Fournir le service Flimo et gérer votre compte",
                  "Traiter la facturation de votre abonnement",
                  "Répondre à vos demandes de support client",
                  "Améliorer la qualité du service (analyse agrégée et anonymisée)",
                  "Vous envoyer des communications relatives à votre compte (factures, alertes de service)",
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Base légale</h2>
              <p>
                Le traitement de vos données repose sur la base légale de l&apos;<strong className="text-gray-900 dark:text-white">exécution du contrat</strong> (article 6.1.b du RGPD). En souscrivant à Flimo, vous nous autorisez à traiter les données nécessaires à la fourniture du service.
              </p>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Durée de conservation</h2>
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-[#1a2836] border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left px-5 py-3 font-semibold text-gray-900 dark:text-white">Type de données</th>
                      <th className="text-left px-5 py-3 font-semibold text-gray-900 dark:text-white">Durée</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {[
                      { type: "Données de compte", duree: "3 ans après résiliation" },
                      { type: "Données de paiement", duree: "Gérées par Stripe (5–7 ans selon obligations légales)" },
                      { type: "Logs techniques", duree: "12 mois" },
                      { type: "Historique des générations", duree: "Jusqu'à suppression du compte" },
                    ].map((row) => (
                      <tr key={row.type}>
                        <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{row.type}</td>
                        <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{row.duree}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. Destinataires des données</h2>
              <p className="mb-4">
                Vos données peuvent être transmises aux sous-traitants suivants, dans le cadre exclusif de la fourniture du service :
              </p>
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-[#1a2836] border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left px-5 py-3 font-semibold text-gray-900 dark:text-white">Prestataire</th>
                      <th className="text-left px-5 py-3 font-semibold text-gray-900 dark:text-white">Rôle</th>
                      <th className="text-left px-5 py-3 font-semibold text-gray-900 dark:text-white">Localisation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {[
                      { nom: "Clerk", role: "Authentification", localisation: "États-Unis — clauses contractuelles types" },
                      { nom: "Stripe", role: "Paiement", localisation: "États-Unis — Privacy Shield / clauses contractuelles types" },
                      { nom: "Vercel", role: "Hébergement", localisation: "États-Unis — clauses contractuelles types" },
                      { nom: "Anthropic", role: "Intelligence artificielle", localisation: "États-Unis — clauses contractuelles types" },
                    ].map((row) => (
                      <tr key={row.nom}>
                        <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{row.nom}</td>
                        <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{row.role}</td>
                        <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{row.localisation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Aucune donnée personnelle n&apos;est revendue à des tiers à des fins commerciales.
              </p>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. Vos droits</h2>
              <p className="mb-4">
                Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :
              </p>
              <ul className="space-y-2 list-none pl-0 mb-4">
                {[
                  { droit: "Droit d'accès", desc: "Obtenir une copie de vos données personnelles" },
                  { droit: "Droit de rectification", desc: "Corriger des données inexactes ou incomplètes" },
                  { droit: "Droit à l'effacement", desc: "Demander la suppression de vos données" },
                  { droit: "Droit à la portabilité", desc: "Récupérer vos données dans un format lisible" },
                  { droit: "Droit d'opposition", desc: "Vous opposer à certains traitements de vos données" },
                ].map((item) => (
                  <li key={item.droit} className="flex gap-3">
                    <span className="text-primary shrink-0 mt-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span><span className="font-semibold text-gray-900 dark:text-white">{item.droit} :</span> {item.desc}</span>
                  </li>
                ))}
              </ul>
              <p>
                Pour exercer ces droits, contactez-nous à{" "}
                <a href="mailto:support@flimo.fr" className="text-primary hover:underline">support@flimo.fr</a>.
                Nous répondons à toute demande dans un délai maximum de <strong className="text-gray-900 dark:text-white">30 jours</strong>.
              </p>
              <p className="mt-3">
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la{" "}
                <strong className="text-gray-900 dark:text-white">CNIL</strong> :{" "}
                <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cnil.fr</a>
              </p>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">8. Cookies</h2>
              <p>
                Flimo utilise uniquement des <strong className="text-gray-900 dark:text-white">cookies techniques</strong> strictement nécessaires au fonctionnement du service, notamment pour la gestion des sessions d&apos;authentification.
              </p>
              <p className="mt-3">
                Aucun cookie publicitaire, de suivi ou d&apos;analyse comportementale tiers n&apos;est déposé sur votre appareil.
              </p>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">9. Modifications</h2>
              <p>
                Flimo se réserve le droit de mettre à jour cette politique de confidentialité. Toute modification significative sera communiquée par email aux utilisateurs actifs. La version en vigueur est toujours accessible à l&apos;adresse <Link href="/confidentialite" className="text-primary hover:underline">flimo.fr/confidentialite</Link>.
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
