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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="font-bold text-3xl text-gray-900">
            Bem-vindo ao Ecoleta
          </h1>
          <p className="mt-2 text-gray-600">
            Crie sua conta e comece a fazer a diferença
          </p>
        </div>

        <RegisterForm />

        {/* Link para login */}
        <div className="text-center">
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

        <div className="text-center text-gray-600 text-sm">
          <p>
            Ao continuar, você concorda com nossos{" "}
            <a href="/terms" className="text-green-600 hover:text-green-500">
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a href="/privacy" className="text-green-600 hover:text-green-500">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
