import React, { useState } from "react";
import {
  Eye,
  EyeSlash as EyeOff,
  Envelope as EnvelopeSimple,
  LockSimple,
  User,
  UserPlus,
  Warning as AlertCircle,
} from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import AuthLayout from "../components/AuthLayout";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

const recaptchaSiteKey =
  process.env.REACT_APP_RECAPTCHA_SITE_KEY ||
  "6LeIxAcTAAAAAJcZVRqyCQupg8m73n3VB13sg8g3";

const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`;

/* ── Shared input style ─────────────────────────────────────────────── */
const inputCls =
  "w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl pl-11 pr-4 text-sm text-[#111111] placeholder-[#BBBBBB] focus:outline-none focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/10 transition";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ full_name: "", email: "", password: "" });
  const [loading, setLoading]   = useState(false);
  const [showPassword, setShowPass] = useState(false);
  const [captchaToken, setCaptcha]  = useState(null);
  const [error, setError]       = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.full_name || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
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

      await signup(formData.email, formData.password, formData.full_name);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || "Signup failed";
      setError("Unable to create account. Please check your details and try again.");
      toast.error(errMsg);
      setLoading(false);
    }
  };

  /* ── Password strength (visual only) ─────────────────────── */
  const getStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 6)  score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    return Math.min(score, 3);
  };
  const strength = getStrength(formData.password);
  const strengthColors     = ["", "#EF4444", "#F59E0B", "#10B981"];
  const strengthTextColors = ["", "#EF4444", "#F59E0B", "#10B981"];
  const strengthLabels     = ["", "Weak", "Fair", "Strong"];

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
            Create Your Account
          </h1>
          <p style={{ fontSize: 12, color: "#888888", marginTop: 6, lineHeight: 1.6 }}>
            Join CG39 and start discovering great games at better prices.
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

          {/* Full Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              htmlFor="signup-name"
              style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#888888" }}
            >
              Full Name
            </label>
            <div style={{ position: "relative" }}>
              <User
                weight="bold"
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#AAAAAA", pointerEvents: "none" }}
              />
              <input
                id="signup-name"
                type="text"
                name="full_name"
                required
                autoComplete="name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Your full name"
                style={{ height: 52, paddingLeft: 42, paddingRight: 16 }}
                className={inputCls}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              htmlFor="signup-email"
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
                id="signup-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                style={{ height: 52, paddingLeft: 42, paddingRight: 16 }}
                className={inputCls}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              htmlFor="signup-password"
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
                id="signup-password"
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
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

            {/* Password strength */}
            {formData.password.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <div style={{ display: "flex", gap: 4, flex: 1 }}>
                  {[1, 2, 3].map((lvl) => (
                    <div
                      key={lvl}
                      style={{
                        height: 3,
                        flex: 1,
                        borderRadius: 99,
                        background: strength >= lvl ? strengthColors[strength] : "#EEEEEE",
                        transition: "background 300ms",
                      }}
                    />
                  ))}
                </div>
                {strength > 0 && (
                  <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: strengthTextColors[strength], flexShrink: 0 }}>
                    {strengthLabels[strength]}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* reCAPTCHA */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, marginTop: 4 }}>
            <ReCAPTCHA
              sitekey={recaptchaSiteKey}
              onChange={(token) => setCaptcha(token)}
              theme="light"
            />
          </div>

          {/* Create Account button */}
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
              marginTop: 4,
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
                Creating Account…
              </>
            ) : (
              <>
                <UserPlus weight="bold" style={{ width: 16, height: 16 }} />
                Create Account
              </>
            )}
          </button>

        </form>
      </div>

      {/* Below-card link */}
      <p style={{ fontSize: 12, color: "#888888", marginTop: 20, textAlign: "center" }}>
        Already have an account?{" "}
        <Link
          to="/login"
          style={{ color: "#FF0000", fontWeight: 800, textDecoration: "none", textTransform: "uppercase", fontSize: 11, letterSpacing: "0.06em" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#CC0000")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#FF0000")}
        >
          Sign In
        </Link>
      </p>

      <style>{`
        @keyframes cg39-auth-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </AuthLayout>
  );
};

export default Signup;