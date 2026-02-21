import React from "react";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { Link } from "react-router-dom";

const Giveaway = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pt-32 pb-24 px-6 flex items-center justify-center relative overflow-hidden">

      {/* Red Glow Background */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#B50000]/20 blur-[150px] rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-3xl"
      >
        <Gift className="w-24 h-24 text-[#B50000] mx-auto mb-10" />

        <h1 className="text-5xl md:text-7xl font-bold uppercase mb-8 tracking-tight">
          Giveaway <span className="text-[#B50000]">Coming Soon</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-14">
          We’re preparing something massive for our gamers.  
          Exclusive rewards, premium PC titles, and exciting surprises  
          are on the way.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">

          <Link to="/games">
            <button className="bg-[#B50000] hover:bg-red-700 px-12 py-4 rounded-full font-bold text-lg transition-all hover:shadow-[0_0_40px_rgba(255,0,0,0.6)]">
              Browse Games
            </button>
          </Link>

          <Link to="/">
            <button className="border border-white/30 px-12 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all">
              Back to Home
            </button>
          </Link>

        </div>
      </motion.div>
    </div>
  );
};

export default Giveaway;