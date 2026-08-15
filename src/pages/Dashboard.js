import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "sonner";
import {
  User as UserRound,
  ShoppingBag,
  Heart,
  ChatCircle as MessageCircle,
  SignOut as LogOut,
  ArrowRight,
  Calendar,
  Key,
  ShieldCheck,
  ClockCounterClockwise as History,
  TrendUp as TrendingUp,
  CaretRight as ChevronRight,
  Package as PackageOpen,
  CheckCircle as CheckCircle2,
  Clock as Clock3,
  Warning as AlertTriangle,
  Package,
  Envelope as Mail,
  ShoppingCart
} from "@phosphor-icons/react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { FaWhatsapp } from "react-icons/fa";
import { getWhatsAppOrderUrl } from "../utils/whatsapp";

const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`;

/* ─── Status badge helpers ────────────────────────────────────────── */
const STATUS_MAP = {
  pending:         { label: "Awaiting Payment",    cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  pending_payment: { label: "Awaiting Payment",    cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  submitted:       { label: "Payment Submitted",   cls: "bg-amber-50 text-amber-700 border-amber-200" },
  paid:            { label: "Paid",                cls: "bg-blue-50 text-blue-700 border-blue-200" },
  processing:      { label: "Processing",          cls: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  delivered:       { label: "Delivered",           cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  completed:       { label: "Completed",           cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled:       { label: "Cancelled",           cls: "bg-red-50 text-red-700 border-red-200" },
};

const getStatus = (status) => {
  const key = (status || "").toLowerCase();
  return STATUS_MAP[key] || { label: status?.toUpperCase() || "PENDING", cls: "bg-white/8 text-zinc-300 border-white/10" };
};

/* ─── Skeleton ────────────────────────────────────────────────────── */
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-[#E5E5E5] rounded-xl ${className}`} />
);

/* ─── Main component ──────────────────────────────────────────────── */
export default function Dashboard() {
  const { user, accessToken, logout, logoutLoading } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [orders,           setOrders]           = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [recentGames,      setRecentGames]      = useState([]);
  const [recommendedGames, setRecommendedGames] = useState([]);
  const [activeTab,        setActiveTab]        = useState("orders");

  /* ── Redirect guest ── */
  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  /* ── Fetch data (existing logic, preserved exactly) ── */
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !accessToken) return;
      try {
        setLoading(true);

        const ordersRes = await axios.get(`${API}/orders/user`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const fetchedOrders = ordersRes.data || [];
        setOrders(fetchedOrders);

        const storageKey = `cg39_recent_${user.id}`;
        let recent = [];
        try {
          const raw = localStorage.getItem(storageKey);
          recent = raw ? JSON.parse(raw) : [];
          if (!Array.isArray(recent)) recent = [];
        } catch (e) {
          console.warn("[Dashboard] localStorage parse error:", e);
        }
        setRecentGames(recent.slice(0, 5));

        const gamesRes = await axios.get(`${API}/games`);
        const allGames = gamesRes.data || [];

        const recentCatIds = recent.map((r) => {
          const match = allGames.find((g) => String(g.id) === String(r.id));
          return match ? match.category_id : null;
        }).filter(Boolean);

        const recentIds = recent.map((r) => String(r.id));
        const scored = allGames
          .filter((g) => g.in_stock !== false && !recentIds.includes(String(g.id)))
          .map((g) => {
            let score = 0;
            if (recentCatIds.includes(g.category_id)) score += 5;
            if (g.is_new) score += 1;
            if (g.is_bundle) score += 2;
            return { game: g, score };
          })
          .filter((item) => item.score > 0);

        scored.sort((a, b) => b.score - a.score);
        setRecommendedGames(scored.slice(0, 4).map((item) => item.game));
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, accessToken]);

  /* ── Derived stats from real data ── */
  const stats = useMemo(() => {
    const completed = orders.filter(
      (o) => o.status === "completed" || o.status === "delivered"
    ).length;
    const totalSpent = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.total_price || 0), 0);
    return { total: orders.length, completed, totalSpent };
  }, [orders]);

  /* ── Logout handler ── */
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed — please try again");
    }
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Gamer";
  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const TABS = [
    { id: "orders",   label: "Orders",   icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "account",  label: "Account",  icon: UserRound },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-[68px] md:pt-[74px] pb-20 px-4 sm:px-6 font-sans animate-page-section">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-8">

        {/* ── BREADCRUMB ── */}
        <Breadcrumbs paths={[{ label: "My Account" }]} />

        {/* ── ACCOUNT HEADER ── */}
        <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-[#E00000]/8 border border-[#E00000]/15 flex items-center justify-center shrink-0">
            <UserRound className="w-7 h-7 text-[#E00000]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest select-none">My Account</p>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1 leading-tight select-none">
              Welcome back, <span className="text-[#E00000]">{displayName}</span>
            </h1>
            <p className="text-xs text-zinc-500 mt-1.5 select-none">
              Manage your orders, saved games and account activity.
            </p>
          </div>
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#555555] hover:text-red-600 border border-[#E5E5E5] hover:border-red-600/30 hover:bg-[#FFF5F5] px-4 py-2.5 rounded-xl transition min-h-[44px] shrink-0 disabled:opacity-50"
            aria-label="Log out of your account"
          >
            <LogOut className="w-4 h-4" />
            {logoutLoading ? "Logging out…" : "Log Out"}
          </button>
        </div>

        {/* ── QUICK STATS ── */}
        {!loading && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Orders",    value: stats.total,                    icon: ShoppingBag, color: "text-zinc-400" },
              { label: "Completed", value: stats.completed,                icon: CheckCircle2, color: "text-emerald-400" },
              { label: "Spent",     value: `₹${stats.totalSpent.toLocaleString()}`, icon: Key, color: "text-[#E00000]" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-[#111111] border border-white/8 rounded-xl p-4 sm:p-5 flex flex-col gap-2 select-none">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-xl sm:text-2xl font-black text-white leading-none">{value}</span>
                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{label}</span>
              </div>
            ))}
          </div>
        )}
        {loading && (
          <div className="grid grid-cols-3 gap-4">
            {[0,1,2].map(i => <Skeleton key={i} className="h-24" />)}
          </div>
        )}

        {/* ── ACCOUNT NAVIGATION TABS ── */}
        <div className="flex gap-1 bg-[#111111] border border-white/8 rounded-xl p-1 overflow-x-auto scrollbar-none">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition whitespace-nowrap min-h-[40px] flex-1 justify-center sm:flex-none sm:justify-start ${
                activeTab === id
                  ? "bg-[#E00000] text-white shadow"
                  : "text-zinc-400 hover:text-[#111111] hover:bg-[#F5F5F5]"
              }`}
              aria-label={`Switch to ${label} tab`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* ── TAB: ORDERS ── */}
        {activeTab === "orders" && (
          <div className="flex flex-col gap-5" id="order-history">
            <h2 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2 select-none">
              <ShoppingBag className="w-5 h-5 text-zinc-500" />
              Order History
              {!loading && <span className="text-zinc-600 font-bold text-sm">({orders.length})</span>}
            </h2>

            {/* Loading skeletons */}
            {loading && (
              <div className="flex flex-col gap-4">
                {[0,1,2].map(i => <Skeleton key={i} className="h-36" />)}
              </div>
            )}

            {/* Order cards */}
            {!loading && orders.length > 0 && (
              <div className="flex flex-col gap-4">
                {orders.map((ord) => {
                  const st = getStatus(ord.status);
                  const isDelivered = ord.status === "completed" || ord.status === "delivered";
                  const itemCount = ord.order_items?.length || 0;
                  const firstTitle = ord.order_items?.[0]?.games?.title || "Game";
                  const previewLabel = itemCount > 1
                    ? `${firstTitle} + ${itemCount - 1} more`
                    : firstTitle;

                  return (
                    <div
                      key={ord.id}
                      className="bg-[#111111] border border-white/8 hover:border-white/15 rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:-translate-y-0.5 shadow-sm select-none"
                    >
                      {/* Order header row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5 mb-4">
                        <div className="min-w-0">
                          <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest block">Order ID</span>
                          <span className="font-mono text-xs text-white font-bold break-all select-all">
                            #{ord.id.substring(0, 8).toUpperCase()}…
                          </span>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Calendar className="w-3 h-3 text-zinc-600" />
                            <span className="text-[10px] text-zinc-500 font-semibold">{formatDate(ord.created_at)}</span>
                          </div>
                        </div>
                        <span className={`text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-wider border shrink-0 ${st.cls}`}>
                          {st.label}
                        </span>
                      </div>

                      {/* Compact item preview */}
                      <div className="flex gap-3 items-center mb-4">
                        {/* First item image if available */}
                        {ord.order_items?.[0]?.games?.image_url && (
                          <img
                            src={ord.order_items[0].games.image_url}
                            alt={firstTitle}
                            className="w-10 h-14 object-cover rounded-lg shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{previewLabel}</h4>
                          <p className="text-[10px] text-zinc-500 mt-0.5">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-zinc-500 block">Total</span>
                          <span className="text-sm font-black text-[#E00000]">₹{(ord.total_price || 0).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Delivered notice */}
                      {isDelivered && (
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 flex gap-2.5 items-start mb-4">
                          <Key className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Delivery Complete</p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">View Details to access your order credentials securely.</p>
                          </div>
                        </div>
                      )}

                      {/* CTAs */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          onClick={() => navigate(`/order-status?id=${ord.id}`)}
                          className="flex items-center justify-center gap-2 bg-[#E00000]/8 hover:bg-[#E00000]/18 border border-[#E00000]/15 hover:border-[#E00000]/35 text-[#E00000] rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition min-h-[38px]"
                          aria-label={`Open order details for order ${ord.id}`}
                        >
                          View Details <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </button>
                        <button
                          onClick={() => window.open(getWhatsAppOrderUrl(ord), "_blank")}
                          className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition min-h-[38px]"
                          aria-label="WhatsApp Support for this order"
                          title="Contact support on WhatsApp for this order"
                        >
                          <FaWhatsapp className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty state */}
            {!loading && orders.length === 0 && (
              <div className="bg-[#111111] border border-white/8 rounded-2xl p-12 text-center flex flex-col items-center gap-4 shadow-xl select-none">
                <div className="w-14 h-14 rounded-full bg-white/4 border border-white/8 flex items-center justify-center">
                  <PackageOpen className="w-7 h-7 text-zinc-600" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-white mb-1">No Orders Yet</h3>
                  <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                    Your next game is waiting. Browse the store and grab your first title.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/games")}
                  className="bg-[#E00000] hover:bg-[#F00000] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition min-h-[44px]"
                >
                  Browse Games
                </button>
              </div>
            )}

            {/* Recommended section (if data available) */}
            {!loading && recommendedGames.length > 0 && (
              <div className="flex flex-col gap-4 mt-2">
                <h3 className="text-sm font-black uppercase tracking-tight text-white flex items-center gap-2 select-none">
                  <TrendingUp className="w-4 h-4 text-zinc-500" /> Recommended For You
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {recommendedGames.map((g) => (
                    <div
                      key={g.id}
                      onClick={() => navigate(`/games/${g.id}`)}
                      className="cursor-pointer bg-[#111111] border border-white/8 hover:border-[#E00000]/25 rounded-xl p-3 flex flex-col gap-2 transition hover:-translate-y-0.5"
                    >
                      <img
                        src={g.image_url}
                        alt={g.title}
                        className="w-full aspect-[3/4] object-cover rounded-lg"
                      />
                      <div className="min-w-0">
                        <h4 className="text-[11px] font-bold text-white truncate leading-tight">{g.title}</h4>
                        <span className="text-[11px] text-[#E00000] font-black block mt-0.5">₹{g.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── QUICK ACTIONS ── */}
        {!loading && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2 select-none">
              <ArrowRight className="w-5 h-5 text-zinc-500" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: Heart,
                  label: "Saved Games",
                  meta: wishlistCount > 0 ? `${wishlistCount} saved` : "View your wishlist",
                  cta: "View Wishlist",
                  to: "/wishlist",
                  external: false,
                },
                {
                  icon: ShoppingCart,
                  label: "Your Cart",
                  meta: cartCount > 0 ? `${cartCount} item${cartCount !== 1 ? 's' : ''} in cart` : "Nothing in cart yet",
                  cta: "View Cart",
                  to: "/cart",
                  external: false,
                },
                {
                  icon: MessageCircle,
                  label: "Need Help?",
                  meta: "Reach our support team",
                  cta: "Contact Support",
                  to: "/contact",
                  external: false,
                },
              ].map(({ icon: Icon, label, meta, cta, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="group bg-[#111111] border border-white/8 hover:border-white/18 rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center shrink-0 group-hover:border-white/15 transition">
                    <Icon className="w-4 h-4 text-zinc-500 group-hover:text-[#E00000] transition" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-black uppercase tracking-wider text-white mb-1">{label}</h3>
                    <p className="text-[11px] text-zinc-500">{meta}</p>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-black text-[#E00000] uppercase tracking-wider group-hover:text-[#B50000] transition">
                    {cta} <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: WISHLIST ── */}
        {activeTab === "wishlist" && (
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2 select-none">
              <Heart className="w-5 h-5 text-zinc-500" /> Saved Games
            </h2>
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-10 text-center flex flex-col items-center gap-5 shadow-xl select-none">
              <div className="w-14 h-14 rounded-full bg-white/4 border border-white/8 flex items-center justify-center">
                <Heart className="w-7 h-7 text-zinc-600" />
              </div>
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-white mb-1">Your Wishlist</h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                  View and manage your saved games from your wishlist page.
                </p>
              </div>
              <button
                onClick={() => navigate("/wishlist")}
                className="flex items-center gap-2 bg-[#E00000] hover:bg-[#F00000] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition min-h-[44px]"
                aria-label="Open my wishlist"
              >
                <Heart className="w-4 h-4" /> View My Wishlist
              </button>
            </div>

            {/* Recently viewed games */}
            {recentGames.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-black uppercase tracking-tight text-white flex items-center gap-2 select-none">
                  <History className="w-4 h-4 text-zinc-500" /> Recently Viewed
                </h3>
                <div className="flex flex-col gap-2">
                  {recentGames.map((g) => (
                    <div
                      key={g.id}
                      onClick={() => navigate(`/games/${g.id}`)}
                      className="flex gap-3 items-center cursor-pointer bg-[#111111] hover:bg-[#151515] border border-white/8 hover:border-white/15 p-3 rounded-xl transition"
                    >
                      <img
                        src={g.image}
                        alt={g.title}
                        className="w-10 h-14 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{g.title}</h4>
                        <span className="text-[10px] text-[#E00000] font-black block mt-0.5">₹{g.price}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: ACCOUNT ── */}
        {activeTab === "account" && (
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2 select-none">
              <UserRound className="w-5 h-5 text-zinc-500" /> Account Information
            </h2>

            {/* Profile card */}
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
              <div className="flex flex-col gap-4 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest select-none">Display Name</span>
                  <span className="text-white font-bold">{user?.user_metadata?.full_name || "—"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest select-none">Email Address</span>
                  <span className="flex items-center gap-1.5 text-zinc-300 font-semibold break-all">
                    <Mail className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    {user?.email || "—"}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 flex items-center gap-2 text-[10px] text-emerald-400 font-black uppercase tracking-wider select-none">
                <ShieldCheck className="w-4 h-4" /> Secured Account
              </div>
            </div>

            {/* Privacy note */}
            <p className="text-[10px] text-zinc-600 text-center select-none">
              Your order information is securely associated with your account.
            </p>

            {/* Support card */}
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 select-none">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black uppercase tracking-tight text-white mb-1">Need Help?</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Have a question about an order or game? Our support team is available on WhatsApp.
                </p>
              </div>
              <button
                onClick={() => {
                  const msg = `Hi CG39 support, I need help with my account (${user?.email}).`;
                  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
                }}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition shrink-0 min-h-[44px]"
                aria-label="Contact support via WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4" /> Contact Support
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="flex items-center justify-center gap-2 w-full border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 rounded-xl py-3.5 text-xs font-bold uppercase tracking-wider transition min-h-[48px] disabled:opacity-50"
              aria-label="Log out of your account"
            >
              <LogOut className="w-4 h-4" />
              {logoutLoading ? "Logging out…" : "Log Out"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
