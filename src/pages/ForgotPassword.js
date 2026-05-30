import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

export default function ForgotPassword() {
const [email, setEmail] = useState("");
const [loading, setLoading] = useState(false);

const handleReset = async (e) => {
e.preventDefault();
setLoading(true);

const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: "https://https://www.cheapgames39store.shop/reset-password",
});

if (error) {
  toast.error(error.message);
} else {
  toast.success("Password reset link sent to your email!");
}

setLoading(false);

};

return (
<div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6">
<div className="w-full max-w-md">

    <div className="text-center mb-8">
      <h1 className="text-5xl font-bold text-white">
        CHEAP<span className="text-[#B50000]">GAMES39</span>
      </h1>
      <p className="text-gray-400 mt-2">Account Recovery</p>
    </div>

    <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8">

      <h2 className="text-3xl font-bold text-white mb-2">
         Forgot Password
      </h2>

      <p className="text-gray-400 mb-6">
        Enter your email and we'll send a password reset link.
      </p>

      <form onSubmit={handleReset} className="space-y-4">

        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#B50000] hover:bg-red-600 text-white py-3 rounded-full font-bold"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className="text-center mt-6">
        <Link
          to="/login"
          className="text-gray-400 hover:text-[#B50000] transition duration-300"

        >
          ← Back to Login
        </Link>
      </div>

    </div>
  </div>
</div>

);
}