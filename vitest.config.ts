import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    pool: "forks", // Run tests in separate processes to avoid conflicts
    poolOptions: {
      forks: {
        singleFork: true, // Run all tests in a single fork to avoid database conflicts
      },
    },
    exclude: [
      "tests/e2e/**",
      "playwright.config.ts",
      "**/test-results/**",
      "node_modules/**",
    ],
    deps: {
      // não inlinar dependências para evitar pegar testes internos
      inline: [],
      external: [/node_modules/],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
