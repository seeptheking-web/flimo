"use client";

import { useState } from "react";

interface AnnounceResultProps {
  result: string | null;
  loading: boolean;
  error: string | null;
}

export default function AnnounceResult({
  result,
  loading,
  error,
}: AnnounceResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse title (first line) from body
  const lines = result?.split("\n") ?? [];
  const title = lines[0] ?? "";
  const body = lines.slice(1).join("\n").trim();

  return (
    <div className="bg-white dark:bg-[#1a2836] rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8 min-h-[420px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Annonce générée</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            Votre annonce prête à publier
          </p>
        </div>
        {result && (
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5"
          >
            {copied ? (
              <>
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-green-600">Copié !</span>
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
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copier
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        {/* Loading state */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-8">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Génération en cours...
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                L&apos;IA rédige votre annonce
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full rounded-xl bg-red-50 border border-red-100 p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && !result && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Votre annonce apparaîtra ici
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Remplissez le formulaire et cliquez sur &quot;Générer&quot;
              </p>
            </div>
          </div>
        )}

        {/* Result */}
        {!loading && !error && result && (
          <div className="flex-1 rounded-xl bg-gray-50 dark:bg-[#0F1923] border border-gray-100 dark:border-gray-700 p-5">
            {title && (
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 leading-snug">
                {title}
              </h3>
            )}
            {body && (
              <div className="space-y-3">
                {body.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
