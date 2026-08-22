import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Eye } from "@phosphor-icons/react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { notify } from "../utils/notify";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const FEATURED_TITLES = [
  { key: "resident evil 4", tagline: "SURVIVE THE HORROR" },
  { key: "grand theft auto v", tagline: "LOS SANTOS AWAITS" },
  { key: "red dead redemption 2", tagline: "OUTLAWS FOR LIFE" },
  { key: "cyberpunk 2077", tagline: "NIGHT CITY NEVER SLEEPS" },
  { key: "elden ring", tagline: "RISE, TARNISHED" },
  { key: "forza horizon 5", tagline: "RACE WITHOUT LIMITS" }
];

const getBgPosition = (title) => {
  const name = title.toLowerCase();
  if (name.includes("resident evil")) return "center right";
  if (name.includes("forza")) return "center right";
  if (name.includes("red dead")) return "center right";
  if (name.includes("cyberpunk")) return "center center";
  return "center center";
};

export default function HeroSlider({ games }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const spotlightSlides = useMemo(() => {
    if (!games || games.length === 0) return [];
    
    const matched = [];
    FEATURED_TITLES.forEach(target => {
      const match = games.find(g => g.title.toLowerCase().includes(target.key) && g.in_stock !== false);
      if (match) {
        matched.push({
          game: match,
          tagline: target.tagline
        });
      }
    });

    // Fallback to highest discounted games if matches are few
    if (matched.length < 3) {
      const remaining = games
        .filter(g => g.in_stock !== false && !matched.some(m => m.game.id === g.id))
        .map(g => {
          const discount = g.steam_price > g.price ? Math.round(((g.steam_price - g.price) / g.steam_price) * 100) : 0;
          return { game: g, discount };
        })
        .sort((a, b) => b.discount - a.discount)
        .slice(0, 4 - matched.length);

      remaining.forEach(item => {
        matched.push({
          game: item.game,
          tagline: "BEST DEAL GUARANTEED"
        });
      });
    }

    return matched;
  }, [games]);

  const handleAddToCart = async (e, game) => {
    e.stopPropagation();
    if (!user) {
      notify.loginRequiredCart();
      navigate("/login");
      return;
    }
    try {
      await addToCart(game.id, 1, game);
      notify.addedToCart(game.title, game.image_url);
    } catch {
      notify.actionFailed('add to cart');
    }
  };

  if (spotlightSlides.length === 0) {
    return (
      <div className="w-full px-4 md:px-6 pt-6 pb-2">
        <div className="relative w-full h-[230px] md:h-[400px] bg-[#0d0d0d] animate-pulse rounded-[20px]" />
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-6 pt-6 pb-2">
      <div className="relative w-full max-w-7xl mx-auto rounded-[20px] overflow-hidden border border-white/8 bg-[#080808] shadow-2xl">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          grabCursor={true}
          centeredSlides={true}
          speed={600}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet !bg-gray-600 !w-2 !h-2 !opacity-50 transition-all duration-300",
            bulletActiveClass: "!bg-[#E10600] !w-5 !opacity-100 !rounded-full"
          }}
          loop={spotlightSlides.length > 1}
          className="hero-swiper"
        >
          {spotlightSlides.map((slide, index) => {
            const { game } = slide;
            const isEven = index % 2 === 0;

            const label = isEven ? "CG39 DEALS" : "SAVE MORE ON PREMIUM PC GAMES";
            const description = isEven 
              ? "Premium PC games at prices you'll actually love." 
              : "Get authentic keys delivered fast with 100% security.";

            return (
              <SwiperSlide key={game.id}>
                <div 
                  onClick={() => navigate(`/games/${game.id}`)}
                  className="relative w-full h-[230px] md:h-[400px] flex items-center md:items-end cursor-pointer group select-none overflow-hidden"
                >
                  {/* Media-responsive directional gradient overlay */}
                  <div className="cg39-hero-overlay" />

                  <img
                    src={game.image_url}
                    alt={game.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.01] transition duration-500 ease-out"
                    style={{ objectPosition: getBgPosition(game.title) }}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
 
                  {/* Slide Content Overlay */}
                  <div className="cg39-hero-slide relative z-30 w-full p-6 md:p-12 md:max-w-2xl flex flex-col items-start gap-2 text-left">
                    
                    {/* DEAL LABEL */}
                    <span className="inline-block px-2.5 py-1 rounded-[6px] text-[9px] md:text-[10px] font-bold uppercase tracking-wider bg-[#E10600]/10 border border-[#E10600]/20 text-[#E10600] mb-0.5">
                      {label}
                    </span>

                    {/* HERO HEADING */}
                    <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-white leading-tight">
                      {isEven ? (
                        <>
                          BIG GAMES. <br className="sm:hidden" />
                          <span className="text-[#E10600]">SMALL PRICES.</span>
                        </>
                      ) : (
                        <>
                          GREAT GAMES. <br className="sm:hidden" />
                          <span className="text-[#E10600]">BETTER PRICES.</span>
                        </>
                      )}
                    </h2>
                    
                    {/* DESCRIPTION */}
                    <p className="text-white/90 text-[10px] md:text-sm font-semibold max-w-sm md:max-w-md leading-relaxed mt-0.5 mb-1.5">
                      {description}
                    </p>
 
                    {/* CTA Actions */}
                    <div className="flex items-center gap-2.5 mt-1.5 w-full sm:w-auto">
                      <button
                        onClick={(e) => handleAddToCart(e, game)}
                        className="h-11 px-5 rounded-xl bg-[#E10600] hover:bg-[#c40000] active:scale-[0.98] text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 shrink-0"
                        style={{ color: "#FFFFFF" }}
                      >
                        <ShoppingCart className="w-4 h-4" style={{ color: "#FFFFFF" }} /> <span style={{ color: "#FFFFFF" }}>SHOP GAMES</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/games/${game.id}`);
                        }}
                        className="h-11 px-5 rounded-xl bg-white hover:bg-gray-50 active:scale-[0.98] text-[#222222] text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 border border-gray-200 shrink-0"
                      >
                        <Eye className="w-4 h-4" /> VIEW DEALS
                      </button>
                    </div>

                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}