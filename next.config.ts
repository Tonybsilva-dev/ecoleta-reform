import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    // Configuração para Leaflet
    config.resolve.alias = {
      ...config.resolve.alias,
      leaflet: "leaflet",
    };
    return config;
  },
};

export default nextConfig;
