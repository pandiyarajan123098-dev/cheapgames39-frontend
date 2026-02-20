import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6">

      {/* Outer spacing below header */}
      <div className="pt-32 pb-20 flex justify-center">

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >

          <div className="bg-gradient-to-b from-[#1a1a1a] to-[#111111] border border-white/10 rounded-3xl p-8 shadow-2xl">

            {/* Title */}
            <div className="text-center mb-8">
              <h1
                className="text-4xl font-bold tracking-tight uppercase"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                <span className="text-[#B50000]">Login</span>
              </h1>
              <p className="text-gray-400 mt-2 text-sm">
                Welcome back to CheapGames39
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:border-[#B50000] focus:ring-1 focus:ring-[#B50000] outline-none transition-all duration-300"
                  placeholder="your@email.com"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-sm text-gray-400 mb-2">
                  Password
                </label>

                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-gray-600 focus:border-[#B50000] focus:ring-1 focus:ring-[#B50000] outline-none transition-all duration-300"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[44px] text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#B50000] hover:bg-[#FF0000] disabled:opacity-50 text-white rounded-full py-3 font-semibold text-lg tracking-wide transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,0,0,0.6)]"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-gray-400 mt-6 text-sm">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-[#B50000] hover:text-[#FF0000] font-semibold transition"
              >
                Sign Up
              </Link>
            </p>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;