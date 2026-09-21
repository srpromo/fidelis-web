import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  base: "/fidelis-web/",
  test: { environment: "jsdom", setupFiles: "./src/test/setup.ts", css: true },
  build: { sourcemap: false },
});
