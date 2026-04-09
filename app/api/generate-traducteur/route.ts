import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkQuota, incrementGenerations } from "@/lib/quota";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  console.log("[generate-traducteur] Clerk userId:", userId ?? "null (non authentifié)");
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const quotaError = await checkQuota(userId);
  if (quotaError) return quotaError;

  try {
    const body = await req.json();
    const { annonceOriginal, langueCible, ton } = body;

    if (!annonceOriginal || !langueCible || !ton) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const prompt = `Traduis cette annonce immobilière en ${langueCible} avec un ton ${ton === "prestige" ? "Prestige/Luxe" : "Standard"} :

${annonceOriginal}

Donne uniquement la traduction, sans explication ni commentaire. Conserve la structure de l'annonce (titre + corps).`;

    const completion = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system:
        "Tu es un traducteur spécialisé en immobilier de luxe. Tu traduis des annonces immobilières françaises de façon naturelle et professionnelle. Tu n'es pas un traducteur automatique — tu adaptes les expressions et le style au marché immobilier du pays ciblé. Pour le ton Prestige tu utilises le vocabulaire du luxe immobilier dans la langue cible. La traduction doit sonner comme rédigée par un natif, pas traduite.",
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = completion.content.find((b) => b.type === "text");
    const traduction =
      textBlock?.type === "text" ? textBlock.text.trim() : null;

    if (!traduction) {
      return NextResponse.json(
        { error: "La génération a échoué. Veuillez réessayer." },
        { status: 500 }
      );
    }

    await incrementGenerations(userId);
    return NextResponse.json({ traduction });
  } catch (error) {
    console.error("Anthropic error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération. Vérifiez votre clé API." },
      { status: 500 }
    );
  }
}
