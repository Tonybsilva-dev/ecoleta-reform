"use client";

import { Building2, FileText, Globe, Users } from "lucide-react";

import { Input } from "@/components/ui";

interface StepProps {
  formData: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
}

// Step 1: Nome da Organização
export function OrganizationNameStep({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-6">
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
          <Building2 className="h-6 w-6 text-green-600" />
        </div>
      </div>

      <div className="space-y-4">
        <Input
          value={formData.name || ""}
          onChange={(e) => updateFormData("name", e.target.value)}
          placeholder="Digite o nome da sua organização"
          className="h-14 text-center text-lg"
        />
        <p className="text-center text-gray-500 text-sm">
          Ex: Empresa Verde Ltda, ONG Sustentável, Cooperativa Recicla
        </p>
      </div>
    </div>
  );
}

// Step 2: Tipo de Organização
export function OrganizationTypeStep({ formData, updateFormData }: StepProps) {
  const types = [
    {
      id: "COMPANY",
      name: "Empresa",
      description: "Empresa privada com foco em sustentabilidade",
      icon: Building2,
    },
    {
      id: "NGO",
      name: "ONG",
      description: "Organização não governamental",
      icon: Users,
    },
    {
      id: "COOPERATIVE",
      name: "Cooperativa",
      description: "Cooperativa de reciclagem ou sustentabilidade",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
          <Building2 className="h-6 w-6 text-green-600" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {types.map((type) => {
          const Icon = type.icon;
          const isSelected = formData.type === type.id;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => updateFormData("type", type.id)}
              className={`w-full cursor-pointer rounded-xl border-2 p-6 text-left transition-all duration-200 ${
                isSelected
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50"
              }`}
            >
              <div className="flex flex-col items-center space-y-4 text-center">
                <div
                  className={`rounded-lg p-3 ${
                    isSelected
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-grow">
                  <h3
                    className={`font-semibold text-lg ${
                      isSelected ? "text-green-900" : "text-gray-900"
                    }`}
                  >
                    {type.name}
                  </h3>
                  <p
                    className={`text-sm ${
                      isSelected ? "text-green-700" : "text-gray-600"
                    }`}
                  >
                    {type.description}
                  </p>
                </div>
                {isSelected && (
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
          );
        })}
      </div>
    </div>
  );
}

// Step 3: Descrição
export function OrganizationDescriptionStep({
  formData,
  updateFormData,
}: StepProps) {
  return (
    <div className="space-y-6">
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
          <FileText className="h-6 w-6 text-green-600" />
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={formData.description || ""}
          onChange={(e) => updateFormData("description", e.target.value)}
          placeholder="Conte-nos sobre sua organização e seus objetivos sustentáveis..."
          className="min-h-[200px] w-full resize-none rounded-xl border border-gray-300 p-4 text-lg focus:border-transparent focus:ring-2 focus:ring-green-500"
        />
        <p className="text-center text-gray-500 text-sm">
          Esta descrição aparecerá no seu perfil público
        </p>
      </div>
    </div>
  );
}

// Step 4: Website e Contato
export function OrganizationContactStep({
  formData,
  updateFormData,
}: StepProps) {
  return (
    <div className="space-y-6">
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
          <Globe className="h-6 w-6 text-green-600" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="website"
            className="font-medium text-gray-700 text-sm"
          >
            Website (opcional)
          </label>
          <Input
            id="website"
            value={formData.website || ""}
            onChange={(e) => updateFormData("website", e.target.value)}
            placeholder="https://www.exemplo.com"
            className="h-12 text-lg"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="contactEmail"
            className="font-medium text-gray-700 text-sm"
          >
            Email de contato
          </label>
          <Input
            id="contactEmail"
            type="email"
            value={formData.contactEmail || ""}
            onChange={(e) => updateFormData("contactEmail", e.target.value)}
            placeholder="contato@exemplo.com"
            className="h-12 text-lg"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="domain" className="font-medium text-gray-700 text-sm">
            Domínio personalizado (opcional)
          </label>
          <Input
            id="domain"
            value={formData.domain || ""}
            onChange={(e) => updateFormData("domain", e.target.value)}
            placeholder="empresa.ecoleta.com"
            className="h-12 text-lg"
          />
          <p className="text-gray-500 text-xs">
            Seu endereço personalizado na plataforma
          </p>
        </div>
      </div>
    </div>
  );
}

// Step 5: Confirmação
export function OrganizationConfirmationStep({ formData }: StepProps) {
  return (
    <div className="space-y-6">
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
          <Building2 className="h-6 w-6 text-green-600" />
        </div>
      </div>

      <div className="space-y-4 rounded-xl bg-gray-50 p-6">
        <h3 className="mb-4 font-semibold text-gray-900 text-lg">
          Confirme os dados da sua organização:
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Nome:</span>
            <span className="font-medium">{formData.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Tipo:</span>
            <span className="font-medium">
              {formData.type === "COMPANY" && "Empresa"}
              {formData.type === "NGO" && "ONG"}
              {formData.type === "COOPERATIVE" && "Cooperativa"}
            </span>
          </div>

          {formData.description && (
            <div className="flex justify-between">
              <span className="text-gray-600">Descrição:</span>
              <span className="max-w-xs text-right font-medium">
                {formData.description.length > 50
                  ? `${formData.description.substring(0, 50)}...`
                  : formData.description}
              </span>
            </div>
          )}

          {formData.website && (
            <div className="flex justify-between">
              <span className="text-gray-600">Website:</span>
              <span className="font-medium">{formData.website}</span>
            </div>
          )}

          {formData.contactEmail && (
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{formData.contactEmail}</span>
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm">
        Você poderá editar essas informações posteriormente nas configurações.
      </p>
    </div>
  );
}
