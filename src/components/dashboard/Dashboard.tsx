"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-green-600" />
      </div>
    );
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <h1 className="font-semibold text-gray-900 text-xl">
                Ecoleta Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 text-sm">
                Olá, {session.user?.name || session.user?.email}
              </span>
              <button
                type="button"
                onClick={() => signOut()}
                className="rounded-md bg-red-600 px-3 py-2 font-medium text-sm text-white hover:bg-red-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="rounded-lg border-4 border-gray-200 border-dashed p-8">
            <h2 className="mb-4 font-bold text-2xl text-gray-900">
              Bem-vindo ao seu Dashboard!
            </h2>
            <p className="mb-6 text-gray-600">
              Você está logado com sucesso. Aqui você poderá gerenciar seus
              itens, visualizar suas transações e muito mais.
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="font-medium text-gray-900 text-lg">
                  Meus Itens
                </h3>
                <p className="mt-2 text-gray-600">
                  Gerencie os itens que você está vendendo ou doando.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="font-medium text-gray-900 text-lg">
                  Transações
                </h3>
                <p className="mt-2 text-gray-600">
                  Acompanhe suas compras e vendas.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="font-medium text-gray-900 text-lg">Perfil</h3>
                <p className="mt-2 text-gray-600">
                  Atualize suas informações pessoais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
