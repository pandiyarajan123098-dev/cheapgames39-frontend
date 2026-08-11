import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { 
  Trash2, 
  Plus, 
  Minus, 
  Loader2, 
  ShoppingCart, 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight, 
  ShieldCheck, 
  CreditCard, 
  MessageCircle, 
  Gamepad2 
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { GameCard } from "../components/GameCard";
import { Breadcrumbs } from "../components/Breadcrumbs";

const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`;

const Cart = () => {
  const { user } = useAuth();
  const { cart, updateCartItem, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [upsellGames, setUpsellGames] = useState([]);

  // Simulated initial load for smooth skeleton transitions
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(timer);
  }, []);

  /* ================= DISCOUNT ================= */
  const calculateDiscount = (steamPrice, salePrice) => {
    if (!steamPrice || steamPrice <= salePrice) {
      return { percentage: 0, hasDiscount: false };
    }

    const percentage = Math.round(
      ((steamPrice - salePrice) / steamPrice) * 100
    );

    return { percentage, hasDiscount: true };
  };

  /* ================= TOTALS ================= */
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.games?.price || 0) * item.quantity,
    0
  );

  const totalSteamValue = cart.reduce(
    (sum, item) =>
      sum + (item.games?.steam_price || 0) * item.quantity,
    0
  );

  const totalSavings = Math.max(totalSteamValue - subtotal, 0);

  /* ================= COMPLETE COLLECTION UPSELL ================= */
  useEffect(() => {
    const loadUpsell = async () => {
      try {
        const res = await axios.get(`${API}/games`);
        const all = res.data || [];
        const cartIds = cart.map(item => item.game_id || item.games?.id);
        
        // Filter out games already in the cart and out of stock items
        const filtered = all.filter(g => !cartIds.includes(g.id) && g.in_stock !== false);
        
        // Sort by discount percentage descending
        const upsell = filtered
          .map(g => ({ game: g, discount: calculateDiscount(g.steam_price, g.price).percentage }))
          .sort((a, b) => b.discount - a.discount)
          .slice(0, 4)
          .map(item => item.game);
          
        setUpsellGames(upsell);
      } catch (err) {
        console.error("Upsell load error:", err);
      }
    };
    
    if (cart.length > 0) {
      loadUpsell();
    }
  }, [cart]);

  /* ================= CHECKOUT ================= */
  const handleCheckout = () => {
    navigate("/checkout");
  };

  /* ================= BREADCRUMBS RENDERER ================= */
  const renderBreadcrumbs = () => {
    return <Breadcrumbs paths={[{ label: "Games", path: "/games" }, { label: "Shopping Cart" }]} />;
  };

  /* ================= LOADING SKELETON STATE ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] text-white pt-[76px] md:pt-[82px] pb-20 px-4 sm:px-6 font-sans select-none">
        <div className="max-w-[1320px] mx-auto space-y-8 animate-pulse">
          {/* Breadcrumbs skeleton */}
          <div className="h-4 bg-[#151515] rounded-lg w-1/4"></div>
          {/* Title skeleton */}
          <div className="h-10 bg-[#151515] rounded-lg w-1/3"></div>
          
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-[#111111] border border-white/8 rounded-2xl p-6 h-36"></div>
              ))}
            </div>
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 h-72"></div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= EMPTY STATE ================= */
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] text-white pt-[76px] md:pt-[82px] pb-20 px-4 sm:px-6 font-sans">
        <div className="max-w-[1320px] mx-auto">
          {renderBreadcrumbs()}
          <div className="text-center py-24 bg-[#111111] border border-white/8 rounded-3xl p-8 max-w-lg mx-auto shadow-xl space-y-5 select-none">
            <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 border border-white/8 shadow-xl">
              <ShoppingCart className="w-8 h-8 text-[#E00000]" />
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white font-sans">YOUR CART IS EMPTY</h2>
            <p className="text-[#A1A1AA] text-xs uppercase tracking-wider leading-relaxed">
              Your next game is waiting.
            </p>
            <Link
              to="/games"
              className="inline-block bg-[#E00000] hover:bg-[#F00000] text-white px-8 py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider transition active:scale-[0.98] min-h-[44px]"
            >
              Browse Games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-white pt-[76px] md:pt-[82px] pb-20 px-4 sm:px-6 font-sans">
      <div className="max-w-[1320px] mx-auto animate-page-section">
        
        {/* BREADCRUMB */}
        {renderBreadcrumbs()}

        <h1 className="text-3xl sm:text-[42px] font-black uppercase mb-12 text-[#1A1A1A] tracking-tight select-none">
          Shopping <span className="text-[#E00000]">Cart</span>
          <span className="text-xs bg-[#E5E5E5] border border-[#D5D5D5] text-zinc-500 px-2 py-0.5 rounded ml-3 align-middle">
            {cart.length} {cart.length === 1 ? "ITEM" : "ITEMS"}
          </span>
        </h1>

        {/* TWO-COLUMN GRID */}
        <div className="grid lg:grid-cols-3 gap-10 items-start">
          
          {/* LEFT COLUMN: CART ITEMS */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {cart.map((item) => {
                const steamPrice = item.games?.steam_price || 0;
                const salePrice = item.games?.price || 0;
                const { percentage, hasDiscount } = calculateDiscount(steamPrice, salePrice);
                const savings = hasDiscount ? (steamPrice - salePrice) : 0;

                return (
                  <div
                    key={item.id}
                    className="bg-[#111111] border border-white/8 hover:border-white/20 rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-5 transition items-start sm:items-center"
                  >
                    <img 
                      loading="lazy"
                      src={item.games?.image_url || "/placeholder.jpg"}
                      alt={item.games?.title || "Game"}
                      className="w-20 h-24 sm:w-28 sm:h-36 object-cover rounded-xl shrink-0"
                    />

                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 min-w-0 h-full">
                      
                      <div className="space-y-1.5 min-w-0">
                        <span className="text-[10px] text-[#E00000] font-black uppercase tracking-widest block select-none">
                          {item.games?.categories?.name || "PC Game"}
                        </span>
                        <h3 className="text-base sm:text-lg font-extrabold text-white truncate leading-tight">
                          {item.games?.title}
                        </h3>

                        {/* Prices row */}
                        <div className="flex items-center gap-2 select-none">
                          {hasDiscount && (
                            <span className="bg-[#E00000] text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                              -{percentage}%
                            </span>
                          )}
                          <span className="text-base font-extrabold text-white">
                            ₹{salePrice.toLocaleString()}
                          </span>
                          {hasDiscount && (
                            <span className="text-zinc-500 line-through text-xs">
                              ₹{steamPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        
                        {hasDiscount && (
                          <span className="text-[10px] text-emerald-400 font-bold block select-none">
                            Save ₹{savings.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Quantity & trash controls */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 border-t border-white/5 pt-3 sm:pt-0 sm:border-0 select-none">
                        
                        {/* Quantity selector */}
                        <div className="flex items-center gap-3 bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl px-3 py-2">
                          <button
                            onClick={() =>
                              item.quantity > 1 &&
                              updateCartItem(item.id, item.quantity - 1)
                            }
                            className="text-[#555555] hover:text-[#111111] transition p-1"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="text-white text-xs font-black w-6 text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateCartItem(item.id, item.quantity + 1)
                            }
                            className="text-[#555555] hover:text-[#111111] transition p-1"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Trash action */}
                        <button
                          disabled={deletingId === item.id}
                          onClick={async () => {
                            setDeletingId(item.id);
                            try {
                              await removeFromCart(item.id);
                            } finally {
                              setDeletingId(null);
                            }
                          }}
                          className="text-zinc-400 hover:text-[#E00000] transition disabled:opacity-50 disabled:cursor-not-allowed p-2 hover:bg-white/5 rounded-xl shrink-0 min-h-[44px] flex items-center justify-center"
                          aria-label={`Remove ${item.games?.title || "item"} from cart`}
                        >
                          {deletingId === item.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY ORDER SUMMARY */}
          <div>
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 sticky top-28 flex flex-col gap-6">
              
              <h2 className="text-lg font-bold uppercase tracking-wider text-white select-none">
                Order Summary
              </h2>

              <div className="space-y-3.5 text-xs select-none">
                <div className="flex justify-between text-zinc-500">
                  <span className="uppercase font-bold">Steam Value</span>
                  <span className="font-semibold">₹{totalSteamValue.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-emerald-400">
                  <span className="uppercase font-bold">You Save</span>
                  <span className="font-extrabold">- ₹{totalSavings.toLocaleString()}</span>
                </div>
              </div>

              {/* Value reminder strip */}
              <div className="bg-[#0d0d0d] border border-white/8 rounded-xl p-3 text-[11px] text-zinc-400 font-medium select-none flex gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Digital game credentials are shared securely after payment verification is completed.</span>
              </div>

              <div className="border-t border-white/5 pt-4 flex justify-between items-baseline select-none">
                <span className="text-sm font-black uppercase tracking-wider text-zinc-400">Total</span>
                <span className="text-2xl font-black text-[#E00000]">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>

              {/* CTA and links */}
              <div className="space-y-4">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#E00000] hover:bg-[#F00000] text-white rounded-xl py-3.5 font-bold transition uppercase text-xs tracking-wider flex items-center justify-center gap-2 min-h-[48px] active:scale-[0.98]"
                  aria-label="Proceed to checkout"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                <Link 
                  to="/games"
                  className="flex items-center justify-center gap-2 text-xs font-bold text-zinc-500 hover:text-[#E00000] transition uppercase tracking-wider min-h-[44px]"
                  aria-label="Continue shopping"
                >
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                  <span>Continue Shopping</span>
                </Link>
              </div>

            </div>
          </div>

        </div>

        {/* TRUST STRIP */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-t border-white/8 pt-8 mt-12 select-none">
          <div className="flex gap-2.5">
            <ShieldCheck className="w-[18px] h-[18px] text-emerald-500 shrink-0 mt-0.5" />
            <div className="leading-tight">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider block">Secure Checkout</span>
              <span className="text-[9px] text-zinc-500 font-medium block mt-0.5">UPI and bank validation verified</span>
            </div>
          </div>
          <div className="flex gap-2.5">
            <CreditCard className="w-[18px] h-[18px] text-amber-500 shrink-0 mt-0.5" />
            <div className="leading-tight">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider block">UPI Payment</span>
              <span className="text-[9px] text-zinc-500 font-medium block mt-0.5">Supports all major UPI applications</span>
            </div>
          </div>
          <div className="flex gap-2.5">
            <MessageCircle className="w-[18px] h-[18px] text-[#E00000] shrink-0 mt-0.5" />
            <div className="leading-tight">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider block">WhatsApp Support</span>
              <span className="text-[9px] text-zinc-500 font-medium block mt-0.5">Contact us on WhatsApp for order assistance</span>
            </div>
          </div>
          <div className="flex gap-2.5">
            <Gamepad2 className="w-[18px] h-[18px] text-blue-500 shrink-0 mt-0.5" />
            <div className="leading-tight">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider block">Digital Game Delivery</span>
              <span className="text-[9px] text-zinc-500 font-medium block mt-0.5">Account credentials coordinates setup</span>
            </div>
          </div>
        </div>

        {/* RECOMMENDED GAMES */}
        {upsellGames.length > 0 && (
          <div className="border-t border-white/8 pt-12 mt-16 space-y-8 select-none">
            <h3 className="text-xl font-bold uppercase tracking-tight text-[#1A1A1A]">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
              {upsellGames.map(g => (
                <GameCard key={g.id} game={g} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;
