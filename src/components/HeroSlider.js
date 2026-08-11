import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
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

  const handleAddToCart = async (e, gameId, gameTitle) => {
    e.stopPropagation();
    if (!user) {
      notify.loginRequiredCart();
      navigate("/login");
      return;
    }
    try {
      await addToCart(gameId);
      notify.addedToCart(gameTitle);
    } catch {
      notify.actionFailed('add to cart');
    }
  };

  if (spotlightSlides.length === 0) {
    return (
      <div className="w-full h-[340px] md:h-[480px] bg-[#0d0d0d] animate-pulse rounded-3xl" />
    );
  }

  const getSlideDesc = (title) => {
    const key = title.toLowerCase();
    if (key.includes("resident evil")) return "Survive the horror. Get premium PC games at better prices.";
    if (key.includes("grand theft auto")) return "Los Santos awaits. Dominate the city in full campaign mode.";
    if (key.includes("red dead")) return "Outlaws for life. Experience the masterpiece western epic.";
    if (key.includes("cyberpunk")) return "Night city never sleeps. Hack your way through the futuristic streets.";
    if (key.includes("elden ring")) return "Rise, Tarnished. Unleash your powers in the Lands Between.";
    if (key.includes("forza")) return "Race without limits. Drive across beautiful open world environments.";
    return "Get premium PC games with fast digital activation credentials.";
  };

  return (
    <div className="w-full px-4 md:px-6 pt-6 pb-2">
      <div className="relative w-full max-w-7xl mx-auto rounded-3xl overflow-hidden border border-white/8 bg-[#080808] shadow-2xl">
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
            const { game, tagline } = slide;
            const discount = game.steam_price > game.price ? Math.round(((game.steam_price - game.price) / game.steam_price) * 100) : 0;
            return (
              <SwiperSlide key={game.id}>
                <div 
                  onClick={() => navigate(`/games/${game.id}`)}
                  className="relative w-full h-[340px] md:h-[480px] flex items-end cursor-pointer group select-none overflow-hidden"
                >
                  {/* Cinematic Background Image */}
                  <div className="absolute inset-0 bg-black/40 z-10" />
                  <img
                    src={game.image_url}
                    alt={game.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.01] transition duration-500 ease-out"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  {/* Precise Gradient Overlay to optimize readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent md:bg-gradient-to-r md:from-[#080808] md:via-[#080808]/20 md:to-transparent z-20" />
 
                  {/* Slide Content Overlay */}
                  <div className="cg39-hero-slide relative z-30 w-full p-6 md:p-12 md:max-w-2xl flex flex-col items-start gap-2 text-left mb-6 md:mb-0">
                    <span className="text-[#E10600] text-[10px] md:text-xs font-bold tracking-widest uppercase">
                      {tagline}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white leading-none">
                      {game.title}
                    </h2>
                    
                    {/* Short Value Proposition */}
                    <p className="text-gray-300 text-xs md:text-sm max-w-md mt-1 mb-2 hidden sm:block leading-relaxed">
                      {getSlideDesc(game.title)}
                    </p>

                    {/* Price Block */}
                    <div className="flex items-center gap-3 mt-1 mb-3 md:mb-4 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                      <span className="text-base md:text-xl font-bold text-white">₹{game.price}</span>
                      {game.steam_price > game.price && (
                        <>
                          <span className="text-gray-500 line-through text-xs">₹{game.steam_price}</span>
                          <span className="text-green-400 font-extrabold text-[10px] tracking-wider">
                            -{discount}% OFF
                          </span>
                        </>
                      )}
                    </div>
 
                    {/* CTA Actions */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={(e) => handleAddToCart(e, game.id, game.title)}
                        className="bg-[#E10600] hover:bg-[#ff1a13] active:scale-[0.98] text-white font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-[#E10600]/10"
                      >
                        <ShoppingCart className="w-4 h-4" /> Buy Now
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/games/${game.id}`);
                        }}
                        className="bg-transparent border border-white/10 hover:border-white hover:bg-white/5 active:scale-[0.98] text-white font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider transition flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" /> View Details
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