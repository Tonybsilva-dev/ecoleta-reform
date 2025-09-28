"use client";

import { cn } from "@/lib/utils";

interface OrganizationCreationLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function OrganizationCreationLayout({
  children,
  className,
}: OrganizationCreationLayoutProps) {
  return (
    <div
      className={cn("flex min-h-screen", className)}
      style={{ position: "relative" }}
    >
      {/* Left Column - Promotional Section */}
      <div className="hidden flex-col justify-between bg-green-600 p-8 lg:flex lg:w-1/3">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded bg-white"></div>
          <span className="font-bold text-white text-xl">Ecoleta</span>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="font-bold text-3xl text-white leading-tight">
            Crie sua organização sustentável.
          </h1>
          <p className="text-green-100 text-lg leading-relaxed">
            Configure sua organização no Ecoleta e comece a fazer a diferença no
            meio ambiente através de práticas sustentáveis e gestão de resíduos.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex space-x-2">
          <div className="h-1 w-4 rounded bg-green-300"></div>
          <div className="h-1 w-8 rounded bg-white"></div>
          <div className="h-1 w-4 rounded bg-green-300"></div>
        </div>
      </div>

      {/* Right Column - Organization Creation Form */}
      <div className="flex w-full flex-col justify-center bg-white px-8 py-12 lg:w-2/3">
        <div className="mx-auto w-full max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
