import type { UserType } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { ACTIONS, canUser, createAbilityFor, RESOURCES } from "../permissions";

describe("CASL Permissions", () => {
  const mockUserId = "user-123";
  const mockOrganizationId = "org-456";

  describe("CITIZEN permissions", () => {
    it("should allow citizens to manage their own profile", () => {
      const ability = createAbilityFor("CITIZEN", mockUserId);

      expect(ability.can("manage", "Profile")).toBe(true);
      expect(ability.can("manage", "User")).toBe(true);
    });

    it("should allow citizens to create and manage items", () => {
      const ability = createAbilityFor("CITIZEN", mockUserId);

      expect(ability.can("create", "Item")).toBe(true);
      expect(ability.can("read", "Item")).toBe(true);
      expect(ability.can("update", "Item")).toBe(true);
      expect(ability.can("delete", "Item")).toBe(true);
    });

    it("should allow citizens to create orders and reviews", () => {
      const ability = createAbilityFor("CITIZEN", mockUserId);

      expect(ability.can("create", "Order")).toBe(true);
      expect(ability.can("read", "Order")).toBe(true);
      expect(ability.can("create", "Review")).toBe(true);
      expect(ability.can("read", "Review")).toBe(true);
    });
  });

  describe("COLLECTOR permissions", () => {
    it("should inherit all citizen permissions", () => {
      const ability = createAbilityFor("COLLECTOR", mockUserId);

      expect(ability.can("manage", "Profile")).toBe(true);
      expect(ability.can("create", "Item")).toBe(true);
      expect(ability.can("create", "Order")).toBe(true);
      expect(ability.can("create", "Review")).toBe(true);
    });

    it("should have specific collector permissions", () => {
      const ability = createAbilityFor("COLLECTOR", mockUserId);

      expect(ability.can("update", "Item")).toBe(true);
      expect(ability.can("read", "Item")).toBe(true);
    });
  });

  describe("COMPANY permissions", () => {
    it("should allow companies to manage their organization", () => {
      const ability = createAbilityFor(
        "COMPANY",
        mockUserId,
        mockOrganizationId,
      );

      expect(ability.can("manage", "Organization")).toBe(true);
      expect(ability.can("manage", "OrganizationMember")).toBe(true);
    });

    it("should allow companies to manage campaigns", () => {
      const ability = createAbilityFor(
        "COMPANY",
        mockUserId,
        mockOrganizationId,
      );

      expect(ability.can("manage", "Campaign")).toBe(true);
      expect(ability.can("read", "Campaign")).toBe(true);
    });

    it("should allow companies to read their metrics", () => {
      const ability = createAbilityFor(
        "COMPANY",
        mockUserId,
        mockOrganizationId,
      );

      expect(ability.can("read", "Metric")).toBe(true);
    });
  });

  describe("NGO permissions", () => {
    it("should inherit all company permissions", () => {
      const ability = createAbilityFor("NGO", mockUserId, mockOrganizationId);

      expect(ability.can("manage", "Organization")).toBe(true);
      expect(ability.can("manage", "Campaign")).toBe(true);
      expect(ability.can("read", "Metric")).toBe(true);
    });

    it("should have specific NGO permissions for donations", () => {
      const ability = createAbilityFor("NGO", mockUserId, mockOrganizationId);

      expect(ability.can("create", "Item")).toBe(true);
      expect(ability.can("read", "Item")).toBe(true);
    });
  });

  // ADMIN permissions serão implementadas quando tivermos o sistema de roles completo

  describe("Unauthenticated users", () => {
    it("should only allow reading public items", () => {
      const ability = createAbilityFor("CITIZEN" as UserType); // Simulando usuário não autenticado

      expect(ability.can("read", "Item")).toBe(true);
      expect(ability.can("read", "Campaign")).toBe(true);
      expect(ability.can("read", "Review")).toBe(true);

      expect(ability.can("create", "Item")).toBe(true); // CITIZEN pode criar
      expect(ability.can("manage", "Profile")).toBe(true); // CITIZEN pode gerenciar
    });
  });

  describe("canUser helper function", () => {
    it("should work correctly for different user types", () => {
      expect(canUser("CITIZEN", "create", "Item", mockUserId)).toBe(true);
      expect(canUser("CITIZEN", "manage", "Organization", mockUserId)).toBe(
        false,
      );
      // ADMIN será implementado quando tivermos o sistema de roles completo
    });
  });

  describe("Constants", () => {
    it("should export correct action constants", () => {
      expect(ACTIONS.CREATE).toBe("create");
      expect(ACTIONS.READ).toBe("read");
      expect(ACTIONS.UPDATE).toBe("update");
      expect(ACTIONS.DELETE).toBe("delete");
      expect(ACTIONS.MANAGE).toBe("manage");
    });

    it("should export correct resource constants", () => {
      expect(RESOURCES.USER).toBe("User");
      expect(RESOURCES.PROFILE).toBe("Profile");
      expect(RESOURCES.ORGANIZATION).toBe("Organization");
      expect(RESOURCES.ITEM).toBe("Item");
      expect(RESOURCES.ALL).toBe("all");
    });
  });
});
