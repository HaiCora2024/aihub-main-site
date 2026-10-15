import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { CompanyFooter } from "../components/CompanyDetails";
import { ClaudeCodeLandingPage } from "./ClaudeCodeLandingPage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <ClaudeCodeLandingPage />
    <CompanyFooter />
  </StrictMode>,
);
