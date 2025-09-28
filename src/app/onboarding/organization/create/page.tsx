import type { Metadata } from "next";
import { OrganizationCreationForm } from "@/components/onboarding/OrganizationCreationForm";

export const metadata: Metadata = {
  title: "Criar Organização - Ecoleta",
  description:
    "Configure sua organização no Ecoleta e comece a fazer a diferença",
};

export default function CreateOrganizationPage() {
  return (
    <div className="h-screen w-full space-y-8 rounded-lg bg-white shadow-lg">
      <OrganizationCreationForm />
    </div>
  );
}
