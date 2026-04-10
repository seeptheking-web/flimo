import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkQuota, incrementGenerations } from "@/lib/quota";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const TYPE_LABELS: Record<string, string> = {
  appartement: "Appartement",
  maison: "Maison",
  studio: "Studio",
  local: "Local commercial",
};

const TON_LABELS: Record<string, string> = {
  professionnel: "professionnel et factuel",
  chaleureux: "chaleureux et humain, proche du lecteur",
  prestige: "haut de gamme, luxueux et exclusif",
};

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  // DEBUG
  console.log("[generate] Clerk userId:", userId ?? "null (non authentifié)");

  if (!userId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const quotaError = await checkQuota(userId);
  if (quotaError) return quotaError;

  try {
    const body = await req.json();
    const { typeBien, surface, pieces, prix, ville, quartier, pointsForts, ton } =
      body;

    if (!typeBien || !surface || !ville || !ton) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const typeLabel = TYPE_LABELS[typeBien] ?? typeBien;
    const tonLabel = TON_LABELS[ton] ?? ton;

    const locationStr = quartier
      ? `${quartier}, ${ville}`
      : ville;

    const piecesStr = pieces ? `${pieces} pièce(s)` : null;
    const prixStr = prix ? `${Number(prix).toLocaleString("fr-FR")} €` : null;

    const prompt = `Rédige une annonce immobilière ${tonLabel} pour le bien suivant :

- Type de bien : ${typeLabel}
- Surface : ${surface} m²${piecesStr ? `\n- Nombre de pièces : ${piecesStr}` : ""}${prixStr ? `\n- Prix : ${prixStr}` : ""}
- Localisation : ${locationStr}${pointsForts ? `\n- Points forts : ${pointsForts}` : ""}

L'annonce doit :
1. Commencer par un titre en texte simple, sans aucun formatage markdown (pas de **, pas de #, pas d'autres symboles)
2. Inclure une description de 2 à 3 paragraphes, naturelle et directe
3. Mettre en valeur les vrais atouts du bien sans exagérer
4. Se terminer par une phrase qui donne envie de visiter
5. Être rédigée entièrement en français
${prixStr ? `6. Mentionner le prix de façon naturelle dans l'annonce (ex. "proposé à ${prixStr}", "à saisir à ${prixStr}") — éviter les formules génériques comme "affiché à X€"` : "6. Ne pas mentionner de prix"}

Format : titre en première ligne (texte brut uniquement), puis saut de ligne, puis le corps de l'annonce.`;

    const completion = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system:
        "Tu es un agent immobilier expérimenté qui rédige des annonces pour ses propres biens. Tu écris de façon naturelle, directe et humaine. Tu mets en valeur les vrais atouts du bien sans exagérer. Tu évites les formules toutes faites comme 'bien d'exception', 'coup de cœur', 'cadre de vie', 'commodités'. Tu vas droit au but, tu donnes envie de visiter. Le titre est en texte simple sans aucun formatage markdown. Si un prix est fourni, intègre-le naturellement dans l'annonce avec des formules comme 'proposé à X €' ou 'à saisir à X €' — jamais 'affiché à X €'. Si aucun prix n'est fourni, n'en mentionne pas.",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textBlock = completion.content.find((b) => b.type === "text");
    const announcement = textBlock?.type === "text" ? textBlock.text.trim() : null;

    if (!announcement) {
      return NextResponse.json(
        { error: "La génération a échoué. Veuillez réessayer." },
        { status: 500 }
      );
    }

    await incrementGenerations(userId);
    return NextResponse.json({ announcement });
  } catch (error) {
    console.error("Anthropic error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération. Vérifiez votre clé API." },
      { status: 500 }
    );
  }
}
