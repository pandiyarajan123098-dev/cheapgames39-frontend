import React from "react";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { Link } from "react-router-dom";

const Giveaway = () => {
  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] pt-32 pb-24 px-6 flex items-center justify-center relative overflow-hidden">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 text-center max-w-2xl"
      >
        <Gift className="w-20 h-20 text-[#E10600] mx-auto mb-8" />

        <h1 className="text-4xl md:text-5xl font-black uppercase mb-6 tracking-tight text-[#1A1A1A]">
          Giveaway <span className="text-[#E10600]">Coming Soon</span>
        </h1>

        <p className="text-base text-[#555555] leading-relaxed mb-10">
          We’re preparing something massive for our gamers.  
          Exclusive rewards, premium PC titles, and exciting surprises  
          are on the way.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <Link to="/games">
            <button className="bg-[#E10600] hover:bg-[#ff1a13] text-white px-10 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition active:scale-[0.98]">
              Browse Games
            </button>
          </Link>

          <Link to="/">
            <button className="bg-white hover:bg-[#F5F5F5] border border-[#E5E5E5] hover:border-[#D4D4D4] text-[#1A1A1A] px-10 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition active:scale-[0.98]">
              Back to Home
            </button>
          </Link>

        </div>
      </motion.div>
    </div>
  );
};

export default Giveaway;