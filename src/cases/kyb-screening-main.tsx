import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { KybScreeningPage } from "./KybScreeningPage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <KybScreeningPage />
  </StrictMode>
);
