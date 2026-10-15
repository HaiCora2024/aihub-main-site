import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Shop from "./Shop";
import "./shop.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Shop />
  </StrictMode>,
);
