import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';
import OfflineIndicator from './components/OfflineIndicator';
import './App.css';

import Home from './pages/Home';
import Games from './pages/Games';
import GameDetails from './pages/GameDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Wishlist from './pages/Wishlist';
import Offers from './pages/Offers';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import ProtectedRoute from "./components/ProtectedRoute";
import OrderStatus from "./pages/OrderStatus";
import Giveaway from "./pages/Giveaway";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import { useAuth } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname,
    });
  }, [location]);

  return null;
}

// P7: AdminRoute uses ProtectedRoute to handle auth loading state properly
function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" />;

  return user?.email === "pandiyarajan007123@gmail.com"
    ? <Admin />
    : <Navigate to="/" />;
}

function MainLayout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="App min-h-screen bg-white text-[#111111]">
      {!isAdminRoute && <Header />}
      {children}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnalyticsTracker />
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <ErrorBoundary>
              <MainLayout>
                <Toaster
                  position="top-right"
                  theme="light"
                  richColors
                  closeButton
                  duration={3000}
                  gap={10}
                  offset={20}
                  visibleToasts={4}
                  toastOptions={{
                    style: {
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                      padding: '14px 16px',
                      maxWidth: '380px',
                    },
                    className: 'cg39-toast',
                  }}
                />
                <OfflineIndicator />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/games" element={<Games />} />
                  <Route path="/games/:id" element={<GameDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  {/* P5: Checkout handles authentication dynamically */}
                  <Route path="/checkout" element={<Checkout />} />
                  <Route
                    path="/success"
                    element={
                      <ProtectedRoute>
                        <Success />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  {/* P6: Dashboard requires authentication */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  {/* P7: Order status requires authentication (order ownership checked on backend) */}
                  <Route
                    path="/order-status"
                    element={
                      <ProtectedRoute>
                        <OrderStatus />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/offers" element={<Offers />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/admin" element={<AdminRoute />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/giveaway" element={<Giveaway />} />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                  />
                  <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainLayout>
            </ErrorBoundary>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
