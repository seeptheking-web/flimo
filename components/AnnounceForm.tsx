"use client";

import { useState } from "react";

interface FormData {
  typeBien: string;
  surface: string;
  pieces: string;
  ville: string;
  quartier: string;
  pointsForts: string;
  ton: string;
}

interface AnnounceFormProps {
  onSubmit: (data: Record<string, string>) => void;
  loading: boolean;
}

const initialState: FormData = {
  typeBien: "",
  surface: "",
  pieces: "",
  ville: "",
  quartier: "",
  pointsForts: "",
  ton: "",
};

export default function AnnounceForm({ onSubmit, loading }: AnnounceFormProps) {
  const [form, setForm] = useState<FormData>(initialState);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form as unknown as Record<string, string>);
  };

  const isValid = form.typeBien && form.surface && form.ville && form.ton;

  return (
    <div className="bg-white dark:bg-[#1a2836] rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Votre bien</h2>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
          Remplissez les informations pour générer votre annonce
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type de bien */}
        <div>
          <label className="form-label" htmlFor="typeBien">
            Type de bien <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <select
              id="typeBien"
              name="typeBien"
              value={form.typeBien}
              onChange={handleChange}
              className="form-select pr-10"
              required
            >
              <option value="" disabled>
                Sélectionner...
              </option>
              <option value="appartement">Appartement</option>
              <option value="maison">Maison</option>
              <option value="studio">Studio</option>
              <option value="local">Local commercial</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>

        {/* Surface + Pièces */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="surface">
              Surface (m²) <span className="text-red-400">*</span>
            </label>
            <input
              id="surface"
              name="surface"
              type="number"
              min="1"
              placeholder="ex. 65"
              value={form.surface}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label" htmlFor="pieces">
              Nb. de pièces
            </label>
            <input
              id="pieces"
              name="pieces"
              type="number"
              min="1"
              placeholder="ex. 3"
              value={form.pieces}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        {/* Localisation */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="ville">
              Ville <span className="text-red-400">*</span>
            </label>
            <input
              id="ville"
              name="ville"
              type="text"
              placeholder="ex. Lyon"
              value={form.ville}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label" htmlFor="quartier">
              Quartier
            </label>
            <input
              id="quartier"
              name="quartier"
              type="text"
              placeholder="ex. Croix-Rousse"
              value={form.quartier}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        {/* Points forts */}
        <div>
          <label className="form-label" htmlFor="pointsForts">
            Points forts
          </label>
          <textarea
            id="pointsForts"
            name="pointsForts"
            rows={4}
            placeholder="ex. Vue dégagée, parquet chêne, proche métro, double vitrage, cave..."
            value={form.pointsForts}
            onChange={handleChange}
            className="form-input resize-none"
          />
        </div>

        {/* Ton */}
        <div>
          <label className="form-label" htmlFor="ton">
            Ton de l&apos;annonce <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <select
              id="ton"
              name="ton"
              value={form.ton}
              onChange={handleChange}
              className="form-select pr-10"
              required
            >
              <option value="" disabled>
                Choisir un ton...
              </option>
              <option value="professionnel">Professionnel</option>
              <option value="chaleureux">Chaleureux</option>
              <option value="prestige">Prestige</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>

        {/* Submit */}
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
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Génération en cours...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                  />
                </svg>
                Générer l&apos;annonce
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
