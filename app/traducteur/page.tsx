"use client";

import { useState } from "react";
import ToolsHeader from "@/components/ToolsHeader";

interface FormData {
  annonceOriginal: string;
  langueCible: string;
  ton: string;
}

const initialState: FormData = {
  annonceOriginal: "",
  langueCible: "",
  ton: "",
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


export default function TraducteurPage() {
  const [form, setForm] = useState<FormData>(initialState);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate-traducteur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la génération");
      }

      const data = await res.json();
      setResult(data.traduction);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const isValid = form.annonceOriginal && form.langueCible && form.ton;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F1923]">
      <ToolsHeader />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Traduisez vos annonces immobilières
          <span className="text-primary block sm:inline"> pour l&apos;international</span>
        </h1>
        <p className="mt-3 text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
          Traduction naturelle et adaptée au marché local — pas une traduction mot à mot.
        </p>
      </section>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Form */}
          <div className="bg-white dark:bg-[#1a2836] rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Votre annonce</h2>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                Collez votre annonce et choisissez les options de traduction
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="form-label" htmlFor="annonceOriginal">
                  Annonce originale en français <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="annonceOriginal"
                  name="annonceOriginal"
                  placeholder="Collez ici votre annonce immobilière en français..."
                  value={form.annonceOriginal}
                  onChange={handleChange}
                  className="form-input resize-none"
                  rows={10}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  id="langueCible"
                  label="Langue cible"
                  name="langueCible"
                  value={form.langueCible}
                  onChange={handleChange}
                  placeholder="Sélectionner..."
                  required
                  options={[
                    { value: "Anglais", label: "Anglais" },
                    { value: "Espagnol", label: "Espagnol" },
                    { value: "Allemand", label: "Allemand" },
                    { value: "Italien", label: "Italien" },
                    { value: "Chinois simplifié", label: "Chinois simplifié" },
                  ]}
                />

                <SelectField
                  id="ton"
                  label="Ton"
                  name="ton"
                  value={form.ton}
                  onChange={handleChange}
                  placeholder="Sélectionner..."
                  required
                  options={[
                    { value: "standard", label: "Standard" },
                    { value: "prestige", label: "Prestige / Luxe" },
                  ]}
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
                      Traduction en cours...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                      </svg>
                      Traduire l&apos;annonce
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
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Traduction générée</h2>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Prête à copier-coller sur votre portail</p>
              </div>
              {result && <CopyButton text={result} label="Copier" />}
            </div>

            <div className="flex-1 flex flex-col">
              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-8">
                  <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Traduction en cours...</p>
                    <p className="text-xs text-gray-400 mt-1">L&apos;IA adapte votre annonce</p>
                  </div>
                </div>
              )}

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

              {!loading && !error && !result && (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-8">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                    <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">La traduction apparaîtra ici</p>
                    <p className="text-xs text-gray-400 mt-1">Collez votre annonce et cliquez sur &quot;Traduire&quot;</p>
                  </div>
                </div>
              )}

              {!loading && !error && result && (
                <div className="flex-1 rounded-xl bg-gray-50 dark:bg-[#0F1923] border border-gray-100 dark:border-gray-700 p-5">
                  <div className="space-y-4">
                    {result.split("\n\n").map((block, i) => {
                      const lines = block.split("\n");
                      const isTitle = i === 0;
                      return (
                        <div key={i}>
                          {lines.map((line, j) => (
                            <p
                              key={j}
                              className={`text-sm leading-relaxed ${
                                j === 0 && isTitle
                                  ? "font-semibold text-gray-900"
                                  : "text-gray-700"
                              } ${j > 0 ? "mt-1" : ""}`}
                            >
                              {line}
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
