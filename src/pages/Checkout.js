import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

/* =========================================
   CONFIG
========================================= */

const API_BASE = "https://cheapgames39-backend-1.onrender.com/api";
const WHATSAPP_NUMBER = "916379490178";

/* =========================================
   COMPONENT
========================================= */

const Checkout = () => {
  const { user, accessToken } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [transactionId, setTransactionId] = useState("");

const [formData, setFormData] = useState({
  billing_name: user?.user_metadata?.full_name || "",
  billing_email: user?.email || "",
  billing_address: "",
  billing_city: "",
  billing_zip: "",
});

  /* =========================================
     TOTAL CALCULATION (optimized)
  ========================================= */

  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + (item.games?.price || 0) * item.quantity,
      0
    );
  }, [cart]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* =========================================
     CREATE ORDER
  ========================================= */

  const handleCreateOrder = async (e) => {
    e.preventDefault();

    if (!user || !accessToken) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE}/orders`,
        {
          billing_name: formData.billing_name,
          billing_email: formData.billing_email,
          billing_address: formData.billing_address,
          billing_city: formData.billing_city,
          billing_zip: formData.billing_zip,
          total_price: total,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setOrderId(res.data.id);
      setShowQR(true);
      toast.success("Order created. Complete UPI payment.");
    } catch (error) {
      console.error("Create Order Error:", error.response?.data || error.message);
      toast.error("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     CONFIRM PAYMENT
  ========================================= */

  const handleConfirmPayment = async () => {
    if (!transactionId || transactionId.length < 12) {
      toast.error("Enter valid UPI Transaction ID");
      return;
    }

    try {
      setConfirmLoading(true);

      await axios.put(
        `${API_BASE}/orders/${orderId}`,
        { transaction_id: transactionId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
const gameList = cart
  .map(
    (item) =>
      `• ${item.games?.title} x${item.quantity} - ₹${
        (item.games?.price || 0) * item.quantity
      }`
  )
  .join("\n");

const message = `
Payment Submitted

Order ID: ${orderId}
Name: ${formData.billing_name}
Email: ${formData.billing_email}

Games Purchased:
${gameList}

Transaction ID: ${transactionId}
Amount: ₹${total}
`;

      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
        "_blank"
      );

      clearCart();
      toast.success("Payment submitted successfully");
      navigate("/");
    } catch (error) {
      console.error("Confirm Payment Error:", error.response?.data || error.message);
      toast.error("Failed to confirm payment");
    } finally {
      setConfirmLoading(false);
    }
  };

  /* =========================================
     UI
  ========================================= */

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-24 pb-20 px-6 text-white">
      <div className="container mx-auto max-w-4xl">

       <h1 className="text-5xl font-bold uppercase mb-12 text-white">
  CHECK<span className="text-[#B50000]">OUT</span>
</h1>

        {!showQR ? (
          <form
            onSubmit={handleCreateOrder}
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 space-y-4"
          >
            <h2 className="text-2xl font-bold mb-4">Billing Information</h2>

            <input
              type="text"
              name="billing_name"
              placeholder="Full Name"
              required
              value={formData.billing_name}
              onChange={handleChange}
              className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3"
            />

            <input
              type="email"
              name="billing_email"
              placeholder="Email"
              required
              value={formData.billing_email}
              onChange={handleChange}
              className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3"
            />

            <textarea
              name="billing_address"
              placeholder="Address"
              required
              rows={3}
              value={formData.billing_address}
              onChange={handleChange}
              className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="billing_city"
                placeholder="City"
                required
                value={formData.billing_city}
                onChange={handleChange}
                className="bg-[#141414] border border-white/10 rounded-lg px-4 py-3"
              />

              <input
                type="text"
                name="billing_zip"
                placeholder="ZIP Code"
                required
                value={formData.billing_zip}
                onChange={handleChange}
                className="bg-[#141414] border border-white/10 rounded-lg px-4 py-3"
              />
            </div>

            <div className="text-xl font-bold">
              Total: ₹{total}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#B50000] hover:bg-[#FF0000] rounded-full py-4 font-bold disabled:opacity-50"
            >
              {loading ? "Processing..." : "Proceed to UPI Payment"}
            </button>
          </form>
        ) : (
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 text-center">
            <div className="bg-[#141414] rounded-xl p-4 mb-6 text-left border border-white/10">
  <h3 className="font-bold mb-3">Order Summary</h3>

  {cart.map((item) => (
    <div
      key={item.id}
      className="flex justify-between text-sm mb-2 text-gray-300"
    >
      <span>
        {item.games?.title} × {item.quantity}
      </span>

      <span>
        ₹{(item.games?.price || 0) * item.quantity}
      </span>
    </div>
  ))}

  <div className="border-t border-white/10 mt-3 pt-3 font-bold flex justify-between">
    <span>Total</span>
    <span>₹{total}</span>
  </div>
</div>
       <div className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-lg mb-4 text-sm">
  Payment Status: Pending
</div>

<h2 className="text-2xl font-bold mb-4">
  Scan & Pay via UPI
</h2>

<p className="text-gray-400 mb-2">
  Pay exactly <span className="text-white font-bold text-xl">₹{total}</span>
</p>

<p className="text-red-400 text-sm mb-5 animate-pulse">
  Complete payment within 10 minutes
</p>

<img
  loading="lazy"
  src="/upi-qr.png"
  
  alt="UPI QR"
  className="w-60 mx-auto mb-4"
/>
<div className="flex justify-center gap-3 mb-4">
  <span className="text-gray-400">
    pandiyarajan39@ptyes
  </span>

  <button
    onClick={() => {
      navigator.clipboard.writeText("pandiyarajan39@ptyes");
      toast.success("UPI ID Copied");
    }}
    className="text-[#B50000] font-semibold"
  >
    Copy
  </button>
</div>

<div className="flex justify-center gap-4 text-sm text-gray-400 mb-6">
  <span>GPay</span>
  <span>PhonePe</span>
  <span>Paytm</span>
  <span>UPI</span>
</div>

<input
  type="text"
  placeholder="Enter UPI Transaction ID"
  value={transactionId}
  onChange={(e) => setTransactionId(e.target.value)}
  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-4 focus:border-[#B50000] outline-none"
/>

            <button
              onClick={handleConfirmPayment}
              disabled={confirmLoading}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 rounded-full py-4 font-bold disabled:opacity-50"
            >
            {confirmLoading ? "Submitting..." : "Submit Payment"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;