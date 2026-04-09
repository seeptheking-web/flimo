import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkQuota, incrementGenerations } from "@/lib/quota";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const INTERET_LABELS: Record<string, string> = {
  tres_interesse: "Très intéressé",
  interesse_hesitant: "Intéressé mais hésitant",
  peu_interesse: "Peu intéressé",
  pas_interesse: "Pas intéressé",
};

const ETAPE_LABELS: Record<string, string> = {
  deuxieme_visite: "Deuxième visite prévue",
  offre_reflexion: "Offre en cours de réflexion",
  attente_reponse: "En attente de réponse",
  aucune_suite: "Aucune suite",
};

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  console.log("[generate-compte-rendu] Clerk userId:", userId ?? "null (non authentifié)");
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const quotaError = await checkQuota(userId);
  if (quotaError) return quotaError;

  try {
    const body = await req.json();
    const {
      typeBien,
      adresseBien,
      dateVisite,
      nomVisiteur,
      budgetVisiteur,
      interetVisiteur,
      pointsPositifs,
      pointsNegatifs,
      prochaineEtape,
      prenomAgent,
      nomAgence,
    } = body;

    if (
      !typeBien ||
      !adresseBien ||
      !dateVisite ||
      !nomVisiteur ||
      !interetVisiteur ||
      !pointsPositifs ||
      !pointsNegatifs ||
      !prochaineEtape ||
      !prenomAgent ||
      !nomAgence
    ) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const interetLabel = INTERET_LABELS[interetVisiteur] ?? interetVisiteur;
    const etapeLabel = ETAPE_LABELS[prochaineEtape] ?? prochaineEtape;

    const prompt = `Voici les informations de la visite :

Type de bien : ${typeBien}
Adresse / référence : ${adresseBien}
Date de la visite : ${dateVisite}
Visiteur(s) : ${nomVisiteur}
${budgetVisiteur ? `Budget annoncé : ${budgetVisiteur}` : "Budget : non communiqué"}
Niveau d'intérêt : ${interetLabel}
Points positifs relevés : ${pointsPositifs}
Points négatifs ou freins : ${pointsNegatifs}
Prochaine étape convenue : ${etapeLabel}
Agent : ${prenomAgent}, ${nomAgence}

Rédige le compte-rendu de visite.`;

    const completion = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system:
        "Tu es un agent immobilier qui rédige un compte-rendu de visite à envoyer au vendeur du bien. Tu écris de façon professionnelle, claire et rassurante. Tu es diplomate sur le niveau d'intérêt — même si le visiteur n'est pas intéressé tu le formules posément. Tu vas droit au but, tu mentionnes les points clés et la prochaine étape concrète. Maximum 200 mots. Pas de formules creuses.",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textBlock = completion.content.find((b) => b.type === "text");
    const compteRendu = textBlock?.type === "text" ? textBlock.text.trim() : null;

    if (!compteRendu) {
      return NextResponse.json(
        { error: "La génération a échoué. Veuillez réessayer." },
        { status: 500 }
      );
    }

    await incrementGenerations(userId);
    return NextResponse.json({ compteRendu });
  } catch (error) {
    console.error("Anthropic error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération. Vérifiez votre clé API." },
      { status: 500 }
    );
  }
}
