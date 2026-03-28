import react from "@vitejs/plugin-react";
import path from "path";
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
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        hotelConcierge: path.resolve(__dirname, "cases/hotel-concierge.html"),
        realEstate: path.resolve(__dirname, "cases/real-estate.html"),
        orderProcessing1c: path.resolve(__dirname, "cases/order-processing-1c.html"),
        roboticsFleet: path.resolve(__dirname, "cases/robotics-fleet.html"),
        claudeCodeLanding: path.resolve(__dirname, "cases/claude-code-landing.html"),
        partnerKpi: path.resolve(__dirname, "cases/partner-kpi.html"),
        clinicVoiceAi: path.resolve(__dirname, "cases/clinic-voice-ai.html"),
        telegramSentiment: path.resolve(__dirname, "cases/telegram-sentiment.html"),
        privacyPolicy: path.resolve(__dirname, "legal/privacy-policy.html"),
        terms: path.resolve(__dirname, "legal/terms.html"),
      },
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
