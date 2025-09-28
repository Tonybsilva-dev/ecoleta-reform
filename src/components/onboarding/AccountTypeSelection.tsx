"use client";

import { UserType } from "@prisma/client";
import { useState } from "react";
import { selectAccountType } from "@/actions/onboarding";

interface AccountTypeSelectionProps {
  className?: string;
}

export function AccountTypeSelection({ className }: AccountTypeSelectionProps) {
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTypeSelection = async (userType: UserType) => {
    setSelectedType(userType);
    setIsLoading(true);
    setError(null);

    try {
      await selectAccountType(userType);

      // Aguardar um pouco para garantir que a sessão seja atualizada
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Forçar reload da página para atualizar a sessão
      window.location.reload();
    } catch (error) {
      console.error("Erro ao selecionar tipo de conta:", error);
      setError(error instanceof Error ? error.message : "Erro inesperado");
      setIsLoading(false);
    }
  };

  const accountTypes = [
    {
      type: UserType.COMPANY,
      title: "Organização",
      description: "Gerencie a coleta de resíduos da sua empresa ou ONG",
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <title>Ícone de Organização</title>
          <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
        </svg>
      ),
    },
    {
      type: UserType.CITIZEN,
      title: "Cidadão",
      description: "Descarte seus resíduos de forma consciente",
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <title>Ícone de Cidadão</title>
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={`flex min-h-screen ${className || ""}`}>
      {/* Left Column - Promotional Section */}
      <div className="hidden flex-col justify-between bg-green-600 p-8 lg:flex lg:w-1/3">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded bg-white"></div>
          <span className="font-bold text-white text-xl">Ecoleta</span>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="font-bold text-3xl text-white leading-tight">
            Comece a fazer a diferença no meio ambiente agora.
          </h1>
          <p className="text-green-100 text-lg leading-relaxed">
            Conecte-se com uma comunidade sustentável e transforme resíduos em
            recursos valiosos através de nossa plataforma integrada.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex space-x-2">
          <div className="h-1 w-8 rounded bg-white"></div>
          <div className="h-1 w-4 rounded bg-green-300"></div>
          <div className="h-1 w-4 rounded bg-green-300"></div>
        </div>
      </div>

      {/* Right Column - Account Type Selection */}
      <div className="flex w-full flex-col justify-center bg-white px-8 py-12 lg:w-2/3">
        <div className="mx-auto w-full max-w-md">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Ícone de Sucesso</title>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="mb-6 text-center">
            <h2 className="mb-3 font-bold text-3xl text-gray-900">
              Escolha seu tipo de conta
            </h2>
            <p className="text-gray-600 text-lg">
              Selecione como você pretende usar o Ecoleta para começar sua
              jornada sustentável.
            </p>
          </div>

          {/* Error Message */}
          {error && (
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
                  <h3 className="font-medium text-red-800 text-sm">Erro</h3>
                  <div className="mt-2 text-red-700 text-sm">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Type Options */}
          <div className="mb-8 space-y-4">
            {accountTypes.map((accountType) => (
              <button
                key={accountType.type}
                type="button"
                onClick={() => setSelectedType(accountType.type)}
                disabled={isLoading}
                className={`w-full rounded-xl border-2 p-6 text-left transition-all duration-200 ${
                  selectedType === accountType.type
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`rounded-lg p-3 ${
                      selectedType === accountType.type
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {accountType.icon}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-semibold text-lg ${
                        selectedType === accountType.type
                          ? "text-green-900"
                          : "text-gray-900"
                      }`}
                    >
                      {accountType.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        selectedType === accountType.type
                          ? "text-green-700"
                          : "text-gray-600"
                      }`}
                    >
                      {accountType.description}
                    </p>
                  </div>
                  {selectedType === accountType.type && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <title>Ícone de Selecionado</title>
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Next Step Button */}
          {selectedType && (
            <button
              type="button"
              disabled={isLoading}
              className="w-full rounded-xl bg-green-600 px-6 py-4 font-semibold text-white transition-colors duration-200 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => handleTypeSelection(selectedType)}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processando...
                </div>
              ) : (
                "Próximo Passo"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
