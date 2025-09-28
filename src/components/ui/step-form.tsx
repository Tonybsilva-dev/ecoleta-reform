"use client";

import { type ReactNode, useState } from "react";

import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  description?: string;
  component: (props: {
    formData: Record<string, string>;
    updateFormData: (field: string, value: string) => void;
  }) => ReactNode;
  validation?: (formData: Record<string, string>) => boolean;
}

interface StepFormProps {
  steps: Step[];
  onComplete: (data: Record<string, string>) => void;
  onBack?: () => void;
  className?: string;
  isLoading?: boolean;
}

export function StepForm({
  steps,
  onComplete,
  onBack,
  className,
  isLoading = false,
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
    <div className={cn("flex min-h-screen", className)}>
      {/* Left Column - Progress Section */}
      <div className="hidden flex-col justify-between bg-green-600 p-8 lg:flex lg:w-1/3">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded bg-white"></div>
          <span className="font-bold text-white text-xl">Ecoleta</span>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="font-bold text-3xl text-white leading-tight">
            Configure sua organização no Ecoleta e comece a fazer a diferença.
          </h1>
          <p className="text-green-100 text-lg leading-relaxed">
            Crie seu perfil de organização e conecte-se com uma comunidade
            sustentável para transformar resíduos em recursos valiosos.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex space-x-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`h-1 rounded ${
                index <= currentStep ? "w-8 bg-white" : "w-4 bg-green-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right Column - Step Content */}
      <div className="flex w-full flex-col justify-center bg-white px-8 py-12 lg:w-2/3">
        <div className="mx-auto w-full max-w-2xl">
          <div
            className={cn(
              "transition-all duration-300 ease-in-out",
              isTransitioning
                ? "translate-x-4 transform opacity-0"
                : "translate-x-0 transform opacity-100",
            )}
          >
            {/* Step Header */}
            <div className="mb-8 text-center">
              <h2 className="mb-3 font-bold text-3xl text-gray-900">
                {currentStepData.title}
              </h2>
              {currentStepData.description && (
                <p className="text-gray-600 text-lg">
                  {currentStepData.description}
                </p>
              )}
            </div>

            {/* Step Component */}
            <div className="mb-8">
              {currentStepData.component({ formData, updateFormData })}
            </div>

            {/* Validation Error */}
            {validationError && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
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
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between space-x-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={isLoading}
              className="rounded-xl border-2 border-gray-300 bg-white px-8 py-4 font-semibold text-gray-700 transition-colors duration-200 hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isFirstStep ? "Voltar" : "Anterior"}
            </button>

            <button
              type="button"
              onClick={() => {
                console.log("Button clicked, isLoading:", isLoading);
                handleNext();
              }}
              disabled={isLoading}
              className="rounded-xl bg-green-600 px-8 py-4 font-semibold text-white transition-colors duration-200 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
    </div>
  );
}
