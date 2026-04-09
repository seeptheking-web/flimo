"use client";

import { useState } from "react";
import ToolsHeader from "@/components/ToolsHeader";

interface FormData {
  typeBien: string;
  surface: string;
  villeQuartier: string;
  prix: string;
  pointsForts: string;
  plateforme: string;
  ton: string;
}

interface Post {
  platform: string;
  content: string;
}

const initialState: FormData = {
  typeBien: "",
  surface: "",
  villeQuartier: "",
  prix: "",
  pointsForts: "",
  plateforme: "",
  ton: "",
};

const PLATFORM_META: Record<
  string,
  { label: string; color: string; bgColor: string; icon: React.ReactNode }
> = {
  instagram: {
    label: "Instagram",
    color: "text-pink-600",
    bgColor: "bg-pink-50 border-pink-100",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  facebook: {
    label: "Facebook",
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-100",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  linkedin: {
    label: "LinkedIn",
    color: "text-sky-700",
    bgColor: "bg-sky-50 border-sky-100",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
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
          Copier
        </>
      )}
    </button>
  );
}

function PostCard({ post }: { post: Post }) {
  const meta = PLATFORM_META[post.platform];
  if (!meta) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className={`flex items-center justify-between px-5 py-3 border-b ${meta.bgColor}`}>
        <div className={`flex items-center gap-2 font-semibold ${meta.color}`}>
          {meta.icon}
          <span>{meta.label}</span>
        </div>
        <CopyButton text={post.content} />
      </div>
      <div className="p-5">
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{post.content}</p>
      </div>
    </div>
  );
}


export default function SocialPage() {
  const [form, setForm] = useState<FormData>(initialState);
  const [posts, setPosts] = useState<Post[] | null>(null);
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
    setPosts(null);

    try {
      const res = await fetch("/api/generate-social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la génération");
      }

      const data = await res.json();
      setPosts(data.posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    form.typeBien &&
    form.surface &&
    form.villeQuartier &&
    form.pointsForts &&
    form.plateforme &&
    form.ton;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F1923]">
      <ToolsHeader />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Générez vos posts réseaux sociaux
          <span className="text-primary block sm:inline"> en un clic</span>
        </h1>
        <p className="mt-3 text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
          Instagram, Facebook, LinkedIn — des posts adaptés à chaque plateforme, prêts à publier.
        </p>
      </section>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Form */}
          <div className="bg-white dark:bg-[#1a2836] rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Paramètres du post</h2>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                Décrivez le bien et choisissez votre plateforme
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
                  { value: "appartement", label: "Appartement" },
                  { value: "maison", label: "Maison" },
                  { value: "studio", label: "Studio" },
                  { value: "local", label: "Local commercial" },
                  { value: "terrain", label: "Terrain" },
                ]}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="surface">
                    Surface en m² <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="surface"
                    name="surface"
                    type="number"
                    min="1"
                    placeholder="ex. 75"
                    value={form.surface}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="prix">
                    Prix de vente
                  </label>
                  <input
                    id="prix"
                    name="prix"
                    type="text"
                    placeholder="ex. 320 000 €"
                    value={form.prix}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label" htmlFor="villeQuartier">
                  Ville et quartier <span className="text-red-400">*</span>
                </label>
                <input
                  id="villeQuartier"
                  name="villeQuartier"
                  type="text"
                  placeholder="ex. Lyon 6e, Bordeaux Chartrons"
                  value={form.villeQuartier}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="pointsForts">
                  Points forts du bien <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="pointsForts"
                  name="pointsForts"
                  placeholder="ex. Lumineux, vue dégagée, parking, proche transports, rénové..."
                  value={form.pointsForts}
                  onChange={handleChange}
                  className="form-input resize-none"
                  rows={3}
                  required
                />
              </div>

              <SelectField
                id="plateforme"
                label="Plateforme"
                name="plateforme"
                value={form.plateforme}
                onChange={handleChange}
                placeholder="Choisir une plateforme..."
                required
                options={[
                  { value: "instagram", label: "Instagram" },
                  { value: "facebook", label: "Facebook" },
                  { value: "linkedin", label: "LinkedIn" },
                  { value: "all", label: "Les 3 en même temps" },
                ]}
              />

              <SelectField
                id="ton"
                label="Ton"
                name="ton"
                value={form.ton}
                onChange={handleChange}
                placeholder="Choisir un ton..."
                required
                options={[
                  { value: "professionnel", label: "Professionnel" },
                  { value: "dynamique", label: "Dynamique" },
                  { value: "luxe", label: "Luxe / Prestige" },
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
                      Générer le{form.plateforme === "all" ? "s posts" : " post"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Result */}
          <div className="flex flex-col gap-4">
            {/* Loading */}
            {loading && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center gap-4 text-center min-h-[260px]">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Génération en cours...</p>
                  <p className="text-xs text-gray-400 mt-1">L&apos;IA rédige vos posts</p>
                </div>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex items-center justify-center min-h-[260px]">
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
            {!loading && !error && !posts && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center gap-3 text-center min-h-[260px]">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                  <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Vos posts apparaîtront ici</p>
                  <p className="text-xs text-gray-400 mt-1">Remplissez le formulaire et cliquez sur &quot;Générer&quot;</p>
                </div>
              </div>
            )}

            {/* Posts */}
            {!loading && !error && posts && posts.map((post) => (
              <PostCard key={post.platform} post={post} />
            ))}
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
