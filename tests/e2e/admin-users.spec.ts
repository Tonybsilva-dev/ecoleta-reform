import { expect, test } from "@playwright/test";

// Helper: força token ADMIN via cookie quando rodando E2E
test.beforeEach(async ({ context }) => {
  await context.addCookies([
    {
      name: "next-auth.session-token",
      value: "e2e-admin-token",
      url: "http://localhost:3000",
    },
  ]);
});

test("admin/users - open page, see heading and table controls", async ({
  page,
}) => {
  await page.goto("/admin/users");
  await expect(page.getByRole("heading", { name: "Usuários" })).toBeVisible();
  // Placeholder sem acento na página
  await expect(page.getByPlaceholder("Buscar por nome ou email")).toBeVisible();
});

test("admin/users - open details modal from actions", async ({ page }) => {
  await page.goto("/admin/users");
  // Abre primeiro dropdown de ações encontrado (usa data-testid para evitar ambiguidade)
  const firstActions = page.locator('[data-testid="user-actions"]').first();
  await firstActions.click();
  await page.getByRole("menuitem", { name: /ver detalhes/i }).click();
  await expect(
    page.getByRole("heading", { name: /detalhes do usuário/i }),
  ).toBeVisible();
});

test("admin/users - search empty state", async ({ page }) => {
  await page.goto("/admin/users?q=__empty__");
  await expect(page.getByText("Nenhum usuário encontrado")).toBeVisible();
});

test("admin/users - search error state and retry", async ({ page }) => {
  await page.goto("/admin/users?q=__error__");
  await expect(page.getByText("Erro ao carregar usuários")).toBeVisible();
  await page.getByRole("button", { name: /tentar novamente/i }).click();
});

test("admin/users - pagination with many results", async ({ page }) => {
  await page.goto("/admin/users?q=__many__");
  await expect(page.getByRole("button", { name: "Próxima" })).toBeEnabled();
  await page.getByRole("button", { name: "Próxima" }).click();
  await expect(page.getByText(/Página 2 de/)).toBeVisible();
});
