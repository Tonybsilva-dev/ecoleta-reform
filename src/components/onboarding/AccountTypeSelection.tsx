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
      // O redirecionamento será feito pelo server action
    } catch (error) {
      console.error("Erro ao selecionar tipo de conta:", error);
      setError(error instanceof Error ? error.message : "Erro inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  const accountTypes = [
    {
      type: UserType.CITIZEN,
      title: "Cidadão",
      description: "Pessoa física que deseja contribuir com a sustentabilidade",
      icon: "👤",
      features: [
        "Cadastrar materiais para doação",
        "Encontrar pontos de coleta próximos",
        "Acompanhar seu impacto ambiental",
        "Ganhar EcoPoints por ações sustentáveis",
      ],
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
    },
    {
      type: UserType.COLLECTOR,
      title: "Coletor",
      description: "Profissional que coleta e processa materiais recicláveis",
      icon: "♻️",
      features: [
        "Gerenciar rotas de coleta",
        "Receber notificações de materiais disponíveis",
        "Acompanhar métricas de coleta",
        "Conectar-se com cidadãos e organizações",
      ],
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
    },
    {
      type: UserType.COMPANY,
      title: "Empresa",
      description: "Organização que busca soluções sustentáveis",
      icon: "🏢",
      features: [
        "Gerenciar programa de sustentabilidade",
        "Relatórios de impacto ambiental",
        "Conectar-se com fornecedores sustentáveis",
        "Certificações e compliance",
      ],
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
    },
    {
      type: UserType.NGO,
      title: "ONG",
      description: "Organização não governamental focada em sustentabilidade",
      icon: "🌱",
      features: [
        "Criar campanhas de conscientização",
        "Gerenciar projetos ambientais",
        "Relatórios de impacto social",
        "Conectar-se com voluntários e doadores",
      ],
      color: "from-emerald-500 to-emerald-600",
      hoverColor: "hover:from-emerald-600 hover:to-emerald-700",
    },
  ];

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                role="img"
                aria-label="Ícone de erro"
              >
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {accountTypes.map((accountType) => (
          <button
            key={accountType.type}
            type="button"
            disabled={isLoading}
            className={`group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-300 ${
              selectedType === accountType.type
                ? "border-green-500 shadow-lg ring-2 ring-green-200"
                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
            } ${isLoading ? "pointer-events-none opacity-50" : ""}`}
            onClick={() => handleTypeSelection(accountType.type)}
          >
            <div className="p-6">
              {/* Header */}
              <div className="mb-4 flex items-center space-x-3">
                <div className="text-3xl">{accountType.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {accountType.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {accountType.description}
                  </p>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2">
                {accountType.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center text-gray-600 text-sm"
                  >
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-label="Checkmark"
                    >
                      <title>Checkmark</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Selection Indicator */}
              {selectedType === accountType.type && (
                <div className="absolute top-4 right-4">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-label="Selected"
                    >
                      <title>Selected</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Hover Effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${accountType.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
            />
          </button>
        ))}
      </div>

      {/* Action Button */}
      {selectedType && (
        <div className="flex justify-center pt-4">
          <button
            type="button"
            disabled={isLoading}
            className={`rounded-lg px-8 py-3 font-medium text-white shadow-lg transition-all duration-300 ${
              selectedType === UserType.CITIZEN
                ? "bg-blue-600 hover:bg-blue-700"
                : selectedType === UserType.COLLECTOR
                  ? "bg-green-600 hover:bg-green-700"
                  : selectedType === UserType.COMPANY
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
            } disabled:cursor-not-allowed disabled:opacity-50`}
            onClick={() => handleTypeSelection(selectedType)}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processando...
              </div>
            ) : (
              `Continuar como ${accountTypes.find((t) => t.type === selectedType)?.title}`
            )}
          </button>
        </div>
      )}

      {/* Help Text */}
      <div className="text-center text-gray-500 text-sm">
        <p>
          Não se preocupe, você poderá alterar seu tipo de conta posteriormente
          nas configurações.
        </p>
      </div>
    </div>
  );
}
