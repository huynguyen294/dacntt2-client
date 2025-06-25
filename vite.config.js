/* eslint-disable no-undef */
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

import path from "path";
import react from "@vitejs/plugin-react";
import manifest from "./manifest.json";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    VitePWA({
      manifest,
      srcDir: "src",
      filename: "service-worker.js",
      registerType: "autoUpdate",
      strategies: "injectManifest",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,svg,webmanifest}"],
      },
      // devOptions: {
      //   enabled: true,
      //   type: "module",
      // },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@heroui")) return "@heroui";
          }
        },
      },
    },
  },
  server: { port: 3000 },
});
