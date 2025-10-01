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
    include: ["**/*.spec.{ts,tsx}", "**/*.test.{ts,tsx}"],
    env: (() => {
      // Carrega .env.test se existir (sem falhar caso não exista)
      if (fs.existsSync(path.resolve(__dirname, ".env.test"))) {
        dotenv.config({ path: path.resolve(__dirname, ".env.test") });
      }
      return {
        NODE_ENV: "test",
        DATABASE_URL:
          process.env.DATABASE_URL ||
          "postgres://postgres:postgres@localhost:5432/sustainable_test",
      };
    })(),
    pool: "forks", // Run tests in separate processes to avoid conflicts
    poolOptions: {
      forks: {
        singleFork: true, // Run all tests in a single fork to avoid database conflicts
      },
    },
    exclude: [
      "**/test-results/**",
      "node_modules/**",
      "tests/e2e/**", // Excluir testes E2E do Playwright
    ],
    deps: {
      // não inlinar dependências para evitar pegar testes internos
      inline: [],
      external: [/node_modules/],
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
        "src/test/**",
        "src/**/__tests__/**",
        "src/**/stories/**",
        "src/app/**/layout.tsx",
        "src/app/**/loading.tsx",
        "src/app/**/error.tsx",
        "src/app/**/not-found.tsx",
        "src/app/globals.css",
        "src/middleware.ts",
        "src/instrumentation.ts",
        "src/instrumentation-client.ts",
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
