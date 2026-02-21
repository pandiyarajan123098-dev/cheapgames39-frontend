import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Shield,
  Sparkles,
  PlayCircle,
} from "lucide-react";

const Home = () => {
  return (
    <div className="bg-black text-white overflow-x-hidden">

      {/* =====================================================
         HERO SECTION
      ===================================================== */}
      <section className="relative min-h-screen flex items-center justify-center px-6">

        {/* Background */}
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920"
          alt="Gaming Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/80"></div>

        {/* Glass Box Content */}
        <div className="relative z-10 w-full max-w-4xl backdrop-blur-xl bg-white/5 border border-white/20 rounded-3xl p-10 md:p-16 text-center shadow-2xl">

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold uppercase mb-6 leading-tight"
          >
            LEVEL UP YOUR{" "}
            <span className="text-[#B50000]">GAME</span>
          </motion.h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Get the best PC games at unbeatable prices.
            Instant delivery. Secure payments.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <Link to="/games">
              <button className="bg-[#B50000] hover:bg-red-700 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 flex items-center justify-center shadow-lg">
                Browse Games
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </Link>

            <Link to="/contact">
              <button className="border border-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-black transition-all">
                Contact Us
              </button>
            </Link>

          </div>
        </div>
      </section>

      {/* =====================================================
         HOW IT WORKS
      ===================================================== */}
      <section className="py-28 px-6 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-10 uppercase">
              How It <span className="text-[#B50000]">Works</span>
            </h2>

            <div className="space-y-6 text-gray-300 text-lg">

              <div className="flex items-start gap-4">
                <PlayCircle className="text-[#B50000] mt-1" />
                <p>Browse and select your favorite game</p>
              </div>

              <div className="flex items-start gap-4">
                <PlayCircle className="text-[#B50000] mt-1" />
                <p>Add to cart and proceed to checkout</p>
              </div>

              <div className="flex items-start gap-4">
                <PlayCircle className="text-[#B50000] mt-1" />
                <p>Complete secure UPI payment</p>
              </div>

              <div className="flex items-start gap-4">
                <PlayCircle className="text-[#B50000] mt-1" />
                <p>Receive instant delivery via WhatsApp</p>
              </div>

            </div>

            <Link to="/games">
              <button className="mt-10 bg-[#B50000] px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition-all hover:scale-105">
                Start Shopping
              </button>
            </Link>
          </motion.div>

          {/* RIGHT VIDEO */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
              title="How to use CheapGames39"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>

        </div>
      </section>

      {/* =====================================================
         FEATURES
      ===================================================== */}
      <section className="py-28 px-6 bg-black">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold uppercase">
              Why Choose <span className="text-[#B50000]">Us</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">

            <div className="bg-[#111] border border-white/10 rounded-2xl p-10 text-center hover:border-[#B50000] transition-all duration-300 hover:scale-105">
              <Zap className="mx-auto text-[#B50000] mb-6 w-10 h-10" />
              <h3 className="text-xl font-semibold mb-4">Instant Delivery</h3>
              <p className="text-gray-400">
                Get your game immediately after payment confirmation.
              </p>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-10 text-center hover:border-[#B50000] transition-all duration-300 hover:scale-105">
              <Shield className="mx-auto text-[#B50000] mb-6 w-10 h-10" />
              <h3 className="text-xl font-semibold mb-4">Secure Payment</h3>
              <p className="text-gray-400">
                Safe, encrypted and reliable transaction system.
              </p>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-10 text-center hover:border-[#B50000] transition-all duration-300 hover:scale-105">
              <Sparkles className="mx-auto text-[#B50000] mb-6 w-10 h-10" />
              <h3 className="text-xl font-semibold mb-4">Best Prices</h3>
              <p className="text-gray-400">
                Premium PC titles at unbeatable affordable prices.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;