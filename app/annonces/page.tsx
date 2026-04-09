"use client";

import { useState } from "react";
import ToolsHeader from "@/components/ToolsHeader";
import AnnounceForm from "@/components/AnnounceForm";
import AnnounceResult from "@/components/AnnounceResult";


export default function AnnoncesPage() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleGenerate = async (formData: Record<string, string>) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la génération");
      }

      const data = await res.json();
      setResult(data.announcement);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F1923]">
      <ToolsHeader />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
          Générez votre annonce immobilière
          <span className="text-primary block sm:inline"> en un clic</span>
        </h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
          Décrivez votre bien, choisissez le ton, et laissez l&apos;IA rédiger
          une annonce professionnelle et percutante.
        </p>
      </section>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <div>
            <AnnounceForm onSubmit={handleGenerate} loading={loading} />
          </div>
          <div>
            <AnnounceResult result={result} loading={loading} error={error} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0F1923] py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-400 dark:text-gray-500">
          &copy; {new Date().getFullYear()} Flimo — Annonces immobilières
          générées par IA
        </div>
      </footer>
    </div>
  );
}
