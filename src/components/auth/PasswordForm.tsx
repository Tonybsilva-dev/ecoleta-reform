"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
} from "@/components/ui";
import { userPasswordChangeSchema } from "@/lib/validations";
import { PasswordStrength } from "./PasswordStrength";

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
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-500"
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
            <div>
              <h3 className="font-medium text-green-800 text-sm">
                Senha atualizada com sucesso!
              </h3>
              <p className="text-green-700 text-sm">
                Sua senha foi atualizada com sucesso.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {hasExistingPassword ? "Alterar Senha" : "Definir Senha"}
        </CardTitle>
        <CardDescription>
          {hasExistingPassword
            ? "Altere sua senha para manter sua conta segura."
            : "Defina uma senha para poder fazer login com email e senha."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-500"
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
                  <div>
                    <h3 className="font-medium text-red-800 text-sm">Erro</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {hasExistingPassword && (
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Digite sua senha atual"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="newPassword">
              {hasExistingPassword ? "Nova Senha" : "Senha"}
            </Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder={
                hasExistingPassword
                  ? "Digite sua nova senha"
                  : "Digite uma senha forte"
              }
            />
            <PasswordStrength password={formData.newPassword} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirme sua senha"
            />
            {formData.newPassword !== formData.confirmPassword &&
              formData.confirmPassword !== "" && (
                <p className="text-red-600 text-sm">As senhas não coincidem.</p>
              )}
          </div>

          <Separator />

          <Button type="submit" disabled={isLoading} className="w-full">
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
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
