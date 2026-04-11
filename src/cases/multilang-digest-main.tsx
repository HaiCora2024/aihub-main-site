import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { MultilangDigestPage } from "./MultilangDigestPage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <MultilangDigestPage />
  </StrictMode>
);
