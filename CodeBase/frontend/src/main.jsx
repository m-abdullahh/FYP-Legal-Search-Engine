import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext.jsx";
import { HistoryProvider } from "./context/userHistoryContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <HistoryProvider>
        <Router>
          <App />
        </Router>
      </HistoryProvider>
    </AuthContextProvider>
  </StrictMode>
);
