import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter,HashRouter as Router } from "react-router-dom";
import { AutheContextProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AutheContextProvider>
    <Router basename="/">
      <App />
    </Router>
  </AutheContextProvider>
);
// "homepage": "https://Muneesmnz.github.io/misty-peak-host ",