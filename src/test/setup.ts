import "@testing-library/jest-dom";
import React from "react";

// Fail-fast safety: ensure tests run against a dedicated TEST database
if (process.env.NODE_ENV === "test") {
  const dbUrl = process.env.DATABASE_URL ?? "";
  const looksLikeTestDb = /(_test|testdb|_e2e|_ci)/i.test(dbUrl);
  if (!looksLikeTestDb) {
    // Prevent accidental deletions on dev/prod databases
    // eslint-disable-next-line no-console
    console.error(
      "[SAFEGUARD] Tests estão usando DATABASE_URL sem sufixo de teste. Configure uma base dedicada (ex.: *_test) ou exporte DATABASE_URL antes de rodar os testes.",
    );
    throw new Error(
      "DATABASE_URL inválida para ambiente de testes. Use uma base isolada contendo 'test' no nome.",
    );
  }
}

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => "/",
}));

// Mock Next.js image component
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement("img", { src, alt, ...props });
  },
}));

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
