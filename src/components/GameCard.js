import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export const GameCard = ({ game }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  /* ================= SAFE VALUES ================= */

  const steamPrice =
    typeof game?.steam_price === "number" ? game.steam_price : 0;

  const salePrice =
    typeof game?.price === "number" ? game.price : 0;

  const imageUrl =
    game?.image_url || "/placeholder.jpg";

  const categoryName =
    game?.categories?.name || "No Category";

  /* ================= AUTO DISCOUNT ================= */

  const hasDiscount =
    steamPrice > 0 && steamPrice > salePrice;

  const discountPercentage = hasDiscount
    ? Math.round(((steamPrice - salePrice) / steamPrice) * 100)
    : 0;

  /* ================= ADD TO CART ================= */

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      await addToCart(game.id);
      toast.success("Added to cart");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart");
    }
  };

  /* ================= UI ================= */

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="
        relative
        group
        bg-[#1a1a1a]
        rounded-xl
        overflow-hidden
        border border-white/5
        transition-all duration-300
        cursor-pointer
        hover:border-[#B50000]
        hover:shadow-[0_0_35px_rgba(181,0,0,0.55)]
      "
      onClick={() => navigate(`/games/${game.id}`)}
    >
      {/* IMAGE SECTION */}
      <div className="relative aspect-[3/4] overflow-hidden">

        {/* DISCOUNT BADGE */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10 bg-[#B50000] text-white text-xs font-bold px-3 py-1 rounded-md shadow-lg">
            -{discountPercentage}%
          </div>
        )}

        <img
          src={imageUrl}
          alt={game?.title || "Game Image"}
          className="
            w-full h-full object-cover
            transition-transform duration-500
            group-hover:scale-110
          "
        />
      </div>

      {/* CONTENT */}
      <div className="p-4">

        {/* TITLE */}
        <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">
          {game?.title}
        </h3>

        {/* CATEGORY */}
        <p className="text-xs text-[#B50000] uppercase tracking-wider mb-3">
          {categoryName}
        </p>

        {/* PRICE + CART */}
        <div className="flex items-center justify-between">

          {/* PRICE BLOCK */}
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-gray-400 line-through text-sm">
                  ₹{steamPrice.toLocaleString()}
                </span>
                <span className="text-2xl font-bold text-white">
                  ₹{salePrice.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-white">
                ₹{salePrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* ADD TO CART BUTTON */}
          <button
            onClick={handleAddToCart}
            className="
              bg-[#B50000]
              hover:bg-[#FF0000]
              text-white
              rounded-full
              p-2
              transition-all duration-300
              hover:shadow-[0_0_20px_rgba(255,0,0,0.8)]
              hover:scale-110
            "
          >
            <ShoppingCart className="w-5 h-5" />
          </button>

        </div>
      </div>
    </motion.div>
  );
};