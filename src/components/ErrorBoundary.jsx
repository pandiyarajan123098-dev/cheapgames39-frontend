import React from "react";
import { WarningCircle, ArrowClockwise, House } from "@phosphor-icons/react";

/**
 * ErrorBoundary — catches uncaught React render/lifecycle errors.
 * Shows a compact, customer-friendly fallback card while keeping
 * the rest of the layout (Header/Footer) intact.
 *
 * Two modes:
 *  - inline (default): renders a compact recovery card in-page
 *  - fullPage: renders a centred full-screen fallback (used only
 *    if something ABOVE the layout crashes, e.g. AuthProvider)
 *
 * Developer errors are logged to console only in development.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, retrying: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true, retrying: false };
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  handleRetry = () => {
    this.setState({ retrying: true });
    // Give the browser a tick to show the spinner, then reset
    setTimeout(() => {
      this.setState({ hasError: false, retrying: false });
    }, 600);
  };

  handleHome = () => {
    window.location.href = "/";
  };

  render() {
    const { hasError, retrying } = this.state;
    const { fullPage = false, label = "Unable to load" } = this.props;

    if (!hasError) return this.props.children;

    /* ── Compact in-page recovery card ──────────────────── */
    if (!fullPage) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="w-full py-16 px-4 flex flex-col items-center justify-center"
        >
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E8E8",
              borderRadius: "18px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              padding: "32px 28px",
              maxWidth: "420px",
              width: "100%",
              textAlign: "center",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <WarningCircle
                weight="bold"
                style={{ width: 22, height: 22, color: "#FF0000" }}
              />
            </div>

            {/* Label */}
            <span
              style={{
                display: "block",
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#FF0000",
                marginBottom: 8,
              }}
            >
              {label}
            </span>

            {/* Heading */}
            <h2
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#111111",
                marginBottom: 8,
                lineHeight: 1.3,
              }}
            >
              Something went wrong
            </h2>

            {/* Description */}
            <p
              style={{
                fontSize: 13,
                color: "#888888",
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              We couldn't load this section right now.
              <br />
              Please try again.
            </p>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <button
                onClick={this.handleRetry}
                disabled={retrying}
                style={{
                  background: retrying ? "#999999" : "#FF0000",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 24px",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  cursor: retrying ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  minHeight: 44,
                  transition: "background 150ms ease",
                  width: "100%",
                }}
              >
                <ArrowClockwise
                  weight="bold"
                  style={{
                    width: 15,
                    height: 15,
                    animation: retrying ? "cg39-eb-spin 0.7s linear infinite" : "none",
                  }}
                />
                {retrying ? "Trying again…" : "Try Again"}
              </button>

              <button
                onClick={this.handleHome}
                style={{
                  background: "transparent",
                  color: "#555555",
                  border: "1px solid #E5E5E5",
                  borderRadius: 12,
                  padding: "12px 24px",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  minHeight: 44,
                  transition: "border-color 150ms ease, color 150ms ease",
                  width: "100%",
                }}
              >
                <House weight="bold" style={{ width: 14, height: 14 }} />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    /* ── Full-page fallback (only for top-level layout crashes) ── */
    return (
      <div
        role="alert"
        style={{
          minHeight: "100vh",
          background: "#F9F9F9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
          fontFamily: "inherit",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E8E8",
            borderRadius: 20,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            padding: "40px 32px",
            maxWidth: 400,
            width: "100%",
            textAlign: "center",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <WarningCircle
              weight="bold"
              style={{ width: 26, height: 26, color: "#FF0000" }}
            />
          </div>

          <span
            style={{
              display: "block",
              fontSize: 10,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#FF0000",
              marginBottom: 10,
            }}
          >
            Unable to Load
          </span>

          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#111111",
              marginBottom: 12,
            }}
          >
            Something went wrong
          </h1>

          <p
            style={{
              fontSize: 13,
              color: "#888888",
              lineHeight: 1.6,
              marginBottom: 28,
            }}
          >
            We couldn't load this page correctly.
            <br />
            Please try again or return home.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={this.handleRetry}
              disabled={retrying}
              style={{
                background: retrying ? "#999999" : "#FF0000",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 12,
                padding: "13px 24px",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                cursor: retrying ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                minHeight: 44,
                width: "100%",
              }}
            >
              <ArrowClockwise
                weight="bold"
                style={{
                  width: 15,
                  height: 15,
                  animation: retrying ? "cg39-eb-spin 0.7s linear infinite" : "none",
                }}
              />
              {retrying ? "Trying again…" : "Try Again"}
            </button>

            <button
              onClick={this.handleHome}
              style={{
                background: "transparent",
                color: "#555555",
                border: "1px solid #E5E5E5",
                borderRadius: 12,
                padding: "13px 24px",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                minHeight: 44,
                width: "100%",
              }}
            >
              <House weight="bold" style={{ width: 14, height: 14 }} />
              Go Home
            </button>
          </div>
        </div>

        <style>{`
          @keyframes cg39-eb-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
}

export default ErrorBoundary;
