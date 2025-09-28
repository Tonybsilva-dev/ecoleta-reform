import { describe, expect, it } from "vitest";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.schema";

describe("Auth Schema Validation", () => {
  describe("registerSchema", () => {
    it("should validate correct registration data", () => {
      const validData = {
        name: "João Silva",
        email: "joao@example.com",
        password: "MinhaSenh@123",
        confirmPassword: "MinhaSenh@123",
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject empty name", () => {
      const invalidData = {
        name: "",
        email: "joao@example.com",
        password: "MinhaSenh@123",
        confirmPassword: "MinhaSenh@123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Nome é obrigatório");
      }
    });

    it("should reject name with numbers", () => {
      const invalidData = {
        name: "João123",
        email: "joao@example.com",
        password: "MinhaSenh@123",
        confirmPassword: "MinhaSenh@123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Nome deve conter apenas letras e espaços",
        );
      }
    });

    it("should reject invalid email format", () => {
      const invalidData = {
        name: "João Silva",
        email: "invalid-email",
        password: "MinhaSenh@123",
        confirmPassword: "MinhaSenh@123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Formato de email inválido",
        );
      }
    });

    it("should reject weak password", () => {
      const invalidData = {
        name: "João Silva",
        email: "joao@example.com",
        password: "123456",
        confirmPassword: "123456",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Senha deve ter pelo menos 8 caracteres",
        );
      }
    });

    it("should reject password without required characters", () => {
      const invalidData = {
        name: "João Silva",
        email: "joao@example.com",
        password: "12345678",
        confirmPassword: "12345678",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial",
        );
      }
    });

    it("should reject password without uppercase letter", () => {
      const invalidData = {
        name: "João Silva",
        email: "joao@example.com",
        password: "minhasenha@123",
        confirmPassword: "minhasenha@123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial",
        );
      }
    });

    it("should reject mismatched passwords", () => {
      const invalidData = {
        name: "João Silva",
        email: "joao@example.com",
        password: "MinhaSenh@123",
        confirmPassword: "OutraSenh@456",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Senhas não coincidem");
      }
    });

    it("should convert email to lowercase", () => {
      const data = {
        name: "João Silva",
        email: "JOAO@EXAMPLE.COM",
        password: "MinhaSenh@123",
        confirmPassword: "MinhaSenh@123",
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("joao@example.com");
      }
    });
  });

  describe("loginSchema", () => {
    it("should validate correct login data", () => {
      const validData = {
        email: "joao@example.com",
        password: "MinhaSenh@123",
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject empty email", () => {
      const invalidData = {
        email: "",
        password: "MinhaSenh@123",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Email é obrigatório");
      }
    });

    it("should reject empty password", () => {
      const invalidData = {
        email: "joao@example.com",
        password: "",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Senha é obrigatória");
      }
    });
  });

  describe("forgotPasswordSchema", () => {
    it("should validate correct forgot password data", () => {
      const validData = {
        email: "joao@example.com",
      };

      const result = forgotPasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email format", () => {
      const invalidData = {
        email: "invalid-email",
      };

      const result = forgotPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Formato de email inválido",
        );
      }
    });
  });

  describe("resetPasswordSchema", () => {
    it("should validate correct reset password data", () => {
      const validData = {
        token: "valid-token-123",
        password: "NovaSenh@456",
        confirmPassword: "NovaSenh@456",
      };

      const result = resetPasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject empty token", () => {
      const invalidData = {
        token: "",
        password: "NovaSenh@456",
        confirmPassword: "NovaSenh@456",
      };

      const result = resetPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Token é obrigatório");
      }
    });

    it("should reject weak password", () => {
      const invalidData = {
        token: "valid-token-123",
        password: "123456",
        confirmPassword: "123456",
      };

      const result = resetPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Senha deve ter pelo menos 8 caracteres",
        );
      }
    });

    it("should reject password without required characters", () => {
      const invalidData = {
        token: "valid-token-123",
        password: "12345678",
        confirmPassword: "12345678",
      };

      const result = resetPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial",
        );
      }
    });

    it("should reject mismatched passwords", () => {
      const invalidData = {
        token: "valid-token-123",
        password: "NovaSenh@456",
        confirmPassword: "OutraSenh@789",
      };

      const result = resetPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Senhas não coincidem");
      }
    });
  });
});
