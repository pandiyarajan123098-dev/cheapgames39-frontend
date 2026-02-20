import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { toast } from "sonner";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signup(formData.email, formData.password, formData.full_name);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Signup failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-[#0f0f0f] flex items-center justify-center px-6 pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-gradient-to-b from-[#1a1a1a] to-[#111111] border border-white/10 rounded-3xl p-8 shadow-2xl">

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold uppercase tracking-wide text-[#B50000]">
              Sign Up
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Create your CheapGames39 account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Full Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:border-[#B50000] focus:ring-1 focus:ring-[#B50000] outline-none transition-all duration-300"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:border-[#B50000] focus:ring-1 focus:ring-[#B50000] outline-none transition-all duration-300"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:border-[#B50000] focus:ring-1 focus:ring-[#B50000] outline-none transition-all duration-300"
                placeholder="••••••••"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#B50000] hover:bg-[#FF0000] disabled:opacity-50 text-white rounded-full py-3 font-semibold text-lg tracking-wide transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,0,0,0.5)]"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

          </form>

          {/* Footer */}
          <p className="text-center text-gray-400 mt-6 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#B50000] hover:text-[#FF0000] font-semibold transition"
            >
              Login
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
};

export default Signup;