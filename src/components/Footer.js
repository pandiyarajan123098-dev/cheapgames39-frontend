import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  CreditCard,
  Headset,
  EnvelopeSimple,
  ArrowRight,
  InstagramLogo,
  DiscordLogo
} from '@phosphor-icons/react';
import logo from "../logo.png";
import { FaWhatsapp } from 'react-icons/fa';

export const Footer = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Since backend does not support newsletter subscription, do nothing.
    // Avoid fake success messages/banners.
  };

  return (
    <footer className="cg39-footer font-sans text-sm selection:bg-[#E10600] selection:text-white">
      {/* 1. NEWSLETTER BAR (Full Width - Dark Gray) */}
      <div className="bg-[#161616] border-t border-b border-[#292929]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 md:px-10 lg:px-12 py-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="text-[#FFFFFF] text-2xl md:text-3xl font-extrabold tracking-wide uppercase mb-2">
              GET THE BEST DEALS
            </h3>
            <p className="text-[#B3B3B3] text-sm leading-relaxed">
              Stay updated with new games, exclusive deals and special offers.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 items-stretch shrink-0">
            <div className="relative flex items-center w-full sm:w-[320px] md:w-[360px]">
              <EnvelopeSimple className="absolute left-4 w-5 h-5 text-[#777777] shrink-0" weight="bold" />
              <input
                type="email"
                required
                placeholder="Email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#FFFFFF] text-[#111111] placeholder:text-[#777777] rounded-[10px] text-sm font-semibold outline-none focus:ring-2 focus:ring-[#E10600] transition duration-150"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-[#E10600] hover:bg-[#B80000] text-white px-6 py-3 rounded-[10px] text-sm font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] min-h-[46px]"
            >
              <span>SIGN UP</span>
              <ArrowRight className="w-4 h-4 text-white" weight="bold" />
            </button>
          </form>
        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT (Full Width - Darker Charcoal) */}
      <div className="bg-[#111111]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 md:px-10 lg:px-12 py-8 flex flex-col gap-6">
          
          {/* PAYMENT / TRUST STRIP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-[#292929] select-none">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#161616] border border-[#292929] rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#FFFFFF]" weight="bold" />
              </div>
              <div>
                <h5 className="text-[#FFFFFF] text-xs font-bold uppercase tracking-wider">SECURE CHECKOUT</h5>
                <p className="text-[#A3A3A3] text-xs mt-0.5 font-medium">SSL Encrypted Safe Gateways</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#161616] border border-[#292929] rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#FFFFFF]" weight="bold" />
              </div>
              <div>
                <h5 className="text-[#FFFFFF] text-xs font-bold uppercase tracking-wider">UPI PAYMENT</h5>
                <p className="text-[#A3A3A3] text-xs mt-0.5 font-medium">Instant Verification Transfer</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#161616] border border-[#292929] rounded-xl flex items-center justify-center">
                <Headset className="w-6 h-6 text-[#FFFFFF]" weight="bold" />
              </div>
              <div>
                <h5 className="text-[#FFFFFF] text-xs font-bold uppercase tracking-wider">CUSTOMER SUPPORT</h5>
                <p className="text-[#A3A3A3] text-xs mt-0.5 font-medium">Dedicated Support Helpdesk</p>
              </div>
            </div>
          </div>

          {/* MAIN NAVIGATION */}
          {/* Professional 2x2 grid on mobile, 4 columns on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 py-2">
            {/* SHOP Column */}
            <div>
              <h4 className="text-[#FFFFFF] font-extrabold uppercase tracking-widest text-[12px] mb-4 select-none">SHOP</h4>
              <ul className="space-y-2 font-semibold text-[#B3B3B3] text-sm">
                <li><Link to="/games" className="hover:text-[#E10600] transition-colors duration-150">All Games</Link></li>
                <li><Link to="/offers" className="hover:text-[#E10600] transition-colors duration-150">Best Deals</Link></li>
                <li><Link to="/games?maxPrice=49" className="hover:text-[#E10600] transition-colors duration-150">Under ₹49</Link></li>
                <li><Link to="/games?maxPrice=99" className="hover:text-[#E10600] transition-colors duration-150">Under ₹99</Link></li>
                <li><Link to="/games" className="hover:text-[#E10600] transition-colors duration-150">Categories</Link></li>
              </ul>
            </div>

            {/* ACCOUNT Column */}
            <div>
              <h4 className="text-[#FFFFFF] font-extrabold uppercase tracking-widest text-[12px] mb-4 select-none">ACCOUNT</h4>
              <ul className="space-y-2 font-semibold text-[#B3B3B3] text-sm">
                <li><Link to="/dashboard" className="hover:text-[#E10600] transition-colors duration-150">Dashboard</Link></li>
                <li><Link to="/dashboard" className="hover:text-[#E10600] transition-colors duration-150">Orders</Link></li>
                <li><Link to="/wishlist" className="hover:text-[#E10600] transition-colors duration-150">Wishlist</Link></li>
                <li><Link to="/cart" className="hover:text-[#E10600] transition-colors duration-150">Cart</Link></li>
                {user ? (
                  <li>
                    <button 
                      onClick={handleLogout}
                      className="hover:text-[#E10600] transition-colors duration-150 font-bold uppercase text-xs tracking-wider text-left"
                    >
                      Logout
                    </button>
                  </li>
                ) : (
                  <li><Link to="/login" className="hover:text-[#E10600] transition-colors duration-150">Login</Link></li>
                )}
              </ul>
            </div>

            {/* SUPPORT Column */}
            <div>
              <h4 className="text-[#FFFFFF] font-extrabold uppercase tracking-widest text-[12px] mb-4 select-none">SUPPORT</h4>
              <ul className="space-y-2 font-semibold text-[#B3B3B3] text-sm">
                <li><Link to="/faq" className="hover:text-[#E10600] transition-colors duration-150">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-[#E10600] transition-colors duration-150">Contact</Link></li>
                <li><Link to="/order-status" className="hover:text-[#E10600] transition-colors duration-150">Order Tracking</Link></li>
                <li><Link to="/contact" className="hover:text-[#E10600] transition-colors duration-150">Email Support</Link></li>
              </ul>
            </div>

            {/* LEGAL Column */}
            <div>
              <h4 className="text-[#FFFFFF] font-extrabold uppercase tracking-widest text-[12px] mb-4 select-none">LEGAL</h4>
              <ul className="space-y-2 font-semibold text-[#B3B3B3] text-sm">
                <li><Link to="/terms" className="hover:text-[#E10600] transition-colors duration-150">Terms</Link></li>
                <li><Link to="/privacy" className="hover:text-[#E10600] transition-colors duration-150">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-[#E10600] transition-colors duration-150">Refund Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* 4. SOCIAL MEDIA */}
          <div className="flex flex-col items-center gap-4 py-3 border-t border-[#292929]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">FOLLOW CG39</span>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/cheapgames39.official?igsh=MTUxajEzMjNuZWY2MA=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFFFFF] hover:text-[#E10600] p-3 bg-[#222222] rounded-full transition-all duration-150 hover:scale-105 active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Instagram Profile"
              >
                <InstagramLogo className="w-5 h-5 text-white" weight="bold" />
              </a>
              <a
                href="https://discord.gg/d9JKQgH5g"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFFFFF] hover:text-[#E10600] p-3 bg-[#222222] rounded-full transition-all duration-150 hover:scale-105 active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Discord Server"
              >
                <DiscordLogo className="w-5 h-5 text-white" weight="bold" />
              </a>
            </div>
          </div>

          {/* 5. BRAND & TRUST/SECURITY SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4 border-t border-[#292929]">
            {/* Brand Intro */}
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-2.5 select-none">
                <img src={logo} alt="CG39 Logo" className="w-8 h-8 object-contain shrink-0" />
                <span className="text-[#FFFFFF] font-extrabold tracking-wider text-sm uppercase">CG39 GAME STORE</span>
              </div>
              <p className="text-[#E10600] font-extrabold text-[13px] uppercase tracking-wider">
                Great games. Better prices.
              </p>
              <p className="text-[#B3B3B3] text-sm leading-relaxed max-w-lg">
                Affordable digital PC gaming marketplace with simple ordering, secure payment and customer support.
              </p>
            </div>

            {/* Trust / Security */}
            <div className="flex items-start gap-4 p-5 bg-[#161616] border border-[#292929] rounded-2xl max-w-lg lg:ml-auto">
              <ShieldCheck className="w-8 h-8 text-[#FFFFFF] shrink-0" weight="bold" />
              <div className="flex flex-col gap-1">
                <h5 className="text-[#FFFFFF] font-bold text-xs uppercase tracking-wider">SECURE & TRUSTED</h5>
                <p className="text-[#B3B3B3] text-xs leading-relaxed">
                  Your information and transactions are handled securely.
                </p>
              </div>
            </div>
          </div>

          {/* 6. COPYRIGHT & COMPACT LEGAL LINKS */}
          <div className="pt-4 border-t border-[#292929] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#777777] font-bold uppercase tracking-wider">
            <p className="text-center md:text-left select-none">© 2026 CG39. ALL RIGHTS RESERVED.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/terms" className="hover:text-[#E10600] transition-colors duration-150">Terms</Link>
              <Link to="/privacy" className="hover:text-[#E10600] transition-colors duration-150">Privacy</Link>
              <Link to="/terms" className="hover:text-[#E10600] transition-colors duration-150">Refund Policy</Link>
            </div>
          </div>

        </div>
      </div>

      {/* Global Floating WhatsApp Button */}
      <a
        href="https://whatsapp.com/channel/0029Vb8WvNiGehEGfRVnMr2T"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        title="Contact us on WhatsApp"
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 bg-[#25D366] hover:bg-[#20ba56] text-white rounded-full w-[52px] h-[52px] md:w-[56px] md:h-[56px] flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 z-40"
      >
        <FaWhatsapp size={26} className="text-white shrink-0" />
      </a>
    </footer>
  );
};