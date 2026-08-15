import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Sword as Swords,
  Compass,
  Shield,
  Car,
  Ghost as Skull,
  Ghost as Flame,
  GameController as Gamepad,
  Lightning as Zap,
  ShieldCheck,
  SealCheck as BadgeCheck,
  ChatCircle as MessageCircle,
  SquaresFour as LayoutDashboard,
  Heart,
  ShoppingCart,
  Star,
  Gift,
  ArrowRight,
  ArrowLeft,
  TrendUp as TrendingUp,
  GameController as Gamepad2,
  Package as PackageOpen,
  MapTrifold as Map,
  Ghost,
  Sword as Dumbbell,
  Headset,
  SealCheck,
  Lightning,
  Globe
} from "@phosphor-icons/react";
import RecentlyViewed from "../components/RecentlyViewed";
import { GameCard } from "../components/GameCard";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { FaWhatsapp } from "react-icons/fa";

const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`;

const SectionHeader = ({ eyebrow, title, accent, action, onAction }) => (
  <div className="flex items-end justify-between mb-6 pb-2 border-b border-[#E5E5E5] select-none relative">
    <div>
      {eyebrow && <span className="text-[#E10600] text-[10px] uppercase font-black tracking-widest block mb-0.5">{eyebrow}</span>}
      <div className="relative inline-block">
        <h2 className="text-base md:text-lg font-black uppercase tracking-tight text-[#1A1A1A]">
          {title} {accent && <span className="text-[#E10600]">{accent}</span>}
        </h2>
        <div className="absolute -bottom-[9px] left-0 w-12 h-[2px] bg-[#E10600]" />
      </div>
    </div>
    {action && (
      <button
        onClick={onAction}
        className="flex items-center gap-1.5 text-[11px] font-black text-[#555555] hover:text-[#E10600] uppercase tracking-wider transition shrink-0"
      >
        <span>{action}</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#E10600]" />
      </button>
    )}
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isGameInWishlist } = useWishlist();

  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const DEFAULT_BG_IMAGES = useMemo(() => [
    "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg", // Elden Ring
    "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg", // Cyberpunk 2077
    "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg", // Red Dead Redemption 2
    "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg",  // GTA V
    "https://cdn.cloudflare.steamstatic.com/steam/apps/2358720/header.jpg"  // Black Myth Wukong
  ], []);

  const carouselSlides = useMemo(() => {
    const defaultSlides = [
      {
        eyebrow: "CG39 DEALS",
        title: "BIG GAMES.",
        titleRed: "SMALL PRICES.",
        desc: "Premium PC games at prices you'll actually love.",
        btn1Text: "Shop Games",
        btn1Link: "/games",
        btn2Text: "View Deals",
        btn2Link: "/games?sortBy=discount",
        image: DEFAULT_BG_IMAGES[0]
      },
      {
        eyebrow: "PREMIUM PC GAMES",
        title: "BEST SELLING",
        titleRed: "BLOCKBUSTERS",
        desc: "Get authentic digital keys for top-rated hits.",
        btn1Text: "Shop Games",
        btn1Link: "/games",
        btn2Text: "Best Deals",
        btn2Link: "/offers",
        image: DEFAULT_BG_IMAGES[1]
      },
      {
        eyebrow: "WEEKEND DEALS",
        title: "MASSIVE SAVINGS",
        titleRed: "ON AAA TITLES",
        desc: "Save big on blockbuster titles this weekend.",
        btn1Text: "Browse Deals",
        btn1Link: "/games?sortBy=discount",
        btn2Text: "View All",
        btn2Link: "/games",
        image: DEFAULT_BG_IMAGES[2]
      },
      {
        eyebrow: "BUDGET SAVINGS",
        title: "PC GAMES",
        titleRed: "UNDER \u20b999",
        desc: "Affordable titles with secure checkout and instant access.",
        btn1Text: "Shop Budget",
        btn1Link: "/games?maxPrice=99",
        btn2Text: "All Games",
        btn2Link: "/games",
        image: DEFAULT_BG_IMAGES[3]
      }
    ];

    if (games && games.length >= 4) {
      return defaultSlides.map((slide, idx) => {
        const game = games[idx];
        if (!game) return slide; // guard: fewer games than slides
        return {
          ...slide,
          image: game.image_url || slide.image,
          desc: game.title ? `Get authentic keys for ${game.title} and more.` : slide.desc
        };
      });
    }

    return defaultSlides;
  }, [games, DEFAULT_BG_IMAGES]);

  // Reduced motion media query listener
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Autoplay
  useEffect(() => {
    if (isHovered || carouselSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, carouselSlides]);

  // Reviews state from database
  const [reviews, setReviews] = useState([]);

  // Fetch games & categories
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [gamesRes, catsRes] = await Promise.all([
          axios.get(`${API}/games`),
          axios.get(`${API}/categories`)
        ]);
        setGames(gamesRes.data || []);
        setCategories(catsRes.data || []);
      } catch (err) {
        console.error("Home loading error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Compute game sections based on actual data
  const bestDealsGames = useMemo(() => {
    return [...games]
      .filter(g => g.in_stock !== false && g.steam_price > g.price)
      .sort((a, b) => {
        const discA = (a.steam_price - a.price) / a.steam_price;
        const discB = (b.steam_price - b.price) / b.steam_price;
        return discB - discA;
      })
      .slice(0, 5);
  }, [games]);

  const featuredGames = useMemo(() => {
    const filtered = games.filter(g => g.is_new === true || g.is_new === "true");
    return filtered.length > 0 ? filtered.slice(0, 5) : games.slice(0, 5);
  }, [games]);

  const trendingGames = useMemo(() => {
    return [...games]
      .sort((a, b) => (a.display_order || 999) - (b.display_order || 999))
      .slice(0, 5);
  }, [games]);

  // Fetch real reviews from the database for the featured games
  useEffect(() => {
    if (featuredGames.length === 0) return;
    const fetchFeaturedReviews = async () => {
      try {
        const reviewPromises = featuredGames.slice(0, 4).map(game => 
          axios.get(`${API}/reviews/${game.id}`).catch(() => ({ data: [] }))
        );
        const results = await Promise.all(reviewPromises);
        const allFetchedReviews = results
          .flatMap((res, idx) => 
            res.data.map(r => ({
              ...r,
              verifiedGame: featuredGames[idx].title
            }))
          );
        setReviews(allFetchedReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchFeaturedReviews();
  }, [featuredGames]);

  // Calculate dynamic recommendations
  const wishlistIds = useMemo(
    () => new Set(games.filter(g => isGameInWishlist(g.id)).map(g => String(g.id))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [games]
  );

  const recommendedGames = useMemo(() => {
    if (games.length === 0) return [];
    const storageKey = user ? `cg39_recent_${user.id}` : "cg39_guest_recent";
    let recent = [];
    try {
      const raw = localStorage.getItem(storageKey);
      recent = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(recent)) recent = [];
    } catch (e) {
      console.warn("[Home] localStorage parse error:", e);
    }
    const recentIds = recent.map(r => String(r.id));
    const recentCatIds = recent.map(r => {
      const match = games.find(g => String(g.id) === String(r.id));
      return match ? match.category_id : null;
    }).filter(Boolean);
    const scored = games
      .filter(g => g.in_stock !== false && !recentIds.includes(String(g.id)))
      .map(g => {
        let score = 0;
        if (recentCatIds.includes(g.category_id)) score += 5;
        if (g.is_new) score += 1;
        if (g.is_bundle) score += 1;
        if (wishlistIds.has(String(g.id))) score += 3;
        return { game: g, score };
      })
      .filter(item => item.score > 0);
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 5).map(item => item.game);
  }, [games, user, wishlistIds]);

  const hasHistory = useMemo(() => {
    const storageKey = user ? `cg39_recent_${user.id}` : "cg39_guest_recent";
    try {
      const raw = localStorage.getItem(storageKey);
      const recent = raw ? JSON.parse(raw) : [];
      return Array.isArray(recent) && recent.length > 0;
    } catch (e) {
      return false;
    }
  }, [user]);

  // Memoize price discovery tiers
  const priceTiers = useMemo(() => {
    const tiers = [];
    if (games.some(g => g.price <= 49 && g.in_stock !== false))
      tiers.push({ label: "Under \u20b949", max: 49, desc: "Budget-friendly picks" });
    if (games.some(g => g.price <= 99 && g.in_stock !== false))
      tiers.push({ label: "Under \u20b999", max: 99, desc: "More games to explore" });
    if (games.some(g => g.price <= 199 && g.in_stock !== false))
      tiers.push({ label: "Under \u20b9199", max: 199, desc: "Premium games catalog" });
    if (games.some(g => g.steam_price >= 1500 && g.in_stock !== false))
      tiers.push({ label: "AAA Deals", max: "aaa", desc: "Top-tier blockbuster titles" });
    return tiers;
  }, [games]);

  // Map category names to appropriate Lucide icons
  const categoryIconMap = {
    "action": Swords,
    "open world": Map,
    "rpg": Shield,
    "racing": Car,
    "horror": Ghost,
    "survival": Ghost,
    "fighting": Dumbbell,
    "adventure": Compass,
    "steam": Gamepad2,
    "pc": Gamepad2,
  };

  const getCategoryIcon = (name) => {
    const key = name.toLowerCase();
    for (const [pattern, icon] of Object.entries(categoryIconMap)) {
      if (key.includes(pattern)) return icon;
    }
    return Gamepad;
  };

  const handlePrev = () => {
    setCarouselIndex(prev => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const handleNext = () => {
    setCarouselIndex(prev => (prev + 1) % carouselSlides.length);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      handlePrev();
    } else if (e.key === "ArrowRight") {
      handleNext();
    }
  };

  // Compact Horizontal Hero Promotional Banner Carousel
  const renderPromoBanner = () => {
    if (carouselSlides.length === 0) return null;
    const slide = carouselSlides[carouselIndex];
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 select-none">
        <div
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative rounded-2xl overflow-hidden bg-[#161616] border border-[#E5E5E5] min-h-[280px] md:min-h-[340px] flex items-center p-6 md:p-12 shadow-md outline-none focus-visible:ring-2 focus-visible:ring-[#FF0000]"
          aria-label="Promotional Carousel"
        >
          {/* Slides Backdrops Container with crossfade (Artwork fully visible and saturated) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {carouselSlides.map((item, idx) => {
              const isActive = idx === carouselIndex;
              const transitionClass = prefersReducedMotion 
                ? "" 
                : "transition-all duration-500 ease-in-out";
              return (
                <div
                  key={idx}
                  className={`absolute inset-0 bg-cover ${transitionClass} ${isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-[1.02] z-0"}`}
                  style={{ 
                    backgroundImage: `url('${item.image}')`,
                    objectFit: "cover",
                    backgroundPosition: "center right",
                    filter: "brightness(1.05) contrast(1.05)"
                  }} 
                />
              );
            })}
          </div>

          {/* Subtle dark gradient overlay only protecting text (Left to Right) */}
          <div className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.20) 55%, rgba(0,0,0,0.05) 100%)"
            }}
          />
          
          {/* Left Promo Text */}
          <div className="relative z-30 max-w-xl flex flex-col items-start gap-2 md:gap-3 text-left">
            <span className="text-[#FF0000] text-[10px] md:text-xs font-black uppercase tracking-widest bg-[#111111]/80 border border-white/10 px-2.5 py-1 rounded shadow-sm" style={{ color: "#FF0000", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
              {slide.eyebrow}
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-[#FFFFFF] uppercase tracking-tight leading-tight" style={{ color: "#FFFFFF", textShadow: "0 2px 8px rgba(0,0,0,0.45)" }}>
              {slide.title} <br className="hidden sm:inline" /> <span className="text-[#FF0000]" style={{ color: "#FF0000" }}>{slide.titleRed}</span>
            </h1>
            <p className="text-[#F5F5F5] text-xs md:text-sm max-w-sm font-semibold leading-relaxed mb-2" style={{ color: "#F5F5F5", textShadow: "0 2px 8px rgba(0,0,0,0.45)" }}>
              {slide.desc}
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => navigate(slide.btn1Link)}
                className="bg-[#FF0000] hover:bg-[#CC0000] text-[#FFFFFF] text-[10px] md:text-xs font-black uppercase tracking-wider px-5 py-3 rounded-lg transition active:scale-[0.98] shadow-md shadow-[#FF0000]/10 border border-[#FF0000]"
              >
                {slide.btn1Text}
              </button>
              <button
                onClick={() => navigate(slide.btn2Link)}
                className="bg-[#FFFFFF] hover:bg-[#F5F5F5] text-[#111111] text-[10px] md:text-xs font-black uppercase tracking-wider px-5 py-3 rounded-lg transition active:scale-[0.98] border border-white shadow-md shadow-black/10"
              >
                {slide.btn2Text}
              </button>
            </div>
          </div>

          {/* Previous / Next controls */}
          <button
            onClick={handlePrev}
            className="absolute left-4 z-40 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-black/40 hover:bg-[#FF0000] border border-white/10 hover:border-[#FF0000] text-white hover:scale-105 active:scale-95 transition-all"
            aria-label="Previous slide"
          >
            <ArrowLeft className="w-5 h-5 text-white" weight="bold" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 z-40 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-black/40 hover:bg-[#FF0000] border border-white/10 hover:border-[#FF0000] text-white hover:scale-105 active:scale-95 transition-all"
            aria-label="Next slide"
          >
            <ArrowRight className="w-5 h-5 text-white" weight="bold" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-0 right-0 z-40 flex justify-center gap-2">
            {carouselSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCarouselIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === carouselIndex ? "bg-[#FF0000] w-6" : "bg-white/40 hover:bg-white/70"}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Horizontal Quick Categories navigation rail
  const renderDiscoveryRail = () => {
    if (categories.length === 0) return null;
    return (
      <div className="w-full bg-white py-4 border-b border-[#E5E5E5] overflow-x-auto scrollbar-none select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-3 text-xs font-bold uppercase tracking-wider justify-start md:justify-center">
          <Link
            to="/games"
            className="flex items-center gap-2 bg-[#FFFFFF] border border-[#E5E5E5] hover:border-zinc-300 hover:bg-[#F9F9F9] text-[#555555] hover:text-[#111111] px-4 py-2 rounded-full transition shrink-0 whitespace-nowrap"
            aria-label="All Games Category"
          >
            <Gamepad className="w-4 h-4 text-[#777777]" weight="bold" />
            <span>All Games</span>
          </Link>
          {categories.slice(0, 10).map((cat) => {
            const IconComponent = getCategoryIcon(cat.name);
            return (
              <Link
                key={cat.id}
                to={`/games?category=${cat.id}`}
                className="flex items-center gap-2 bg-[#FFFFFF] border border-[#E5E5E5] hover:border-zinc-300 hover:bg-[#F9F9F9] text-[#555555] hover:text-[#111111] px-4 py-2 rounded-full transition shrink-0 whitespace-nowrap"
                aria-label={`Category ${cat.name}`}
              >
                <IconComponent className="w-4 h-4 text-[#777777]" weight="bold" />
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  // Compact Deal Banner Grid
  const renderDealBanners = () => {
    const banner1Img = games[4]?.image_url || DEFAULT_BG_IMAGES[0];
    const banner2Img = games[1]?.image_url || DEFAULT_BG_IMAGES[2];
    const banner3Img = games[2]?.image_url || DEFAULT_BG_IMAGES[4];

    const dealItems = [
      {
        titleWhite: "WEEKEND",
        titleRed: "DEALS",
        desc: "Explore selected PC games",
        image: banner1Img,
        link: "/games?sortBy=discount"
      },
      {
        titleWhite: "DEALS UNDER",
        titleRed: "\u20b999",
        desc: "Save on budget PC games",
        image: banner2Img,
        link: "/games?maxPrice=99"
      },
      {
        titleWhite: "AAA",
        titleRed: "BLOCKBUSTERS",
        desc: "Blockbuster deals at epic prices",
        image: banner3Img,
        link: "/games?minSteamPrice=1500"
      }
    ];

    return (
      <section className="py-2 px-4 sm:px-6 max-w-7xl mx-auto w-full select-none mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {dealItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(item.link)}
              className="relative overflow-hidden rounded-xl border border-[#E5E5E5] hover:border-[#FF0000] h-[95px] md:h-[110px] flex items-center justify-between p-5 cursor-pointer shadow-sm transition-all duration-300 hover:-translate-y-0.5 group"
            >
              {/* Background cover (original saturation & color preserved) */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{ 
                  backgroundImage: `url('${item.image}')`,
                  objectFit: "cover",
                  backgroundPosition: "center right",
                  filter: "brightness(1.05) contrast(1.05)"
                }}
              />
              {/* Subtle dark gradient behind text only (Left to Right) */}
              <div 
                className="absolute inset-0 z-10 transition-colors duration-300"
                style={{
                  background: "linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.30) 45%, rgba(0,0,0,0.05) 100%)"
                }}
              />

              {/* Text content */}
              <div className="relative z-20 text-left">
                <span className="text-[10px] font-black tracking-wider uppercase block mb-0.5" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                  <span className="text-[#FFFFFF]">{item.titleWhite}</span> <span className="text-[#FF0000]">{item.titleRed}</span>
                </span>
                <h4 className="text-[#F2F2F2] text-xs md:text-sm font-extrabold uppercase leading-tight select-none" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                  {item.desc}
                </h4>
              </div>

              {/* CTA icon - white circular arrow button with subtle shadow */}
              <div className="relative z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-[#FF0000] flex items-center justify-center border border-white/20 hover:border-[#FF0000] shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition-all duration-200 shrink-0">
                <ArrowRight className="w-4 h-4 text-[#FFFFFF]" weight="bold" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Trust Strip Section
  const renderTrustStrip = () => (
    <section className="pt-[36px] pb-[36px] px-5 sm:px-6 bg-white select-none">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[14px] sm:text-[15px] font-bold tracking-[0.12em] text-[#222222] uppercase mb-6 text-center lg:text-left">
          Why Shop with CG39
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "SECURE PAYMENTS",     icon: ShieldCheck, desc: "UPI payments verified manually", color: "text-[#E10600]" },
            { label: "FAST DIGITAL DELIVERY", icon: Lightning,   desc: "Keys delivered after verification", color: "text-amber-500" },
            { label: "VERIFIED PROCESS",     icon: SealCheck,   desc: "Transparent ordering process", color: "text-blue-500" },
            { label: "CUSTOMER SUPPORT",     icon: Headset,     desc: "Quick assistance when you need it", color: "text-[#222222]" }
          ].map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div 
                key={idx} 
                className="group flex flex-col items-start text-left p-4 sm:p-5 bg-white border border-[#E8E8E8] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:border-zinc-300 transition-all duration-200 ease-out min-h-[130px] sm:min-h-[145px] h-full"
              >
                <div className="w-11 h-11 rounded-xl bg-[#FAFAFA] border border-[#EEEEEE] flex items-center justify-center shrink-0 mb-3.5 transition-transform duration-200 ease-out group-hover:scale-[1.04]">
                  <IconComp size={22} className={`${item.color} shrink-0`} />
                </div>
                <h3 className="text-[13px] sm:text-[14px] font-bold text-[#222222] uppercase tracking-wide leading-tight mb-1 select-none">
                  {item.label}
                </h3>
                <p className="text-[11px] sm:text-[12px] text-[#777777] leading-[1.4] select-none">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );

  // Best Selling Games
  const renderBestSellingGames = () => {
    if (trendingGames.length === 0) return null;
    return (
      <section className="py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            eyebrow="Best Selling" 
            title="Best Selling" 
            accent="Games" 
            action="View all →" 
            onAction={() => navigate("/games")} 
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {trendingGames.slice(0, 5).map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Best Selling Deals (TODAY'S DEALS)
  const renderBestSellingDeals = () => {
    if (bestDealsGames.length === 0) return null;
    return (
      <section className="py-8 px-4 sm:px-6 bg-[#F8F8F8] border-y border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            eyebrow="Value Deals" 
            title="Today's" 
            accent="Deals" 
            action="View All Deals" 
            onAction={() => navigate("/games?sortBy=discount")} 
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {bestDealsGames.slice(0, 5).map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Trending Now
  const renderTrendingNow = () => {
    if (featuredGames.length === 0) return null;
    return (
      <section className="py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            eyebrow="Staff Picks" 
            title="Trending" 
            accent="Now" 
            action="Browse Catalog" 
            onAction={() => navigate("/games")} 
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {featuredGames.slice(0, 5).map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Price Discovery Section (Budget options)
  const renderPriceDiscovery = () => {
    if (priceTiers.length === 0) return null;
    return (
      <section className="py-8 px-4 sm:px-6 bg-[#F8F8F8] border-y border-[#E5E5E5] select-none">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Find Your Price" title="Shop by" accent="Budget" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {priceTiers.map((tier, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (tier.max === "aaa") {
                    navigate("/games?minSteamPrice=1500");
                  } else {
                    navigate(`/games?maxPrice=${tier.max}`);
                  }
                }}
                className="group bg-white border border-[#E5E5E5] hover:border-[#E10600] active:bg-[#E10600] active:text-white transition-all duration-200 rounded-xl p-4 flex flex-col gap-1 cursor-pointer hover:-translate-y-0.5 shadow-sm"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (tier.max === "aaa") navigate("/games?minSteamPrice=1500");
                    else navigate(`/games?maxPrice=${tier.max}`);
                  }
                }}
              >
                <span className="text-xs font-black uppercase text-[#1A1A1A] group-hover:text-[#E10600] tracking-wider select-none transition-colors">{tier.label}</span>
                <span className="text-[10px] text-[#666666] leading-tight select-none transition-colors">{tier.desc}</span>
                <div className="flex items-center gap-1 text-[9px] font-black text-[#555555] group-hover:text-[#E10600] uppercase mt-2 transition-colors">
                  <span>Browse</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Popular Categories section
  const renderCategories = () => {
    if (categories.length === 0) return null;
    const activeCats = categories.filter(cat =>
      games.some(g => g.category_id === cat.id && g.in_stock !== false)
    );
    if (activeCats.length === 0) return null;
    return (
      <section className="py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Game Genres" title="Browse by" accent="Category" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 select-none">
            {activeCats.slice(0, 12).map((cat) => {
              const IconComponent = getCategoryIcon(cat.name);
              const gameCount = games.filter(g => g.category_id === cat.id && g.in_stock !== false).length;
              return (
                <div
                  key={cat.id}
                  onClick={() => navigate(`/games?category=${cat.id}`)}
                  className="group bg-[#F8F8F8] border border-[#E5E5E5] hover:border-[#E00000]/30 hover:bg-white transition-all duration-200 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:-translate-y-0.5 shadow-sm"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/games?category=${cat.id}`)}
                >
                  <div className="bg-white p-2 rounded-lg group-hover:bg-[#E00000]/10 border border-[#E5E5E5] group-hover:border-[#E00000]/20 transition-all duration-200 shrink-0">
                    <IconComponent className="w-4 h-4 text-zinc-500 group-hover:text-[#E00000]" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs uppercase text-[#111111] leading-tight block truncate">{cat.name}</span>
                    {gameCount > 0 && (
                      <span className="text-[9px] text-[#666666] font-semibold block">{gameCount} Games</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  // Mid-page Promotional Banner
  const renderMidPromoBanner = () => {
    return (
      <section className="py-6 px-4 sm:px-6 bg-[#F8F8F8] border-y border-[#E5E5E5] select-none">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden bg-[#161616] p-6 md:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#E5E5E5] shadow-sm min-h-[160px] md:min-h-[180px]">
            {/* Background cover (original saturation & color preserved, fully visible) */}
            <div className="absolute inset-0 bg-cover pointer-events-none"
              style={{
                backgroundImage: "url('https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg')",
                objectFit: "cover",
                backgroundPosition: "center right",
                filter: "brightness(1.05) contrast(1.05)"
              }}
            />
            {/* Subtle overlay gradient protecting text from left to right */}
            <div 
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background: "linear-gradient(90deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.18) 48%, rgba(0,0,0,0.05) 100%)"
              }}
            />
            
            <div className="relative z-20 text-center sm:text-left">
              <span className="text-[#FF0000] text-[10px] font-black uppercase tracking-widest block mb-1" style={{ color: "#FF0000" }}>
                SAVE MORE ON PREMIUM PC GAMES
              </span>
              <h3 className="text-xl md:text-2xl font-black text-[#FFFFFF] uppercase tracking-tight leading-snug" style={{ color: "#FFFFFF", textShadow: "0 2px 8px rgba(0,0,0,0.45)" }}>
                GREAT GAMES. <span className="text-[#FF0000]" style={{ color: "#FF0000" }}>BETTER PRICES.</span>
              </h3>
              <p className="text-[#FFFFFF] text-xs font-semibold mt-1" style={{ color: "#FFFFFF", textShadow: "0 2px 8px rgba(0,0,0,0.45)" }}>
                Get authentic keys delivered fast with 100% security.
              </p>
            </div>
            <button
              onClick={() => navigate("/offers")}
              className="bg-[#FF0000] hover:bg-[#CC0000] text-[#FFFFFF] text-xs font-black uppercase tracking-wider px-5 py-3 rounded-lg transition active:scale-[0.98] shrink-0 relative z-20 shadow-md shadow-[#FF0000]/10 border border-[#FF0000]"
            >
              Explore Deals
            </button>
          </div>
        </div>
      </section>
    );
  };

  // Curated Picks Recommendations
  const renderRecommendations = () => {
    if (recommendedGames.length === 0 || !hasHistory) return null;
    return (
      <section className="py-8 px-4 sm:px-6 bg-[#F8F8F8] border-t border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            eyebrow="Curated Picks" 
            title="Recommended" 
            accent="For You" 
            action="Browse Catalog"
            onAction={() => navigate("/games")}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {recommendedGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>
    );
  };

  // How CG39 Works
  const renderHowItWorks = () => (
    <section className="py-8 px-4 sm:px-6 bg-white border-b border-[#E5E5E5] select-none">
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="Simple Process" title="How CG39" accent="Works" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { step: "01", title: "CHOOSE YOUR GAME", desc: "Select your desired title from our PC game library" },
            { step: "02", title: "PLACE YOUR ORDER", desc: "Confirm price buckets, billing parameters and checkout" },
            { step: "03", title: "COMPLETE PAYMENT", desc: "Pay securely via UPI and enter transaction UTR details" },
            { step: "04", title: "GET YOUR DIGITAL ACCESS", desc: "Details are activated and shared directly with you" }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-3 bg-[#F8F8F8] border border-[#E5E5E5] p-4 rounded-xl items-start h-full">
              <span className="text-[#E10600] font-black text-sm tracking-wider">{item.step}</span>
              <div>
                <h4 className="font-bold text-xs text-[#111111] uppercase tracking-wider mb-0.5">{item.title}</h4>
                <p className="text-[10px] text-[#666666] leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Customer reviews
  const renderReviews = () => {
    if (reviews.length === 0) return null;
    return (
      <section className="py-8 px-4 sm:px-6 border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Customer Feedback" title="What Customers" accent="Say" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
            {reviews.slice(0, 4).map((rev, idx) => (
              <div 
                key={idx} 
                className="bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl p-4 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-xs uppercase text-[#111111] tracking-wide truncate max-w-[150px]">
                      {rev.profiles?.username || "Verified Gamer"}
                    </span>
                    <div className="flex text-yellow-500 gap-0.5 text-right shrink-0">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[#666666] text-xs leading-relaxed italic">"{rev.comment}"</p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-[#E5E5E5] flex items-center justify-between">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider truncate max-w-[150px]">{rev.verifiedGame}</span>
                  <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Verified Buyer</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Final CTA Conversion Section
  const renderFinalCTA = () => {
    return (
      <section className="py-12 px-4 sm:px-6 bg-[#F8F8F8] border-b border-[#E5E5E5] text-center select-none">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl md:text-2xl font-black uppercase text-[#1A1A1A] mb-2">
            Ready to Find Your <span className="text-[#E10600]">Next Game?</span>
          </h2>
          <p className="text-[#555555] text-xs md:text-sm mb-6 max-w-sm mx-auto">
            Browse hundreds of PC games at incredible prices.
          </p>
          <div className="flex gap-3 justify-center items-center">
            <button
              onClick={() => navigate("/games")}
              className="bg-[#E10600] hover:bg-[#ff1a13] text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.98] min-h-[40px] shadow-md shadow-[#E10600]/10"
            >
              Shop Games
            </button>
            <button
              onClick={() => navigate("/games?sortBy=discount")}
              className="bg-white hover:bg-[#F5F5F5] border border-[#E5E5E5] hover:border-[#D4D4D4] text-[#1A1A1A] font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.98] min-h-[40px]"
            >
              View Deals
            </button>
          </div>
        </div>
      </section>
    );
  };

  // Support Action Card
  const renderSupportCTA = () => (
    <section className="py-8 px-4 sm:px-6 bg-[#F8F8F8] border-b border-[#E5E5E5] text-center select-none">
      <div className="max-w-xl mx-auto">
        <span className="text-[#E10600] text-[10px] uppercase font-black tracking-widest block mb-1">Need Help?</span>
        <h2 className="text-xl md:text-2xl font-black uppercase text-[#111111] mb-2">
          We're Here to <span className="text-[#E10600]">Help</span>
        </h2>
        <p className="text-[#666666] text-xs mb-5 max-w-sm mx-auto">
          Get assistance with activation, payment verification or order queries. Our support team is online to assist you.
        </p>
        <div className="flex gap-3 justify-center items-center">
          <a
            href="https://wa.me/916379490178"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#E10600] hover:bg-[#C80500] text-white font-bold px-6 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md shadow-[#E10600]/10 h-11 min-h-[44px] min-w-[140px] active:scale-[0.98]"
          >
            <FaWhatsapp className="w-4 h-4" /> WhatsApp
          </a>
          <Link
            to="/dashboard"
            className="bg-white hover:bg-[#F5F5F5] border border-[#E5E5E5] text-[#555555] hover:text-[#111111] font-bold px-6 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 h-11 min-h-[44px] min-w-[140px] active:scale-[0.98]"
          >
            <TrendingUp className="w-4 h-4 text-[#E10600]" /> Order Tracking
          </Link>
        </div>
      </div>
    </section>
  );

  return (
    <div className="bg-white text-[#111111] overflow-x-hidden min-h-screen animate-page-section">
      
      {/* 1. HERO SPOTLIGHT CAROUSEL */}
      {renderPromoBanner()}
 
      {/* 2. QUICK CATEGORY NAVIGATION STRIP */}
      {renderDiscoveryRail()}

      {/* 3. COMPACT DEAL BANNER GRID */}
      {renderDealBanners()}
 
      {/* 4. BEST SELLING Games */}
      {renderBestSellingGames()}

      {/* 5. WHY SHOP WITH CG39 (TRUST SECTION) */}
      {renderTrustStrip()}
 
      {/* PRODUCT GRID LISTINGS & OTHER GAME SECTIONS */}
      {renderBestSellingDeals()}
      {renderTrendingNow()}
      {renderPriceDiscovery()}
      {renderCategories()}
 
      {hasHistory && <RecentlyViewed />}
      {hasHistory && renderRecommendations()}
 
      {/* PREMIUM DEALS */}
      {renderMidPromoBanner()}
 
      {/* HOW IT WORKS */}
      {renderHowItWorks()}
 
      {/* SUPPORT */}
      {renderSupportCTA()}
 
    </div>
  );
};

export default Home;
