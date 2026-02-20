import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toaster } from 'sonner';
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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="App min-h-screen bg-[#0f0f0f] text-white">
            <Toaster position="top-right" theme="dark" />
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/:id" element={<GameDetails />} />
             <Route
  path="/cart"
  element={
    <ProtectedRoute>
      <Cart />
    </ProtectedRoute>
  }
/>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/success" element={<Success />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
      
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/privacy" element={<Privacy />} />
<Route path="/terms" element={<Terms />} />
<Route path="/faq" element={<FAQ />} />
<Route path="/order-status" element={<OrderStatus />} />
            </Routes>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
