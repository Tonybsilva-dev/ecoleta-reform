import { expect, test } from "@playwright/test";

test.describe("Item Details Page", () => {
  test("should display item details for valid item", async ({ page }) => {
    // Navegar para a página de detalhes de um item
    // Nota: Este teste assume que existe um item com ID válido
    await page.goto("/dashboard/items/test-item-id");

    // Verificar se a página carrega sem erros
    await expect(page).toHaveTitle(/Ecoleta/);

    // Verificar se os elementos básicos estão presentes
    await expect(page.locator("h1")).toBeVisible();

    // Verificar se há um botão de voltar
    await expect(
      page.locator("a[href='/dashboard/items']:has-text('Voltar')"),
    ).toBeVisible();
  });

  test("should show 404 for non-existent item", async ({ page }) => {
    await page.goto("/dashboard/items/non-existent-item");

    // Verificar se a mensagem de "não encontrado" aparece
    await expect(page.locator("text=Item não encontrado")).toBeVisible();

    // Verificar se há um link para voltar
    await expect(
      page.locator("a[href='/dashboard/items']:has-text('Voltar')"),
    ).toBeVisible();
  });

  test("should show loading state", async ({ page }) => {
    // Interceptar a requisição para simular loading
    await page.route("**/api/items/*", (route) => {
      // Delay para simular loading
      setTimeout(() => route.continue(), 2000);
    });

    await page.goto("/dashboard/items/test-item-id");

    // Verificar se o skeleton loading aparece (pode aparecer brevemente)
    await expect(page.locator(".animate-pulse").first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("should show error state on API failure", async ({ page }) => {
    // Interceptar a requisição para simular erro
    await page.route("**/api/items/*", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    await page.goto("/dashboard/items/test-item-id");

    // Verificar se a mensagem de erro aparece
    await expect(page.locator("text=Algo deu errado")).toBeVisible();

    // Verificar se há um botão de tentar novamente
    await expect(
      page.locator("button:has-text('Tentar novamente')"),
    ).toBeVisible();
  });

  test("should show login prompt for unauthenticated users", async ({
    page,
  }) => {
    await page.goto("/dashboard/items/test-item-id");

    // Verificar se aparece o prompt para fazer login
    await expect(
      page.locator("text=Faça login para interagir com este item"),
    ).toBeVisible();

    // Verificar se há um botão de login
    await expect(page.locator("a[href='/signin']")).toBeVisible();
  });
});
