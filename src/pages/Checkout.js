import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { 
  ShoppingBag, 
  CreditCard, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  CaretRight as ChevronRight, 
  Lock, 
  Copy, 
  Check, 
  Phone,
  User,
  Envelope as Mail,
  ShieldCheck,
  ChatCircle as MessageCircle,
  Receipt,
  CheckCircle as CheckCircle2,
  CircleNotch as Loader2,
  Package as PackageSearch,
  GameController as Gamepad2
} from "@phosphor-icons/react";
import OrderProcessingLoader from "../components/OrderProcessingLoader";
import { FaWhatsapp } from "react-icons/fa";
import { getWhatsAppOrderUrl, WHATSAPP_SUPPORT_NUMBER } from "../utils/whatsapp";

const API_BASE = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`;
const WHATSAPP_NUMBER = WHATSAPP_SUPPORT_NUMBER;

// Safe UUID Generator
const generateUUID = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
};

const Checkout = () => {
  const { user, accessToken } = useAuth();
  const { cart, removeItemsByGameIds, refreshCart } = useCart();
  const navigate = useNavigate();

  // Step state: 1 = Review, 2 = Payment, 3 = Pending Confirmation
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  // Truck loader: true ONLY during the order-creation API call
  const [orderCreating, setOrderCreating] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [serverOrder, setServerOrder] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [purchasedGameIds, setPurchasedGameIds] = useState([]);
  const [copied, setCopied] = useState(false);

  // Prefill form from user profile with safe fallback
  const [formData, setFormData] = useState({
    billing_name: user?.user_metadata?.full_name || (user?.email ? user.email.split("@")[0] : ""),
    billing_email: user?.email || "",
    billing_phone: "",
  });

  const idempotencyKey = useRef(generateUUID());

  // Restore state from sessionStorage on mount (Refresh Safety)
  useEffect(() => {
    const savedStep = sessionStorage.getItem("cg39_checkout_step");
    const savedOrderId = sessionStorage.getItem("cg39_checkout_order_id");
    const savedFormData = sessionStorage.getItem("cg39_checkout_form_data");
    const savedGameIds = sessionStorage.getItem("cg39_checkout_game_ids");

    if (savedFormData) {
      try {
        setFormData(prev => ({ ...prev, ...JSON.parse(savedFormData) }));
      } catch (e) {}
    }
    if (savedGameIds) {
      try {
        setPurchasedGameIds(JSON.parse(savedGameIds));
      } catch (e) {}
    }

    if (savedOrderId && savedStep) {
      const fetchOrderDetails = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${API_BASE}/orders/${savedOrderId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          setOrderId(savedOrderId);
          setServerOrder(res.data);
          
          // Determine the correct step based on the retrieved order's status
          const orderStatus = res.data.status?.toLowerCase();
          if (orderStatus === "pending") {
            setStep(2);
          } else if (orderStatus === "submitted" || orderStatus === "paid" || orderStatus === "processing") {
            setStep(3);
          }
        } catch (err) {
          console.error("Order recovery error:", err);
          // If 404 or expired, reset checkout
          sessionStorage.removeItem("cg39_checkout_step");
          sessionStorage.removeItem("cg39_checkout_order_id");
          setStep(1);
        } finally {
          setLoading(false);
        }
      };

      if (accessToken) {
        fetchOrderDetails();
      }
    }
  }, [accessToken]);

  // Keep form in sync when user data loads asynchronously
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        billing_name: prev.billing_name || user.user_metadata?.full_name || (user.email ? user.email.split("@")[0] : ""),
        billing_email: prev.billing_email || user.email || "",
      }));
    }
  }, [user]);

  /* =========================================
     TOTAL CALCULATION
  ========================================= */
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.games?.price || 0) * item.quantity, 0);
  }, [cart]);

  const cartSteamTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.games?.steam_price || 0) * item.quantity, 0);
  }, [cart]);

  const cartSavings = cartSteamTotal - cartSubtotal;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      sessionStorage.setItem("cg39_checkout_form_data", JSON.stringify(updated));
      return updated;
    });
  };

  /* =========================================
     STEP 1: CREATE ORDER
  ========================================= */
  const handleCreateOrder = async (e) => {
    e.preventDefault();

    if (!user || !accessToken) {
      toast.error("Please login first to proceed");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const nameToSubmit = formData.billing_name?.trim() || user?.user_metadata?.full_name || (user?.email ? user.email.split("@")[0] : "Customer");
    const emailToSubmit = formData.billing_email?.trim() || user?.email || "";

    if (!nameToSubmit || nameToSubmit.length < 2) {
      toast.error("Please enter your Full Name");
      return;
    }

    if (!emailToSubmit || !emailToSubmit.includes("@")) {
      toast.error("Please enter a valid Email address");
      return;
    }

    if (!formData.billing_phone || formData.billing_phone.trim().length < 8) {
      toast.error("Please enter a valid Phone/WhatsApp number");
      return;
    }

    // Minimum loader display: 5 seconds
    const MIN_LOADER_MS = 5000;

    try {
      setLoading(true);
      setOrderCreating(true); // ← show truck loader

      const items = cart
        .map((item) => ({
          game_id: item.games?.id || item.game_id || item.id,
          quantity: Number(item.quantity) || 1,
        }))
        .filter((item) => Boolean(item.game_id));

      if (items.length === 0) {
        toast.error("Your cart items are missing valid game information. Please refresh your cart.");
        return;
      }

      // Cache game IDs to selectively remove later
      const gameIds = items.map((item) => item.game_id).filter(Boolean);
      setPurchasedGameIds(gameIds);
      sessionStorage.setItem("cg39_checkout_game_ids", JSON.stringify(gameIds));

      console.log("ORDER CREATION INITIATED", {
        userId: user?.id,
        userEmail: user?.email,
        cartCount: cart.length,
        itemsToSubmit: items,
        formData: {
          billing_name: formData.billing_name,
          billing_email: formData.billing_email,
          billing_phone: formData.billing_phone,
        }
      });

      // Run API call + 5-second minimum delay in parallel
      const [res] = await Promise.all([
        axios.post(
          `${API_BASE}/orders`,
          {
            billing_name: formData.billing_name,
            billing_email: formData.billing_email,
            billing_phone: formData.billing_phone,
            items,
            idempotency_key: idempotencyKey.current,
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        ),
        new Promise((resolve) => setTimeout(resolve, MIN_LOADER_MS)),
      ]);

      const createdOrder = res.data;
      console.log("ORDER CREATION SUCCESSFUL", {
        orderId: createdOrder.id,
        total: createdOrder.total_price,
        status: createdOrder.status,
        itemCount: createdOrder.order_items?.length
      });

      setOrderId(createdOrder.id);
      setServerOrder(createdOrder);

      // Save progress to sessionStorage for refresh safety
      sessionStorage.setItem("cg39_checkout_step", "2");
      sessionStorage.setItem("cg39_checkout_order_id", createdOrder.id);

      // Selectively remove purchased games from cart database
      await removeItemsByGameIds(gameIds);

      setOrderCreating(false); // ← hide truck loader, show step 2
      setStep(2);
      toast.success("Order created! Proceed to UPI payment.");
    } catch (error) {
      console.error("ORDER CREATION DEBUG FAILURE", {
        userId: user?.id,
        apiStatus: error.response?.status,
        response: error.response?.data,
        error: error.message
      });
      const errMsg = error.response?.data?.error || error.message || "Failed to initiate order";
      toast.error(errMsg);
    } finally {
      setLoading(false);
      setOrderCreating(false); // ← always stop loader on error too
    }
  };

  /* =========================================
     STEP 2: SUBMIT PAYMENT
  ========================================= */
  const handleConfirmPayment = async () => {
    if (!transactionId || transactionId.trim().length < 8) {
      toast.error("Please enter a valid UPI Transaction ID (min 8 characters)");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.put(
        `${API_BASE}/orders/${orderId}`,
        { transaction_id: transactionId.trim() },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setServerOrder(res.data);
      setStep(3);
      sessionStorage.setItem("cg39_checkout_step", "3");

      toast.success("Payment submitted successfully! Support notified.");
      
      // WhatsApp notification with complete order details
      const orderPayload = res.data || serverOrder || {
        id: orderId,
        total_price: payableAmount,
        transaction_id: transactionId.trim(),
        billing_name: formData.billing_name,
        billing_email: formData.billing_email,
        billing_phone: formData.billing_phone,
      };

      const waUrl = getWhatsAppOrderUrl(orderPayload, cart);
      window.open(waUrl, "_blank");
    } catch (error) {
      const errMsg = error.response?.data?.error || "Failed to submit transaction details";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Reset checkout session to start a new order
  const handleResetCheckout = () => {
    sessionStorage.removeItem("cg39_checkout_step");
    sessionStorage.removeItem("cg39_checkout_order_id");
    sessionStorage.removeItem("cg39_checkout_game_ids");
    idempotencyKey.current = generateUUID();
    setStep(1);
    setOrderId(null);
    setServerOrder(null);
    setTransactionId("");
    refreshCart();
  };

  const handleGoBack = () => {
    if (step === 2) {
      setStep(1);
      sessionStorage.setItem("cg39_checkout_step", "1");
    }
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText("pandiyarajan39@ptyes");
    setCopied(true);
    toast.success("UPI ID Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  /* =========================================
     RENDER HELPERS
  ========================================= */
  const payableAmount = serverOrder?.total_price || cartSubtotal;

  const renderBreadcrumbs = () => {
    return (
      <nav className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 mb-6 select-none uppercase tracking-wider">
        <Link to="/" className="hover:text-[#E00000] transition">Home</Link>
        <ChevronRight className="w-3 h-3 text-zinc-700" />
        <Link to="/cart" className="hover:text-[#E00000] transition">Cart</Link>
        <ChevronRight className="w-3 h-3 text-zinc-700" />
        <span className="text-white font-bold">Checkout</span>
      </nav>
    );
  };

  const renderStepper = () => {
    return (
      <div className="flex items-center justify-between bg-[#111111] border border-white/8 rounded-2xl p-4 sm:p-5 mb-8 shadow-md select-none">
        <div className="flex items-center gap-2">
          {step > 1 ? (
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
              <Check className="w-3.5 h-3.5" />
            </span>
          ) : (
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
              step === 1 ? "bg-[#E00000] text-white" : "bg-[#1f1f1f] text-zinc-600"
            }`}>
              01
            </span>
          )}
          <span className={`text-xs font-bold uppercase tracking-wider ${step === 1 ? "text-white" : "text-zinc-500"}`}>
            Review
          </span>
        </div>

        <ChevronRight className="w-4 h-4 text-zinc-700" />

        <div className="flex items-center gap-2">
          {step > 2 ? (
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
              <Check className="w-3.5 h-3.5" />
            </span>
          ) : (
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
              step === 2 ? "bg-[#E00000] text-white" : "bg-[#1f1f1f] text-zinc-600"
            }`}>
              02
            </span>
          )}
          <span className={`text-xs font-bold uppercase tracking-wider ${step === 2 ? "text-white" : "text-zinc-500"}`}>
            Payment
          </span>
        </div>

        <ChevronRight className="w-4 h-4 text-zinc-700" />

        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
            step === 3 ? "bg-[#E00000] text-white" : "bg-[#1f1f1f] text-zinc-600"
          }`}>
            03
          </span>
          <span className={`text-xs font-bold uppercase tracking-wider ${step === 3 ? "text-white" : "text-zinc-500"}`}>
            Confirm
          </span>
        </div>
      </div>
    );
  };

  const renderTrustStrip = () => {
    return (
      <div className="bg-[#111111] border border-white/8 rounded-2xl p-4 text-xs text-zinc-500 select-none space-y-3">
        <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">Order Information</span>
        <div className="grid grid-cols-2 gap-3 text-[11px]">
          <div className="flex items-center gap-1.5 font-bold"><Gamepad2 className="w-4 h-4 text-blue-500" /> Digital Product</div>
          <div className="flex items-center gap-1.5 font-bold"><CreditCard className="w-4 h-4 text-amber-500" /> UPI Payment</div>
          <div className="flex items-center gap-1.5 font-bold"><PackageSearch className="w-4 h-4 text-zinc-400" /> Order Tracking</div>
          <div className="flex items-center gap-1.5 font-bold"><FaWhatsapp className="w-4 h-4 text-zinc-400" /> WhatsApp Support</div>
        </div>
      </div>
    );
  };

  /* ================= TRUCK LOADER — order creation in progress ================= */
  if (orderCreating) {
    return (
      <div className="min-h-screen bg-white pt-[68px] md:pt-[74px]">
        <OrderProcessingLoader />
      </div>
    );
  }

  /* ================= SKELETON LOAD — page hydrating from sessionStorage ================= */
  if (loading && !serverOrder && step === 1) {
    return (
      <div className="min-h-screen bg-[#080808] text-white pt-[68px] md:pt-[74px] pb-20 px-4 sm:px-6 font-sans select-none">
        <div className="max-w-[1320px] mx-auto space-y-8 animate-pulse">
          <div className="h-4 bg-[#151515] rounded w-1/6"></div>
          <div className="h-14 bg-[#151515] rounded-2xl w-full"></div>
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-7 h-96 bg-[#151515] rounded-2xl"></div>
            <div className="md:col-span-5 h-80 bg-[#151515] rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-[68px] md:pt-[74px] pb-20 px-4 sm:px-6 font-sans">
      <div className="max-w-[1320px] mx-auto animate-page-section">
        
        {/* BREADCRUMB */}
        {renderBreadcrumbs()}

        <h1 className="text-3xl sm:text-[42px] font-black uppercase mb-8 text-white tracking-tight select-none">
          Secure <span className="text-[#E00000]">Checkout</span>
        </h1>

        {/* STEPPER */}
        {renderStepper()}

        {/* REQ USER AUTH CHECK */}
        {!user ? (
          <div className="bg-[#111111] border border-white/8 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-2xl space-y-5 my-10 select-none">
            <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 border border-white/8 shadow-xl">
              <Lock className="w-8 h-8 text-[#E00000]" />
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white">Login Required</h2>
            <p className="text-zinc-400 text-xs uppercase tracking-wider leading-relaxed max-w-xs mx-auto">
              An active account is required to securely deliver digital credentials to your profile dashboard.
            </p>
            <button
              onClick={() => {
                sessionStorage.setItem("cg39_checkout_step", "1");
                navigate("/login");
              }}
              className="bg-[#E00000] hover:bg-[#F00000] text-white rounded-xl px-8 py-3.5 font-bold text-xs uppercase tracking-wider transition min-h-[44px] active:scale-[0.98]"
            >
              Sign In to Checkout
            </button>
          </div>
        ) : step === 1 ? (
          /* ================= STEP 1: REVIEW ORDER ================= */
          <div className="flex flex-col md:grid md:grid-cols-12 gap-8 items-start">
            
            {/* Form Input Details Column */}
            <div className="order-2 md:order-1 md:col-span-7 w-full flex flex-col gap-6">
              <form onSubmit={handleCreateOrder} className="bg-[#111111] border border-white/8 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2 mb-1 text-white select-none">
                    <User className="w-5 h-5 text-[#E00000]" /> Your Information
                  </h2>
                  <p className="text-xs text-zinc-500 select-none">These details are used for your order and delivery coordination.</p>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2 select-none">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        name="billing_name"
                        autoComplete="name"
                        placeholder="Gamer Username / Full Name"
                        required
                        value={formData.billing_name}
                        onChange={handleChange}
                        className="w-full bg-[#080808] border border-white/8 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]/30 outline-none transition"
                        style={{ height: "48px" }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2 select-none">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                      <input
                        type="email"
                        name="billing_email"
                        autoComplete="email"
                        placeholder="gamer@example.com"
                        required
                        value={formData.billing_email}
                        onChange={handleChange}
                        className="w-full bg-[#080808] border border-white/8 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]/30 outline-none transition"
                        style={{ height: "48px" }}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2 select-none">WhatsApp Number</label>
                    <div className="relative">
                      <FaWhatsapp className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                      <input
                        type="tel"
                        name="billing_phone"
                        autoComplete="tel"
                        placeholder="e.g. 919876543210"
                        required
                        value={formData.billing_phone}
                        onChange={handleChange}
                        className="w-full bg-[#080808] border border-white/8 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]/30 outline-none transition"
                        style={{ height: "48px" }}
                      />
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2 select-none">Used for order coordination and support.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={loading || cart.length === 0}
                    className="w-full bg-[#E00000] hover:bg-[#F00000] disabled:opacity-50 text-white rounded-xl py-3.5 font-bold transition flex items-center justify-center gap-2 uppercase tracking-wider active:scale-[0.98] hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] min-h-[48px]"
                    aria-label="Proceed to Payment"
                  >
                    {loading ? "Creating Order..." : (
                      <>
                        <span>Proceed to Payment</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {renderTrustStrip()}
            </div>

            {/* Right: Cart Summary Column */}
            <div className="order-1 md:order-2 md:col-span-5 w-full md:sticky md:top-28 flex flex-col gap-6">
              <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
                <h3 className="text-lg font-bold uppercase tracking-tight text-white select-none flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-zinc-500" /> Order Summary
                </h3>

                {/* Items loop list */}
                <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center bg-[#080808] p-3 rounded-xl border border-white/8">
                      {item.games?.image_url && (
                        <img
                          src={item.games.image_url}
                          alt={item.games.title}
                          className="w-12 h-16 object-cover rounded-lg shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold truncate text-white leading-tight">{item.games?.title}</h4>
                        <p className="text-[10px] text-zinc-500 mt-1 select-none font-bold">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right select-none">
                        <span className="text-xs font-extrabold text-white block">₹{(item.games?.price || 0) * item.quantity}</span>
                        {item.games?.steam_price && item.games.steam_price > item.games.price && (
                          <span className="text-[9px] text-zinc-500 line-through">₹{(item.games.steam_price * item.quantity).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/5 pt-4 flex flex-col gap-2.5 text-xs select-none">
                  <div className="flex justify-between text-zinc-500 font-bold">
                    <span>Subtotal</span>
                    <span>₹{cartSubtotal.toLocaleString()}</span>
                  </div>
                  {cartSavings > 0 && (
                    <div className="flex justify-between text-emerald-400 text-xs font-extrabold bg-emerald-500/5 px-2.5 py-1.5 rounded border border-emerald-500/10">
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> You Save</span>
                      <span>₹{cartSavings.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-white/5 pt-3 flex justify-between items-center font-black text-sm">
                    <span>Total Amount</span>
                    <span className="text-[#E00000] text-lg">₹{cartSubtotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : null}

        {/* STEP 2: UPI PAYMENT */}
        {step === 2 && (
          <div className="flex flex-col md:grid md:grid-cols-12 gap-8 items-start">
            
            {/* Left: QR Card & UTR Reference Submission Column */}
            <div className="order-2 md:order-1 md:col-span-7 w-full flex flex-col gap-6">
              <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2 mb-1 text-white select-none">
                    <CreditCard className="w-5 h-5 text-[#E00000]" /> Complete Payment
                  </h2>
                  <p className="text-xs text-zinc-500 select-none">Order #{orderId?.substring(0, 8).toUpperCase()} · Awaiting your UPI payment.</p>
                </div>

                {/* Instructions */}
                <div className="bg-[#080808] border border-white/8 rounded-xl p-5 select-none">
                  <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block mb-3">Concise Instructions</span>
                  <div className="space-y-3 text-xs text-zinc-300">
                    <div className="flex gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#E00000]/10 border border-[#E00000]/20 text-[#E00000] flex items-center justify-center text-[9px] font-black shrink-0">1</span>
                      <span>Scan the QR code using your UPI app.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#E00000]/10 border border-[#E00000]/20 text-[#E00000] flex items-center justify-center text-[9px] font-black shrink-0">2</span>
                      <span>Complete the exact order amount: <strong className="text-white font-extrabold">₹{payableAmount}</strong>.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#E00000]/10 border border-[#E00000]/20 text-[#E00000] flex items-center justify-center text-[9px] font-black shrink-0">3</span>
                      <span>Copy the 12-digit transaction / UTR reference number.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#E00000]/10 border border-[#E00000]/20 text-[#E00000] flex items-center justify-center text-[9px] font-black shrink-0">4</span>
                      <span>Submit the copied UTR number reference below.</span>
                    </div>
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="bg-white rounded-2xl p-5 w-48 h-48 mx-auto flex items-center justify-center shadow-lg select-none">
                  <img
                    loading="lazy"
                    src="/upi-qr.png"
                    alt="UPI QR Code Scan"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* UPI address display */}
                <div className="flex items-center justify-between bg-[#080808] border border-white/8 rounded-xl p-4 select-none">
                  <div className="min-w-0">
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">UPI Address</span>
                    <span className="font-mono text-sm truncate text-white block mt-0.5 select-all">pandiyarajan39@ptyes</span>
                  </div>
                  <button
                    onClick={handleCopyUPI}
                    className="flex items-center gap-1.5 bg-white hover:bg-[#F5F5F5] border border-[#E5E5E5] hover:border-[#D4D4D4] text-[#555555] hover:text-[#111111] text-xs font-bold px-3 py-2 rounded-lg transition shrink-0 min-h-[44px]"
                    aria-label="Copy UPI Address ID"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* UTR Input Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2 select-none">Transaction / UTR Number</label>
                    <input
                      type="text"
                      maxLength={16}
                      placeholder="Enter 12-digit transaction ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl px-4 py-3.5 text-center text-sm font-mono tracking-widest uppercase focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]/30 outline-none text-[#111111] transition placeholder-[#AAAAAA]"
                      style={{ height: "48px" }}
                    />
                  </div>

                  <div className="pt-2 flex gap-4 select-none">
                    <button
                      onClick={handleGoBack}
                      className="flex-1 bg-white border border-[#E5E5E5] hover:border-[#D4D4D4] text-[#555555] hover:text-[#111111] hover:bg-[#F5F5F5] rounded-xl py-3.5 text-xs font-bold uppercase transition flex items-center justify-center gap-2 min-h-[48px]"
                      aria-label="Go back to order details review"
                    >
                      <ArrowLeft className="w-4 h-4 shrink-0" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={handleConfirmPayment}
                      disabled={loading}
                      className="flex-[2] bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl py-3.5 font-bold uppercase tracking-wider transition shadow-lg shadow-emerald-950/40 min-h-[48px] flex items-center justify-center gap-2"
                      aria-label="Submit Payment Reference details"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>Submit Payment Reference</span>
                      )}
                    </button>
                  </div>
                  
                  <div className="text-center pt-2 select-none">
                    <button
                      onClick={handleResetCheckout}
                      className="text-xs text-zinc-500 hover:text-[#E00000] underline uppercase tracking-wider font-semibold"
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              </div>

              {renderTrustStrip()}
            </div>

            {/* Right: Cart Summary Column */}
            <div className="order-1 md:order-2 md:col-span-5 w-full md:sticky md:top-28 flex flex-col gap-6">
              <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
                <h3 className="text-lg font-bold uppercase tracking-tight text-white select-none flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-zinc-500" /> Order Summary
                </h3>

                <div className="flex flex-col gap-4 select-none">
                  <div className="flex justify-between text-zinc-500 text-xs font-bold">
                    <span>Payable Amount</span>
                    <span className="font-extrabold text-white text-base">₹{payableAmount.toLocaleString()}</span>
                  </div>
                  {((serverOrder?.total_price ? (cartSteamTotal - serverOrder.total_price) : cartSavings)) > 0 && (
                    <div className="flex justify-between text-emerald-400 text-xs font-extrabold bg-emerald-500/5 px-2.5 py-1.5 rounded border border-emerald-500/10">
                      <span>You Save</span>
                      <span>₹{((serverOrder?.total_price ? (cartSteamTotal - serverOrder.total_price) : cartSavings)).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/5 pt-4 flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
                  {(serverOrder?.order_items || cart).map((item) => (
                    <div key={item.id} className="flex gap-3 items-center bg-[#080808] p-3 rounded-xl border border-white/8">
                      {item.games?.image_url && (
                        <img
                          src={item.games.image_url}
                          alt={item.games.title}
                          className="w-10 h-14 object-cover rounded-lg shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold truncate text-white leading-tight">{item.games?.title}</h4>
                        <p className="text-[10px] text-zinc-500 mt-1 font-bold">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-white block">₹{(item.games?.price || 0) * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* STEP 3: PENDING CONFIRMATION */}
        {step === 3 && (
          <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 sm:p-10 max-w-xl mx-auto shadow-xl text-center flex flex-col gap-6">
            <div className="bg-yellow-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 border border-yellow-500/20 shadow-xl select-none">
              <Clock className="w-8 h-8 text-yellow-500 animate-pulse-slow" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white select-none">Payment Reference Submitted</h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto select-none">
              We have received your transaction details. An administrator will verify the payment against the bank record and deliver your game account coordinates.
            </p>

            <div className="bg-[#080808] border border-white/8 rounded-xl p-5 text-left flex flex-col gap-3.5 text-xs select-none">
              <div className="flex justify-between">
                <span className="text-zinc-500 uppercase font-bold">Order ID</span>
                <span className="font-mono text-xs text-white select-all">#{orderId?.substring(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 uppercase font-bold">Payable Amount</span>
                <span className="font-bold text-white">₹{payableAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 uppercase font-bold">Transaction Reference ID</span>
                <span className="font-mono text-zinc-300">{transactionId}</span>
              </div>
              <div className="flex justify-between items-center pt-3.5 border-t border-white/5">
                <span className="text-zinc-500 uppercase font-bold">Verification Status</span>
                <span className="bg-yellow-500/5 text-yellow-400 border border-yellow-500/10 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider">
                  Awaiting Verification
                </span>
              </div>
            </div>

            {/* What happens next */}
            <div className="bg-[#0d0d0d] border border-white/8 rounded-xl p-5 text-left flex flex-col gap-4 select-none">
              <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider block border-b border-white/5 pb-2">What Happens Next</span>
              <div className="flex flex-col gap-3 text-xs text-zinc-300">
                <div className="flex gap-2">
                  <span className="w-4 h-4 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 flex items-center justify-center text-[9px] font-black shrink-0">1</span>
                  <div className="leading-tight">
                    <span className="font-bold text-white block">Payment Verification</span>
                    <span className="text-[10px] text-zinc-500">Your transaction reference is reviewed against bank records.</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 flex items-center justify-center text-[9px] font-black shrink-0">2</span>
                  <div className="leading-tight">
                    <span className="font-bold text-zinc-400 block">Order Processing</span>
                    <span className="text-[10px] text-zinc-600">Your game order is prepared for delivery after verification.</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 flex items-center justify-center text-[9px] font-black shrink-0">3</span>
                  <div className="leading-tight">
                    <span className="font-bold text-zinc-400 block">Delivery Complete</span>
                    <span className="text-[10px] text-zinc-600">Game details are delivered and visible in your Order Status.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 select-none">
              <button
                onClick={() => {
                  sessionStorage.clear();
                  navigate(`/order-status?id=${orderId}`);
                }}
                className="flex-1 bg-[#E00000] hover:bg-[#F00000] text-white rounded-xl py-4 font-bold uppercase text-xs tracking-wider transition hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] min-h-[48px] flex items-center justify-center gap-2 active:scale-[0.98]"
                aria-label="Track Order Status details"
              >
                <span>View Order Status</span>
              </button>
              <button
                onClick={() => {
                  const orderPayload = serverOrder || {
                    id: orderId,
                    total_price: payableAmount,
                    transaction_id: transactionId.trim(),
                    billing_name: formData.billing_name,
                    billing_email: formData.billing_email,
                    billing_phone: formData.billing_phone,
                  };
                  window.open(getWhatsAppOrderUrl(orderPayload, cart), "_blank");
                }}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl py-4 font-bold uppercase text-xs tracking-wider transition min-h-[48px] flex items-center justify-center gap-2 active:scale-[0.98] border-0"
                aria-label="Contact support on WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span>Contact Support</span>
              </button>
            </div>
            
            <div className="pt-2 select-none">
              <button
                onClick={handleResetCheckout}
                className="text-xs text-zinc-500 hover:text-zinc-300 underline uppercase tracking-wider font-semibold"
              >
                Start A New Checkout
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Checkout;
