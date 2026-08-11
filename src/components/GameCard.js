import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { notify } from "../utils/notify";
import steamLogo from "../assets/steam.png";

export const GameCard = ({ game }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isGameInWishlist } = useWishlist();
  
  const [cartLoading, setCartLoading] = useState(false);

  /* ================= SAFE VALUES ================= */
  const steamPrice = typeof game?.steam_price === "number" ? game.steam_price : 0;
  const salePrice = typeof game?.price === "number" ? game.price : 0;
  const imageUrl = game?.image_url || "/placeholder.jpg";
  const categoryName = game?.categories?.name || "No Category";
  const isOutOfStock = game?.in_stock === false;
  const wishlisted = isGameInWishlist(game.id);

  /* ================= AUTO DISCOUNT ================= */
  const hasDiscount = steamPrice > 0 && steamPrice > salePrice;
  const discountPercentage = hasDiscount
    ? Math.round(((steamPrice - salePrice) / steamPrice) * 100)
    : 0;
  const savings = steamPrice - salePrice;

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!user) {
      notify.loginRequiredCart();
      navigate("/login");
      return;
    }

    try {
      setCartLoading(true);
      await addToCart(game.id);
      notify.addedToCart(game?.title);
    } catch (error) {
      console.error(error);
      notify.actionFailed('add to cart');
    } finally {
      setCartLoading(false);
    }
  };

  /* ================= TOGGLE WISHLIST ================= */
  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (!user) {
      notify.loginRequiredWishlist();
      navigate("/login");
      return;
    }
    const wasWishlisted = wishlisted;
    await toggleWishlist(game.id);
    if (wasWishlisted) {
      notify.removedFromWishlist(game?.title);
    } else {
      notify.addedToWishlist(game?.title);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`
        relative
        group
        bg-white
        rounded-2xl
        overflow-hidden
        border border-[#E5E5E5]
        shadow-[0_2px_8px_rgba(0,0,0,0.06)]
        hover:shadow-[0_6px_20px_rgba(0,0,0,0.10)]
        transition-all duration-200
        h-full
        flex
        flex-col
        ${
          isOutOfStock
            ? "grayscale opacity-75 cursor-not-allowed"
            : "hover:border-[#E10600]/30 cursor-pointer"
        }
      `}
      onClick={() => {
        if (!isOutOfStock) {
          navigate(`/games/${game.id}`);
        }
      }}
    >
      {/* IMAGE SECTION */}
      <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
        
        {/* WISH LIST HEART */}
        <button
          onClick={handleWishlistToggle}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2.5 right-2.5 z-20 p-2 bg-white rounded-full text-[#999999] hover:text-[#E10600] border border-[#E5E5E5] shadow-sm transition"
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-[#E10600] text-[#E10600]" : ""}`} />
        </button>

        {/* DISCOUNT BADGE */}
        {hasDiscount && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-[#E10600] text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg">
            -{discountPercentage}%
          </div>
        )}

        {/* STEAM LOGO */}
        <div className="absolute bottom-2.5 right-2.5 z-10 bg-white/90 rounded-full p-1 border border-[#E5E5E5]">
          <img 
            loading="lazy"
            src={steamLogo}
            alt="Steam Platform"
            className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity"
          />
        </div>

        {isOutOfStock && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-black/80 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg">
            OUT OF STOCK
          </div>
        )}

        <img 
          loading="lazy"
          src={imageUrl}
          alt={game?.title || "Game Cover"}
          className="
            w-full h-full object-cover
            transition-transform duration-500
            group-hover:scale-[1.02]
          "
        />
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1">
        
        {/* CATEGORY */}
        <p className="text-[10px] text-[#E10600] font-semibold uppercase tracking-wider mb-1 block">
          {categoryName}
        </p>

        {/* TITLE */}
        <h3 className="text-[#111111] font-bold text-sm md:text-base line-clamp-2 h-10 md:h-12 mb-2 group-hover:text-[#E10600] transition-colors duration-200">
          {game?.title}
        </h3>

        {/* PRICE BLOCK */}
        <div className="flex flex-col mt-auto h-12 justify-center">
          {hasDiscount ? (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold text-[#111111]">₹{salePrice.toLocaleString()}</span>
                <span className="text-[#AAAAAA] line-through text-[11px]">₹{steamPrice.toLocaleString()}</span>
              </div>
              <span className="text-[9px] text-[#16A34A] font-semibold mt-0.5 block">Save ₹{savings.toLocaleString()}</span>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold text-[#111111]">₹{salePrice.toLocaleString()}</span>
              </div>
              <span className="text-[9px] text-transparent mt-0.5 block select-none">No Discount</span>
            </>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#F0F0F0]">
            <button
              onClick={() => navigate(`/games/${game.id}`)}
              className="flex-1 bg-white hover:bg-[#F5F5F5] active:scale-[0.98] border border-[#E5E5E5] hover:border-[#D4D4D4] text-[#111111] rounded-xl h-11 flex items-center justify-center text-xs font-bold uppercase tracking-wider transition-all duration-200"
          >
            Details
          </button>
          
          <button
            disabled={isOutOfStock || cartLoading}
            onClick={handleAddToCart}
            className={`
              bg-[#E10600]
              hover:bg-[#ff1a13]
              active:scale-[0.98]
              text-white
              rounded-xl
              h-11
              w-11
              shrink-0
              transition-all duration-200
              flex
              items-center
              justify-center
              ${
                isOutOfStock
                  ? "opacity-40 cursor-not-allowed bg-gray-800"
                  : ""
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
