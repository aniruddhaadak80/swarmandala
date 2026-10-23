import { expect, test } from "@playwright/test";

test("home renders the atlas hero", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Swarmandala/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("The day has");
  await expect(page.getByRole("link", { name: /Enter the atlas/i })).toBeVisible();
});

test("home has no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(errors, errors.join("\n")).toEqual([]);
});
