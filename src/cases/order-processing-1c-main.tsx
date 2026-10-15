import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { CompanyFooter } from "../components/CompanyDetails";
import { OrderProcessing1CPage } from "./OrderProcessing1CPage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <OrderProcessing1CPage />
    <CompanyFooter />
  </StrictMode>,
);
