import ReactGA from "react-ga4";
import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import ReactPixel from "react-facebook-pixel";
import axios from "axios";

// 1. Configure default request timeout (10 seconds)
axios.defaults.timeout = 10000;

// 2. Configure automatic response retries with exponential backoff
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    if (!config) return Promise.reject(error);

    // Track retry count
    config.__retryCount = config.__retryCount || 0;
    const maxRetries = 3;
    const initialDelay = 1000; // 1 second base delay

    // Only retry GET requests (idempotent operations) to prevent duplicate submissions
    const isRetryableMethod = ["get"].includes(config.method?.toLowerCase());

    // Only retry on network errors (no response) or 5xx server issues (timeouts/502/503/504)
    const isRetryableError = !response || (response.status >= 500 && response.status <= 599);

    if (config.__retryCount < maxRetries && isRetryableMethod && isRetryableError) {
      config.__retryCount += 1;
      
      // Exponential backoff: delay = initialDelay * 2^(attempt - 1)
      const delay = initialDelay * Math.pow(2, config.__retryCount - 1);
      
      console.warn(
        `[Axios Retry] Request to ${config.url} failed. Retrying (Attempt ${config.__retryCount}/${maxRetries}) in ${delay}ms...`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      return axios(config);
    }

    return Promise.reject(error);
  }
);

ReactGA.initialize("G-54GHE1J6FL");
ReactPixel.init("839517359239880");
ReactPixel.pageView();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
