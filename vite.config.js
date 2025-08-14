// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Polyfill for Node build environment
if (!globalThis.crypto) {
  globalThis.crypto = require('node:crypto').webcrypto;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/spotmix-downloader/",
  build: {
    outDir: 'dist', // Ensure correct output folder
  },
});
