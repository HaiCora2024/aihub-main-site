import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { PartnerKpiPage } from "./PartnerKpiPage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <PartnerKpiPage />
  </StrictMode>
);
