import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "happy-dom",
    globals: true,
    include: ["tests/unit/**/*.{test,spec}.ts", "tests/integration/**/*.{test,spec}.tsx"],
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      include: ["src/lib/**/*.ts"],
      thresholds: {
        lines: 80,
      },
    },
  },
});
