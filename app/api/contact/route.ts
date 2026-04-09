import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prenom, nom, email, sujet, message } = body;

    if (!prenom || !nom || !email || !sujet || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Adresse email invalide." },
        { status: 400 }
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: "Le message est trop court." },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Flimo Contact <onboarding@resend.dev>",
      to: "seeptheking@gmail.com",
      subject: `[Flimo Contact] ${sujet} — ${prenom} ${nom}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563EB; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Nouveau message via Flimo Contact</h1>
          </div>
          <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #374151; width: 140px;">Nom</td>
                <td style="padding: 8px 0; color: #111827;">${prenom} ${nom}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #374151;">Email</td>
                <td style="padding: 8px 0; color: #111827;"><a href="mailto:${email}" style="color: #2563EB;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #374151;">Sujet</td>
                <td style="padding: 8px 0; color: #111827;">${sujet}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #374151; vertical-align: top;">Message</td>
                <td style="padding: 8px 0; color: #111827; white-space: pre-wrap;">${message}</td>
              </tr>
            </table>
          </div>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">Envoyé depuis flimo.io/contact</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
