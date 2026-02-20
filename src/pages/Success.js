import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, Package } from 'lucide-react';

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8 flex justify-center"
        >
          <CheckCircle className="w-32 h-32 text-[#10B981]" data-testid="success-icon" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter uppercase mb-6 text-glow"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
          data-testid="success-title"
        >
          Order <span className="text-[#B50000]">Successful!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xl text-gray-400 mb-12"
          data-testid="success-message"
        >
          Thank you for your purchase! Your order has been confirmed and will be processed shortly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-[#B50000] hover:bg-[#FF0000] text-white rounded-full px-8 py-4 font-bold transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,0,0,0.6)] flex items-center justify-center"
            data-testid="view-orders-button"
          >
            <Package className="w-5 h-5 mr-2" /> View Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-transparent border border-white/20 hover:border-[#FF0000] text-white rounded-full px-8 py-4 font-medium transition-all duration-300 hover:bg-[#FF0000]/10 flex items-center justify-center"
            data-testid="go-home-button"
          >
            <Home className="w-5 h-5 mr-2" /> Go Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Success;