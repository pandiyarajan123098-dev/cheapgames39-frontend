import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "@phosphor-icons/react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { notify } from "../utils/notify";
import { AddToCartButton } from "./AddToCartButton";
import steamIcon from "../assets/steam.png";

let globalStaggerCount = 0;
let globalStaggerTimeout = null;

const getStaggerDelay = () => {
  const delay = Math.min(globalStaggerCount * 50, 150);
  globalStaggerCount += 1;
  
  if (globalStaggerTimeout) clearTimeout(globalStaggerTimeout);
  globalStaggerTimeout = setTimeout(() => {
    globalStaggerCount = 0;
  }, 100);
  
  return delay;
};

export const GameCard = ({ game, onWishlistRemove }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isGameInWishlist } = useWishlist();

  const [isVisible, setIsVisible] = React.useState(false);
  const [delay, setDelay] = React.useState(0);
  const cardRef = React.useRef(null);

  React.useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      setDelay(0);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const calculatedDelay = getStaggerDelay();
            setDelay(calculatedDelay);
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

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
  const handleAddToCartAction = async (e) => {
    if (!user) {
      notify.loginRequiredCart();
      navigate("/login");
      throw new Error("Login required");
    }
    await addToCart(game.id);
    // Success feedback is handled by the button's Cart → Check icon transition
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
    if (wasWishlisted && onWishlistRemove) {
      await onWishlistRemove(game.id);
      return;
    }
    await toggleWishlist(game.id);
    if (wasWishlisted) {
      notify.removedFromWishlist(game?.title);
    } else {
      notify.addedToWishlist(game?.title);
    }
  };

  return (
    <div
      ref={cardRef}
      style={{
        transitionDelay: `${delay}ms`
      }}
      onClick={() => {
        if (!isOutOfStock) {
          navigate(`/games/${game.id}`);
        }
      }}
      className={`cg39-game-card cursor-pointer group ${isVisible ? "reveal-visible" : "reveal-hidden"} ${isOutOfStock ? "grayscale opacity-75" : ""}`}
    >
      {/* IMAGE CONTAINER */}
      <div className="cg39-game-card-image-wrap">
        
        {/* DISCOUNT BADGE */}
        {hasDiscount && !isOutOfStock && (
          <div className="cg39-discount-badge">
            -{discountPercentage}%
          </div>
        )}

        {isOutOfStock && (
          <div className="cg39-discount-badge bg-black/80">
            OUT OF STOCK
          </div>
        )}

        {/* WISHLIST BUTTON */}
        <button
          onClick={handleWishlistToggle}
          aria-label={wishlisted ? `Remove ${game?.title} from wishlist` : `Add ${game?.title} to wishlist`}
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`cg39-wishlist-btn ${wishlisted ? "active" : ""}`}
        >
          <Heart 
            className="w-4 h-4" 
            weight={wishlisted ? "fill" : "bold"}
          />
        </button>

        {/* PLATFORM BADGE */}
        <div className="cg39-platform-badge" title="Platform Supported">
          <img src={steamIcon} alt="Steam Logo" className="w-4 h-4 object-contain" />
        </div>

        {/* GAME COVER IMAGE */}
        <img 
          loading="lazy"
          src={imageUrl}
          alt={game?.title || "Game Cover"}
          className="cg39-game-card-image"
        />
      </div>

      {/* CARD CONTENT */}
      <div className="cg39-card-content">
        
        {/* CATEGORY */}
        <p className="cg39-card-category">
          {categoryName}
        </p>

        {/* TITLE */}
        <h3 className="cg39-card-title group-hover:text-[#E00000] transition-colors duration-200">
          {game?.title}
        </h3>

        {/* PRICE BLOCK */}
        <div className="cg39-price-block">
          <div className="cg39-price-row">
            <span className="cg39-price-current">₹{salePrice.toLocaleString()}</span>
            {hasDiscount && (
              <span className="cg39-price-original">₹{steamPrice.toLocaleString()}</span>
            )}
          </div>
          {hasDiscount ? (
            <span className="cg39-price-savings">Save ₹{savings.toLocaleString()}</span>
          ) : (
            <span className="cg39-price-savings text-transparent select-none">No Savings</span>
          )}
        </div>

        {/* ACTIONS */}
        <div className="cg39-action-row">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/games/${game.id}`);
            }}
            aria-label={`View details for ${game?.title}`}
            title="View Game Details"
            className="cg39-details-btn"
          >
            Details
          </button>
          
          <AddToCartButton
            disabled={isOutOfStock}
            onAddToCart={handleAddToCartAction}
            gameImage={imageUrl}
            className="w-11 h-11 bg-[#E10600] text-white rounded-xl hover:bg-[#ff1a13] transition-all duration-200 flex items-center justify-center shrink-0 active:scale-[0.98]"
          />
        </div>
      </div>
    </div>
  );
};
