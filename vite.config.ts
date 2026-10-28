import react from "@vitejs/plugin-react";
import path from "path";
import tailwind from "tailwindcss";
import { defineConfig, type Plugin } from "vite";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const pagesBase = process.env.VITE_BASE ?? (repoName ? `/${repoName}/` : "/");

function chatEmbedPlugin(): Plugin {
  return {
    name: "aihub-chat-embed",
    transformIndexHtml: {
      order: "pre",
      handler(html, context) {
        if (context.path.endsWith("/design-system.html")) return html;
        return {
          html,
          tags: [
            {
              tag: "script",
              attrs: { type: "module", src: "/src/chat/embed.ts" },
              injectTo: "body",
            },
          ],
        };
      },
    },
  };
}

function formConfigPlugin(): Plugin {
  let apiOrigins: string[] = [];
  return {
    name: "aihub-form-config",
    configResolved(config) {
      apiOrigins = [
        ...new Set(
          [config.env.VITE_CONTACT_API_URL, config.env.VITE_SHOP_API_URL].filter(Boolean).flatMap((url) => {
            try {
              const parsed = new URL(url);
              return ["http:", "https:"].includes(parsed.protocol) ? [parsed.origin] : [];
            } catch {
              return [];
            }
          }),
        ),
      ];
      const key = config.env.VITE_TURNSTILE_SITE_KEY || "";
      if (config.command === "build" && config.mode !== "test" && /^[123]x0{18,}/.test(key))
        throw new Error("Turnstile test sitekeys are not allowed in production builds.");
    },
    transformIndexHtml(html) {
      return apiOrigins.length
        ? html.replace("connect-src 'self'", `connect-src 'self' ${apiOrigins.join(" ")}`)
        : html;
    },
  };
}

export default defineConfig({
  plugins: [react(), chatEmbedPlugin(), formConfigPlugin()],
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
        designSystem: path.resolve(__dirname, "design-system.html"),
        shop: path.resolve(__dirname, "shop.html"),
        checkout: path.resolve(__dirname, "checkout.html"),
        productVoiceAssistant: path.resolve(__dirname, "shop/voice-assistant.html"),
        productChatAssistant: path.resolve(__dirname, "shop/chat-assistant.html"),
        productEmailOrders: path.resolve(__dirname, "shop/email-orders.html"),
        productDocumentAutofill: path.resolve(__dirname, "shop/document-autofill.html"),
        productKpiReporting: path.resolve(__dirname, "shop/kpi-reporting.html"),
        productSentimentMonitor: path.resolve(__dirname, "shop/sentiment-monitor.html"),
        productRecommendations: path.resolve(__dirname, "shop/recommendations.html"),
        productDiscoveryWorkshop: path.resolve(__dirname, "shop/discovery-workshop.html"),
        hotelConcierge: path.resolve(__dirname, "cases/hotel-concierge.html"),
        realEstate: path.resolve(__dirname, "cases/real-estate.html"),
        orderProcessing1c: path.resolve(__dirname, "cases/order-processing-1c.html"),
        roboticsFleet: path.resolve(__dirname, "cases/robotics-fleet.html"),
        claudeCodeLanding: path.resolve(__dirname, "cases/claude-code-landing.html"),
        partnerKpi: path.resolve(__dirname, "cases/partner-kpi.html"),
        clinicVoiceAi: path.resolve(__dirname, "cases/clinic-voice-ai.html"),
        telegramSentiment: path.resolve(__dirname, "cases/telegram-sentiment.html"),
        bank360Review: path.resolve(__dirname, "cases/bank-360-review.html"),
        kybScreening: path.resolve(__dirname, "cases/kyb-screening.html"),
        adModeration: path.resolve(__dirname, "cases/ad-moderation.html"),
        multilangDigest: path.resolve(__dirname, "cases/multilang-digest.html"),
        omniCrm: path.resolve(__dirname, "cases/omni-crm.html"),
        rentalPlatform: path.resolve(__dirname, "cases/rental-platform.html"),
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
