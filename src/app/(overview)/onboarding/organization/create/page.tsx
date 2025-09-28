import type { Metadata } from "next";
import { OrganizationCreationForm } from "@/components/onboarding/OrganizationCreationForm";
import { OrganizationCreationLayout } from "@/components/onboarding/OrganizationCreationLayout";

export const metadata: Metadata = {
  title: "Criar Organização - Ecoleta",
  description:
    "Configure sua organização no Ecoleta e comece a fazer a diferença",
};

export default function CreateOrganizationPage() {
  return (
    <OrganizationCreationLayout>
      <OrganizationCreationForm />
    </OrganizationCreationLayout>
  );
}
