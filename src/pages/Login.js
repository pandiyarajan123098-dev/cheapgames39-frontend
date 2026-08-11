import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import {
  Eye, EyeOff, Mail, Lock, LogIn, ArrowRight, AlertCircle
} from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";
import logo from "../logo.png";

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const recaptchaSiteKey = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "6LeIxAcTAAAAAJcZVRqyCQupg8m73n3VB13sg8g3"
    : "6Ld0dAUtAAAAALg-0PUO7PVo_e0gC3Tx7T9YUY73";

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!captchaToken) {
      toast.error("Please complete the verification check.");
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success("Welcome back!");
      setTimeout(() => { navigate("/"); }, 800);
    } catch (err) {
      setError("Unable to sign in. Please check your details and try again.");
      toast.error(err.message || "Invalid email or password");
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

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans flex flex-col items-center justify-center px-4 sm:px-6 py-20">
      <div className="w-full max-w-[440px] animate-page-section">

        {/* Brand */}
        <div className="flex flex-col items-center mb-8 select-none">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="CG39" className="w-9 h-9 object-contain" />
            <div className="leading-none">
              <span className="text-xl font-black uppercase tracking-tight">
                CG<span className="text-[#E00000]">39</span>
              </span>
              <span className="block text-[8px] text-zinc-500 font-bold uppercase tracking-[1.5px] mt-0.5">GAME STORE</span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl font-black uppercase tracking-tight text-[#111111]">Welcome Back</h1>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Sign in to continue shopping and manage your orders.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-500/8 border border-red-500/15 rounded-xl px-4 py-3 mb-5 text-xs text-red-400 font-semibold" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoComplete="email"
                  placeholder="your@email.com"
                  className="w-full h-12 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl pl-10 pr-4 text-sm text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]/20 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full h-12 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl pl-10 pr-12 text-sm text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-600 hover:text-zinc-300 transition min-w-[32px] min-h-[32px] flex items-center justify-center"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end -mt-2">
              <Link to="/forgot-password" className="text-[11px] font-bold text-zinc-500 hover:text-[#E00000] transition uppercase tracking-wider">
                Forgot password?
              </Link>
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center pt-1">
              <ReCAPTCHA
                sitekey={recaptchaSiteKey}
                onChange={(token) => setCaptchaToken(token)}
                theme="light"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#E00000] hover:bg-[#F00000] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider text-sm rounded-xl transition active:scale-[0.98] flex items-center justify-center gap-2 min-h-[48px]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4 shrink-0" />
                  Sign In
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 select-none">
              <div className="flex-1 h-px bg-[#E5E5E5]" />
              <span className="text-[10px] text-[#AAAAAA] font-bold uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-[#E5E5E5]" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-12 bg-white hover:bg-zinc-100 text-zinc-900 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition active:scale-[0.98] min-h-[48px]"
            >
              <img
                loading="lazy"
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

          </form>
        </div>

        {/* Account switch */}
        <p className="text-center text-xs text-zinc-500 mt-6 select-none">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#E00000] hover:text-[#F00000] font-bold transition">
            Create one <ArrowRight className="inline w-3 h-3 mb-0.5" />
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;