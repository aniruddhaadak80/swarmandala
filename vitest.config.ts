import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@repo/core": `${root}packages/core/src/index.ts`,
      "@repo/seed": `${root}packages/seed/src/index.ts`,
      "@repo/ui": `${root}packages/ui/src/index.ts`,
    },
  },
  test: {
    include: ["packages/**/tests/**/*.test.ts", "apps/web/lib/**/*.test.ts"],
    environment: "node",
    reporters: ["default"],
  },
});
