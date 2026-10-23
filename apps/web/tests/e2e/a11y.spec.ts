import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/", "/atlas", "/raga/yaman", "/compare", "/practice", "/about"];

for (const route of routes) {
  test(`a11y: ${route} has no serious violations`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const serious = results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
}
