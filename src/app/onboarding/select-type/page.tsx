import type { Metadata } from "next";
import { AccountTypeSelection } from "@/components/onboarding/AccountTypeSelection";

export const metadata: Metadata = {
  title: "Selecionar Tipo de Conta - Ecoleta",
  description:
    "Escolha o tipo de conta que melhor se adequa ao seu perfil no Ecoleta",
};

export default function SelectAccountTypePage() {
  return <AccountTypeSelection />;
}
