import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import {
  ShoppingBag,
  MagnifyingGlass as Search,
  CheckCircle as CheckCircle2,
  Clock as Clock3,
  Warning as AlertTriangle,
  ArrowLeft,
  Copy,
  Check,
  ChatCircle as MessageCircle,
  User,
  Envelope as Mail,
  Phone,
  ShieldCheck,
  Package as PackageCheck,
  Key as KeyRound,
  PaperPlane as Send,
  Eye,
  EyeSlash as EyeOff,
  CaretRight as ChevronRight,
  CreditCard,
  Lock as LockKeyhole,
  ArrowClockwise as RefreshCw,
  CircleNotch as Loader2,
  DownloadSimple as Download,
  Key
} from "@phosphor-icons/react";
import { FaWhatsapp } from "react-icons/fa";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { getWhatsAppOrderUrl } from "../utils/whatsapp";

const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`;

/* ─── Status helpers ─────────────────────────────────────────────── */
const getStatusDisplay = (status, paymentStatus) => {
  const s = (status || "").toLowerCase();
  const p = (paymentStatus || "").toLowerCase();

  if (s === "cancelled") return {
    text: "Order Cancelled", stepIndex: 0,
    badgeClass: "bg-red-500/10 text-red-400 border border-red-500/20",
    icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
  };
  if (s === "refunded") return {
    text: "Order Refunded", stepIndex: 0,
    badgeClass: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    icon: <AlertTriangle className="w-4 h-4 text-purple-400" />,
  };
  if (s === "delivered" || s === "completed") return {
    text: "Game Accounts Delivered", stepIndex: 6,
    badgeClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  };
  if (s === "processing") return {
    text: "Preparing Game Details", stepIndex: 4,
    badgeClass: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    icon: <Clock3 className="w-4 h-4 text-blue-400 animate-pulse" />,
  };
  if (s === "submitted" || p === "submitted") return {
    text: "UTR Submitted — Verifying Payment", stepIndex: 2,
    badgeClass: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    icon: <Clock3 className="w-4 h-4 text-yellow-400" />,
  };
  if (s === "pending_payment" || s === "pending") return {
    text: "Awaiting UPI Payment", stepIndex: 1,
    badgeClass: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    icon: <Clock3 className="w-4 h-4 text-amber-400 animate-pulse" />,
  };
  return {
    text: status ? status.toUpperCase() : "Awaiting Verification", stepIndex: 2,
    badgeClass: "bg-white/8 text-zinc-300 border border-white/10",
    icon: <Clock3 className="w-4 h-4 text-zinc-400" />,
  };
};

const TIMELINE_STEPS = [
  { icon: ShoppingBag,  label: "Order Created",     desc: "Order received and registered",             idx: 1 },
  { icon: CreditCard,   label: "Payment Submitted",  desc: "Payment reference received and queued",     idx: 2 },
  { icon: ShieldCheck,  label: "Payment Verified",   desc: "Bank verification completed",               idx: 3 },
  { icon: PackageCheck, label: "Processing",         desc: "Order is being prepared",                   idx: 4 },
  { icon: KeyRound,     label: "Digital Delivery",   desc: "Credentials being configured",              idx: 5 },
  { icon: CheckCircle2, label: "Completed",          desc: "Order complete — credentials available",    idx: 6 },
];

/* ─── Copy button ────────────────────────────────────────────────── */
const CopyButton = ({ text, label = "Copy", className = "" }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      aria-label={`Copy ${label}`}
      className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all duration-150 min-h-[32px] shrink-0 ${
        copied
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          : "bg-white border-[#E5E5E5] text-[#555555] hover:text-[#111111] hover:border-[#D4D4D4] hover:bg-[#F5F5F5]"
      } ${className}`}
    >
      {copied
        ? <><Check className="w-3 h-3" /><span>Copied</span></>
        : <><Copy className="w-3 h-3" /><span>Copy</span></>
      }
    </button>
  );
};

/* ─── Skeleton ───────────────────────────────────────────────────── */
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-[#E5E5E5] rounded-xl ${className}`} />
);

/* ─── OrderStatus component ─────────────────────────────────────── */
const OrderStatus = () => {
  const { accessToken }  = useAuth();
  const location         = useLocation();
  const navigate         = useNavigate();

  const queryParams  = new URLSearchParams(location.search);
  const urlOrderId   = queryParams.get("id") || "";

  const [orderId,          setOrderId]          = useState(urlOrderId);
  const [order,            setOrder]            = useState(null);
  const [loading,          setLoading]          = useState(false);
  const [searched,         setSearched]         = useState(false);
  const [error,            setError]            = useState(null);
  const [showCredentials,  setShowCredentials]  = useState(false);

  const fetchOrderDetails = useCallback(async (idToFetch) => {
    if (!idToFetch.trim()) {
      toast.error("Please enter a valid Order ID");
      return;
    }
    setLoading(true);
    setSearched(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/orders/${idToFetch.trim()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setOrder(res.data);
      setOrderId(idToFetch.trim());
    } catch (err) {
      console.error("Fetch order details error:", err);
      const status = err.response?.status;
      if (status === 404) {
        setError("not_found");
        toast.error("Order not found or access denied.");
      } else if (status === 401) {
        toast.error("Please log in to view this order.");
        navigate("/login");
      } else {
        setError("generic");
        toast.error("Failed to load order details");
      }
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    if (urlOrderId && accessToken) {
      fetchOrderDetails(urlOrderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlOrderId, accessToken]);

  /* ── Computed ── */
  const statusInfo  = order ? getStatusDisplay(order.status, order.payment_status) : null;
  const isDelivered = statusInfo?.stepIndex >= 6;
  const steamTotal  = order?.order_items?.reduce(
    (sum, i) => sum + (i.games?.steam_price || 0) * i.quantity, 0
  ) || 0;
  const savings = steamTotal - (order?.total_price || 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] text-white pt-[68px] md:pt-[74px] pb-20 px-4 sm:px-6 font-sans">
        <div className="max-w-[1200px] mx-auto space-y-6">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-24 w-full" />
          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-7 space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-48" />
            </div>
            <div className="md:col-span-5 space-y-6">
              <Skeleton className="h-48" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Search / empty state ── */
  const showSearch = !order && !searched;
  const showNotFound = searched && !order && error === "not_found";
  const showError = searched && !order && error === "generic";

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-[68px] md:pt-[74px] pb-20 px-4 sm:px-6 font-sans">
      <div className="max-w-[1200px] mx-auto">

        {/* BREADCRUMB */}
        <Breadcrumbs paths={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Order Status" }
        ]} />

        {/* ── SEARCH / LANDING ── */}
        {showSearch && (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-8 shadow-xl flex flex-col gap-6">
              <div className="w-14 h-14 rounded-full bg-[#E00000]/8 border border-[#E00000]/15 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7 text-[#E00000]" />
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-2 select-none">
                  Track Order <span className="text-[#E00000]">Status</span>
                </h1>
                <p className="text-xs text-zinc-500 leading-relaxed select-none max-w-xs mx-auto">
                  Enter your Order ID to track delivery status and access your game credentials.
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Enter 36-character Order ID (e.g. a94106a1-...)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchOrderDetails(orderId)}
                  className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl pl-10 pr-4 py-3.5 focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]/20 outline-none transition text-sm font-mono text-center placeholder-[#AAAAAA] text-[#111111]"
                  style={{ height: "48px" }}
                />
                <button
                  onClick={() => fetchOrderDetails(orderId)}
                  disabled={loading}
                  className="w-full bg-[#E00000] hover:bg-[#F00000] disabled:opacity-50 py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider min-h-[48px]"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Search className="w-4 h-4" /> Track Order Status</>}
                </button>
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-1.5 text-xs text-[#555555] hover:text-[#111111] transition uppercase tracking-wider font-bold justify-center"
                aria-label="Back to Dashboard"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#E00000]" /> Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* ── NOT FOUND STATE ── */}
        {showNotFound && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-8 shadow-xl flex flex-col gap-5">
              <div className="w-14 h-14 rounded-full bg-red-500/8 border border-red-500/15 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2 select-none">Order Not Found</h2>
                <p className="text-xs text-zinc-500 leading-relaxed select-none">
                  We couldn't find this order. Please check the Order ID or log in to access your orders.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { setSearched(false); setError(null); setOrderId(""); }}
                  className="w-full bg-[#E00000] hover:bg-[#F00000] text-white rounded-xl py-3 font-bold text-xs uppercase tracking-wider transition min-h-[44px]"
                >Try Again</button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full border border-[#E5E5E5] hover:border-[#D4D4D4] text-[#555555] hover:text-[#111111] hover:bg-[#F5F5F5] rounded-xl py-3 font-bold text-xs uppercase tracking-wider transition min-h-[44px]"
                >Go to Dashboard</button>
              </div>
            </div>
          </div>
        )}

        {/* ── GENERIC ERROR STATE ── */}
        {showError && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-8 shadow-xl flex flex-col gap-5">
              <div className="w-14 h-14 rounded-full bg-zinc-800 border border-white/8 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2 select-none">Unable to Load Order</h2>
                <p className="text-xs text-zinc-500 leading-relaxed select-none">
                  Something went wrong while loading your order details. Please try again.
                </p>
              </div>
              <button
                onClick={() => fetchOrderDetails(orderId)}
                className="w-full bg-[#E00000] hover:bg-[#F00000] text-white rounded-xl py-3 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 min-h-[44px]"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            </div>
          </div>
        )}

        {/* ── ORDER LOADED ── */}
        {order && statusInfo && searched && (
          <>
            {/* ORDER HEADER */}
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-5 sm:p-6 mb-6 shadow-xl flex flex-col sm:flex-row sm:items-center gap-4 select-none">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider block">Order</span>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="font-mono text-sm text-white font-bold">#{order.id.substring(0, 8).toUpperCase()}...</span>
                  <CopyButton text={order.id} label="Order ID" />
                </div>
                <span className="text-[10px] text-zinc-600 mt-1.5 block">Placed on {formatDate(order.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {statusInfo.icon}
                <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border ${statusInfo.badgeClass}`}>
                  {statusInfo.text}
                </span>
              </div>
            </div>

            {/* TWO-COLUMN GRID */}
            <div className="grid md:grid-cols-12 gap-6 items-start">

              {/* ── LEFT: Timeline + Items ── */}
              <div className="md:col-span-7 flex flex-col gap-6">

                {/* VERTICAL TIMELINE */}
                <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6 select-none">Order Timeline</h2>
                  <div className="flex flex-col gap-0">
                    {TIMELINE_STEPS.map((step, i) => {
                      const StepIcon = step.icon;
                      const isDone   = statusInfo.stepIndex > step.idx;
                      const isActive = statusInfo.stepIndex === step.idx;
                      const isLast   = i === TIMELINE_STEPS.length - 1;
                      return (
                        <div key={step.idx} className="flex gap-4 relative"
                          style={{ animationDelay: `${i * 90}ms` }}>
                          <div className="flex flex-col items-center shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                              isDone   ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                              : isActive ? "bg-[#E00000]/10 border-[#E00000] text-[#E00000]"
                              : "bg-[#F8F8F8] border-[#E5E5E5] text-[#777777]"
                            }`}>
                              {isDone
                                ? <Check className="w-4 h-4" />
                                : <StepIcon className="w-4 h-4" />
                              }
                            </div>
                            {!isLast && (
                              <div className={`w-px flex-1 min-h-[24px] my-1 ${isDone ? "bg-emerald-500/30" : "bg-[#E5E5E5]"}`} />
                            )}
                          </div>
                          <div className={`pb-5 flex-1 min-w-0 ${isLast ? "pb-0" : ""}`}>
                            <span className={`text-xs font-black uppercase tracking-wide block leading-tight ${
                              isDone ? "text-emerald-500" : isActive ? "text-[#111111]" : "text-[#777777]"
                            }`}>{step.label}</span>
                            <span className={`text-[10px] mt-0.5 block ${
                              isDone ? "text-[#777777]" : isActive ? "text-[#555555]" : "text-[#999999]"
                            }`}>{step.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ORDER ITEMS */}
                <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
                  <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 select-none">Products</h2>
                  <div className="flex flex-col gap-3">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="flex gap-3 items-center bg-[#080808] p-3 rounded-xl border border-white/8">
                        {item.games?.image_url && (
                          <img
                            src={item.games.image_url}
                            alt={item.games.title}
                            className="w-12 h-16 object-cover rounded-lg shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate leading-tight">{item.games?.title}</h4>
                          {item.games?.genre && (
                            <span className="text-[9px] text-zinc-600 uppercase tracking-wider font-bold block mt-0.5">{item.games.genre}</span>
                          )}
                          <p className="text-[10px] text-zinc-500 mt-1 font-bold">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right select-none shrink-0">
                          <span className="text-xs font-extrabold text-white block">₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Financial summary */}
                  <div className="border-t border-white/5 pt-4 flex flex-col gap-2.5 text-xs select-none">
                    {steamTotal > 0 && (
                      <div className="flex justify-between text-zinc-500 font-bold">
                        <span>Steam Value</span>
                        <span>₹{steamTotal.toLocaleString()}</span>
                      </div>
                    )}
                    {savings > 0 && (
                      <div className="flex justify-between text-emerald-400 font-extrabold bg-emerald-500/5 px-2.5 py-1.5 rounded border border-emerald-500/10">
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> You Saved</span>
                        <span>₹{savings.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center font-black text-sm border-t border-white/5 pt-2.5">
                      <span className="text-white">Order Total</span>
                      <span className="text-[#E00000] text-base">₹{(order.total_price || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* ── RIGHT: Summary + Payment + Delivery + Support ── */}
              <div className="md:col-span-5 flex flex-col gap-6 md:sticky md:top-28">

                {/* PAYMENT DETAILS */}
                <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                  <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 select-none">Payment</h2>
                  <div className="flex flex-col gap-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 font-bold uppercase tracking-wide">Method</span>
                      <span className="font-bold text-white">UPI</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-zinc-500 font-bold uppercase tracking-wide shrink-0">Reference</span>
                      {order.transaction_id ? (
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-zinc-300 truncate text-[10px]">{order.transaction_id}</span>
                          <CopyButton text={order.transaction_id} label="Transaction ID" />
                        </div>
                      ) : (
                        <span className="text-amber-400 font-bold text-[10px] uppercase">Not submitted</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 font-bold uppercase tracking-wide">Status</span>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusInfo.badgeClass}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>

                  {/* Customer info */}
                  <div className="border-t border-white/5 pt-4 flex flex-col gap-2.5 text-xs">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 select-none">Recipient</h3>
                    {order.billing_name && (
                      <div className="flex items-center gap-2 text-zinc-400 font-semibold">
                        <User className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                        <span className="truncate">{order.billing_name}</span>
                      </div>
                    )}
                    {order.billing_email && (
                      <div className="flex items-center gap-2 text-zinc-400 font-semibold">
                        <Mail className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                        <span className="truncate">{order.billing_email}</span>
                      </div>
                    )}
                    {order.billing_phone && (
                      <div className="flex items-center gap-2 text-zinc-400 font-semibold">
                        <Phone className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                        <span>{order.billing_phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* DELIVERY SECTION */}
                <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                  <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 select-none">Digital Delivery</h2>

                  {!isDelivered || !order.delivery_details ? (
                    /* Locked state */
                    <div className="bg-[#080808] border border-white/8 rounded-xl p-5 text-center flex flex-col gap-3 select-none">
                      <div className="w-10 h-10 rounded-full bg-white/4 border border-white/8 flex items-center justify-center mx-auto">
                        <LockKeyhole className="w-5 h-5 text-zinc-600" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-zinc-400 block">Delivery Details Locked</span>
                        <span className="text-[10px] text-zinc-600 mt-1 block leading-relaxed">
                          Your game credentials will appear here once your order has been successfully verified and processed.
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Unlocked state — existing delivery security logic preserved */
                    <div className="flex flex-col gap-3">
                      <div className="bg-amber-500/8 border border-amber-500/15 rounded-xl p-3 text-[11px] text-amber-300 font-semibold leading-relaxed select-none">
                        Keep these details private. Do not share your game credentials with anyone else.
                      </div>
                      <div className="bg-[#080808] border border-white/8 rounded-xl p-4 relative">
                        <pre className="whitespace-pre-wrap font-mono text-xs text-white break-all pr-14 select-all leading-relaxed">
                          {showCredentials
                            ? order.delivery_details
                            : order.delivery_details.replace(/./g, "•").substring(0, 40) + "\n(Details Masked)"
                          }
                        </pre>
                        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
                          <button
                            onClick={() => setShowCredentials(!showCredentials)}
                            className="bg-white/5 hover:bg-white/10 p-2 rounded-lg transition"
                            aria-label={showCredentials ? "Hide credentials" : "Show credentials"}
                          >
                            {showCredentials
                              ? <EyeOff className="w-4 h-4 text-zinc-400" />
                              : <Eye    className="w-4 h-4 text-zinc-400" />
                            }
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(order.delivery_details);
                              toast.success("Delivery details copied");
                            }}
                            className="bg-white/5 hover:bg-white/10 p-2 rounded-lg transition"
                            aria-label="Copy delivery details"
                          >
                            <Copy className="w-4 h-4 text-zinc-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* SUPPORT + CTAs */}
                <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        window.open(getWhatsAppOrderUrl(order), "_blank");
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition min-h-[44px]"
                      aria-label="Contact support on WhatsApp"
                    >
                      <FaWhatsapp className="w-4 h-4" /> Contact Support via WhatsApp
                    </button>

                    {(order.status === "pending" || order.status === "pending_payment") && (
                      <button
                        onClick={() => {
                          sessionStorage.setItem("cg39_checkout_step", "2");
                          sessionStorage.setItem("cg39_checkout_order_id", order.id);
                          navigate("/checkout");
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-[#E00000] hover:bg-[#F00000] text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition hover:shadow-[0_0_15px_rgba(255,0,0,0.25)] min-h-[44px]"
                        aria-label="Submit payment reference for pending order"
                      >
                        <Send className="w-4 h-4" /> Submit Payment Reference
                      </button>
                    )}
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => {
                        setOrder(null);
                        setSearched(false);
                        setOrderId("");
                        navigate("/order-status");
                      }}
                      className="text-[10px] text-zinc-600 hover:text-zinc-300 underline uppercase tracking-wider font-semibold transition"
                    >
                      Track A Different Order
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default OrderStatus;
