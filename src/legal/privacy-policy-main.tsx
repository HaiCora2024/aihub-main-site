import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LegalPage } from "./LegalPage";
import "./legal.css";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <LegalPage kind="privacy" />
  </StrictMode>,
);
