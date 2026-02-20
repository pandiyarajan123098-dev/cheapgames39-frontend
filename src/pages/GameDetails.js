import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Heart, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const { addToCart } = useCart();

  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [comment, setComment] = useState("");
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

  const fetchReviews = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/reviews/${id}`);
      setReviews(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

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
      await Promise.all([fetchGame(), fetchReviews(), checkWishlist()]);
      setLoading(false);
    };
    load();
  }, [fetchGame, fetchReviews, checkWishlist]);

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

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Login required");
      navigate("/login");
      return;
    }

    try {
      setReviewLoading(true);

      await axios.post(
        `${API}/reviews`,
        { game_id: id, rating: 5, comment }, // keep backend structure
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      toast.success("Review submitted");
      setComment("");
      fetchReviews();
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading || !game) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading game details...
      </div>
    );
  }

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

        {/* REVIEWS (Stars removed visually only) */}
        <div className="mt-24">
          <h2 className="text-4xl font-bold mb-8">
            Customer <span className="text-[#B50000]">Reviews</span>
          </h2>

          {user && (
            <form
              onSubmit={handleSubmitReview}
              className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 mb-10"
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

          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 mb-6"
            >
              <h4 className="font-semibold mb-2">
                {review.users?.full_name || "Anonymous"}
              </h4>

              <p className="text-gray-300">{review.comment}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
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
    </div>
  );
};

export default GameDetails;