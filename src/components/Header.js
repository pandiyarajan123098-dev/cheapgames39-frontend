import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import logo from "../logo.png";
import {
  ShoppingCart,
  Heart,
  Search,
  User,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ArrowRight,
  Shield,
  LayoutDashboard,
  Gift,
  BadgePercent,
  Gamepad2,
  Swords,
  Compass,
  Car,
  Skull,
  Tag,
  MessageCircle,
  Headphones
} from "lucide-react";

export const Header = () => {
  const { user, logout, logoutLoading } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef();

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);

  // Scroll Lock & Escape listener for mobile menu drawer
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Fetch games for live suggestion panel
  useEffect(() => {
    const loadGames = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api/games`);
        const data = await res.json();
        setAllGames(data || []);
      } catch (err) {
        console.error("Search fetch games error:", err);
      }
    };
    loadGames();
  }, []);

  // Filter games based on search query (title + category)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSelectedIndex(-1);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = allGames.filter(game =>
      game.title.toLowerCase().includes(q) ||
      game.categories?.name?.toLowerCase().includes(q)
    ).slice(0, 5);
    setSearchResults(filtered);
    setSelectedIndex(-1);
  }, [searchQuery, allGames]);

  // Handle escape key to close search suggestions
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSearchFocused(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex >= 0 && searchResults[selectedIndex]) {
      navigate(`/games/${searchResults[selectedIndex].id}`);
      setSearchQuery("");
      setSearchFocused(false);
      setSelectedIndex(-1);
    } else if (searchQuery.trim()) {
      navigate(`/games?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchFocused(false);
      setSelectedIndex(-1);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (!searchFocused || !searchResults.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, -1));
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-[#E5E5E5] h-16 md:h-[70px] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="CG39 Home">
            <img loading="lazy" src={logo} alt="CG39 Logo" className="w-8 h-8 md:w-9 md:h-9 object-contain" />
            <div className="flex flex-col leading-none">
              <span className="text-lg md:text-xl font-bold tracking-tight text-[#111111] uppercase">
                CG<span className="text-[#E00000]">39</span>
              </span>
              <span className="text-[8px] text-[#999999] font-bold uppercase tracking-[1.5px] mt-0.5">
                GAME STORE
              </span>
            </div>
          </Link>

          {/* Search bar desktop */}
          <div ref={searchRef} className="hidden md:block flex-1 max-w-lg relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search games, titles or categories..."
                value={searchQuery}
                aria-label="Search games"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchFocused(true);
                }}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl pl-10 pr-9 py-2.5 text-[13px] text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]/20 transition"
              />
              {searchQuery && (
                <button 
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                    setSelectedIndex(-1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-zinc-500 hover:text-white transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Suggestions Panel */}
            {searchFocused && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden z-50 shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
                style={{ animation: "searchDropdown 150ms ease-out" }}
              >
                {searchResults.length > 0 ? (
                  <>
                    <div className="px-3 pt-3 pb-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 select-none">Results</span>
                    </div>
                    {searchResults.map((game, i) => {
                      const disc = game.steam_price && game.steam_price > game.price
                        ? Math.round(((game.steam_price - game.price) / game.steam_price) * 100)
                        : 0;
                      return (
                        <div
                          key={game.id}
                          onClick={() => {
                            navigate(`/games/${game.id}`);
                            setSearchQuery("");
                            setSearchFocused(false);
                            setSelectedIndex(-1);
                          }}
                          onMouseEnter={() => setSelectedIndex(i)}
                          className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer border-b border-[#F0F0F0] last:border-0 transition-all duration-100 ${
                            selectedIndex === i ? "bg-[#F5F5F5]" : "hover:bg-[#F8F8F8]"
                          }`}
                          style={{ animationDelay: `${i * 30}ms` }}
                          role="option"
                          aria-selected={selectedIndex === i}
                        >
                          <img
                            src={game.image_url}
                            alt={game.title}
                            loading="lazy"
                            className="w-[44px] h-[30px] object-cover rounded-lg bg-black/20 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                              <p className="text-[#111111] text-xs font-bold truncate leading-tight">{game.title}</p>
                            {game.categories?.name && (
                              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">{game.categories.name}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {disc > 0 && (
                              <span className="text-[9px] bg-[#E00000] text-white font-black px-1.5 py-0.5 rounded">-{disc}%</span>
                            )}
                            <div className="text-right">
                              <span className="text-[#E00000] text-xs font-black block">₹{game.price?.toLocaleString()}</span>
                              {disc > 0 && (
                                <span className="text-[9px] text-zinc-600 line-through">₹{game.steam_price?.toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                        </div>
                      );
                    })}
                    <button
                      onClick={() => {
                        navigate(`/games?search=${encodeURIComponent(searchQuery)}`);
                        setSearchFocused(false);
                        setSelectedIndex(-1);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 p-3 text-[11px] text-[#555555] hover:text-[#111111] bg-[#F5F5F5] hover:bg-[#EEEEEE] cursor-pointer font-bold uppercase tracking-wider transition border-t border-[#E5E5E5]"
                    >
                      View all results
                      <ArrowRight className="w-3 h-3 shrink-0" />
                    </button>
                  </>
                ) : (
                  <div className="p-5 text-center flex flex-col gap-2">
                    <p className="text-xs font-bold text-zinc-400 select-none">No games found</p>
                    <p className="text-[10px] text-zinc-600 select-none">Try another title or category</p>
                    <button
                      onClick={() => {
                        navigate("/games");
                        setSearchFocused(false);
                      }}
                      className="mt-1 text-[10px] font-bold text-[#E00000] hover:text-[#F00000] uppercase tracking-wider transition"
                    >
                      View All Games
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Header Navigation Icons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Account Icon Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-3 md:p-2 text-[#555555] hover:text-[#111111] transition active:scale-95"
                aria-label="User Menu"
              >
                <User className="w-5 h-5" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E5E5E5] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.10)] py-2 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-2.5 border-b border-[#F0F0F0] mb-1.5">
                        <p className="text-[9px] text-[#999999] uppercase tracking-widest font-black">Signed in as</p>
                        <p className="text-[#111111] text-xs font-bold truncate mt-0.5">{user.user_metadata?.full_name || user.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#444444] hover:text-[#111111] hover:bg-[#F5F5F5] font-semibold transition rounded-lg mx-1"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-[#999999]" />
                        My Account
                      </Link>
                      <Link
                        to="/wishlist"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#444444] hover:text-[#111111] hover:bg-[#F5F5F5] font-semibold transition rounded-lg mx-1"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Heart className="w-3.5 h-3.5 text-[#999999]" />
                        Wishlist
                      </Link>
                      {(user?.email === "pandiyarajan007123@gmail.com" || user?.role === "admin") && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#E00000] hover:bg-[#E00000]/5 font-bold transition rounded-lg mx-1"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Shield className="w-3.5 h-3.5" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={async () => {
                          setUserMenuOpen(false);
                          await handleLogout();
                        }}
                        disabled={logoutLoading}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-[#777777] hover:text-red-600 hover:bg-[#FFF5F5] transition rounded-lg mx-1 border-t border-[#F0F0F0] mt-1.5 pt-2.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        {logoutLoading ? "Logging out…" : "Log Out"}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2.5 border-b border-[#F0F0F0] mb-1.5">
                        <p className="text-[9px] text-[#999999] uppercase tracking-widest font-black">Guest</p>
                        <p className="text-[#555555] text-xs mt-0.5">Sign in to access your account</p>
                      </div>
                      <Link
                        to="/login"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#444444] hover:text-[#111111] hover:bg-[#F5F5F5] font-semibold transition rounded-lg mx-1"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-3.5 h-3.5 text-[#999999]" />
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#E00000] hover:bg-[#E00000]/5 font-bold transition rounded-lg mx-1"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-3.5 h-3.5" />
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" aria-label="Wishlist" className="relative p-2.5 text-[#555555] hover:text-[#111111] transition active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#E00000] text-white text-[8px] rounded-full w-[14px] h-[14px] flex items-center justify-center font-bold leading-none">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" aria-label="Shopping cart" className="relative p-2.5 text-[#555555] hover:text-[#111111] transition active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#E00000] text-white text-[8px] rounded-full w-[14px] h-[14px] flex items-center justify-center font-bold leading-none">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger — single unified button for all viewports */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 text-[#555555] hover:text-[#111111] transition active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

          </div>
        </div>


      </header>

      {/* MOBILE FULL-SCREEN NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/65 transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative z-10 w-[85vw] max-w-[360px] h-full bg-white border-r border-[#E5E5E5] shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-in-left">
            
            {/* Header / Brand */}
            <div>
              <div className="flex items-center justify-between p-5 border-b border-[#E5E5E5] mb-4">
                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <img loading="lazy" src={logo} alt="CG39" className="w-8 h-8 object-contain" />
                  <span className="text-base font-bold text-[#111111] uppercase tracking-tight">
                    CG<span className="text-[#E00000]">39</span> <span className="text-[10px] text-[#999999] font-bold uppercase tracking-wider ml-1">GAME STORE</span>
                  </span>
                </Link>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#555555] hover:text-[#111111] p-1 animate-pulse-none"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search Bar inside Drawer */}
              <div className="px-5 mb-4">
                <form onSubmit={(e) => { handleSearchSubmit(e); setMobileMenuOpen(false); }} className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search games..."
                    value={searchQuery}
                    aria-label="Search games"
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchFocused(true);
                    }}
                    className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]/20 transition"
                  />
                  {searchQuery && (
                    <button 
                      type="button"
                      aria-label="Clear search"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                        setSelectedIndex(-1);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-zinc-500 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </form>
                {/* Mobile live results */}
                {searchQuery && searchResults.length > 0 && (
                  <div className="mt-2 bg-white border border-[#E5E5E5] rounded-xl overflow-hidden">
                    {searchResults.slice(0, 3).map((game) => {
                      const disc = game.steam_price && game.steam_price > game.price
                        ? Math.round(((game.steam_price - game.price) / game.steam_price) * 100) : 0;
                      return (
                        <div
                          key={game.id}
                          onClick={() => {
                            navigate(`/games/${game.id}`);
                            setSearchQuery("");
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-[#F5F5F5] border-b border-[#F0F0F0] last:border-0 transition"
                        >
                          <img src={game.image_url} alt={game.title} className="w-9 h-[26px] object-cover rounded-lg shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[#111111] text-xs font-bold truncate">{game.title}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {disc > 0 && <span className="text-[9px] bg-[#E00000] text-white font-black px-1 py-0.5 rounded">-{disc}%</span>}
                            <span className="text-xs font-black text-[#E00000]">₹{game.price?.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}
                    <button
                      onClick={() => {
                        navigate(`/games?search=${encodeURIComponent(searchQuery)}`);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-1 p-2.5 text-[10px] text-[#555555] hover:text-[#111111] font-bold uppercase tracking-wider bg-[#F5F5F5] transition"
                    >
                      View all results <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {searchQuery && searchResults.length === 0 && (
                  <p className="mt-2 text-[10px] text-zinc-600 text-center font-bold uppercase tracking-wide select-none">No games found</p>
                )}
              </div>

              {/* Navigation Group 1: BROWSE CATEGORIES */}
              <div className="px-5 mb-6">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#A1A1AA] mb-2 px-3 block">BROWSE STORE</span>
                <nav className="flex flex-col gap-1">
                  {[
                    { label: "Steam Deals", path: "/games?category=Steam", icon: Gamepad2 },
                    { label: "PC Games Catalog", path: "/games", icon: Gamepad2 },
                    { label: "Action Games", path: "/games?category=Action", icon: Swords },
                    { label: "Open World", path: "/games?category=Open%20World", icon: Compass },
                    { label: "RPG / Fantasy", path: "/games?category=RPG", icon: Shield },
                    { label: "Racing & Cars", path: "/games?category=Racing", icon: Car },
                    { label: "Survival Horror", path: "/games?category=Horror", icon: Skull }
                  ].map((item, idx) => {
                    const isActive = (location.pathname + location.search) === item.path;
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={idx}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`h-11 flex items-center justify-between pl-3 pr-4 rounded-xl transition-all duration-150 text-[15px] font-medium group ${
                          isActive 
                            ? "bg-[rgba(225,6,0,0.08)] text-[#E00000] border-l-[3px] border-[#E10600] pl-2" 
                            : "hover:bg-[#F5F5F5] text-[#444444] hover:text-[#111111]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className={`w-4 h-4 transition-colors duration-150 ${isActive ? "text-[#E00000]" : "text-zinc-500 group-hover:text-[#E00000]"}`} />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-600 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Navigation Group 2: PRICE DISCOVERY */}
              <div className="px-5 mb-6">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#A1A1AA] mb-2 px-3 block">DEALS & OFFERS</span>
                <nav className="flex flex-col gap-1">
                  {[
                    { label: "Today's Spotlight", path: "/offers", icon: BadgePercent },
                    { label: "Under ₹49 Deals", path: "/games?maxPrice=49", icon: Tag },
                    { label: "Under ₹99 Budget", path: "/games?maxPrice=99", icon: Tag },
                    { label: "Under ₹199 Premium", path: "/games?maxPrice=199", icon: Tag }
                  ].map((item, idx) => {
                    const isActive = (location.pathname + location.search) === item.path;
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={idx}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`h-11 flex items-center justify-between pl-3 pr-4 rounded-xl transition-all duration-150 text-[15px] font-medium group ${
                          isActive 
                            ? "bg-[rgba(225,6,0,0.08)] text-[#E00000] border-l-[3px] border-[#E10600] pl-2" 
                            : "hover:bg-[#F5F5F5] text-[#444444] hover:text-[#111111]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className={`w-4 h-4 transition-colors duration-150 ${isActive ? "text-[#E00000]" : "text-zinc-500 group-hover:text-[#E00000]"}`} />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-600 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Navigation Group 3: ACCOUNT */}
              <div className="px-5 mb-6">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#A1A1AA] mb-2 px-3 block">MY PROFILE</span>
                <nav className="flex flex-col gap-1">
                  {user ? (
                    <>
                      {[
                        { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
                        { label: "Wishlist", path: "/wishlist", icon: Heart },
                        { label: "Shopping Cart", path: "/cart", icon: ShoppingCart }
                      ].map((item, idx) => {
                        const isActive = (location.pathname + location.search) === item.path;
                        const IconComponent = item.icon;
                        return (
                          <Link
                            key={idx}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`h-11 flex items-center justify-between pl-3 pr-4 rounded-xl transition-all duration-150 text-sm font-medium group ${
                              isActive 
                                ? "bg-[rgba(224,0,0,0.08)] text-[#E00000] border-l-[3px] border-[#E00000] pl-2" 
                                : "hover:bg-[#F5F5F5] text-[#444444] hover:text-[#111111]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <IconComponent className={`w-4 h-4 transition-colors duration-150 ${isActive ? "text-[#E00000]" : "text-zinc-500 group-hover:text-[#E00000]"}`} />
                              <span>{item.label}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-zinc-600 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        );
                      })}
                      <button
                        onClick={async () => {
                          setMobileMenuOpen(false);
                          await handleLogout();
                        }}
                        className="w-full h-11 flex items-center justify-between pl-3 pr-4 rounded-xl transition-all duration-150 text-[14px] font-medium group hover:bg-[#FFF5F5] text-[#444444] hover:text-red-600 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <LogOut className="w-4 h-4 text-zinc-500 group-hover:text-[#E00000] transition-colors duration-150" />
                          <span>Logout</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-600 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      {[
                        { label: "Login", path: "/login", icon: User },
                        { label: "Sign Up", path: "/signup", icon: User }
                      ].map((item, idx) => {
                        const isActive = (location.pathname + location.search) === item.path;
                        const IconComponent = item.icon;
                        const isSignUp = item.label === "Sign Up";
                        return (
                          <Link
                            key={idx}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`h-11 flex items-center justify-between pl-3 pr-4 rounded-xl transition-all duration-150 text-sm font-medium group ${
                              isActive 
                                ? "bg-[rgba(224,0,0,0.08)] text-[#E00000] border-l-[3px] border-[#E00000] pl-2" 
                                : isSignUp
                                  ? "hover:bg-[#E00000]/10 text-[#E00000]"
                                  : "hover:bg-[#F5F5F5] text-[#444444] hover:text-[#111111]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <IconComponent className={`w-4 h-4 transition-colors duration-150 ${isActive || isSignUp ? "text-[#E00000]" : "text-zinc-500 group-hover:text-[#E00000]"}`} />
                              <span>{item.label}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-zinc-600 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        );
                      })}
                    </>
                  )}
                </nav>
              </div>
            </div>

            {/* Bottom Support */}
            <div className="p-5 border-t border-[#E5E5E5] bg-[#F8F8F8]">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#777777] mb-2 px-3 block">CUSTOMER SUPPORT</span>
              <nav className="flex flex-col gap-1">
                <a 
                  href="https://whatsapp.com/channel/0029Vb8WvNiGehEGfRVnMr2T"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 flex items-center justify-between pl-3 pr-4 rounded-xl hover:bg-[#F0F0F0] text-[#444444] hover:text-[#111111] transition-all duration-150 text-sm font-medium group"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-zinc-500 group-hover:text-[#E00000] transition-colors duration-150" />
                    <span>Join WhatsApp Channel</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 transition-transform group-hover:translate-x-0.5" />
                </a>
                <Link 
                  to="/contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-11 flex items-center justify-between pl-3 pr-4 rounded-xl hover:bg-[#151515] text-zinc-300 hover:text-white transition-all duration-150 text-sm font-medium group"
                >
                  <div className="flex items-center gap-3">
                    <Headphones className="w-4 h-4 text-zinc-500 group-hover:text-[#E00000] transition-colors duration-150" />
                    <span>Contact Our Team</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};