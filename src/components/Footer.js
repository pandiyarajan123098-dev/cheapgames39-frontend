import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Instagram, 
  MessageSquare, 
  ShieldCheck, 
  CreditCard,
  Headphones
} from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';
import logo from '../logo.png';

export const Footer = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <footer className="cg39-footer bg-[#181818] border-t border-white/8 mt-16 font-sans text-xs text-zinc-400">
      
      {/* SECTION 1 — BRAND + SUPPORT CTA */}
      <div className="max-w-[1280px] mx-auto px-6 py-10 border-b border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          {/* Left Brand Details */}
          <div className="max-w-md">
            <Link to="/" className="flex items-center gap-2 mb-3" aria-label="CG39 Home">
              <img loading="lazy" src={logo} alt="CG39" className="w-8 h-8 object-contain" />
              <span className="text-base font-bold text-white uppercase tracking-tight">
                CG<span className="text-[#E00000]">39</span> <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider ml-1">GAME STORE</span>
              </span>
            </Link>
            <p className="text-white font-semibold mb-1">Great games. Better prices.</p>
            <p className="leading-relaxed text-zinc-500">
              Affordable digital PC gaming marketplace with simple ordering, secure payment and customer support.
            </p>
          </div>

          {/* Right Help CTA */}
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-5 w-full md:w-auto md:min-w-[320px]">
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-1">Need help with your order?</h4>
            <p className="mb-4 text-gray-500 font-normal">Get assistance with payment, activation and delivery.</p>
            <a
              href="https://wa.me/916379490178"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#E00000] hover:bg-[#F00000] hover:-translate-y-0.5 active:scale-95 text-white font-bold px-5 py-3 rounded-xl text-center block uppercase tracking-wider transition duration-150 flex items-center justify-center gap-2 shadow-md"
              aria-label="Chat on WhatsApp"
            >
              <MessageSquare className="w-4 h-4 shrink-0" /> Chat on WhatsApp
            </a>
          </div>

        </div>
      </div>

      {/* SECTION 2 — FOOTER NAVIGATION */}
      <div className="max-w-[1280px] mx-auto px-6 py-12 border-b border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Column 1: SHOP */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[10px]">Shop</h4>
            <ul className="space-y-2.5 font-medium text-zinc-500">
              <li><Link to="/games" className="hover:text-white transition">All Games</Link></li>
              <li><Link to="/offers" className="hover:text-white transition">Best Deals</Link></li>
              <li><Link to="/games?maxPrice=49" className="hover:text-white transition">Under ₹49</Link></li>
              <li><Link to="/games?maxPrice=99" className="hover:text-white transition">Under ₹99</Link></li>
              <li><Link to="/games" className="hover:text-white transition">Categories</Link></li>
            </ul>
          </div>

          {/* Column 2: ACCOUNT */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[10px]">Account</h4>
            <ul className="space-y-2.5 font-medium text-zinc-500">
              <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition">Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition">Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-white transition">Cart</Link></li>
              {user ? (
                <li>
                  <button 
                    onClick={handleLogout}
                    className="hover:text-white transition font-medium text-left uppercase tracking-wider"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
              )}
            </ul>
          </div>

          {/* Column 3: SUPPORT */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[10px]">Support</h4>
            <ul className="space-y-2.5 font-medium text-zinc-500">
              <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link to="/order-status" className="hover:text-white transition">Order Tracking</Link></li>
              <li><a href="https://wa.me/916379490178" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition">WhatsApp Support</a></li>
            </ul>
          </div>

          {/* Column 4: LEGAL */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[10px]">Legal</h4>
            <ul className="space-y-2.5 font-medium text-zinc-500">
              <li><Link to="/terms" className="hover:text-white transition">Terms</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Refund Policy</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* SECTION 3 & 4 & 5 — TRUST, PAYMENT, SOCIALS ROW */}
      <div className="max-w-[1280px] mx-auto px-6 py-8 border-b border-white/8 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Trust strip */}
        <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-zinc-600" /> Secure Checkout</span>
          <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-zinc-600" /> UPI Payment</span>
          <span className="flex items-center gap-1.5"><Headphones className="w-4 h-4 text-zinc-600" /> Customer Support</span>
        </div>

        {/* Payment + Social coordinates */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2 font-bold text-white bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl text-[10px] uppercase tracking-wider">
            <span className="text-gray-500 font-semibold">Supported Payment:</span>
            <span className="text-[#E00000]">UPI</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Follow CG39</span>
            <a
              href="https://www.instagram.com/cheapgames39.official?igsh=MTUxajEzMjNuZWY2MA=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white hover:scale-105 active:scale-95 p-2 bg-[#111111] border border-white/5 rounded-xl transition duration-150"
              aria-label="Instagram Profile"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://discord.gg/d9JKQgH5g"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white hover:scale-105 active:scale-95 p-2 bg-[#111111] border border-white/5 rounded-xl transition duration-150"
              aria-label="Discord Server"
            >
              <FaDiscord className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 6 — FINAL COPYRIGHT BAR */}
      <div className="max-w-[1280px] mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-zinc-600 font-medium uppercase tracking-wider">
        <p>&copy; 2026 CG39. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="/terms" className="hover:text-white transition">Terms</Link>
          <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://whatsapp.com/channel/0029Vb8WvNiGehEGfRVnMr2T"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join our WhatsApp Channel"
        title="Join our WhatsApp Channel"
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 z-40"
      >
        <img loading="lazy"
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          className="w-6 h-6"
        />
      </a>
    </footer>
  );
};