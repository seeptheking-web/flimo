import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkQuota, incrementGenerations } from "@/lib/quota";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  console.log("[generate-pitch-mandat] Clerk userId:", userId ?? "null (non authentifié)");
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const quotaError = await checkQuota(userId);
  if (quotaError) return quotaError;

  try {
    const body = await req.json();
    const {
      typeMandat,
      typeBien,
      villeQuartier,
      estimation,
      situationVendeur,
      concurrents,
      argumentDifferenciateur,
      prenomAgent,
      nomAgence,
    } = body;

    if (
      !typeMandat ||
      !typeBien ||
      !villeQuartier ||
      !estimation ||
      !situationVendeur ||
      !concurrents ||
      !argumentDifferenciateur ||
      !prenomAgent ||
      !nomAgence
    ) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const prompt = `Génère un pitch de mandat pour cette situation :

- Type de mandat visé : ${typeMandat}
- Type de bien : ${typeBien}
- Ville et quartier : ${villeQuartier}
- Estimation : ${estimation}
- Situation du vendeur : ${situationVendeur}
- Concurrents en lice : ${concurrents}
- Argument différenciateur : ${argumentDifferenciateur}
- Prénom de l'agent : ${prenomAgent}
- Nom de l'agence : ${nomAgence}

Structure le pitch en 4 parties clairement titrées : Accroche, Valeur ajoutée, Ce qui me différencie, Closing. Maximum 250 mots au total.`;

    const completion = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system:
        "Tu es un agent immobilier expérimenté qui présente son pitch pour obtenir un mandat de vente. Tu écris un argumentaire structuré en 4 parties : Accroche percutante, Valeur ajoutée concrète, Ce qui te différencie des autres agences, Closing avec proposition claire. Maximum 250 mots. Tu adaptes le ton selon la situation du vendeur — urgent, serein, ou méfiant. Tes formulations sont prêtes à être dites à voix haute en rendez-vous. Tu es confiant sans être arrogant.",
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = completion.content.find((b) => b.type === "text");
    const pitch = textBlock?.type === "text" ? textBlock.text.trim() : null;

    if (!pitch) {
      return NextResponse.json(
        { error: "La génération a échoué. Veuillez réessayer." },
        { status: 500 }
      );
    }

    await incrementGenerations(userId);
    return NextResponse.json({ pitch });
  } catch (error) {
    console.error("Anthropic error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération. Vérifiez votre clé API." },
      { status: 500 }
    );
  }
}
