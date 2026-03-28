import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { RoboticsFleetPage } from "./RoboticsFleetPage";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <RoboticsFleetPage />
  </StrictMode>
);
