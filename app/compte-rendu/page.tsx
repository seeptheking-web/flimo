"use client";

import { useState } from "react";
import ToolsHeader from "@/components/ToolsHeader";

interface FormData {
  typeBien: string;
  adresseBien: string;
  dateVisite: string;
  nomVisiteur: string;
  budgetVisiteur: string;
  interetVisiteur: string;
  pointsPositifs: string;
  pointsNegatifs: string;
  prochaineEtape: string;
  prenomAgent: string;
  nomAgence: string;
}

const initialState: FormData = {
  typeBien: "",
  adresseBien: "",
  dateVisite: "",
  nomVisiteur: "",
  budgetVisiteur: "",
  interetVisiteur: "",
  pointsPositifs: "",
  pointsNegatifs: "",
  prochaineEtape: "",
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

function CopyButton({ text }: { text: string }) {
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
          Copier le compte-rendu
        </>
      )}
    </button>
  );
}


export default function CompteRenduPage() {
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
      const res = await fetch("/api/generate-compte-rendu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la génération");
      }

      const data = await res.json();
      setResult(data.compteRendu);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    form.typeBien &&
    form.adresseBien &&
    form.dateVisite &&
    form.nomVisiteur &&
    form.interetVisiteur &&
    form.pointsPositifs &&
    form.pointsNegatifs &&
    form.prochaineEtape &&
    form.prenomAgent &&
    form.nomAgence;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F1923]">
      <ToolsHeader />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Compte-rendu de visite
          <span className="text-primary block sm:inline"> prêt à envoyer</span>
        </h1>
        <p className="mt-3 text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
          Renseignez les détails de la visite — obtenez un compte-rendu structuré et professionnel à transmettre au vendeur.
        </p>
      </section>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Form */}
          <div className="bg-white dark:bg-[#1a2836] rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Informations de la visite</h2>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                Remplissez les champs pour générer votre compte-rendu
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <SelectField
                id="typeBien"
                label="Type de bien"
                name="typeBien"
                value={form.typeBien}
                onChange={handleChange}
                placeholder="Sélectionner..."
                required
                options={[
                  { value: "Appartement", label: "Appartement" },
                  { value: "Maison", label: "Maison" },
                  { value: "Studio", label: "Studio" },
                  { value: "Local commercial", label: "Local commercial" },
                ]}
              />

              <div>
                <label className="form-label" htmlFor="adresseBien">
                  Adresse ou référence du bien <span className="text-red-400">*</span>
                </label>
                <input
                  id="adresseBien"
                  name="adresseBien"
                  type="text"
                  placeholder="ex. 12 rue des Lilas, Lyon 69003 ou Réf. LYO-0042"
                  value={form.adresseBien}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="dateVisite">
                  Date de la visite <span className="text-red-400">*</span>
                </label>
                <input
                  id="dateVisite"
                  name="dateVisite"
                  type="date"
                  value={form.dateVisite}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="nomVisiteur">
                  Prénom et nom du/des visiteur(s) <span className="text-red-400">*</span>
                </label>
                <input
                  id="nomVisiteur"
                  name="nomVisiteur"
                  type="text"
                  placeholder="ex. Marie et Paul Dupont"
                  value={form.nomVisiteur}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="budgetVisiteur">
                  Budget annoncé par le visiteur{" "}
                  <span className="text-gray-400 font-normal">(optionnel)</span>
                </label>
                <input
                  id="budgetVisiteur"
                  name="budgetVisiteur"
                  type="text"
                  placeholder="ex. 280 000 €"
                  value={form.budgetVisiteur}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <SelectField
                id="interetVisiteur"
                label="Intérêt du visiteur"
                name="interetVisiteur"
                value={form.interetVisiteur}
                onChange={handleChange}
                placeholder="Sélectionner..."
                required
                options={[
                  { value: "tres_interesse", label: "Très intéressé" },
                  { value: "interesse_hesitant", label: "Intéressé mais hésitant" },
                  { value: "peu_interesse", label: "Peu intéressé" },
                  { value: "pas_interesse", label: "Pas intéressé" },
                ]}
              />

              <div>
                <label className="form-label" htmlFor="pointsPositifs">
                  Points positifs relevés pendant la visite <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="pointsPositifs"
                  name="pointsPositifs"
                  placeholder="ex. Luminosité, bel espace de vie, calme du quartier..."
                  value={form.pointsPositifs}
                  onChange={handleChange}
                  rows={3}
                  className="form-input resize-none"
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="pointsNegatifs">
                  Points négatifs ou freins exprimés <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="pointsNegatifs"
                  name="pointsNegatifs"
                  placeholder="ex. Prix jugé élevé par rapport au budget, travaux à prévoir dans la cuisine..."
                  value={form.pointsNegatifs}
                  onChange={handleChange}
                  rows={3}
                  className="form-input resize-none"
                  required
                />
              </div>

              <SelectField
                id="prochaineEtape"
                label="Prochaine étape convenue"
                name="prochaineEtape"
                value={form.prochaineEtape}
                onChange={handleChange}
                placeholder="Sélectionner..."
                required
                options={[
                  { value: "deuxieme_visite", label: "Deuxième visite prévue" },
                  { value: "offre_reflexion", label: "Offre en cours de réflexion" },
                  { value: "attente_reponse", label: "En attente de réponse" },
                  { value: "aucune_suite", label: "Aucune suite" },
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
                      Générer le compte-rendu
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
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Compte-rendu généré</h2>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Prêt à envoyer au vendeur</p>
              </div>
              {result && <CopyButton text={result} />}
            </div>

            <div className="flex-1 flex flex-col">
              {/* Loading */}
              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-8">
                  <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Génération en cours...</p>
                    <p className="text-xs text-gray-400 mt-1">L&apos;IA rédige votre compte-rendu</p>
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Votre compte-rendu apparaîtra ici</p>
                    <p className="text-xs text-gray-400 mt-1">Remplissez le formulaire et cliquez sur &quot;Générer&quot;</p>
                  </div>
                </div>
              )}

              {/* Result */}
              {!loading && !error && result && (
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex-1 rounded-xl bg-gray-50 dark:bg-[#0F1923] border border-gray-100 dark:border-gray-700 p-5">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {result}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 text-right">
                    {result.split(/\s+/).filter(Boolean).length} mots
                  </p>
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
