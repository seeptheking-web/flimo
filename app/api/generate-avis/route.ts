import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkQuota, incrementGenerations } from "@/lib/quota";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const TRANSACTION_LABELS: Record<string, string> = {
  vente: "vente",
  location: "location",
  estimation: "estimation",
  gestion: "gestion locative",
};

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  console.log("[generate-avis] Clerk userId:", userId ?? "null (non authentifié)");
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const quotaError = await checkQuota(userId);
  if (quotaError) return quotaError;

  try {
    const body = await req.json();
    const { contenuAvis, noteAvis, typeTransaction, prenomAgent, nomAgence } = body;

    if (!contenuAvis || !noteAvis || !typeTransaction || !prenomAgent || !nomAgence) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const note = parseInt(noteAvis, 10);
    const transactionLabel = TRANSACTION_LABELS[typeTransaction] ?? typeTransaction;

    let tonConsigne = "";
    if (note >= 4) {
      tonConsigne =
        "C'est un avis positif. Remercie sincèrement, mentionne un détail spécifique de l'avis si possible, et invite à recommander l'agence à l'entourage.";
    } else if (note === 3) {
      tonConsigne =
        "C'est un avis neutre. Remercie pour le retour, reconnais les points d'amélioration sans te justifier ni te défendre, et propose d'échanger directement pour en discuter.";
    } else {
      tonConsigne =
        "C'est un avis négatif. Reste calme et professionnel, ne t'énerve pas, reconnais l'expérience vécue par le client, et propose de résoudre la situation en privé. Aucune justification défensive.";
    }

    const prompt = `Voici un avis Google laissé sur notre agence immobilière :

"${contenuAvis}"

Note : ${note}/5 étoiles
Type de transaction concernée : ${transactionLabel}
Prénom de l'agent : ${prenomAgent}
Nom de l'agence : ${nomAgence}

Consigne de ton : ${tonConsigne}

Rédige une réponse à cet avis Google. Maximum 80 mots. Termine toujours par la signature : ${prenomAgent}, ${nomAgence}.`;

    const completion = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system:
        "Tu es un agent immobilier expérimenté qui répond aux avis Google de son agence. Tu réponds en moins de 80 mots, de façon naturelle et humaine. Pour les avis positifs tu remercies avec sincérité sans en faire trop. Pour les avis négatifs tu restes professionnel, calme, et tu proposes de régler le problème en direct — jamais de justification défensive. Tu n'utilises jamais : 'votre satisfaction est notre priorité', 'nous sommes désolés pour la gêne occasionnée', 'n'hésitez pas'. Tu signes toujours avec le prénom de l'agent et le nom de l'agence.",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textBlock = completion.content.find((b) => b.type === "text");
    const reponse = textBlock?.type === "text" ? textBlock.text.trim() : null;

    if (!reponse) {
      return NextResponse.json(
        { error: "La génération a échoué. Veuillez réessayer." },
        { status: 500 }
      );
    }

    await incrementGenerations(userId);
    return NextResponse.json({ reponse });
  } catch (error) {
    console.error("Anthropic error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération. Vérifiez votre clé API." },
      { status: 500 }
    );
  }
}
