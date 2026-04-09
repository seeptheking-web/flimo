"use client";

import { useState } from "react";
import ToolsHeader from "@/components/ToolsHeader";

interface FormData {
  roleAgent: string;
  typeBien: string;
  prixAffiche: string;
  prixPropose: string;
  ancienneteMarche: string;
  pointsForts: string;
  pointsFaibles: string;
  contexteMarche: string;
}

const initialState: FormData = {
  roleAgent: "",
  typeBien: "",
  prixAffiche: "",
  prixPropose: "",
  ancienneteMarche: "",
  pointsForts: "",
  pointsFaibles: "",
  contexteMarche: "",
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

export default function NegociationPage() {
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
      const res = await fetch("/api/generate-negociation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la génération");
      }

      const data = await res.json();
      setResult(data.argumentaire);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    form.roleAgent &&
    form.typeBien &&
    form.prixAffiche &&
    form.ancienneteMarche &&
    form.pointsForts &&
    form.contexteMarche;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F1923]">
      <ToolsHeader />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Générez votre argumentaire de négociation
          <span className="text-primary block sm:inline"> en un clic</span>
        </h1>
        <p className="mt-3 text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
          5 arguments concrets et chiffrés, des formulations prêtes à prononcer, adaptées à votre rôle — vendeur ou acheteur.
        </p>
      </section>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Form */}
          <div className="bg-white dark:bg-[#1a2836] rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Paramètres de la négociation</h2>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                Remplissez les informations pour générer votre argumentaire
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <SelectField
                id="roleAgent"
                label="Votre rôle"
                name="roleAgent"
                value={form.roleAgent}
                onChange={handleChange}
                placeholder="Sélectionner..."
                required
                options={[
                  { value: "vendeur", label: "Je représente le vendeur" },
                  { value: "acheteur", label: "Je représente l'acheteur" },
                ]}
              />

              <SelectField
                id="typeBien"
                label="Type de bien"
                name="typeBien"
                value={form.typeBien}
                onChange={handleChange}
                placeholder="Sélectionner..."
                required
                options={[
                  { value: "appartement", label: "Appartement" },
                  { value: "maison", label: "Maison" },
                  { value: "local_commercial", label: "Local commercial" },
                  { value: "terrain", label: "Terrain" },
                ]}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="prixAffiche">
                    Prix affiché <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="prixAffiche"
                    name="prixAffiche"
                    type="text"
                    placeholder="ex. 350 000 €"
                    value={form.prixAffiche}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="prixPropose">
                    Prix proposé (acheteur)
                  </label>
                  <input
                    id="prixPropose"
                    name="prixPropose"
                    type="text"
                    placeholder="ex. 320 000 €"
                    value={form.prixPropose}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <SelectField
                id="ancienneteMarche"
                label="Ancienneté sur le marché"
                name="ancienneteMarche"
                value={form.ancienneteMarche}
                onChange={handleChange}
                placeholder="Sélectionner..."
                required
                options={[
                  { value: "moins_1_mois", label: "Moins d'1 mois" },
                  { value: "1_3_mois", label: "1 à 3 mois" },
                  { value: "plus_3_mois", label: "Plus de 3 mois" },
                ]}
              />

              <div>
                <label className="form-label" htmlFor="pointsForts">
                  Points forts du bien <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="pointsForts"
                  name="pointsForts"
                  placeholder="ex. Lumineux, terrasse, quartier recherché, double parking..."
                  value={form.pointsForts}
                  onChange={handleChange}
                  className="form-input resize-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="pointsFaibles">
                  Points faibles / travaux à prévoir
                  <span className="text-gray-400 font-normal ml-1">(optionnel)</span>
                </label>
                <textarea
                  id="pointsFaibles"
                  name="pointsFaibles"
                  placeholder="ex. Cuisine à refaire, DPE D, vue sur rue..."
                  value={form.pointsFaibles}
                  onChange={handleChange}
                  className="form-input resize-none"
                  rows={2}
                />
              </div>

              <SelectField
                id="contexteMarche"
                label="Contexte du marché local"
                name="contexteMarche"
                value={form.contexteMarche}
                onChange={handleChange}
                placeholder="Sélectionner..."
                required
                options={[
                  { value: "tendu", label: "Marché tendu — peu d'offres" },
                  { value: "equilibre", label: "Marché équilibré" },
                  { value: "offres", label: "Marché avec beaucoup d'offres" },
                ]}
              />

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
                      Générer l&apos;argumentaire
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
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Argumentaire généré</h2>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Prêt à utiliser en rendez-vous</p>
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
                    <p className="text-xs text-gray-400 mt-1">L&apos;IA construit votre argumentaire</p>
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Votre argumentaire apparaîtra ici</p>
                    <p className="text-xs text-gray-400 mt-1">Remplissez le formulaire et cliquez sur &quot;Générer&quot;</p>
                  </div>
                </div>
              )}

              {/* Result */}
              {!loading && !error && result && (
                <div className="flex-1 rounded-xl bg-gray-50 dark:bg-[#0F1923] border border-gray-100 dark:border-gray-700 p-5">
                  <div className="space-y-4">
                    {result.split("\n\n").map((block, i) => {
                      const lines = block.split("\n");
                      const firstLine = lines[0];
                      const isSection = firstLine.startsWith("**") || /^\d+\./.test(firstLine) || /^[A-ZÀÉÈÊËÎÏÔÙÛÜ].*:/.test(firstLine);
                      return (
                        <div key={i} className={isSection ? "rounded-lg bg-primary/5 border border-primary/10 p-3" : ""}>
                          {lines.map((line, j) => (
                            <p key={j} className={`text-sm leading-relaxed ${j === 0 && isSection ? "font-semibold text-primary" : "text-gray-700"} ${j > 0 ? "mt-1" : ""}`}>
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
