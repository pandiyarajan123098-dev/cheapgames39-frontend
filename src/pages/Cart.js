import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

const Cart = () => {
  const { user } = useAuth();
  const { cart, updateCartItem, removeFromCart } = useCart();
  const navigate = useNavigate();

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

  /* ================= CHECKOUT ================= */

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to checkout");
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold uppercase mb-12 text-white">
          Shopping <span className="text-[#B50000]">Cart</span>
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-xl mb-6">
              Your cart is empty
            </p>
            <button
              onClick={() => navigate("/games")}
              className="bg-[#B50000] hover:bg-[#FF0000] text-white rounded-full px-8 py-3 font-bold transition"
            >
              Browse Games
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">

            {/* ================= CART ITEMS ================= */}
            <div className="lg:col-span-2">

              {cart.map((item) => {
                const steamPrice = item.games?.steam_price || 0;
                const salePrice = item.games?.price || 0;

                const { percentage, hasDiscount } =
                  calculateDiscount(steamPrice, salePrice);

                return (
                  <div
                    key={item.id}
                    className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 flex gap-6 mb-6 transition hover:border-[#B50000]/40"
                  >
                    <img
                      src={item.games?.image_url}
                      alt={item.games?.title}
                      className="w-28 h-36 object-cover rounded-lg"
                    />

                    <div className="flex-1 flex flex-col justify-between">

                      <div>
                        <h3 className="text-xl font-semibold mb-3 text-white">
                          {item.games?.title}
                        </h3>

                        <div className="mb-4">

                          {hasDiscount && (
                            <span className="bg-[#B50000] text-white text-xs px-2 py-1 rounded mr-2">
                              -{percentage}%
                            </span>
                          )}

                          {hasDiscount && (
                            <span className="text-gray-400 line-through mr-2">
                              ₹{steamPrice.toLocaleString()}
                            </span>
                          )}

                          <span className="text-2xl font-bold text-[#B50000]">
                            ₹{salePrice.toLocaleString()}
                          </span>

                        </div>
                      </div>

                      {/* QUANTITY CONTROLS */}
                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3 bg-[#141414] rounded-lg px-4 py-2">

                          <button
                            onClick={() =>
                              item.quantity > 1 &&
                              updateCartItem(item.id, item.quantity - 1)
                            }
                            className="text-gray-400 hover:text-white"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="text-white font-semibold w-8 text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateCartItem(item.id, item.quantity + 1)
                            }
                            className="text-gray-400 hover:text-white"
                          >
                            <Plus size={16} />
                          </button>

                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-[#B50000] transition"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* ================= ORDER SUMMARY ================= */}
            <div>
              <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 sticky top-28">

                <h2 className="text-2xl font-bold mb-6 text-white">
                  Order Summary
                </h2>

                <div className="flex justify-between text-gray-400 mb-2">
                  <span>Steam Value</span>
                  <span>₹{totalSteamValue.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-green-400 mb-4">
                  <span>You Saved</span>
                  <span>- ₹{totalSavings.toLocaleString()}</span>
                </div>

                <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span className="text-[#B50000]">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full mt-8 bg-[#B50000] hover:bg-[#FF0000] text-white rounded-full py-4 font-bold transition"
                >
                  Proceed to Checkout
                </button>

              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;