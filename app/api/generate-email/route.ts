import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkQuota, incrementGenerations } from "@/lib/quota";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const PROPRIETAIRE_LABELS: Record<string, string> = {
  particulier: "un particulier propriétaire occupant",
  bailleur: "un propriétaire bailleur (investisseur)",
  succession: "un propriétaire dans le cadre d'une succession ou héritage",
  entreprise: "une entreprise propriétaire",
};

const BIEN_LABELS: Record<string, string> = {
  appartement: "appartement",
  maison: "maison",
  immeuble: "immeuble",
  local: "local commercial",
  terrain: "terrain",
};

const ARGUMENT_LABELS: Record<string, string> = {
  expertise: "expertise locale du secteur",
  portefeuille: "portefeuille d'acheteurs actifs prêts à acheter",
  estimation: "estimation gratuite et sans engagement",
  vente_rapide: "capacité à vendre rapidement (délai garanti)",
  discretion: "discrétion totale sur la mise en vente",
};

const TON_LABELS: Record<string, string> = {
  professionnel: "professionnel et direct",
  chaleureux: "chaleureux et humain",
  urgence: "urgence subtile (créer un sentiment d'opportunité sans insister)",
};

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  console.log("[generate-email] Clerk userId:", userId ?? "null (non authentifié)");
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const quotaError = await checkQuota(userId);
  if (quotaError) return quotaError;

  try {
    const body = await req.json();
    const { typeProprietaire, typeBien, ville, argument, ton, prenomAgent, nomAgence } = body;

    if (!typeProprietaire || !typeBien || !ville || !argument || !ton || !prenomAgent || !nomAgence) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const proprietaireLabel = PROPRIETAIRE_LABELS[typeProprietaire] ?? typeProprietaire;
    const bienLabel = BIEN_LABELS[typeBien] ?? typeBien;
    const argumentLabel = ARGUMENT_LABELS[argument] ?? argument;
    const tonLabel = TON_LABELS[ton] ?? ton;

    const prompt = `Écris un email de prospection immobilière avec les paramètres suivants :

- Destinataire : ${proprietaireLabel}
- Type de bien ciblé : ${bienLabel}
- Secteur géographique : ${ville}
- Argument principal à mettre en avant : ${argumentLabel}
- Ton souhaité : ${tonLabel}
- Prénom de l'agent : ${prenomAgent}
- Nom de l'agence : ${nomAgence}

Contraintes absolues :
- Maximum 120 mots pour le corps de l'email
- L'objet doit être accrocheur, naturel, jamais "Proposition de mandat"
- L'accroche doit être personnalisée selon le type de propriétaire
- Terminer par une proposition d'action concrète et précise (pas "n'hésitez pas à me contacter")
- Signature avec prénom et agence
- Première ligne = objet de l'email, puis ligne vide, puis le corps`;

    const completion = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system:
        "Tu es un agent immobilier expérimenté qui écrit ses propres emails de prospection. Tu écris court, direct et humain. Tes emails font maximum 120 mots. Tu n'utilises jamais : 'je me permets', 'dans le cadre de', 'n'hésitez pas', 'professionnel aguerri', 'vous accompagner'. Tu vas droit au but, tu montres que tu connais le secteur, et tu proposes une action concrète. L'objet de l'email est sur la première ligne, suivi d'une ligne vide, puis le corps de l'email.",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textBlock = completion.content.find((b) => b.type === "text");
    const email = textBlock?.type === "text" ? textBlock.text.trim() : null;

    if (!email) {
      return NextResponse.json(
        { error: "La génération a échoué. Veuillez réessayer." },
        { status: 500 }
      );
    }

    await incrementGenerations(userId);
    return NextResponse.json({ email });
  } catch (error) {
    console.error("Anthropic error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération. Vérifiez votre clé API." },
      { status: 500 }
    );
  }
}
