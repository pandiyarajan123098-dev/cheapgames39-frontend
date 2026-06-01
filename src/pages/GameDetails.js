import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Heart, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import publicReviews from "../data/publicReviews";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const { addToCart } = useCart();

  const [game, setGame] = useState(null);
  
 
  const [relatedGames, setRelatedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [myReview, setMyReview] = useState("");
 
  const [inWishlist, setInWishlist] = useState(false);

  /* ================= FETCH GAME ================= */

  const fetchGame = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/games/${id}`);
      setGame(res.data);
    } catch {
      toast.error("Game not found");
      navigate("/games");
    }
  }, [id, navigate]);


  const fetchRelatedGames = useCallback(async () => {
  if (!game?.category_id) return;

  try {
    const res = await axios.get(`${API}/games`);

    const filtered = (res.data || [])
      .filter(
        (g) =>
          g.category_id === game.category_id &&
          g.id !== game.id
      )
      .slice(0, 4);

    setRelatedGames(filtered);
  } catch (err) {
    console.error(err);
  }
}, [game]);
  
  const checkWishlist = useCallback(async () => {
    if (!user || !accessToken) return;

    try {
      const res = await axios.get(`${API}/wishlist`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const exists = res.data.some(
        (item) => String(item.game_id) === String(id)
      );

      setInWishlist(exists);
    } catch (err) {
      console.error(err);
    }
  }, [user, accessToken, id]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
     await Promise.all([
  fetchGame(),
  checkWishlist()
]);
      setLoading(false);
    };
    load();
  }, [fetchGame, checkWishlist]);

 /* ================= RECENTLY VIEWED ================= */

useEffect(() => {
  console.log("Game Data:", game);
  if (!game?.id) return;

  const recent =
    JSON.parse(localStorage.getItem("recentGames")) || [];

  const updated = [
    {
      id: String(game.id),
      title: game.title,
      image: game.image_url,
    },
    ...recent.filter(
      (g) => String(g.id) !== String(game.id)
    ),
  ].slice(0, 20);

  localStorage.setItem(
    "recentGames",
    JSON.stringify(updated)
  );
}, [game]);


/* ================= RELATED GAMES ================= */

useEffect(() => {
  if (game) {
    fetchRelatedGames();
  }
}, [game, fetchRelatedGames]);


useEffect(() => {
  if (!user) return;

  const savedReview = localStorage.getItem(
    `myReview_${user.id}_${id}`
  );

  if (savedReview) {
    setMyReview(savedReview);
  } else {
    setMyReview("");
  }
}, [id, user]);



  /* ================= AUTO DISCOUNT ================= */

  const steamPrice =
    typeof game?.steam_price === "number" ? game.steam_price : 0;

  const salePrice =
    typeof game?.price === "number" ? game.price : 0;

  let discountPercentage = 0;

  if (steamPrice > salePrice && steamPrice > 0) {
    discountPercentage = Math.round(
      ((steamPrice - salePrice) / steamPrice) * 100
    );
  }

  const savings =
    discountPercentage > 0 ? steamPrice - salePrice : 0;

  /* ================= ADD TO CART ================= */

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      await addToCart(game.id);
      toast.success("Added to cart");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  /* ================= TOGGLE WISHLIST ================= */

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      setWishlistLoading(true);

      if (inWishlist) {
        await axios.delete(`${API}/wishlist/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await axios.post(
          `${API}/wishlist/${id}`,
          {},
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Wishlist action failed");
    } finally {
      setWishlistLoading(false);
    }
  };

  /* ================= SUBMIT REVIEW ================= */

 const handleSubmitReview = (e) => {
  e.preventDefault();

  if (!user) {
    toast.error("Login required");
    navigate("/login");
    return;
  }

localStorage.setItem(
  `myReview_${user.id}_${id}`,
  comment
);

  setMyReview(comment);

  toast.success("Review Saved");

  setComment("");
};


  if (loading || !game) {
    
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white animate-pulse">
      <div className="h-[32vh] bg-[#1a1a1a]" />

      <div className="container mx-auto px-6 mt-8">
        <div className="grid lg:grid-cols-3 gap-12">

          <div className="h-[500px] bg-[#1a1a1a] rounded-2xl"></div>

          <div className="lg:col-span-2">
            <div className="h-12 bg-[#1a1a1a] rounded w-2/3 mb-6"></div>

            <div className="h-6 bg-[#1a1a1a] rounded w-1/4 mb-8"></div>

            <div className="h-4 bg-[#1a1a1a] rounded mb-3"></div>
            <div className="h-4 bg-[#1a1a1a] rounded mb-3"></div>
            <div className="h-4 bg-[#1a1a1a] rounded w-3/4 mb-8"></div>

            <div className="h-12 bg-[#1a1a1a] rounded w-40 mb-8"></div>

            <div className="h-14 bg-[#1a1a1a] rounded w-56"></div>
          </div>

        </div>
      </div>
    </div>
  );
}

const startIndex =
  id
    .split("")
    .reduce(
      (sum, char) => sum + char.charCodeAt(0),
      0
    ) %
  publicReviews.length;

const rotatedReviews = [
  ...publicReviews,
  ...publicReviews,
].slice(startIndex, startIndex + 5);

const reviewCount =
  8 +
  (
    id
      .split("")
      .reduce(
        (sum, char) => sum + char.charCodeAt(0),
        0
      ) % 46
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pb-20">

      {/* HERO */}
      <div className="relative h-[32vh] overflow-hidden">
        <img
          src={game.image_url}
          alt={game.title}
          className="w-full h-full object-cover blur-md scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black" />
      </div>

      <div className="container mx-auto px-6 mt-8 relative z-10">

        {/* TOP SECTION */}
        <div className="grid lg:grid-cols-3 gap-12">

          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <img
              src={game.image_url}
              alt={game.title}
              className="w-full rounded-2xl shadow-2xl border border-white/10"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">

            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-5xl font-bold uppercase">{game.title}</h1>
                <p className="text-[#B50000] uppercase mt-3">
                  {game.categories?.name}
                </p>
              </div>

              <button onClick={handleToggleWishlist} disabled={wishlistLoading}>
                <Heart
                  className={`w-8 h-8 ${
                    inWishlist
                      ? "fill-[#B50000] text-[#B50000]"
                      : "text-gray-400"
                  }`}
                />
              </button>
            </div>

            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              {game.description}
            </p>

            {/* PRICE SECTION */}
            <div className="mb-8">

              {discountPercentage > 0 && (
                <div className="flex items-center gap-4 mb-2">
                  <span className="bg-[#B50000] text-white px-3 py-1 rounded text-sm font-bold">
                    -{discountPercentage}%
                  </span>
                  <span className="text-gray-400 line-through text-xl">
                    ₹{steamPrice}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-6">
                <span className="text-5xl font-bold">
                  ₹{salePrice}
                </span>

                {discountPercentage > 0 && (
                  <span className="text-green-400 text-lg">
                    You save ₹{savings}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-[#B50000] hover:bg-red-600 text-white rounded-full px-10 py-4 font-bold flex items-center gap-3 transition"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>

          </motion.div>
        </div>


{/* STEAM GUIDE */}
        <div className="mt-24 bg-[#111] border border-white/10 rounded-2xl p-10 shadow-xl">
          <h2 className="text-4xl font-bold mb-10">
            Steam Account Activation Guide
          </h2>

          <ul className="space-y-4 text-gray-300 text-lg">
            <li className="flex items-center gap-2">
              <ArrowRight size={16} /> Install Steam on your PC
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight size={16} /> Login using provided credentials
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight size={16} /> Download the game from Library
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight size={16} /> Switch Steam to Offline Mode
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight size={16} /> Launch and enjoy the game
            </li>
          </ul>
        </div>

      </div>

     {/* RELATED GAMES */}
<div className="mt-24 px-4">
  <h2 className="text-4xl font-bold mb-8">
    Related <span className="text-[#B50000]">Games</span>
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {relatedGames.map((related) => (
      <div
        key={related.id}
        onClick={() => navigate(`/games/${related.id}`)}
        className="cursor-pointer bg-[#141414] rounded-xl overflow-hidden border border-white/10 hover:border-[#B50000] transition h-[260px] flex flex-col"
      >
        {/* Image */}
        <div className="h-36 overflow-hidden">
          <img
            src={related.image_url}
            alt={related.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-1">
          <h3 className="text-white text-sm font-semibold line-clamp-2 min-h-[42px]">
            {related.title}
          </h3>

          <p className="text-[#B50000] font-bold mt-auto">
            ₹{related.price}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

        {/* REVIEWS (Stars removed visually only) */}
       <div className="mt-24 px-4">
      <h2 className="text-4xl font-bold mb-8">
  Customer{" "}
  <span className="text-[#B50000]">
    Reviews
  </span>

  <span className="text-gray-400 text-2xl ml-2">
    ({reviewCount})
  </span>
</h2>

          {user && (
            <form
              onSubmit={handleSubmitReview}
              className="
bg-[#1a1a1a]
border border-white/10
rounded-xl
p-6
mb-6
min-h-[140px]
hover:border-[#B50000]
transition
"
            >
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={4}
                placeholder="Write your review..."
                className="w-full bg-[#141414] border border-white/10 rounded-lg p-3 text-white mb-4"
              />

              <button
                type="submit"
                disabled={reviewLoading}
                className="bg-[#B50000] px-6 py-2 rounded-full font-bold flex items-center gap-2"
              >
                Submit Review
                <ArrowRight size={16} />
              </button>
            </form>
          )}

        {rotatedReviews.map((review, index) => (
<div
  key={index}
  className="
bg-[#1a1a1a]
border
border-white/10
rounded-xl
p-6
mb-6
min-h-[140px]
w-full
shadow-lg
"

>
    <h4 className="font-semibold mb-2">
      {review.name}
    </h4>

    <p className="text-green-400 text-sm mb-2">
  ✓ Verified Purchase
</p>

    <p className="text-gray-300">
      {review.comment}
    </p>
  </div>
))}

{myReview && (
  <div className="mt-10">
    <h3 className="text-2xl font-bold mb-4">
      My Review
    </h3>

    <div className="
bg-[#141414]
border
border-[#B50000]
rounded-xl
p-6
min-h-[140px]
w-full
shadow-lg
">

      <p>{myReview}</p>
    </div>
  </div>
)}
        </div>

        
    </div>
  );
};

export default GameDetails;