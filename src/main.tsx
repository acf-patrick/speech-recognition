import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

if (import.meta.env.PROD) {
  document.body.style.userSelect = "none";
  document.body.oncontextmenu = (e) => {
    e.preventDefault();
  };
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
