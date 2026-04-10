import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 px-4 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Commencez votre essai gratuit de 7 jours</h1>
        <p className="mt-2 text-sm text-gray-500">Aucun débit avant la fin de l&apos;essai · Annulable à tout moment</p>
      </div>
      <SignUp />
    </div>
  );
}
