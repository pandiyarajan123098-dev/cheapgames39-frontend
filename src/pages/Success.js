import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import {
  CheckCircle2,
  Clock3,
  Copy,
  Check,
  ChevronRight,
  ShoppingBag,
  CreditCard,
  ShieldCheck,
  PackageCheck,
  KeyRound,
  MessageCircle,
  ArrowRight,
  LockKeyhole,
} from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";

const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`;
const WHATSAPP_NUMBER = "916379490178";

/* ─── Status helpers ─────────────────────────────────────────────── */
const getStepIndex = (status) => {
  const s = (status || "").toLowerCase();
  if (s === "completed" || s === "delivered") return 6;
  if (s === "processing") return 4;
  if (s === "submitted") return 2;
  if (s === "pending_payment" || s === "pending") return 1;
  return 2; // fallback: assume submitted
};

const TIMELINE_STEPS = [
  { icon: ShoppingBag,   label: "Order Created",     desc: "Order received and registered",                  idx: 1 },
  { icon: CreditCard,    label: "Payment Submitted",  desc: "Payment reference received",                     idx: 2 },
  { icon: ShieldCheck,   label: "Payment Verified",   desc: "Bank verification completed",                    idx: 3 },
  { icon: PackageCheck,  label: "Processing",         desc: "Order is being prepared",                        idx: 4 },
  { icon: KeyRound,      label: "Digital Delivery",   desc: "Credentials being configured",                   idx: 5 },
  { icon: CheckCircle2,  label: "Completed",          desc: "Order complete — credentials available",         idx: 6 },
];

/* ─── Copy button ────────────────────────────────────────────────── */
const CopyButton = ({ text, className = "" }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      aria-label="Copy to clipboard"
      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all duration-150 min-h-[34px] ${
        copied
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          : "bg-white border-[#E5E5E5] text-[#555555] hover:text-[#111111] hover:border-[#D4D4D4] hover:bg-[#F5F5F5]"
      } ${className}`}
    >
      {copied ? (
        <><Check className="w-3.5 h-3.5" /><span>Copied</span></>
      ) : (
        <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>
      )}
    </button>
  );
};

/* ─── Skeleton loader ────────────────────────────────────────────── */
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-[#E5E5E5] rounded-xl ${className}`} />
);

/* ─── Main component ─────────────────────────────────────────────── */
const Success = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { accessToken } = useAuth();

  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const orderId     = location.state?.orderId || queryParams.get("id");

  useEffect(() => {
    if (!orderId) {
      toast.error("No valid order found");
      navigate("/dashboard");
      return;
    }
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setOrder(res.data);
      } catch (err) {
        console.error("Success page fetch error:", err);
        toast.error("Unable to load order details");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    if (accessToken) fetchOrder();
  }, [orderId, accessToken, navigate]);

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] text-white pt-[76px] md:pt-[82px] pb-20 px-4 sm:px-6 font-sans">
        <div className="max-w-[760px] mx-auto space-y-6 animate-pulse">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!order) return null;

  const stepIndex   = getStepIndex(order.status);
  const isDelivered = stepIndex >= 6;
  const isVerified  = stepIndex >= 3;

  /* ── Totals ── */
  const steamTotal = order.order_items?.reduce(
    (sum, i) => sum + (i.games?.steam_price || 0) * i.quantity, 0
  ) || 0;
  const savings = steamTotal - (order.total_price || 0);

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-[76px] md:pt-[82px] pb-20 px-4 sm:px-6 font-sans">
      <div className="max-w-[760px] mx-auto">

        {/* BREADCRUMB */}
        <Breadcrumbs paths={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Order Confirmation" }
        ]} />

        {/* ── HERO CONFIRMATION CARD ── */}
        <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 sm:p-10 text-center mb-6 shadow-xl">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 border shadow-xl ${
            isDelivered
              ? "bg-emerald-500/10 border-emerald-500/20"
              : "bg-yellow-500/10 border-yellow-500/20"
          }`}>
            {isDelivered
              ? <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              : <Clock3       className="w-8 h-8 text-yellow-400" />
            }
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-tight select-none mb-2">
            Payment Reference<br />
            <span className="text-[#E00000]">
              {isDelivered ? "Delivered" : "Submitted"}
            </span>
          </h1>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed select-none">
            {isDelivered
              ? "Your order has been fully processed. Delivery details are available below."
              : "Your payment reference has been submitted and is awaiting verification by our team."
            }
          </p>

          {/* Order ID row */}
          <div className="mt-6 inline-flex items-center gap-3 bg-[#080808] border border-white/8 rounded-xl px-4 py-3 select-none">
            <div className="text-left">
              <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">Order ID</span>
              <span className="font-mono text-xs text-white select-all">#{order.id?.substring(0,8).toUpperCase()}</span>
            </div>
            <CopyButton text={order.id} />
          </div>
        </div>

        {/* ── ORDER ITEMS + TOTALS ── */}
        <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 mb-6 shadow-xl flex flex-col gap-5">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 select-none">
            <ShoppingBag className="w-4 h-4 text-zinc-500" /> Items Ordered
          </h2>

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
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-bold block mt-0.5">{item.games.genre}</span>
                  )}
                  <p className="text-[10px] text-zinc-500 mt-1 font-bold">Qty: {item.quantity}</p>
                </div>
                <div className="text-right shrink-0 select-none">
                  <span className="text-xs font-extrabold text-white block">₹{(item.price * item.quantity).toLocaleString()}</span>
                  {item.games?.steam_price && item.games.steam_price > item.price && (
                    <span className="text-[9px] text-zinc-600 line-through">₹{(item.games.steam_price * item.quantity).toLocaleString()}</span>
                  )}
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

        {/* ── VERTICAL TIMELINE ── */}
        <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 mb-6 shadow-xl">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6 select-none">Order Timeline</h2>
          <div className="relative flex flex-col gap-0">
            {TIMELINE_STEPS.map((step, i) => {
              const StepIcon   = step.icon;
              const isDone     = stepIndex > step.idx;
              const isActive   = stepIndex === step.idx;
              const isFuture   = stepIndex < step.idx;
              const isLast     = i === TIMELINE_STEPS.length - 1;
              return (
                <div key={step.idx} className="flex gap-4 relative"
                  style={{ animationDelay: `${i * 80}ms` }}>
                  {/* Connector line */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isDone   ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                      : isActive ? "bg-[#E00000]/10 border-[#E00000] text-[#E00000]"
                      : "bg-[#0d0d0d] border-white/8 text-zinc-700"
                    }`}>
                      {isDone
                        ? <Check className="w-4 h-4" />
                        : <StepIcon className="w-4 h-4" />
                      }
                    </div>
                    {!isLast && (
                      <div className={`w-px flex-1 min-h-[28px] my-1 ${isDone ? "bg-emerald-500/30" : "bg-white/6"}`} />
                    )}
                  </div>
                  {/* Content */}
                  <div className={`pb-6 flex-1 min-w-0 ${isLast ? "pb-0" : ""}`}>
                    <span className={`text-xs font-black uppercase tracking-wide block leading-tight ${
                      isDone ? "text-emerald-400" : isActive ? "text-white" : "text-zinc-600"
                    }`}>
                      {step.label}
                    </span>
                    <span className={`text-[10px] mt-0.5 block ${
                      isDone ? "text-zinc-500" : isActive ? "text-zinc-400" : "text-zinc-700"
                    }`}>
                      {step.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── WHAT HAPPENS NEXT ── */}
        <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 mb-6 shadow-xl">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-5 select-none">What Happens Next?</h2>
          <div className="flex flex-col gap-4">
            {[
              { n: "01", title: "Payment Verification",   body: "Our team verifies the submitted payment reference against bank records. This typically takes 5–30 minutes." },
              { n: "02", title: "Order Processing",        body: "Once verified, your order moves into digital fulfillment preparation." },
              { n: "03", title: "Digital Delivery",        body: "Delivery details become available on your Order Status page when the order reaches the appropriate delivery state." },
            ].map(({ n, title, body }) => (
              <div key={n} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#E00000]/8 border border-[#E00000]/15 text-[#E00000] flex items-center justify-center text-[9px] font-black shrink-0 select-none">{n}</span>
                <div className="leading-snug">
                  <span className="text-xs font-bold text-white block">{title}</span>
                  <span className="text-[10px] text-zinc-500 mt-0.5 block">{body}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SUPPORT CARD ── */}
        <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 mb-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 select-none">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-black uppercase tracking-tight text-white mb-1">Need Help?</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Our support team is available through WhatsApp for order coordination and status updates.
            </p>
          </div>
          <button
            onClick={() => {
              const msg = `Hi CG39 support, I need help with my order. Order ID: #${order.id}`;
              window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
            }}
            className="flex items-center gap-2 bg-green-50 hover:bg-green-100 border border-green-200 hover:border-green-300 text-green-700 hover:text-green-800 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition shrink-0 min-h-[44px]"
            aria-label="Chat with support on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </button>
        </div>

        {/* ── PRIMARY CTA ROW ── */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate(`/order-status?id=${order.id}`)}
            className="flex-1 bg-[#E00000] hover:bg-[#F00000] text-white rounded-xl py-4 font-bold uppercase text-xs tracking-wider transition hover:shadow-[0_0_20px_rgba(255,0,0,0.25)] flex items-center justify-center gap-2 min-h-[48px] active:scale-[0.98]"
            aria-label="View Order Status page"
          >
            <span>View Order Status</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-white border border-[#E5E5E5] hover:border-[#D4D4D4] text-[#555555] hover:text-[#111111] hover:bg-[#F5F5F5] rounded-xl py-4 font-bold uppercase text-xs tracking-wider transition flex items-center justify-center gap-2 min-h-[48px] active:scale-[0.98]"
            aria-label="Continue shopping"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Continue Shopping</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Success;
