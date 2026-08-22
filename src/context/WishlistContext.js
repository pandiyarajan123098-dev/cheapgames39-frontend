import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const WishlistContext = createContext();
const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`;

export const WishlistProvider = ({ children }) => {
  const { user, accessToken } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user || !accessToken) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`${API}/wishlist`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setWishlist(res.data || []);
    } catch (err) {
      console.error("Fetch wishlist error:", err);
    } finally {
      setLoading(false);
    }
  }, [user, accessToken]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "cg39_wishlist_sync") {
        fetchWishlist();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchWishlist]);

  const toggleWishlist = async (gameId) => {
    if (!user || !accessToken) {
      toast.error("Please login first");
      return false;
    }
    const exists = wishlist.some((item) => String(item.game_id) === String(gameId));
    
    // OPTIMISTIC UPDATE: Update state immediately for instant feedback
    if (exists) {
      setWishlist((prev) => prev.filter((item) => String(item.game_id) !== String(gameId)));
      toast.success("Removed from wishlist");
    } else {
      setWishlist((prev) => [...prev, { game_id: gameId, id: `temp-${Date.now()}` }]);
      toast.success("Added to wishlist");
    }
    localStorage.setItem("cg39_wishlist_sync", Date.now().toString());

    try {
      if (exists) {
        await axios.delete(`${API}/wishlist/${gameId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        return false;
      } else {
        await axios.post(
          `${API}/wishlist/${gameId}`,
          {},
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        // Sync in background without re-triggering loading spinners
        const res = await axios.get(`${API}/wishlist`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setWishlist(res.data || []);
        return true;
      }
    } catch (err) {
      console.error("Toggle wishlist error:", err);
      // Rollback optimistic update on failure
      fetchWishlist();
      toast.error("Wishlist action failed");
      return exists;
    }
  };

  const isGameInWishlist = (gameId) => {
    return wishlist.some((item) => String(item.game_id) === String(gameId));
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        loading,
        toggleWishlist,
        isGameInWishlist,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
