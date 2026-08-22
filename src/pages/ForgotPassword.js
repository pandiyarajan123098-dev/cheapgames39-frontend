import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import {
  Envelope as EnvelopeSimple,
  ArrowLeft,
  Warning as AlertCircle,
  CheckCircle,
} from "@phosphor-icons/react";
import AuthLayout from "../components/AuthLayout";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

const inputCls =
  "w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl pl-11 pr-4 text-sm text-[#111111] placeholder-[#BBBBBB] focus:outline-none focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/10 transition";

const recaptchaSiteKey =
  process.env.REACT_APP_RECAPTCHA_SITE_KEY ||
  "6LeIxAcTAAAAAJcZVRqyCQupg8m73n3VB13sg8g3";

const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`;

export default function ForgotPassword() {
  const [email, setEmail]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [sent, setSent]           = useState(false);
  const [error, setError]         = useState("");
  const [captchaToken, setCaptcha] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!captchaToken) {
      toast.error("Please complete the verification check.");
      return;
    }

    setLoading(true);
    try {
      // Server-side reCAPTCHA token verification
      const verifyRes = await axios.post(`${API}/verify-captcha`, { token: captchaToken });
      if (!verifyRes.data.success) {
        throw new Error("Captcha verification failed. Please try again.");
      }

      const { error: supaErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (supaErr) {
        setError("Unable to send reset link. Please try again.");
        toast.error("Unable to send reset link. Please try again.");
      } else {
        setSent(true);
        toast.success("Password reset link sent. Check your email.");
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || "Captcha check failed.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Auth card */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E7E7E7",
          borderRadius: 20,
          boxShadow: "0 10px 35px rgba(0,0,0,0.06)",
          padding: "36px 36px 32px",
          width: "100%",
          maxWidth: 460,
        }}
        className="sm:px-10 px-6"
      >
        {!sent ? (
          <>
            {/* Heading */}
            <div style={{ marginBottom: 24 }}>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "-0.3px",
                  color: "#111111",
                  margin: 0,
                }}
              >
                Reset Password
              </h1>
              <p style={{ fontSize: 12, color: "#888888", marginTop: 6, lineHeight: 1.6 }}>
                Enter your account email and we'll send a password reset link.
              </p>
            </div>

            {/* Inline error */}
            {error && (
              <div
                role="alert"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  background: "#FFF1F1",
                  border: "1px solid #FFCCCC",
                  borderRadius: 10,
                  padding: "10px 14px",
                  marginBottom: 20,
                  fontSize: 12,
                  color: "#CC0000",
                  fontWeight: 600,
                }}
              >
                <AlertCircle weight="bold" style={{ width: 15, height: 15, marginTop: 1, flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleReset} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label
                  htmlFor="reset-email"
                  style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#888888" }}
                >
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <EnvelopeSimple
                    weight="bold"
                    style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#AAAAAA", pointerEvents: "none" }}
                  />
                  <input
                    id="reset-email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ height: 52, paddingLeft: 42, paddingRight: 16 }}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* reCAPTCHA */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <ReCAPTCHA
                  sitekey={recaptchaSiteKey}
                  onChange={(token) => setCaptcha(token)}
                  theme="light"
                />
              </div>

              {/* Send button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  height: 52,
                  background: loading ? "#CC0000" : "#FF0000",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  opacity: loading ? 0.8 : 1,
                  transition: "background 150ms",
                  width: "100%",
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#CC0000"; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#FF0000"; }}
              >
                {loading ? (
                  <>
                    <span
                      style={{
                        width: 16, height: 16,
                        border: "2.5px solid rgba(255,255,255,0.35)",
                        borderTopColor: "#FFFFFF",
                        borderRadius: "50%",
                        animation: "cg39-auth-spin 0.7s linear infinite",
                        flexShrink: 0,
                      }}
                    />
                    Sending…
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </>
        ) : (
          /* ── Sent state ── */
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "8px 0" }}>
            <div
              style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <CheckCircle weight="fill" style={{ width: 28, height: 28, color: "#10B981" }} />
            </div>
            <div>
              <h2
                style={{
                  fontSize: 20, fontWeight: 900, textTransform: "uppercase",
                  letterSpacing: "-0.3px", color: "#111111", margin: 0,
                }}
              >
                Check Your Email
              </h2>
              <p style={{ fontSize: 12, color: "#888888", marginTop: 8, lineHeight: 1.7 }}>
                A password reset link has been sent to{" "}
                <strong style={{ color: "#333333" }}>{email}</strong>.{" "}
                Check your inbox and follow the instructions.
              </p>
              <p style={{ fontSize: 10, color: "#AAAAAA", marginTop: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Didn't receive it? Check your spam folder.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Back to Sign In */}
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <Link
          to="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#888888",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#111111")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#888888")}
        >
          <ArrowLeft weight="bold" style={{ width: 13, height: 13, color: "#FF0000" }} />
          Back to Sign In
        </Link>
      </div>

      <style>{`
        @keyframes cg39-auth-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </AuthLayout>
  );
}
