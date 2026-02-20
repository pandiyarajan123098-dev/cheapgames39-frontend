import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Sparkles, Trophy, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Offers = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-24 pb-20 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }} data-testid="offers-page-title">
            Special <span className="text-[#B50000]">Offers</span>
          </h1>
          <p className="text-xl text-gray-400">Unbeatable deals and giveaways just for you</p>
        </motion.div>

        {/* Hero Offer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-12 rounded-3xl overflow-hidden h-[400px]"
        >
          <img
            src="https://images.unsplash.com/photo-1636036704268-017faa3b6557?w=1920"
            alt="Sale Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent flex items-center">
            <div className="pl-12 md:pl-20">
              <h2 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase mb-4 text-glow" data-testid="mega-sale-title">
                MEGA <span className="text-[#B50000]">SALE</span>
              </h2>
              <p className="text-2xl text-gray-300 mb-8">Up to 70% OFF on selected titles</p>
              <Link to="/games">
                <button className="bg-[#B50000] hover:bg-[#FF0000] text-white rounded-full px-12 py-4 font-bold text-lg tracking-wide transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,0,0,0.7)]" data-testid="shop-mega-sale-button">
                  Shop Now
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Offer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1a1a1a] border border-[#B50000]/30 rounded-2xl p-8 hover:bg-[#1f1f1f] transition-all"
          >
            <Gift className="w-12 h-12 text-[#B50000] mb-4" />
            <h3 className="text-2xl font-bold mb-3">Weekend Giveaway</h3>
            <p className="text-gray-400 mb-4">Win FREE games every weekend! Follow us on social media and participate in our weekly contests.</p>
            <button className="text-[#B50000] hover:text-[#FF0000] font-semibold flex items-center" data-testid="learn-more-giveaway">
              Learn More
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#1a1a1a] border border-[#B50000]/30 rounded-2xl p-8 hover:bg-[#1f1f1f] transition-all"
          >
            <Sparkles className="w-12 h-12 text-[#B50000] mb-4" />
            <h3 className="text-2xl font-bold mb-3">First Purchase Bonus</h3>
            <p className="text-gray-400 mb-4">Get 15% OFF on your first order! Use code: WELCOME15 at checkout.</p>
            <button className="text-[#B50000] hover:text-[#FF0000] font-semibold flex items-center" data-testid="first-purchase-info">
              Get Started
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#1a1a1a] border border-[#B50000]/30 rounded-2xl p-8 hover:bg-[#1f1f1f] transition-all"
          >
            <Trophy className="w-12 h-12 text-[#B50000] mb-4" />
            <h3 className="text-2xl font-bold mb-3">Loyalty Rewards</h3>
            <p className="text-gray-400 mb-4">Earn points with every purchase and redeem them for discounts on future orders.</p>
            <button className="text-[#B50000] hover:text-[#FF0000] font-semibold flex items-center" data-testid="loyalty-info">
              View Details
            </button>
          </motion.div>
        </div>

        {/* Flash Deals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-[#B50000]/20 to-transparent border border-[#B50000]/30 rounded-3xl p-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <Clock className="w-12 h-12 text-[#B50000]" />
            <h2 className="text-4xl font-bold tracking-tight uppercase">Daily Flash Deals</h2>
          </div>
          <p className="text-xl text-gray-300 mb-8">Limited time offers refreshed every 24 hours. Don't miss out on incredible discounts!</p>
          <Link to="/games">
            <button className="bg-[#B50000] hover:bg-[#FF0000] text-white rounded-full px-10 py-4 font-bold text-lg tracking-wide transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,0,0,0.6)]" data-testid="view-flash-deals-button">
              View All Deals
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Offers;