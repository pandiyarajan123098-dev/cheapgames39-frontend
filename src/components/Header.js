import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    logout();
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
        <Link
          to="/"
          className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          <span className="text-white">CHEAP</span>
          <span className="text-[#B50000]">GAMES39</span>
        </Link>

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
                      to="/wishlist"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Wishlist
                    </Link>

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
                      onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
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
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#141414] border-t border-white">
          <nav className="container mx-auto px-6 py-6 flex flex-col space-y-5 text-sm uppercase tracking-wider">

            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? "text-white font-semibold" : "text-gray-400"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/games"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? "text-white font-semibold" : "text-gray-400"
              }
            >
              Games
            </NavLink>

            <NavLink
              to="/offers"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? "text-white font-semibold" : "text-gray-400"
              }
            >
              Offers
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? "text-white font-semibold" : "text-gray-400"
              }
            >
              Contact
            </NavLink>

          </nav>
        </div>
      )}
    </header>
  );
};