import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { ClinicVoiceAiPage } from "./ClinicVoiceAiPage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <ClinicVoiceAiPage />
  </StrictMode>
);
