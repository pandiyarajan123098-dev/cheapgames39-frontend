import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import {
  Eye,
  EyeSlash as EyeOff,
  Envelope as EnvelopeSimple,
  LockSimple,
  SignIn as LogIn,
  Warning as AlertCircle,
} from "@phosphor-icons/react";
import ReCAPTCHA from "react-google-recaptcha";
import AuthLayout from '../components/AuthLayout';
import axios from 'axios';

/* ── reCAPTCHA key ────────────────────────────────────────────────────
   Uses environment variable if configured, otherwise falls back to
   Google's official universal v2 test key (always passes).
──────────────────────────────────────────────────────────────────────── */
const recaptchaSiteKey =
  process.env.REACT_APP_RECAPTCHA_SITE_KEY ||
  "6LeIxAcTAAAAAJcZVRqyCQupg8m73n3VB13sg8g3";

const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`;

/* ── Shared input style ─────────────────────────────────────────────── */
const inputCls =
  "w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl pl-11 pr-4 text-sm text-[#111111] placeholder-[#BBBBBB] focus:outline-none focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/10 transition";

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData]     = useState({ email: '', password: '' });
  const [loading, setLoading]       = useState(false);
  const [showPassword, setShowPass] = useState(false);
  const [captchaToken, setCaptcha]  = useState(null);
  const [error, setError]           = useState('');

  /* ── Handlers ─────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

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

      await login(formData.email, formData.password);
      toast.success("Welcome back!");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || "Invalid email or password";
      setError("Unable to sign in. Please check your details and try again.");
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      toast.error(err.message || "Google sign-in failed");
    }
  };

  /* ── Render ───────────────────────────────────────────────── */
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
            Welcome Back
          </h1>
          <p style={{ fontSize: 12, color: "#888888", marginTop: 6, lineHeight: 1.6 }}>
            Sign in to continue shopping and manage your orders.
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

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              htmlFor="login-email"
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
                id="login-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                autoComplete="email"
                placeholder="your@email.com"
                style={{ height: 52, paddingLeft: 42, paddingRight: 16 }}
                className={inputCls}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              htmlFor="login-password"
              style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#888888" }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <LockSimple
                weight="bold"
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#AAAAAA", pointerEvents: "none" }}
              />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                style={{ height: 52, paddingLeft: 42, paddingRight: 48 }}
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "#AAAAAA", padding: 6, display: "flex", alignItems: "center", justifyContent: "center",
                  minWidth: 32, minHeight: 32,
                }}
              >
                {showPassword
                  ? <EyeOff weight="bold" style={{ width: 16, height: 16 }} />
                  : <Eye weight="bold" style={{ width: 16, height: 16 }} />}
              </button>
            </div>
            {/* Forgot password — right aligned */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
              <Link
                to="/forgot-password"
                style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#999999", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FF0000")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#999999")}
              >
                Forgot password?
              </Link>
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

          {/* Sign in button */}
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
                    width: 16, height: 16, border: "2.5px solid rgba(255,255,255,0.35)",
                    borderTopColor: "#FFFFFF", borderRadius: "50%",
                    animation: "cg39-auth-spin 0.7s linear infinite", flexShrink: 0,
                  }}
                />
                Signing In…
              </>
            ) : (
              <>
                <LogIn weight="bold" style={{ width: 16, height: 16 }} />
                Sign In
              </>
            )}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: "#EEEEEE" }} />
            <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#CCCCCC" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "#EEEEEE" }} />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            style={{
              height: 52,
              background: "#FFFFFF",
              border: "1px solid #E5E5E5",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
              color: "#333333",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              transition: "background 150ms, border-color 150ms",
              width: "100%",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#F7F7F7"; e.currentTarget.style.borderColor = "#CCCCCC"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#FFFFFF"; e.currentTarget.style.borderColor = "#E5E5E5"; }}
          >
            <img
              loading="lazy"
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              style={{ width: 18, height: 18 }}
            />
            Continue with Google
          </button>

        </form>
      </div>

      {/* Below-card link */}
      <p style={{ fontSize: 12, color: "#888888", marginTop: 20, textAlign: "center" }}>
        Don't have an account?{" "}
        <Link
          to="/signup"
          style={{ color: "#FF0000", fontWeight: 800, textDecoration: "none", textTransform: "uppercase", fontSize: 11, letterSpacing: "0.06em" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#CC0000")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#FF0000")}
        >
          Create Account
        </Link>
      </p>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes cg39-auth-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </AuthLayout>
  );
};

export default Login;