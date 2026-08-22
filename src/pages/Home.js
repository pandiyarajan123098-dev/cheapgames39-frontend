import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Sword as Swords,
  Compass,
  Shield,
  Car,
  Ghost as Skull,
  Flame,
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
  Globe,
  Sparkle,
  CreditCard,
  Tag,
  Package,
  Brain,
  Cpu,
  Trophy,
  Target,
  Users,
  Handshake,
  Stairs,
  PuzzlePiece,
  Crown,
  Cube,
  EyeSlash,
  RocketLaunch,
  Hourglass,
  Smiley,
  DiceFive,
  Cards,
  Buildings,
  Sun,
  BookOpen,
  MusicNotes,
  Briefcase,
  Anchor,
  Key
} from "@phosphor-icons/react";
import RecentlyViewed from "../components/RecentlyViewed";
import { GameCard } from "../components/GameCard";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { FaWhatsapp, FaSteam, FaXbox, FaPlaystation, FaApple, FaBitcoin } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
import { 
  SiEpicgames, 
  SiUbisoft, 
  SiEa, 
  SiBattledotnet, 
  SiRockstargames, 
  SiGogdotcom 
} from "react-icons/si";

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

const proofImages = [
  "/proofs/proof1.jpg",
  "/proofs/proof2.jpg",
  "/proofs/proof3.jpg",
  "/proofs/proof4.jpg",
  "/proofs/proof5.jpg",
  "/proofs/proof6.jpg",
  "/proofs/proof7.jpg",
  "/proofs/proof8.jpg",
  "/proofs/proof9.jpg",
  "/proofs/proof10.jpg"
];

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
        eyebrow: "CG39 EXCLUSIVE",
        title: "LEVEL UP YOUR",
        titleRed: "LIBRARY",
        desc: "Premium PC games at incredible prices.",
        btn1Text: "Shop Games",
        btn1Link: "/games",
        btn2Text: "View Deals",
        btn2Link: "/offers",
        image: DEFAULT_BG_IMAGES[0]
      },
      {
        eyebrow: "WEEKEND DEALS",
        title: "BIG GAMES.",
        titleRed: "SMALL PRICES.",
        desc: "Discover amazing PC games at unbeatable prices.",
        btn1Text: "Explore Deals",
        btn1Link: "/offers",
        btn2Text: "Shop Games",
        btn2Link: "/games",
        image: DEFAULT_BG_IMAGES[1]
      },
      {
        eyebrow: "PC GAMING",
        title: "YOUR NEXT ADVENTURE",
        titleRed: "STARTS HERE",
        desc: "Explore action, RPG, open-world and more.",
        btn1Text: "Browse Games",
        btn1Link: "/games",
        btn2Text: "View Deals",
        btn2Link: "/offers",
        image: DEFAULT_BG_IMAGES[2]
      },
      {
        eyebrow: "BEST OFFERS",
        title: "EXPLORE NEW",
        titleRed: "WORLDS",
        desc: "Grab your favorite titles at rock-bottom prices.",
        btn1Text: "Browse All",
        btn1Link: "/games",
        btn2Text: "Offers",
        btn2Link: "/offers",
        image: DEFAULT_BG_IMAGES[3]
      },
      {
        eyebrow: "TOP SELLER",
        title: "CONQUER EVERY",
        titleRed: "CHALLENGE",
        desc: "Check out our best-selling action adventure games today.",
        btn1Text: "Shop Catalog",
        btn1Link: "/games",
        btn2Text: "Deals",
        btn2Link: "/offers",
        image: DEFAULT_BG_IMAGES[4]
      }
    ];

    if (games && games.length >= defaultSlides.length) {
      return defaultSlides.map((slide, idx) => {
        const game = games[idx];
        if (!game) return slide;
        return {
          ...slide,
          image: game.image_url || slide.image,
          desc: slide.desc
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

  // Fetch real reviews from the database for the featured games in a single batch request
  useEffect(() => {
    if (featuredGames.length === 0) return;
    const fetchFeaturedReviews = async () => {
      try {
        const gameIds = featuredGames.slice(0, 4).map(game => game.id).join(",");
        const res = await axios.get(`${API}/reviews/batch?gameIds=${gameIds}`);
        const allFetchedReviews = (res.data || []).map(r => {
          const game = featuredGames.find(g => g.id === r.game_id);
          return {
            ...r,
            verifiedGame: game ? game.title : "Featured Game"
          };
        });
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

  // Map category names to appropriate Phosphor icons
  const categoryIconMap = {
    "bundle": Package,
    "action": Swords,
    "adventure": Compass,
    "rpg": Shield,
    "strategy": Brain,
    "simulation": Cpu,
    "sports": Trophy,
    "racing": Car,
    "fps": Target,
    "tps": Target,
    "horror": Ghost,
    "open world": Map,
    "survival": Flame,
    "multiplayer": Users,
    "co-op": Handshake,
    "indie": Sparkle,
    "platformer": Stairs,
    "puzzle": PuzzlePiece,
    "fighting": Dumbbell,
    "battle royale": Crown,
    "sandbox": Cube,
    "stealth": EyeSlash,
    "sci-fi": RocketLaunch,
    "fantasy": Sparkle,
    "historical": Hourglass,
    "vr": Gamepad,
    "casual": Smiley,
    "anime": Star,
    "roguelike": DiceFive,
    "mmorpg": ShieldCheck,
    "card": Cards,
    "turn based": Hourglass,
    "city builder": Buildings,
    "military": Swords,
    "cyberpunk": Cpu,
    "western": Sun,
    "educational": BookOpen,
    "music": MusicNotes,
    "driving": Car,
    "management": Briefcase,
    "detective": Gamepad,
    "zombie": Skull,
    "space": Globe,
    "naval": Anchor,
    "hack and slash": Swords,
    "metroidvania": Key,
    "soulslike": Flame,
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

  // Premium Hero Carousel (High Contrast, White Main Heading & Controlled Gradient)
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
          className="relative rounded-[24px] overflow-hidden bg-[#0A0B0E] border border-[#222222] min-h-[340px] sm:min-h-[380px] md:min-h-[420px] flex items-center p-6 sm:p-10 md:p-14 shadow-xl outline-none focus-visible:ring-2 focus-visible:ring-[#E50909]"
          aria-label="Promotional Carousel"
        >
          {/* Prominent Right Character / Game Artwork (100% Natural Original Artwork) */}
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[62%] md:w-[58%] pointer-events-none overflow-hidden rounded-r-[24px]">
            {carouselSlides.map((item, idx) => {
              const isActive = idx === carouselIndex;
              const transitionClass = prefersReducedMotion 
                ? "" 
                : "transition-all duration-500 ease-in-out";
              return (
                <div
                  key={idx}
                  className={`absolute inset-0 ${transitionClass} ${isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-[1.02] z-0"}`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center sm:object-right"
                  />
                  {/* Controlled smooth dark gradient behind the left text - fades naturally toward the artwork */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(90deg, #0A0B0E 0%, rgba(10,11,14,0.95) 28%, rgba(10,11,14,0.60) 48%, rgba(10,11,14,0.15) 70%, transparent 100%)"
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Mobile Localized Gradient Protection */}
          <div 
            className="sm:hidden absolute inset-0 z-20 pointer-events-none" 
            style={{
              background: "linear-gradient(90deg, rgba(10,11,14,0.96) 0%, rgba(10,11,14,0.85) 55%, rgba(10,11,14,0.30) 80%, transparent 100%)"
            }}
          />

          {/* Left Content Area */}
          <div className="relative z-30 max-w-lg md:max-w-xl flex flex-col items-start gap-3 sm:gap-4 text-left">
            {/* Top Eyebrow */}
            <span className="inline-flex items-center gap-1.5 bg-[#0A0B0E]/70 backdrop-blur-sm border border-[#E50909]/30 text-[#E50909] text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-md">
              {slide.eyebrow}
            </span>

            <h1 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-black uppercase tracking-tight leading-[1.08]"
              style={{
                color: "#FFFFFF",
                textShadow: "0 2px 10px rgba(0,0,0,0.95)"
              }}
            >
              <span style={{ color: "#FFFFFF" }}>{slide.title}</span> <br className="hidden sm:inline" />{" "}
              <span style={{ color: "#E50909" }}>{slide.titleRed}</span>
            </h1>
            <p 
              className="font-medium text-xs sm:text-sm max-w-sm md:max-w-md leading-relaxed mb-1"
              style={{
                color: "#E4E4E7",
                textShadow: "0 1px 6px rgba(0,0,0,0.95)"
              }}
            >
              {slide.desc}
            </p>

            {/* CG39 CTA Buttons (Red Primary + White Secondary) */}
            <div className="flex flex-wrap gap-3 mt-1">
              <button
                onClick={() => navigate(slide.btn1Link)}
                className="bg-[#E50909] hover:bg-[#8B0000] text-xs md:text-sm font-black uppercase tracking-wider px-7 py-3.5 rounded-xl transition active:scale-[0.98] shadow-md shadow-[#E50909]/25 min-h-[44px]"
                style={{ color: "#FFFFFF" }}
              >
                <span style={{ color: "#FFFFFF" }}>{slide.btn1Text}</span>
              </button>
              {slide.btn2Text && (
                <button
                  onClick={() => navigate(slide.btn2Link)}
                  className="bg-white hover:bg-[#F2F2F2] text-xs md:text-sm font-black uppercase tracking-wider px-7 py-3.5 rounded-xl transition active:scale-[0.98] border border-[#E5E5E5] min-h-[44px] shadow-sm"
                  style={{ color: "#000000" }}
                >
                  <span style={{ color: "#000000" }}>{slide.btn2Text}</span>
                </button>
              )}
            </div>
          </div>

          {/* Previous / Next Arrow Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-3.5 z-40 hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-black/60 hover:bg-[#E50909] border border-white/20 hover:scale-105 active:scale-95 transition-all shadow-md"
            style={{ color: "#FFFFFF" }}
            aria-label="Previous slide"
          >
            <ArrowLeft className="w-4 h-4" weight="bold" style={{ color: "#FFFFFF" }} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3.5 z-40 hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-black/60 hover:bg-[#E50909] border border-white/20 hover:scale-105 active:scale-95 transition-all shadow-md"
            style={{ color: "#FFFFFF" }}
            aria-label="Next slide"
          >
            <ArrowRight className="w-4 h-4" weight="bold" style={{ color: "#FFFFFF" }} />
          </button>

          {/* Pagination Indicators (Active: CG39 Red, Inactive: Light Gray) */}
          <div className="absolute bottom-4 left-0 right-0 z-40 flex justify-center items-center gap-2">
            {carouselSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCarouselIndex(idx)}
                className={`rounded-full transition-all duration-300 ${
                  idx === carouselIndex 
                    ? "bg-[#E50909] w-6 h-2" 
                    : "bg-white/40 hover:bg-white/70 w-2 h-2"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Horizontal Circular Category & Platform Navigation Row (Monochrome & Real Data)
  const renderDiscoveryRail = () => {
    const navItems = [
      { label: "Steam", icon: FaSteam, path: "/games?platform=Steam" },
      { label: "Epic Games", icon: SiEpicgames, path: "/games?platform=Epic Games" },
      { label: "PlayStation", icon: FaPlaystation, path: "/games?platform=PlayStation" },
      { label: "Xbox", icon: FaXbox, path: "/games?platform=Xbox" },
      { label: "Nintendo", icon: BsNintendoSwitch, path: "/games?platform=Nintendo" },
      { label: "EA", icon: SiEa, path: "/games?platform=EA" },
      { label: "Ubisoft", icon: SiUbisoft, path: "/games?platform=Ubisoft" },
      { label: "Battle.net", icon: SiBattledotnet, path: "/games?platform=Battle.net" },
      { label: "Rockstar Games", icon: SiRockstargames, path: "/games?platform=Rockstar Games" },
      { label: "GOG", icon: SiGogdotcom, path: "/games?platform=GOG" },
    ];

    return (
      <div className="w-full bg-white py-5 select-none overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 pr-10 sm:px-6 flex items-center justify-start md:justify-center gap-2 sm:gap-4 md:gap-6">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                to={item.path}
                className="group flex flex-col items-center gap-2 shrink-0 transition text-center w-[72px] sm:w-[80px] md:w-24"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#FAFAFA] group-hover:bg-zinc-900 border border-[#E5E5E5] group-hover:border-zinc-900 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-[#222222] group-hover:text-white transition-colors" />
                </div>
                <span className="text-[10px] md:text-xs font-semibold text-[#222222] group-hover:text-[#111111] transition-colors whitespace-normal leading-tight text-center max-w-full">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  // Compact Promotional Deal Grid (High Contrast, Translucent Price Container & 100% Legibility)
  const renderDealBanners = () => {
    // Select top 6 games with highest discount or top featured deals from real database
    const promoGames = [...games]
      .filter(g => g.in_stock !== false)
      .sort((a, b) => {
        const discA = a.steam_price > a.price ? (a.steam_price - a.price) / a.steam_price : 0;
        const discB = b.steam_price > b.price ? (b.steam_price - b.price) / b.steam_price : 0;
        return discB - discA;
      })
      .slice(0, 6);

    if (promoGames.length === 0) return null;

    return (
      <section className="py-3 px-4 sm:px-6 max-w-7xl mx-auto w-full select-none mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 md:gap-5">
          {promoGames.map((game) => {
            const discountPct = game.steam_price > game.price 
              ? Math.round(((game.steam_price - game.price) / game.steam_price) * 100)
              : (game.discount_percent || 0);

            return (
              <div
                key={game.id}
                onClick={() => navigate(`/game/${game.id}`)}
                className="relative overflow-hidden rounded-[20px] bg-[#111318] border border-[#222530] hover:border-[#E50909] h-[135px] sm:h-[145px] md:h-[155px] flex flex-col justify-between p-4 md:p-5 cursor-pointer shadow-lg transition-all duration-300 hover:scale-[1.02] group"
              >
                {/* 100% Natural Game Artwork */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                  style={{ 
                    backgroundImage: `url('${game.image_url || DEFAULT_BG_IMAGES[0]}')`,
                  }}
                />

                {/* Localized Bottom/Left Gradient for 100% Text Readability */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.10) 70%, transparent 100%)"
                  }}
                />

                {/* Top-Right Arrow Action */}
                <div 
                  className="absolute top-3.5 right-3.5 z-20 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all shadow-md group-hover:bg-[#E50909] group-hover:border-[#E50909]"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.65)",
                    border: "1px solid rgba(255,255,255,0.70)",
                  }}
                >
                  <ArrowRight className="w-3.5 h-3.5" weight="bold" style={{ color: "#FFFFFF" }} />
                </div>

                {/* Top Game Title */}
                <div className="relative z-10 max-w-[72%] sm:max-w-[68%] pt-1">
                  <h3 
                    className="text-[#F5F1E8] text-xs sm:text-sm md:text-[15px] font-bold tracking-tight leading-snug truncate"
                    style={{ color: "#F5F1E8", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
                  >
                    {game.title}
                  </h3>
                </div>

                {/* Bottom Pricing & Discount Badge */}
                <div className="relative z-10 flex items-center gap-2.5">
                  {discountPct > 0 && (
                    <span 
                      className="bg-[#E50909] font-black text-xs md:text-sm px-2.5 py-1.5 rounded-lg shadow-md shrink-0"
                      style={{ color: "#FFFFFF" }}
                    >
                      -{discountPct}%
                    </span>
                  )}
                  {/* Subtle Translucent Dark Price Container */}
                  <div 
                    className="flex items-baseline gap-2 px-3 py-1.5 rounded-[10px] shadow-sm backdrop-blur-sm"
                    style={{
                      backgroundColor: "rgba(15,15,15,0.75)",
                      border: "1px solid rgba(255,255,255,0.25)",
                    }}
                  >
                    <span className="font-bold text-sm md:text-base drop-shadow" style={{ color: "#FFFFFF" }}>
                      ₹{game.price}
                    </span>
                    {game.steam_price > game.price && (
                      <span className="line-through text-xs drop-shadow" style={{ color: "#D9D9D9" }}>
                        ₹{game.steam_price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

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

  // 12. WHY SHOP WITH CG39 (Single Trust Section Before Footer)
  const renderTrustStrip = () => (
    <section className="py-10 md:py-12 px-4 sm:px-6 bg-[#F8F8F8] border-t border-[#E5E5E5] select-none">
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="Trust & Guarantee" title="Why Shop with" accent="CG39" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "SECURE PAYMENTS",       icon: ShieldCheck, desc: "UPI payments verified manually" },
            { label: "FAST DIGITAL DELIVERY", icon: Lightning,   desc: "Keys delivered after verification" },
            { label: "VERIFIED PROCESS",       icon: SealCheck,   desc: "Transparent ordering process" },
            { label: "CUSTOMER SUPPORT",       icon: Headset,     desc: "Quick assistance when you need it" }
          ].map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div 
                key={idx} 
                className="group flex flex-col items-start text-left p-4 sm:p-5 bg-white border border-[#E8E8E8] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:border-zinc-300 transition-all duration-200 ease-out min-h-[130px] sm:min-h-[145px] h-full"
              >
                <div className="w-11 h-11 rounded-xl bg-[#FAFAFA] border border-[#EEEEEE] flex items-center justify-center shrink-0 mb-3.5 transition-transform duration-200 ease-out group-hover:scale-[1.04]">
                  <IconComp size={22} className="text-[#111111] group-hover:text-[#E50909] shrink-0 transition-colors" />
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

  // Infinite scroll proof images slider
  const renderProofSlider = () => {
    // Duplicate the array to create a seamless infinite loop
    const doubleProofs = [...proofImages, ...proofImages];
    return (
      <section className="py-10 bg-white border-b border-[#E5E5E5] select-none overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
          <SectionHeader 
            eyebrow="Success Proofs" 
            title="Delivered &" 
            accent="Verified" 
          />
        </div>
        
        <div className="relative w-full overflow-hidden">
          {/* Left/Right fading gradients for premium aesthetic */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <div className="proof-marquee-container py-2">
            <div className="proof-marquee-track">
              {doubleProofs.map((src, idx) => (
                <div 
                  key={idx} 
                  className="w-[140px] sm:w-[170px] h-[250px] sm:h-[300px] mx-2 sm:mx-3 shrink-0 rounded-2xl overflow-hidden border border-[#E5E5E5] bg-white shadow-sm hover:border-[#E10600] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                >
                  <img 
                    src={src} 
                    alt={`Delivered order proof ${idx + 1}`} 
                    className="w-full h-full object-cover select-none pointer-events-none"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="bg-white text-[#111111] overflow-x-hidden min-h-screen animate-page-section">
      
      {/* 01. HEADER (Handled in App.js layout) */}

      {/* 02. HERO */}
      {renderPromoBanner()}
 
      {/* 03. PLATFORM / CATEGORY NAVIGATION */}
      {renderDiscoveryRail()}

      {/* 04. PROMOTIONAL SHOWCASE */}
      {renderDealBanners()}
 
      {/* 05. BEST SELLING GAMES */}
      {renderBestSellingGames()}

      {/* 06. HOW CG39 WORKS */}
      {renderHowItWorks()}
 
      {/* 07. TODAY'S DEALS */}
      {renderBestSellingDeals()}

      {/* 08. TRENDING NOW */}
      {renderTrendingNow()}

      {/* 09. SHOP BY BUDGET */}
      {renderPriceDiscovery()}

      {/* 10. BROWSE BY CATEGORY */}
      {renderCategories()}
 
      {/* 11. RECENTLY VIEWED */}
      {hasHistory && <RecentlyViewed />}
      {hasHistory && renderRecommendations()}

      {/* 12. WHY SHOP WITH CG39 */}
      {renderTrustStrip()}

      {/* CUSTOMER REVIEWS & SUPPORT */}
      {renderReviews()}
      {renderProofSlider()}
      {renderSupportCTA()}

      {/* 13. FOOTER (Handled in App.js layout) */}

    </div>
  );
};

export default Home;
