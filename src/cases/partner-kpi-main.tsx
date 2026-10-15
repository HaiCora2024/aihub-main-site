import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { CompanyFooter } from "../components/CompanyDetails";
import { PartnerKpiPage } from "./PartnerKpiPage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <PartnerKpiPage />
    <CompanyFooter />
  </StrictMode>,
);
