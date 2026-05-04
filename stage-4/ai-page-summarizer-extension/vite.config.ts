import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { crx } from "@crxjs/vite-plugin";

import manifest from "./src/manifest";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss(), crx({ manifest })],

    define: {
      __OPENROUTER_API_KEY__: JSON.stringify(env.VITE_OPENROUTER_API_KEY),
    },
  };
});
