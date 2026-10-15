import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Catalog from "./Catalog";
import { blocks } from "./data";
import { BlockPattern, PageTemplate } from "./patterns";
import "./tokens.css";
import "./ui.css";
import "./patterns.css";
import "./catalog.css";

const params = new URLSearchParams(location.search);
const preview = params.get("preview");
const target = params.get("target");
const lang = params.get("lang") === "ru" ? "ru" : "en";
const block = blocks.find((item) => item.id === target);
if (preview) document.documentElement.lang = lang;
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {preview === "template" && (target === "service" || target === "case") ? (
      <main className="aihub-theme aihub-preview-page">
        <PageTemplate type={target} lang={lang} />
      </main>
    ) : preview === "block" && block ? (
      <main className="aihub-theme aihub-preview-page">
        <BlockPattern block={block.id} lang={lang} />
        {["hero", "results", "cases", "demo"].includes(block.id) && (
          <BlockPattern block="contact" lang={lang} />
        )}
      </main>
    ) : (
      <Catalog />
    )}
  </StrictMode>,
);
