import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
} from "@casl/ability";
import type { UserType } from "@prisma/client";

// Definir tipos para as ações e recursos
export type Actions =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "manage" // manage = todas as ações
  | "list"
  | "view"
  | "edit"
  | "approve"
  | "reject"
  | "assign"
  | "unassign";

export type Resources =
  | "User"
  | "Profile"
  | "Organization"
  | "OrganizationMember"
  | "Item"
  | "Material"
  | "Order"
  | "Payment"
  | "Bid"
  | "Message"
  | "Notification"
  | "Review"
  | "Report"
  | "EcoScore"
  | "Mission"
  | "Badge"
  | "Metric"
  | "Campaign"
  | "all"; // all = todos os recursos

// Tipo para as abilities do CASL
export type AppAbility = MongoAbility<[Actions, Resources]>;

// Função para criar abilities baseadas no tipo de usuário
export function createAbilityFor(
  userType: UserType,
  _userId?: string,
  _organizationId?: string,
): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  switch (userType) {
    case "CITIZEN":
      // Cidadãos podem gerenciar seu próprio perfil e itens
      can("manage", "Profile");
      can("manage", "User");
      can("create", "Item");
      can("read", "Item");
      can("update", "Item");
      can("delete", "Item");
      can("create", "Order");
      can("read", "Order");
      can("create", "Review");
      can("read", "Review");
      can("create", "Report");
      can("read", "EcoScore");
      can("read", "Mission");
      can("read", "Badge");
      can("read", "Campaign");
      can("create", "Message");
      can("read", "Message");
      can("read", "Notification");
      break;

    case "COLLECTOR":
      // Coletores herdam permissões de cidadão + permissões específicas
      can("manage", "Profile");
      can("manage", "User");
      can("create", "Item");
      can("read", "Item");
      can("update", "Item");
      can("delete", "Item");
      can("create", "Order");
      can("read", "Order");
      can("create", "Review");
      can("read", "Review");
      can("create", "Report");
      can("read", "EcoScore");
      can("read", "Mission");
      can("read", "Badge");
      can("read", "Campaign");
      can("create", "Message");
      can("read", "Message");
      can("read", "Notification");

      // Permissões específicas de coletor
      can("update", "Item");
      can("read", "Item");
      break;

    case "COMPANY":
      // Empresas podem gerenciar sua organização e itens
      can("manage", "Profile");
      can("manage", "User");
      can("manage", "Organization");
      can("manage", "OrganizationMember");
      can("create", "Item");
      can("read", "Item");
      can("update", "Item");
      can("delete", "Item");
      can("create", "Order");
      can("read", "Order");
      can("create", "Review");
      can("read", "Review");
      can("create", "Report");
      can("read", "EcoScore");
      can("read", "Mission");
      can("read", "Badge");
      can("manage", "Campaign");
      can("read", "Campaign");
      can("create", "Message");
      can("read", "Message");
      can("read", "Notification");
      can("read", "Metric");
      break;

    case "NGO":
      // ONGs herdam permissões de empresa + permissões específicas
      can("manage", "Profile");
      can("manage", "User");
      can("manage", "Organization");
      can("manage", "OrganizationMember");
      can("create", "Item");
      can("read", "Item");
      can("update", "Item");
      can("delete", "Item");
      can("create", "Order");
      can("read", "Order");
      can("create", "Review");
      can("read", "Review");
      can("create", "Report");
      can("read", "EcoScore");
      can("read", "Mission");
      can("read", "Badge");
      can("manage", "Campaign");
      can("read", "Campaign");
      can("create", "Message");
      can("read", "Message");
      can("read", "Notification");
      can("read", "Metric");

      // Permissões específicas de ONG
      can("create", "Item");
      can("read", "Item");
      break;

    // ADMIN não está no UserType, está no Role
    // Será implementado quando tivermos o sistema de roles completo

    default:
      // Usuários não autenticados só podem ler itens públicos
      can("read", "Item");
      can("read", "Campaign");
      can("read", "Review");
      break;
  }

  return build();
}

// Função para verificar se um usuário pode executar uma ação
export function canUser(
  userType: UserType,
  action: Actions,
  resource: Resources,
  userId?: string,
  organizationId?: string,
): boolean {
  const ability = createAbilityFor(userType, userId, organizationId);
  return ability.can(action, resource);
}

// Função para obter as regras de um usuário
export function getUserRules(
  userType: UserType,
  userId?: string,
  organizationId?: string,
) {
  const ability = createAbilityFor(userType, userId, organizationId);
  return ability.rules;
}

// Constantes para facilitar o uso
export const ACTIONS = {
  CREATE: "create" as const,
  READ: "read" as const,
  UPDATE: "update" as const,
  DELETE: "delete" as const,
  MANAGE: "manage" as const,
  LIST: "list" as const,
  VIEW: "view" as const,
  EDIT: "edit" as const,
  APPROVE: "approve" as const,
  REJECT: "reject" as const,
  ASSIGN: "assign" as const,
  UNASSIGN: "unassign" as const,
};

export const RESOURCES = {
  USER: "User" as const,
  PROFILE: "Profile" as const,
  ORGANIZATION: "Organization" as const,
  ORGANIZATION_MEMBER: "OrganizationMember" as const,
  ITEM: "Item" as const,
  MATERIAL: "Material" as const,
  ORDER: "Order" as const,
  PAYMENT: "Payment" as const,
  BID: "Bid" as const,
  MESSAGE: "Message" as const,
  NOTIFICATION: "Notification" as const,
  REVIEW: "Review" as const,
  REPORT: "Report" as const,
  ECO_SCORE: "EcoScore" as const,
  MISSION: "Mission" as const,
  BADGE: "Badge" as const,
  METRIC: "Metric" as const,
  CAMPAIGN: "Campaign" as const,
  ALL: "all" as const,
};
