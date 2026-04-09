import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkQuota, incrementGenerations } from "@/lib/quota";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const TYPE_BIEN_LABELS: Record<string, string> = {
  appartement: "appartement",
  maison: "maison",
  studio: "studio",
  local: "local commercial",
  terrain: "terrain",
};

const TON_LABELS: Record<string, string> = {
  professionnel: "professionnel et sérieux",
  dynamique: "dynamique et enthousiaste",
  luxe: "luxe et prestige",
};

const SYSTEM_PROMPT =
  "Tu es un agent immobilier qui gère ses propres réseaux sociaux. Tu écris des posts naturels, engageants, qui donnent envie de contacter l'agent. Pas de superlatifs excessifs, pas de majuscules abusives. Pour Instagram : accroche percutante en première ligne, emojis utilisés avec parcimonie, hashtags ciblés. Pour Facebook : ton humain et direct, question ou invitation à l'action en fin de post. Pour LinkedIn : angle investissement ou marché local, chiffres si disponibles, ton expert sans être pompeux.";

function buildBienDescription(body: {
  typeBien: string;
  surface: string;
  villeQuartier: string;
  prix?: string;
  pointsForts: string;
}): string {
  const typeBienLabel = TYPE_BIEN_LABELS[body.typeBien] ?? body.typeBien;
  let desc = `Type de bien : ${typeBienLabel}\nSurface : ${body.surface} m²\nLocalisation : ${body.villeQuartier}`;
  if (body.prix) desc += `\nPrix : ${body.prix}`;
  desc += `\nPoints forts : ${body.pointsForts}`;
  return desc;
}

function buildSinglePrompt(
  platform: string,
  bienDesc: string,
  tonLabel: string
): string {
  const platformInstructions: Record<string, string> = {
    instagram:
      "Écris un post Instagram : accroche courte et visuelle en première ligne, emojis discrets (3 maximum), 5 à 8 hashtags pertinents groupés en fin de post.",
    facebook:
      "Écris un post Facebook : ton conversationnel et humain, pas de hashtags, termine par une question ou une invitation à commenter ou partager.",
    linkedin:
      "Écris un post LinkedIn : angle investissement ou marché local, chiffres si disponibles, ton expert sans être pompeux, pas d'emojis excessifs, pas de hashtags.",
  };

  return `${platformInstructions[platform]}

Bien immobilier :
${bienDesc}

Ton souhaité : ${tonLabel}

Écris uniquement le texte du post, sans titre ni label de plateforme.`;
}

function buildAllPrompt(bienDesc: string, tonLabel: string): string {
  return `Génère 3 posts distincts pour les réseaux sociaux suivants : Instagram, Facebook et LinkedIn.

Bien immobilier :
${bienDesc}

Ton souhaité : ${tonLabel}

Format de réponse obligatoire — utilise exactement ces séparateurs :
===INSTAGRAM===
[post Instagram ici]
===FACEBOOK===
[post Facebook ici]
===LINKEDIN===
[post LinkedIn ici]

Règles :
- Instagram : accroche courte et visuelle en première ligne, emojis discrets (3 maximum), 5 à 8 hashtags pertinents groupés en fin de post.
- Facebook : ton conversationnel et humain, pas de hashtags, termine par une question ou une invitation à commenter ou partager.
- LinkedIn : angle investissement ou marché local, chiffres si disponibles, ton expert sans être pompeux, pas d'emojis excessifs, pas de hashtags.`;
}

function parseAllPosts(text: string): {
  instagram: string;
  facebook: string;
  linkedin: string;
} | null {
  const instagramMatch = text.match(
    /===INSTAGRAM===\s*([\s\S]*?)(?===FACEBOOK===|$)/
  );
  const facebookMatch = text.match(
    /===FACEBOOK===\s*([\s\S]*?)(?===LINKEDIN===|$)/
  );
  const linkedinMatch = text.match(/===LINKEDIN===\s*([\s\S]*?)$/);

  if (!instagramMatch || !facebookMatch || !linkedinMatch) return null;

  return {
    instagram: instagramMatch[1].trim(),
    facebook: facebookMatch[1].trim(),
    linkedin: linkedinMatch[1].trim(),
  };
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  console.log("[generate-social] Clerk userId:", userId ?? "null (non authentifié)");
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const quotaError = await checkQuota(userId);
  if (quotaError) return quotaError;

  try {
    const body = await req.json();
    const {
      typeBien,
      surface,
      villeQuartier,
      prix,
      pointsForts,
      plateforme,
      ton,
    } = body;

    if (!typeBien || !surface || !villeQuartier || !pointsForts || !plateforme || !ton) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const tonLabel = TON_LABELS[ton] ?? ton;
    const bienDesc = buildBienDescription({ typeBien, surface, villeQuartier, prix, pointsForts });

    if (plateforme === "all") {
      const prompt = buildAllPrompt(bienDesc, tonLabel);
      const completion = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      });

      const textBlock = completion.content.find((b) => b.type === "text");
      const raw = textBlock?.type === "text" ? textBlock.text.trim() : null;

      if (!raw) {
        return NextResponse.json(
          { error: "La génération a échoué. Veuillez réessayer." },
          { status: 500 }
        );
      }

      const parsed = parseAllPosts(raw);
      if (!parsed) {
        return NextResponse.json(
          { error: "La génération a échoué. Veuillez réessayer." },
          { status: 500 }
        );
      }

      await incrementGenerations(userId);
      return NextResponse.json({
        posts: [
          { platform: "instagram", content: parsed.instagram },
          { platform: "facebook", content: parsed.facebook },
          { platform: "linkedin", content: parsed.linkedin },
        ],
      });
    } else {
      const prompt = buildSinglePrompt(plateforme, bienDesc, tonLabel);
      const completion = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      });

      const textBlock = completion.content.find((b) => b.type === "text");
      const content = textBlock?.type === "text" ? textBlock.text.trim() : null;

      if (!content) {
        return NextResponse.json(
          { error: "La génération a échoué. Veuillez réessayer." },
          { status: 500 }
        );
      }

      await incrementGenerations(userId);
      return NextResponse.json({
        posts: [{ platform: plateforme, content }],
      });
    }
  } catch (error) {
    console.error("Anthropic error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération. Vérifiez votre clé API." },
      { status: 500 }
    );
  }
}
