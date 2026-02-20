import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Wishlist = () => {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH WISHLIST =================
  const fetchWishlist = useCallback(async () => {
    if (!user || !accessToken) return;

    try {
      setLoading(true);

      const res = await axios.get(`${API}/wishlist`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setWishlist(res.data || []);
    } catch (error) {
      console.error("Wishlist fetch error:", error);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, [user, accessToken]);

  // ================= INITIAL LOAD =================
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchWishlist();
  }, [user, fetchWishlist, navigate]);

  // ================= REMOVE =================
  const handleRemove = async (gameId) => {
    try {
      await axios.delete(`${API}/wishlist/${gameId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setWishlist((prev) =>
        prev.filter((item) => item.games.id !== gameId)
      );

      toast.success("Removed from wishlist");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item");
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading wishlist...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-24 pb-20 px-6 text-white">
      <div className="container mx-auto max-w-7xl">

        <h1 className="text-4xl md:text-5xl font-bold uppercase mb-10">
          My <span className="text-[#B50000]">Wishlist</span>
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-6">
              Your wishlist is empty
            </p>

            <button
              onClick={() => navigate("/games")}
              className="bg-[#B50000] hover:bg-red-600 px-8 py-3 rounded-full font-bold transition"
            >
              Browse Games
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">

            {wishlist.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-[#1a1a1a] rounded-xl border border-white/5 hover:border-[#B50000]/50 transition overflow-hidden"
              >
                {/* IMAGE */}
                <div
                  className="h-48 cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/games/${item.games.id}`)}
                >
                  <img
                    src={item.games.image_url}
                    alt={item.games.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>

                {/* DETAILS */}
                <div className="p-4">
                  <h3 className="font-semibold text-base mb-2 line-clamp-1">
                    {item.games.title}
                  </h3>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">
                      ₹{item.games.price}
                    </span>

                    <button
                      onClick={() => handleRemove(item.games.id)}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;