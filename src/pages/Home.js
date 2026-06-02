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
import CategorySlider from "../components/CategorySlider";
import RecentlyViewed from "../components/RecentlyViewed";
import publicReviews from "../data/publicReviews";

const Home = () => {

  const row1Reviews = publicReviews.slice(0, 50);
const row2Reviews = publicReviews.slice(50);

  return (
    <div className="bg-black text-white overflow-x-hidden">

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-6">

        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920"
          alt="Gaming Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/80"></div>

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

<CategorySlider />

<RecentlyViewed />

      {/* HOW IT WORKS */}
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
    <p>Browse our collection and choose your favorite PC game.</p>
  </div>

  <div className="flex items-start gap-4">
    <PlayCircle className="text-[#B50000] mt-1" />
    <p>Add the game to your cart and complete your order securely.</p>
  </div>

  <div className="flex items-start gap-4">
    <PlayCircle className="text-[#B50000] mt-1" />
    <p>Make payment using UPI or your preferred payment method.</p>
  </div>

  <div className="flex items-start gap-4">
    <PlayCircle className="text-[#B50000] mt-1" />
    <p>Receive your game details and activation instructions after verification.</p>
  </div>

  <div className="flex items-start gap-4">
    <PlayCircle className="text-[#B50000] mt-1" />
    <p>Download the game through Steam and follow the provided setup guide.</p>
  </div>

  <div className="flex items-start gap-4">
    <PlayCircle className="text-[#B50000] mt-1" />
    <p>Start playing and contact support anytime if you need assistance.</p>
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

            <video
              className="w-full h-full object-cover"
              controls
              autoPlay
              muted
              loop
            >
              <source src="/videos/trailer1.mp4" type="video/mp4" />
            </video>

          </motion.div>

        </div>
      </section>


   {/* CUSTOMER REVIEWS */}
<section className="py-24 bg-black overflow-hidden">

  <div className="text-center mb-12">
    <h2 className="text-4xl md:text-5xl font-bold">
      Customer <span className="text-[#B50000]">Reviews</span>
    </h2>

    <p className="text-gray-400 mt-3">
      Trusted by gamers across India
    </p>
  </div>

  {[0, 1].map((row) => (
    <div key={row} className="overflow-hidden py-3">

      <div
      className={`flex gap-4 w-max ${
  row === 0
    ? "animate-marquee-left"
    : "animate-marquee-right"
}`}
      >
      {[
  ...(row === 0 ? row1Reviews : row2Reviews),
  ...(row === 0 ? row1Reviews : row2Reviews),
].map(
  
          (review, index) => (
            <div
              key={index}
              className="bg-[#141414] border border-white/10 rounded-xl p-5 min-w-[320px]"
            >
              <p className="text-green-400 text-sm mb-2">
                ✓ Verified Purchase
              </p>

              <h4 className="font-semibold mb-2">
                {review.name}
              </h4>

              <p className="text-gray-300 text-sm">
                {review.comment}
              </p>
            </div>
          )
        )}
      </div>

    </div>
  ))}

</section>

    </div>
  );
};

export default Home;