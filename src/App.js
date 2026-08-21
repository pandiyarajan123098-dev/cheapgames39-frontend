import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';
import OfflineIndicator from './components/OfflineIndicator';
import ReactGA from 'react-ga4';
import ScrollToTop from './components/ScrollToTop';
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
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import FAQ from './pages/FAQ';
import ProtectedRoute from './components/ProtectedRoute';
import OrderStatus from './pages/OrderStatus';
import Giveaway from './pages/Giveaway';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

function AnalyticsTracker() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);
  return null;
}

// P7: AdminRoute uses ProtectedRoute to handle auth loading state properly
function AdminRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  const isAdmin = user?.email?.toLowerCase() === 'pandiyarajan007123@gmail.com' || user?.user_metadata?.role === 'admin';
  return isAdmin
    ? <Admin />
    : <Navigate to="/" />;
}

function MainLayout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  // Auth pages supply their own AuthLayout — suppress the storefront chrome
  const isAuthRoute = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
  ].includes(location.pathname);
  const hideSiteChrome = isAdminRoute || isAuthRoute;
  return (
    <div className="App min-h-screen bg-white text-[#111111]">
      {!hideSiteChrome && <Header />}
      {children}
      {!hideSiteChrome && <Footer />}
    </div>
  );
}

/**
 * SafeRoute — wraps each route in its own inline ErrorBoundary.
 * When a single page crashes, only that page content is replaced
 * with a compact recovery card. Header and Footer stay visible.
 */
function SafeRoute({ label, children }) {
  return (
    <ErrorBoundary label={label}>
      {children}
    </ErrorBoundary>
  );
}

function App() {
  return (
    // Outer boundary uses fullPage=true — only fires if the LAYOUT itself crashes
    <ErrorBoundary fullPage>
      <BrowserRouter>
        <ScrollToTop />
        <AnalyticsTracker />
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <MainLayout>
                <Toaster
                  position="top-right"
                  theme="dark"
                  closeButton
                  duration={1800}
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
                  <Route path="/" element={<SafeRoute label="Unable to load home"><Home /></SafeRoute>} />
                  <Route path="/games" element={<SafeRoute label="Unable to load games"><Games /></SafeRoute>} />
                  <Route path="/games/:id" element={<SafeRoute label="Unable to load game"><GameDetails /></SafeRoute>} />
                  <Route path="/game/:id" element={<SafeRoute label="Unable to load game"><GameDetails /></SafeRoute>} />
                  <Route path="/cart" element={<SafeRoute label="Unable to load cart"><Cart /></SafeRoute>} />
                  <Route path="/checkout" element={<SafeRoute label="Unable to load checkout"><Checkout /></SafeRoute>} />
                  <Route
                    path="/success"
                    element={
                      <ProtectedRoute>
                        <SafeRoute label="Unable to load order confirmation"><Success /></SafeRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<SafeRoute label="Unable to load login"><Login /></SafeRoute>} />
                  <Route path="/signup" element={<SafeRoute label="Unable to load signup"><Signup /></SafeRoute>} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <SafeRoute label="Unable to load dashboard"><Dashboard /></SafeRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-status"
                    element={
                      <ProtectedRoute>
                        <SafeRoute label="Unable to load order status"><OrderStatus /></SafeRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/wishlist" element={<SafeRoute label="Unable to load wishlist"><Wishlist /></SafeRoute>} />
                  <Route path="/offers" element={<SafeRoute label="Unable to load offers"><Offers /></SafeRoute>} />
                  <Route path="/contact" element={<SafeRoute label="Unable to load contact"><Contact /></SafeRoute>} />
                  <Route path="/admin" element={<AdminRoute />} />
                  <Route path="/privacy" element={<SafeRoute label="Unable to load page"><Privacy /></SafeRoute>} />
                  <Route path="/terms" element={<SafeRoute label="Unable to load page"><Terms /></SafeRoute>} />
                  <Route path="/faq" element={<SafeRoute label="Unable to load FAQ"><FAQ /></SafeRoute>} />
                  <Route path="/giveaway" element={<SafeRoute label="Unable to load giveaway"><Giveaway /></SafeRoute>} />
                  <Route path="/forgot-password" element={<SafeRoute label="Unable to load page"><ForgotPassword /></SafeRoute>} />
                  <Route path="/reset-password" element={<SafeRoute label="Unable to load page"><ResetPassword /></SafeRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainLayout>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
