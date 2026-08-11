import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Tag,
  Gamepad2,
  ArrowRight,
  ChevronRight,
  BadgePercent,
  SlidersHorizontal,
  TrendingDown,
  PackageOpen,
  AlertCircle,
  Home,
} from "lucide-react";
import { GameCard } from "../components/GameCard";
import { Breadcrumbs } from "../components/Breadcrumbs";

const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`;

/* ─── Skeleton ───────────────────────────────────────────────────── */
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-white/5 rounded-2xl ${className}`} />
);

const CardSkeleton = () => (
  <div className="bg-[#111111] border border-white/8 rounded-2xl overflow-hidden animate-pulse">
    <div className="aspect-[16/10] bg-white/5" />
    <div className="p-4 flex flex-col gap-2">
      <div className="h-2.5 bg-white/5 rounded w-1/3" />
      <div className="h-4 bg-white/5 rounded w-3/4" />
      <div className="h-4 bg-white/5 rounded w-1/2" />
      <div className="h-10 bg-white/5 rounded mt-2" />
    </div>
  </div>
);

/* ─── Section heading ────────────────────────────────────────────── */
const SectionHeading = ({ eyebrow, title, accent, sub, action, onAction }) => (
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
    <div>
      {eyebrow && (
        <span className="text-[#E00000] text-xs uppercase font-black tracking-widest block mb-1.5">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
        {title}
        {accent && <span className="text-[#E00000]"> {accent}</span>}
      </h2>
      {sub && <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{sub}</p>}
    </div>
    {action && (
      <button
        onClick={onAction}
        className="flex items-center gap-1.5 text-xs font-black text-[#555555] hover:text-[#111111] uppercase tracking-wider transition shrink-0"
      >
        {action} <ArrowRight className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

/* ─── Sort options ───────────────────────────────────────────────── */
const SORT_OPTIONS = [
  { id: "discount", label: "Highest Discount" },
  { id: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", label: "Price: High to Low" },
];

const sortGames = (games, sort) => {
  const g = [...games];
  if (sort === "discount") {
    return g.sort((a, b) => {
      const da = a.steam_price > 0 ? (a.steam_price - a.price) / a.steam_price : 0;
      const db = b.steam_price > 0 ? (b.steam_price - b.price) / b.steam_price : 0;
      return db - da;
    });
  }
  if (sort === "price_asc") return g.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") return g.sort((a, b) => b.price - a.price);
  return g;
};

/* ─── Main component ─────────────────────────────────────────────── */
const Offers = () => {
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sort, setSort] = useState("discount");

  /* ── Fetch ── */
  const fetchData = useCallback(async () => {
    try {
      setError(false);
      setLoading(true);
      const [gamesRes, catsRes] = await Promise.all([
        axios.get(`${API}/games`),
        axios.get(`${API}/categories`),
      ]);
      setGames(gamesRes.data || []);
      setCategories(catsRes.data || []);
    } catch (err) {
      console.error("Offers load error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Derived data ── */
  const inStock = useMemo(
    () => games.filter((g) => g.in_stock !== false),
    [games]
  );

  // Games with real discount only
  const discountedGames = useMemo(
    () => inStock.filter((g) => g.steam_price > 0 && g.steam_price > g.price),
    [inStock]
  );

  // Best discounts: top 4 by % off
  const bestDiscounts = useMemo(() => {
    return [...discountedGames]
      .sort((a, b) => {
        const da = (a.steam_price - a.price) / a.steam_price;
        const db = (b.steam_price - b.price) / b.steam_price;
        return db - da;
      })
      .slice(0, 4);
  }, [discountedGames]);

  // AAA Deals: steam_price >= 1500 with a real discount
  const aaaDeals = useMemo(
    () =>
      discountedGames
        .filter((g) => g.steam_price >= 1500)
        .sort((a, b) => b.steam_price - a.steam_price)
        .slice(0, 4),
    [discountedGames]
  );

  // Budget picks: price <= 99 (discounted or not)
  const budgetPicks = useMemo(
    () =>
      inStock
        .filter((g) => g.price <= 99)
        .sort((a, b) => a.price - b.price)
        .slice(0, 4),
    [inStock]
  );

  // All deals sorted
  const allDeals = useMemo(
    () => sortGames(discountedGames, sort),
    [discountedGames, sort]
  );

  // Price buckets (only show if games exist)
  const priceBuckets = useMemo(() => {
    const buckets = [];
    if (inStock.some((g) => g.price <= 49))
      buckets.push({ label: "Under ₹49", max: 49, desc: "Budget-friendly picks" });
    if (inStock.some((g) => g.price <= 99))
      buckets.push({ label: "Under ₹99", max: 99, desc: "More games to explore" });
    if (inStock.some((g) => g.price <= 199))
      buckets.push({ label: "Under ₹199", max: 199, desc: "Premium catalog" });
    if (inStock.some((g) => g.steam_price >= 1500))
      buckets.push({ label: "AAA Deals", max: "aaa", desc: "Top-tier blockbusters" });
    return buckets;
  }, [inStock]);

  // Categories with at least 1 in-stock game
  const activeCategories = useMemo(
    () =>
      categories
        .filter((cat) => inStock.some((g) => g.category_id === cat.id))
        .slice(0, 6),
    [categories, inStock]
  );

  /* ── Error state ── */
  if (error) {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-14 h-14 rounded-full bg-red-500/8 border border-red-500/15 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-black uppercase tracking-tight text-white mb-1">
            Deals Are Currently Unavailable
          </h2>
          <p className="text-xs text-zinc-500">Unable to load offers. Please try again.</p>
        </div>
        <button
          onClick={fetchData}
          className="bg-[#E00000] hover:bg-[#F00000] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition min-h-[44px]"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans pt-[76px] md:pt-[82px] pb-20 animate-page-section">

      {/* ── BREADCRUMB ── */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-10">
        <Breadcrumbs paths={[{ label: "Offers" }]} />
      </div>

      {/* ── HERO ── */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-14">
        <div className="bg-[#111111] border border-white/8 rounded-2xl px-8 py-12 sm:px-14 sm:py-16 relative overflow-hidden">
          {/* Subtle red glow accent — not neon, just depth */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#E00000]/4 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-[#E00000]/3 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-[#E00000]/8 border border-[#E00000]/15 text-[#E00000] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg mb-5 select-none">
              <BadgePercent className="w-3.5 h-3.5" />
              Current Deals
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-none mb-4">
              Game <span className="text-[#E00000]">Deals</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-8 max-w-md">
              Discover great PC games at prices worth checking out.
              All discounts calculated from real Steam prices.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/games")}
                className="flex items-center gap-2 bg-[#E00000] hover:bg-[#F00000] text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.98] min-h-[44px]"
              >
                <Gamepad2 className="w-4 h-4 shrink-0" />
                Browse All Games
              </button>
              <button
                onClick={() => navigate("/games")}
                className="flex items-center gap-2 border border-[#E5E5E5] hover:border-[#D4D4D4] text-[#555555] hover:text-[#111111] hover:bg-[#F5F5F5] font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.98] min-h-[44px]"
              >
                View Categories
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>

          {/* Stats strip */}
          {!loading && discountedGames.length > 0 && (
            <div className="relative z-10 mt-10 pt-7 border-t border-white/8 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-sm sm:max-w-none">
              {[
                { label: "Games on Sale", value: discountedGames.length },
                { label: "Budget Picks", value: budgetPicks.length },
                ...(aaaDeals.length > 0 ? [{ label: "AAA Deals", value: aaaDeals.length }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="select-none">
                  <span className="text-2xl font-black text-white block leading-none">{value}</span>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-1 block">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PRICE FILTER BUCKETS ── */}
      {!loading && priceBuckets.length > 0 && (
        <section className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-14">
          <SectionHeading
            eyebrow="Find Your Price"
            title="Shop by"
            accent="Budget"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {priceBuckets.map((bucket) => (
              <button
                key={bucket.label}
                onClick={() => {
                  if (bucket.max === "aaa") navigate("/games?minSteamPrice=1500");
                  else navigate(`/games?maxPrice=${bucket.max}`);
                }}
                className="group bg-[#111111] border border-white/8 hover:border-[#E00000]/30 transition-all duration-200 rounded-2xl p-5 flex flex-col gap-2 text-left cursor-pointer hover:-translate-y-0.5 min-h-[80px]"
              >
                <div className="text-base font-black text-white group-hover:text-[#E00000] transition-colors uppercase tracking-tight">
                  {bucket.label}
                </div>
                <p className="text-zinc-500 text-xs leading-normal flex-1">{bucket.desc}</p>
                <span className="flex items-center gap-1 text-[10px] font-black text-[#E00000] uppercase tracking-wider mt-1 select-none">
                  Browse <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
      {loading && (
        <section className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-14">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[0,1,2,3].map(i => <Skeleton key={i} className="h-24" />)}
          </div>
        </section>
      )}

      {/* ── BEST DISCOUNTS ── */}
      {loading && (
        <section className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-14 border-b border-white/5 pb-14">
          <div className="h-8 bg-white/5 rounded w-48 mb-8 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[0,1,2,3].map(i => <CardSkeleton key={i} />)}
          </div>
        </section>
      )}
      {!loading && bestDiscounts.length > 0 && (
        <section className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-14 border-b border-white/5 pb-14">
          <SectionHeading
            eyebrow="Best Value"
            title="Best"
            accent="Discounts"
            sub="The biggest price reductions currently available."
            action="View All"
            onAction={() => navigate("/games")}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {bestDiscounts.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* ── AAA DEALS (only if steam_price >= 1500 games exist with real discount) ── */}
      {!loading && aaaDeals.length > 0 && (
        <section className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-14 border-b border-white/5 pb-14">
          <SectionHeading
            eyebrow="Premium Titles"
            title="AAA"
            accent="Deals"
            sub="Top-tier games at reduced prices."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {aaaDeals.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* ── BUDGET PICKS ── */}
      {!loading && budgetPicks.length > 0 && (
        <section className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-14 border-b border-white/5 pb-14">
          <SectionHeading
            eyebrow="Value Gaming"
            title="Play More,"
            accent="Spend Less"
            sub="Quality games under ₹99."
            action="All Budget Games"
            onAction={() => navigate("/games?maxPrice=99")}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {budgetPicks.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* ── CATEGORY DISCOVERY ── */}
      {!loading && activeCategories.length > 0 && (
        <section className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-14">
          <SectionHeading
            eyebrow="Browse by Genre"
            title="Game"
            accent="Categories"
          />
          <div className="flex flex-wrap gap-2">
            {activeCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/games?category=${cat.id}`)}
                className="flex items-center gap-2 bg-white border border-[#E5E5E5] hover:border-[#E00000]/30 text-[#555555] hover:text-[#111111] rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition min-h-[44px]"
              >
                {cat.name}
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-[#E00000] transition" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── ALL DEALS ── */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-14">
        {/* Heading + Sort */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="text-[#E00000] text-xs uppercase font-black tracking-widest block mb-1.5">
              Complete List
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              All <span className="text-[#E00000]">Deals</span>
              {!loading && discountedGames.length > 0 && (
                <span className="text-zinc-600 text-lg ml-2 font-bold normal-case tracking-normal">
                  ({discountedGames.length})
                </span>
              )}
            </h2>
          </div>

          {!loading && allDeals.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-zinc-600" />
              <div className="flex gap-1 bg-[#111111] border border-white/8 rounded-xl p-1">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSort(opt.id)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition whitespace-nowrap ${
                      sort === opt.id
                        ? "bg-[#E00000] text-white"
                        : "text-[#777777] hover:text-[#111111]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {[0,1,2,3,4,5,6,7].map(i => <CardSkeleton key={i} />)}
          </div>
        )}

        {/* Games grid */}
        {!loading && allDeals.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {allDeals.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && allDeals.length === 0 && (
          <div className="bg-[#111111] border border-white/8 rounded-2xl p-14 text-center flex flex-col items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-white/4 border border-white/8 flex items-center justify-center">
              <PackageOpen className="w-7 h-7 text-zinc-600" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-tight text-white mb-1">
                No Active Deals
              </h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                Check back later for new offers. Browse the full catalog for available games.
              </p>
            </div>
            <button
              onClick={() => navigate("/games")}
              className="flex items-center gap-2 bg-[#E00000] hover:bg-[#F00000] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition min-h-[44px]"
            >
              Browse All Games <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* ── FINAL CTA ── */}
      {!loading && (
        <section className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="bg-[#111111] border border-white/8 rounded-2xl px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white mb-1">
                Didn't Find What You're Looking For?
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Explore the complete game collection and find your next title.
              </p>
            </div>
            <button
              onClick={() => navigate("/games")}
              className="flex items-center gap-2 bg-[#E00000] hover:bg-[#F00000] text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.98] min-h-[44px] shrink-0"
            >
              Browse All Games <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </section>
      )}

    </div>
  );
};

export default Offers;