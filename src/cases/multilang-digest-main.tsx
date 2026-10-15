import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { CompanyFooter } from "../components/CompanyDetails";
import { MultilangDigestPage } from "./MultilangDigestPage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <MultilangDigestPage />
    <CompanyFooter />
  </StrictMode>,
);
