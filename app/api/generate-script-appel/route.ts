import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkQuota, incrementGenerations } from "@/lib/quota";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const PROSPECT_LABELS: Record<string, string> = {
  proprietaire_estimer: "un propriétaire qui n'a pas encore mis son bien en vente et qui souhaite peut-être une estimation",
  proprietaire_vente: "un propriétaire qui a déjà mis son bien en vente (potentiellement avec une autre agence)",
  ancien_client: "un ancien client que l'agent a déjà accompagné",
  prospect_froid: "un prospect froid qui n'a jamais été contacté par l'agence",
};

const BIEN_LABELS: Record<string, string> = {
  appartement: "appartement",
  maison: "maison",
  immeuble: "immeuble de rapport",
  local: "local commercial ou professionnel",
};

const OBJECTIF_LABELS: Record<string, string> = {
  rdv_estimation: "décrocher un rendez-vous pour une estimation gratuite",
  recuperer_mandat: "récupérer un mandat de vente (bien déjà en vente ailleurs ou mandat expiré)",
  relancer_contact: "relancer un ancien contact et reprendre la relation",
  premier_contact: "établir un premier contact à froid et ouvrir la porte à une future collaboration",
};

const ARGUMENT_LABELS: Record<string, string> = {
  expertise_locale: "l'expertise et la connaissance approfondie du secteur local",
  acheteurs_actifs: "un portefeuille d'acheteurs actifs actuellement en recherche dans ce secteur",
  estimation_gratuite: "une estimation gratuite et sans engagement réalisée par un expert local",
  vente_rapide: "la capacité à vendre rapidement grâce au réseau et aux acheteurs en portefeuille",
};

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  console.log("[generate-script-appel] Clerk userId:", userId ?? "null (non authentifié)");
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const quotaError = await checkQuota(userId);
  if (quotaError) return quotaError;

  try {
    const body = await req.json();
    const { typeProspect, typeBien, ville, objectifAppel, argument, prenomAgent } = body;

    if (!typeProspect || !typeBien || !ville || !objectifAppel || !argument || !prenomAgent) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const prospectLabel = PROSPECT_LABELS[typeProspect] ?? typeProspect;
    const bienLabel = BIEN_LABELS[typeBien] ?? typeBien;
    const objectifLabel = OBJECTIF_LABELS[objectifAppel] ?? objectifAppel;
    const argumentLabel = ARGUMENT_LABELS[argument] ?? argument;

    const prompt = `Génère un script d'appel téléphonique avec les paramètres suivants :

- Type de prospect : ${prospectLabel}
- Type de bien ciblé : ${bienLabel}
- Secteur géographique : ${ville}
- Objectif de l'appel : ${objectifLabel}
- Argument principal : ${argumentLabel}
- Prénom de l'agent : ${prenomAgent}

Structure obligatoire en 3 parties :
1. ACCROCHE (≈10 secondes) : se présenter, capter l'attention, donner une raison d'écouter
2. ARGUMENTAIRE (≈30 secondes) : développer l'argument principal, créer de l'intérêt
3. CLOSING (≈20 secondes) : proposer un rendez-vous ou une action concrète

Après le script principal, ajouter une section RÉPONSES AUX OBJECTIONS avec 3 objections classiques et les réponses correspondantes :
- "Je suis déjà avec une agence"
- "Je ne suis pas intéressé"
- "Rappelez-moi plus tard"

Maximum 200 mots au total.`;

    const completion = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system:
        "Tu es un coach commercial spécialisé en immobilier. Tu rédiges des scripts d'appel téléphonique pour agents immobiliers. Le script est découpé en 3 parties : Accroche courte et directe, Argumentaire personnalisé, Closing avec proposition de RDV. Le tout fait maximum 200 mots. Tu écris comme on parle, avec des phrases courtes. Tu inclus une réponse aux objections classiques : 'je suis déjà avec une agence', 'je ne suis pas intéressé', 'rappelez-moi plus tard'. Le script ne doit jamais sonner téléopérateur ou commercial agressif.",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textBlock = completion.content.find((b) => b.type === "text");
    const script = textBlock?.type === "text" ? textBlock.text.trim() : null;

    if (!script) {
      return NextResponse.json(
        { error: "La génération a échoué. Veuillez réessayer." },
        { status: 500 }
      );
    }

    await incrementGenerations(userId);
    return NextResponse.json({ script });
  } catch (error) {
    console.error("Anthropic error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération. Vérifiez votre clé API." },
      { status: 500 }
    );
  }
}
