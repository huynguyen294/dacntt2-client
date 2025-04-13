/* eslint-disable no-undef */
import { defineConfig } from "vite";
import path from "path";

import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // if (id.includes("@fortawesome")) return "@fortawesome";
            if (id.includes("@heroui")) return "@heroui";
            // if (id.includes("lodash")) return "lodash";
            // if (id.includes("chart")) return "chart";
            // if (id.includes("react-aria")) return "react-aria";
          }
        },
      },
    },
  },
  server: { port: 3000 },
});
