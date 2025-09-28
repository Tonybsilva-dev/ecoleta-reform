import { z } from "zod";

// Schema para criação de organização
export const organizationCreationSchema = z.object({
  name: z
    .string()
    .min(2, "O nome da organização deve ter pelo menos 2 caracteres")
    .max(100, "O nome da organização deve ter no máximo 100 caracteres")
    .regex(
      /^[a-zA-ZÀ-ÿ\s0-9&.,-]+$/,
      "O nome deve conter apenas letras, números e caracteres especiais permitidos",
    ),

  type: z
    .enum(["COLLECTOR", "NGO", "COMPANY"])
    .refine((val) => ["COLLECTOR", "NGO", "COMPANY"].includes(val), {
      message: "Tipo de organização não permitido",
    }),

  description: z
    .string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres")
    .max(500, "A descrição deve ter no máximo 500 caracteres"),

  website: z
    .string()
    .url("URL do website inválida")
    .optional()
    .or(z.literal("")),

  contactEmail: z
    .string()
    .email("Email de contato inválido")
    .min(1, "Email de contato é obrigatório"),

  domain: z
    .string()
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/, "Domínio inválido")
    .optional()
    .or(z.literal("")),
});

// Schema para validação de cada step
export const organizationStepSchemas = {
  name: z.object({
    name: z
      .string()
      .min(2, "O nome da organização deve ter pelo menos 2 caracteres")
      .max(100, "O nome da organização deve ter no máximo 100 caracteres")
      .regex(
        /^[a-zA-ZÀ-ÿ\s0-9&.,-]+$/,
        "O nome deve conter apenas letras, números e caracteres especiais permitidos",
      ),
  }),

  type: z.object({
    type: z
      .enum(["COLLECTOR", "NGO", "COMPANY"])
      .refine((val) => ["COLLECTOR", "NGO", "COMPANY"].includes(val), {
        message: "Tipo de organização não permitido",
      }),
  }),

  description: z.object({
    description: z
      .string()
      .min(10, "A descrição deve ter pelo menos 10 caracteres")
      .max(500, "A descrição deve ter no máximo 500 caracteres"),
  }),

  contact: z.object({
    website: z
      .string()
      .optional()
      .refine(
        (val) => !val || z.string().url().safeParse(val).success,
        "URL do website inválida",
      ),

    contactEmail: z
      .string()
      .min(1, "Email de contato é obrigatório")
      .email("Email de contato inválido"),

    domain: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/.test(val),
        "Domínio inválido",
      ),
  }),
};

// Tipos TypeScript derivados dos schemas
export type OrganizationCreationData = z.infer<
  typeof organizationCreationSchema
>;
export type OrganizationStepData = {
  name: z.infer<typeof organizationStepSchemas.name>;
  type: z.infer<typeof organizationStepSchemas.type>;
  description: z.infer<typeof organizationStepSchemas.description>;
  contact: z.infer<typeof organizationStepSchemas.contact>;
};
