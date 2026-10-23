import { expect, test } from "@playwright/test";

test("clock suggests ragas for the watch", async ({ page }) => {
  await page.goto("/clock?at=19:00");
  await expect(page.getByText(/Suggested for this watch/i)).toBeVisible();
  await expect(page.getByText("Yaman").first()).toBeVisible();
});

test("clock updates the watch when dragging", async ({ page }) => {
  await page.goto("/clock?at=04:00");
  await expect(page.getByText(/Bhor|Dawn/i).first()).toBeVisible();
});
