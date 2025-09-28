"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Button,
  ErrorState,
  Input,
  Label,
  LoadingState,
} from "@/components/ui";
import { useNotifications } from "@/hooks/useNotifications";

interface OrganizationCreationFormProps {
  className?: string;
}

export function OrganizationCreationForm({
  className,
}: OrganizationCreationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError, showLoading } = useNotifications();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    domain: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    showLoading("Criando sua organização...");

    try {
      // TODO: Implementar API route para criar organização
      console.log("Dados da organização:", formData);

      // Simular delay para demonstração
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Redirecionar para dashboard da organização
      console.log("Redirecionando para dashboard da organização...");
      showSuccess(
        "Organização criada com sucesso!",
        "Redirecionando para o dashboard...",
      );

      // Aguardar um pouco para mostrar o toast
      await new Promise((resolve) => setTimeout(resolve, 1500));

      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao criar organização:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro inesperado";
      setError(errorMessage);
      showError("Erro ao criar organização", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading state se estiver carregando
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className || ""}`}>
        <LoadingState message="Criando sua organização..." />
      </div>
    );
  }

  // Mostrar error state se houver erro
  if (error) {
    return (
      <div className={`space-y-6 ${className || ""}`}>
        <ErrorState
          message={error}
          onRetry={() => {
            setError(null);
            setIsLoading(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className || ""}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome da Organização */}
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Organização *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleInputChange}
            disabled={isLoading}
            placeholder="Ex: Empresa Verde Ltda"
          />
        </div>

        {/* Descrição */}
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            disabled={isLoading}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Descreva brevemente sua organização e seus objetivos sustentáveis..."
          />
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleInputChange}
            disabled={isLoading}
            placeholder="https://www.exemplo.com"
          />
        </div>

        {/* Domínio */}
        <div className="space-y-2">
          <Label htmlFor="domain">Domínio (opcional)</Label>
          <Input
            id="domain"
            name="domain"
            type="text"
            value={formData.domain}
            onChange={handleInputChange}
            disabled={isLoading}
            placeholder="exemplo.com"
          />
          <p className="text-muted-foreground text-xs">
            Domínio personalizado para sua organização (ex: empresa.ecoleta.com)
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Voltar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Criando...
              </div>
            ) : (
              "Criar Organização"
            )}
          </Button>
        </div>
      </form>

      {/* Help Text */}
      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-label="Information icon"
            >
              <title>Information</title>
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-blue-800 text-sm">Dica</h3>
            <div className="mt-2 text-blue-700 text-sm">
              <p>
                Você poderá editar essas informações posteriormente nas
                configurações da sua organização.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
