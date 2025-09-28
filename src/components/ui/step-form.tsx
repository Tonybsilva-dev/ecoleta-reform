"use client";

import { type ReactNode, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "./button";

interface Step {
  id: string;
  title: string;
  description?: string;
  component: (props: {
    formData: Record<string, string>;
    updateFormData: (field: string, value: string) => void;
  }) => ReactNode;
  validation?: () => boolean;
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

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    // Validar step atual se necessário
    if (currentStepData.validation && !currentStepData.validation()) {
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
    <div className={cn("mx-auto w-full max-w-2xl", className)}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-medium text-muted-foreground text-sm">
            Passo {currentStep + 1} de {steps.length}
          </span>
          <span className="text-muted-foreground text-sm">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-green-500 transition-all duration-300 ease-out"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
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
            <h2 className="mb-2 font-bold text-2xl text-gray-900">
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
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={isLoading}
          className="px-8"
        >
          {isFirstStep ? "Voltar" : "Anterior"}
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          disabled={isLoading}
          className="px-8"
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
        </Button>
      </div>
    </div>
  );
}
