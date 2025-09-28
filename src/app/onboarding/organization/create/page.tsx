import type { Metadata } from "next";
import { OrganizationCreationForm } from "@/components/onboarding/OrganizationCreationForm";

export const metadata: Metadata = {
  title: "Criar Organização - Ecoleta",
  description:
    "Configure sua organização no Ecoleta e comece a fazer a diferença",
};

export default function CreateOrganizationPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="w-full max-w-2xl space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="font-bold text-3xl text-gray-900">
            Criar Organização
          </h1>
          <p className="mt-2 text-gray-600">
            Configure sua organização no Ecoleta e comece a fazer a diferença
          </p>
        </div>

        <OrganizationCreationForm />
      </div>
    </div>
  );
}
