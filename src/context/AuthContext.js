import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= INITIAL SESSION =================

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Session fetch error:", error.message);
      }

      if (mounted) {
        const currentSession = data?.session ?? null;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setAccessToken(currentSession?.access_token ?? null);
        setLoading(false);
      }
    };

    initializeAuth();

    // ================= AUTH STATE LISTENER =================

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setAccessToken(newSession?.access_token ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ================= SIGNUP =================

  const signup = async (email, password, full_name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
      },
    });

    if (error) {
      console.error("Signup error:", error.message);
      throw error;
    }

    return data;
  };

  // ================= LOGIN =================

  const login = async (email, password) => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      console.error("Login error:", error.message);
      throw error;
    }

    return data;
  };

  // ================= LOGOUT =================

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      throw error;
    }

    setUser(null);
    setSession(null);
    setAccessToken(null);
  };

  // ================= CONTEXT VALUE =================

  const value = useMemo(
    () => ({
      user,
      session,
      accessToken,
      loading,
      signup,
      login,
      logout,
    }),
    [user, session, accessToken, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ================= CUSTOM HOOK =================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};