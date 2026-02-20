import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Sparkles } from "lucide-react";

/* =====================================================
   HOME COMPONENT
===================================================== */

const Home = () => {
  /* =====================================================
     STATE
  ===================================================== */

  const [countdown, setCountdown] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  /* =====================================================
     COUNTDOWN LOGIC (LOOPING 24H TIMER)
  ===================================================== */

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds -= 1;
        } else {
          seconds = 59;

          if (minutes > 0) {
            minutes -= 1;
          } else {
            minutes = 59;

            if (hours > 0) {
              hours -= 1;
            } else {
              hours = 23; // restart cycle
            }
          }
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="min-h-screen bg-black text-white">

      {/* =====================================================
         HERO SECTION
      ===================================================== */}

      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">

        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920"
          alt="Gaming Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/75"></div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl backdrop-blur-md bg-black/40 border border-white/20 rounded-3xl p-10 md:p-16 text-center shadow-2xl">

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold uppercase mb-6"
          >
            LEVEL UP YOUR{" "}
            <span className="text-[#B50000]">GAME</span>
          </motion.h1>

          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
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

            <Link to="/offers">
              <button className="border border-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-black transition-all">
                View Offers
              </button>
            </Link>

          </div>
        </div>
      </section>

      {/* =====================================================
         FLASH SALE SECTION
      ===================================================== */}

      <section className="px-6 py-24 flex justify-center bg-black">
        <div className="w-full max-w-md border border-white/30 rounded-3xl p-8 text-center bg-[#111] shadow-lg">

          <h2 className="text-3xl md:text-4xl font-bold mb-8 uppercase">
            FLASH <span className="text-[#B50000]">SALE</span>
          </h2>

          <div className="flex justify-center gap-4 mb-8">
            {["hours", "minutes", "seconds"].map((unit) => (
              <div
                key={unit}
                className="bg-black rounded-xl p-5 w-20 border border-[#B50000]"
              >
                <div className="text-2xl font-bold text-[#B50000]">
                  {String(countdown[unit]).padStart(2, "0")}
                </div>
                <div className="text-xs text-gray-400 uppercase mt-1">
                  {unit}
                </div>
              </div>
            ))}
          </div>

          <Link to="/games">
            <button className="bg-[#B50000] px-10 py-3 rounded-full font-bold hover:bg-red-700 transition-all hover:scale-105">
              SHOP NOW
            </button>
          </Link>

        </div>
      </section>

      {/* =====================================================
         FEATURES SECTION
      ===================================================== */}

      <section className="px-6 pb-28 bg-black">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

          {/* Feature 1 */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 text-center hover:border-[#B50000] transition-all">
            <Zap className="mx-auto text-[#B50000] mb-4 w-8 h-8" />
            <h3 className="text-xl font-semibold mb-3">Instant Delivery</h3>
            <p className="text-gray-400 text-sm">
              Receive your game account immediately after purchase.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 text-center hover:border-[#B50000] transition-all">
            <Shield className="mx-auto text-[#B50000] mb-4 w-8 h-8" />
            <h3 className="text-xl font-semibold mb-3">Secure Payment</h3>
            <p className="text-gray-400 text-sm">
              Fully encrypted & protected transactions.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 text-center hover:border-[#B50000] transition-all">
            <Sparkles className="mx-auto text-[#B50000] mb-4 w-8 h-8" />
            <h3 className="text-xl font-semibold mb-3">Best Prices</h3>
            <p className="text-gray-400 text-sm">
              Unbeatable deals on top PC titles.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;