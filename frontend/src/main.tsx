import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/layout.css";
import "./styles/search.css";
import "./styles/tokens.css";
import "./styles/theme.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
