import type { Metadata } from "next";
import { BackButton } from "@/components";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Registro - Ecoleta",
  description:
    "Crie sua conta no Ecoleta e comece a fazer a diferença no meio ambiente",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col xl:flex-row">
      {/* Left Column - Promotional */}
      <div className="hidden w-full items-center justify-center bg-green-600 p-4 sm:p-6 md:p-8 xl:flex xl:w-1/3">
        {/* Botão de voltar */}
        <BackButton />

        <div className="text-white">
          <div className="mb-6 flex items-center sm:mb-8">
            <div className="mr-2 h-6 w-6 rounded-lg bg-white sm:mr-3 sm:h-8 sm:w-8" />
            <span className="font-semibold text-xl sm:text-2xl">Ecoleta</span>
          </div>
          <h1 className="mb-3 font-bold text-2xl sm:mb-4 sm:text-3xl md:text-4xl">
            Junte-se à nossa comunidade sustentável
          </h1>
          <p className="text-base opacity-90 sm:text-lg">
            Crie sua conta e comece a fazer a diferença no meio ambiente.
            Conecte-se com pessoas e empresas que compartilham do mesmo
            propósito.
          </p>
          <div className="mt-8 flex space-x-1.5 sm:mt-12 sm:space-x-2">
            <span className="h-1.5 w-8 rounded-full bg-white sm:h-2 sm:w-10" />
            <span className="h-1.5 w-1.5 rounded-full bg-white opacity-50 sm:h-2 sm:w-2" />
            <span className="h-1.5 w-1.5 rounded-full bg-white opacity-50 sm:h-2 sm:w-2" />
          </div>
        </div>
      </div>

      {/* Right Column - Registration Form */}
      <div className="flex w-full flex-col justify-center bg-white px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 xl:w-2/3">
        <div className="mx-auto w-full max-w-sm sm:max-w-md">
          {/* Icon */}
          <div className="mb-4 flex justify-center sm:mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 sm:h-12 sm:w-12">
              <svg
                className="h-5 w-5 text-green-600 sm:h-6 sm:w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Ícone de Registro</title>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="mb-4 text-center sm:mb-6">
            <h2 className="mb-2 font-bold text-2xl text-gray-900 sm:mb-3 sm:text-3xl">
              Criar conta
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Preencha os dados abaixo para criar sua conta
            </p>
          </div>

          <RegisterForm />

          <div className="mt-4 text-center text-gray-600 text-xs sm:mt-6 sm:text-sm">
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
