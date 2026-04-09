import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkQuota, incrementGenerations } from "@/lib/quota";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const ROLE_LABELS: Record<string, string> = {
  vendeur: "l'agent représente le VENDEUR et doit défendre le prix et la valeur du bien",
  acheteur: "l'agent représente l'ACHETEUR et doit justifier une offre inférieure au prix affiché",
};

const BIEN_LABELS: Record<string, string> = {
  appartement: "appartement",
  maison: "maison",
  local_commercial: "local commercial",
  terrain: "terrain",
};

const ANCIENNETE_LABELS: Record<string, string> = {
  moins_1_mois: "moins d'un mois sur le marché (bien récent)",
  "1_3_mois": "entre 1 et 3 mois sur le marché",
  plus_3_mois: "plus de 3 mois sur le marché (bien qui stagne)",
};

const MARCHE_LABELS: Record<string, string> = {
  tendu: "marché tendu avec peu d'offres — les biens partent vite",
  equilibre: "marché équilibré — offre et demande à peu près similaires",
  offres: "marché avec beaucoup d'offres — les acheteurs ont le choix",
};

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  console.log("[generate-negociation] Clerk userId:", userId ?? "null (non authentifié)");
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const quotaError = await checkQuota(userId);
  if (quotaError) return quotaError;

  try {
    const body = await req.json();
    const {
      roleAgent,
      typeBien,
      prixAffiche,
      prixPropose,
      ancienneteMarche,
      pointsForts,
      pointsFaibles,
      contexteMarche,
    } = body;

    if (!roleAgent || !typeBien || !prixAffiche || !ancienneteMarche || !pointsForts || !contexteMarche) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const roleLabel = ROLE_LABELS[roleAgent] ?? roleAgent;
    const bienLabel = BIEN_LABELS[typeBien] ?? typeBien;
    const ancienneteLabel = ANCIENNETE_LABELS[ancienneteMarche] ?? ancienneteMarche;
    const marcheLabel = MARCHE_LABELS[contexteMarche] ?? contexteMarche;

    const prixInfo = prixPropose
      ? `Prix affiché : ${prixAffiche} — Prix proposé par l'acheteur : ${prixPropose} (écart à justifier)`
      : `Prix affiché : ${prixAffiche}`;

    const travauxInfo = pointsFaibles
      ? `Points faibles / travaux à prévoir : ${pointsFaibles}`
      : "Aucun point faible ou travaux majeurs signalés";

    const prompt = `Génère un argumentaire de négociation immobilière avec les paramètres suivants :

- Rôle : ${roleLabel}
- Type de bien : ${bienLabel}
- ${prixInfo}
- Ancienneté sur le marché : ${ancienneteLabel}
- Points forts du bien : ${pointsForts}
- ${travauxInfo}
- Contexte du marché local : ${marcheLabel}

Structure attendue :
1. 5 arguments numérotés, concrets et chiffrés si possible, avec une formulation exacte prête à prononcer en rendez-vous
2. Une section "Anticiper les contre-arguments" avec 3 objections probables de l'autre partie et les réponses correspondantes

Tout doit être directement utilisable en rendez-vous. Pas de théorie.`;

    const completion = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system:
        "Tu es un négociateur immobilier expérimenté. Tu génères un argumentaire de négociation concret et prêt à utiliser en rendez-vous. Tu donnes 5 arguments solides avec des formulations exactes à prononcer. Tu adaptes la stratégie selon que l'agent représente le vendeur ou l'acheteur. Tu anticipes les objections de l'autre partie avec des réponses prêtes. Tout est concret, chiffré quand possible, et directement utilisable. Pas de théorie, que de l'opérationnel.",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textBlock = completion.content.find((b) => b.type === "text");
    const argumentaire = textBlock?.type === "text" ? textBlock.text.trim() : null;

    if (!argumentaire) {
      return NextResponse.json(
        { error: "La génération a échoué. Veuillez réessayer." },
        { status: 500 }
      );
    }

    await incrementGenerations(userId);
    return NextResponse.json({ argumentaire });
  } catch (error) {
    console.error("Anthropic error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération. Vérifiez votre clé API." },
      { status: 500 }
    );
  }
}
