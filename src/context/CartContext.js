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

  /* =====================================================
     ================= FETCH CART ========================
  ===================================================== */

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      setCartCount(0);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("cart")
        .select(`
          id,
          quantity,
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

      setCart(data || []);
      setCartCount(
        (data || []).reduce((sum, item) => sum + item.quantity, 0)
      );
    } catch (error) {
      console.error("Fetch cart error:", error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /* =====================================================
     ================= ADD TO CART =======================
  ===================================================== */

  const addToCart = async (game_id, quantity = 1) => {
    if (!user) throw new Error("Please login first");

    try {
      // Check if already exists
      const { data: existing } = await supabase
        .from("cart")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("game_id", game_id)
        .single();

      if (existing) {
        // Update quantity instead of duplicate insert
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

    try {
      const { error } = await supabase
        .from("cart")
        .update({ quantity })
        .eq("id", cart_id);

      if (error) throw error;

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
    try {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("id", cart_id);

      if (error) throw error;

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
    if (!user) return;

    try {
      await supabase
        .from("cart")
        .delete()
        .eq("user_id", user.id);

      setCart([]);
      setCartCount(0);
    } catch (error) {
      console.error("Clear cart error:", error.message);
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
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);