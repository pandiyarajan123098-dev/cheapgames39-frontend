import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, ArrowRight, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import logo from "../logo.png";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(formData.email, formData.password, formData.full_name);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      setError("Unable to create account. Please check your details and try again.");
      toast.error(err.message || "Signup failed");
      setLoading(false);
    }
  };

  // Password strength (visual only — does not affect submission)
  const getStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    return Math.min(score, 3);
  };
  const strength = getStrength(formData.password);
  const strengthLabels = ["", "Weak", "Fair", "Strong"];
  const strengthColors = ["", "bg-red-500", "bg-amber-500", "bg-emerald-500"];
  const strengthTextColors = ["", "text-red-400", "text-amber-400", "text-emerald-400"];

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
            <h1 className="text-2xl font-black uppercase tracking-tight text-[#111111]">Create Your Account</h1>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Create an account to manage purchases, wishlist and orders.</p>
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

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-name" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                <input
                  id="signup-name"
                  type="text"
                  name="full_name"
                  required
                  autoComplete="name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full h-12 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl pl-10 pr-4 text-sm text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]/20 transition"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-email" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full h-12 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl pl-10 pr-4 text-sm text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]/20 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-password" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
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

              {/* Password requirements */}
              <p className="text-[10px] text-zinc-600 mt-0.5">Minimum 6 characters</p>

              {/* Strength indicator */}
              {formData.password.length > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map((lvl) => (
                      <div
                        key={lvl}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          strength >= lvl ? strengthColors[strength] : "bg-[#E5E5E5]"
                        }`}
                      />
                    ))}
                  </div>
                  {strength > 0 && (
                    <span className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${strengthTextColors[strength]}`}>
                      {strengthLabels[strength]}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#E00000] hover:bg-[#F00000] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider text-sm rounded-xl transition active:scale-[0.98] flex items-center justify-center gap-2 min-h-[48px] mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 shrink-0" />
                  Create Account
                </span>
              )}
            </button>

          </form>
        </div>

        {/* Account switch */}
        <p className="text-center text-xs text-zinc-500 mt-6 select-none">
          Already have an account?{" "}
          <Link to="/login" className="text-[#E00000] hover:text-[#F00000] font-bold transition">
            Sign in <ArrowRight className="inline w-3 h-3 mb-0.5" />
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;