import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { CompanyFooter } from "../components/CompanyDetails";
import { TelegramSentimentPage } from "./TelegramSentimentPage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <TelegramSentimentPage />
    <CompanyFooter />
  </StrictMode>,
);
