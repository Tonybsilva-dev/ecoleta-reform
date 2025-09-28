"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface OrganizationCreationFormProps {
  className?: string;
}

export function OrganizationCreationForm({
  className,
}: OrganizationCreationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

    try {
      // TODO: Implementar API route para criar organização
      console.log("Dados da organização:", formData);

      // Simular delay para demonstração
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Redirecionar para dashboard da organização
      console.log("Redirecionando para dashboard da organização...");
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao criar organização:", error);
      setError(error instanceof Error ? error.message : "Erro inesperado");
    } finally {
      setIsLoading(false);
    }
  };

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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome da Organização */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block font-medium text-gray-700 text-sm"
          >
            Nome da Organização *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleInputChange}
            disabled={isLoading}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
            placeholder="Ex: Empresa Verde Ltda"
          />
        </div>

        {/* Descrição */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block font-medium text-gray-700 text-sm"
          >
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            disabled={isLoading}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
            placeholder="Descreva brevemente sua organização e seus objetivos sustentáveis..."
          />
        </div>

        {/* Website */}
        <div>
          <label
            htmlFor="website"
            className="mb-2 block font-medium text-gray-700 text-sm"
          >
            Website
          </label>
          <input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleInputChange}
            disabled={isLoading}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
            placeholder="https://www.exemplo.com"
          />
        </div>

        {/* Domínio */}
        <div>
          <label
            htmlFor="domain"
            className="mb-2 block font-medium text-gray-700 text-sm"
          >
            Domínio (opcional)
          </label>
          <input
            id="domain"
            name="domain"
            type="text"
            value={formData.domain}
            onChange={handleInputChange}
            disabled={isLoading}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
            placeholder="exemplo.com"
          />
          <p className="mt-1 text-gray-500 text-xs">
            Domínio personalizado para sua organização (ex: empresa.ecoleta.com)
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Voltar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md border border-transparent bg-green-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Criando...
              </div>
            ) : (
              "Criar Organização"
            )}
          </button>
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
