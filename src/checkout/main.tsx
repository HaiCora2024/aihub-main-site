import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Checkout } from "./Checkout";
import "../shop/shop.css";
import "./checkout.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Checkout />
  </StrictMode>,
);
