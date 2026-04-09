import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// DEBUG — vérification des variables d'environnement Supabase
console.log("[supabase] SUPABASE_URL:", supabaseUrl ?? "MANQUANT");
console.log(
  "[supabase] SUPABASE_SERVICE_ROLE_KEY:",
  supabaseServiceKey
    ? supabaseServiceKey === "your-service-role-key"
      ? "PLACEHOLDER (à remplacer !)"
      : `défini (${supabaseServiceKey.slice(0, 8)}...)`
    : "MANQUANT"
);

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});
