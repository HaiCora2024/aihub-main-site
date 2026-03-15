import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const pagesBase = process.env.VITE_BASE ?? (repoName ? `/${repoName}/` : "/");

export default defineConfig({
  plugins: [react()],
  base: pagesBase,
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
  server: {
    host: "0.0.0.0",
    port: 4173,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
  },
});
