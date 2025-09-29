import fs from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    env: (() => {
      // Carrega .env.test se existir (sem falhar caso não exista)
      if (fs.existsSync(path.resolve(__dirname, ".env.test"))) {
        dotenv.config({ path: path.resolve(__dirname, ".env.test") });
      }
      return {
        NODE_ENV: "test",
        DATABASE_URL:
          process.env.DATABASE_URL ||
          "postgres://postgres:postgres@localhost:5432/ecoleta_test",
      };
    })(),
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
