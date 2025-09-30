import { expect, test } from "@playwright/test";

test.describe("Item Details Page", () => {
  test("should display item details for valid item", async ({ page }) => {
    await page.goto("/dashboard/items/test-item-id");
    await expect(page).toHaveTitle(/Ecoleta/);
    await expect(page.locator("h1")).toBeVisible();
    await expect(
      page.locator("a[href='/dashboard/items']:has-text('Voltar')"),
    ).toBeVisible();
  });

  test("should show 404 for non-existent item", async ({ page }) => {
    await page.goto("/dashboard/items/non-existent-item");
    await expect(page.locator("text=Item não encontrado")).toBeVisible();
    await expect(
      page.locator("a[href='/dashboard/items']:has-text('Voltar')"),
    ).toBeVisible();
  });

  test("should show loading state", async ({ page }) => {
    await page.route("**/api/items/*", (route) => {
      setTimeout(() => route.continue(), 2000);
    });
    await page.goto("/dashboard/items/test-item-id");
    await expect(page.locator(".animate-pulse").first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("should show error state on API failure", async ({ page }) => {
    await page.route("**/api/items/*", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });
    await page.goto("/dashboard/items/test-item-id");
    await expect(page.locator("text=Algo deu errado")).toBeVisible();
    await expect(
      page.locator("button:has-text('Tentar novamente')"),
    ).toBeVisible();
  });

  test("should show login prompt for unauthenticated users", async ({
    page,
  }) => {
    await page.goto("/dashboard/items/test-item-id");
    await expect(
      page.locator("text=Faça login para interagir com este item"),
    ).toBeVisible();
    await expect(page.locator("a[href='/signin']")).toBeVisible();
  });
});
