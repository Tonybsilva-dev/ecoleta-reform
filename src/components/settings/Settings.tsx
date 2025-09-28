"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  ErrorState,
  LoadingState,
  Separator,
} from "@/components/ui";
import { useNotifications } from "@/hooks/useNotifications";

interface SettingsItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

export function Settings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showError } = useNotifications();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simular carregamento de dados das configurações
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        // Simular delay de carregamento
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (_err) {
        setError("Erro ao carregar configurações");
        showError(
          "Erro ao carregar",
          "Não foi possível carregar as configurações",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      loadSettings();
    }
  }, [session?.user?.id, showError]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingState message="Carregando configurações..." />
      </div>
    );
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <ErrorState
            message={error}
            onRetry={() => {
              setError(null);
              setIsLoading(true);
            }}
          />
        </div>
      </div>
    );
  }

  const settingsItems: SettingsItem[] = [
    {
      title: "Informações pessoais",
      description: "Nome completo e dados pessoais",
      href: "/settings/profile",
      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          <svg
            className="h-5 w-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Ícone de perfil"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      ),
    },
    {
      title: "Dados de contato",
      description: "E-mail e telefone de contato",
      href: "/settings/contact",
      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-5 w-5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Ícone de contato"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
      ),
    },
    {
      title: "Credenciais",
      description: "Meios de acesso à sua conta",
      href: "/settings/account",
      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
          <svg
            className="h-5 w-5 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Ícone de credenciais"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        </div>
      ),
    },
    {
      title: "Privacidade",
      description: "Gerenciar permissões e privacidade",
      href: "/settings/privacy",
      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
          <svg
            className="h-5 w-5 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Ícone de privacidade"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header similar ao iFood */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
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
              <h1 className="font-bold text-2xl text-gray-900">
                Configurações
              </h1>
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
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-900 text-xl">Meus dados</h2>

          <Card>
            <CardContent className="p-0">
              {settingsItems.map((item, index) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between p-6 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      {item.icon}
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      role="img"
                      aria-label="Ícone de seta"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                  {index < settingsItems.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Additional Settings */}
        <div className="mt-8 space-y-4">
          <h2 className="font-semibold text-gray-900 text-xl">Preferências</h2>

          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-6 transition-colors hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      role="img"
                      aria-label="Ícone de configurações"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Notificações</h3>
                    <p className="text-gray-500 text-sm">
                      Gerenciar notificações
                    </p>
                  </div>
                </div>
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Ícone de seta"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
