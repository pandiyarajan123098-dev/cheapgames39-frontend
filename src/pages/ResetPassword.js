import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import {
  Eye,
  EyeSlash as EyeOff,
  LockSimple,
  LockSimpleOpen,
  Warning as AlertCircle,
  ArrowLeft,
} from "@phosphor-icons/react";
import AuthLayout from "../components/AuthLayout";

const inputCls =
  "w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl pl-11 pr-12 text-sm text-[#111111] placeholder-[#BBBBBB] focus:outline-none focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/10 transition";

export default function ResetPassword() {
  const [password, setPassword]           = useState("");
  const [confirmPassword, setConfirm]     = useState("");
  const [showPassword, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const { error: supaErr } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (supaErr) {
      setError(supaErr.message || "Unable to update password. Please try again.");
      toast.error(supaErr.message);
    } else {
      toast.success("Password updated successfully!");
      navigate("/login");
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
            New Password
          </h1>
          <p style={{ fontSize: 12, color: "#888888", marginTop: 6, lineHeight: 1.6 }}>
            Create a strong new password for your CG39 account.
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

        <form onSubmit={handleUpdate} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* New Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              htmlFor="reset-new-password"
              style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#888888" }}
            >
              New Password
            </label>
            <div style={{ position: "relative" }}>
              <LockSimple
                weight="bold"
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#AAAAAA", pointerEvents: "none" }}
              />
              <input
                id="reset-new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 characters"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  color: "#AAAAAA", padding: 6,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  minWidth: 32, minHeight: 32,
                }}
              >
                {showPassword
                  ? <EyeOff weight="bold" style={{ width: 16, height: 16 }} />
                  : <Eye weight="bold" style={{ width: 16, height: 16 }} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              htmlFor="reset-confirm-password"
              style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#888888" }}
            >
              Confirm Password
            </label>
            <div style={{ position: "relative" }}>
              <LockSimpleOpen
                weight="bold"
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#AAAAAA", pointerEvents: "none" }}
              />
              <input
                id="reset-confirm-password"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirm(e.target.value)}
                style={{ height: 52, paddingLeft: 42, paddingRight: 48 }}
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "#AAAAAA", padding: 6,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  minWidth: 32, minHeight: 32,
                }}
              >
                {showConfirm
                  ? <EyeOff weight="bold" style={{ width: 16, height: 16 }} />
                  : <Eye weight="bold" style={{ width: 16, height: 16 }} />}
              </button>
            </div>
          </div>

          {/* Update button */}
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
                Updating…
              </>
            ) : (
              "Update Password"
            )}
          </button>

        </form>
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