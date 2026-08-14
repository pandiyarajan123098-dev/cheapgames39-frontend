import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { Envelope as Mail, ArrowLeft, Warning as AlertCircle, CheckCircle } from "@phosphor-icons/react";
import logo from "../logo.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error("Unable to send reset link. Please try again.");
    } else {
      setSent(true);
      toast.success("Password reset link sent. Check your email.");
    }

    setLoading(false);
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

          {!sent ? (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-black uppercase tracking-tight text-[#111111]">Reset Password</h1>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Enter your account email and we'll send a password reset link.
                </p>
              </div>

              <form onSubmit={handleReset} className="space-y-5" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reset-email" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                    <input
                      id="reset-email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl pl-10 pr-4 text-sm text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]/20 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[#E00000] hover:bg-[#F00000] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider text-sm rounded-xl transition active:scale-[0.98] flex items-center justify-center gap-2 min-h-[48px]"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Sent state */
            <div className="text-center flex flex-col items-center gap-4 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-[#111111] mb-1">Check Your Email</h2>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
                  A password reset link has been sent to <span className="text-zinc-300 font-bold">{email}</span>. Check your inbox and follow the instructions.
                </p>
              </div>
              <p className="text-[10px] text-zinc-600 select-none">
                Didn't receive it? Check your spam folder.
              </p>
            </div>
          )}
        </div>

        {/* Back to login */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#555555] hover:text-[#111111] uppercase tracking-wider transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#E00000]" />
            Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}