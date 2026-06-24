import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logo from "../logo.png";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";

import {
  FaHome,
  FaGamepad,
  FaGift,
  FaPhoneAlt,
} from "react-icons/fa";

import { Truck, Shield, Download } from "lucide-react";

export const Header = () => {
  const { user, logout, logoutLoading } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef();

const handleLogout = async () => {
  await logout();
  navigate("/");
};
  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navStyle =
    "relative text-sm uppercase tracking-widest transition duration-300";

  const activeStyle =
    "text-white after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[3px] after:bg-white";

  const normalStyle =
    "text-gray-400 hover:text-white";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/20 h-20 shadow-md">
      <div className="container mx-auto px-6 md:px-12 h-full flex items-center justify-between">

{/* Logo */}
<div className="flex items-center gap-2">
  <img loading="lazy" src={logo} alt="CG39" className="w-10 h-10" />

  <div className="flex flex-col leading-none">
    <h1 className="text-2xl font-extrabold tracking-wide">
      <span className="text-white">CG</span>
      <span className="text-[#B50000]">39</span>
    </h1>

    <span className="text-[10px] text-gray-400 uppercase tracking-[3px]">
      Game Store
    </span>
  </div>
</div>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-10">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `${navStyle} ${isActive ? activeStyle : normalStyle}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/games"
            className={({ isActive }) =>
              `${navStyle} ${isActive ? activeStyle : normalStyle}`
            }
          >
            Games
          </NavLink>

          <NavLink
            to="/offers"
            className={({ isActive }) =>
              `${navStyle} ${isActive ? activeStyle : normalStyle}`
            }
          >
            Offers
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `${navStyle} ${isActive ? activeStyle : normalStyle}`
            }
          >
            Contact
          </NavLink>

        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-6">

          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-400 hover:text-white transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#B50000] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="hover:text-white text-gray-400 transition"
            >
              <User className="w-6 h-6" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-[#1a1a1a] border border-white/20 rounded-xl shadow-lg py-2">

                {user ? (
                  <>
                
                <Link
  to="/dashboard"
  className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
  onClick={() => setUserMenuOpen(false)}
>
  Dashboard
</Link>

                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Wishlist
                    </Link>

                    {user?.email === "pandiyarajan007123@gmail.com" && (
  <Link
    to="/admin"
   className="block px-4 py-2 text-sm text-[#FFD700] hover:bg-white/5"
    onClick={() => setUserMenuOpen(false)}
  >
    Admin Panel
  </Link>
)}

                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-[#B50000] hover:bg-white/5"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}

                  <button
  onClick={async () => {
   setUserMenuOpen(false);
await handleLogout();
  }}
  disabled={logoutLoading}

                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {logoutLoading ? "Logging out..." : "Logout"}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Login
                    </Link>

                    <Link
                      to="/signup"
                      className="block px-4 py-2 text-sm text-[#B50000] hover:bg-white/5"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}

              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

        </div>
      </div>

     {/* Mobile Menu */}
{/* Mobile Menu */}
{/* Mobile Menu */}
{mobileMenuOpen && (
  <div className="fixed inset-0 z-50 flex">

    {/* Overlay */}
    <div
      className="flex-1 bg-black/50"
      onClick={() => setMobileMenuOpen(false)}
    />

    {/* Left Drawer */}
    <div className="w-[78%] max-w-[300px] h-full bg-[#111111] border-r border-white/10 shadow-2xl flex flex-col animate-slide-in-left">

      {/* Top */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
        <div>
          <h3 className="text-white font-semibold text-base">
           {user ? "CG39 Store" : "CG39 Store"}
          </h3>
          <p className="text-gray-400 text-xs">
            {user ? user.email : "Best deals on PC games"}
          </p>
        </div>

        <button
          onClick={() => setMobileMenuOpen(false)}
          className="text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Menu */}
      <nav className="px-4 py-5 flex flex-col gap-3 flex-1">

        <NavLink
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg p-3 text-sm font-semibold transition-all ${
              isActive
              ? "bg-[#B50000] text-white shadow-lg border-l-4 border-white"
                : "bg-[#1a1a1a] text-gray-300 border border-white/10 hover:border-[#B50000]"
            }`
          }
        >
          <FaHome size={17} />
          <span>HOME</span>
        </NavLink>

        <NavLink
          to="/games"
          onClick={() => setMobileMenuOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg p-3 text-sm font-semibold transition-all ${
              isActive
                ? "bg-[#B50000] text-white shadow-lg border-l-4 border-white"
                : "bg-[#1a1a1a] text-gray-300 border border-white/10 hover:border-[#B50000]"
            }`
          }
        >
          <FaGamepad size={17} />
          <span>GAMES</span>
        </NavLink>

        <NavLink
          to="/offers"
          onClick={() => setMobileMenuOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg p-3 text-sm font-semibold transition-all ${
              isActive
               ? "bg-[#B50000] text-white shadow-lg border-l-4 border-white"
                : "bg-[#1a1a1a] text-gray-300 border border-white/10 hover:border-[#B50000]"
            }`
          }
        >
          <FaGift size={17} />
          <span>OFFERS</span>
        </NavLink>

        <NavLink
          to="/contact"
          onClick={() => setMobileMenuOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg p-3 text-sm font-semibold transition-all ${
              isActive
               ? "bg-[#B50000] text-white shadow-lg border-l-4 border-white"
                : "bg-[#1a1a1a] text-gray-300 border border-white/10 hover:border-[#B50000]"
            }`
          }
        >
          <FaPhoneAlt size={17} />
          <span>CONTACT</span>
        </NavLink>

      </nav>
      {/* Trust Proof */}
<div className="px-5 py-4">
  <div className="grid grid-cols-2 gap-3">

    <div className="bg-[#141414] border border-white/10 rounded-xl p-4 text-center">
      <p className="text-white text-lg font-bold">500+</p>
      <span className="text-gray-400 text-xs uppercase tracking-wide">
        Orders Done
      </span>
    </div>

    <div className="bg-[#141414] border border-white/10 rounded-xl p-4 text-center">
  <h3 className="text-2xl font-bold flex items-center justify-center gap-1">
  4.9 <span className="text-[#FFA500]">★</span>
</h3>
      <span className="text-gray-400 text-xs uppercase tracking-wide">
        Customer Rating
      </span>
    </div>

  </div>
</div>


{/* Store Status */}
<div className="px-5 py-4 border-t border-white/10 border-b border-white/10">

  <p className="text-white text-center text-base font-bold italic mb-4">
    "Play More. Pay Less."
  </p>

  <div className="space-y-3 text-sm text-gray-400">

    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
      <span>Online Now</span>
    </div>

    <div className="flex items-center gap-2">
     <span className="w-2.5 h-2.5 rounded-full bg-[#B50000]"></span>
      <span>Orders Open</span>
    </div>

    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
      <span>Support Active</span>
    </div>

  </div>
</div>

      {/* Bottom Trust */}
      <div className="px-5 py-5 border-t border-white/10">
        <div className="flex flex-col gap-3 text-xs text-gray-400">

          <div className="flex items-center gap-3">
            <Truck className="w-4 h-4 text-white/80" />
            <span>Fast Delivery</span>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-white/80" />
            <span>Secure Checkout</span>
          </div>

          <div className="flex items-center gap-3">
            <Download className="w-4 h-4 text-white/80" />
            <span>Instant Access</span>
          </div>

        </div>


      </div>
    </div>

  </div>
)}

    </header>
  );
};