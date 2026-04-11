import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { AdModerationPage } from "./AdModerationPage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <AdModerationPage />
  </StrictMode>
);
