"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ErrorState, StepForm } from "@/components/ui";
import { useNotifications } from "@/hooks/useNotifications";
import { organizationStepSchemas } from "@/lib/validations/organization.schema";
import {
  OrganizationConfirmationStep,
  OrganizationContactStep,
  OrganizationDescriptionStep,
  OrganizationNameStep,
  OrganizationTypeStep,
} from "./organization-steps";

interface OrganizationCreationFormProps {
  className?: string;
}

export function OrganizationCreationForm({
  className,
}: OrganizationCreationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError, showLoading, dismiss } = useNotifications();

  const steps = [
    {
      id: "name",
      title: "Qual é o nome da sua organização?",
      description: "Este será o nome público da sua organização na plataforma",
      component: OrganizationNameStep,
      validation: (formData: Record<string, string>) => {
        try {
          organizationStepSchemas.name.parse({ name: formData.name || "" });
          return true;
        } catch {
          return false;
        }
      },
    },
    {
      id: "type",
      title: "Que tipo de organização você representa?",
      description: "Isso nos ajuda a personalizar sua experiência",
      component: OrganizationTypeStep,
      validation: (formData: Record<string, string>) => {
        try {
          organizationStepSchemas.type.parse({ type: formData.type || "" });
          return true;
        } catch {
          return false;
        }
      },
    },
    {
      id: "description",
      title: "Conte-nos sobre sua organização",
      description: "Compartilhe os objetivos sustentáveis da sua organização",
      component: OrganizationDescriptionStep,
      validation: (formData: Record<string, string>) => {
        try {
          organizationStepSchemas.description.parse({
            description: formData.description || "",
          });
          return true;
        } catch {
          return false;
        }
      },
    },
    {
      id: "contact",
      title: "Informações de contato",
      description: "Como as pessoas podem entrar em contato com vocês?",
      component: OrganizationContactStep,
      validation: (formData: Record<string, string>) => {
        try {
          organizationStepSchemas.contact.parse({
            website: formData.website || "",
            contactEmail: formData.contactEmail || "",
            domain: formData.domain || "",
          });
          return true;
        } catch {
          return false;
        }
      },
    },
    {
      id: "confirmation",
      title: "Confirme os dados",
      description: "Revise as informações antes de finalizar",
      component: OrganizationConfirmationStep,
      validation: () => true, // Step de confirmação sempre válido
    },
  ];

  const handleComplete = async (formData: Record<string, string>) => {
    setIsLoading(true);
    setError(null);
    const loadingToastId = showLoading("Criando sua organização...");

    try {
      // TODO: Implementar API route para criar organização
      console.log("Dados da organização:", formData);

      // Simular delay para demonstração
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Dismissar o toast de loading
      dismiss(loadingToastId);

      // TODO: Redirecionar para dashboard da organização
      console.log("Redirecionando para dashboard da organização...");
      showSuccess(
        "Organização criada com sucesso!",
        "Redirecionando para o dashboard...",
      );

      // Aguardar um pouco para mostrar o toast
      await new Promise((resolve) => setTimeout(resolve, 1500));

      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao criar organização:", error);

      // Dismissar o toast de loading em caso de erro
      dismiss(loadingToastId);

      const errorMessage =
        error instanceof Error ? error.message : "Erro inesperado";
      setError(errorMessage);
      showError("Erro ao criar organização", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Mostrar error state se houver erro
  if (error) {
    return (
      <div className={`space-y-6 ${className || ""}`}>
        <ErrorState
          message={error}
          onRetry={() => {
            setError(null);
            setIsLoading(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className={className || ""}>
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Ícone de Organização</title>
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
            </svg>
          </div>
        </div>
        <h2 className="mb-3 font-bold text-3xl text-gray-900">
          Crie sua organização
        </h2>
        <p className="text-gray-600 text-lg">
          Configure sua organização no Ecoleta e comece a fazer a diferença no
          meio ambiente.
        </p>
      </div>

      <StepForm
        steps={steps}
        onComplete={handleComplete}
        onBack={handleBack}
        isLoading={isLoading}
        title="Criar Organização"
      />
    </div>
  );
}
