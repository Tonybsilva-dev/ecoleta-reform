import { z } from "zod";

// Profile creation schema
export const profileCreationSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
  bio: z.string().max(500, "Bio deve ter no máximo 500 caracteres").optional(),
  phone: z
    .string()
    .regex(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      "Telefone deve estar no formato (XX) XXXXX-XXXX",
    )
    .optional(),
  avatarUrl: z.string().url("URL do avatar deve ser válida").optional(),
  userType: z
    .enum(["CITIZEN", "COLLECTOR", "COMPANY", "NGO"])
    .default("CITIZEN"),
});

// Profile update schema
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços")
    .optional(),
  bio: z.string().max(500, "Bio deve ter no máximo 500 caracteres").optional(),
  phone: z
    .string()
    .regex(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      "Telefone deve estar no formato (XX) XXXXX-XXXX",
    )
    .optional(),
  avatarUrl: z.string().url("URL do avatar deve ser válida").optional(),
  userType: z.enum(["CITIZEN", "COLLECTOR", "COMPANY", "NGO"]).optional(),
});

// Profile public view schema (for displaying user profiles)
export const profilePublicViewSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  bio: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  userType: z.enum(["CITIZEN", "COLLECTOR", "COMPANY", "NGO"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Profile search schema (for searching users)
export const profileSearchSchema = z.object({
  query: z
    .string()
    .min(1, "Query de busca é obrigatória")
    .max(100, "Query deve ter no máximo 100 caracteres"),
  userType: z.enum(["CITIZEN", "COLLECTOR", "COMPANY", "NGO"]).optional(),
  limit: z
    .number()
    .int("Limit deve ser um número inteiro")
    .min(1, "Limit deve ser pelo menos 1")
    .max(50, "Limit deve ser no máximo 50")
    .default(10),
  offset: z
    .number()
    .int("Offset deve ser um número inteiro")
    .min(0, "Offset deve ser pelo menos 0")
    .default(0),
});

// Profile verification schema (for admin verification)
export const profileVerificationSchema = z.object({
  verified: z.boolean(),
  verificationNotes: z
    .string()
    .max(500, "Notas de verificação devem ter no máximo 500 caracteres")
    .optional(),
});

// Type exports
export type ProfileCreationInput = z.infer<typeof profileCreationSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ProfilePublicView = z.infer<typeof profilePublicViewSchema>;
export type ProfileSearchInput = z.infer<typeof profileSearchSchema>;
export type ProfileVerificationInput = z.infer<
  typeof profileVerificationSchema
>;
