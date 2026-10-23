import { expect, test } from "@playwright/test";

test("atlas filters by search", async ({ page }) => {
  await page.goto("/atlas");
  const input = page.getByPlaceholder(/Search ragas/i);
  await input.fill("Bhairav");
  await expect(page.getByText(/ragas$/i)).toBeVisible();
});

test("atlas shows 24 ragas by default", async ({ page }) => {
  await page.goto("/atlas");
  await expect(page.getByText("24 ragas")).toBeVisible();
});
