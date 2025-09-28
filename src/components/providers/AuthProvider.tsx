"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { useAuthSync } from "@/hooks/useAuthSync";

interface AuthProviderProps {
  children: ReactNode;
}

function AuthSync({ children }: { children: ReactNode }) {
  useAuthSync();
  return <>{children}</>;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <AuthSync>{children}</AuthSync>
    </SessionProvider>
  );
}
