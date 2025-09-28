import type { Metadata } from "next";
import { AccountTypeSelection } from "@/components/onboarding/AccountTypeSelection";

export const metadata: Metadata = {
  title: "Selecionar Tipo de Conta - Ecoleta",
  description:
    "Escolha o tipo de conta que melhor se adequa ao seu perfil no Ecoleta",
};

export default function SelectAccountTypePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="w-full max-w-4xl space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="font-bold text-3xl text-gray-900">
            Bem-vindo ao Ecoleta!
          </h1>
          <p className="mt-2 text-gray-600">
            Para começar, escolha o tipo de conta que melhor se adequa ao seu
            perfil
          </p>
        </div>

        <AccountTypeSelection />
      </div>
    </div>
  );
}
