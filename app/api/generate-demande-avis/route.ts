import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkQuota, incrementGenerations } from "@/lib/quota";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  console.log("[generate-demande-avis] Clerk userId:", userId ?? "null (non authentifié)");
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const quotaError = await checkQuota(userId);
  if (quotaError) return quotaError;

  try {
    const body = await req.json();
    const {
      typeTransaction,
      prenomClient,
      typeBien,
      ville,
      delaiTransaction,
      pointFort,
      canalEnvoi,
      prenomAgent,
      nomAgence,
    } = body;

    if (
      !typeTransaction ||
      !prenomClient ||
      !typeBien ||
      !ville ||
      !delaiTransaction ||
      !pointFort ||
      !canalEnvoi ||
      !prenomAgent ||
      !nomAgence
    ) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const prompt = `Génère un message de demande d'avis Google pour ce contexte :

- Type de transaction : ${typeTransaction}
- Prénom du client : ${prenomClient}
- Type de bien : ${typeBien}
- Ville : ${ville}
- Durée de la transaction : ${delaiTransaction}
- Ce qui s'est bien passé : ${pointFort}
- Canal d'envoi : ${canalEnvoi}
- Prénom de l'agent : ${prenomAgent}
- Nom de l'agence : ${nomAgence}

Génère uniquement le message, sans introduction ni commentaire.`;

    const completion = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system:
        "Tu es un agent immobilier qui envoie un message à un client satisfait pour lui demander un avis Google. Tu écris de façon naturelle et chaleureuse, comme si tu envoyais un message à quelqu'un que tu connais bien. Tu mentionnes un détail spécifique de la transaction. Tu ne supplies pas, tu ne mets pas la pression. Pour email : maximum 80 mots. Pour SMS : maximum 50 mots, pas de formules de politesse longues. Tu inclus [LIEN GOOGLE] là où l'agent doit coller son lien.",
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = completion.content.find((b) => b.type === "text");
    const message =
      textBlock?.type === "text" ? textBlock.text.trim() : null;

    if (!message) {
      return NextResponse.json(
        { error: "La génération a échoué. Veuillez réessayer." },
        { status: 500 }
      );
    }

    await incrementGenerations(userId);
    return NextResponse.json({ message });
  } catch (error) {
    console.error("Anthropic error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération. Vérifiez votre clé API." },
      { status: 500 }
    );
  }
}
