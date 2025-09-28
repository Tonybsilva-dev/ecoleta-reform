"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ErrorState, StepForm } from "@/components/ui";
import { useNotifications } from "@/hooks/useNotifications";
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
      validation: () => {
        // Validação será feita no componente
        return true;
      },
    },
    {
      id: "type",
      title: "Que tipo de organização você representa?",
      description: "Isso nos ajuda a personalizar sua experiência",
      component: OrganizationTypeStep,
      validation: () => {
        // Validação será feita no componente
        return true;
      },
    },
    {
      id: "description",
      title: "Conte-nos sobre sua organização",
      description: "Compartilhe os objetivos sustentáveis da sua organização",
      component: OrganizationDescriptionStep,
    },
    {
      id: "contact",
      title: "Informações de contato",
      description: "Como as pessoas podem entrar em contato com vocês?",
      component: OrganizationContactStep,
    },
    {
      id: "confirmation",
      title: "Confirme os dados",
      description: "Revise as informações antes de finalizar",
      component: OrganizationConfirmationStep,
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
      <StepForm
        steps={steps}
        onComplete={handleComplete}
        onBack={handleBack}
        isLoading={isLoading}
      />
    </div>
  );
}
