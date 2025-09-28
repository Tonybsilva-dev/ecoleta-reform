"use client";

import { Check, ChevronDown, Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMapTheme } from "@/hooks/useMapTheme";

export default function ThemeSelector() {
  const { currentTheme, changeTheme, availableThemes, getCurrentThemeConfig } =
    useMapTheme();

  const currentThemeConfig = getCurrentThemeConfig();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          title="Alterar tema do mapa"
        >
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Tema</span>
          <span className="text-lg">{currentThemeConfig.icon}</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72" sideOffset={8}>
        <DropdownMenuLabel className="text-center">
          Temas do Mapa
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {availableThemes.map((theme) => (
          <DropdownMenuItem
            key={theme.name}
            onClick={() =>
              changeTheme(
                theme.name as "light" | "dark" | "satellite" | "terrain",
              )
            }
            className="flex items-center justify-between px-3 py-3"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{theme.icon}</span>
              <div className="flex flex-col">
                <span className="font-medium">{theme.label}</span>
                <span className="text-gray-500 text-xs">
                  {theme.description}
                </span>
              </div>
            </div>
            {currentTheme === theme.name && (
              <Check className="h-4 w-4 text-green-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
