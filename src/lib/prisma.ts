import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const isTest = process.env.NODE_ENV === "test";

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isTest ? [] : ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Optional: hard safety — refuse to run migrations/truncations in non-test envs
export function assertTestDatabase() {
  if (!isTest) return;
  const url = process.env.DATABASE_URL ?? "";
  if (!/_test|testdb|_ci|_e2e/i.test(url)) {
    throw new Error(
      "DATABASE_URL deve apontar para um banco de TESTE quando NODE_ENV=test",
    );
  }
}
