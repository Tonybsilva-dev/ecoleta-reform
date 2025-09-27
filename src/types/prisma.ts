import type { Prisma } from "@prisma/client";

// ===== USER TYPES =====

// User with profile
export type UserWithProfile = Prisma.UserGetPayload<{
  include: {
    profile: true;
  };
}>;

// User with profile and memberships
export type UserWithProfileAndMemberships = Prisma.UserGetPayload<{
  include: {
    profile: true;
    memberships: {
      include: {
        organization: true;
      };
    };
  };
}>;

// User with all relations
export type UserWithAllRelations = Prisma.UserGetPayload<{
  include: {
    profile: true;
    memberships: {
      include: {
        organization: true;
      };
    };
    createdItems: true;
    orders: true;
    reviewerReviews: true;
    revieweeReviews: true;
  };
}>;

// Public user (without sensitive data)
export type PublicUser = Omit<UserWithProfile, "password" | "emailVerified">;

// User for authentication
export type AuthUser = {
  id: string;
  email: string;
  password: string | null;
};

// ===== PROFILE TYPES =====

// Profile with user
export type ProfileWithUser = Prisma.ProfileGetPayload<{
  include: {
    user: true;
  };
}>;

// Public profile (without sensitive user data)
export type PublicProfile = Omit<ProfileWithUser, "user"> & {
  user: {
    id: string;
    email: string;
  };
};

// ===== ORGANIZATION TYPES =====

// Organization with members
export type OrganizationWithMembers = Prisma.OrganizationGetPayload<{
  include: {
    members: {
      include: {
        user: {
          include: {
            profile: true;
          };
        };
      };
    };
  };
}>;

// Organization with all relations
export type OrganizationWithAllRelations = Prisma.OrganizationGetPayload<{
  include: {
    members: {
      include: {
        user: {
          include: {
            profile: true;
          };
        };
      };
    };
    points: true;
    items: true;
  };
}>;

// ===== ITEM TYPES =====

// Item with creator and organization
export type ItemWithCreatorAndOrganization = Prisma.ItemGetPayload<{
  include: {
    createdBy: {
      include: {
        profile: true;
      };
    };
    organization: true;
  };
}>;

// Item with all relations
export type ItemWithAllRelations = Prisma.ItemGetPayload<{
  include: {
    createdBy: {
      include: {
        profile: true;
      };
    };
    organization: true;
    pointItems: {
      include: {
        point: true;
      };
    };
    orders: true;
  };
}>;

// ===== ORDER TYPES =====

// Order with user and item
export type OrderWithUserAndItem = Prisma.OrderGetPayload<{
  include: {
    user: {
      include: {
        profile: true;
      };
    };
    item: true;
  };
}>;

// Order with all relations
export type OrderWithAllRelations = Prisma.OrderGetPayload<{
  include: {
    user: {
      include: {
        profile: true;
      };
    };
    item: {
      include: {
        createdBy: {
          include: {
            profile: true;
          };
        };
        organization: true;
      };
    };
    payment: true;
  };
}>;

// ===== POINT TYPES =====

// Point with organization
export type PointWithOrganization = Prisma.PointGetPayload<{
  include: {
    organization: true;
  };
}>;

// Point with all relations
export type PointWithAllRelations = Prisma.PointGetPayload<{
  include: {
    organization: true;
    pointItems: {
      include: {
        item: true;
      };
    };
  };
}>;

// ===== REVIEW TYPES =====

// Review with reviewer and reviewee
export type ReviewWithReviewerAndReviewee = Prisma.ReviewGetPayload<{
  include: {
    reviewer: {
      include: {
        profile: true;
      };
    };
    reviewee: {
      include: {
        profile: true;
      };
    };
  };
}>;

// ===== UTILITY TYPES =====

// Pagination input
export interface PaginationInput {
  page?: number;
  limit?: number;
  offset?: number;
}

// Pagination result
export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Search input
export interface SearchInput {
  query?: string;
  filters?: Record<string, unknown>;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Error response
export interface ApiError {
  success: false;
  error: string;
  message: string;
  details?: Record<string, unknown>;
}

// ===== ENUM TYPES =====

export type UserType = "CITIZEN" | "COLLECTOR" | "COMPANY" | "NGO";
export type Role = "ADMIN" | "MEMBER" | "OWNER";
export type ItemStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SOLD"
  | "DONATED"
  | "COLLECTED";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
