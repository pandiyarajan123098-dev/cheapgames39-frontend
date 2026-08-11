import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  ShoppingBag, 
  Gamepad, 
  Award, 
  Users, 
  DollarSign, 
  RefreshCw, 
  Star, 
  Tag, 
  Sparkles, 
  Settings,
  Bell,
  Search,
  Eye,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  Clock,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`;

const Admin = () => {
  const { user, accessToken, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, products, orders, reviews, users, coupons, homepage, settings
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  
  // Lists States
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Loadings
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Modals / Details Drawers
  const [showGameModal, setShowGameModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDrawer, setShowOrderDrawer] = useState(false);

  // Forms states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    steam_price: '',
    price: '',
    category_id: '',
    image_url: '',
    is_new: false,
    is_bundle: false,
    in_stock: true,
    display_order: "",
  });

  // Stats Card state
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, users: 0, rating: 4.8 });

  // Orders Filters & Search
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL"); // ALL, PENDING_PAYMENT, SUBMITTED, PAID, PROCESSING, DELIVERED, CANCELLED
  const [orderSort, setOrderSort] = useState("newest"); // newest, oldest, highest_value, lowest_value

  // Admin notes input temp state
  const [tempNotes, setTempNotes] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("WhatsApp");
  const [deliveryDetails, setDeliveryDetails] = useState("");

  // Verify Admin email check
  useEffect(() => {
    const ADMIN_EMAIL = "pandiyarajan007123@gmail.com";
    if (!user) {
      navigate("/");
      return;
    }
    if (user.email !== ADMIN_EMAIL) {
      toast.error("Access Denied");
      navigate("/");
      return;
    }

    fetchGames();
    fetchCategories();
    fetchStats();
    fetchOrders();
    fetchAdminReviews();
  }, [user, navigate]);

  /* ================= FETCH DATA API ================= */
  const fetchGames = async () => {
    try {
      const res = await axios.get(`${API}/games`);
      setGames(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/categories`);
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await axios.get(`${API}/admin/orders`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchAdminReviews = async () => {
    try {
      setLoadingReviews(true);
      const res = await axios.get(`${API}/admin/reviews`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setReviews(res.data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  /* ================= ORDERS ACTIONS ================= */
  const handleUpdateOrderField = async (orderId, payload) => {
    try {
      const res = await axios.put(`${API}/admin/orders/${orderId}`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast.success("Order updated successfully");
      
      // Update selectedOrder details inside drawer to match DB changes
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({
          ...prev,
          ...res.data
        }));
      }

      fetchOrders();
      fetchStats();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to update order");
    }
  };

  const handleVerifyPayment = (orderId) => {
    if (!window.confirm("Verify UTR and mark this payment as PAID?")) return;
    handleUpdateOrderField(orderId, { payment_status: "paid" });
  };

  const handleRejectPayment = (orderId) => {
    if (!window.confirm("Reject payment verification? Status will revert to Pending Payment.")) return;
    handleUpdateOrderField(orderId, { payment_status: "failed" });
  };

  const handleSaveDeliveryDetails = (orderId) => {
    handleUpdateOrderField(orderId, { 
      delivery_method: deliveryMethod, 
      delivery_details: deliveryDetails,
      status: "delivered" 
    });
  };

  const handleSaveAdminNotes = (orderId) => {
    handleUpdateOrderField(orderId, { admin_notes: tempNotes });
  };

  const handleCancelOrder = (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    handleUpdateOrderField(orderId, { status: "cancelled" });
  };

  /* ================= GAMES ACTIONS ================= */
  const handleSubmitGame = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        steam_price: parseFloat(formData.steam_price),
        price: parseFloat(formData.price),
        category_id: formData.category_id,
        image_url: formData.image_url,
        is_new: formData.is_new,
        is_bundle: formData.is_bundle,
        in_stock: formData.in_stock,
        display_order: parseInt(formData.display_order) || 0,
      };

      if (editingGame) {
        await axios.put(`${API}/games/${editingGame.id}`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        toast.success('Game updated successfully!');
      } else {
        await axios.post(`${API}/games`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        toast.success('Game added successfully!');
      }
      setShowGameModal(false);
      setEditingGame(null);
      fetchGames();
      fetchStats();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save game");
    }
  };

  const handleEditGame = (game) => {
    setEditingGame(game);
    setFormData({
      title: game.title,
      description: game.description,
      steam_price: game.steam_price?.toString() || "",
      price: game.price.toString(),
      category_id: game.category_id.toString(),
      image_url: game.image_url,
      display_order: game.display_order?.toString() || "",
      is_new: game.is_new ?? false,
      is_bundle: game.is_bundle ?? false,
      in_stock: game.in_stock ?? true
    });
    setShowGameModal(true);
  };

  const handleDeleteGame = async (id) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;
    try {
      await axios.delete(`${API}/games/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast.success('Game deleted!');
      fetchGames();
      fetchStats();
    } catch (error) {
      toast.error('Failed to delete game');
    }
  };

  /* ================= REVIEWS ACTIONS ================= */
  const handleUpdateReviewStatus = async (reviewId, status) => {
    try {
      await axios.put(`${API}/admin/reviews/${reviewId}/status`, { status }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast.success(`Review marked as ${status}`);
      fetchAdminReviews();
    } catch (err) {
      toast.error("Failed to update review status");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(`${API}/admin/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast.success("Review deleted successfully");
      fetchAdminReviews();
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  /* ================= COMPUTED STATISTICS ================= */
  const calculatedStats = useMemo(() => {
    const today = new Date().toDateString();
    
    const todayOrdersList = orders.filter(o => new Date(o.created_at).toDateString() === today);
    const todayOrdersCount = todayOrdersList.length;

    // Awaiting UTR Verification: Order status is submitted or payment status is submitted
    const awaitingVerificationCount = orders.filter(o => 
      o.status === 'submitted' || o.payment_status === 'submitted'
    ).length;

    const processingCount = orders.filter(o => o.status === 'processing').length;
    const deliveredCount = orders.filter(o => o.status === 'delivered' || o.status === 'completed').length;

    // Today's Revenue: Sum of totals for orders verified or paid/delivered today
    const todayRevenue = todayOrdersList
      .filter(o => o.payment_status === "paid" || o.status === "completed" || o.status === "delivered")
      .reduce((sum, o) => sum + (o.total_price || 0), 0);

    return {
      todayOrdersCount,
      awaitingVerificationCount,
      processingCount,
      deliveredCount,
      todayRevenue
    };
  }, [orders]);

  /* ================= FILTERED & SORTED ORDERS ================= */
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // 1. Tab Quick Filters
    if (orderStatusFilter !== "ALL") {
      if (orderStatusFilter === "PENDING_PAYMENT") {
        result = result.filter(o => o.status === "pending_payment");
      } else if (orderStatusFilter === "SUBMITTED") {
        result = result.filter(o => o.status === "submitted" || o.payment_status === "submitted");
      } else if (orderStatusFilter === "PAID") {
        result = result.filter(o => o.payment_status === "paid");
      } else if (orderStatusFilter === "PROCESSING") {
        result = result.filter(o => o.status === "processing");
      } else if (orderStatusFilter === "DELIVERED") {
        result = result.filter(o => o.status === "delivered" || o.status === "completed");
      } else if (orderStatusFilter === "CANCELLED") {
        result = result.filter(o => o.status === "cancelled");
      }
    }

    // 2. Text Search Match (ID, customer display name, customer billing email)
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase().trim();
      result = result.filter(o => 
        o.id.toLowerCase().includes(q) ||
        (o.billing_name || "").toLowerCase().includes(q) ||
        (o.profiles?.full_name || "").toLowerCase().includes(q) ||
        (o.billing_email || "").toLowerCase().includes(q) ||
        (o.profiles?.email || "").toLowerCase().includes(q) ||
        (o.transaction_id || "").toLowerCase().includes(q)
      );
    }

    // 3. Sorting Criteria
    if (orderSort === "newest") {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (orderSort === "oldest") {
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (orderSort === "highest_value") {
      result.sort((a, b) => b.total_price - a.total_price);
    } else if (orderSort === "lowest_value") {
      result.sort((a, b) => a.total_price - b.total_price);
    }

    return result;
  }, [orders, orderStatusFilter, orderSearch, orderSort]);

  // Tab count labels
  const filterCounts = useMemo(() => {
    return {
      all: orders.length,
      pendingPayment: orders.filter(o => o.status === "pending_payment").length,
      submitted: orders.filter(o => o.status === "submitted" || o.payment_status === "submitted").length,
      paid: orders.filter(o => o.payment_status === "paid").length,
      processing: orders.filter(o => o.status === "processing").length,
      delivered: orders.filter(o => o.status === "delivered" || o.status === "completed").length,
      cancelled: orders.filter(o => o.status === "cancelled").length,
    };
  }, [orders]);

  // Drawer details open trigger
  const handleOpenOrderDrawer = (order) => {
    setSelectedOrder(order);
    setTempNotes(order.admin_notes || "");
    setDeliveryMethod(order.delivery_method || "WhatsApp");
    setDeliveryDetails(order.delivery_details || "");
    setShowOrderDrawer(true);
  };

  const sidebarItems = [
    { id: "dashboard", label: "Overview", icon: <Award className="w-4.5 h-4.5" /> },
    { id: "orders", label: "Orders Log", icon: <ShoppingBag className="w-4.5 h-4.5" /> },
    { id: "products", label: "Game Catalog", icon: <Gamepad className="w-4.5 h-4.5" /> },
    { id: "reviews", label: "Moderation", icon: <Star className="w-4.5 h-4.5" /> },
    { id: "users", label: "Customers", icon: <Users className="w-4.5 h-4.5" /> },
    { id: "coupons", label: "Analytics", icon: <Tag className="w-4.5 h-4.5" /> },
    { id: "homepage", label: "Promotions", icon: <Sparkles className="w-4.5 h-4.5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4.5 h-4.5" /> }
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#171717] font-sans flex flex-col antialiased">
      
      {/* ── 1. ADMIN HEADER (TOP BAR) ── */}
      <header className="h-16 bg-white border-b border-[#E5E5E5] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 shadow-xs">
        
        {/* Left: Logo & Toggle */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowMobileSidebar(true)}
            className="md:hidden p-1.5 hover:bg-[#F3F4F6] rounded-lg transition"
            aria-label="Open navigation drawer"
            title="Open Menu"
          >
            <RefreshCw className="w-5 h-5 text-[#666666] rotate-90" />
          </button>
          
          <div className="flex items-center">
            <span className="font-black text-[#E10600] text-lg tracking-tighter">CG39</span>
            <span className="h-4 w-px bg-[#E5E5E5] mx-2 hidden sm:inline" />
            <span className="text-[10px] text-[#666666] uppercase font-bold tracking-wider hidden sm:inline">Admin Console</span>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="hidden md:flex items-center relative max-w-sm w-full mx-6">
          <Search className="absolute left-3 w-4 h-4 text-[#8A8A8A]" />
          <input 
            type="text" 
            placeholder="Search orders, customers, games..."
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-lg pl-9 pr-8 py-1.5 text-xs text-[#171717] placeholder-[#8A8A8A] focus:border-[#E10600] outline-none transition duration-150"
          />
          {orderSearch && (
            <button 
              onClick={() => setOrderSearch("")} 
              className="absolute right-3 text-[#8A8A8A] hover:text-[#171717]"
              aria-label="Clear search"
              title="Clear text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Notifications & Profile */}
        <div className="flex items-center gap-2">
          
          {/* Notification bell popover trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2 hover:bg-[#F3F4F6] rounded-xl text-[#171717] transition"
              aria-label="Toggle notifications"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-[#666666]" />
              {calculatedStats.awaitingVerificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#DC2626] text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {calculatedStats.awaitingVerificationCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown List */}
            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E5E5] rounded-xl shadow-lg py-2 z-50 animate-fade-in text-xs">
                <div className="px-4 py-2 border-b border-[#E5E5E5] flex justify-between items-center font-bold">
                  <span>Notifications</span>
                  <span className="text-[10px] bg-[#FEF2F2] text-[#E10600] px-1.5 py-0.5 rounded">Action Required</span>
                </div>
                <div className="divide-y divide-[#E5E5E5] max-h-60 overflow-y-auto">
                  {calculatedStats.awaitingVerificationCount > 0 ? (
                    <button
                      onClick={() => {
                        setOrderStatusFilter("SUBMITTED");
                        setActiveTab("orders");
                        setShowNotifDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-[#F9FAFB] transition flex gap-3"
                    >
                      <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-[#171717]">{calculatedStats.awaitingVerificationCount} Pending payment(s)</p>
                        <p className="text-[10px] text-[#666666] mt-0.5">Customers submitted UTR verification requests.</p>
                      </div>
                    </button>
                  ) : (
                    <div className="px-4 py-6 text-center text-[#8A8A8A] flex flex-col items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-[#16A34A]" />
                      No items awaiting action
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => { fetchStats(); fetchOrders(); fetchGames(); fetchAdminReviews(); toast.success("Refreshed operational registers"); }}
            className="p-2 hover:bg-[#F3F4F6] rounded-xl text-[#171717] transition hidden sm:inline-flex"
            aria-label="Refresh stats"
            title="Refresh Registry"
          >
            <RefreshCw className="w-5 h-5 text-[#666666]" />
          </button>

          {/* Profile initials avatar */}
          <div className="h-9 w-px bg-[#E5E5E5] mx-1" />
          
          <div className="flex items-center gap-2.5 pl-1.5">
            <div className="h-8.5 w-8.5 rounded-full bg-[#E10600] text-white flex items-center justify-center font-black text-xs uppercase tracking-wider">
              {user?.email?.slice(0, 2) || "AD"}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-black text-[#171717] truncate max-w-[120px]">Pandiyarajan</p>
              <p className="text-[10px] text-[#666666] truncate max-w-[120px]">Admin Manager</p>
            </div>
          </div>

        </div>
      </header>

      {/* ── 2. MAIN LAYOUT SHELL ── */}
      <div className="flex flex-1">
        
        {/* Desktop Sidebar navigation */}
        <aside className="hidden md:flex flex-col w-60 bg-white border-r border-[#E5E5E5] sticky top-16 h-[calc(100vh-64px)] shrink-0 py-6 justify-between overflow-y-auto">
          <nav className="px-3 space-y-1">
            {sidebarItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition duration-150 relative ${
                    isActive
                      ? "bg-[#FEF2F2] text-[#E10600]"
                      : "text-[#666666] hover:bg-[#F9FAFB] hover:text-[#171717]"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-[#E10600]" />
                  )}
                  <span className={isActive ? "text-[#E10600]" : "text-[#8A8A8A]"}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Logout button at bottom of sidebar */}
          <div className="px-3 border-t border-[#E5E5E5] pt-4">
            <button
              onClick={async () => {
                await logout();
                navigate("/login");
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#DC2626] hover:bg-[#FEF2F2] transition duration-150"
            >
              <LogOut className="w-4.5 h-4.5 text-[#DC2626]" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content scroll body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* Header Title Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#E5E5E5]">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[#171717] uppercase">Admin Panel</h1>
              <p className="text-xs text-[#666666] mt-0.5">Manage games, orders, customers and reviews.</p>
            </div>
            
            <button
              onClick={() => {
                setEditingGame(null);
                setFormData({
                  title: '', description: '', steam_price: '', price: '',
                  category_id: '', image_url: '', is_new: false, is_bundle: false,
                  in_stock: true, display_order: ""
                });
                setShowGameModal(true);
              }}
              className="bg-[#E10600] hover:bg-[#C80500] text-white rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
              title="Add Game"
            >
              <Plus className="w-4 h-4" /> Add Game
            </button>
          </div>

          {/* ── 3. DASHBOARD KPI CARDS ── */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            
            <div className="bg-white border border-[#E5E5E5] p-4 rounded-xl flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between text-[#8A8A8A]">
                <span className="text-[9px] uppercase font-black tracking-wider">Today's Orders</span>
                <ShoppingBag className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-[#171717]">{calculatedStats.todayOrdersCount}</span>
                <span className="text-[10px] text-[#666666] block mt-0.5">placed today</span>
              </div>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-4 rounded-xl flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between text-[#8A8A8A]">
                <span className="text-[9px] uppercase font-black tracking-wider">Awaiting Verification</span>
                <AlertCircle className="w-4 h-4 text-[#D97706]" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-[#D97706]">{calculatedStats.awaitingVerificationCount}</span>
                <span className="text-[10px] text-[#666666] block mt-0.5">requires action</span>
              </div>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-4 rounded-xl flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between text-[#8A8A8A]">
                <span className="text-[9px] uppercase font-black tracking-wider">Processing</span>
                <Clock className="w-4 h-4 text-[#7C3AED]" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-[#7C3AED]">{calculatedStats.processingCount}</span>
                <span className="text-[10px] text-[#666666] block mt-0.5">delivery pending</span>
              </div>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-4 rounded-xl flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between text-[#8A8A8A]">
                <span className="text-[9px] uppercase font-black tracking-wider">Delivered</span>
                <CheckCircle className="w-4 h-4 text-[#16A34A]" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-[#16A34A]">{calculatedStats.deliveredCount}</span>
                <span className="text-[10px] text-[#666666] block mt-0.5">successful orders</span>
              </div>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-4 rounded-xl flex flex-col justify-between col-span-2 md:col-span-1 shadow-xs">
              <div className="flex items-center justify-between text-[#8A8A8A]">
                <span className="text-[9px] uppercase font-black tracking-wider">Today's Revenue</span>
                <DollarSign className="w-4 h-4 text-[#E10600]" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-[#E10600]">₹{calculatedStats.todayRevenue.toLocaleString()}</span>
                <span className="text-[10px] text-[#666666] block mt-0.5">verified sales</span>
              </div>
            </div>

          </div>

          {/* ── 4. TAB 1: OVERVIEW ── */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Internal metrics columns */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-[#E5E5E5] p-5 rounded-xl shadow-xs">
                  <span className="text-[#8A8A8A] text-[10px] font-bold uppercase tracking-wider block mb-1">Total Revenue</span>
                  <p className="text-xl font-black text-[#16A34A]">₹{stats.revenue.toLocaleString()}</p>
                </div>
                <div className="bg-white border border-[#E5E5E5] p-5 rounded-xl shadow-xs">
                  <span className="text-[#8A8A8A] text-[10px] font-bold uppercase tracking-wider block mb-1">Total Orders</span>
                  <p className="text-xl font-black text-[#171717]">{stats.orders}</p>
                </div>
                <div className="bg-white border border-[#E5E5E5] p-5 rounded-xl shadow-xs">
                  <span className="text-[#8A8A8A] text-[10px] font-bold uppercase tracking-wider block mb-1">Games Catalog</span>
                  <p className="text-xl font-black text-[#E10600]">{stats.products}</p>
                </div>
                <div className="bg-white border border-[#E5E5E5] p-5 rounded-xl shadow-xs">
                  <span className="text-[#8A8A8A] text-[10px] font-bold uppercase tracking-wider block mb-1">Store Users</span>
                  <p className="text-xl font-black text-[#2563EB]">{stats.users}</p>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white border border-[#E5E5E5] rounded-xl shadow-xs p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#171717]">Recent Incoming Orders</h3>
                  <button 
                    onClick={() => setActiveTab("orders")}
                    className="text-[#E10600] hover:text-[#C80500] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition"
                  >
                    Manage All Orders <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div className="overflow-x-auto border border-[#E5E5E5] rounded-lg">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#F9FAFB] border-b border-[#E5E5E5] text-[#666666] uppercase font-bold tracking-wider">
                      <tr>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Total Amount</th>
                        <th className="p-3">Order Status</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {orders.slice(0, 8).map(o => (
                        <tr key={o.id} className="hover:bg-[#FAFAFA] transition">
                          <td className="p-3 font-mono text-[#8A8A8A]">#{o.id.substring(0, 8)}...</td>
                          <td className="p-3">
                            <div className="font-bold text-[#171717]">{o.billing_name || o.profiles?.full_name || "Customer"}</div>
                            <div className="text-[#8A8A8A] text-[10px] mt-0.5">{o.billing_email || o.profiles?.email}</div>
                          </td>
                          <td className="p-3 font-bold text-[#171717]">₹{o.total_price}</td>
                          <td className="p-3">
                            <span className={`text-[8px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full inline-block ${
                              o.status === "completed" || o.status === "delivered" ? "bg-[#D1FAE5] text-[#16A34A] border border-[#A7F3D0]" :
                              o.status === "processing" ? "bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE]" :
                              o.status === "submitted" ? "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]" :
                              o.status === "cancelled" ? "bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]" :
                              "bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]"
                            }`}>
                              {o.status || "PENDING"}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleOpenOrderDrawer(o)}
                              className="bg-white border border-[#E5E5E5] hover:bg-[#F9FAFB] px-3.5 py-1 rounded-lg text-[#171717] font-bold tracking-wide transition text-[10px]"
                              title="View order"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan="5" className="p-12 text-center text-[#8A8A8A]">NO ORDERS FOUND</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── 5. TAB 2: MANAGE ORDERS ── */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Filters selector chips */}
              <div className="flex flex-wrap gap-2 pb-4 border-b border-[#E5E5E5]">
                {[
                  { filter: "ALL", label: `All (${filterCounts.all})` },
                  { filter: "PENDING_PAYMENT", label: `Pending Payment (${filterCounts.pendingPayment})` },
                  { filter: "SUBMITTED", label: `Submitted UTR (${filterCounts.submitted})` },
                  { filter: "PAID", label: `Paid (${filterCounts.paid})` },
                  { filter: "PROCESSING", label: `Processing (${filterCounts.processing})` },
                  { filter: "DELIVERED", label: `Delivered (${filterCounts.delivered})` },
                  { filter: "CANCELLED", label: `Cancelled (${filterCounts.cancelled})` },
                ].map(item => (
                  <button
                    key={item.filter}
                    onClick={() => setOrderStatusFilter(item.filter)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wider transition ${
                      orderStatusFilter === item.filter
                        ? "bg-[#E10600] text-white"
                        : "bg-white border border-[#E5E5E5] hover:bg-[#F9FAFB] text-[#666666]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Search and Sort controls */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="col-span-8 relative">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8A8A8A]" />
                  <input
                    type="text"
                    placeholder="Search customer name, email or order ID..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E5] rounded-xl pl-10 pr-4 py-3 text-xs text-[#171717] focus:border-[#E10600] outline-none transition"
                  />
                </div>

                <select
                  value={orderSort}
                  onChange={(e) => setOrderSort(e.target.value)}
                  className="col-span-4 bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-[#171717] focus:border-[#E10600] outline-none cursor-pointer"
                >
                  <option value="newest">Order Date: Newest First</option>
                  <option value="oldest">Order Date: Oldest First</option>
                  <option value="highest_value">Total Value: Highest First</option>
                  <option value="lowest_value">Total Value: Lowest First</option>
                </select>
              </div>

              {/* Order records list */}
              <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                {loadingOrders ? (
                  <div className="p-16 text-center text-[#8A8A8A] flex flex-col items-center gap-2">
                    <RefreshCw className="w-6 h-6 text-[#E10600] animate-spin" />
                    <span>Loading operational catalog...</span>
                  </div>
                ) : filteredOrders.length > 0 ? (
                  <>
                    {/* Desktop table format */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-[#F9FAFB] border-b border-[#E5E5E5] text-[#666666] font-bold uppercase tracking-wider">
                          <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer Details</th>
                            <th className="p-4">Purchased Games</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Payment UTR</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E5E5]">
                          {filteredOrders.map(o => (
                            <tr key={o.id} className="hover:bg-[#FAFAFA] transition">
                              <td className="p-4 font-mono text-[#8A8A8A]">#{o.id.substring(0, 8)}...</td>
                              <td className="p-4">
                                <div className="font-bold text-[#171717]">{o.billing_name || o.profiles?.full_name || "Guest"}</div>
                                <div className="text-[#8A8A8A] text-[10px] mt-0.5">{o.billing_email || o.profiles?.email}</div>
                              </td>
                              <td className="p-4 max-w-[220px] truncate">
                                {o.order_items && o.order_items.map((item, idx) => (
                                  <div key={idx} className="text-xs text-[#666666] truncate">• {item.games?.title} <span className="text-[#8A8A8A] font-bold">(x{item.quantity})</span></div>
                                ))}
                              </td>
                              <td className="p-4 font-black text-[#171717]">₹{o.total_price}</td>
                              <td className="p-4">
                                <div className="font-mono text-[#171717] select-all font-semibold bg-[#F3F4F6] px-1.5 py-0.5 rounded inline-block">{o.transaction_id || "-"}</div>
                                <div className="mt-1">
                                  <span className={`text-[8px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full inline-block ${
                                    o.payment_status === "paid" ? "bg-[#D1FAE5] text-[#16A34A]" :
                                    o.payment_status === "submitted" ? "bg-[#FEF3C7] text-[#D97706]" :
                                    o.payment_status === "failed" ? "bg-[#FEE2E2] text-[#DC2626]" :
                                    "bg-[#F3F4F6] text-[#4B5563]"
                                  }`}>
                                    {o.payment_status || "pending"}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={`text-[9px] uppercase font-black px-2.5 py-0.5 rounded-full inline-block ${
                                  o.status === "completed" || o.status === "delivered" ? "bg-[#D1FAE5] text-[#16A34A] border border-[#A7F3D0]" :
                                  o.status === "processing" ? "bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE]" :
                                  o.status === "submitted" ? "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]" :
                                  o.status === "cancelled" ? "bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]" :
                                  "bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]"
                                }`}>
                                  {o.status || "PENDING"}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleOpenOrderDrawer(o)}
                                  className="bg-white border border-[#E5E5E5] hover:bg-[#F9FAFB] text-[#171717] px-3.5 py-1.5 rounded-xl font-bold uppercase text-[10px] tracking-wider transition"
                                  title="View order details"
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile responsive stacked card list */}
                    <div className="md:hidden divide-y divide-[#E5E5E5]">
                      {filteredOrders.map(o => (
                        <div key={o.id} className="p-4 space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-mono text-[#8A8A8A]">#{o.id.substring(0, 8)}...</span>
                            <span className="text-[#8A8A8A] text-[10px]">
                              {new Date(o.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          <div>
                            <div className="font-bold text-[#171717] text-sm">{o.billing_name || o.profiles?.full_name || "Customer"}</div>
                            <div className="text-[#666666] text-xs mt-0.5">{o.billing_email || o.profiles?.email}</div>
                          </div>

                          <div className="bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl p-3.5 space-y-1.5">
                            {o.order_items && o.order_items.map((item, idx) => (
                              <div key={idx} className="text-xs text-[#171717] truncate">
                                {item.games?.title} <span className="text-[#8A8A8A] font-semibold">(x{item.quantity})</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <div>
                              <span className="text-[10px] text-[#8A8A8A] block">Total Amount</span>
                              <span className="text-base font-black text-[#171717]">₹{o.total_price}</span>
                            </div>

                            <div className="flex flex-col gap-1 items-end">
                              <span className={`text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full inline-block ${
                                o.status === "completed" || o.status === "delivered" ? "bg-[#D1FAE5] text-[#16A34A]" :
                                o.status === "processing" ? "bg-[#DBEAFE] text-[#2563EB]" :
                                o.status === "submitted" ? "bg-[#FEF3C7] text-[#D97706]" :
                                "bg-[#F3F4F6] text-[#4B5563]"
                              }`}>
                                Order: {o.status || "pending"}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleOpenOrderDrawer(o)}
                            className="w-full bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E5E5] text-[#171717] py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition block text-center"
                            title="View order"
                          >
                            View Order
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="p-16 text-center text-[#8A8A8A] flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 text-[#8A8A8A] opacity-50" />
                    <span className="font-semibold">NO ORDERS FOUND</span>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ── 6. TAB 3: GAME CATALOG ── */}
          {activeTab === "products" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <h2 className="text-xs font-black uppercase tracking-wider text-[#171717]">Game Catalog</h2>
              </div>
              
              <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                {/* Desktop view table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F9FAFB] border-b border-[#E5E5E5] text-[#666666] text-xs uppercase tracking-wider font-bold">
                      <tr>
                        <th className="p-4">Game</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Selling Price</th>
                        <th className="p-4">Steam Price</th>
                        <th className="p-4">Stock Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-[#E5E5E5]">
                      {games.map(game => (
                        <tr key={game.id} className="hover:bg-[#FAFAFA] transition">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={game.image_url} alt="" className="w-8 h-10 object-cover rounded shadow-xs shrink-0" />
                              <div>
                                <span className="font-bold text-[#171717] block">{game.title}</span>
                                <span className="font-mono text-[9px] text-[#8A8A8A]">ID: {game.id.substring(0, 8)}...</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-[#666666] font-semibold">{game.categories?.name}</td>
                          <td className="p-4 font-black text-[#171717]">₹{game.price}</td>
                          <td className="p-4 text-[#8A8A8A]">₹{game.steam_price}</td>
                          <td className="p-4">
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${
                              game.in_stock !== false ? "bg-[#D1FAE5] text-[#16A34A]" : "bg-[#FEE2E2] text-[#DC2626]"
                            }`}>
                              {game.in_stock !== false ? "In Stock" : "Out of Stock"}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center gap-4">
                              <button
                                onClick={() => handleEditGame(game)}
                                className="text-[#2563EB] hover:text-[#1d4ed8] transition p-1 hover:bg-[#F3F4F6] rounded"
                                aria-label="Edit game"
                                title="Edit Catalog Entry"
                              >
                                <Plus className="w-4 h-4 rotate-45" />
                              </button>
                              <button
                                onClick={() => handleDeleteGame(game.id)}
                                className="text-[#DC2626] hover:text-[#b91c1c] transition p-1 hover:bg-[#FEF2F2] rounded"
                                aria-label="Delete game"
                                title="Remove Catalog Entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {games.length === 0 && (
                        <tr>
                          <td colSpan="6" className="p-12 text-center text-[#8A8A8A]">NO GAMES FOUND</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile view catalog cards */}
                <div className="md:hidden divide-y divide-[#E5E5E5]">
                  {games.map(game => {
                    const discount = game.steam_price && game.price ? Math.round(((game.steam_price - game.price) / game.steam_price) * 100) : 0;
                    return (
                      <div key={game.id} className="p-4 flex gap-4 items-start">
                        {/* Image on left */}
                        <img src={game.image_url} alt="" className="w-14 h-18 object-cover rounded-lg border border-[#E5E5E5] shrink-0" />
                        
                        {/* Info on right */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <h3 className="font-bold text-[#171717] text-sm truncate">{game.title}</h3>
                          <p className="text-[10px] text-[#8A8A8A] font-semibold uppercase tracking-wider">{game.categories?.name || "Uncategorized"}</p>
                          
                          <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                            <div>
                              <span className="text-[#8A8A8A]">Selling Price: </span>
                              <span className="font-bold text-[#171717]">₹{game.price}</span>
                            </div>
                            {game.steam_price && (
                              <div>
                                <span className="text-[#8A8A8A]">Steam Price: </span>
                                <span className="text-[#666666] line-through">₹{game.steam_price}</span>
                              </div>
                            )}
                            {discount > 0 && (
                              <span className="text-[9px] font-black text-[#DC2626] bg-[#FEF2F2] px-1.5 py-0.5 rounded">
                                -{discount}%
                              </span>
                            )}
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-3 pt-2">
                            <button
                              onClick={() => handleEditGame(game)}
                              className="text-xs font-bold uppercase tracking-wider text-[#2563EB] hover:text-[#1d4ed8] transition py-1 px-2.5 bg-[#F3F4F6] rounded-md"
                              aria-label="Edit game"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteGame(game.id)}
                              className="text-xs font-bold uppercase tracking-wider text-[#DC2626] hover:text-[#b91c1c] transition py-1 px-2.5 bg-[#FEF2F2] rounded-md"
                              aria-label="Delete game"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {games.length === 0 && (
                    <div className="p-12 text-center text-[#8A8A8A]">NO GAMES FOUND</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── 7. TAB 4: REVIEWS MODERATION ── */}
          {activeTab === "reviews" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <h2 className="text-xs font-black uppercase tracking-wider text-[#171717]">Customer Reviews Moderation</h2>
              </div>
              
              <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                {loadingReviews ? (
                  <div className="p-16 text-center text-[#8A8A8A] flex flex-col items-center gap-2">
                    <RefreshCw className="w-6 h-6 text-[#E10600] animate-spin" />
                    <span>Loading user comments...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-[#F9FAFB] border-b border-[#E5E5E5] text-[#666666] uppercase tracking-wider font-bold">
                        <tr>
                          <th className="p-4">Game</th>
                          <th className="p-4">Reviewer</th>
                          <th className="p-4">Rating</th>
                          <th className="p-4">Comment</th>
                          <th className="p-4">Verified</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E5E5]">
                        {reviews.map(r => (
                          <tr key={r.id} className="hover:bg-[#FAFAFA] transition">
                            <td className="p-4 font-bold text-[#171717] max-w-[140px] truncate">{r.games?.title || "Unknown Game"}</td>
                            <td className="p-4">
                              <div className="font-bold text-[#171717]">{r.profiles?.full_name || "Customer"}</div>
                              <div className="text-[#8A8A8A] text-[10px] mt-0.5">{r.profiles?.email}</div>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-0.5 text-[#D97706]">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-[#D97706] text-[#D97706]" : "text-[#E5E5E5]"}`} />
                                ))}
                              </div>
                            </td>
                            <td className="p-4 max-w-[260px] text-[#666666] break-words">{r.comment}</td>
                            <td className="p-4">
                              <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full inline-block ${
                                r.is_verified ? "bg-[#D1FAE5] text-[#16A34A]" : "bg-[#F3F4F6] text-[#4B5563]"
                              }`}>
                                {r.is_verified ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full inline-block ${
                                r.status === "approved" ? "bg-[#D1FAE5] text-[#16A34A] border border-[#A7F3D0]" :
                                r.status === "rejected" ? "bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]" :
                                "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]"
                              }`}>
                                {r.status || "APPROVED"}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex justify-center items-center gap-3">
                                <select
                                  value={r.status || "approved"}
                                  onChange={(e) => handleUpdateReviewStatus(r.id, e.target.value)}
                                  className="bg-white border border-[#E5E5E5] rounded px-2 py-1 text-xs text-[#171717] focus:outline-none focus:border-[#E10600] cursor-pointer"
                                >
                                  <option value="approved">Approve</option>
                                  <option value="pending">Pending</option>
                                  <option value="rejected">Reject</option>
                                </select>
                                <button
                                  onClick={() => handleDeleteReview(r.id)}
                                  className="text-[#DC2626] hover:text-[#b91c1c] transition p-1.5 hover:bg-[#FEF2F2] rounded"
                                  title="Delete Review"
                                  aria-label="Delete review"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {reviews.length === 0 && (
                          <tr>
                            <td colSpan="7" className="p-12 text-center text-[#8A8A8A]">NO REVIEWS FOUND</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── 8. MOCKED TABS CONTENT ── */}
          {["users", "coupons", "homepage", "settings"].includes(activeTab) && (
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-10 text-center max-w-xl mx-auto shadow-xs my-6 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-[#FEF2F2] border border-[#FDE68A] flex items-center justify-center mx-auto mb-5">
                <Sparkles className="w-7 h-7 text-[#E10600] animate-pulse" />
              </div>
              <h3 className="text-xl font-bold uppercase mb-2 tracking-tight text-[#171717]">
                {activeTab === "users" ? "User Management" :
                 activeTab === "coupons" ? "Coupon & Discount Codes" :
                 activeTab === "homepage" ? "Featured & Promos Settings" :
                 "System Site Settings"}
              </h3>
              <p className="text-[#666666] text-xs mb-6 leading-relaxed max-w-sm mx-auto">
                This panel is currently queued for database schema integration. Administrative functions can be managed directly via Supabase Dashboard.
              </p>
              <a 
                href="https://supabase.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-[#E10600] hover:bg-[#C80500] text-white rounded-lg px-6 py-2.5 font-bold text-xs uppercase tracking-wider transition-transform hover:scale-102 shadow-xs"
              >
                Open Supabase Console
              </a>
            </div>
          )}

        </main>
      </div>

      {/* ── 9. MOBILE NAVIGATION DRAWER ── */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/35 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setShowMobileSidebar(false)}
          />
          {/* Menu Drawer */}
          <div className="relative w-64 bg-white h-full shadow-2xl flex flex-col py-6 justify-between overflow-y-auto animate-slide-in-left">
            <div>
              <div className="px-6 flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <span className="font-black text-[#E10600] text-lg tracking-tighter">CG39</span>
                  <span className="text-[10px] text-[#666666] uppercase font-bold tracking-wider ml-2">Console</span>
                </div>
                <button 
                  onClick={() => setShowMobileSidebar(false)}
                  className="p-1 hover:bg-[#F3F4F6] rounded-full text-[#8A8A8A] hover:text-[#171717] transition"
                  aria-label="Close menu drawer"
                  title="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="px-3 space-y-1">
                {sidebarItems.map(item => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setShowMobileSidebar(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition relative ${
                        isActive
                          ? "bg-[#FEF2F2] text-[#E10600]"
                          : "text-[#666666] hover:bg-[#F9FAFB] hover:text-[#171717]"
                      }`}
                    >
                      <span className={isActive ? "text-[#E10600]" : "text-[#8A8A8A]"}>{item.icon}</span>
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Logout button at bottom of mobile drawer */}
            <div className="px-3 border-t border-[#E5E5E5] pt-4">
              <button
                onClick={async () => {
                  await logout();
                  setShowMobileSidebar(false);
                  navigate("/login");
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#DC2626] hover:bg-[#FEF2F2] transition duration-150"
              >
                <LogOut className="w-4.5 h-4.5 text-[#DC2626]" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 10. ADD / EDIT GAME MODAL ── */}
      {showGameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl scale-100 animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-[#171717] uppercase tracking-tight">{editingGame ? 'Edit Game' : 'Add New Game'}</h2>
              <button 
                onClick={() => setShowGameModal(false)} 
                className="text-[#8A8A8A] hover:text-[#171717] p-1.5 hover:bg-[#F3F4F6] rounded-full transition"
                aria-label="Close modal"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitGame} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase text-[#666666] font-bold mb-1.5">Game Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-lg px-3 py-2.5 text-[#171717] focus:border-[#E10600] outline-none transition"
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase text-[#666666] font-bold mb-1.5">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-lg px-3 py-2.5 text-[#171717] focus:border-[#E10600] outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-[#666666] font-bold mb-1.5">Steam Price (₹)</label>
                  <input
                    type="number"
                    value={formData.steam_price}
                    onChange={(e) => setFormData({ ...formData, steam_price: e.target.value })}
                    required
                    className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-lg px-3 py-2.5 text-[#171717] focus:border-[#E10600] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#666666] font-bold mb-1.5">Selling Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-lg px-3 py-2.5 text-[#171717] focus:border-[#E10600] outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-[#666666] font-bold mb-1.5">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    required
                    className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-lg px-3 py-2.5 text-[#171717] focus:border-[#E10600] outline-none cursor-pointer transition"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#666666] font-bold mb-1.5">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                    className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-lg px-3 py-2.5 text-[#171717] focus:border-[#E10600] outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#666666] font-bold mb-1.5">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  required
                  className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-lg px-3 py-2.5 text-[#171717] focus:border-[#E10600] outline-none transition"
                />
              </div>

              <div className="flex gap-6 py-2 border-y border-[#E5E5E5] text-[#171717]">
                <label className="flex items-center gap-2 cursor-pointer select-none font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.is_new}
                    onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                    className="rounded border-[#E5E5E5] text-[#E10600] focus:ring-0 bg-transparent"
                  />
                  New Arrival
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.is_bundle}
                    onChange={(e) => setFormData({ ...formData, is_bundle: e.target.checked })}
                    className="rounded border-[#E5E5E5] text-[#E10600] focus:ring-0 bg-transparent"
                  />
                  Mega Bundle
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.in_stock}
                    onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                    className="rounded border-[#E5E5E5] text-[#E10600] focus:ring-0 bg-transparent"
                  />
                  In Stock
                </label>
              </div>
            
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGameModal(false)}
                  className="flex-1 bg-white hover:bg-[#F9FAFB] border border-[#E5E5E5] text-[#171717] rounded-lg py-2.5 font-bold uppercase tracking-wider transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#E10600] hover:bg-[#C80500] text-white rounded-lg py-2.5 font-bold uppercase tracking-wider transition"
                >
                  {editingGame ? 'Save Changes' : 'Save Game'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 11. ORDER DETAILS DRAWER ── */}
      {showOrderDrawer && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/35 backdrop-blur-xs transition-opacity" 
            onClick={() => setShowOrderDrawer(false)}
          />
          
          {/* Drawer body */}
          <div className="relative w-full max-w-[480px] bg-white border-l border-[#E5E5E5] h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl animate-slide-in-right text-xs">
            
            <div>
              {/* Header */}
              <div className="flex justify-between items-center border-b border-[#E5E5E5] pb-4 mb-6">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#171717]">Order Details</h3>
                  <span className="text-[10px] text-[#8A8A8A] font-mono block mt-0.5">ID: {selectedOrder.id}</span>
                </div>
                <button 
                  onClick={() => setShowOrderDrawer(false)}
                  className="text-[#8A8A8A] hover:text-[#171717] p-1.5 hover:bg-[#F3F4F6] rounded-full transition"
                  aria-label="Close details drawer"
                  title="Close Drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sections list */}
              <div className="space-y-6">
                
                {/* 1. Customer Card */}
                <div className="space-y-2">
                  <span className="text-[9px] text-[#666666] font-black uppercase tracking-wider block">Customer Information</span>
                  <div className="bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl p-4 space-y-2.5">
                    <div className="flex justify-between"><span className="text-[#8A8A8A]">Name:</span> <span className="font-bold text-[#171717]">{selectedOrder.billing_name || selectedOrder.profiles?.full_name || "Guest"}</span></div>
                    <div className="flex justify-between"><span className="text-[#8A8A8A]">Email:</span> <span className="text-[#171717] font-semibold select-all">{selectedOrder.billing_email || selectedOrder.profiles?.email}</span></div>
                    <div className="flex justify-between"><span className="text-[#8A8A8A]">Phone:</span> <span className="text-[#171717] font-semibold select-all">{selectedOrder.billing_phone || "-"}</span></div>
                  </div>
                </div>

                {/* 2. Order items */}
                <div className="space-y-2">
                  <span className="text-[9px] text-[#666666] font-black uppercase tracking-wider block">Purchased Products</span>
                  <div className="bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl p-4 space-y-2.5">
                    {selectedOrder.order_items && selectedOrder.order_items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-[#171717] truncate max-w-[240px]">{item.games?.title} <span className="text-[#8A8A8A]">x{item.quantity}</span></span>
                        <span className="font-mono text-[#171717] font-bold">₹{item.price}</span>
                      </div>
                    ))}
                    <div className="border-t border-[#E5E5E5] pt-2.5 flex justify-between items-center text-sm font-black">
                      <span>Total Amount:</span>
                      <span className="text-[#16A34A]">₹{selectedOrder.total_price}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Payment details */}
                <div className="space-y-2">
                  <span className="text-[9px] text-[#666666] font-black uppercase tracking-wider block">Payment Verification</span>
                  <div className="bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl p-4 space-y-3">
                    <div className="flex justify-between"><span className="text-[#8A8A8A]">UTR / Transaction ID:</span> <span className="font-mono text-[#D97706] font-bold select-all bg-[#FEF3C7] px-2 py-0.5 rounded">{selectedOrder.transaction_id || "NOT SUBMITTED"}</span></div>
                    <div className="flex justify-between items-center"><span className="text-[#8A8A8A]">Payment Status:</span> 
                      <span className={`uppercase font-bold tracking-wider px-2 py-0.5 rounded-full inline-block ${
                        selectedOrder.payment_status === "paid" ? "bg-[#D1FAE5] text-[#16A34A]" :
                        selectedOrder.payment_status === "submitted" ? "bg-[#FEF3C7] text-[#D97706]" :
                        selectedOrder.payment_status === "failed" ? "bg-[#FEE2E2] text-[#DC2626]" :
                        "bg-[#F3F4F6] text-[#4B5563]"
                      }`}>
                        {selectedOrder.payment_status || "pending"}
                      </span>
                    </div>
                    {selectedOrder.verified_at && (
                      <div className="flex justify-between"><span className="text-[#8A8A8A]">Verified Time:</span> 
                        <span className="text-[#666666]">{new Date(selectedOrder.verified_at).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Digital Account Delivery Form */}
                <div className="space-y-2">
                  <span className="text-[9px] text-[#666666] font-black uppercase tracking-wider block">Digital account delivery details</span>
                  <div className="bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl p-4 space-y-3.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[#8A8A8A]">Order Status:</span>
                      <span className={`uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full text-[9px] inline-block ${
                        selectedOrder.status === "completed" || selectedOrder.status === "delivered" ? "bg-[#D1FAE5] text-[#16A34A] border border-[#A7F3D0]" :
                        selectedOrder.status === "processing" ? "bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE]" :
                        selectedOrder.status === "submitted" ? "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]" :
                        "bg-[#F3F4F6] text-[#4B5563]"
                      }`}>
                        {selectedOrder.status || "pending_payment"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[#666666] font-bold">Delivery Method</label>
                      <select
                        value={deliveryMethod}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2.5 text-xs text-[#171717] outline-none focus:border-[#E10600]"
                      >
                        <option value="WhatsApp">WhatsApp Message</option>
                        <option value="Email">Email Coordinates</option>
                        <option value="System">Direct Account Credentials</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[#666666] font-bold">Secure Delivery Credentials (Exposed only when delivered)</label>
                      <textarea
                        value={deliveryDetails}
                        onChange={(e) => setDeliveryDetails(e.target.value)}
                        placeholder="Steam Login Credentials:\nUsername: cg_gamer\nPassword: *********"
                        rows={3}
                        className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2 text-xs text-[#171717] font-mono outline-none focus:border-[#E10600]"
                      />
                    </div>

                    <div className="flex gap-2 pt-1.5">
                      <button
                        onClick={() => handleSaveDeliveryDetails(selectedOrder.id)}
                        disabled={selectedOrder.payment_status !== "paid"}
                        className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs uppercase tracking-wider transition ${
                          selectedOrder.payment_status === "paid" 
                            ? "bg-[#16A34A] hover:bg-[#15803D] text-white" 
                            : "bg-[#F3F4F6] border border-[#E5E5E5] text-[#8A8A8A] cursor-not-allowed"
                        }`}
                        title={selectedOrder.payment_status !== "paid" ? "Verify payment first" : "Deliver game details"}
                      >
                        Save & Mark Delivered
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. Internal notes */}
                <div className="space-y-2">
                  <span className="text-[9px] text-[#666666] font-black uppercase tracking-wider block">Internal Admin Notes</span>
                  <div className="bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl p-4 space-y-2.5">
                    <textarea
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      placeholder="Verified transaction ID on bank statement, payment verified by PR."
                      rows={2}
                      className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2 text-xs text-[#171717] outline-none focus:border-[#E10600]"
                    />
                    <button
                      onClick={() => handleSaveAdminNotes(selectedOrder.id)}
                      className="bg-white border border-[#E5E5E5] hover:bg-[#F9FAFB] text-[#171717] font-bold px-4 py-1.5 rounded-lg text-[10px] uppercase transition"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom buttons */}
            <div className="border-t border-[#E5E5E5] pt-4 mt-6 flex flex-col gap-2">
              {selectedOrder.payment_status === "submitted" && (
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => handleVerifyPayment(selectedOrder.id)}
                    className="flex-1 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-lg py-2.5 text-xs font-black uppercase tracking-wider transition"
                  >
                    Verify Payment
                  </button>
                  <button
                    onClick={() => handleRejectPayment(selectedOrder.id)}
                    className="flex-1 bg-white hover:bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626] rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider transition"
                  >
                    Reject UTR
                  </button>
                </div>
              )}
              {selectedOrder.status !== "cancelled" && (
                <button
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                  className="w-full bg-white hover:bg-[#FEF2F2] text-[#DC2626] border border-[#E5E5E5] hover:border-[#FCA5A5] rounded-lg py-2.5 text-xs font-bold uppercase transition"
                >
                  Cancel Order
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
