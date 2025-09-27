"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { PasswordForm } from "@/components/auth/PasswordForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function AccountSettings() {
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-700 text-xl">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Should redirect by useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header similar ao iFood */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/settings"
                className="text-gray-600 hover:text-gray-900"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Ícone de voltar"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <h1 className="font-bold text-2xl text-gray-900">Credenciais</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 text-sm">
                {session.user?.name || session.user?.email}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                <span className="font-medium text-sm text-white">
                  {(session.user?.name ||
                    session.user?.email ||
                    "U")[0]?.toUpperCase() || "U"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">
          {/* Informações da Conta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações da Conta</CardTitle>
              <CardDescription>
                Dados básicos da sua conta no Ecoleta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="font-medium text-gray-500 text-sm">Nome</div>
                  <p className="text-gray-900 text-sm">
                    {session.user?.name || "Não informado"}
                  </p>
                </div>
                <div>
                  <div className="font-medium text-gray-500 text-sm">Email</div>
                  <p className="text-gray-900 text-sm">{session.user?.email}</p>
                </div>
                <div>
                  <div className="font-medium text-gray-500 text-sm">
                    Método de Login
                  </div>
                  <p className="text-gray-900 text-sm">
                    {hasPassword === null
                      ? "Verificando..."
                      : hasPassword
                        ? "Email/Senha + OAuth"
                        : "OAuth (Google)"}
                  </p>
                </div>
                <div>
                  <div className="font-medium text-gray-500 text-sm">
                    Status da Conta
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-green-600 text-sm">Ativa</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Senha */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações de Senha</CardTitle>
              <CardDescription>
                {hasPassword === null
                  ? "Verificando status da senha..."
                  : hasPassword
                    ? "Altere sua senha para manter sua conta segura."
                    : "Defina uma senha para poder fazer login com email e senha."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasPassword !== null && (
                <PasswordForm
                  hasExistingPassword={hasPassword}
                  onSuccess={() => {
                    setHasPassword(true);
                  }}
                />
              )}
            </CardContent>
          </Card>

          {/* Métodos de Login */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Métodos de Login</CardTitle>
              <CardDescription>
                Gerencie como você acessa sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      role="img"
                      aria-label="Ícone do Google"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Google</h3>
                    <p className="text-gray-500 text-sm">
                      Conectado via Google
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-green-600 text-sm">Ativo</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      role="img"
                      aria-label="Ícone de senha"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email e Senha</h3>
                    <p className="text-gray-500 text-sm">
                      {hasPassword ? "Configurado" : "Não configurado"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`h-2 w-2 rounded-full ${hasPassword ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  <span
                    className={`text-sm ${hasPassword ? "text-green-600" : "text-gray-500"}`}
                  >
                    {hasPassword ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações da Conta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações da Conta</CardTitle>
              <CardDescription>Gerenciar sua conta e dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Ícone de download"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Exportar meus dados
              </Button>

              <Separator />

              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Ícone de lixeira"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Excluir conta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
