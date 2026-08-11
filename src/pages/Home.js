import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Swords,
  Compass,
  Shield,
  Car,
  Skull,
  Flame,
  Gamepad,
  Zap,
  ShieldCheck,
  BadgeCheck,
  MessageCircle,
  LayoutDashboard,
  Heart,
  ShoppingCart,
  Star,
  Gift,
  ArrowRight,
  TrendingUp,
  Gamepad2,
  PackageOpen
} from "lucide-react";
import RecentlyViewed from "../components/RecentlyViewed";
import { GameCard } from "../components/GameCard";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

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
    const recent = JSON.parse(localStorage.getItem(storageKey)) || [];
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
    const recent = JSON.parse(localStorage.getItem(storageKey)) || [];
    return recent.length > 0;
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
    "open world": Compass,
    "rpg": Shield,
    "racing": Car,
    "horror": Skull,
    "survival": Flame,
    "fighting": Swords,
    "steam": Gift,
    "pc": Gamepad,
  };

  const getCategoryIcon = (name) => {
    const key = name.toLowerCase();
    for (const [pattern, icon] of Object.entries(categoryIconMap)) {
      if (key.includes(pattern)) return icon;
    }
    return Gamepad;
  };

  // Compact Horizontal Hero Promotional Banner
  const renderPromoBanner = () => {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#0d0d0d] via-[#1f0d0d] to-black border border-[#E5E5E5] min-h-[190px] md:min-h-[240px] flex items-center p-6 md:p-10 shadow-md">
          {/* Dark/red graphic backdrop element */}
          <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 bg-cover bg-center opacity-25 md:opacity-60 pointer-events-none" 
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop')",
              maskImage: "linear-gradient(to right, transparent, black)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black)"
            }} 
          />
          {/* Left Promo Text */}
          <div className="relative z-10 max-w-xl flex flex-col items-start gap-1 sm:gap-2">
            <span className="text-[#E10600] text-[9px] md:text-xs font-black uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded">
              CG39 DEALS
            </span>
            <h1 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight select-none">
              BIG GAMES. <br className="hidden sm:inline" /> SMALL PRICES.
            </h1>
            <p className="text-zinc-400 text-[11px] md:text-xs max-w-xs font-medium leading-relaxed mb-1 select-none">
              Premium PC games at prices you'll actually love.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/games")}
                className="bg-[#E10600] hover:bg-[#ff1a13] text-white text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-lg transition active:scale-[0.98]"
              >
                Shop Games
              </button>
              <button
                onClick={() => navigate("/games?sortBy=discount")}
                className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-lg transition active:scale-[0.98] border border-white/10"
              >
                View Deals
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Horizontal Quick Categories discovery rail
  const renderDiscoveryRail = () => {
    if (categories.length === 0) return null;
    return (
      <div className="w-full bg-white border-b border-[#E5E5E5] py-2 overflow-x-auto scrollbar-none select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <Link
            to="/games"
            className="flex items-center gap-2 bg-[#F5F5F5] border border-[#E5E5E5] hover:bg-[#EEEEEE] text-[#111111] px-3.5 py-1.5 rounded-xl transition shrink-0 whitespace-nowrap"
          >
            <Gamepad className="w-3.5 h-3.5 text-[#E10600]" />
            <span>All Games</span>
          </Link>
          {categories.map((cat) => {
            const IconComponent = getCategoryIcon(cat.name);
            return (
              <Link
                key={cat.id}
                to={`/games?category=${cat.id}`}
                className="flex items-center gap-2 bg-[#F5F5F5] border border-[#E5E5E5] hover:bg-[#EEEEEE] text-[#555555] hover:text-[#111111] px-3.5 py-1.5 rounded-xl transition shrink-0 whitespace-nowrap"
              >
                <IconComponent className="w-3.5 h-3.5 text-[#777777]" />
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  // Trust Strip Section
  const renderTrustStrip = () => (
    <section className="py-4 px-4 sm:px-6 bg-white border-b border-[#E5E5E5] select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        {[
          { label: "SECURE PAYMENTS",     icon: ShieldCheck,   desc: "UPI payments verified manually" },
          { label: "FAST DIGITAL DELIVERY", icon: Zap,          desc: "Keys sent directly after review" },
          { label: "WHATSAPP SUPPORT",     icon: MessageCircle, desc: "Quick responses for orders" },
          { label: "GREAT GAME PRICES",     icon: BadgeCheck,    desc: "100% active digital catalog" }
        ].map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3 bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl p-3 text-left">
              <IconComp className="w-4.5 h-4.5 text-[#E10600] shrink-0" />
              <div>
                <span className="text-[10px] font-black text-[#111111] uppercase tracking-wider block">{item.label}</span>
                <span className="text-[9px] text-[#666666] leading-tight block mt-0.5">{item.desc}</span>
              </div>
            </div>
          );
        })}
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
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-950 to-red-950 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#E5E5E5] shadow-sm min-h-[180px] md:min-h-[220px]">
            <div className="text-center sm:text-left">
              <span className="text-[#E10600] text-[10px] font-black uppercase tracking-widest block mb-1">SAVE MORE ON PREMIUM PC GAMES</span>
              <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">Great games. Better prices.</h3>
              <p className="text-zinc-400 text-xs mt-1">Get authentic keys delivered fast with 100% security.</p>
            </div>
            <button
              onClick={() => navigate("/offers")}
              className="bg-[#E10600] hover:bg-[#ff1a13] text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-lg transition active:scale-[0.98] shrink-0"
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
            className="bg-[#E10600] hover:bg-[#ff1a13] text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md shadow-[#E10600]/10 min-h-[40px]"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
          <Link
            to="/dashboard"
            className="bg-white hover:bg-[#F5F5F5] border border-[#E5E5E5] text-[#555555] hover:text-[#111111] font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 min-h-[40px]"
          >
            <TrendingUp className="w-4 h-4 text-[#E10600]" /> Order Tracking
          </Link>
        </div>
      </div>
    </section>
  );

  return (
    <div className="bg-white text-[#111111] overflow-x-hidden min-h-screen animate-page-section">
      
      {/* 1. HERO SPOTLIGHT SLIDER (COMPACT MARKETING BANNER) */}
      {renderPromoBanner()}

      {/* 2. QUICK CATEGORY NAVIGATION */}
      {renderDiscoveryRail()}

      {/* 3. TRUST STRIP */}
      {renderTrustStrip()}

      {/* PRODUCT GRID LISTINGS */}
      {renderBestSellingGames()}
      {renderBestSellingDeals()}
      {renderMidPromoBanner()}
      {renderTrendingNow()}
      {renderPriceDiscovery()}
      {renderCategories()}

      {hasHistory && <RecentlyViewed />}
      {hasHistory && renderRecommendations()}

      {/* HOW IT WORKS */}
      {renderHowItWorks()}

      {/* FINAL CTA */}
      {renderFinalCTA()}

      {/* TESTIMONIALS */}
      {renderReviews()}

      {/* SUPPORT */}
      {renderSupportCTA()}

    </div>
  );
};

export default Home;
