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

export default function MentionsLegales() {
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
            Mentions légales
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-base mb-12">Dernière mise à jour : avril 2026</p>

          <div className="space-y-12 text-base leading-[1.7] text-gray-700 dark:text-gray-300">

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Éditeur du site</h2>
              <div className="space-y-2">
                <p><span className="font-semibold text-gray-900 dark:text-white">Nom du site :</span> Flimo</p>
                <p><span className="font-semibold text-gray-900 dark:text-white">URL :</span> flimo.fr</p>
                <p><span className="font-semibold text-gray-900 dark:text-white">Directeur de publication :</span> [Prénom Nom]</p>
                <p><span className="font-semibold text-gray-900 dark:text-white">Email de contact :</span>{" "}
                  <a href="mailto:support@flimo.fr" className="text-primary hover:underline">support@flimo.fr</a>
                </p>
                <p><span className="font-semibold text-gray-900 dark:text-white">Statut :</span> Auto-entrepreneur / SASU (à préciser)</p>
                <p><span className="font-semibold text-gray-900 dark:text-white">SIRET :</span> En cours d&apos;immatriculation</p>
              </div>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Hébergement</h2>
              <div className="space-y-2">
                <p><span className="font-semibold text-gray-900 dark:text-white">Hébergeur :</span> Vercel Inc.</p>
                <p><span className="font-semibold text-gray-900 dark:text-white">Adresse :</span> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</p>
                <p><span className="font-semibold text-gray-900 dark:text-white">Site web :</span>{" "}
                  <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">vercel.com</a>
                </p>
              </div>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Propriété intellectuelle</h2>
              <p>
                L&apos;ensemble des contenus présents sur le site Flimo (textes, images, logos, graphismes, structure) sont protégés par le droit d&apos;auteur et restent la propriété exclusive de Flimo, sauf mention contraire.
              </p>
              <p className="mt-3">
                Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable de Flimo.
              </p>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Données personnelles</h2>
              <div className="space-y-3">
                <p><span className="font-semibold text-gray-900 dark:text-white">Responsable du traitement :</span> [Prénom Nom] — Flimo</p>
                <p><span className="font-semibold text-gray-900 dark:text-white">Finalité :</span> Fourniture du service Flimo (génération de contenus immobiliers)</p>
                <p><span className="font-semibold text-gray-900 dark:text-white">Durée de conservation :</span> 3 ans après la résiliation du compte</p>
                <p>
                  <span className="font-semibold text-gray-900 dark:text-white">Droits :</span> Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à{" "}
                  <a href="mailto:support@flimo.fr" className="text-primary hover:underline">support@flimo.fr</a>.
                </p>
                <p>
                  <span className="font-semibold text-gray-900 dark:text-white">Autorité de contrôle :</span> Commission Nationale de l&apos;Informatique et des Libertés (CNIL) —{" "}
                  <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cnil.fr</a>
                </p>
              </div>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Cookies</h2>
              <p>
                Le site Flimo utilise uniquement des cookies techniques nécessaires au fonctionnement du service (authentification, session). Aucun cookie publicitaire ou de suivi tiers n&apos;est utilisé.
              </p>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. Limitation de responsabilité</h2>
              <p>
                Flimo s&apos;efforce de maintenir les informations publiées sur ce site aussi précises et à jour que possible. Toutefois, Flimo ne peut garantir l&apos;exactitude, la complétude ou l&apos;actualité des informations diffusées. L&apos;utilisation des informations et contenus disponibles sur le site se fait sous l&apos;entière responsabilité de l&apos;utilisateur.
              </p>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. Droit applicable</h2>
              <p>
                Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
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
