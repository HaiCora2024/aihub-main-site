import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { CompanyFooter } from "../components/CompanyDetails";
import { AdModerationPage } from "./AdModerationPage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <AdModerationPage />
    <CompanyFooter />
  </StrictMode>,
);
