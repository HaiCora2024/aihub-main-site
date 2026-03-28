import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { OrderProcessing1CPage } from "./OrderProcessing1CPage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <OrderProcessing1CPage />
  </StrictMode>
);
