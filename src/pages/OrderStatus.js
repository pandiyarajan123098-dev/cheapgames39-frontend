import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const OrderStatus = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    if (!orderId) {
      toast.error("Enter Order ID");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(`${API}/orders/${orderId}`);
      setOrder(res.data);
    } catch (error) {
      toast.error("Order not found");
      setOrder(null);
    }

    setLoading(false);
  };

  const getStatusColor = () => {
    if (!order) return "";

    switch (order.status) {
      case "pending":
        return "text-yellow-400";
      case "paid":
        return "text-blue-400";
      case "completed":
        return "text-green-400";
      default:
        return "text-white";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="bg-[#1a1a1a] p-8 rounded-2xl w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Check Order Status
        </h1>

        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3 mb-4"
        />

        <button
          onClick={checkStatus}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold"
        >
          {loading ? "Checking..." : "Check Status"}
        </button>

        {order && (
          <div className="mt-6 border-t border-white/10 pt-6">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Total:</strong> ₹{order.total_amount}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={getStatusColor()}>
                {order.status.toUpperCase()}
              </span>
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderStatus;