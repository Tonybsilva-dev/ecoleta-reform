import { describe, expect, it } from "vitest";
import {
  profileCreationSchema,
  profilePublicViewSchema,
  profileSearchSchema,
  profileUpdateSchema,
  profileVerificationSchema,
} from "./profile.schema";

describe("Profile Schema Validation", () => {
  describe("profileCreationSchema", () => {
    it("should validate correct profile creation data", () => {
      const validData = {
        name: "João Silva",
        bio: "Desenvolvedor apaixonado por sustentabilidade",
        phone: "(11) 99999-9999",
        avatarUrl: "https://example.com/avatar.jpg",
        userType: "CITIZEN" as const,
      };

      const result = profileCreationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should validate minimal profile data", () => {
      const validData = {
        name: "João Silva",
      };

      const result = profileCreationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject short name", () => {
      const invalidData = {
        name: "J",
      };

      const result = profileCreationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Nome deve ter pelo menos 2 caracteres",
        );
      }
    });

    it("should reject long name", () => {
      const invalidData = {
        name: "A".repeat(101),
      };

      const result = profileCreationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Nome deve ter no máximo 100 caracteres",
        );
      }
    });

    it("should reject name with numbers", () => {
      const invalidData = {
        name: "João123",
      };

      const result = profileCreationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Nome deve conter apenas letras e espaços",
        );
      }
    });

    it("should reject long bio", () => {
      const invalidData = {
        name: "João Silva",
        bio: "A".repeat(501),
      };

      const result = profileCreationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Bio deve ter no máximo 500 caracteres",
        );
      }
    });

    it("should reject invalid phone format", () => {
      const invalidData = {
        name: "João Silva",
        phone: "11999999999",
      };

      const result = profileCreationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Telefone deve estar no formato (XX) XXXXX-XXXX",
        );
      }
    });

    it("should reject invalid avatar URL", () => {
      const invalidData = {
        name: "João Silva",
        avatarUrl: "not-a-url",
      };

      const result = profileCreationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "URL do avatar deve ser válida",
        );
      }
    });

    it("should set default userType to CITIZEN", () => {
      const data = {
        name: "João Silva",
      };

      const result = profileCreationSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.userType).toBe("CITIZEN");
      }
    });
  });

  describe("profileUpdateSchema", () => {
    it("should validate correct update data", () => {
      const validData = {
        name: "João Silva Santos",
        bio: "Nova bio atualizada",
        phone: "(11) 88888-8888",
        avatarUrl: "https://example.com/new-avatar.jpg",
        userType: "COLLECTOR" as const,
      };

      const result = profileUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should validate partial update data", () => {
      const validData = {
        name: "João Silva Santos",
      };

      const result = profileUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should validate empty object", () => {
      const validData = {};

      const result = profileUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("profilePublicViewSchema", () => {
    it("should validate correct public profile data", () => {
      const validData = {
        id: "clx1234567890abcdef",
        name: "João Silva",
        bio: "Desenvolvedor apaixonado por sustentabilidade",
        avatarUrl: "https://example.com/avatar.jpg",
        userType: "CITIZEN" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = profilePublicViewSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should validate profile with null bio and avatarUrl", () => {
      const validData = {
        id: "clx1234567890abcdef",
        name: "João Silva",
        bio: null,
        avatarUrl: null,
        userType: "CITIZEN" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = profilePublicViewSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("profileSearchSchema", () => {
    it("should validate correct search data", () => {
      const validData = {
        query: "João Silva",
        userType: "CITIZEN" as const,
        limit: 20,
        offset: 0,
      };

      const result = profileSearchSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should validate minimal search data", () => {
      const validData = {
        query: "João",
      };

      const result = profileSearchSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject empty query", () => {
      const invalidData = {
        query: "",
      };

      const result = profileSearchSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Query de busca é obrigatória",
        );
      }
    });

    it("should reject long query", () => {
      const invalidData = {
        query: "A".repeat(101),
      };

      const result = profileSearchSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Query deve ter no máximo 100 caracteres",
        );
      }
    });

    it("should reject invalid limit", () => {
      const invalidData = {
        query: "João",
        limit: 0,
      };

      const result = profileSearchSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Limit deve ser pelo menos 1",
        );
      }
    });

    it("should reject limit too high", () => {
      const invalidData = {
        query: "João",
        limit: 51,
      };

      const result = profileSearchSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Limit deve ser no máximo 50",
        );
      }
    });

    it("should reject negative offset", () => {
      const invalidData = {
        query: "João",
        offset: -1,
      };

      const result = profileSearchSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Offset deve ser pelo menos 0",
        );
      }
    });

    it("should set default values", () => {
      const data = {
        query: "João",
      };

      const result = profileSearchSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(10);
        expect(result.data.offset).toBe(0);
      }
    });
  });

  describe("profileVerificationSchema", () => {
    it("should validate correct verification data", () => {
      const validData = {
        verified: true,
        verificationNotes: "Documentos verificados com sucesso",
      };

      const result = profileVerificationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should validate minimal verification data", () => {
      const validData = {
        verified: false,
      };

      const result = profileVerificationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject long verification notes", () => {
      const invalidData = {
        verified: true,
        verificationNotes: "A".repeat(501),
      };

      const result = profileVerificationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "Notas de verificação devem ter no máximo 500 caracteres",
        );
      }
    });
  });
});
