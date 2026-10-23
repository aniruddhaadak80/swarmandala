import { expect, test } from "@playwright/test";

test("raga detail renders a mandala and notation", async ({ page }) => {
  await page.goto("/raga/yaman");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Yaman");
  await expect(page.getByText("Aroha", { exact: true })).toBeVisible();
  await expect(page.getByText("Avaroha", { exact: true })).toBeVisible();
  await expect(page.getByText("Pakad", { exact: true })).toBeVisible();
  await expect(page.locator("svg[role='group']")).toBeVisible();
});
