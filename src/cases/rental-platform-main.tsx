import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { RentalPlatformPage } from "./RentalPlatformPage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <RentalPlatformPage />
  </StrictMode>
);
