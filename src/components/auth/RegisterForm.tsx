"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorState, Input, Label, LoadingState } from "@/components/ui";
import { useNotifications } from "@/hooks/useNotifications";
import {
  type RegisterInput,
  registerSchema,
} from "@/lib/validations/auth.schema";

interface RegisterFormProps {
  className?: string;
}

export function RegisterForm({ className }: RegisterFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError, showLoading } = useNotifications();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange", // Validação em tempo real
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);
    showLoading("Criando sua conta...");

    try {
      // Fazer requisição para a API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Erro ao criar conta");
      }

      // Sucesso - mostrar toast e redirecionar
      showSuccess("Conta criada com sucesso!", "Redirecionando para login...");

      // Aguardar um pouco para mostrar o toast
      await new Promise((resolve) => setTimeout(resolve, 1500));

      router.push("/auth/signin");
    } catch (error) {
      console.error("Erro no registro:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro inesperado. Tente novamente.";
      setError(errorMessage);
      showError("Erro ao criar conta", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    showLoading("Criando conta com Google...");

    try {
      await signIn("google", { callbackUrl: "/onboarding/select-type" });
      showSuccess("Conta criada com sucesso!", "Redirecionando...");
    } catch (error) {
      console.error("Erro ao registrar com Google:", error);
      const errorMessage = "Erro ao registrar com Google. Tente novamente.";
      setError(errorMessage);
      showError("Erro ao criar conta", errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Mostrar loading state se estiver carregando
  if (isLoading || isGoogleLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingState message="Criando sua conta..." />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-6 ${className || ""}`}
    >
      {/* Error Message */}
      {error && (
        <ErrorState
          message={error}
          onRetry={() => {
            setError(null);
            setIsLoading(false);
            setIsGoogleLoading(false);
          }}
          className="mb-4"
        />
      )}

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input
          id="name"
          type="text"
          placeholder="Seu nome completo"
          {...register("name")}
          disabled={isLoading || isSubmitting}
        />
        {errors.name && (
          <p className="text-red-600 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          {...register("email")}
          disabled={isLoading || isSubmitting}
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="Sua senha"
          {...register("password")}
          disabled={isLoading || isSubmitting}
        />
        {errors.password ? (
          <p className="text-red-600 text-sm">{errors.password.message}</p>
        ) : (
          <p className="text-gray-500 text-xs">
            Mínimo 8 caracteres com letras maiúsculas, minúsculas, números e
            símbolos
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirme sua senha"
          {...register("confirmPassword")}
          disabled={isLoading || isSubmitting}
        />
        {errors.confirmPassword && (
          <p className="text-red-600 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || isSubmitting}
        className="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading || isSubmitting ? (
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Criando conta...
          </div>
        ) : (
          "Criar conta"
        )}
      </button>

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
          onClick={handleGoogleSignUp}
          disabled={isGoogleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 text-sm shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          {isGoogleLoading ? (
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
          {isGoogleLoading ? "Criando conta..." : "Criar conta com Google"}
        </button>
      </div>
    </form>
  );
}
