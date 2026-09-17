import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthWrapper } from "./context/auth.context.jsx";
import { SprintBoardProvider } from "./context/sprintBoard.context.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter>
    <AuthWrapper>
      <SprintBoardProvider>
        <App />
      </SprintBoardProvider>
    </AuthWrapper>
  </BrowserRouter>,
  // </StrictMode>
);
