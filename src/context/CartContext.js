import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Helper to fetch latest games from DB to validate pricing/stale items
  const fetchLatestGamesMap = async (gameIds) => {
    try {
      if (gameIds && gameIds.length === 0) return {};
      let query = supabase
        .from("games")
        .select("id, title, price, steam_price, image_url");
      
      if (gameIds && gameIds.length > 0) {
        query = query.in("id", gameIds);
      }
      const { data, error } = await query;
      if (error) throw error;
      const map = {};
      data.forEach(g => {
        map[g.id] = g;
      });
      return map;
    } catch (err) {
      console.error("Error fetching latest games map:", err.message);
      return null;
    }
  };

  /* =====================================================
     ================= ABANDONED CART TRACKING ===========
  ===================================================== */
  const updateAbandonedCartTracking = useCallback((items) => {
    if (items.length === 0) {
      if (user) {
        localStorage.removeItem(`cg39_abandoned_cart_${user.id}`);
      } else {
        localStorage.removeItem("cg39_guest_abandoned_cart");
      }
      return;
    }

    const payload = {
      user_id: user ? user.id : "guest",
      items: items.map(i => ({
        game_id: i.games?.id || i.game_id,
        quantity: i.quantity,
        title: i.games?.title,
        price: i.games?.price
      })),
      last_updated: new Date().toISOString()
    };

    if (user) {
      localStorage.setItem(`cg39_abandoned_cart_${user.id}`, JSON.stringify(payload));
    } else {
      localStorage.setItem("cg39_guest_abandoned_cart", JSON.stringify(payload));
    }
  }, [user]);

  /* =====================================================
     ================= FETCH/SYNC CART ===================
  ===================================================== */

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);

      if (!user) {
        // Guest user: read from localStorage
        const localCartRaw = localStorage.getItem("cg39_guest_cart");
        let localCart = [];
        if (localCartRaw) {
          try {
            localCart = JSON.parse(localCartRaw);
          } catch (e) {
            localCart = [];
          }
        }

        const guestGameIds = localCart.map(item => item.game_id).filter(Boolean);
        const latestGames = await fetchLatestGamesMap(guestGameIds);

        // Refresh prices & filter out stale games
        if (latestGames) {
          localCart = localCart
            .map(item => {
              const liveGame = latestGames[item.game_id];
              if (!liveGame) return null; // Stale game
              return {
                ...item,
                games: liveGame // Always use DB details
              };
            })
            .filter(Boolean);
        }

        localStorage.setItem("cg39_guest_cart", JSON.stringify(localCart));
        setCart(localCart);
        setCartCount(localCart.reduce((sum, item) => sum + item.quantity, 0));
        updateAbandonedCartTracking(localCart);
        return;
      }

      // Authenticated user: Sync local guest cart first if exists
      const localCartRaw = localStorage.getItem("cg39_guest_cart");
      if (localCartRaw) {
        let localCart = [];
        try {
          localCart = JSON.parse(localCartRaw);
        } catch (e) {}

        if (localCart.length > 0) {
          for (const item of localCart) {
            // Check if already in user's DB cart
            const { data: existing } = await supabase
              .from("cart")
              .select("id, quantity")
              .eq("user_id", user.id)
              .eq("game_id", item.game_id)
              .maybeSingle();

            if (existing) {
              await supabase
                .from("cart")
                .update({ quantity: existing.quantity + item.quantity })
                .eq("id", existing.id);
            } else {
              await supabase.from("cart").insert({
                user_id: user.id,
                game_id: item.game_id,
                quantity: item.quantity,
              });
            }
          }
          // Clear guest cart
          localStorage.removeItem("cg39_guest_cart");
        }
      }

      // Fetch from Supabase
      const { data, error } = await supabase
        .from("cart")
        .select(`
          id,
          quantity,
          game_id,
          games (
            id,
            title,
            price,
            steam_price,
            image_url
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      let verifiedCart = data || [];

      // Filter out stale games & sync prices directly from joined details
      const staleItemIds = [];
      verifiedCart = verifiedCart
        .map(item => {
          if (!item.games) {
            staleItemIds.push(item.id);
            return null; // Stale/deleted game
          }
          return item;
        })
        .filter(Boolean);

      // Delete stale cart items from database in background
      if (staleItemIds.length > 0) {
        supabase.from("cart").delete().in("id", staleItemIds).then(() => {});
      }

      setCart(verifiedCart);
      setCartCount(verifiedCart.reduce((sum, item) => sum + item.quantity, 0));
      updateAbandonedCartTracking(verifiedCart);
    } catch (error) {
      console.error("Fetch cart error:", error.message);
    } finally {
      setLoading(false);
    }
  }, [user, updateAbandonedCartTracking]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "cg39_cart_sync" || e.key === "cg39_guest_cart") {
        fetchCart();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchCart]);

  /* =====================================================
     ================= ADD TO CART =======================
  ===================================================== */

  const addToCart = async (game_id, quantity = 1) => {
    if (!user) {
      // Guest Cart implementation
      const localCartRaw = localStorage.getItem("cg39_guest_cart");
      let localCart = [];
      if (localCartRaw) {
        try {
          localCart = JSON.parse(localCartRaw);
        } catch (e) {}
      }

      const existingIndex = localCart.findIndex(item => item.game_id === game_id);
      if (existingIndex > -1) {
        localCart[existingIndex].quantity += quantity;
      } else {
        // Fetch the game item locally or temporarily populate to refresh on render
        localCart.push({
          id: `guest-${Date.now()}-${Math.random()}`,
          game_id,
          quantity,
          games: null // Will be populated dynamically during fetchCart
        });
      }

      localStorage.setItem("cg39_guest_cart", JSON.stringify(localCart));
      localStorage.setItem("cg39_cart_sync", Date.now().toString());
      await fetchCart();
      return;
    }

    try {
      // Check if already exists in DB
      const { data: existing } = await supabase
        .from("cart")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("game_id", game_id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("cart")
          .update({ quantity: existing.quantity + quantity })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("cart").insert({
          user_id: user.id,
          game_id,
          quantity,
        });

        if (error) throw error;
      }

      localStorage.setItem("cg39_cart_sync", Date.now().toString());
      await fetchCart();
    } catch (error) {
      console.error("Add to cart error:", error.message);
      throw error;
    }
  };

  /* =====================================================
     ================= UPDATE ITEM =======================
  ===================================================== */

  const updateCartItem = async (cart_id, quantity) => {
    if (quantity < 1) {
      await removeFromCart(cart_id);
      return;
    }

    if (!user) {
      // Guest local update
      const localCartRaw = localStorage.getItem("cg39_guest_cart");
      if (localCartRaw) {
        let localCart = JSON.parse(localCartRaw);
        const idx = localCart.findIndex(item => item.id === cart_id);
        if (idx > -1) {
          localCart[idx].quantity = quantity;
          localStorage.setItem("cg39_guest_cart", JSON.stringify(localCart));
          localStorage.setItem("cg39_cart_sync", Date.now().toString());
          await fetchCart();
        }
      }
      return;
    }

    try {
      const { error } = await supabase
        .from("cart")
        .update({ quantity })
        .eq("id", cart_id);

      if (error) throw error;

      localStorage.setItem("cg39_cart_sync", Date.now().toString());
      await fetchCart();
    } catch (error) {
      console.error("Update cart error:", error.message);
      throw error;
    }
  };

  /* =====================================================
     ================= REMOVE ITEM =======================
  ===================================================== */

  const removeFromCart = async (cart_id) => {
    if (!user) {
      // Guest local remove
      const localCartRaw = localStorage.getItem("cg39_guest_cart");
      if (localCartRaw) {
        let localCart = JSON.parse(localCartRaw);
        localCart = localCart.filter(item => item.id !== cart_id);
        localStorage.setItem("cg39_guest_cart", JSON.stringify(localCart));
        localStorage.setItem("cg39_cart_sync", Date.now().toString());
        await fetchCart();
      }
      return;
    }

    try {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("id", cart_id);

      if (error) throw error;

      localStorage.setItem("cg39_cart_sync", Date.now().toString());
      await fetchCart();
    } catch (error) {
      console.error("Remove cart error:", error.message);
      throw error;
    }
  };

  /* =====================================================
     ================= CLEAR CART ========================
  ===================================================== */

  const clearCart = async () => {
    if (!user) {
      localStorage.removeItem("cg39_guest_cart");
      localStorage.setItem("cg39_cart_sync", Date.now().toString());
      setCart([]);
      setCartCount(0);
      updateAbandonedCartTracking([]);
      return;
    }

    try {
      await supabase
        .from("cart")
        .delete()
        .eq("user_id", user.id);

      localStorage.setItem("cg39_cart_sync", Date.now().toString());
      setCart([]);
      setCartCount(0);
      updateAbandonedCartTracking([]);
    } catch (error) {
      console.error("Clear cart error:", error.message);
    }
  };

  /* =====================================================
     ================= REMOVE ITEMS BY GAME IDS ===========
  ===================================================== */

  const removeItemsByGameIds = async (gameIds) => {
    if (!gameIds || !Array.isArray(gameIds) || gameIds.length === 0) return;

    if (!user) {
      const localCartRaw = localStorage.getItem("cg39_guest_cart");
      if (localCartRaw) {
        let localCart = JSON.parse(localCartRaw);
        localCart = localCart.filter(item => !gameIds.includes(item.game_id));
        localStorage.setItem("cg39_guest_cart", JSON.stringify(localCart));
        localStorage.setItem("cg39_cart_sync", Date.now().toString());
        await fetchCart();
      }
      return;
    }

    try {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", user.id)
        .in("game_id", gameIds);

      if (error) throw error;

      localStorage.setItem("cg39_cart_sync", Date.now().toString());
      await fetchCart();
    } catch (error) {
      console.error("Remove game items from cart error:", error.message);
    }
  };

  /* =====================================================
     ================= CALCULATIONS ======================
  ===================================================== */

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.games?.price || 0) * item.quantity,
    0
  );

  const totalSteamValue = cart.reduce(
    (sum, item) =>
      sum + (item.games?.steam_price || 0) * item.quantity,
    0
  );

  const totalSavings = totalSteamValue - subtotal;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        subtotal,
        totalSteamValue,
        totalSavings,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        removeItemsByGameIds,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
