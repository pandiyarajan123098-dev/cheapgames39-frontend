import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Headset,
} from "@phosphor-icons/react";
import logo from "../logo.png";

/**
 * AuthLayout — shared shell for all authentication pages.
 *
 * Replaces the full storefront Header/Footer with:
 *  - Minimal auth header (logo + Back to Store)
 *  - Premium #F7F7F7 background with subtle red glow
 *  - Trust micro-row below the card
 *  - Minimal footer (© · Terms · Privacy)
 */
export default function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ background: "#F7F7F7" }}
    >
      {/* ── MINIMAL AUTH HEADER ─────────────────────────────── */}
      <header
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #EBEBEB",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 20px",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 select-none"
            aria-label="CG39 — Go to homepage"
          >
            <img
              src={logo}
              alt="CG39"
              style={{ width: 30, height: 30, objectFit: "contain" }}
            />
            <div style={{ lineHeight: 1 }}>
              <span
                style={{
                  display: "block",
                  fontSize: 16,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "-0.5px",
                  color: "#111111",
                }}
              >
                CG<span style={{ color: "#FF0000" }}>39</span>
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: 8,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1.8px",
                  color: "#AAAAAA",
                  marginTop: 1,
                }}
              >
                GAME STORE
              </span>
            </div>
          </Link>

          {/* Back to Store */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#666666",
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: 8,
              transition: "color 150ms, background 150ms",
              minHeight: 36,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#FF0000";
              e.currentTarget.style.background = "#FFF5F5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#666666";
              e.currentTarget.style.background = "transparent";
            }}
            aria-label="Return to storefront"
          >
            <ArrowLeft weight="bold" style={{ width: 14, height: 14 }} />
            Back to Store
          </Link>
        </div>
      </header>

      {/* ── MAIN CONTENT AREA ───────────────────────────────── */}
      <main
        className="flex-1 flex flex-col items-center justify-center"
        style={{ padding: "32px 16px 24px" }}
      >
        {/* Subtle red glow blob behind the card */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 560,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(255,0,0,0.045) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* CG39 branding above card */}
        <div
          className="flex flex-col items-center select-none"
          style={{ marginBottom: 24, position: "relative", zIndex: 1 }}
        >
          <Link
            to="/"
            className="flex items-center gap-2.5"
            aria-label="CG39 homepage"
          >
            <img
              src={logo}
              alt="CG39"
              style={{ width: 38, height: 38, objectFit: "contain" }}
            />
            <div style={{ lineHeight: 1 }}>
              <span
                style={{
                  display: "block",
                  fontSize: 22,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "-0.5px",
                  color: "#111111",
                }}
              >
                CG<span style={{ color: "#FF0000" }}>39</span>
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: 8,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: "#BBBBBB",
                  marginTop: 2,
                }}
              >
                GAME STORE
              </span>
            </div>
          </Link>
        </div>

        {/* Page content (the card) */}
        <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {children}
        </div>

        {/* ── TRUST MICRO-ROW ─────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            marginTop: 24,
            flexWrap: "wrap",
            position: "relative",
            zIndex: 1,
          }}
        >
          {[
            { icon: ShieldCheck, label: "Secure Checkout" },
            { icon: CreditCard, label: "UPI Payment" },
            { icon: Headset, label: "Customer Support" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: "#AAAAAA",
              }}
            >
              <Icon weight="bold" style={{ width: 13, height: 13 }} />
              {label}
            </div>
          ))}
        </div>
      </main>

      {/* ── MINIMAL AUTH FOOTER ─────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid #EBEBEB",
          background: "#FFFFFF",
          padding: "14px 20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#BBBBBB",
            }}
          >
            © 2026 CG39. ALL RIGHTS RESERVED.
          </span>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: "Terms", to: "/terms" },
              { label: "Privacy", to: "/privacy" },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#AAAAAA",
                  textDecoration: "none",
                  transition: "color 150ms",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FF0000")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#AAAAAA")}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
