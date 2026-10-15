import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { CompanyFooter } from "../components/CompanyDetails";
import { RealEstatePage } from "./RealEstatePage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <RealEstatePage />
    <CompanyFooter />
  </StrictMode>,
);
