import ReactGA from "react-ga4";
import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import ReactPixel from "react-facebook-pixel";

ReactGA.initialize("G-54GHE1J6FL");
ReactPixel.init("839517359239880");
ReactPixel.pageView();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
