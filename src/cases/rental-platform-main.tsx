import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { CompanyFooter } from "../components/CompanyDetails";
import { RentalPlatformPage } from "./RentalPlatformPage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <RentalPlatformPage />
    <CompanyFooter />
  </StrictMode>,
);
