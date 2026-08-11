import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);

const navigate = useNavigate();

const handleUpdate = async (e) => {
e.preventDefault();

if (password !== confirmPassword) {
  toast.error("Passwords do not match");
  return;
}

if (password.length < 6) {
  toast.error("Password must be at least 6 characters");
  return;
}

const { error } = await supabase.auth.updateUser({
  password,
});

if (error) {
  toast.error(error.message);
} else {
  toast.success("Password updated successfully!");
  navigate("/login");
}

};

return (
<div className="min-h-screen bg-white text-[#111111] flex items-center justify-center px-6">
<div className="w-full max-w-md">

    <div className="text-center mb-8">
      <h1 className="text-5xl font-bold text-[#111111]">
        CHEAP<span className="text-[#E00000]">GAMES39</span>
      </h1>
      <p className="text-[#555555] mt-2">
        Secure Password Reset
      </p>
    </div>

    <div className="bg-white border border-[#E5E5E5] rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">

      <h2 className="text-3xl font-bold text-[#111111] mb-2">
         Reset Password
      </h2>

      <p className="text-[#555555] mb-6">
        Create a new password for your account.
      </p>

      <form onSubmit={handleUpdate} className="space-y-4">

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#E00000]"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3 text-[#777777]"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <input
          type="password"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#E00000]"
        />

        <button
          type="submit"
          className="w-full bg-[#E00000] hover:bg-[#F00000] text-white py-3 rounded-full font-bold transition active:scale-[0.98]"
        >
          Update Password
        </button>
      </form>

    </div>
  </div>
</div>
);
}