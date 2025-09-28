"use client";

import { UserType } from "@prisma/client";
import { ErrorState, LoadingState } from "@/components/ui";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";
import { cn } from "@/lib/utils";

interface AccountTypeSelectionProps {
  className?: string;
}

export function AccountTypeSelection({ className }: AccountTypeSelectionProps) {
  const {
    selectedType,
    isLoading,
    error,
    isRedirecting,
    setSelectedType,
    setLoading,
    setError,
    setRedirecting,
  } = useOnboardingStore();

  const { updateUserRole } = useAuthStore();
  const { showSuccess, showError, showLoading } = useNotifications();

  const handleTypeSelection = async (userType: UserType) => {
    setSelectedType(userType);
    setLoading(true);
    setError(null);

    try {
      // Mostrar feedback de carregamento
      showLoading("Configurando sua conta...");

      // Atualizar o estado global com o novo tipo de usuário
      updateUserRole(userType);

      // Marcar como redirecionando
      setRedirecting(true);

      // Fazer requisição POST
      const response = await fetch("/api/onboarding/select-type", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userType }),
      });

      if (response.ok) {
        // Forçar atualização da sessão
        try {
          await fetch("/api/auth/session?update", { method: "GET" });
        } catch (_sessionError) {
          // Silenciar erro de atualização de sessão
        }

        // Mostrar sucesso
        showSuccess("Conta configurada com sucesso!", "Redirecionando...");

        // Aguardar um pouco para garantir que o token foi atualizado
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Redirecionar manualmente
        const redirectUrl = getRedirectUrl(userType);
        window.location.href = redirectUrl;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro na requisição");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro inesperado";
      setError(errorMessage);
      showError("Erro ao configurar conta", errorMessage);
      setLoading(false);
    }
  };

  const getRedirectUrl = (userType: UserType): string => {
    switch (userType) {
      case UserType.CITIZEN:
      case UserType.COLLECTOR:
        return "/dashboard";
      case UserType.COMPANY:
      case UserType.NGO:
        return "/onboarding/organization/create";
      default:
        return "/dashboard";
    }
  };

  const accountTypes = [
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
    {
      type: UserType.COLLECTOR,
      title: "Coletor",
      description: "Coleta resíduos da comunidade e ganhe por isso",
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <title>Ícone de Coletor</title>
          <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z" />
        </svg>
      ),
    },
    {
      type: UserType.COMPANY,
      title: "Empresa",
      description: "Gerencie a coleta de resíduos da sua empresa",
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <title>Ícone de Empresa</title>
          <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
        </svg>
      ),
    },
    {
      type: UserType.NGO,
      title: "ONG",
      description: "Gerencie a coleta de resíduos da sua ONG",
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <title>Ícone de ONG</title>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
    },
  ];

  // Mostrar loading state se estiver carregando
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center p-8",
          className,
        )}
      >
        <LoadingState message="Configurando sua conta..." />
      </div>
    );
  }

  // Mostrar error state se houver erro
  if (error) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center p-8",
          className,
        )}
      >
        <ErrorState
          message={error}
          onRetry={() => {
            setError(null);
            setLoading(false);
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-screen ${className || ""}`}
      style={{ position: "relative" }}
    >
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
          <div
            className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
            style={{ position: "relative", zIndex: 2 }}
          >
            {accountTypes.map((accountType) => (
              <button
                key={accountType.type}
                type="button"
                onClick={() => setSelectedType(accountType.type)}
                disabled={isLoading}
                style={{ position: "relative", zIndex: 1 }}
                className={`w-full cursor-pointer rounded-xl border-2 p-6 text-left transition-all duration-200 ${
                  selectedType === accountType.type
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div
                    className={`rounded-lg p-3 ${
                      selectedType === accountType.type
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {accountType.icon}
                  </div>
                  <div className="flex-grow">
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
              disabled={isLoading || isRedirecting}
              className="w-full rounded-xl bg-green-600 px-6 py-4 font-semibold text-white transition-colors duration-200 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => handleTypeSelection(selectedType)}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processando...
                </div>
              ) : isRedirecting ? (
                <div className="flex items-center justify-center">
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Redirecionando...
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
