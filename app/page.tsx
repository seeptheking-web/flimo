"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "@/components/ThemeProvider";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconHome() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5l9-7.5 9 7.5V20.25a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v4.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V10.5z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function IconShare() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function IconScale() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.589-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.589-1.202L5.25 5.49z" />
    </svg>
  );
}

function IconChat() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}

function IconPresentation() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ─── Fade-in on scroll ────────────────────────────────────────────────────────

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`no-theme-transition ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
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
        <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{question}</span>
        <span style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
          <IconChevron />
        </span>
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

const tools = [
  { icon: <IconHome />, name: "Annonces immobilières", desc: "Générez des annonces percutantes pour tout type de bien", href: "/annonces" },
  { icon: <IconMail />, name: "Emails de prospection", desc: "Ciblez des propriétaires avec des emails qui convertissent", href: "/emails" },
  { icon: <IconShare />, name: "Posts réseaux sociaux", desc: "Créez du contenu engageant pour Instagram, LinkedIn et Facebook", href: "/social" },
  { icon: <IconStar />, name: "Réponses aux avis", desc: "Répondez professionnellement à tous vos avis clients", href: "/avis" },
  { icon: <IconClipboard />, name: "Compte-rendu de visite", desc: "Résumez chaque visite en quelques secondes", href: "/compte-rendu" },
  { icon: <IconPhone />, name: "Script d'appel", desc: "Préparez chaque appel avec un script adapté à votre cible", href: "/script-appel" },
  { icon: <IconScale />, name: "Argumentaire de négociation", desc: "Défendez chaque offre avec les bons arguments", href: "/negociation" },
  { icon: <IconChat />, name: "Demande d'avis client", desc: "Envoyez des demandes d'avis qui obtiennent des réponses", href: "/demande-avis" },
  { icon: <IconGlobe />, name: "Traducteur d'annonces", desc: "Traduisez vos annonces pour des acheteurs étrangers", href: "/traducteur" },
  { icon: <IconPresentation />, name: "Pitch de mandat", desc: "Convainquez des vendeurs avec un argumentaire sur-mesure", href: "/pitch-mandat" },
];

const stats = [
  { value: "30s", label: "par annonce" },
  { value: "10", label: "outils immobiliers" },
  { value: "0€", label: "pour commencer" },
];

const plans = [
  {
    name: "Starter",
    price: "29",
    features: ["70 générations / mois", "Accès aux 10 outils", "Support email"],
    popular: false,
    cta: "Commencer",
  },
  {
    name: "Pro",
    price: "59",
    features: ["150 générations / mois", "Accès aux 10 outils", "Support prioritaire"],
    popular: true,
    cta: "Choisir Pro",
  },
  {
    name: "Agence",
    price: "99",
    features: ["Générations illimitées", "Accès aux 10 outils", "Multi-utilisateurs", "Support dédié"],
    popular: false,
    cta: "Contacter",
  },
];

const faqs = [
  {
    question: "Est-ce que les textes sonnent vraiment humains ?",
    answer: "Oui. Flimo est conçu pour générer des textes naturels, adaptés au ton de l'immobilier français. Nos prompts sont spécialement calibrés pour éviter les tournures typiques de l'IA et produire des textes prêts à publier.",
  },
  {
    question: "Combien de temps faut-il pour générer une annonce ?",
    answer: "En moyenne 30 secondes. Vous remplissez le formulaire, vous cliquez sur \"Générer\", et votre annonce est prête. Pas de relecture longue, pas de reformulation — juste un texte professionnel immédiat.",
  },
  {
    question: "Puis-je annuler à tout moment ?",
    answer: "Oui, sans engagement. Vous pouvez résilier votre abonnement depuis votre espace personnel à tout moment. Aucun préavis, aucune pénalité.",
  },
  {
    question: "Flimo fonctionne pour quel type d'agent ?",
    answer: "Flimo est fait pour tous les professionnels de l'immobilier : agents indépendants, mandataires, négociateurs en agence, ou équipes complètes. Les 10 outils couvrent l'ensemble du cycle de vente.",
  },
  {
    question: "Y a-t-il une période d'essai gratuite ?",
    answer: "Oui. Vous pouvez créer un compte gratuitement et tester Flimo sans carte bancaire. Le plan gratuit vous donne accès à toutes les fonctionnalités avec un quota limité de générations.",
  },
];

// ─── Demo Section ─────────────────────────────────────────────────────────────

const demoTabs = ["Annonce immobilière", "Email de prospection", "Script d'appel"];

const demoInputs = [
  [
    { label: "Type", value: "Appartement" },
    { label: "Surface", value: "68m²" },
    { label: "Pièces", value: "3" },
    { label: "Ville", value: "Paris 11e" },
    { label: "Quartier", value: "Bastille" },
    { label: "Points forts", value: "Parquet ancien, hauteur sous plafond 3m, lumineux, cave" },
  ],
  [
    { label: "Prospect", value: "Particulier" },
    { label: "Bien", value: "Appartement" },
    { label: "Quartier", value: "Lyon 6e" },
    { label: "Argument", value: "Acheteurs actifs" },
    { label: "Ton", value: "Chaleureux" },
  ],
  [
    { label: "Prospect", value: "Propriétaire à estimer" },
    { label: "Objectif", value: "Décrocher un RDV" },
    { label: "Argument", value: "Expertise locale" },
    { label: "Ville", value: "Bordeaux" },
  ],
];

function DemoOutput({ tab }: { tab: number }) {
  if (tab === 0) {
    return (
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-3">Bastille — 3 pièces avec caractère, 68m²</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          Situé à deux pas de la place de la Bastille, cet appartement de 68m² a gardé tout ce qui fait le charme des anciens : parquet d&apos;époque, hauteur sous plafond à 3 mètres, lumière naturelle toute la journée. Trois pièces bien distribuées, une cave, et un quartier qui n&apos;a plus besoin de se présenter. Idéal pour un premier achat ou un investissement locatif solide.
        </p>
      </div>
    );
  }
  if (tab === 1) {
    return (
      <div>
        <div className="mb-4">
          <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">Objet</span>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">Votre appartement du 6e — j&apos;ai des acheteurs</p>
        </div>
        <div className="border-t border-primary-200 dark:border-primary-900 pt-4">
          <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">Corps</span>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-1">
            Bonjour,
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
            je travaille sur le secteur du 6e depuis plusieurs années et j&apos;ai actuellement des acheteurs qualifiés qui cherchent exactement ce type de bien. Si vous pensez à vendre — même à moyen terme — un échange de 10 minutes pourrait valoir le coup.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
            Je suis disponible cette semaine si vous le souhaitez.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-2 font-medium">
            Thomas — Agence Prestige Lyon
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {[
        { label: "ACCROCHE", text: "\"Bonjour, Thomas de l'agence Prestige — je vous contacte car je travaille exclusivement sur Bordeaux centre et j'ai récemment estimé plusieurs biens dans votre rue.\"" },
        { label: "ARGUMENTAIRE", text: "\"Je ne vous appelle pas pour vous vendre quoi que ce soit — juste pour vous proposer une estimation gratuite et sans engagement. Le marché a bougé ces derniers mois et beaucoup de propriétaires sont agréablement surpris.\"" },
        { label: "CLOSING", text: "\"Est-ce que vous auriez 20 minutes cette semaine ou la semaine prochaine pour qu'on en discute chez vous ?\"" },
        { label: "SI OBJECTION", text: "\"Je comprends tout à fait — dans ce cas je vous laisse ma carte et n'hésitez pas à me rappeler si la situation évolue.\"" },
      ].map((line, i) => (
        <div key={i}>
          <span className="text-xs font-bold text-primary dark:text-primary-400 uppercase tracking-wider">{line.label}</span>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-1 italic">{line.text}</p>
        </div>
      ))}
    </div>
  );
}

function DemoSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-20 px-4 sm:px-6 bg-[#F8F9FA] dark:bg-[#162030]">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              De la description brute à l&apos;annonce parfaite — en 30 secondes
            </h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Voici ce que Flimo génère à partir de quelques informations simples
            </p>
          </div>
        </FadeIn>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          {demoTabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === i
                  ? "bg-primary text-white shadow-md"
                  : "bg-white dark:bg-[#1a2836] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary/30 hover:text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Before / After */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — input */}
          <div className="bg-white dark:bg-[#1a2836] border border-gray-200 dark:border-gray-700 rounded-2xl p-7">
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-5">Ce que vous saisissez</div>
            <div className="space-y-3">
              {demoInputs[activeTab].map((field, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 w-28 shrink-0">{field.label}</span>
                  <span className="text-sm text-gray-300 dark:text-gray-600 shrink-0">—</span>
                  <span className="text-sm text-gray-800 dark:text-gray-200">{field.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — output */}
          <div className="rounded-2xl p-7 bg-primary/5 dark:bg-[#1a2f1e] border border-primary" style={{ borderWidth: "1.5px" }}>
            <div className="flex items-center justify-between mb-5">
              <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Ce que Flimo génère</div>
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
                Généré par Flimo ✦
              </span>
            </div>
            <DemoOutput tab={activeTab} />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/sign-up"
            className="inline-block rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-md hover:bg-primary-700 transition-colors"
          >
            Générer mes propres textes gratuitement
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Theme Toggle Button ───────────────────────────────────────────────────────

function ThemeToggleButton() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Basculer le mode sombre/clair"
      className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const demoRef = useRef<HTMLDivElement>(null);

  const [showAnnounce, setShowAnnounce] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("flimo_announce_dismissed") === "1") {
      setShowAnnounce(false);
    }
  }, []);

  const dismissAnnounce = () => {
    localStorage.setItem("flimo_announce_dismissed", "1");
    setShowAnnounce(false);
  };

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const headerTop = showAnnounce ? 40 : 0;
  const heroTopPadding = showAnnounce ? "pt-[168px]" : "pt-32";

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F1923] text-gray-900 dark:text-white">

      {/* ── ANNOUNCEMENT BAR ── */}
      {showAnnounce && (
        <div
          className="fixed left-0 right-0 z-[60] flex items-center justify-between gap-4 px-4"
          style={{ top: 0, height: "40px", backgroundColor: "#7a9e7e" }}
        >
          <div className="flex-1 flex items-center justify-center gap-3">
            <span className="text-white text-sm font-medium text-center leading-none">
              🎉 Offre de lancement — 30% de réduction le premier mois avec le code FLIMO30
            </span>
            <Link
              href="/tarifs"
              className="hidden sm:inline-flex items-center whitespace-nowrap text-white border border-white/70 px-3 py-0.5 rounded-full text-xs font-semibold hover:bg-white/10 transition-colors"
            >
              En profiter →
            </Link>
          </div>
          <button
            onClick={dismissAnnounce}
            aria-label="Fermer"
            className="text-white/80 hover:text-white shrink-0 transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* ── HEADER ── */}
      <header
        className="fixed left-0 right-0 z-50 bg-white/90 dark:bg-[#0F1923]/90 backdrop-blur border-b border-gray-100 dark:border-gray-800 transition-none"
        style={{ top: headerTop }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Flimo" width="36" height="36" />
            <span className="text-xl font-bold tracking-tight dark:text-white">Flimo</span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
            <button onClick={scrollToDemo} className="hover:text-gray-900 dark:hover:text-white transition-colors">Fonctionnalités</button>
            <a href="#tarifs" className="hover:text-gray-900 dark:hover:text-white transition-colors">Tarifs</a>
            <Link href="/contact" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</Link>
          </nav>

          {/* CTA + Theme Toggle */}
          <div className="flex items-center gap-2">
            <ThemeToggleButton />
            {isSignedIn ? (
              <Link
                href="/annonces"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors"
              >
                Accéder à mes outils
              </Link>
            ) : (
              <Link
                href="/sign-up"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors"
              >
                Essayer gratuitement
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className={`${heroTopPadding} pb-20 px-4 sm:px-6 text-center bg-white dark:bg-[#0F1923]`}>
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/8 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-primary/20">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            Propulsé par IA Flimo
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-gray-900 dark:text-white">
            Tous vos textes immobiliers{" "}
            <span className="text-primary">générés en 30 secondes</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Annonces, emails de prospection, scripts d&apos;appel, posts réseaux sociaux — Flimo fait le travail à votre place.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-1.5 w-full sm:w-auto">
              <Link
                href="/sign-up"
                className="w-full sm:w-auto rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-md hover:bg-primary-700 transition-colors"
              >
                Essayer 7 jours gratuitement
              </Link>
              <span className="text-xs text-gray-400 dark:text-gray-500">Puis 29€/mois · Annulable à tout moment</span>
            </div>
            <button
              onClick={scrollToDemo}
              className="w-full sm:w-auto rounded-xl border border-gray-200 dark:border-gray-700 px-8 py-3.5 text-base font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a2836] hover:bg-gray-50 dark:hover:bg-[#1e2f42] transition-colors"
            >
              Voir une démo
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-gray-50 dark:bg-[#162030] border-y border-gray-100 dark:border-gray-800 py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {stats.map((s, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="text-4xl sm:text-5xl font-extrabold text-primary">{s.value}</div>
              <div className="mt-1 text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium">{s.label}</div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── OUTILS ── */}
      <section ref={demoRef} className="py-24 px-4 sm:px-6 bg-white dark:bg-[#0F1923]">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Tout ce dont un agent immobilier a besoin
              </h2>
              <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
                10 outils pensés pour votre quotidien — annonces, prospection, négociation, réseaux sociaux.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {tools.map((tool, i) => (
              <FadeIn key={i} delay={i * 60}>
                <Link
                  href={isSignedIn ? tool.href : "/sign-up"}
                  className="group block bg-white dark:bg-[#1a2836] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-primary hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/15 transition-colors">
                    <span className="[&>svg]:w-8 [&>svg]:h-8">{tool.icon}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1" style={{ fontSize: "15px" }}>{tool.name}</h3>
                  <p className="text-gray-400 dark:text-gray-500 leading-relaxed" style={{ fontSize: "13px" }}>{tool.desc}</p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO ── */}
      <DemoSection />

      {/* ── POURQUOI FLIMO ── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50 dark:bg-[#162030]">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Pourquoi Flimo ?
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Écrit comme un humain",
                desc: "Nos textes ne sonnent pas IA. Ils sont calibrés pour l'immobilier français, naturels et prêts à publier sans retouche.",
                emoji: "✍️",
              },
              {
                title: "Gagner 2h par jour",
                desc: "Fini les annonces rédigées à la main. En 30 secondes, vous avez un texte professionnel et percutant.",
                emoji: "⏱️",
              },
              {
                title: "10 outils en 1",
                desc: "Tout ce dont un agent a besoin : annonces, emails, posts, scripts, comptes-rendus — dans une seule app.",
                emoji: "🛠️",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-white dark:bg-[#1a2836] rounded-2xl border border-gray-200 dark:border-gray-700 p-7 h-full">
                  <div className="text-3xl mb-4">{item.emoji}</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARIFS ── */}
      <section id="tarifs" className="py-20 px-4 sm:px-6 bg-white dark:bg-[#0F1923]">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Des tarifs simples et transparents
              </h2>
              <p className="mt-3 text-gray-500 dark:text-gray-400 text-lg">Sans engagement. Annulable à tout moment.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className={`relative rounded-2xl border p-7 flex flex-col h-full ${
                  plan.popular
                    ? "border-primary bg-primary text-white shadow-xl"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2836]"
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full shadow">
                      Populaire
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className={`text-lg font-bold mb-1 ${plan.popular ? "text-white" : "text-gray-900 dark:text-white"}`}>
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-extrabold ${plan.popular ? "text-white" : "text-gray-900 dark:text-white"}`}>
                        {plan.price}€
                      </span>
                      <span className={`text-sm ${plan.popular ? "text-primary-200" : "text-gray-400 dark:text-gray-500"}`}>/mois</span>
                    </div>
                  </div>
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-sm">
                        <svg className={`w-4 h-4 shrink-0 ${plan.popular ? "text-primary-200" : "text-primary"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span className={plan.popular ? "text-primary-100" : "text-gray-600 dark:text-gray-300"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/sign-up"
                    className={`block text-center rounded-xl px-6 py-3 text-sm font-semibold transition-colors ${
                      plan.popular
                        ? "bg-white text-primary hover:bg-primary-50"
                        : "bg-primary text-white hover:bg-primary-700"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50 dark:bg-[#162030]">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Questions fréquentes
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 px-4 sm:px-6 bg-primary">
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Prêt à gagner 2h par jour ?
            </h2>
            <p className="mt-4 text-primary-200 text-lg">
              Rejoignez les agents qui utilisent Flimo pour rédiger plus vite et mieux.
            </p>
            <div className="mt-8 flex flex-col items-center gap-2">
              <Link
                href="/sign-up"
                className="inline-block rounded-xl bg-white text-primary px-10 py-4 text-base font-bold shadow-lg hover:bg-primary-50 transition-colors"
              >
                Essayer 7 jours gratuitement
              </Link>
              <span className="text-sm text-primary-200">Puis 29€/mois · Annulable à tout moment</span>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 dark:bg-[#070d13] text-gray-400 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5l9-7.5 9 7.5V20.25a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v4.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V10.5z" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">Flimo</span>
            </div>

            {/* Copyright */}
            <p className="text-sm text-center">© 2026 Flimo — Tous droits réservés</p>

            {/* Links */}
            <nav className="flex items-center gap-5 text-sm">
              <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-white transition-colors">CGU</a>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </nav>
          </div>
        </div>
      </footer>

    </div>
  );
}
