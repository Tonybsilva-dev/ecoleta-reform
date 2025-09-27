"use client";

import { useState } from "react";
import { userPasswordChangeSchema } from "@/lib/validations";

interface PasswordFormProps {
  hasExistingPassword?: boolean;
  onSuccess?: () => void;
}

export function PasswordForm({
  hasExistingPassword = false,
  onSuccess,
}: PasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validação do lado do cliente
      if (formData.newPassword !== formData.confirmPassword) {
        setError("As senhas não coincidem");
        setIsLoading(false);
        return;
      }

      const validationData = {
        currentPassword: hasExistingPassword ? formData.currentPassword : "",
        newPassword: formData.newPassword,
      };

      const validationResult =
        userPasswordChangeSchema.safeParse(validationData);
      if (!validationResult.success) {
        setError(
          validationResult.error.issues[0]?.message || "Dados inválidos",
        );
        setIsLoading(false);
        return;
      }

      // Fazer a requisição para a API
      const response = await fetch("/api/user/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Erro ao atualizar senha");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (_err) {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (success) {
    return (
      <div className="rounded-lg bg-green-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              role="img"
              aria-label="Ícone de sucesso"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-green-800 text-sm">
              Senha atualizada com sucesso!
            </h3>
            <div className="mt-2 text-green-700 text-sm">
              <p>Sua senha foi atualizada com sucesso.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {hasExistingPassword && (
        <div>
          <label
            htmlFor="currentPassword"
            className="mb-2 block font-medium text-gray-700 text-sm"
          >
            Senha Atual
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            required
            value={formData.currentPassword}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
            placeholder="Digite sua senha atual"
          />
        </div>
      )}

      <div>
        <label
          htmlFor="newPassword"
          className="mb-2 block font-medium text-gray-700 text-sm"
        >
          {hasExistingPassword ? "Nova Senha" : "Senha"}
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          value={formData.newPassword}
          onChange={handleInputChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
          placeholder={
            hasExistingPassword
              ? "Digite sua nova senha"
              : "Digite uma senha forte"
          }
        />
        <p className="mt-1 text-gray-500 text-xs">
          A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas,
          minúsculas, números e símbolos.
        </p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block font-medium text-gray-700 text-sm"
        >
          Confirmar Senha
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
          placeholder="Confirme sua senha"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Atualizando...
            </div>
          ) : hasExistingPassword ? (
            "Atualizar Senha"
          ) : (
            "Definir Senha"
          )}
        </button>
      </div>
    </form>
  );
}
