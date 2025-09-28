import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Registro - Ecoleta",
  description:
    "Crie sua conta no Ecoleta e comece a fazer a diferença no meio ambiente",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left Column - Promotional */}
      <div className="hidden w-full items-center justify-center bg-green-600 p-8 lg:flex lg:w-1/3">
        <div className="text-white">
          <div className="mb-8 flex items-center">
            <div className="mr-3 h-8 w-8 rounded-lg bg-white" />
            <span className="font-semibold text-2xl">Ecoleta</span>
          </div>
          <h1 className="mb-4 font-bold text-4xl">
            Junte-se à nossa comunidade sustentável
          </h1>
          <p className="text-lg opacity-90">
            Crie sua conta e comece a fazer a diferença no meio ambiente.
            Conecte-se com pessoas e empresas que compartilham do mesmo
            propósito.
          </p>
          <div className="mt-12 flex space-x-2">
            <span className="h-2 w-10 rounded-full bg-white" />
            <span className="h-2 w-2 rounded-full bg-white opacity-50" />
            <span className="h-2 w-2 rounded-full bg-white opacity-50" />
          </div>
        </div>
      </div>

      {/* Right Column - Registration Form */}
      <div className="flex w-full flex-col justify-center bg-white px-8 py-12 lg:w-2/3">
        <div className="mx-auto w-full max-w-md">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Ícone de Registro</title>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="mb-6 text-center">
            <h2 className="mb-3 font-bold text-3xl text-gray-900">
              Criar conta
            </h2>
            <p className="text-gray-600">
              Preencha os dados abaixo para criar sua conta
            </p>
          </div>

          <RegisterForm />

          {/* Link para login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Já tem uma conta?{" "}
              <Link
                href="/auth/signin"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Faça login aqui
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center text-gray-600 text-sm">
            <p>
              Ao continuar, você concorda com nossos{" "}
              <a href="/terms" className="text-green-600 hover:text-green-500">
                Termos de Serviço
              </a>{" "}
              e{" "}
              <a
                href="/privacy"
                className="text-green-600 hover:text-green-500"
              >
                Política de Privacidade
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
