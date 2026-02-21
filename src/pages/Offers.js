import React from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Sparkles,
  Trophy,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const Offers = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pt-28 pb-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* ================= HERO ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight mb-6">
            Special <span className="text-[#B50000]">Offers</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Discover unbeatable deals, limited-time discounts, and exclusive
            gaming rewards designed for true players.
          </p>
        </motion.div>

        {/* ================= MEGA SALE ================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden mb-20 group"
        >
          <img
            src="https://images.unsplash.com/photo-1636036704268-017faa3b6557?w=1920"
            alt="Mega Sale"
            className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent flex items-center">
            <div className="px-10 md:px-20 max-w-xl">

              {/* UPDATED 98% OFF */}
              <span className="inline-block bg-[#B50000] text-sm px-4 py-1 rounded-full font-semibold mb-6 animate-pulse">
                Up to 98% OFF
              </span>

              <h2 className="text-5xl md:text-7xl font-bold uppercase mb-6 leading-tight">
                MEGA <span className="text-[#B50000]">SALE</span>
              </h2>

              <p className="text-gray-300 text-lg mb-8">
                Massive limited-time discounts on premium PC titles.
              </p>

              <Link to="/games">
                <button className="flex items-center gap-3 bg-[#B50000] hover:bg-red-700 px-10 py-4 rounded-full font-bold text-lg transition-all hover:shadow-[0_0_40px_rgba(255,0,0,0.6)]">
                  Shop Now
                  <ArrowRight size={20} />
                </button>
              </Link>

            </div>
          </div>
        </motion.div>

        {/* ================= OFFER CARDS ================= */}
        <div className="grid md:grid-cols-3 gap-10 mb-20">

          {/* Giveaway */}
          <motion.div
            whileHover={{ y: -8 }}
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 hover:border-[#B50000] transition-all"
          >
            <Gift className="w-12 h-12 text-[#B50000] mb-6" />
            <h3 className="text-2xl font-bold mb-4">Weekend Giveaway</h3>
            <p className="text-gray-400 mb-6">
              Win free games every weekend. Participate and grab exclusive rewards.
            </p>

            <Link to="/giveaway">
              <button className="text-[#B50000] font-semibold hover:text-red-500 transition">
                Learn More →
              </button>
            </Link>
          </motion.div>

          {/* First Purchase */}
          <motion.div
            whileHover={{ y: -8 }}
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 hover:border-[#B50000] transition-all"
          >
            <Sparkles className="w-12 h-12 text-[#B50000] mb-6" />
            <h3 className="text-2xl font-bold mb-4">First Purchase Bonus</h3>
            <p className="text-gray-400 mb-6">
              Get 15% OFF your first order. Use code{" "}
              <span className="text-[#B50000] font-semibold">WELCOME15</span>.
            </p>

            <Link to="/games">
              <button className="text-[#B50000] font-semibold hover:text-red-500 transition">
                Get Started →
              </button>
            </Link>
          </motion.div>

          {/* Loyalty */}
          <motion.div
            whileHover={{ y: -8 }}
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 hover:border-[#B50000] transition-all"
          >
            <Trophy className="w-12 h-12 text-[#B50000] mb-6" />
            <h3 className="text-2xl font-bold mb-4">Loyalty Rewards</h3>
            <p className="text-gray-400 mb-6">
              Earn points with every purchase and redeem discounts later.
            </p>

            <Link to="/cart">
              <button className="text-[#B50000] font-semibold hover:text-red-500 transition">
                View Cart →
              </button>
            </Link>
          </motion.div>

        </div>

        {/* ================= FLASH DEALS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#151515] border border-[#B50000]/30 rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#B50000]/20 blur-3xl rounded-full"></div>

          <Clock className="w-14 h-14 text-[#B50000] mx-auto mb-6" />

          <h2 className="text-4xl font-bold uppercase mb-6">
            Daily Flash Deals
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            New insane offers every 24 hours. Don't miss it.
          </p>

          <Link to="/games">
            <button className="bg-[#B50000] hover:bg-red-700 px-12 py-4 rounded-full font-bold text-lg transition-all hover:shadow-[0_0_30px_rgba(255,0,0,0.6)]">
              View All Deals
            </button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default Offers;