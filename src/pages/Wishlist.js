import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "sonner";
import {
  Heart,
  WarningCircle,
  ArrowsDownUp as ArrowUpDown,
  CaretDown as ChevronDown,
  CaretRight as ChevronRight
} from "@phosphor-icons/react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { GameCard } from "../components/GameCard";

const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`;

/* ─── Skeleton card matching step 1 GameCard visual structure ─── */
const SkeletonCard = () => (
  <div className="bg-white border border-[#E5E5E5] rounded-[16px] overflow-hidden flex flex-col animate-pulse">
    <div className="aspect-[16/9] bg-gray-200" />
    <div className="p-4 flex flex-col gap-3">
      <div className="h-3 bg-gray-200 rounded-lg w-1/3" />
      <div className="h-4 bg-gray-200 rounded-lg w-4/5" />
      <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
      <div className="flex gap-2 mt-1">
        <div className="h-10 flex-grow bg-gray-200 rounded-xl" />
        <div className="h-10 w-10 bg-gray-200 rounded-xl shrink-0" />
      </div>
    </div>
  </div>
);

const SORT_OPTIONS = [
  { value: "default",        label: "Default" },
  { value: "price_asc",      label: "Price: Low to High" },
  { value: "price_desc",     label: "Price: High to Low" },
  { value: "discount_desc",  label: "Highest Discount" },
];

const getDiscount = (steamPrice, price) => {
  if (!steamPrice || steamPrice <= price) return 0;
  return Math.round(((steamPrice - price) / steamPrice) * 100);
};

const Wishlist = () => {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();

  const { wishlist: contextWishlist, loading, refreshWishlist, toggleWishlist } = useWishlist();
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [suggestedGames, setSuggestedGames] = useState([]);

  // Compute price labels and update prices history when contextWishlist updates
  useEffect(() => {
    if (!user || !contextWishlist) return;

    const historyKey = `cg39_wishlist_prices_${user.id}`;
    let savedPrices = {};
    try {
      const raw = localStorage.getItem(historyKey);
      savedPrices = raw ? JSON.parse(raw) : {};
      if (typeof savedPrices !== 'object' || Array.isArray(savedPrices)) savedPrices = {};
    } catch (e) {
      console.warn("[Wishlist] localStorage parse error:", e);
    }
    const newPrices = { ...savedPrices };

    const updatedWishlist = contextWishlist.map((item) => {
      const game = item.games;
      if (!game) return item;
      let priceLabel = null;
      const previousPrice = savedPrices[game.id];
      if (previousPrice !== undefined) {
        if (game.price < previousPrice)       priceLabel = "Price dropped";
        else if (game.price > previousPrice)  priceLabel = "Price updated";
      }
      newPrices[game.id] = game.price;
      return { ...item, priceLabel };
    });

    localStorage.setItem(historyKey, JSON.stringify(newPrices));
    setWishlist(updatedWishlist);
  }, [contextWishlist, user]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(`${API}/games`);
        const all = res.data || [];
        const wishlistIds = wishlist.map(item => item.game_id || item.games?.id);
        const filtered = all.filter(g => !wishlistIds.includes(g.id) && g.in_stock !== false);
        setSuggestedGames(filtered.slice(0, 4));
      } catch (err) {
        console.error("Failed to load suggested games:", err);
      }
    };
    if (wishlist.length === 0) {
      fetchSuggestions();
    }
  }, [wishlist]);

  /* ── Guest redirect ── */
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  /* ── Remove (with 200ms scale + opacity exit animation) ── */
  const handleRemove = async (gameId) => {
    try {
      setRemovingId(gameId);
      
      // Delay deletion to allow fade+scale exit transitions
      setTimeout(async () => {
        try {
          await toggleWishlist(gameId);
        } catch {
          toast.error("Failed to remove item");
        } finally {
          setRemovingId(null);
        }
      }, 200);
    } catch {
      setRemovingId(null);
    }
  };

  /* ── Sorted list (frontend-only, no API changes) ── */
  const sortedWishlist = useMemo(() => {
    const list = [...wishlist];
    if (sortBy === "price_asc")     return list.sort((a, b) => (a.games?.price || 0) - (b.games?.price || 0));
    if (sortBy === "price_desc")    return list.sort((a, b) => (b.games?.price || 0) - (a.games?.price || 0));
    if (sortBy === "discount_desc") return list.sort((a, b) =>
      getDiscount(b.games?.steam_price, b.games?.price) - getDiscount(a.games?.steam_price, a.games?.price)
    );
    return list;
  }, [wishlist, sortBy]);

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label || "Default";

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] text-[#222222] pt-[68px] md:pt-[74px] pb-20 px-4 sm:px-6 font-sans">
        <div className="max-w-[1240px] mx-auto">
          <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse mb-10" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  /* ── ERROR ── */
  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] text-[#222222] flex items-center justify-center px-4 font-sans">
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-10 text-center max-w-sm mx-auto flex flex-col items-center gap-4 shadow-sm">
          <WarningCircle className="w-10 h-10 text-[#DC2626]" weight="bold" />
          <div>
            <h3 className="text-base font-black text-[#222222] uppercase tracking-tight mb-1">Unable to Load Wishlist</h3>
            <p className="text-xs text-[#666666] font-semibold">Something went wrong while loading your saved games.</p>
          </div>
          <button
            onClick={refreshWishlist}
            className="flex items-center justify-center gap-2 bg-[#E10600] hover:bg-[#c40000] text-white rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition min-h-[44px]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#222222] pt-[68px] md:pt-[74px] pb-20 px-4 sm:px-6 font-sans">
      <div className="max-w-[1240px] mx-auto">

        {/* BREADCRUMB */}
        <Breadcrumbs paths={[{ label: "Wishlist" }]} />

        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight select-none">
              <span className="text-[#111111]">MY</span> <span className="text-[#E10600]">WISHLIST</span>
            </h1>
            <p className="text-xs text-[#666666] font-semibold mt-2 select-none">
              {wishlist.length > 0
                ? `${wishlist.length} ${wishlist.length === 1 ? "GAME" : "GAMES"} SAVED · Save your favorite games and come back to them anytime.`
                : "Save your favorite games and come back to them anytime."}
            </p>
          </div>

          {/* Sort control — only shown when items exist */}
          {wishlist.length > 1 && (
            <div className="relative shrink-0" onBlur={() => setSortOpen(false)}>
              <button
                onClick={() => setSortOpen((v) => !v)}
                aria-label="Sort wishlist"
                aria-expanded={sortOpen}
                className="flex items-center gap-2 bg-white border border-[#E5E5E5] hover:bg-[#F7F7F8] text-[#222222] rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition min-h-[44px]"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-[#666666] shrink-0" weight="bold" />
                {currentSortLabel}
                <ChevronDown className={`w-3.5 h-3.5 text-[#666666] shrink-0 transition-transform duration-150 ${sortOpen ? "rotate-180" : ""}`} weight="bold" />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-[#E5E5E5] rounded-xl shadow-md z-30 py-1 overflow-hidden">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onMouseDown={() => { setSortBy(opt.value); setSortOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold transition ${
                        sortBy === opt.value
                          ? "bg-[#E10600]/5 text-[#E10600]"
                          : "text-[#666666] hover:bg-[#F7F7F8] hover:text-[#222222]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* EMPTY STATE */}
        {wishlist.length === 0 ? (
          <div className="space-y-12">
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-14 text-center flex flex-col items-center gap-5 max-w-md mx-auto shadow-sm select-none text-[#222222]">
              <div className="w-14 h-14 rounded-full bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-center">
                <Heart className="w-7 h-7 text-[#E10600]" weight="bold" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-[#222222] mb-2">Your Wishlist is Empty</h3>
                <p className="text-sm text-[#666666] font-semibold leading-relaxed max-w-xs mx-auto">
                  Save games you want to check out later.
                </p>
              </div>
              <Link
                to="/games"
                className="flex items-center gap-2 bg-[#E10600] hover:bg-[#c40000] text-white px-7 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition min-h-[44px]"
              >
                Browse Games
              </Link>
            </div>

            {/* Suggested Games Section */}
            {suggestedGames.length > 0 && (
              <div className="space-y-6 mt-12">
                <div className="pb-2 border-b border-[#E5E5E5] text-left">
                  <h3 className="text-base font-black uppercase tracking-tight text-[#1A1A1A]">
                    Suggested <span className="text-[#E10600]">Games</span>
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {suggestedGames.map(game => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* GAME GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {sortedWishlist.map((item) => (
                <div
                  key={item.id}
                  style={{
                    opacity: removingId === item.games.id ? 0 : 1,
                    transform: removingId === item.games.id ? "scale(0.97)" : "scale(1)",
                    transition: "opacity 200ms ease, transform 200ms ease"
                  }}
                  className="origin-center"
                >
                  <GameCard
                    game={item.games}
                    onWishlistRemove={handleRemove}
                  />
                </div>
              ))}
            </div>

            {/* CONTINUE SHOPPING */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-8 border-t border-[#E5E5E5]">
              <p className="text-xs text-[#666666] font-semibold select-none">
                {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} in your wishlist
              </p>
              <Link
                to="/games"
                className="flex items-center gap-2 border border-[#E5E5E5] hover:bg-[#F7F7F8] bg-white text-[#222222] rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition min-h-[44px]"
              >
                Continue Shopping <ChevronRight className="w-3.5 h-3.5 shrink-0" weight="bold" />
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Wishlist;
