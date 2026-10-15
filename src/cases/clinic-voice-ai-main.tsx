import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { CompanyFooter } from "../components/CompanyDetails";
import { ClinicVoiceAiPage } from "./ClinicVoiceAiPage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <ClinicVoiceAiPage />
    <CompanyFooter />
  </StrictMode>,
);
