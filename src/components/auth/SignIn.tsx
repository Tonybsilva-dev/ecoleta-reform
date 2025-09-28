"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { ErrorState, Input, Label, LoadingState } from "@/components/ui";
import { useNotifications } from "@/hooks/useNotifications";
import { userAuthenticationSchema } from "@/lib/validations";

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);
  const [credentialsError, setCredentialsError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { showSuccess, showError, showLoading, dismiss } = useNotifications();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const loadingToastId = showLoading("Entrando com Google...");

    try {
      await signIn("google", { callbackUrl: "/dashboard" });

      // Dismissar o toast de loading
      dismiss(loadingToastId);

      showSuccess("Login realizado com sucesso!", "Redirecionando...");
    } catch (error) {
      console.error("Erro ao fazer login:", error);

      // Dismissar o toast de loading em caso de erro
      dismiss(loadingToastId);

      showError("Erro ao fazer login", "Tente novamente em alguns instantes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCredentialsLoading(true);
    setCredentialsError(null);
    const loadingToastId = showLoading("Verificando credenciais...");

    try {
      // Validação do lado do cliente
      const validationResult = userAuthenticationSchema.safeParse(formData);
      if (!validationResult.success) {
        const errorMessage =
          validationResult.error.issues[0]?.message || "Dados inválidos";
        setCredentialsError(errorMessage);
        showError("Dados inválidos", errorMessage);
        dismiss(loadingToastId);
        setIsCredentialsLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        const errorMessage = "Email ou senha incorretos";
        setCredentialsError(errorMessage);
        showError("Falha no login", errorMessage);
        dismiss(loadingToastId);
      } else if (result?.ok) {
        dismiss(loadingToastId);
        showSuccess("Login realizado com sucesso!", "Redirecionando...");
        window.location.href = "/dashboard";
      }
    } catch (_error) {
      const errorMessage = "Erro de conexão. Tente novamente.";
      setCredentialsError(errorMessage);
      showError("Erro de conexão", errorMessage);
      dismiss(loadingToastId);
    } finally {
      setIsCredentialsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Mostrar loading state se estiver carregando
  if (isLoading || isCredentialsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingState message="Entrando na sua conta..." />
      </div>
    );
  }

  // Mostrar error state se houver erro crítico
  if (credentialsError && !isCredentialsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <ErrorState
          message={credentialsError}
          onRetry={() => {
            setCredentialsError(null);
            setIsCredentialsLoading(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left Column - Promotional */}
      <div className="hidden w-full items-center justify-center bg-green-600 p-8 lg:flex lg:w-1/3">
        {/* Botão de voltar */}
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.history.back();
          }}
          className="absolute top-6 left-6 flex items-center text-white opacity-80 transition-opacity hover:opacity-100"
        >
          <svg
            className="mr-2 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Voltar</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-medium text-sm">Voltar</span>
        </Link>

        <div className="text-white">
          <div className="mb-8 flex items-center">
            <div className="mr-3 h-8 w-8 rounded-lg bg-white" />
            <span className="font-semibold text-2xl">Ecoleta</span>
          </div>
          <h1 className="mb-4 font-bold text-4xl">Bem-vindo de volta!</h1>
          <p className="text-lg opacity-90">
            Faça login para continuar sua jornada sustentável e conectar-se com
            nossa comunidade.
          </p>
          <div className="mt-12 flex space-x-2">
            <span className="h-2 w-10 rounded-full bg-white" />
            <span className="h-2 w-2 rounded-full bg-white opacity-50" />
            <span className="h-2 w-2 rounded-full bg-white opacity-50" />
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
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
                <title>Ícone de Login</title>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="mb-6 text-center">
            <h2 className="mb-3 font-bold text-3xl text-gray-900">
              Faça login
            </h2>
            <p className="text-gray-600">
              Entre com suas credenciais para acessar sua conta
            </p>
          </div>

          {/* Formulário de Email/Senha */}
          <form onSubmit={handleCredentialsSignIn} className="space-y-6">
            {credentialsError && (
              <ErrorState
                message={credentialsError}
                onRetry={() => {
                  setCredentialsError(null);
                  setIsCredentialsLoading(false);
                }}
                className="mb-4"
              />
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Digite seu email"
                disabled={isCredentialsLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Digite sua senha"
                disabled={isCredentialsLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isCredentialsLoading}
              className="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCredentialsLoading ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Entrando...
                </div>
              ) : (
                "Entrar com Email"
              )}
            </button>
          </form>

          {/* Divisor */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-gray-300 border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">ou</span>
            </div>
          </div>

          {/* Botão do Google */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 text-sm shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
              ) : (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Google Logo"
                >
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {isLoading ? "Entrando..." : "Entrar com Google"}
            </button>
          </div>

          {/* Link para registro */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Não tem uma conta?{" "}
              <Link
                href="/register"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Criar conta
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center text-gray-600 text-sm">
            <p>
              Ao continuar, você concorda com nossos{" "}
              <a href="/terms" className="text-green-600 hover:text-green-500">
                Termos de Serviço
              </a>{" "}
              e{" "}
              <a
                href="/privacy"
                className="text-green-600 hover:text-green-500"
              >
                Política de Privacidade
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
