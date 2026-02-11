import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.jsx";
import "./style.css";

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Could not find #app root element.");
}

ReactDOM.createRoot(rootElement).render(
  React.createElement(React.StrictMode, null, React.createElement(App))
);
