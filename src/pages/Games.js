import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  X, 
  Tag, 
  RotateCcw,
  ShieldCheck,
  MessageCircle,
  BadgeCheck,
  Package,
  Swords,
  Compass,
  Shield,
  Car,
  Skull,
  Flame,
  Gamepad,
  Gamepad2,
  Headphones,
  Sliders,
  TrendingUp,
  Gift
} from "lucide-react";
import { GameCard } from "../components/GameCard";
import { Breadcrumbs } from "../components/Breadcrumbs";

const API = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const LIMIT = 12; // 12 items fills 4-column and 3-column grids perfectly!

const Games = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract filters from URL query parameters (URL STATE SYNCHRONIZATION)
  const searchVal = searchParams.get("search") || "";
  const categoryVal = searchParams.get("category") || "";
  const maxPriceVal = searchParams.get("maxPrice") || "";
  const minSteamPriceVal = searchParams.get("minSteamPrice") || "";
  const sortByVal = searchParams.get("sortBy") || "";
  const pageVal = parseInt(searchParams.get("page") || "0", 10);

  const [allGames, setAllGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Sync inputs locally to avoid sluggish typing before committing to URL
  const [localSearch, setLocalSearch] = useState(searchVal);

  useEffect(() => {
    setLocalSearch(searchVal);
  }, [searchVal]);

  /* ================= FETCH GAMES & CATEGORIES ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [gamesRes, catsRes] = await Promise.all([
          axios.get(`${API}/api/games`),
          axios.get(`${API}/api/categories`)
        ]);
        setAllGames(gamesRes.data || []);
        setCategories(catsRes.data || []);
      } catch (err) {
        console.error("Games page fetch error:", err);
        setError("Failed to load catalog games");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  /* ================= URL FILTER MUTATOR ================= */
  const handleFilterChange = (keyOrObject, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (typeof keyOrObject === "object" && keyOrObject !== null) {
      // Batch update
      Object.entries(keyOrObject).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
          newParams.set(k, v);
        } else {
          newParams.delete(k);
        }
      });
      // Reset page index on filter changes
      if (!keyOrObject.hasOwnProperty("page")) {
        newParams.delete("page");
      }
    } else {
      // Single update
      if (value !== undefined && value !== null && value !== "") {
        newParams.set(keyOrObject, value);
      } else {
        newParams.delete(keyOrObject);
      }
      if (keyOrObject !== "page") {
        newParams.delete("page");
      }
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setLocalSearch("");
  };

  const getSelectedCategoryId = () => {
    if (!categoryVal) return "";
    const match = categories.find(
      c => String(c.id) === String(categoryVal) || 
           c.name.toLowerCase() === String(categoryVal).toLowerCase()
    );
    return match ? match.id : categoryVal;
  };

  // Find Category Name for Chips
  const getCategoryName = (catIdOrName) => {
    const match = categories.find(
      c => String(c.id) === String(catIdOrName) || 
           c.name.toLowerCase() === String(catIdOrName).toLowerCase()
    );
    return match ? match.name : catIdOrName;
  };

  // Find Sort Label for Chips
  const getSortLabel = () => {
    if (sortByVal === "price_asc") return "Price: Low to High";
    if (sortByVal === "price_desc") return "Price: High to Low";
    if (sortByVal === "newest") return "Newest";
    if (sortByVal === "discount") return "Highest Discount";
    return "";
  };

  /* ================= COMBINED FILTER & SORT LOGIC ================= */
  const filteredGames = useMemo(() => {
    let result = [...allGames];

    // 1. Search Query Match
    if (searchVal) {
      const q = searchVal.toLowerCase();
      result = result.filter(g => 
        g.title?.toLowerCase().includes(q) || 
        g.description?.toLowerCase().includes(q) ||
        g.categories?.name?.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (categoryVal) {
      const match = categories.find(
        c => String(c.id) === String(categoryVal) || 
             c.name.toLowerCase() === String(categoryVal).toLowerCase()
      );
      if (match) {
        result = result.filter(g => String(g.category_id) === String(match.id));
      } else {
        result = result.filter(g => String(g.category_id) === String(categoryVal));
      }
    }

    // 3. Price Filter (maxPrice)
    if (maxPriceVal) {
      result = result.filter(g => g.price <= Number(maxPriceVal));
    }

    // 4. AAA Deals (minSteamPrice)
    if (minSteamPriceVal) {
      result = result.filter(g => g.steam_price >= Number(minSteamPriceVal));
    }

    // 5. Sorting Controls
    if (sortByVal === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortByVal === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortByVal === "newest") {
      result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (sortByVal === "discount") {
      result.sort((a, b) => {
        const discA = a.steam_price > a.price ? (a.steam_price - a.price) / a.steam_price : 0;
        const discB = b.steam_price > b.price ? (b.steam_price - b.price) / b.steam_price : 0;
        return discB - discA;
      });
    } else {
      // Default: Recommended / Sort display order
      result.sort((a, b) => (a.display_order || 999) - (b.display_order || 999));
    }

    return result;
  }, [allGames, categories, searchVal, categoryVal, maxPriceVal, minSteamPriceVal, sortByVal]);

  // Pagination bounds
  const totalPages = Math.ceil(filteredGames.length / LIMIT);
  const paginatedGames = useMemo(() => {
    const startIndex = pageVal * LIMIT;
    return filteredGames.slice(startIndex, startIndex + LIMIT);
  }, [filteredGames, pageVal]);

  // Debounce search input to prevent back-stack bloat and query lag
  useEffect(() => {
    const handler = setTimeout(() => {
      const currentSearch = searchParams.get("search") || "";
      if (localSearch !== currentSearch) {
        handleFilterChange("search", localSearch);
      }
    }, 400);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch, searchParams]);

  // Debounced input submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFilterChange("search", localSearch);
  };

  // Count active filters for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchVal) count++;
    if (categoryVal) count++;
    if (maxPriceVal) count++;
    if (minSteamPriceVal) count++;
    if (sortByVal) count++;
    return count;
  }, [searchVal, categoryVal, maxPriceVal, minSteamPriceVal, sortByVal]);

  // Lock body scroll when mobile sheet open
  useEffect(() => {
    if (filterDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [filterDrawerOpen]);

  // Close sheet on Escape key down
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setFilterDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Map category names to appropriate Lucide icons
  const categoryIconMap = {
    "action": Swords,
    "open world": Compass,
    "rpg": Shield,
    "racing": Car,
    "horror": Skull,
    "survival": Flame,
    "fighting": Swords,
    "steam": Gift,
    "pc": Gamepad,
  };

  const getCategoryIcon = (name) => {
    const key = name.toLowerCase();
    for (const [pattern, icon] of Object.entries(categoryIconMap)) {
      if (key.includes(pattern)) return icon;
    }
    return Gamepad;
  };

  // Breadcrumb helper label
  const getBreadcrumbLabel = () => {
    if (categoryVal) return getCategoryName(categoryVal);
    if (searchVal) return "Search";
    return "";
  };

  const renderBreadcrumbs = () => {
    const paths = [{ label: "Games", path: "/games" }];
    const label = getBreadcrumbLabel();
    if (label) {
      if (categoryVal) {
        const catId = getSelectedCategoryId();
        paths.push({ label, path: `/games?category=${catId}` });
      } else {
        paths.push({ label });
      }
    }
    return <Breadcrumbs paths={paths} />;
  };

  // Desktop Categories Navigation list
  const renderDesktopCategories = () => {
    if (categories.length === 0) return null;
    return (
      <div className="hidden md:flex flex-wrap gap-2 mb-8 items-center border-b border-white/5 pb-6">
        <button
          onClick={() => handleFilterChange("category", "")}
          className={`h-9 flex items-center gap-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-150 ${
            !categoryVal
              ? "bg-[#E10600] border-[#E10600] text-white"
              : "bg-[#F5F5F5] border-[#E5E5E5] text-[#555555] hover:text-[#111111] hover:border-[#D4D4D4]"
          }`}
        >
          <Gamepad className="w-3.5 h-3.5" />
          <span>All Games</span>
        </button>
        {categories.map((cat) => {
          const IconComp = getCategoryIcon(cat.name);
          const isSelected = String(categoryVal) === String(cat.id) ||
                             cat.name.toLowerCase() === String(categoryVal).toLowerCase();
          return (
            <button
              key={cat.id}
              onClick={() => handleFilterChange("category", cat.id)}
              className={`h-9 flex items-center gap-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-150 ${
                isSelected
                  ? "bg-[#E10600] border-[#E10600] text-white"
                  : "bg-[#F5F5F5] border-[#E5E5E5] text-[#555555] hover:text-[#111111] hover:border-[#D4D4D4]"
              }`}
            >
              <IconComp className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-zinc-500"}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    );
  };

  // Compact active filter chips block
  const renderFilterChips = () => {
    if (!searchVal && !categoryVal && !maxPriceVal && !minSteamPriceVal && !sortByVal) return null;
    return (
      <div className="flex flex-wrap gap-2 items-center mb-8 bg-[#0D0D0D] border border-white/8 rounded-2xl p-4">
        <span className="text-[10px] uppercase text-zinc-500 tracking-wider font-extrabold mr-2">Filters:</span>
        
        {searchVal && (
          <span className="flex items-center gap-1.5 bg-[#141414] text-white border border-white/8 px-3 py-1 rounded-full text-xs font-bold transition">
            Search: "{searchVal}"
            <button onClick={() => handleFilterChange("search", "")} className="text-zinc-500 hover:text-[#E10600] ml-1" aria-label="Remove search filter"><X className="w-3 h-3" /></button>
          </span>
        )}

        {categoryVal && categories.length > 0 && (
          <span className="flex items-center gap-1.5 bg-[#141414] text-white border border-white/8 px-3 py-1 rounded-full text-xs font-bold transition">
            {getCategoryName(categoryVal)}
            <button onClick={() => handleFilterChange("category", "")} className="text-zinc-500 hover:text-[#E10600] ml-1" aria-label="Remove category filter"><X className="w-3 h-3" /></button>
          </span>
        )}

        {maxPriceVal && (
          <span className="flex items-center gap-1.5 bg-[#141414] text-white border border-white/8 px-3 py-1 rounded-full text-xs font-bold transition">
            Under ₹{maxPriceVal}
            <button onClick={() => handleFilterChange("maxPrice", "")} className="text-zinc-500 hover:text-[#E10600] ml-1" aria-label="Remove price filter"><X className="w-3 h-3" /></button>
          </span>
        )}

        {minSteamPriceVal && (
          <span className="flex items-center gap-1.5 bg-[#141414] text-white border border-white/8 px-3 py-1 rounded-full text-xs font-bold transition">
            {minSteamPriceVal === "1500" ? "AAA Deals" : `Steam Value ₹${minSteamPriceVal}+`}
            <button onClick={() => handleFilterChange("minSteamPrice", "")} className="text-zinc-500 hover:text-[#E10600] ml-1" aria-label="Remove steam value filter"><X className="w-3 h-3" /></button>
          </span>
        )}

        {sortByVal && (
          <span className="flex items-center gap-1.5 bg-[#141414] text-white border border-white/8 px-3 py-1 rounded-full text-xs font-bold transition">
            Sort: {getSortLabel()}
            <button onClick={() => handleFilterChange("sortBy", "")} className="text-zinc-500 hover:text-[#E10600] ml-1" aria-label="Remove sort filter"><X className="w-3 h-3" /></button>
          </span>
        )}

        <button 
          onClick={handleResetFilters}
          className="text-xs text-zinc-500 hover:text-[#E10600] font-bold ml-auto flex items-center gap-1 transition uppercase tracking-wider"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Clear All
        </button>
      </div>
    );
  };

  // Trust Strip Section
  const renderTrustStrip = () => (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-white/8 py-5 mb-8 text-center bg-[#0D0D0D]/30 rounded-2xl px-4 select-none">
      <div className="flex items-center justify-center md:justify-start gap-2 px-1">
        <ShieldCheck className="w-5 h-5 text-[#E10600] shrink-0" />
        <div className="text-left flex flex-col justify-center leading-tight">
          <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">Secure Payments</span>
          <span className="text-[8px] sm:text-[9px] text-zinc-500 font-normal">100% verified transactions</span>
        </div>
      </div>
      <div className="flex items-center justify-center md:justify-start gap-2 px-1">
        <MessageCircle className="w-5 h-5 text-[#E10600] shrink-0" />
        <div className="text-left flex flex-col justify-center leading-tight">
          <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">WhatsApp Support</span>
          <span className="text-[8px] sm:text-[9px] text-zinc-500 font-normal">24/7 direct client help</span>
        </div>
      </div>
      <div className="flex items-center justify-center md:justify-start gap-2 px-1">
        <BadgeCheck className="w-5 h-5 text-[#E10600] shrink-0" />
        <div className="text-left flex flex-col justify-center leading-tight">
          <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">Verified Process</span>
          <span className="text-[8px] sm:text-[9px] text-zinc-500 font-normal">Direct Steam credentials</span>
        </div>
      </div>
      <div className="flex items-center justify-center md:justify-start gap-2 px-1">
        <Package className="w-5 h-5 text-[#E10600] shrink-0" />
        <div className="text-left flex flex-col justify-center leading-tight">
          <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">Digital Delivery</span>
          <span className="text-[8px] sm:text-[9px] text-zinc-500 font-normal">Instant activation codes</span>
        </div>
      </div>
    </section>
  );

  // Desktop Page Pagination numbers
  const renderDesktopPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;
    
    let startPage = Math.max(0, pageVal - 2);
    let endPage = Math.min(totalPages - 1, pageVal + 2);
    
    if (pageVal <= 2) {
      endPage = Math.min(totalPages - 1, maxVisible - 1);
    }
    if (pageVal >= totalPages - 3) {
      startPage = Math.max(0, totalPages - maxVisible);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="flex gap-2">
        {startPage > 0 && (
          <>
            <button
              onClick={() => { handleFilterChange("page", "0"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold bg-white hover:bg-[#F5F5F5] text-[#555555] hover:text-[#111111] border border-[#E5E5E5] transition"
              aria-label="Go to page 1"
            >
              1
            </button>
            {startPage > 1 && <span className="text-zinc-500 self-end px-1 pb-1">...</span>}
          </>
        )}
        
        {pageNumbers.map(p => (
          <button
            key={p}
            onClick={() => {
              handleFilterChange("page", String(p));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold border transition ${
              pageVal === p
                ? "bg-[#E10600] border-[#E10600] text-white"
                : "bg-white border-[#E5E5E5] text-[#555555] hover:text-[#111111] hover:border-[#D4D4D4]"
            }`}
            aria-label={`Go to page ${p + 1}`}
          >
            {p + 1}
          </button>
        ))}

        {endPage < totalPages - 1 && (
          <>
            {endPage < totalPages - 2 && <span className="text-zinc-500 self-end px-1 pb-1">...</span>}
            <button
              onClick={() => { handleFilterChange("page", String(totalPages - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold bg-white hover:bg-[#F5F5F5] text-[#555555] hover:text-[#111111] border border-[#E5E5E5] transition"
              aria-label={`Go to page ${totalPages}`}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
    );
  };

  // Mobile pagination controls
  const renderMobilePagination = () => (
    <div className="flex items-center justify-between gap-4 w-full px-2">
      <button
        onClick={() => {
          handleFilterChange("page", String(Math.max(0, pageVal - 1)));
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        disabled={pageVal === 0}
        className="flex-1 bg-[#141414] disabled:opacity-40 text-white rounded-xl min-h-[44px] flex items-center justify-center text-xs font-bold uppercase tracking-wider border border-white/8 transition"
        aria-label="Previous page"
      >
        Previous
      </button>
      <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400 whitespace-nowrap">
        Page <span className="text-white font-bold">{pageVal + 1}</span> of <span className="text-white font-bold">{totalPages}</span>
      </span>
      <button
        onClick={() => {
          handleFilterChange("page", String(Math.min(totalPages - 1, pageVal + 1)));
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        disabled={pageVal >= totalPages - 1}
        className="flex-1 bg-[#141414] disabled:opacity-40 text-white rounded-xl min-h-[44px] flex items-center justify-center text-xs font-bold uppercase tracking-wider border border-white/8 transition"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-[76px] md:pt-[82px] pb-16 px-4 sm:px-6 font-sans">
      <div className="max-w-[1400px] mx-auto animate-page-section">
        
        {/* BREADCRUMB */}
        {renderBreadcrumbs()}

        {/* PAGE INTRO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4">
          <div>
            <h1 className="text-3xl sm:text-[42px] font-extrabold uppercase tracking-tight leading-none mb-3">
              Explore <span className="text-[#E10600]">Games</span>
            </h1>
            <p className="text-[#A1A1AA] text-xs sm:text-sm max-w-xl">
              Discover PC games across genres and price ranges.
            </p>
          </div>

          <div className="text-[#A1A1AA] text-xs uppercase tracking-wider font-bold shrink-0 hidden md:block select-none">
            {!loading && (
              <span>{filteredGames.length} {filteredGames.length === 1 ? "game" : "games"} available</span>
            )}
          </div>
        </div>

        {/* Dynamic Categories list (Desktop) */}
        {renderDesktopCategories()}

        {/* SEARCH AND FILTERS TOOLBAR (DESKTOP) */}
        <div className="hidden md:flex items-center justify-between gap-4 mb-6 bg-[#0D0D0D] border border-white/8 rounded-xl p-3 h-14">
          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-[500px]">
            <Search className="absolute left-4 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search games..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-[#141414] border border-white/8 rounded-lg pl-10 pr-8 py-2 text-xs text-white focus:border-[#E10600] outline-none transition-all duration-150 focus:ring-1 focus:ring-[#E10600]/30"
            />
            {localSearch && (
              <button 
                type="button"
                onClick={() => {
                  setLocalSearch("");
                  handleFilterChange("search", "");
                }}
                className="absolute right-2.5 top-2.5 p-0.5 hover:bg-white/5 rounded-full text-gray-400"
                aria-label="Clear search text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          <div className="flex items-center gap-3">
            {/* Price Range Dropdown */}
            <select
              value={minSteamPriceVal === "1500" ? "aaa" : maxPriceVal}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "aaa") {
                  handleFilterChange({ maxPrice: "", minSteamPrice: "1500" });
                } else if (val) {
                  handleFilterChange({ minSteamPrice: "", maxPrice: val });
                } else {
                  handleFilterChange({ minSteamPrice: "", maxPrice: "" });
                }
              }}
              className="bg-[#141414] border border-white/8 rounded-lg px-3 py-2 text-xs text-white outline-none cursor-pointer hover:border-white/20 transition"
              aria-label="Filter by Price"
            >
              <option value="">All Prices</option>
              <option value="49">Under ₹49</option>
              <option value="99">Under ₹99</option>
              <option value="199">Under ₹199</option>
              <option value="aaa">AAA Deals (Steam ₹1500+)</option>
            </select>

            {/* Steam Value Select dropdown */}
            <select
              value={minSteamPriceVal !== "1500" ? minSteamPriceVal : ""}
              onChange={(e) => {
                const val = e.target.value;
                handleFilterChange({ maxPrice: "", minSteamPrice: val });
              }}
              className="bg-[#141414] border border-white/8 rounded-lg px-3 py-2 text-xs text-white outline-none cursor-pointer hover:border-white/20 transition"
              aria-label="Filter by Steam Value"
            >
              <option value="">Steam Value</option>
              <option value="500">₹500+</option>
              <option value="1000">₹1000+</option>
              <option value="2000">₹2000+</option>
            </select>

            {/* Sorting Control */}
            <select
              value={sortByVal}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="bg-[#141414] border border-white/8 rounded-lg px-3 py-2 text-xs text-white outline-none cursor-pointer hover:border-white/20 transition font-bold"
              aria-label="Sort games"
            >
              <option value="">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex flex-col gap-3 md:hidden mb-6">
          {/* Prominent Full-Width Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search games..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-[#141414] border border-white/8 rounded-xl pl-10 pr-8 py-2.5 text-xs text-white focus:border-[#E10600] focus:ring-1 focus:ring-[#E10600]/30 outline-none"
            />
            {localSearch && (
              <button 
                type="button"
                onClick={() => {
                  setLocalSearch("");
                  handleFilterChange("search", "");
                }}
                className="absolute right-3.5 top-3 p-0.5"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Filters & Sorting Bottom Sheet Trigger */}
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-[#0D0D0D] border border-white/8 hover:bg-[#141414] text-white rounded-xl py-3 px-4 font-bold text-xs uppercase tracking-wider transition active:scale-[0.97]"
            aria-label="Open filter sheet"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#E10600]" />
            Filters & Sorting {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        {/* ACTIVE FILTER CHIPS ROW */}
        {renderFilterChips()}

        {/* TRUST STRIP BADGES */}
        {renderTrustStrip()}

        {/* Mobile results header */}
        <div className="text-[#A1A1AA] text-xs uppercase tracking-wider font-extrabold mb-4 block md:hidden select-none px-1">
          {!loading && (
            <span>{filteredGames.length} {filteredGames.length === 1 ? "game" : "games"} found</span>
          )}
        </div>

        {/* LOADING STATES (SKELETON SHIMMER CARDS) */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
            {[...Array(LIMIT)].map((_, index) => (
              <div
                key={index}
                className="bg-[#141414] rounded-2xl overflow-hidden border border-white/8 animate-pulse h-[340px]"
              >
                <div className="aspect-[16/10] bg-[#1a1a1a]"></div>
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-[#1a1a1a] rounded w-1/4"></div>
                  <div className="h-4 bg-[#1a1a1a] rounded w-3/4"></div>
                  <div className="h-4 bg-[#1a1a1a] rounded w-1/2"></div>
                  <div className="h-9 bg-[#1a1a1a] rounded-xl w-full pt-4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {error && !loading && (
          <div className="text-center text-red-500 py-16 bg-[#141414] border border-white/8 rounded-2xl">
            <p className="text-lg font-bold">{error}</p>
          </div>
        )}

        {/* GRID OF PAGINATED GAMES */}
        {!loading && paginatedGames.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
            {paginatedGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && paginatedGames.length === 0 && !error && (
          <div className="text-center py-20 bg-[#0d0d0d] border border-white/8 rounded-3xl p-8 max-w-lg mx-auto shadow-xl select-none">
            <div className="bg-black/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 border border-white/5">
              <Search className="w-7 h-7 text-zinc-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2 uppercase tracking-tight text-white">NO GAMES FOUND</h3>
            <p className="text-gray-400 text-xs mb-6 uppercase tracking-wider max-w-xs mx-auto leading-normal">
              Try another search phrase or adjust your category and pricing filter thresholds.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleResetFilters}
                className="bg-[#E10600] hover:bg-[#ff1a13] text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition active:scale-[0.98] min-h-[44px]"
              >
                Clear Filters
              </button>
              <button
                onClick={() => {
                  setSearchParams({});
                  setLocalSearch("");
                }}
                className="bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition text-white min-h-[44px]"
              >
                Browse All Games
              </button>
            </div>
          </div>
        )}

        {/* PAGINATION NAVIGATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-8 border-t border-white/8 pt-6 select-none">
            {/* Desktop Pagination */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => {
                  handleFilterChange("page", String(Math.max(0, pageVal - 1)));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={pageVal === 0}
                className="bg-[#141414] hover:bg-[#1f1f1f] text-white py-2.5 px-4 rounded-xl border border-white/8 disabled:opacity-40 transition text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 active:scale-[0.98]"
                aria-label="Previous page"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              {renderDesktopPageNumbers()}
              <button
                onClick={() => {
                  handleFilterChange("page", String(Math.min(totalPages - 1, pageVal + 1)));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={pageVal >= totalPages - 1}
                className="bg-[#141414] hover:bg-[#1f1f1f] text-white py-2.5 px-4 rounded-xl border border-white/8 disabled:opacity-40 transition text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 active:scale-[0.98]"
                aria-label="Next page"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>

            {/* Mobile Pagination */}
            <div className="flex md:hidden w-full">
              {renderMobilePagination()}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE BOTTOM SHEET DRAWER */}
      {filterDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity md:hidden"
            onClick={() => setFilterDrawerOpen(false)}
          />
          {/* Sheet Content */}
          <div className="fixed bottom-0 left-0 right-0 z-50 w-full max-h-[85vh] bg-white border-t border-[#E5E5E5] rounded-t-3xl p-6 flex flex-col shadow-2xl overflow-y-auto md:hidden">
            {/* Handle bar */}
            <div className="mx-auto w-12 h-1 bg-[#E5E5E5] rounded-full mb-4 shrink-0" />
            
            <div className="flex justify-between items-center border-b border-[#E5E5E5] pb-3 mb-5 shrink-0">
              <h3 className="text-base font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#E10600]" /> Filters & Sorting
              </h3>
              <button onClick={() => setFilterDrawerOpen(false)} className="text-zinc-400 hover:text-[#111111] p-1" aria-label="Close filters">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-5 pb-24">
              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase text-zinc-500 font-extrabold tracking-widest">Category</label>
                <select
                  value={getSelectedCategoryId()}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full bg-[#141414] border border-white/8 rounded-xl p-3 text-xs text-white outline-none cursor-pointer"
                  aria-label="Select Category"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Price Limit */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase text-zinc-500 font-extrabold tracking-widest">Price Limit</label>
                <select
                  value={minSteamPriceVal === "1500" ? "aaa" : maxPriceVal}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "aaa") {
                      handleFilterChange({ maxPrice: "", minSteamPrice: "1500" });
                    } else if (val) {
                      handleFilterChange({ minSteamPrice: "", maxPrice: val });
                    } else {
                      handleFilterChange({ minSteamPrice: "", maxPrice: "" });
                    }
                  }}
                  className="w-full bg-[#141414] border border-white/8 rounded-xl p-3 text-xs text-white outline-none cursor-pointer"
                  aria-label="Select Price Limit"
                >
                  <option value="">All Prices</option>
                  <option value="49">Under ₹49</option>
                  <option value="99">Under ₹99</option>
                  <option value="199">Under ₹199</option>
                  <option value="aaa">AAA Deals (Steam Price ₹1500+)</option>
                </select>
              </div>

              {/* Steam Value Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase text-zinc-500 font-extrabold tracking-widest">Steam Value</label>
                <select
                  value={minSteamPriceVal !== "1500" ? minSteamPriceVal : ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleFilterChange({ maxPrice: "", minSteamPrice: val });
                  }}
                  className="w-full bg-[#141414] border border-white/8 rounded-xl p-3 text-xs text-white outline-none cursor-pointer"
                  aria-label="Select Steam Value"
                >
                  <option value="">All Steam Values</option>
                  <option value="500">₹500+</option>
                  <option value="1000">₹1000+</option>
                  <option value="2000">₹2000+</option>
                </select>
              </div>

              {/* Sort Option */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase text-zinc-500 font-extrabold tracking-widest">Sort Option</label>
                <select
                  value={sortByVal}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full bg-[#141414] border border-white/8 rounded-xl p-3 text-xs text-white font-bold outline-none cursor-pointer"
                  aria-label="Select Sort Option"
                >
                  <option value="">Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="discount">Highest Discount</option>
                </select>
              </div>
            </div>

            {/* Sticky action buttons at the bottom of sheet content */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E5E5E5] p-4 flex gap-3 z-20 shrink-0">
              <button
                onClick={() => {
                  handleResetFilters();
                  setFilterDrawerOpen(false);
                }}
                className="flex-1 bg-white border border-[#E5E5E5] text-[#555555] hover:text-[#111111] hover:bg-[#F5F5F5] py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition min-h-[44px]"
                aria-label="Clear all filters"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  handleFilterChange("search", localSearch);
                  setFilterDrawerOpen(false);
                }}
                className="flex-1 bg-[#E10600] hover:bg-[#ff1a13] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition min-h-[44px]"
                aria-label="Apply filters"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Games;
