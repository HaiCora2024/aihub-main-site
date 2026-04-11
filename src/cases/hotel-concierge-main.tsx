import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { HotelConciergePage } from "./HotelConciergePage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <HotelConciergePage />
  </StrictMode>
);
