"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { PasswordForm } from "@/components/auth/PasswordForm";

export function Settings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);

  const checkUserPassword = useCallback(async () => {
    try {
      const response = await fetch("/api/user/password-status");
      if (response.ok) {
        const data = await response.json();
        setHasPassword(data.hasPassword);
      }
    } catch (error) {
      console.error("Erro ao verificar status da senha:", error);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      checkUserPassword();
    }
  }, [session?.user?.id, checkUserPassword]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-gray-700 text-xl">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Should redirect by useEffect
  }

  return (
    <div className="min-h-full bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <h1 className="font-semibold text-gray-900 text-xl">
                Configurações
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 text-sm">
                Olá, {session.user?.name || session.user?.email}
              </span>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="rounded-md bg-gray-600 px-3 py-2 font-medium text-sm text-white hover:bg-gray-700"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="space-y-6">
            {/* Seção de Senha */}
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-6">
                <h2 className="font-medium text-gray-900 text-lg">
                  Configurações de Senha
                </h2>
                <p className="mt-1 text-gray-600 text-sm">
                  {hasPassword === null
                    ? "Verificando status da senha..."
                    : hasPassword
                      ? "Altere sua senha para manter sua conta segura."
                      : "Defina uma senha para poder fazer login com email e senha."}
                </p>
              </div>

              {hasPassword !== null && (
                <PasswordForm
                  hasExistingPassword={hasPassword}
                  onSuccess={() => {
                    setHasPassword(true);
                  }}
                />
              )}
            </div>

            {/* Informações da Conta */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 font-medium text-gray-900 text-lg">
                Informações da Conta
              </h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-gray-500 text-sm">Nome</dt>
                  <dd className="mt-1 text-gray-900 text-sm">
                    {session.user?.name || "Não informado"}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500 text-sm">Email</dt>
                  <dd className="mt-1 text-gray-900 text-sm">
                    {session.user?.email}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500 text-sm">
                    Método de Login
                  </dt>
                  <dd className="mt-1 text-gray-900 text-sm">
                    {hasPassword ? "Email/Senha + OAuth" : "OAuth (Google)"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
