import "next-auth";
import { UserType, Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      hasSelectedRole?: boolean;
      userType?: UserType | null;
      role?: Role | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    hasSelectedRole?: boolean;
    userType?: UserType | null;
    role?: Role | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: Role | null;
  }
}
