import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { Bank360ReviewPage } from "./Bank360ReviewPage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <Bank360ReviewPage />
  </StrictMode>
);
