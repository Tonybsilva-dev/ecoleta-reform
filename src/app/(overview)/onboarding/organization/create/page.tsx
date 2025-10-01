import type { Metadata } from "next";
import { OrganizationCreationForm } from "@/components/onboarding/OrganizationCreationForm";
import { OrganizationCreationLayout } from "@/components/onboarding/OrganizationCreationLayout";

export const metadata: Metadata = {
  title: "Criar Organização - Sustainable",
  description:
    "Configure sua organização no Sustainable e comece a fazer a diferença",
};

export default function CreateOrganizationPage() {
  return (
    <OrganizationCreationLayout>
      <OrganizationCreationForm />
    </OrganizationCreationLayout>
  );
}
