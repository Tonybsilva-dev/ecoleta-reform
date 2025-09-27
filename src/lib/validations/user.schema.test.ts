import { describe, expect, it } from "vitest";
import {
  userAuthenticationSchema,
  userEmailVerificationSchema,
  userPasswordChangeSchema,
  userPasswordResetRequestSchema,
  userPasswordResetSchema,
  userRegistrationSchema,
  userUpdateSchema,
} from "./user.schema";

describe("User Schema Validation", () => {
  describe("userRegistrationSchema", () => {
    it("should validate correct registration data", () => {
      const validData = {
        email: "test@example.com",
        password: "Password123",
        name: "João Silva",
        userType: "CITIZEN" as const,
      };

      const result = userRegistrationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email format", () => {
      const invalidData = {
        email: "invalid-email",
        password: "Password123",
        name: "João Silva",
      };

      const result = userRegistrationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Email inválido");
      }
    });

    it("should reject weak password", () => {
      const invalidData = {
        email: "test@example.com",
        password: "123",
        name: "João Silva",
      };

      const result = userRegistrationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Senha deve ter pelo menos 8 caracteres",
        );
      }
    });

    it("should reject password without uppercase letter", () => {
      const invalidData = {
        email: "test@example.com",
        password: "password123",
        name: "João Silva",
      };

      const result = userRegistrationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número",
        );
      }
    });

    it("should reject invalid name format", () => {
      const invalidData = {
        email: "test@example.com",
        password: "Password123",
        name: "João123",
      };

      const result = userRegistrationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Nome deve conter apenas letras e espaços",
        );
      }
    });

    it("should set default userType to CITIZEN", () => {
      const data = {
        email: "test@example.com",
        password: "Password123",
        name: "João Silva",
      };

      const result = userRegistrationSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.userType).toBe("CITIZEN");
      }
    });
  });

  describe("userAuthenticationSchema", () => {
    it("should validate correct authentication data", () => {
      const validData = {
        email: "test@example.com",
        password: "Password123",
      };

      const result = userAuthenticationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject empty email", () => {
      const invalidData = {
        email: "",
        password: "Password123",
      };

      const result = userAuthenticationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Email é obrigatório");
      }
    });

    it("should reject empty password", () => {
      const invalidData = {
        email: "test@example.com",
        password: "",
      };

      const result = userAuthenticationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Senha é obrigatória");
      }
    });
  });

  describe("userUpdateSchema", () => {
    it("should validate correct update data", () => {
      const validData = {
        email: "newemail@example.com",
        password: "NewPassword123",
      };

      const result = userUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should validate partial update data", () => {
      const validData = {
        email: "newemail@example.com",
      };

      const result = userUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should validate empty object", () => {
      const validData = {};

      const result = userUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("userPasswordChangeSchema", () => {
    it("should validate correct password change data", () => {
      const validData = {
        currentPassword: "OldPassword123",
        newPassword: "NewPassword123",
      };

      const result = userPasswordChangeSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject empty current password", () => {
      const invalidData = {
        currentPassword: "",
        newPassword: "NewPassword123",
      };

      const result = userPasswordChangeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Senha atual é obrigatória",
        );
      }
    });

    it("should reject weak new password", () => {
      const invalidData = {
        currentPassword: "OldPassword123",
        newPassword: "123",
      };

      const result = userPasswordChangeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Nova senha deve ter pelo menos 8 caracteres",
        );
      }
    });
  });

  describe("userEmailVerificationSchema", () => {
    it("should validate correct verification token", () => {
      const validData = {
        token: "valid-token-123",
      };

      const result = userEmailVerificationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject empty token", () => {
      const invalidData = {
        token: "",
      };

      const result = userEmailVerificationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Token de verificação é obrigatório",
        );
      }
    });
  });

  describe("userPasswordResetRequestSchema", () => {
    it("should validate correct reset request data", () => {
      const validData = {
        email: "test@example.com",
      };

      const result = userPasswordResetRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidData = {
        email: "invalid-email",
      };

      const result = userPasswordResetRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Email inválido");
      }
    });
  });

  describe("userPasswordResetSchema", () => {
    it("should validate correct reset data", () => {
      const validData = {
        token: "valid-reset-token-123",
        newPassword: "NewPassword123",
      };

      const result = userPasswordResetSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject empty token", () => {
      const invalidData = {
        token: "",
        newPassword: "NewPassword123",
      };

      const result = userPasswordResetSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Token de redefinição é obrigatório",
        );
      }
    });

    it("should reject weak new password", () => {
      const invalidData = {
        token: "valid-reset-token-123",
        newPassword: "123",
      };

      const result = userPasswordResetSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Nova senha deve ter pelo menos 8 caracteres",
        );
      }
    });
  });
});
