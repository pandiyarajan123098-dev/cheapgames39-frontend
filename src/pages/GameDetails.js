import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { 
  ShoppingCart, 
  Heart, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Lightning as Zap, 
  ChatCircle as MessageCircle, 
  Info,
  Clock,
  CaretRight as ChevronRight,
  Sparkle as Sparkles,
  GameController as Gamepad2,
  FileText,
  Check,
  Eye,
  EyeSlash as EyeOff,
  Clock as Clock3,
  Copy,
  Play,
  CheckCircle,
  XCircle
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { notify } from "../utils/notify";
import steamLogo from "../assets/steam.png";
import { GameCard } from "../components/GameCard";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { FaWhatsapp } from "react-icons/fa";

const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`;

const getDiscountPercent = (steamPrice, price) => {
  if (!steamPrice || steamPrice <= price) return 0;
  return Math.round(((steamPrice - price) / steamPrice) * 100);
};

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isGameInWishlist, loading: wishlistLoading } = useWishlist();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartLoading, setCartLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);

  // Recommendations state
  const [recommendedLike, setRecommendedLike] = useState([]);
  const [recommendedCategory, setRecommendedCategory] = useState([]);
  const [recommendedViewed, setRecommendedViewed] = useState([]);
  const [recommendedDeals, setRecommendedDeals] = useState([]);

  // Review states
  const [reviewLoading, setReviewLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [dbReviews, setDbReviews] = useState([]);
  const [eligibility, setEligibility] = useState({
    eligible: false,
    hasPurchased: false,
    alreadyReviewed: false,
    existingReview: null
  });

  const inWishlist = isGameInWishlist(id);

  /* ================= RATING STATS ================= */
  const reviewsStats = useMemo(() => {
    if (dbReviews.length === 0) return { avg: 0, count: 0, dist: [0, 0, 0, 0, 0] };
    const count = dbReviews.length;
    const total = dbReviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = (total / count).toFixed(1);
    
    const dist = [0, 0, 0, 0, 0];
    dbReviews.forEach(r => {
      const idx = Math.max(1, Math.min(5, r.rating)) - 1;
      dist[idx] += 1;
    });

    return { avg, count, dist };
  }, [dbReviews]);

  // Count verified ratings
  const verifiedCount = useMemo(() => {
    return dbReviews.filter(r => r.is_verified).length;
  }, [dbReviews]);

  /* ================= DATA LOADING ================= */
  const fetchGame = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/games/${id}`);
      if (res.data.in_stock === false) {
        toast.error("This game is out of stock");
        navigate("/games");
        return;
      }
      setGame(res.data);
      setError("");
    } catch (err) {
      console.error("Fetch game error:", err);
      setError("GAME NOT FOUND");
    }
  }, [id, navigate]);

  const fetchReviews = useCallback(async () => {
    try {
      const headers = {};
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
      const res = await axios.get(`${API}/reviews/${id}`, { headers });
      setDbReviews(res.data || []);
    } catch (err) {
      console.error("Fetch reviews error:", err);
    }
  }, [id, accessToken]);

  const checkEligibility = useCallback(async () => {
    if (!user || !accessToken) return;
    try {
      const res = await axios.get(`${API}/reviews/eligible/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setEligibility(res.data);
    } catch (err) {
      console.error("Check review eligibility error:", err);
    }
  }, [id, user, accessToken]);

  // Generate deterministic scored recommendations
  const generateRecommendations = useCallback(async (currentGame) => {
    try {
      const res = await axios.get(`${API}/games`);
      const allGames = (res.data || []).filter(g => g.id !== currentGame.id && g.in_stock !== false);
      
      const storageKey = user ? `cg39_recent_${user.id}` : "cg39_guest_recent";
      let recent = [];
      try {
        const raw = localStorage.getItem(storageKey);
        recent = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(recent)) recent = [];
      } catch (e) {
        console.warn("[GameDetails] localStorage parse error:", e);
      }
      const recentIds = recent.map(r => String(r.id));

      // Calculate score for all products
      const scoredGames = allGames.map(g => {
        let score = 0;
        if (g.category_id === currentGame.category_id) score += 5;
        
        // Price proximity (within 30% of current game price)
        const priceDiff = Math.abs(g.price - currentGame.price);
        if (priceDiff <= currentGame.price * 0.3) {
          score += 2;
        }

        // Recently viewed
        if (recentIds.includes(String(g.id))) {
          score += 3;
        }

        if (g.is_new) score += 1;
        if (g.is_bundle) score += 1;

        // Discount points
        const disc = getDiscountPercent(g.steam_price, g.price);
        score += (disc / 20); // +0.5 for every 10% discount

        return { game: g, score };
      });

      scoredGames.sort((a, b) => b.score - a.score);

      const selectedIds = new Set();

      // 1. You May Also Like (top scored)
      const like = [];
      for (const item of scoredGames) {
        if (like.length >= 4) break;
        like.push(item.game);
        selectedIds.add(item.game.id);
      }
      setRecommendedLike(like);

      // 2. More from this Category (same category, not in like)
      const cat = [];
      const sameCatGames = allGames.filter(g => g.category_id === currentGame.category_id && !selectedIds.has(g.id));
      sameCatGames.slice(0, 4).forEach(g => {
        cat.push(g);
        selectedIds.add(g.id);
      });
      setRecommendedCategory(cat);

      // 3. Players Also Viewed (next highest scored)
      const viewed = [];
      const remainingScored = scoredGames.filter(item => !selectedIds.has(item.game.id));
      for (const item of remainingScored) {
        if (viewed.length >= 4) break;
        viewed.push(item.game);
        selectedIds.add(item.game.id);
      }
      setRecommendedViewed(viewed);

      // 4. More Great Deals (highest discount %, not selected)
      const deals = allGames
        .filter(g => !selectedIds.has(g.id))
        .map(g => ({ game: g, discount: getDiscountPercent(g.steam_price, g.price) }))
        .sort((a, b) => b.discount - a.discount)
        .slice(0, 4)
        .map(item => item.game);
      setRecommendedDeals(deals);

    } catch (err) {
      console.error("Error generating recommendations:", err);
    }
  }, [user]);

  // Main load lifecycle
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([
        fetchGame(),
        fetchReviews()
      ]);
      setLoading(false);
    };
    load();
  }, [fetchGame, fetchReviews]);

  // Dependency loads
  useEffect(() => {
    if (game) {
      generateRecommendations(game);
    }
  }, [game, generateRecommendations]);

  useEffect(() => {
    if (user && accessToken) {
      checkEligibility();
    }
  }, [user, accessToken, id, checkEligibility]);

  // Page title and meta tags SEO setting
  useEffect(() => {
    const updateMetaTag = (name, value, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", value);
    };

    if (game?.title) {
      document.title = `${game.title} | CheapGames39`;
      updateMetaTag("description", game.description || `Buy ${game.title} at CheapGames39 at a massive discount compared to Steam.`);
      updateMetaTag("og:title", `${game.title} | CheapGames39`, true);
      updateMetaTag("og:description", game.description || `Buy ${game.title} at CheapGames39 at a massive discount compared to Steam.`, true);
      updateMetaTag("og:image", game.image_url || "", true);

      // Update canonical link
      let canonical = document.querySelector("link[rel='canonical']");
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", window.location.href);
    }
    return () => {
      document.title = "CheapGames39 — Affordable PC Games & Digital Game Deals";
      updateMetaTag("description", "Buy premium PC games at up to 98% discount on CheapGames39. Enjoy secure UPI checkouts and fast digital account delivery.");
    };
  }, [game]);

  // Dynamic structured data schema markup
  useEffect(() => {
    if (!game) return;

    const priceVal = typeof game.price === "number" ? game.price : 0;
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": game.title,
      "image": game.image_url,
      "description": game.description,
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": priceVal,
        "itemCondition": "https://schema.org/NewCondition",
        "availability": game.in_stock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "url": window.location.href
      }
    };

    if (reviewsStats.count > 0 && reviewsStats.avg > 0) {
      schemaData.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": reviewsStats.avg,
        "reviewCount": reviewsStats.count,
        "bestRating": "5",
        "worstRating": "1"
      };
    }

    let script = document.getElementById("structured-data-jsonld");
    if (!script) {
      script = document.createElement("script");
      script.id = "structured-data-jsonld";
      script.type = "application/ld+json";
      document.body.appendChild(script);
    }
    script.text = JSON.stringify(schemaData);

    return () => {
      const existing = document.getElementById("structured-data-jsonld");
      if (existing) {
        existing.remove();
      }
    };
  }, [game, reviewsStats]);

  // Update Recently Viewed storage with timestamp (up to 10 entries)
  useEffect(() => {
    if (!game?.id) return;
    const storageKey = user ? `cg39_recent_${user.id}` : "cg39_guest_recent";
    let recent = [];
    try {
      const raw = localStorage.getItem(storageKey);
      recent = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(recent)) recent = [];
    } catch (e) {
      console.warn("[GameDetails recent] localStorage parse error:", e);
    }
    const updated = [
      {
        id: String(game.id),
        title: game.title,
        image: game.image_url,
        price: game.price,
        steam_price: game.steam_price,
        timestamp: new Date().toISOString()
      },
      ...recent.filter(g => String(g.id) !== String(game.id)),
    ].slice(0, 10);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  }, [game, user]);

  /* ================= PRICING CALCULATIONS ================= */
  const steamPrice = typeof game?.steam_price === "number" ? game.steam_price : 0;
  const salePrice = typeof game?.price === "number" ? game.price : 0;
  const hasDiscount = steamPrice > 0 && steamPrice > salePrice;
  const discountPercentage = hasDiscount ? Math.round(((steamPrice - salePrice) / steamPrice) * 100) : 0;
  const savings = hasDiscount ? steamPrice - salePrice : 0;

  /* ================= ACTION HANDLERS ================= */
  const handleAddToCart = async () => {
    try {
      setCartLoading(true);
      await addToCart(game.id);
    } catch (err) {
      toast.error(err.message || "Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setBuyNowLoading(true);
      await addToCart(game.id);
      navigate("/checkout");
    } catch (err) {
      toast.error(err.message || "Failed to purchase game");
    } finally {
      setBuyNowLoading(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error("Please login to manage your wishlist");
      navigate("/login");
      return;
    }
    toggleWishlist(game.id);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim() || comment.trim().length < 5 || comment.trim().length > 1000) {
      toast.error("Comment must be between 5 and 1000 characters");
      return;
    }

    try {
      setReviewLoading(true);
      await axios.post(
        `${API}/reviews`,
        { game_id: id, rating: parseInt(rating, 10), comment: comment.trim() },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      toast.success("Verified review submitted!");
      setComment("");
      fetchReviews();
      checkEligibility();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  /* ================= BREADCRUMBS RENDERER ================= */
  const renderBreadcrumbs = () => {
    if (!game) return null;
    const paths = [{ label: "Games", path: "/games" }];
    if (game.categories?.name) {
      paths.push({
        label: game.categories.name,
        path: `/games?category=${game.category_id}`
      });
    }
    paths.push({ label: game.title });
    return <Breadcrumbs paths={paths} />;
  };

  /* ================= SKELETON SHIMMER LOAD STATE ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] text-white pt-[68px] md:pt-[74px] pb-20 px-4 sm:px-6 font-sans select-none">
        <div className="max-w-6xl mx-auto space-y-12 animate-pulse">
          {/* Breadcrumbs Shimmer */}
          <div className="h-4 bg-[#151515] rounded-lg w-1/4"></div>

          {/* Product Hero Shimmer */}
          <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="md:col-span-5 aspect-[16/10] bg-[#151515] rounded-2xl"></div>
            <div className="md:col-span-7 space-y-6">
              <div className="h-4 bg-[#151515] rounded w-1/6"></div>
              <div className="h-10 bg-[#151515] rounded w-3/4"></div>
              <div className="h-5 bg-[#151515] rounded w-1/3"></div>
              <div className="h-28 bg-[#151515] rounded-2xl w-full"></div>
              <div className="h-14 bg-[#151515] rounded-xl w-1/2"></div>
              <div className="h-12 bg-[#151515] rounded-xl w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= ERROR STATE ================= */
  if (error || !game) {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="text-center max-w-sm space-y-5 select-none">
          <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 border border-white/8 shadow-xl">
            <Info className="w-8 h-8 text-[#E00000]" />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-tight text-white font-sans">GAME NOT FOUND</h2>
          <p className="text-[#A1A1AA] text-xs uppercase tracking-wider leading-relaxed">
            The game you are looking for is currently unavailable.
          </p>
          <Link
            to="/games"
            className="inline-block bg-[#E00000] hover:bg-[#F00000] text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition active:scale-[0.98] min-h-[44px] flex items-center justify-center"
          >
            Browse Games
          </Link>
        </div>
      </div>
    );
  }  const gameRating = game?.game_rating || game?.rating;

  const getGameRatingStars = (ratingVal) => {
    const val = parseFloat(ratingVal);
    if (isNaN(val)) return 5;
    if (val > 5) return Math.round(val / 2);
    return Math.round(val);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-[68px] md:pt-[74px] pb-16 px-4 sm:px-6 font-sans">
      <div className="max-w-[1320px] mx-auto animate-page-section">
        
        {/* BREADCRUMB */}
        {renderBreadcrumbs()}

        {/* TWO-COLUMN PRODUCT HERO */}
        <section className="grid md:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          {/* Left Column: Image Banner */}
          <div className="md:col-span-5 space-y-4">
            <div className="relative aspect-[16/10] bg-[#111111] border border-white/8 rounded-2xl overflow-hidden group shadow-2xl">
              <img 
                src={game.image_url || "/placeholder.jpg"} 
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-[#E00000] text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-wider">
                  SAVE {discountPercentage}%
                </span>
              )}
            </div>
            
            {/* Delivery / Format label */}
            <div className="bg-[#111111] border border-white/8 rounded-xl p-4 flex items-center justify-between select-none">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">Platform format</span>
                <span className="text-xs font-bold text-white mt-0.5">Steam Digital Coordinates</span>
              </div>
              <img src={steamLogo} alt="Steam" className="h-5 opacity-80 object-contain" />
            </div>
          </div>

          {/* Right Column: Meta details & actions */}
          <div className="md:col-span-7 space-y-6">
            <div className="border-b border-white/8 pb-6 space-y-3">
              <span className="text-[10px] text-[#E00000] font-black uppercase tracking-widest block">
                {game.categories?.name || "PC Game"}
              </span>
              <h1 className="text-3xl sm:text-[44px] font-extrabold uppercase tracking-tight leading-none text-white">
                {game.title}
              </h1>

              {/* Game Rating (Official Rating - if exists in database) */}
              {gameRating && (
                <div className="flex items-center gap-2 mt-1 select-none">
                  <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">Game Rating:</span>
                  <div className="flex text-yellow-500 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < getGameRatingStars(gameRating) ? "fill-yellow-500 text-yellow-500" : "text-zinc-700"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-zinc-300 font-bold">
                    {gameRating}{String(gameRating).includes("/10") ? "" : "/10"}
                  </span>
                </div>
              )}

              {/* Review metrics rating (CG39 Customer Rating) */}
              {reviewsStats.count > 0 ? (
                <div className="flex items-center flex-wrap gap-2.5 mt-2 select-none">
                  <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">Customer Rating:</span>
                  <div className="flex text-yellow-500 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(reviewsStats.avg) ? "fill-yellow-500 text-yellow-500" : "text-zinc-700"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-zinc-300 font-bold">
                    {reviewsStats.avg}
                  </span>
                  <span className="text-xs text-zinc-500 font-semibold tracking-wider">
                    · Based on {reviewsStats.count} verified {reviewsStats.count === 1 ? "purchase" : "purchases"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 mt-2 text-zinc-500 text-xs font-bold uppercase tracking-wider select-none">
                  <span>No customer reviews yet</span>
                </div>
              )}
            </div>

            {/* Description intro */}
            <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl font-medium">
              {game.description}
            </p>

            {/* Platform characteristics indicators */}
            <div className="grid grid-cols-2 gap-3 max-w-md select-none">
              <div className="flex items-center gap-2 bg-[#111111] border border-white/8 rounded-xl p-3 text-xs text-zinc-300">
                <Gamepad2 className="w-4 h-4 text-[#E00000] shrink-0" />
                <span className="font-bold">PC / Steam Account</span>
              </div>
              <div className="flex items-center gap-2 bg-[#111111] border border-white/8 rounded-xl p-3 text-xs text-zinc-300">
                <Zap className="w-4 h-4 text-[#E00000] shrink-0" />
                <span className="font-bold">Digital delivery format</span>
              </div>
            </div>

            {/* PRICING BLOCK */}
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-5 max-w-md select-none">
              <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider block mb-2">Deal Price</span>
              
              {hasDiscount ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-extrabold text-white">₹{salePrice.toLocaleString()}</span>
                    <span className="text-zinc-500 line-through text-base">₹{steamPrice.toLocaleString()}</span>
                    <span className="bg-[#E00000] text-white text-[9px] font-black px-2 py-0.5 rounded">
                      -{discountPercentage}% OFF
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/5 px-2.5 py-1 rounded w-fit border border-emerald-500/10">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>Save ₹{savings.toLocaleString()} compared to Steam Store</span>
                  </div>
                </div>
              ) : (
                <span className="text-3xl font-extrabold text-white">₹{salePrice.toLocaleString()}</span>
              )}
            </div>

            {/* CTAS AND ACTIONS */}
            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md pt-2">
              <button
                onClick={handleBuyNow}
                disabled={buyNowLoading}
                className="w-full sm:flex-1 bg-[#E00000] hover:bg-[#F00000] text-white rounded-xl min-h-[46px] font-bold uppercase text-xs tracking-wider transition flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                aria-label={`Buy ${game.title} now`}
              >
                <Zap className="w-4 h-4" />
                {buyNowLoading ? "Processing..." : "Buy Now"}
              </button>

              <button
                onClick={handleAddToCart}
                disabled={cartLoading}
                className="w-full sm:flex-1 bg-[#111111] hover:bg-[#151515] border border-white/8 hover:border-white/20 text-white rounded-xl min-h-[46px] font-bold uppercase text-xs tracking-wider transition flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                aria-label={`Add ${game.title} to cart`}
              >
                <ShoppingCart className="w-4 h-4 text-zinc-400" />
                {cartLoading ? "Adding..." : "Add to Cart"}
              </button>

              <button 
                onClick={handleToggleWishlist} 
                disabled={wishlistLoading}
                className="w-full sm:w-auto bg-[#111111] hover:bg-[#151515] border border-white/8 hover:border-white/20 min-h-[46px] px-4 rounded-xl text-zinc-400 hover:text-[#E00000] transition flex items-center justify-center gap-2 active:scale-[0.98] text-xs font-bold uppercase tracking-wider"
                aria-label={inWishlist ? `Remove ${game.title} from wishlist` : `Add ${game.title} to wishlist`}
              >
                <Heart className={`w-4 h-4 shrink-0 ${inWishlist ? "fill-[#E00000] text-[#E00000]" : ""}`} />
                <span>{inWishlist ? "SAVED" : "ADD TO WISHLIST"}</span>
              </button>
            </div>

            {/* Purchase Guarantees Card */}
            <div className="bg-[#111111]/40 border border-white/5 rounded-2xl p-5 space-y-4 select-none mt-6 text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block border-b border-white/5 pb-2">
                Store Guarantees
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="leading-tight">
                    <span className="text-xs font-bold text-white block">100% Secure Checkout</span>
                    <span className="text-[10px] text-zinc-500 font-medium block mt-0.5">UPI & verified payment verification</span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="leading-tight">
                    <span className="text-xs font-bold text-white block">Instant Digital Delivery</span>
                    <span className="text-[10px] text-zinc-500 font-medium block mt-0.5">Dispatch coordinates within 5-30 mins</span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Gamepad2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="leading-tight">
                    <span className="text-xs font-bold text-white block">Genuine Games Only</span>
                    <span className="text-[10px] text-zinc-500 font-medium block mt-0.5">Authentic offline accounts & licenses</span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="leading-tight">
                    <span className="text-xs font-bold text-white block">Buyer Protection</span>
                    <span className="text-[10px] text-zinc-500 font-medium block mt-0.5">Replacement warranty for setup issues</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SPECS AND ABOUT THE GAME */}
        <section className="flex flex-col md:grid md:grid-cols-12 gap-8 items-start mb-16 border-t border-white/8 pt-12">
          {/* About section */}
          <div className="order-2 md:order-1 md:col-span-8 space-y-4">
            <h3 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2 select-none">
              <FileText className="w-4.5 h-4.5 text-[#E00000]" /> About This Game
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line pr-4">
              {game.description}
            </p>
          </div>

          {/* Specs panel */}
          <div className="order-1 md:order-2 md:col-span-4 w-full bg-[#111111] border border-white/8 rounded-2xl p-6 select-none">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-4">
              Game Information
            </h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-zinc-500 uppercase font-bold">Platform</span>
                <span className="text-white font-medium">{game.platform || "PC (Steam)"}</span>
              </div>
              {game.categories?.name && (
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-zinc-500 uppercase font-bold">Genre</span>
                  <span className="text-white font-medium">{game.categories.name}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-0.5">
                <span className="text-zinc-500 uppercase font-bold">Delivery format</span>
                <span className="text-white font-medium">Digital Coordinates</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-zinc-500 uppercase font-bold">Availability</span>
                <span className="text-emerald-400 font-bold uppercase">In Stock</span>
              </div>
            </div>
          </div>
        </section>

        {/* TIMELINE SETUP & INSTRUCTIONS */}
        <section className="grid md:grid-cols-12 gap-8 items-start mb-16 border-t border-white/8 pt-12">
          {/* How it Works Activation Timeline */}
          <div className="md:col-span-7 bg-[#111111] border border-white/8 rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-bold uppercase tracking-wide mb-6 flex items-center gap-2 select-none">
              <Gamepad2 className="w-5 h-5 text-[#E00000]" /> Steam Setup & Activation
            </h3>
            <div className="relative pl-6 border-l border-white/5 space-y-6 text-xs text-zinc-300">
              <div className="relative flex flex-col gap-0.5">
                <span className="absolute -left-[35px] w-5 h-5 rounded-full bg-[#080808] border border-[#E00000] text-white flex items-center justify-center text-[10px] font-black">1</span>
                <span className="font-bold text-white uppercase">Download Steam app</span>
                <span className="text-zinc-400">Install the official Steam desktop client on your Windows gaming PC.</span>
              </div>
              <div className="relative flex flex-col gap-0.5">
                <span className="absolute -left-[35px] w-5 h-5 rounded-full bg-[#080808] border border-[#E00000] text-white flex items-center justify-center text-[10px] font-black">2</span>
                <span className="font-bold text-white uppercase">Log in using credentials</span>
                <span className="text-zinc-400">Enter the Steam account credentials shared in your delivery coordinates.</span>
              </div>
              <div className="relative flex flex-col gap-0.5">
                <span className="absolute -left-[35px] w-5 h-5 rounded-full bg-[#080808] border border-[#E00000] text-white flex items-center justify-center text-[10px] font-black">3</span>
                <span className="font-bold text-white uppercase">Install your game</span>
                <span className="text-zinc-400">Locate the game inside your Steam library and download all files.</span>
              </div>
              <div className="relative flex flex-col gap-0.5">
                <span className="absolute -left-[35px] w-5 h-5 rounded-full bg-[#080808] border border-[#E00000] text-white flex items-center justify-center text-[10px] font-black">4</span>
                <span className="font-bold text-white uppercase">Switch Steam to Offline</span>
                <span className="text-zinc-400">Enter Offline Mode on Steam client to enjoy uninterrupted offline gameplay.</span>
              </div>
            </div>
          </div>
 
          {/* Product Disclaimers */}
          <div className="md:col-span-5 bg-[#111111] border border-white/8 rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-full min-h-[300px]">
            <div className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2 select-none">
                <FileText className="w-5 h-5 text-[#E00000]" /> Product Disclaimers
              </h3>
              <ul className="space-y-4 text-xs text-zinc-400">
                <li className="flex gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-[#E00000] shrink-0 mt-0.5 animate-pulse" />
                  <span>Account coordinates are delivered after manual payment validation check.</span>
                </li>
                <li className="flex gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-[#E00000] shrink-0 mt-0.5 animate-pulse" />
                  <span>This is a digital coordinates delivery. No physical boxes or CD media are sent.</span>
                </li>
                <li className="flex gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-[#E00000] shrink-0 mt-0.5 animate-pulse" />
                  <span>Unrestricted offline play access is supported permanently. Online modes are locked.</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8 border-t border-white/5 pt-4 select-none">
              <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider block mb-1">Specs Requirements</span>
              <p className="text-xs text-zinc-400">Hardware specs are not provided. Please refer to Steam Store listings.</p>
            </div>
          </div>
        </section>

        {/* VERIFIED CUSTOMER REVIEWS */}
        <section className="grid lg:grid-cols-12 gap-8 lg:gap-12 border-t border-white/8 pt-12 mb-16">
          {/* Summary and review entry form */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xl font-bold uppercase tracking-tight text-white select-none">Reviews Summary</h3>
            
            {reviewsStats.count > 0 ? (
              <div className="bg-[#111111] border border-white/8 rounded-2xl p-5 space-y-4 select-none">
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-black text-[#E00000]">{reviewsStats.avg}</span>
                  <div>
                    <div className="flex gap-0.5 text-yellow-500 mb-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(reviewsStats.avg) ? "fill-yellow-500" : "text-zinc-700"}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{reviewsStats.count} Reviews</span>
                  </div>
                </div>

                {/* Rating bars distribution list */}
                <div className="space-y-1.5 text-xs text-zinc-400">
                  {reviewsStats.dist.map((cnt, idx) => {
                    const stars = idx + 1;
                    const percent = Math.round((cnt / reviewsStats.count) * 100);
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-3 text-right">{stars}★</span>
                        <div className="flex-1 bg-black/40 rounded-full h-2 overflow-hidden border border-white/5">
                          <div className="bg-[#E00000] h-full" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="w-8 text-right text-zinc-500">{percent}%</span>
                      </div>
                    );
                  }).reverse()}
                </div>
              </div>
            ) : (
              <div className="bg-[#111111]/30 border border-white/8 rounded-2xl p-5 text-center text-xs text-zinc-500 select-none">
                No reviews yet. Share your feedback after checking out.
              </div>
            )}

            {/* Submission Block */}
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-5">
              {!user ? (
                <div className="text-center py-4 space-y-3">
                  <p className="text-xs text-zinc-500">Please log in to submit a verified review.</p>
                  <button onClick={() => navigate("/login")} className="bg-[#E00000] hover:bg-[#F00000] text-xs font-bold px-4 py-2 rounded-lg uppercase transition min-h-[44px] w-full" aria-label="Login to leave review">Login</button>
                </div>
              ) : eligibility.reviewStatus === "pending" ? (
                <div className="text-center py-4 select-none bg-amber-500/5 border border-amber-500/10 rounded-xl p-4">
                  <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2 animate-pulse" />
                  <p className="text-xs text-amber-400 font-bold">Review Pending Approval</p>
                  <p className="text-[10px] text-zinc-500 mt-1.5 leading-relaxed max-w-xs mx-auto">
                    Your review is currently pending moderation. It will be visible on the store once approved by the admin.
                  </p>
                </div>
              ) : eligibility.reviewStatus === "approved" ? (
                <div className="text-center py-4 select-none bg-green-500/5 border border-green-500/10 rounded-xl p-4">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2 animate-bounce" />
                  <p className="text-xs text-green-400 font-bold">Review Approved</p>
                  <p className="text-[10px] text-zinc-500 mt-1.5 leading-relaxed max-w-xs mx-auto">
                    Your review is approved and now publicly visible on the game page. Thank you!
                  </p>
                </div>
              ) : !eligibility.hasPurchased ? (
                <div className="text-center py-4 select-none">
                  <Info className="w-8 h-8 text-[#E00000] mx-auto mb-2" />
                  <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Verified Buyer Required</p>
                  <p className="text-[10px] text-zinc-500 mt-1.5 leading-normal max-w-xs mx-auto">Only clients who purchased this specific game can submit reviews.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4 text-left">
                  {eligibility.reviewStatus === "rejected" && (
                    <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3.5 text-left text-xs mb-2">
                      <div className="flex gap-2 text-red-400 font-bold mb-1">
                        <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>Previous Review Rejected</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                        Your previous review for this game was rejected. You are welcome to submit a new review below.
                      </p>
                    </div>
                  )}
                  <span className="text-[10px] text-zinc-500 uppercase font-black block select-none">Write a Review</span>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 font-bold select-none">Rating:</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-yellow-500 transition"
                          aria-label={`Rate ${star} Stars`}
                        >
                          <Star className={`w-5 h-5 ${star <= rating ? "fill-yellow-500 text-yellow-500" : "text-zinc-600"}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    maxLength={1000}
                    rows={4}
                    placeholder="Provide your experience with the account delivery coordinates and offline setup..."
                    className="w-full bg-[#080808] border border-white/8 rounded-xl p-3 text-xs text-white focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]/30 outline-none transition"
                  />

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full bg-[#E00000] hover:bg-[#F00000] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition min-h-[44px]"
                    aria-label="Submit Verified Review"
                  >
                    {reviewLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
               )}
             </div>
           </div>

          {/* Right: reviews list */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2 select-none">
              Customer Reviews <span className="text-xs bg-white/5 border border-white/8 text-zinc-500 px-2 py-0.5 rounded">{dbReviews.length}</span>
            </h3>

            {dbReviews.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {dbReviews.map((rev) => (
                  <div key={rev.id} className="bg-[#111111] border border-white/8 rounded-2xl p-5 hover:border-white/20 transition">
                    <div className="flex justify-between items-start gap-4 mb-2.5">
                      <div>
                        <h4 className="font-extrabold text-sm text-white">{rev.profiles?.full_name || "Verified Client"}</h4>
                        <div className="flex gap-0.5 mt-1 select-none">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < rev.rating ? "fill-yellow-500 text-yellow-500" : "text-zinc-700"}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono select-none">
                        {new Date(rev.created_at).toLocaleDateString(undefined, {
                          year: "numeric", month: "short", day: "numeric"
                        })}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {rev.is_verified && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded select-none">
                          <Check className="w-3 h-3" /> Verified Purchase
                        </span>
                      )}
                      {rev.status === "pending" && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded select-none">
                          <Clock className="w-3 h-3 animate-pulse" /> Pending Approval
                        </span>
                      )}
                      {rev.status === "rejected" && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-red-400 font-bold bg-red-500/5 border border-red-500/10 px-2 py-0.5 rounded select-none">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </div>

                    <p className="text-zinc-300 text-xs leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#111111]/30 border border-white/8 rounded-2xl p-8 text-center text-xs text-zinc-500 select-none">
                No reviews yet. Share your experience with the community.
              </div>
            )}
          </div>
        </section>

        {/* RELATED PRODUCTS */}
        <section className="border-t border-white/8 pt-12 space-y-16">
          {/* YOU MAY ALSO LIKE */}
          {recommendedLike.length > 0 && (
            <div>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-8">
                You <span className="text-[#E00000]">May Also Like</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                {recommendedLike.map(g => (
                  <GameCard key={g.id} game={g} />
                ))}
              </div>
            </div>
          )}

          {/* MORE FROM THIS CATEGORY */}
          {recommendedCategory.length > 0 && (
            <div>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-8">
                More From <span className="text-[#E00000]">This Category</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                {recommendedCategory.map(g => (
                  <GameCard key={g.id} game={g} />
                ))}
              </div>
            </div>
          )}

          {/* PLAYERS ALSO VIEWED */}
          {recommendedViewed.length > 0 && (
            <div>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-8">
                Players <span className="text-[#E00000]">Also Viewed</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                {recommendedViewed.map(g => (
                  <GameCard key={g.id} game={g} />
                ))}
              </div>
            </div>
          )}

          {/* MORE GREAT DEALS */}
          {recommendedDeals.length > 0 && (
            <div>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-8">
                More Great <span className="text-[#E00000]">Deals</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                {recommendedDeals.map(g => (
                  <GameCard key={g.id} game={g} />
                ))}
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default GameDetails;
