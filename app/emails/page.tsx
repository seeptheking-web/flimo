"use client";

import { useState } from "react";
import ToolsHeader from "@/components/ToolsHeader";

interface FormData {
  typeProprietaire: string;
  typeBien: string;
  ville: string;
  argument: string;
  ton: string;
  prenomAgent: string;
  nomAgence: string;
}

const initialState: FormData = {
  typeProprietaire: "",
  typeBien: "",
  ville: "",
  argument: "",
  ton: "",
  prenomAgent: "",
  nomAgence: "",
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

export default function EmailsPage() {
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
      const res = await fetch("/api/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la génération");
      }

      const data = await res.json();
      setResult(data.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    form.typeProprietaire &&
    form.typeBien &&
    form.ville &&
    form.argument &&
    form.ton &&
    form.prenomAgent &&
    form.nomAgence;

  // Parse subject (first line) from body
  const lines = result?.split("\n") ?? [];
  const subject = lines[0] ?? "";
  const body = lines.slice(1).join("\n").trim();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F1923]">
      <ToolsHeader />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Générez vos emails de prospection
          <span className="text-primary block sm:inline"> en un clic</span>
        </h1>
        <p className="mt-3 text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
          Ciblez le bon propriétaire, choisissez votre argument, et recevez un email prêt à envoyer — court, percutant, humain.
        </p>
      </section>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Form */}
          <div className="bg-white dark:bg-[#1a2836] rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Paramètres de l&apos;email</h2>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                Remplissez les informations pour générer votre email
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <SelectField
                id="typeProprietaire"
                label="Type de propriétaire"
                name="typeProprietaire"
                value={form.typeProprietaire}
                onChange={handleChange}
                placeholder="Sélectionner..."
                required
                options={[
                  { value: "particulier", label: "Particulier" },
                  { value: "bailleur", label: "Propriétaire bailleur" },
                  { value: "succession", label: "Succession / Héritage" },
                  { value: "entreprise", label: "Entreprise" },
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
                  { value: "local", label: "Local commercial" },
                  { value: "terrain", label: "Terrain" },
                ]}
              />

              <div>
                <label className="form-label" htmlFor="ville">
                  Ville et quartier ciblé <span className="text-red-400">*</span>
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
                id="argument"
                label="Argument principal"
                name="argument"
                value={form.argument}
                onChange={handleChange}
                placeholder="Choisir un argument..."
                required
                options={[
                  { value: "expertise", label: "Expertise locale" },
                  { value: "portefeuille", label: "Portefeuille acheteurs actifs" },
                  { value: "estimation", label: "Estimation gratuite" },
                  { value: "vente_rapide", label: "Vente rapide garantie" },
                  { value: "discretion", label: "Discrétion totale" },
                ]}
              />

              <SelectField
                id="ton"
                label="Ton de l'email"
                name="ton"
                value={form.ton}
                onChange={handleChange}
                placeholder="Choisir un ton..."
                required
                options={[
                  { value: "professionnel", label: "Professionnel et direct" },
                  { value: "chaleureux", label: "Chaleureux et humain" },
                  { value: "urgence", label: "Urgence subtile" },
                ]}
              />

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="form-label" htmlFor="nomAgence">
                    Nom de l&apos;agence <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="nomAgence"
                    name="nomAgence"
                    type="text"
                    placeholder="ex. Agence Dupont"
                    value={form.nomAgence}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                      Générer l&apos;email
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
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Email généré</h2>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Prêt à copier et envoyer</p>
              </div>
              {result && (
                <div className="flex items-center gap-1">
                  <CopyButton text={subject} label="Objet" />
                  <CopyButton text={result} label="Email complet" />
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col">
              {/* Loading */}
              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-8">
                  <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Génération en cours...</p>
                    <p className="text-xs text-gray-400 mt-1">L&apos;IA rédige votre email</p>
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Votre email apparaîtra ici</p>
                    <p className="text-xs text-gray-400 mt-1">Remplissez le formulaire et cliquez sur &quot;Générer&quot;</p>
                  </div>
                </div>
              )}

              {/* Result */}
              {!loading && !error && result && (
                <div className="flex-1 flex flex-col gap-3">
                  {/* Subject line */}
                  {subject && (
                    <div className="rounded-xl bg-primary/5 border border-primary/15 px-4 py-3">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Objet</p>
                      <p className="text-sm font-medium text-gray-900">{subject}</p>
                    </div>
                  )}
                  {/* Body */}
                  {body && (
                    <div className="flex-1 rounded-xl bg-gray-50 dark:bg-[#0F1923] border border-gray-100 dark:border-gray-700 p-5">
                      <div className="space-y-3">
                        {body.split("\n\n").map((paragraph, i) => (
                          <p key={i} className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
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
