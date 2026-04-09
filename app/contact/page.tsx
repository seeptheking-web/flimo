"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "@/components/ThemeProvider";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconMail() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function IconWrench() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
    </svg>
  );
}

function IconCreditCard() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function IconChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white dark:bg-[#1a2836] hover:bg-gray-50 dark:hover:bg-[#1e2f42] transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{question}</span>
        <IconChevronDown open={open} />
      </button>
      {open && (
        <div className="px-6 pb-5 bg-white dark:bg-[#1a2836]">
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const faqs = [
  {
    question: "Comment annuler mon abonnement ?",
    answer:
      "Vous pouvez annuler votre abonnement à tout moment depuis votre espace client, section « Facturation ». L'annulation prend effet à la fin de votre période en cours. Vous conservez l'accès jusqu'à cette date.",
  },
  {
    question: "Puis-je changer de plan en cours de mois ?",
    answer:
      "Oui, vous pouvez passer à un plan supérieur à tout moment. La différence de prix est calculée au prorata des jours restants. Pour passer à un plan inférieur, le changement sera effectif au renouvellement suivant.",
  },
  {
    question: "Les textes générés sont-ils vraiment originaux ?",
    answer:
      "Oui. Chaque texte est généré spécifiquement à partir des informations que vous fournissez. Flimo n'utilise pas de modèles génériques : chaque résultat est unique et personnalisé selon votre bien, votre cible et votre style.",
  },
  {
    question: "Flimo fonctionne-t-il sur mobile ?",
    answer:
      "Oui, Flimo est entièrement responsive et fonctionne sur smartphone et tablette. Vous pouvez générer vos textes depuis n'importe quel appareil, sans application à installer.",
  },
  {
    question: "Comment obtenir une facture ?",
    answer:
      "Vos factures sont disponibles automatiquement dans votre espace client, section « Facturation ». Vous pouvez les télécharger en PDF à tout moment. En cas de problème, contactez-nous via ce formulaire.",
  },
];

// ─── Contact Page ─────────────────────────────────────────────────────────────

export default function ContactPage() {
  const { isSignedIn } = useUser();

  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    sujet: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Une erreur est survenue.");
        setStatus("error");
      } else {
        setStatus("success");
        setForm({ prenom: "", nom: "", email: "", sujet: "", message: "" });
      }
    } catch {
      setErrorMsg("Une erreur est survenue. Veuillez réessayer.");
      setStatus("error");
    }
  };

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
    <div className="min-h-screen bg-white dark:bg-[#0F1923] text-gray-900 dark:text-white">

      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0F1923]/90 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Flimo" width="36" height="36" />
            <span className="text-xl font-bold tracking-tight">Flimo</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
            <Link href="/" className="hover:text-gray-900 transition-colors">Fonctionnalités</Link>
            <Link href="/#tarifs" className="hover:text-gray-900 transition-colors">Tarifs</Link>
            <Link href="/sign-in" className="hover:text-gray-900 transition-colors">Connexion</Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggleButton />
            {isSignedIn ? (
              <Link
                href="/annonces"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                Accéder à mes outils
              </Link>
            ) : (
              <Link
                href="/sign-up"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                Essayer gratuitement
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="pt-32 pb-16 px-4 sm:px-6 text-center bg-white dark:bg-[#0F1923]">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            Une question ?{" "}
            <span className="text-primary">On vous répond.</span>
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Notre équipe répond sous 24h — du lundi au vendredi.
          </p>
        </div>
      </section>

      {/* ── MAIN SECTION ── */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* ── LEFT — Form ── */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-[#1a2836] border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Envoyer un message</h2>

              {status === "success" && (
                <div className="mb-6 flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-4">
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <IconCheck />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Message envoyé !</p>
                    <p className="text-sm mt-0.5 text-green-700">Nous vous répondrons sous 24h.</p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Prénom + Nom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="prenom" className="form-label">Prénom</label>
                    <input
                      id="prenom"
                      name="prenom"
                      type="text"
                      required
                      value={form.prenom}
                      onChange={handleChange}
                      placeholder="Marie"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="nom" className="form-label">Nom</label>
                    <input
                      id="nom"
                      name="nom"
                      type="text"
                      required
                      value={form.nom}
                      onChange={handleChange}
                      placeholder="Dupont"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="form-label">Email professionnel</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="marie.dupont@agence.fr"
                    className="form-input"
                  />
                </div>

                {/* Sujet */}
                <div>
                  <label htmlFor="sujet" className="form-label">Sujet</label>
                  <div className="relative">
                    <select
                      id="sujet"
                      name="sujet"
                      required
                      value={form.sujet}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="Question sur un outil">Question sur un outil</option>
                      <option value="Problème technique">Problème technique</option>
                      <option value="Demande de démo">Demande de démo</option>
                      <option value="Facturation et abonnement">Facturation et abonnement</option>
                      <option value="Autre">Autre</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre question ou votre problème..."
                    className="form-input resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary"
                >
                  {status === "loading" ? "Envoi en cours…" : "Envoyer le message"}
                </button>
              </form>
            </div>
          </div>

          {/* ── RIGHT — Infos ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact info */}
            <div className="bg-white dark:bg-[#1a2836] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Nous contacter</h2>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <IconMail />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Email</p>
                  <a href="mailto:support@flimo.io" className="font-medium text-gray-900 dark:text-white hover:text-primary transition-colors">
                    support@flimo.io
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <IconClock />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Temps de réponse</p>
                  <p className="font-medium text-gray-900 dark:text-white">Sous 24h en semaine</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <IconCalendar />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Horaires</p>
                  <p className="font-medium text-gray-900 dark:text-white">Lundi — Vendredi, 9h — 18h</p>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              <div className="bg-white dark:bg-[#1a2836] border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex items-start gap-4 hover:border-primary/40 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary flex-shrink-0">
                  <IconWrench />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Support technique</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Pour tout problème avec les outils</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1a2836] border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex items-start gap-4 hover:border-primary/40 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary flex-shrink-0">
                  <IconBriefcase />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Questions commerciales</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Tarifs, démo, partenariats</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1a2836] border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex items-start gap-4 hover:border-primary/40 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary flex-shrink-0">
                  <IconCreditCard />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Facturation</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Abonnements, factures, remboursements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50 dark:bg-[#162030] border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Questions fréquentes</h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">Vous trouverez peut-être votre réponse ici.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5l9-7.5 9 7.5V20.25a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v4.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V10.5z" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">Flimo</span>
            </div>
            <p className="text-sm text-center">© 2026 Flimo — Tous droits réservés</p>
            <nav className="flex items-center gap-5 text-sm">
              <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-white transition-colors">CGU</a>
              <Link href="/contact" className="hover:text-white transition-colors text-white">Contact</Link>
            </nav>
          </div>
        </div>
      </footer>

    </div>
  );
}
