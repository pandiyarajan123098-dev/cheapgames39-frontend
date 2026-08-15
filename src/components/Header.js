import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import logo from "../logo.png";
import {
  ShoppingCart,
  Heart,
  Check,
  MagnifyingGlass as Search,
  User,
  List as Menu,
  X,
  SignOut as LogOut,
  CaretRight as ChevronRight,
  ArrowRight,
  Shield,
  SquaresFour as LayoutDashboard,
  Gift,
  Percent as BadgePercent,
  GameController as Gamepad2,
  Sword as Swords,
  Compass,
  Car,
  Ghost as Skull,
  Tag,
  Headset as Headphones,
  House as Home,
  CaretDown as ChevronDown,
  Question as HelpCircle,
  Monitor,
  MapTrifold as Map,
  Ghost,
  Sword as Dumbbell,
  Envelope as Mail,
  Tag as Tags,
  SteamLogo,
  Polygon,
  Shapes,
  CircleNotch,
  DeviceMobile,
  Flame,
  Spiral,
  ShieldChevron,
  Star,
  Disc,
  LockSimple,
  Desktop,
  UserCircle,
  PuzzlePiece,
  Wallet,
  Package
} from "@phosphor-icons/react";
import { FaWhatsapp } from "react-icons/fa";

export const Header = () => {
  const { user, logout, logoutLoading } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [isCartPulsing, setIsCartPulsing] = useState(false);
  const [showCartCheck, setShowCartCheck] = useState(false);

  useEffect(() => {
    const handleCartAdded = () => {
      setIsCartPulsing(true);
      setShowCartCheck(true);
      
      const timerCheck = setTimeout(() => {
        setShowCartCheck(false);
      }, 1500);
      
      const timerPulse = setTimeout(() => {
        setIsCartPulsing(false);
      }, 600);

      return () => {
        clearTimeout(timerCheck);
        clearTimeout(timerPulse);
      };
    };

    window.addEventListener("cart-item-added", handleCartAdded);
    return () => {
      window.removeEventListener("cart-item-added", handleCartAdded);
    };
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef();

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [steamExpanded, setSteamExpanded] = useState(true);
  const [categories, setCategories] = useState([]);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  // Fetch categories dynamically on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api/categories`);
        const data = await res.json();
        setCategories(data || []);
      } catch (err) {
        console.error("Header categories loading error:", err);
      }
    };
    loadCategories();
  }, []);

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

  const getCategoryPath = (name) => {
    const match = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
    return match ? `/games?category=${match.id}` : "/games";
  };

  const isItemActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    if (path === "/games") {
      return location.pathname === "/games" && !location.search;
    }
    if (path.includes("?")) {
      const [basePath, searchStr] = path.split("?");
      const searchParams = new URLSearchParams(searchStr);
      const currentParams = new URLSearchParams(location.search);
      if (location.pathname !== basePath) return false;
      for (const [key, val] of searchParams.entries()) {
        if (currentParams.get(key) !== val) return false;
      }
      return true;
    }
    return location.pathname === path;
  };

  useEffect(() => {
    const isPlatformActive = categories.some(cat => isItemActive(`/games?category=${cat.id}`));
    const isSteamActive = isItemActive("/games");
    if (isPlatformActive || isSteamActive) {
      setOpenAccordion("platforms");
    } else if (
      isItemActive("/offers") ||
      isItemActive("/games?maxPrice=49") ||
      isItemActive("/games?maxPrice=99") ||
      isItemActive("/games?maxPrice=199") ||
      isItemActive("/games?minSteamPrice=1500")
    ) {
      setOpenAccordion("deals");
    } else if (
      isItemActive("/dashboard") ||
      isItemActive("/wishlist") ||
      isItemActive("/cart")
    ) {
      setOpenAccordion("account");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search, categories]);

  const getCategoryIcon = (name) => {
    const key = name.toLowerCase();
    if (key.includes("action")) return Swords;
    if (key.includes("adventure")) return Compass;
    if (key.includes("open world") || key.includes("openworld")) return Map;
    if (key.includes("rpg") || key.includes("fantasy")) return Shield;
    if (key.includes("racing") || key.includes("cars")) return Car;
    if (key.includes("horror") || key.includes("survival horror") || key.includes("survival")) return Ghost;
    if (key.includes("fighting")) return Dumbbell;
    return Gamepad2;
  };

  const renderMenuItem = ({ label, path, icon: Icon, isSubmenu = false, onClick }) => {
    const itemHeight = isSubmenu ? "h-10" : "h-11";
    const textSize = isSubmenu ? "text-[13px]" : "text-sm";
    const iconSize = isSubmenu ? "w-4 h-4" : "w-[18px] h-[18px]";
    const paddingLeft = isSubmenu ? "pl-8" : "px-4";
    const bgClass = "bg-transparent hover:bg-[#F8F8F8]";
    const textClass = "text-[#555555] hover:text-[#222222] font-medium";
    
    // Check if it is a WhatsApp link to keep proper green color/icon or neutral
    const iconColor = "text-[#666666]";

    const content = (
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-5 h-5 flex items-center justify-center shrink-0">
          {Icon && <Icon className={`${iconSize} ${iconColor} stroke-[1.8] transition-colors shrink-0`} />}
        </div>
        <span className={`${textSize} truncate`}>{label}</span>
      </div>
    );

    if (path.startsWith("http")) {
      return (
        <a
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          className={`${itemHeight} flex items-center justify-between pr-4 rounded-lg ${paddingLeft} ${bgClass} ${textClass} transition-all duration-150 select-none cursor-pointer`}
        >
          {content}
          <ChevronRight className="w-3.5 h-3.5 stroke-[1.8] text-[#999999] shrink-0" />
        </a>
      );
    }

    return (
      <Link
        to={path}
        onClick={() => {
          setMobileMenuOpen(false);
          if (onClick) onClick();
        }}
        className={`${itemHeight} flex items-center justify-between pr-4 rounded-lg ${paddingLeft} ${bgClass} ${textClass} transition-all duration-150 select-none`}
      >
        {content}
        <ChevronRight className="w-3.5 h-3.5 stroke-[1.8] text-[#999999] shrink-0" />
      </Link>
    );
  };

  const renderAccordionHeader = ({ label, icon: Icon, id }) => {
    const isOpen = openAccordion === id;
    const itemHeight = "h-11";
    const paddingLeft = "px-4";
    const textClass = "text-[#555555] hover:text-[#222222] font-medium";

    return (
      <button
        onClick={() => setOpenAccordion(isOpen ? null : id)}
        className={`${itemHeight} w-full flex items-center justify-between pr-4 rounded-lg ${paddingLeft} ${textClass} hover:bg-[#F8F8F8] transition-all duration-150 select-none text-left`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-5 h-5 flex items-center justify-center shrink-0">
            {Icon && <Icon className="w-[18px] h-[18px] text-[#666666] stroke-[1.8] shrink-0" />}
          </div>
          <span className="text-sm truncate">{label}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 stroke-[1.8] text-[#999999] transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>
    );
  };

  const renderDropdownItem = ({ label, path, icon: Icon, onClick }) => {
    const active = isItemActive(path);
    const itemHeight = "h-11";
    const textSize = "text-sm";
    const iconSize = "w-[18px] h-[18px]";
    const paddingLeft = active ? "pl-[14px]" : "px-4";
    const borderLeft = active ? "border-l-2 border-[#B50000]" : "";
    const bgClass = active ? "bg-[#F8F8F8]" : "bg-transparent hover:bg-[#F8F8F8]";
    const textClass = active ? "text-[#222222] font-semibold" : "text-[#555555] hover:text-[#222222] font-medium";
    const iconColor = active ? "text-[#B50000]" : "text-[#666666]";

    const content = (
      <div className="flex items-center gap-3">
        {Icon && <Icon className={`${iconSize} ${iconColor} stroke-[1.8] transition-colors shrink-0`} />}
        <span className={textSize}>{label}</span>
      </div>
    );

    if (path.startsWith("http")) {
      return (
        <a
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          className={`${itemHeight} flex items-center justify-between pr-4 rounded-lg ${paddingLeft} ${borderLeft} ${bgClass} ${textClass} transition-all duration-150 select-none cursor-pointer mx-1 my-0.5`}
        >
          {content}
          <ChevronRight className="w-3.5 h-3.5 stroke-[1.8] text-[#999999] opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      );
    }

    return (
      <Link
        to={path}
        onClick={() => {
          if (onClick) onClick();
        }}
        className={`${itemHeight} flex items-center justify-between pr-4 rounded-lg ${paddingLeft} ${borderLeft} ${bgClass} ${textClass} transition-all duration-150 select-none mx-1 my-0.5`}
      >
        {content}
        <ChevronRight className="w-3.5 h-3.5 stroke-[1.8] text-[#999999] opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
    );
  };

  const renderPlatformsSection = () => {
    const lockedPlatforms = [
      { label: "Epic Games", icon: Polygon },
      { label: "PlayStation", icon: Shapes },
      { label: "Xbox", icon: CircleNotch },
      { label: "Nintendo", icon: DeviceMobile },
      { label: "EA", icon: Flame },
      { label: "Ubisoft", icon: Spiral },
      { label: "Battle.net", icon: ShieldChevron },
      { label: "Rockstar Games", icon: Star },
      { label: "GOG", icon: Disc },
    ];

    const isAllSteamActive = location.pathname === "/games" && new URLSearchParams(location.search).get("platform") === "Steam";

    return (
      <div className="flex flex-col gap-0.5">
        {/* 1. STEAM (UNLOCKED / EXPANDABLE) */}
        <div>
          <button
            type="button"
            onClick={() => setSteamExpanded(!steamExpanded)}
            className="h-11 w-full flex items-center justify-between px-4 rounded-lg text-[#555555] hover:text-[#222222] hover:bg-[#F8F8F8] font-semibold transition-all duration-150 select-none text-left mx-1 my-0.5"
            aria-expanded={steamExpanded}
            aria-label="Steam platform menu"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <SteamLogo weight="bold" className="w-[18px] h-[18px] text-[#666666] shrink-0" />
              </div>
              <span className="text-sm truncate">Steam</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 stroke-[1.8] text-[#999999] transition-transform duration-200 shrink-0 ${steamExpanded ? "rotate-180" : ""}`} />
          </button>

          {/* Steam Submenu with vertical guide line */}
          <div className={`overflow-hidden transition-all duration-200 ease-in-out ${steamExpanded ? "max-h-[100px] opacity-100 mt-0.5 mb-1.5" : "max-h-0 opacity-0"}`}>
            <div className="flex flex-col gap-0.5 ml-6 pl-2.5 border-l border-[#E5E5E5] py-0.5">
              <Link
                to="/games?platform=Steam"
                onClick={() => setMobileMenuOpen(false)}
                className={`h-9 flex items-center justify-between pr-3 rounded-md px-2.5 transition-colors duration-150 select-none text-xs ${
                  isAllSteamActive
                    ? "text-[#111111] font-semibold bg-[#F0F0F0]"
                    : "text-[#555555] hover:text-[#111111] hover:bg-[#F8F8F8] font-medium"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Package className={`w-3.5 h-3.5 shrink-0 ${isAllSteamActive ? "text-[#333333]" : "text-[#777777]"}`} weight={isAllSteamActive ? "bold" : "regular"} />
                  <span className="truncate">All Steam Products</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 text-[#999999] shrink-0 transition-opacity ${isAllSteamActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
              </Link>
            </div>
          </div>
        </div>

        {/* 2. LOCKED PLATFORMS */}
        {lockedPlatforms.map((platform, idx) => {
          const Icon = platform.icon;
          return (
            <div
              key={idx}
              className="h-10 flex items-center justify-between px-4 rounded-lg text-[#888888] opacity-60 cursor-not-allowed select-none mx-1 my-0.5 bg-transparent"
              aria-disabled="true"
              title={`${platform.label} (Coming Soon)`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <Icon className="w-[18px] h-[18px] text-[#888888] stroke-[1.8] shrink-0" />
                </div>
                <span className="text-sm font-medium text-[#888888] truncate">{platform.label}</span>
              </div>
              <LockSimple className="w-3.5 h-3.5 text-[#AAAAAA] shrink-0" weight="bold" />
            </div>
          );
        })}
      </div>
    );
  };

  const renderDealsSubmenu = () => {
    return (
      <div className={`overflow-hidden transition-all duration-200 ease-in-out ${openAccordion === "deals" ? "max-h-[300px] opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
        <div className="flex flex-col gap-0.5 ml-4 border-l border-[#E5E5E5]/70 py-1">
          {[
            { label: "Today's Deals", path: "/offers", icon: BadgePercent },
            { label: "Under ₹49", path: "/games?maxPrice=49", icon: Tag },
            { label: "Under ₹99", path: "/games?maxPrice=99", icon: Tag },
            { label: "Under ₹199", path: "/games?maxPrice=199", icon: Tag },
            { label: "Premium Deals", path: "/games?minSteamPrice=1500", icon: Tags }
          ].map((item, idx) => 
            renderMenuItem({
              key: idx,
              label: item.label,
              path: item.path,
              icon: item.icon,
              isSubmenu: true
            })
          )}
        </div>
      </div>
    );
  };

  const renderAccountSection = () => {
    return (
      <div className="flex flex-col gap-0.5">
        {user ? (
          <>
            {renderMenuItem({ label: "My Account", path: "/dashboard", icon: User })}
            {renderMenuItem({ 
              label: "Log Out", 
              path: "#logout", 
              icon: LogOut,
              onClick: async () => {
                await handleLogout();
              }
            })}
          </>
        ) : (
          <>
            {renderMenuItem({ label: "Login", path: "/login", icon: User })}
            {renderMenuItem({ label: "Sign Up", path: "/signup", icon: User })}
          </>
        )}
      </div>
    );
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

          {/* Desktop Navigation Menus */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-[#555555] select-none h-full">
            
            {/* STEAM Dropdown */}
            {(() => {
              const active = categories.some(cat => isItemActive(`/games?category=${cat.id}`)) || isItemActive("/games");
              return (
                <div className="relative group py-4 h-full flex items-center">
                  <button className={`flex items-center gap-1.5 hover:text-[#B50000] transition h-full ${active ? "text-[#222222] font-semibold" : ""}`}>
                    <span>Steam</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 ${active ? "text-[#B50000]" : "text-[#999999]"}`} />
                  </button>
                  <div className="absolute left-0 top-full w-52 bg-white border border-[#E5E5E5] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] py-1.5 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-[10px] font-semibold text-zinc-400 tracking-[0.08em] uppercase px-4 py-1.5 block select-none border-b border-[#F5F5F5] mb-1">Steam Catalog</span>
                    {categories
                      .filter(c => ["Action", "Open World", "RPG", "Racing", "Horror", "Adventure", "Fighting"].includes(c.name))
                      .map(cat => 
                        renderDropdownItem({
                          key: cat.id,
                          label: cat.name,
                          path: `/games?category=${cat.id}`,
                          icon: Gamepad2
                        })
                      )}
                  </div>
                </div>
              );
            })()}

            {/* CATEGORIES Dropdown */}
            {(() => {
              const active = categories.some(cat => isItemActive(`/games?category=${cat.id}`));
              return (
                <div className="relative group py-4 h-full flex items-center">
                  <button className={`flex items-center gap-1.5 hover:text-[#B50000] transition h-full ${active ? "text-[#222222] font-semibold" : ""}`}>
                    <span>Categories</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 ${active ? "text-[#B50000]" : "text-[#999999]"}`} />
                  </button>
                  <div className="absolute left-0 top-full w-52 max-h-[300px] overflow-y-auto bg-white border border-[#E5E5E5] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] py-1.5 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 scrollbar-thin">
                    {categories.map(cat => 
                      renderDropdownItem({
                        key: cat.id,
                        label: cat.name,
                        path: `/games?category=${cat.id}`,
                        icon: Gamepad2
                      })
                    )}
                  </div>
                </div>
              );
            })()}

            {/* DEALS Dropdown */}
            {(() => {
              const active = ["/offers", "/games?maxPrice=49", "/games?maxPrice=99", "/games?maxPrice=199", "/games?minSteamPrice=1500"].some(p => isItemActive(p));
              return (
                <div className="relative group py-4 h-full flex items-center">
                  <button className={`flex items-center gap-1.5 hover:text-[#B50000] transition h-full ${active ? "text-[#222222] font-semibold" : ""}`}>
                    <span>Deals</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 ${active ? "text-[#B50000]" : "text-[#999999]"}`} />
                  </button>
                  <div className="absolute left-0 top-full w-48 bg-white border border-[#E5E5E5] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] py-1.5 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    {[
                      { label: "Today's Deals", path: "/offers", icon: Tag },
                      { label: "Under ₹49", path: "/games?maxPrice=49", icon: Tag },
                      { label: "Under ₹99", path: "/games?maxPrice=99", icon: Tag },
                      { label: "Under ₹199", path: "/games?maxPrice=199", icon: Tag },
                      { label: "Premium Deals", path: "/games?minSteamPrice=1500", icon: Tag }
                    ].map((item, idx) => 
                      renderDropdownItem({
                        key: idx,
                        label: item.label,
                        path: item.path,
                        icon: item.icon
                      })
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ALL Games */}
            {(() => {
              const active = isItemActive("/games");
              return (
                <Link to="/games" className={`hover:text-[#B50000] py-4 transition h-full flex items-center ${active ? "text-[#222222] font-semibold" : ""}`}>
                  All Games
                </Link>
              );
            })()}

            {/* SUPPORT Dropdown */}
            {(() => {
              const active = ["/contact", "/faq"].some(p => isItemActive(p));
              return (
                <div className="relative group py-4 h-full flex items-center">
                  <button className={`flex items-center gap-1.5 hover:text-[#B50000] transition h-full ${active ? "text-[#222222] font-semibold" : ""}`}>
                    <span>Support</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 ${active ? "text-[#B50000]" : "text-[#999999]"}`} />
                  </button>
                  <div className="absolute left-0 top-full w-52 bg-white border border-[#E5E5E5] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] py-1.5 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    {renderDropdownItem({
                      label: "WhatsApp Support",
                      path: "https://wa.me/916379490178",
                      icon: FaWhatsapp
                    })}
                    {renderDropdownItem({
                      label: "Contact Us",
                      path: "/contact",
                      icon: Mail
                    })}
                    {renderDropdownItem({
                      label: "FAQ",
                      path: "/faq",
                      icon: HelpCircle
                    })}
                  </div>
                </div>
              );
            })()}

          </nav>

          {/* Search bar desktop */}
          <div ref={searchRef} className="hidden md:block flex-1 max-w-lg relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999] pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                aria-label="Search games"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchFocused(true);
                }}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                className="cg39-search-input"
              />
              {searchQuery && (
                <button 
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                    setSelectedIndex(-1);
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Suggestions Panel */}
            {searchFocused && searchQuery && (
              <div 
                className="cg39-search-dropdown"
                role="listbox"
                aria-label="Search suggestions"
              >
                {searchResults.length > 0 ? (
                  <>
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
                          className={`flex items-center gap-3.5 px-4 py-3 cursor-pointer border-b border-[#F0F0F0] last:border-0 transition-all duration-100 ${
                            selectedIndex === i ? "bg-[#F5F5F5]" : "hover:bg-[#F8F8F8]"
                          }`}
                          role="option"
                          aria-selected={selectedIndex === i}
                        >
                          <img
                            src={game.image_url}
                            alt={game.title}
                            loading="lazy"
                            className="w-11 h-11 object-cover rounded-lg bg-black/5 shrink-0"
                          />
                          <div className="flex-grow min-w-0">
                            <p className="text-[#222222] text-[13px] font-bold truncate leading-tight">{game.title}</p>
                            {game.categories?.name && (
                              <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">{game.categories.name}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {disc > 0 && (
                              <span className="text-[9px] bg-[#E10600] text-white font-extrabold px-1.5 py-0.5 rounded">-{disc}%</span>
                            )}
                            <div className="text-right">
                              <span className="text-[#E10600] text-xs font-black block">₹{game.price?.toLocaleString()}</span>
                              {disc > 0 && (
                                <span className="text-[9px] text-zinc-400 line-through">₹{game.steam_price?.toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <button
                      onClick={() => {
                        navigate(`/games?search=${encodeURIComponent(searchQuery)}`);
                        setSearchFocused(false);
                        setSelectedIndex(-1);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 p-3.5 text-xs text-[#222222] hover:text-[#E10600] bg-[#F9FAF9] hover:bg-[#F3F4F3] cursor-pointer font-bold uppercase tracking-wider transition border-t border-[#E5E5E5]"
                    >
                      View all results
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </>
                ) : (
                  <div className="p-6 text-center flex flex-col items-center justify-center gap-2 select-none">
                    <Search className="w-8 h-8 text-zinc-400 mb-0.5" />
                    <p className="text-sm font-bold text-[#222222]">No games found</p>
                    <p className="text-xs text-zinc-500">Try another game or category</p>
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
            <Link
              to="/cart"
              id="header-cart-icon"
              aria-label="Shopping cart"
              className={`relative p-2.5 text-[#555555] hover:text-[#111111] transition min-w-[44px] min-h-[44px] flex items-center justify-center header-cart-btn ${
                isCartPulsing ? "scale-125 text-[#E00000] duration-300 header-cart-pulse" : "active:scale-95 duration-150"
              }`}
            >
              {showCartCheck ? (
                <Check className="w-5 h-5 text-[#E10600]" weight="bold" />
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#E00000] text-white text-[8px] rounded-full w-[14px] h-[14px] flex items-center justify-center font-bold leading-none">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger menu button — hidden on desktop, visible on mobile/tablet */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 text-[#555555] hover:text-[#111111] transition active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

          </div>
        </div>
      </header>

      {/* MOBILE FULL-SCREEN NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/35 transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative z-10 w-[85vw] max-w-[320px] h-[100dvh] bg-white border-r border-[#E5E5E5] shadow-xl flex flex-col justify-between font-sans select-none text-[#222222]">
            
            {/* STICKY HEADER */}
            <div className="bg-white flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] shrink-0">
              <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <img loading="lazy" src={logo} alt="CG39" className="w-8 h-8 object-contain" />
                <span className="text-sm font-extrabold text-[#222222] uppercase tracking-tight">
                  CG<span className="text-[#B50000]">39</span> <span className="text-[9px] text-[#999999] font-black uppercase tracking-wider ml-1">GAME STORE</span>
                </span>
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#666666] hover:text-[#222222] p-1.5"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable portion */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 flex flex-col gap-0.5">

              {/* SEARCH INPUT BAR */}
              <div className="px-4 mb-4">
                <form onSubmit={(e) => { handleSearchSubmit(e); setMobileMenuOpen(false); }} className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999] pointer-events-none" />
                  <input
                    ref={mobileSearchInputRef}
                    type="text"
                    placeholder="Search games..."
                    value={searchQuery}
                    aria-label="Search games"
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchFocused(true);
                    }}
                    className="cg39-search-input"
                  />
                  {searchQuery && (
                    <button 
                      type="button"
                      aria-label="Clear search"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                        setSelectedIndex(-1);
                        mobileSearchInputRef.current?.focus();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>
                {/* Mobile live results */}
                {searchQuery && (
                  <div className="mt-2 bg-white border border-[#E5E5E5] rounded-[14px] overflow-hidden shadow-lg">
                    {searchResults.length > 0 ? (
                      <>
                        {searchResults.slice(0, 5).map((game) => {
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
                              className="flex items-center gap-3.5 px-4 py-3 cursor-pointer hover:bg-[#F8F8F8] border-b border-[#F0F0F0] last:border-0 transition min-h-[44px]"
                            >
                              <img 
                                src={game.image_url} 
                                alt={game.title} 
                                className="w-11 h-11 object-cover rounded-lg bg-black/5 shrink-0" 
                              />
                              <div className="flex-grow min-w-0">
                                <p className="text-[#222222] text-xs font-bold truncate leading-tight">{game.title}</p>
                                {game.categories?.name && (
                                  <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">{game.categories.name}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {disc > 0 && <span className="text-[9px] bg-[#E10600] text-white font-extrabold px-1.5 py-0.5 rounded">-{disc}%</span>}
                                <span className="text-xs font-black text-[#E10600]">₹{game.price?.toLocaleString()}</span>
                              </div>
                            </div>
                          );
                        })}
                        <button
                          onClick={() => {
                            navigate(`/games?search=${encodeURIComponent(searchQuery)}`);
                            setMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 p-3 text-xs text-[#222222] hover:text-[#E10600] font-bold uppercase tracking-wider bg-[#F9FAF9] hover:bg-[#F3F4F3] border-t border-[#E5E5E5] transition cursor-pointer"
                        >
                          View all results <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      </>
                    ) : (
                      <div className="p-5 text-center flex flex-col items-center justify-center gap-1.5 select-none">
                        <Search className="w-6 h-6 text-zinc-400 mb-0.5" />
                        <p className="text-xs font-bold text-[#222222]">No games found</p>
                        <p className="text-[10px] text-zinc-500">Try another game or category</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* STORE SECTION */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-zinc-500 tracking-[0.08em] uppercase px-4 mb-1 mt-1 block select-none">Store</span>
                {renderMenuItem({ label: "Home", path: "/", icon: Home })}
                {renderMenuItem({ label: "PC Game Catalog", path: "/games", icon: Gamepad2 })}
              </div>

              {/* PLATFORMS SECTION */}
              <div className="flex flex-col gap-0.5 mt-4">
                <span className="text-[10px] font-semibold text-zinc-500 tracking-[0.08em] uppercase px-4 mb-1 block select-none">Platforms</span>
                {renderPlatformsSection()}
              </div>

              {/* DEALS & OFFERS */}
              <div className="flex flex-col gap-0.5 mt-4">
                <span className="text-[10px] font-semibold text-zinc-500 tracking-[0.08em] uppercase px-4 mb-1 block select-none">Deals & Offers</span>
                {renderAccordionHeader({ label: "Deals & Offers", icon: Tags, id: "deals" })}
                {renderDealsSubmenu()}
              </div>

              {/* ACCOUNT SECTION */}
              <div className="flex flex-col gap-0.5 mt-5">
                <span className="text-[10px] font-semibold text-zinc-500 tracking-[0.08em] uppercase px-4 mb-1 block select-none">Account</span>
                {renderAccountSection()}
              </div>

            </div>

            {/* BOTTOM SUPPORT SECTION */}
            <div className="px-2 py-4 border-t border-[#E5E5E5] bg-[#FFFFFF] flex flex-col gap-0.5 select-none shrink-0">
              <span className="text-[10px] font-semibold text-zinc-500 tracking-[0.08em] uppercase px-4 mb-1 block">Support</span>
              {renderMenuItem({ label: "WhatsApp Support", path: "https://wa.me/916379490178", icon: FaWhatsapp })}
              {renderMenuItem({ label: "Contact Us", path: "/contact", icon: Mail })}
              {renderMenuItem({ label: "FAQ", path: "/faq", icon: HelpCircle })}
            </div>

          </div>
        </div>
      )}
    </>
  );
};