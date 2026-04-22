import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { OmniCrmPage } from "./OmniCrmPage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <OmniCrmPage />
  </StrictMode>
);
