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
      <div className="hidden flex-col justify-between bg-green-600 p-4 sm:p-6 md:p-8 xl:flex xl:w-1/3">
        {/* Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="h-6 w-6 rounded bg-white sm:h-8 sm:w-8"></div>
          <span className="font-bold text-lg text-white sm:text-xl">
            Sustainable
          </span>
        </div>

        {/* Main Content */}
        <div className="space-y-4 sm:space-y-6">
          <h1 className="font-bold text-2xl text-white leading-tight sm:text-3xl">
            Crie sua organização sustentável.
          </h1>
          <p className="text-base text-green-100 leading-relaxed sm:text-lg">
            Configure sua organização no Sustainable e comece a fazer a
            diferença no meio ambiente através de práticas sustentáveis e gestão
            de resíduos.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex space-x-1.5 sm:space-x-2">
          <div className="h-1 w-3 rounded bg-green-300 sm:h-1 sm:w-4"></div>
          <div className="h-1 w-6 rounded bg-white sm:h-1 sm:w-8"></div>
          <div className="h-1 w-3 rounded bg-green-300 sm:h-1 sm:w-4"></div>
        </div>
      </div>

      {/* Right Column - Organization Creation Form */}
      <div className="flex w-full flex-col justify-center bg-white px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 xl:w-2/3">
        <div className="mx-auto w-full max-w-lg sm:max-w-xl md:max-w-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
