import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { RealEstatePage } from "./RealEstatePage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <RealEstatePage />
  </StrictMode>
);
