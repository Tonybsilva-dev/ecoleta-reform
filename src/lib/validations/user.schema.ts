import { z } from "zod";

// User registration schema
export const userRegistrationSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .min(1, "Email é obrigatório")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número",
    ),
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
  userType: z
    .enum(["CITIZEN", "COLLECTOR", "COMPANY", "NGO"])
    .default("CITIZEN"),
});

// User authentication schema
export const userAuthenticationSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// User update schema
export const userUpdateSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .min(1, "Email é obrigatório")
    .max(255, "Email deve ter no máximo 255 caracteres")
    .optional(),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número",
    )
    .optional(),
});

// User password change schema
export const userPasswordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z
    .string()
    .min(8, "Nova senha deve ter pelo menos 8 caracteres")
    .max(100, "Nova senha deve ter no máximo 100 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Nova senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número",
    ),
});

// User email verification schema
export const userEmailVerificationSchema = z.object({
  token: z.string().min(1, "Token de verificação é obrigatório"),
});

// User password reset request schema
export const userPasswordResetRequestSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
});

// User password reset schema
export const userPasswordResetSchema = z.object({
  token: z.string().min(1, "Token de redefinição é obrigatório"),
  newPassword: z
    .string()
    .min(8, "Nova senha deve ter pelo menos 8 caracteres")
    .max(100, "Nova senha deve ter no máximo 100 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Nova senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número",
    ),
});

// Type exports
export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;
export type UserAuthenticationInput = z.infer<typeof userAuthenticationSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type UserPasswordChangeInput = z.infer<typeof userPasswordChangeSchema>;
export type UserEmailVerificationInput = z.infer<
  typeof userEmailVerificationSchema
>;
export type UserPasswordResetRequestInput = z.infer<
  typeof userPasswordResetRequestSchema
>;
export type UserPasswordResetInput = z.infer<typeof userPasswordResetSchema>;
