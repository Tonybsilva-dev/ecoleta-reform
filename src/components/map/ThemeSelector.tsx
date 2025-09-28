"use client";

import { Check, Palette } from "lucide-react";
import { useMapTheme } from "@/hooks/useMapTheme";

export default function ThemeSelector() {
  const { currentTheme, changeTheme, availableThemes } = useMapTheme();

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center space-x-2 rounded-lg bg-white px-3 py-2 text-gray-700 text-sm shadow-lg transition-colors hover:bg-gray-50"
        title="Alterar tema do mapa"
      >
        <Palette className="h-4 w-4" />
        <span className="hidden sm:inline">Tema</span>
      </button>

      {/* Theme Dropdown */}
      <div className="absolute top-full right-0 z-[9999] mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg">
        <div className="p-3">
          <h3 className="mb-3 font-medium text-gray-900 text-sm">
            Temas do Mapa
          </h3>
          <div className="space-y-2">
            {availableThemes.map((theme) => (
              <button
                key={theme.name}
                type="button"
                onClick={() =>
                  changeTheme(
                    theme.name as "light" | "dark" | "satellite" | "terrain",
                  )
                }
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors ${
                  currentTheme === theme.name
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{theme.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{theme.label}</div>
                    <div className="text-gray-500 text-xs">
                      {theme.description}
                    </div>
                  </div>
                </div>
                {currentTheme === theme.name && (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
