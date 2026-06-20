import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import steamLogo from "../assets/steam.png";
import { Loader2 } from "lucide-react";

export const GameCard = ({ game }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
const [cartLoading, setCartLoading] = useState(false);
  /* ================= SAFE VALUES ================= */

  const steamPrice =
    typeof game?.steam_price === "number" ? game.steam_price : 0;

  const salePrice =
    typeof game?.price === "number" ? game.price : 0;

  const imageUrl =
    game?.image_url || "/placeholder.jpg";

  const categoryName =
    game?.categories?.name || "No Category";

    const isOutOfStock = game?.in_stock === false;

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
  setCartLoading(true);
  await addToCart(game.id);
  toast.success("Added to cart");
} catch (error) {
  console.error(error);
  toast.error("Failed to add to cart");
} finally {
  setCartLoading(false);
}
  };

  /* ================= UI ================= */

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
className={`
  relative
  group
  bg-[#1a1a1a]
  rounded-xl
  overflow-hidden
  border border-white/5
  transition-all duration-300
  cursor-pointer
  ${
    isOutOfStock
      ? "grayscale opacity-70"
      : "hover:border-[#B50000] hover:shadow-[0_0_35px_rgba(181,0,0,0.55)]"
  }
`}
    onClick={() => {
  if (game.in_stock) {
    navigate(`/games/${game.id}`);
  }
}}
    >
      {/* IMAGE SECTION */}
    <div className="relative aspect-[16/10] overflow-hidden">


        {/* DISCOUNT BADGE */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10 bg-[#B50000] text-white text-xs font-bold px-3 py-1 rounded-md shadow-lg">
            -{discountPercentage}%
          </div>
        )}

        <div className="absolute bottom-3 right-3 z-10 bg-white rounded-full p-1 shadow-lg">
  <img
    src={steamLogo}
    alt="Steam"
    className="w-6 h-6"
  />
</div>

        {!game.in_stock && (
  <div className="absolute top-3 right-3 z-10 bg-black text-white text-xs font-bold px-3 py-1 rounded-md">
    OUT OF STOCK
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
      <div className="p-3">

        {/* TITLE */}
       <h3 className="text-white font-semibold text-xs md:text-base mb-1 line-clamp-2 min-h-[42px]">
          {game?.title}
        </h3>

        {/* CATEGORY */}
    <p className="text-[11px] text-[#B50000] mb-2 font-medium">
          {categoryName}
        </p>


        {/* PRICE + CART */}
        <div className="flex items-center justify-between">

          {/* PRICE BLOCK */}
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-gray-400 line-through text-xs">
                  ₹{steamPrice.toLocaleString()}
                </span>
              <span className="text-lg md:text-xl font-bold text-white">
                  ₹{salePrice.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg md:text-xl font-bold text-white">
                ₹{salePrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* ADD TO CART BUTTON */}
     {/* ADD TO CART BUTTON */}
<button
  disabled={!game.in_stock}
  onClick={handleAddToCart}
  className={`
    bg-[#B50000]
    text-white
    rounded-full
    p-1.5
    transition-all duration-300
    ${
      !game.in_stock
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-[#FF0000] hover:shadow-[0_0_20px_rgba(255,0,0,0.8)] hover:scale-110"
    }
  `}
>
  {cartLoading ? (
  <Loader2 className="w-4 h-4 animate-spin" />
) : (
  <ShoppingCart className="w-4 h-4" />
)}

</button>

        </div>
      </div>
    </motion.div>
  );
};