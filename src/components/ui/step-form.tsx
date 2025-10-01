"use client";

import { type ReactNode, useState } from "react";

import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<{
    formData: Record<string, string>;
    updateFormData: (field: string, value: string) => void;
  }>;
  validation?: (formData: Record<string, string>) => boolean;
}

interface StepFormProps {
  steps: Step[];
  onComplete: (data: Record<string, string>) => void;
  onBack?: () => void;
  className?: string;
  isLoading?: boolean;
  title?: string;
}

export function StepForm({
  steps,
  onComplete,
  onBack,
  className,
  isLoading = false,
  title = "Formulário",
}: StepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  if (!currentStepData) {
    return null;
  }

  const handleNext = () => {
    // Limpar erro anterior
    setValidationError(null);

    // Validar step atual se necessário
    if (currentStepData.validation && !currentStepData.validation(formData)) {
      // Definir mensagem de erro específica baseada no step atual
      let errorMessage = "Por favor, preencha todos os campos obrigatórios.";

      switch (currentStepData.id) {
        case "name":
          errorMessage =
            "O nome da organização deve ter pelo menos 2 caracteres e conter apenas letras, números e caracteres especiais permitidos.";
          break;
        case "type":
          errorMessage = "Por favor, selecione um tipo de organização válido.";
          break;
        case "description":
          errorMessage =
            "A descrição deve ter pelo menos 10 caracteres e no máximo 500 caracteres.";
          break;
        case "contact":
          errorMessage =
            "Por favor, informe um email de contato válido. O website e domínio são opcionais mas devem ter formato válido.";
          break;
      }

      setValidationError(errorMessage);
      return;
    }

    if (isLastStep) {
      onComplete(formData);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handleBack = () => {
    setValidationError(null); // Limpar erro ao voltar
    if (isFirstStep && onBack) {
      onBack();
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className={cn("w-full p-8", className)}>
      {/* Step Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-2xl text-gray-900">
              {title}
            </span>
          </div>
          <div className="flex space-x-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "h-2 w-8 rounded-full transition-colors",
                  index <= currentStep ? "bg-green-600" : "bg-gray-200",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isTransitioning
            ? "translate-x-4 transform opacity-0"
            : "translate-x-0 transform opacity-100",
        )}
      >
        {/* Step Header */}
        <div className="mb-6">
          <h2 className="mb-2 font-semibold text-gray-900 text-xl">
            {currentStepData.title}
          </h2>
          {currentStepData.description && (
            <p className="text-gray-600">{currentStepData.description}</p>
          )}
        </div>

        {/* Step Component */}
        <div className="mb-6">
          {(() => {
            const Comp = currentStepData.component;
            return <Comp formData={formData} updateFormData={updateFormData} />;
          })()}
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <title>Ícone de Erro</title>
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-800 text-sm">{validationError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between space-x-4 border-gray-200 border-t pt-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={isLoading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFirstStep ? "Voltar" : "Anterior"}
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isLoading}
            className="rounded-lg bg-green-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processando...
              </div>
            ) : isLastStep ? (
              "Finalizar"
            ) : (
              "Continuar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
