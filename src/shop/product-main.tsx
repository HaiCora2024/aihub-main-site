import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ProductPage from "./ProductPage";
import "./shop.css";

// Each shop/<slug>.html names its product; an unknown slug renders "not found".
const slug =
  document
    .querySelector<HTMLMetaElement>('meta[name="aihub-product"]')
    ?.content.trim() ?? "";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProductPage slug={slug} />
  </StrictMode>,
);
