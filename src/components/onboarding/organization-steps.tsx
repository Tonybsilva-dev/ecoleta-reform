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
    <div className="space-y-4 sm:space-y-6">
      {/* Icon */}
      <div className="mb-4 flex justify-center sm:mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 sm:h-12 sm:w-12">
          <Building2 className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <Input
          value={formData.name || ""}
          onChange={(e) => updateFormData("name", e.target.value)}
          placeholder="Digite o nome da sua organização"
          className="h-12 text-center text-base sm:h-14 sm:text-lg"
        />
        <p className="text-center text-gray-500 text-xs sm:text-sm">
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
      id: "COLLECTOR",
      name: "Cooperativa",
      description: "Cooperativa de coleta ou reciclagem",
      icon: Users,
    },
    {
      id: "NGO",
      name: "ONG",
      description: "Organização não governamental",
      icon: Users,
    },
    {
      id: "COMPANY",
      name: "Empresa",
      description: "Empresa privada com foco em sustentabilidade",
      icon: Building2,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Icon */}
      <div className="mb-4 flex justify-center sm:mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 sm:h-12 sm:w-12">
          <Building2 className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {types.map((type, index) => {
          const Icon = type.icon;
          const isSelected = formData.type === type.id;
          const isLastItem = index === types.length - 1;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => updateFormData("type", type.id)}
              className={`w-full cursor-pointer rounded-xl border-2 p-4 text-left transition-all duration-200 sm:p-6 ${
                isSelected
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50"
              } ${isLastItem ? "sm:col-span-2" : ""}`}
            >
              <div className="flex flex-col items-center space-y-3 text-center sm:space-y-4">
                <div
                  className={`rounded-lg p-2 sm:p-3 ${
                    isSelected
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="flex-grow">
                  <h3
                    className={`font-semibold text-base sm:text-lg ${
                      isSelected ? "text-green-900" : "text-gray-900"
                    }`}
                  >
                    {type.name}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm ${
                      isSelected ? "text-green-700" : "text-gray-600"
                    }`}
                  >
                    {type.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 sm:h-6 sm:w-6">
                    <svg
                      className="h-3 w-3 text-white sm:h-4 sm:w-4"
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
    <div className="space-y-4 sm:space-y-6">
      {/* Icon */}
      <div className="mb-4 flex justify-center sm:mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 sm:h-12 sm:w-12">
          <FileText className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <textarea
          value={formData.description || ""}
          onChange={(e) => updateFormData("description", e.target.value)}
          placeholder="Conte-nos sobre sua organização e seus objetivos sustentáveis..."
          className="min-h-[150px] w-full resize-none rounded-xl border border-gray-300 p-3 text-sm focus:border-transparent focus:ring-2 focus:ring-green-500 sm:min-h-[200px] sm:p-4 sm:text-base"
        />
        <p className="text-center text-gray-500 text-xs sm:text-sm">
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
    <div className="space-y-4 sm:space-y-6">
      {/* Icon */}
      <div className="mb-4 flex justify-center sm:mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 sm:h-12 sm:w-12">
          <Globe className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-1.5 sm:space-y-2">
          <label
            htmlFor="website"
            className="font-medium text-gray-700 text-xs sm:text-sm"
          >
            Website (opcional)
          </label>
          <Input
            id="website"
            value={formData.website || ""}
            onChange={(e) => updateFormData("website", e.target.value)}
            placeholder="https://www.exemplo.com"
            className="h-10 text-sm sm:h-12 sm:text-base"
          />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <label
            htmlFor="contactEmail"
            className="font-medium text-gray-700 text-xs sm:text-sm"
          >
            Email de contato
          </label>
          <Input
            id="contactEmail"
            type="email"
            value={formData.contactEmail || ""}
            onChange={(e) => updateFormData("contactEmail", e.target.value)}
            placeholder="contato@exemplo.com"
            className="h-10 text-sm sm:h-12 sm:text-base"
          />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <label
            htmlFor="domain"
            className="font-medium text-gray-700 text-xs sm:text-sm"
          >
            Domínio personalizado (opcional)
          </label>
          <Input
            id="domain"
            value={formData.domain || ""}
            onChange={(e) => updateFormData("domain", e.target.value)}
            placeholder="empresa.ecoleta.com"
            className="h-10 text-sm sm:h-12 sm:text-base"
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
    <div className="space-y-4 sm:space-y-6">
      {/* Icon */}
      <div className="mb-4 flex justify-center sm:mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 sm:h-12 sm:w-12">
          <Building2 className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
        </div>
      </div>

      <div className="space-y-3 rounded-xl bg-gray-50 p-4 sm:space-y-4 sm:p-6">
        <h3 className="mb-3 font-semibold text-base text-gray-900 sm:mb-4 sm:text-lg">
          Confirme os dados da sua organização:
        </h3>

        <div className="space-y-2 sm:space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
            <span className="text-gray-600 text-sm">Nome:</span>
            <span className="font-medium text-sm sm:text-base">
              {formData.name}
            </span>
          </div>

          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
            <span className="text-gray-600 text-sm">Tipo:</span>
            <span className="font-medium text-sm sm:text-base">
              {formData.type === "COLLECTOR" && "Cooperativa"}
              {formData.type === "NGO" && "ONG"}
              {formData.type === "COMPANY" && "Empresa"}
            </span>
          </div>

          {formData.description && (
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <span className="text-gray-600 text-sm">Descrição:</span>
              <span className="max-w-xs text-right font-medium text-sm sm:text-base">
                {formData.description.length > 50
                  ? `${formData.description.substring(0, 50)}...`
                  : formData.description}
              </span>
            </div>
          )}

          {formData.website && (
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <span className="text-gray-600 text-sm">Website:</span>
              <span className="font-medium text-sm sm:text-base">
                {formData.website}
              </span>
            </div>
          )}

          {formData.contactEmail && (
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <span className="text-gray-600 text-sm">Email:</span>
              <span className="font-medium text-sm sm:text-base">
                {formData.contactEmail}
              </span>
            </div>
          )}

          {formData.domain && (
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <span className="text-gray-600 text-sm">Domínio:</span>
              <span className="font-medium text-green-600 text-sm sm:text-base">
                {formData.domain.includes(".")
                  ? formData.domain
                  : `${formData.domain}.ecoleta.com`}
              </span>
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-gray-500 text-xs sm:text-sm">
        Você poderá editar essas informações posteriormente nas configurações.
      </p>
    </div>
  );
}
