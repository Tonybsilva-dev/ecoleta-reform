import "next-auth";
import { UserType } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      hasSelectedRole?: boolean;
      userType?: UserType | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    hasSelectedRole?: boolean;
    userType?: UserType | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
