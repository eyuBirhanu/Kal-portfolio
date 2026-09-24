/// <reference types="vite-react-ssg" />
import { defineConfig } from "vite";
import type {} from "vite-react-ssg/node";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig(({ isSsrBuild }) => ({
  // Tailwind v4 runs as a Vite plugin — no postcss.config.js, no autoprefixer.
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  ssgOptions: {
    script: "async",
    formatting: "none",
    dirStyle: "nested",
  },
  build: {
    target: "es2022",
    rollupOptions: {
      // React is external during the SSR pass, so it can't be forced into a
      // manual chunk there. Split the vendor bundle on the client build only.
      output: isSsrBuild
        ? {}
        : { manualChunks: { vendor: ["react", "react-dom", "react-router-dom"] } },
    },
  },
}));
