import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov", "json"], // 'text' per la console, 'html' per un report interattivo, 'lcov' estensione vscode
      all: false,
      include: ["src/**"],
      exclude: ["src/types/**"],
      thresholds: {
        statements: 75,
        branches: 75,
        functions: 75,
        lines: 75,
      },
    },
  },
});
