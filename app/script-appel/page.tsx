"use client";

import { useState } from "react";
import ToolsHeader from "@/components/ToolsHeader";

interface FormData {
  typeProspect: string;
  typeBien: string;
  ville: string;
  objectifAppel: string;
  argument: string;
  prenomAgent: string;
}

const initialState: FormData = {
  typeProspect: "",
  typeBien: "",
  ville: "",
  objectifAppel: "",
  argument: "",
  prenomAgent: "",
};

function SelectField({
  id,
  label,
  name,
  value,
  onChange,
  options,
  required,
  placeholder,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  placeholder: string;
}) {
  return (
    <div>
      <label className="form-label" htmlFor={id}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="form-select pr-10"
          required={required}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-600">Copié !</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

export default function ScriptAppelPage() {
  const [form, setForm] = useState<FormData>(initialState);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate-script-appel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la génération");
      }

      const data = await res.json();
      setResult(data.script);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    form.typeProspect &&
    form.typeBien &&
    form.ville &&
    form.objectifAppel &&
    form.argument &&
    form.prenomAgent;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F1923]">
      <ToolsHeader />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Générez votre script d&apos;appel
          <span className="text-primary block sm:inline"> en un clic</span>
        </h1>
        <p className="mt-3 text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
          Un script structuré en 3 parties, écrit comme on parle, avec les réponses aux objections — prêt à décrocher.
        </p>
      </section>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Form */}
          <div className="bg-white dark:bg-[#1a2836] rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Paramètres de l&apos;appel</h2>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                Remplissez les informations pour générer votre script
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <SelectField
                id="typeProspect"
                label="Type de prospect"
                name="typeProspect"
                value={form.typeProspect}
                onChange={handleChange}
                placeholder="Sélectionner..."
                required
                options={[
                  { value: "proprietaire_estimer", label: "Propriétaire à estimer" },
                  { value: "proprietaire_vente", label: "Propriétaire déjà en vente" },
                  { value: "ancien_client", label: "Ancien client" },
                  { value: "prospect_froid", label: "Prospect froid jamais contacté" },
                ]}
              />

              <SelectField
                id="typeBien"
                label="Type de bien ciblé"
                name="typeBien"
                value={form.typeBien}
                onChange={handleChange}
                placeholder="Sélectionner..."
                required
                options={[
                  { value: "appartement", label: "Appartement" },
                  { value: "maison", label: "Maison" },
                  { value: "immeuble", label: "Immeuble" },
                  { value: "local", label: "Local" },
                ]}
              />

              <div>
                <label className="form-label" htmlFor="ville">
                  Ville et quartier <span className="text-red-400">*</span>
                </label>
                <input
                  id="ville"
                  name="ville"
                  type="text"
                  placeholder="ex. Lyon 6e, Bordeaux Chartrons"
                  value={form.ville}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <SelectField
                id="objectifAppel"
                label="Objectif de l'appel"
                name="objectifAppel"
                value={form.objectifAppel}
                onChange={handleChange}
                placeholder="Choisir un objectif..."
                required
                options={[
                  { value: "rdv_estimation", label: "Décrocher un RDV estimation" },
                  { value: "recuperer_mandat", label: "Récupérer un mandat" },
                  { value: "relancer_contact", label: "Relancer un ancien contact" },
                  { value: "premier_contact", label: "Premier contact à froid" },
                ]}
              />

              <SelectField
                id="argument"
                label="Argument principal"
                name="argument"
                value={form.argument}
                onChange={handleChange}
                placeholder="Choisir un argument..."
                required
                options={[
                  { value: "expertise_locale", label: "Expertise locale" },
                  { value: "acheteurs_actifs", label: "Acheteurs actifs en portefeuille" },
                  { value: "estimation_gratuite", label: "Estimation gratuite" },
                  { value: "vente_rapide", label: "Vente rapide" },
                ]}
              />

              <div>
                <label className="form-label" htmlFor="prenomAgent">
                  Prénom de l&apos;agent <span className="text-red-400">*</span>
                </label>
                <input
                  id="prenomAgent"
                  name="prenomAgent"
                  type="text"
                  placeholder="ex. Sophie"
                  value={form.prenomAgent}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={!isValid || loading}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      Générer le script
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Result */}
          <div className="bg-white dark:bg-[#1a2836] rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8 min-h-[420px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Script généré</h2>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Prêt à utiliser au téléphone</p>
              </div>
              {result && (
                <CopyButton text={result} label="Copier" />
              )}
            </div>

            <div className="flex-1 flex flex-col">
              {/* Loading */}
              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-8">
                  <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Génération en cours...</p>
                    <p className="text-xs text-gray-400 mt-1">L&apos;IA rédige votre script d&apos;appel</p>
                  </div>
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full rounded-xl bg-red-50 border border-red-100 p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Empty */}
              {!loading && !error && !result && (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-8">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                    <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Votre script apparaîtra ici</p>
                    <p className="text-xs text-gray-400 mt-1">Remplissez le formulaire et cliquez sur &quot;Générer&quot;</p>
                  </div>
                </div>
              )}

              {/* Result */}
              {!loading && !error && result && (
                <div className="flex-1 rounded-xl bg-gray-50 dark:bg-[#0F1923] border border-gray-100 dark:border-gray-700 p-5">
                  <div className="space-y-4">
                    {result.split("\n\n").map((block, i) => {
                      const isSection = block.startsWith("**") || block.startsWith("##") || /^[A-ZÀÉÈÊËÎÏÔÙÛÜ].*:/.test(block.split("\n")[0]);
                      return (
                        <div key={i} className={isSection ? "rounded-lg bg-primary/5 border border-primary/10 p-3" : ""}>
                          {block.split("\n").map((line, j) => (
                            <p key={j} className={`text-sm leading-relaxed ${j === 0 && isSection ? "font-semibold text-primary" : "text-gray-700"}`}>
                              {line.replace(/\*\*/g, "")}
                            </p>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0F1923] py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-400 dark:text-gray-500">
          &copy; {new Date().getFullYear()} Flimo — Outils immobiliers propulsés par IA
        </div>
      </footer>
    </div>
  );
}
