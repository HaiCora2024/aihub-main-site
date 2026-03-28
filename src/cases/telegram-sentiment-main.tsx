import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { TelegramSentimentPage } from "./TelegramSentimentPage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <TelegramSentimentPage />
  </StrictMode>
);
