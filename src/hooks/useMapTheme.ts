import { useState } from "react";

export type MapTheme = "light" | "dark" | "satellite" | "terrain";

export interface MapThemeConfig {
  name: string;
  label: string;
  description: string;
  tileUrl: string;
  attribution: string;
  icon: string;
}

export const mapThemes: Record<MapTheme, MapThemeConfig> = {
  light: {
    name: "light",
    label: "Padrão",
    description: "Visualização clara e limpa",
    tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    icon: "🗺️",
  },
  dark: {
    name: "dark",
    label: "Escuro",
    description: "Tema escuro para uso noturno",
    tileUrl: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    icon: "🌙",
  },
  satellite: {
    name: "satellite",
    label: "Satélite",
    description: "Imagens de satélite reais",
    tileUrl:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      '&copy; <a href="https://www.esri.com/">Esri</a> — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    icon: "🛰️",
  },
  terrain: {
    name: "terrain",
    label: "Terreno",
    description: "Visualização topográfica",
    tileUrl: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://opentopomap.org/about">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    icon: "🏔️",
  },
};

export function useMapTheme() {
  const [currentTheme, setCurrentTheme] = useState<MapTheme>("light");

  const changeTheme = (theme: MapTheme) => {
    setCurrentTheme(theme);
  };

  const getCurrentThemeConfig = () => {
    return mapThemes[currentTheme];
  };

  return {
    currentTheme,
    changeTheme,
    getCurrentThemeConfig,
    availableThemes: Object.values(mapThemes),
  };
}
