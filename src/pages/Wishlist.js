import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import {
  Trash2,
  Loader2,
  ShoppingCart,
  Heart,
  HeartOff,
  PackageOpen,
  RefreshCcw,
  ChevronRight,
  ChevronDown,
  TrendingDown,
  ArrowUpDown,
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`;

/* ─── Skeleton card ───────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-[#111111] border border-white/8 rounded-2xl overflow-hidden flex flex-col animate-pulse">
    <div className="aspect-[16/10] bg-white/5" />
    <div className="p-4 flex flex-col gap-3">
      <div className="h-3 bg-white/5 rounded-lg w-1/3" />
      <div className="h-4 bg-white/5 rounded-lg w-4/5" />
      <div className="h-4 bg-white/5 rounded-lg w-1/2" />
      <div className="flex gap-2 mt-1">
        <div className="h-10 flex-1 bg-white/5 rounded-xl" />
        <div className="h-10 w-10 bg-white/5 rounded-xl shrink-0" />
      </div>
    </div>
  </div>
);

/* ─── Sort options ────────────────────────────────────────────── */
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

/* ─── Wishlist game card (inline – needs Remove button) ────────── */
const WishlistCard = ({ item, removingId, addingCartId, onRemove, onAddToCart, onNavigate }) => {
  const game = item.games;
  if (!game) return null;

  const disc   = getDiscount(game.steam_price, game.price);
  const savings = disc > 0 ? game.steam_price - game.price : 0;
  const isOutOfStock = game.in_stock === false;
  const isRemoving  = removingId === game.id;
  const isAddingCart = addingCartId === game.id;
  const priceDropped = item.priceLabel === "Price dropped";

  return (
    <div
      className={`bg-[#111111] border border-white/8 hover:border-white/15 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 ${
        isRemoving ? "opacity-40 scale-95 pointer-events-none" : ""
      } ${isOutOfStock ? "opacity-70" : ""}`}
    >
      {/* IMAGE */}
      <div
        className="relative aspect-[16/10] overflow-hidden bg-black/40 cursor-pointer group"
        onClick={() => onNavigate(game.id)}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onNavigate(game.id)}
        aria-label={`View ${game.title} details`}
      >
        <img
          loading="lazy"
          src={game.image_url}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-300"
        />

        {/* Discount badge */}
        {disc > 0 && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-[#E00000] text-white text-[10px] font-black px-2 py-0.5 rounded-lg select-none">
            -{disc}%
          </div>
        )}

        {/* Price dropped badge */}
        {priceDropped && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 select-none">
            <TrendingDown className="w-2.5 h-2.5" />
            Price Dropped
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-[10px] text-white font-black uppercase tracking-widest select-none">Out of Stock</span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {game.categories?.name && (
            <p className="text-[10px] text-[#E00000] font-bold uppercase tracking-wider mb-1 select-none">
              {game.categories.name}
            </p>
          )}
          <h3
            className="text-sm font-bold text-white line-clamp-2 cursor-pointer hover:text-[#E00000] transition leading-snug"
            onClick={() => onNavigate(game.id)}
          >
            {game.title}
          </h3>
        </div>

        {/* PRICE */}
        <div className="flex items-end justify-between gap-2">
          <div>
            {disc > 0 && (
              <span className="text-zinc-500 line-through text-[10px] block leading-tight">
                ₹{game.steam_price?.toLocaleString()}
              </span>
            )}
            <span className="text-base font-black text-white leading-tight">
              ₹{game.price?.toLocaleString()}
            </span>
            {disc > 0 && (
              <span className="text-[10px] text-emerald-400 font-bold block leading-tight">
                Save ₹{savings.toLocaleString()}
              </span>
            )}
          </div>
          {item.priceLabel === "Price updated" && (
            <span className="text-[9px] text-blue-400 font-bold bg-blue-500/8 border border-blue-500/15 px-2 py-0.5 rounded-lg select-none">
              Updated
            </span>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 pt-2 border-t border-white/5">
          <button
            disabled={isAddingCart || isOutOfStock}
            onClick={() => onAddToCart(game.id)}
            aria-label={`Add ${game.title} to cart`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#E00000]/8 hover:bg-[#E00000]/18 border border-[#E00000]/15 hover:border-[#E00000]/35 text-[#E00000] rounded-xl py-2.5 text-[10px] font-bold uppercase tracking-wider transition min-h-[40px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isAddingCart ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>Add to Cart</span>
          </button>

          <button
            disabled={isRemoving}
            onClick={() => onRemove(game.id)}
            aria-label={`Remove ${game.title} from wishlist`}
            title="Remove from wishlist"
            className="w-10 h-10 flex items-center justify-center shrink-0 bg-white/4 hover:bg-red-500/10 border border-white/8 hover:border-red-500/25 text-zinc-500 hover:text-red-400 rounded-xl transition min-w-[40px] disabled:opacity-40"
          >
            {isRemoving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main component ─────────────────────────────────────────── */
const Wishlist = () => {
  const { user, accessToken } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [wishlist,      setWishlist]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(false);
  const [removingId,    setRemovingId]    = useState(null);
  const [addingCartId,  setAddingCartId]  = useState(null);
  const [sortBy,        setSortBy]        = useState("default");
  const [sortOpen,      setSortOpen]      = useState(false);

  /* ── Guest redirect ── */
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  /* ── Fetch (preserved exactly from original) ── */
  const fetchWishlist = useCallback(async () => {
    if (!user || !accessToken) return;
    try {
      setLoading(true);
      setError(false);
      const res = await axios.get(`${API}/wishlist`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const items = res.data || [];
      const historyKey = `cg39_wishlist_prices_${user.id}`;
      const savedPrices = JSON.parse(localStorage.getItem(historyKey)) || {};
      const newPrices = { ...savedPrices };

      const updatedWishlist = items.map((item) => {
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
    } catch {
      setError(true);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, [user, accessToken]);

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user, fetchWishlist]);

  /* ── Remove (preserved exactly) ── */
  const handleRemove = async (gameId) => {
    try {
      setRemovingId(gameId);
      await axios.delete(`${API}/wishlist/${gameId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setWishlist((prev) => prev.filter((item) => item.games.id !== gameId));
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  /* ── Add to cart (preserved exactly) ── */
  const handleAddToCart = async (gameId) => {
    try {
      setAddingCartId(gameId);
      await addToCart(gameId);
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.message || "Failed to add to cart");
    } finally {
      setAddingCartId(null);
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
      <div className="min-h-screen bg-[#080808] text-white pt-24 pb-20 px-4 sm:px-6 font-sans">
        <div className="max-w-[1280px] mx-auto">
          <div className="h-8 w-48 bg-white/5 rounded-xl animate-pulse mb-10" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  /* ── ERROR ── */
  if (error) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 font-sans">
        <div className="bg-[#111111] border border-white/8 rounded-2xl p-10 text-center max-w-sm mx-auto flex flex-col items-center gap-4">
          <HeartOff className="w-10 h-10 text-zinc-600" />
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-tight mb-1">Unable to Load Wishlist</h3>
            <p className="text-xs text-zinc-500">Something went wrong. Please try again.</p>
          </div>
          <button
            onClick={fetchWishlist}
            className="flex items-center gap-2 bg-[#E00000]/8 hover:bg-[#E00000]/18 border border-[#E00000]/15 text-[#E00000] rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition min-h-[44px]"
          >
            <RefreshCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-24 pb-20 px-4 sm:px-6 font-sans">
      <div className="max-w-[1280px] mx-auto">

        {/* BREADCRUMB */}
        <nav className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 mb-8 select-none uppercase tracking-wider">
          <Link to="/"          className="hover:text-[#E00000] transition">Home</Link>
          <ChevronRight className="w-3 h-3 text-zinc-700" />
          <Link to="/dashboard" className="hover:text-[#E00000] transition">My Account</Link>
          <ChevronRight className="w-3 h-3 text-zinc-700" />
          <span className="text-white font-bold">Wishlist</span>
        </nav>

        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white select-none">
              Saved <span className="text-[#E00000]">Games</span>
            </h1>
            <p className="text-xs text-zinc-500 mt-1 select-none">
              {wishlist.length > 0
                ? `${wishlist.length} game${wishlist.length !== 1 ? "s" : ""} saved · Keep your favourites here.`
                : "Keep your favourite games saved for later."}
            </p>
          </div>

          {/* Sort control — only shown when items exist */}
          {wishlist.length > 1 && (
            <div className="relative shrink-0" onBlur={() => setSortOpen(false)}>
              <button
                onClick={() => setSortOpen((v) => !v)}
                aria-label="Sort wishlist"
                aria-expanded={sortOpen}
                className="flex items-center gap-2 bg-[#111111] border border-white/8 hover:border-white/15 text-zinc-300 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition min-h-[44px]"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                {currentSortLabel}
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 shrink-0 transition-transform duration-150 ${sortOpen ? "rotate-180" : ""}`} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-[#111111] border border-white/8 rounded-xl shadow-2xl z-30 py-1 overflow-hidden">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onMouseDown={() => { setSortBy(opt.value); setSortOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold transition ${
                        sortBy === opt.value
                          ? "bg-[#E00000]/8 text-[#E00000]"
                          : "text-[#555555] hover:bg-[#F5F5F5] hover:text-[#111111]"
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
          <div className="bg-[#111111] border border-white/8 rounded-2xl p-14 text-center flex flex-col items-center gap-5 max-w-md mx-auto shadow-xl select-none">
            <div className="w-14 h-14 rounded-full bg-white/4 border border-white/8 flex items-center justify-center">
              <Heart className="w-7 h-7 text-zinc-600" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-tight text-white mb-2">Your Wishlist is Empty</h3>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
                Save games you want to come back to later. Browse the store and hit the heart icon.
              </p>
            </div>
            <Link
              to="/games"
              className="flex items-center gap-2 bg-[#E00000] hover:bg-[#F00000] text-white px-7 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition hover:shadow-[0_0_20px_rgba(255,0,0,0.2)] min-h-[44px]"
            >
              <PackageOpen className="w-4 h-4 shrink-0" />
              Browse Games
            </Link>
          </div>
        ) : (
          <>
            {/* GAME GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {sortedWishlist.map((item) => (
                <WishlistCard
                  key={item.id}
                  item={item}
                  removingId={removingId}
                  addingCartId={addingCartId}
                  onRemove={handleRemove}
                  onAddToCart={handleAddToCart}
                  onNavigate={(id) => navigate(`/games/${id}`)}
                />
              ))}
            </div>

            {/* CONTINUE SHOPPING */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-8 border-t border-white/5">
              <p className="text-xs text-zinc-600 select-none">
                {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} in your wishlist
              </p>
              <Link
                to="/games"
                className="flex items-center gap-2 border border-[#E5E5E5] hover:border-[#D4D4D4] text-[#555555] hover:text-[#111111] hover:bg-[#F5F5F5] rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition min-h-[44px]"
              >
                Continue Shopping <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Wishlist;
