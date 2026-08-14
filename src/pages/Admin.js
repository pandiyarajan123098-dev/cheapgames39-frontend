import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  SquaresFour,
  GameController,
  Package,
  Users,
  Folders,
  Monitor,
  Tag,
  ChartLineUp,
  CurrencyCircleDollar,
  Gear,
  MagnifyingGlass,
  Plus,
  PencilSimple,
  Trash,
  Eye,
  Funnel,
  SortAscending,
  DownloadSimple,
  ArrowClockwise,
  Bell,
  UserCircle,
  SignOut,
  CheckCircle,
  XCircle,
  Warning,
  Info,
  Clock,
  ChatCircle,
  UserGear,
  Pulse,
  CaretRight,
  X,
  List
} from "@phosphor-icons/react";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`;

const Admin = () => {
  const { user, accessToken, logout } = useAuth();
  const navigate = useNavigate();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Core Data Lists
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [contacts, setContacts] = useState([]);

  // Stats Card state
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, users: 0, rating: 4.8 });

  // Loadings
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingGames, setLoadingGames] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Modals & Drawers
  const [showGameModal, setShowGameModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDrawer, setShowOrderDrawer] = useState(false);

  // Category Form State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  // Game Form State
  const [gameFormData, setGameFormData] = useState({
    title: '',
    description: '',
    steam_price: '',
    price: '',
    category_id: '',
    image_url: '',
    is_new: false,
    is_bundle: false,
    in_stock: true,
    display_order: '',
  });

  // Orders Log Search & Filters
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL");
  const [orderSort, setOrderSort] = useState("newest");

  // Games search & filters
  const [gameSearch, setGameSearch] = useState("");
  const [gameCategoryFilter, setGameCategoryFilter] = useState("ALL");
  const [gameStockFilter, setGameStockFilter] = useState("ALL");
  const [gameSort, setGameSort] = useState("newest");

  // Order update helper states
  const [tempNotes, setTempNotes] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("WhatsApp");
  const [deliveryDetails, setDeliveryDetails] = useState("");

  // Verify Admin authorization on mount
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

    refreshAllData();
  }, [user, navigate]);

  // Refresh all dashboard registries
  const refreshAllData = () => {
    fetchGames();
    fetchCategories();
    fetchStats();
    fetchOrders();
    fetchAdminReviews();
    fetchUsersList();
    fetchContacts();
  };

  /* ================= FETCH REGISTRIES ================= */
  const fetchGames = async () => {
    try {
      setLoadingGames(true);
      const res = await axios.get(`${API}/games`);
      setGames(res.data || []);
    } catch (err) {
      console.error("Games fetch error:", err);
      toast.error("Failed to fetch games catalog");
    } finally {
      setLoadingGames(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await axios.get(`${API}/categories`);
      setCategories(res.data || []);
    } catch (err) {
      console.error("Categories fetch error:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await axios.get(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setStats(res.data || { revenue: 0, orders: 0, products: 0, users: 0, rating: 4.8 });
    } catch (err) {
      console.error("Stats fetch error:", err);
    } finally {
      setLoadingStats(false);
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
      console.error("Orders fetch error:", err);
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
      console.error("Reviews fetch error:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchUsersList = async () => {
    try {
      setLoadingUsers(true);
      const res = await axios.get(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setUsersList(res.data || []);
    } catch (err) {
      console.error("Users list fetch error:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchContacts = async () => {
    try {
      setLoadingContacts(true);
      const res = await axios.get(`${API}/admin/contacts`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setContacts(res.data || []);
    } catch (err) {
      console.error("Contacts fetch error:", err);
    } finally {
      setLoadingContacts(false);
    }
  };

  /* ================= CATEGORIES CRUD ================= */
  const handleEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      setLoadingCategories(true);
      if (editingCategory) {
        await axios.put(`${API}/admin/categories/${editingCategory.id}`, { name: categoryName.trim() }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        toast.success("Category updated successfully");
      } else {
        await axios.post(`${API}/admin/categories`, { name: categoryName.trim() }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        toast.success("Category created successfully");
      }
      setCategoryName("");
      setEditingCategory(null);
      setShowCategoryModal(false);
      fetchCategories();
      fetchStats();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to save category");
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      setLoadingCategories(true);
      await axios.delete(`${API}/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast.success("Category deleted successfully");
      fetchCategories();
      fetchStats();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to delete category");
    } finally {
      setLoadingCategories(false);
    }
  };

  /* ================= GAMES CRUD ================= */
  const handleOpenAddGame = () => {
    setEditingGame(null);
    setGameFormData({
      title: '',
      description: '',
      steam_price: '',
      price: '',
      category_id: categories[0]?.id?.toString() || '',
      image_url: '',
      is_new: false,
      is_bundle: false,
      in_stock: true,
      display_order: '',
    });
    setShowGameModal(true);
  };

  const handleEditGame = (game) => {
    setEditingGame(game);
    setGameFormData({
      title: game.title || '',
      description: game.description || '',
      steam_price: game.steam_price?.toString() || '',
      price: game.price?.toString() || '',
      category_id: game.category_id?.toString() || '',
      image_url: game.image_url || '',
      is_new: game.is_new ?? false,
      is_bundle: game.is_bundle ?? false,
      in_stock: game.in_stock ?? true,
      display_order: game.display_order?.toString() || '',
    });
    setShowGameModal(true);
  };

  const handleSubmitGame = async (e) => {
    e.preventDefault();
    if (!gameFormData.title.trim() || !gameFormData.price || !gameFormData.category_id) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      const payload = {
        title: gameFormData.title.trim(),
        description: gameFormData.description.trim(),
        steam_price: gameFormData.steam_price ? parseFloat(gameFormData.steam_price) : null,
        price: parseFloat(gameFormData.price),
        category_id: parseInt(gameFormData.category_id),
        image_url: gameFormData.image_url.trim(),
        is_new: gameFormData.is_new,
        is_bundle: gameFormData.is_bundle,
        in_stock: gameFormData.in_stock,
        display_order: gameFormData.display_order ? parseInt(gameFormData.display_order) : 0,
      };

      if (editingGame) {
        await axios.put(`${API}/games/${editingGame.id}`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        toast.success("Game updated successfully");
      } else {
        await axios.post(`${API}/games`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        toast.success("Game created successfully");
      }
      setShowGameModal(false);
      setEditingGame(null);
      fetchGames();
      fetchStats();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to save game parameters");
    }
  };

  const handleDeleteGame = async (id) => {
    if (!window.confirm("Are you sure you want to delete this game? This action is permanent.")) return;
    try {
      await axios.delete(`${API}/games/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast.success("Game removed from catalog");
      fetchGames();
      fetchStats();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete game");
    }
  };

  /* ================= ORDERS ACTIONS ================= */
  const handleUpdateOrderField = async (orderId, payload) => {
    try {
      const res = await axios.put(`${API}/admin/orders/${orderId}`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast.success("Order status updated");
      
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
    if (!window.confirm("Verify transaction and mark order as PAID?")) return;
    handleUpdateOrderField(orderId, { payment_status: "paid" });
  };

  const handleRejectPayment = (orderId) => {
    if (!window.confirm("Mark payment as FAILED? The customer will be able to resubmit verification details.")) return;
    handleUpdateOrderField(orderId, { payment_status: "failed" });
  };

  const handleSaveDeliveryDetails = (orderId) => {
    if (!deliveryDetails.trim()) {
      toast.error("Delivery details/keys are required");
      return;
    }
    handleUpdateOrderField(orderId, {
      delivery_method: deliveryMethod,
      delivery_details: deliveryDetails,
      status: "completed"
    });
  };

  const handleSaveAdminNotes = (orderId) => {
    handleUpdateOrderField(orderId, { admin_notes: tempNotes });
  };

  const handleCancelOrder = (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    handleUpdateOrderField(orderId, { status: "cancelled" });
  };

  const handleOpenOrderDrawer = (order) => {
    setSelectedOrder(order);
    setTempNotes(order.admin_notes || "");
    setDeliveryMethod(order.delivery_method || "WhatsApp");
    setDeliveryDetails(order.delivery_details || "");
    setShowOrderDrawer(true);
  };

  /* ================= REVIEWS ACTIONS ================= */
  const handleUpdateReviewStatus = async (reviewId, status) => {
    try {
      await axios.put(`${API}/admin/reviews/${reviewId}/status`, { status }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast.success(`Review moderation status set to ${status}`);
      fetchAdminReviews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to moderate review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review comment?")) return;
    try {
      await axios.delete(`${API}/admin/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast.success("Review deleted");
      fetchAdminReviews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review");
    }
  };

  /* ================= COMPUTED / FILTERED DATA ================= */
  const calculatedStats = useMemo(() => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === today);
    const awaitingVerif = orders.filter(o => o.status === 'submitted' || o.payment_status === 'submitted');
    const processing = orders.filter(o => o.status === 'processing');
    const todayCompleted = todayOrders.filter(o => ["completed", "paid", "delivered", "processing"].includes(o.status));
    const todayRevSum = todayCompleted.reduce((sum, o) => sum + (o.total_price || 0), 0);

    return {
      todayOrdersCount: todayOrders.length,
      awaitingVerificationCount: awaitingVerif.length,
      processingCount: processing.length,
      todayRevenue: todayRevSum
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

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
        result = result.filter(o => o.status === "completed" || o.status === "delivered");
      } else if (orderStatusFilter === "CANCELLED") {
        result = result.filter(o => o.status === "cancelled");
      }
    }

    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(q) ||
        (o.billing_name || "").toLowerCase().includes(q) ||
        (o.profiles?.full_name || "").toLowerCase().includes(q) ||
        (o.billing_email || "").toLowerCase().includes(q) ||
        (o.profiles?.email || "").toLowerCase().includes(q) ||
        (o.transaction_id || "").toLowerCase().includes(q)
      );
    }

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

  const filteredGames = useMemo(() => {
    let result = [...games];

    if (gameCategoryFilter !== "ALL") {
      result = result.filter(g => g.category_id?.toString() === gameCategoryFilter);
    }

    if (gameStockFilter !== "ALL") {
      const stockBool = gameStockFilter === "IN_STOCK";
      result = result.filter(g => (g.in_stock ?? true) === stockBool);
    }

    if (gameSearch.trim()) {
      const q = gameSearch.toLowerCase();
      result = result.filter(g => 
        g.title.toLowerCase().includes(q) ||
        (g.description || "").toLowerCase().includes(q)
      );
    }

    if (gameSort === "newest") {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (gameSort === "oldest") {
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (gameSort === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (gameSort === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [games, gameCategoryFilter, gameStockFilter, gameSearch, gameSort]);

  const lowStockGames = useMemo(() => {
    return games.filter(g => g.in_stock === false);
  }, [games]);

  const recentOrders = useMemo(() => {
    return orders.slice(0, 5);
  }, [orders]);

  const recentCustomers = useMemo(() => {
    return usersList.slice(0, 5);
  }, [usersList]);

  const adminUsers = useMemo(() => {
    return usersList.filter(u => u.role === "admin");
  }, [usersList]);

  const verifiedPayments = useMemo(() => {
    return orders.filter(o => o.transaction_id);
  }, [orders]);

  // Sidebar navigation elements
  const sidebarItemsStore = [
    { id: "dashboard", label: "Dashboard", icon: <SquaresFour className="w-5 h-5" /> },
    { id: "products", label: "Games", icon: <GameController className="w-5 h-5" /> },
    { id: "orders", label: "Orders", icon: <Package className="w-5 h-5" /> },
    { id: "users", label: "Customers", icon: <Users className="w-5 h-5" /> },
    { id: "categories", label: "Categories", icon: <Folders className="w-5 h-5" /> },
    { id: "platforms", label: "Platforms", icon: <Monitor className="w-5 h-5" /> },
    { id: "offers", label: "Offers & Deals", icon: <Tag className="w-5 h-5" /> },
    { id: "payments", label: "Payments", icon: <CurrencyCircleDollar className="w-5 h-5" /> },
    { id: "analytics", label: "Analytics", icon: <ChartLineUp className="w-5 h-5" /> },
    { id: "support", label: "Support", icon: <ChatCircle className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Gear className="w-5 h-5" /> },
  ];

  const sidebarItemsSystem = [
    { id: "activity", label: "Activity Logs", icon: <Pulse className="w-5 h-5" /> },
    { id: "admins", label: "Admin Users", icon: <UserGear className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    const st = (status || "").toLowerCase();
    if (st === "completed" || st === "delivered") {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 text-[#16A34A] border border-green-100">Completed</span>;
    }
    if (st === "processing" || st === "paid") {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#2563EB] border border-blue-100">Processing</span>;
    }
    if (st === "submitted") {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-[#F59E0B] border border-amber-100">Awaiting UTR</span>;
    }
    if (st === "pending" || st === "pending_payment") {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 border border-zinc-200">Pending</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-[#DC2626] border border-red-100">{status}</span>;
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full justify-between select-none">
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#E5E5E5] mb-5">
          <div className="flex items-center gap-2">
            <span className="font-black text-[#E10600] text-xl tracking-tighter">CG39</span>
            <span className="h-4 w-px bg-[#E5E5E5]" />
            <span className="text-[10px] text-[#171717] font-bold uppercase tracking-wider">Console</span>
          </div>
        </div>

        <div className="px-3 space-y-6 pb-6">
          <div>
            <span className="px-4 text-[9px] font-black uppercase text-zinc-400 tracking-widest block mb-2">Store Management</span>
            <nav className="space-y-0.5">
              {sidebarItemsStore.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setShowMobileSidebar(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition duration-150 relative ${
                      isActive
                        ? "bg-[#FEF2F2] text-[#E10600] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E10600] before:rounded-r"
                        : "text-[#666666] hover:bg-[#F5F5F5] hover:text-[#171717]"
                    }`}
                  >
                    <span className={isActive ? "text-[#E10600]" : "text-zinc-400"}>{item.icon}</span>
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <span className="px-4 text-[9px] font-black uppercase text-zinc-400 tracking-widest block mb-2">System</span>
            <nav className="space-y-0.5">
              {sidebarItemsSystem.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setShowMobileSidebar(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition duration-150 relative ${
                      isActive
                        ? "bg-[#FEF2F2] text-[#E10600] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E10600] before:rounded-r"
                        : "text-[#666666] hover:bg-[#F5F5F5] hover:text-[#171717]"
                    }`}
                  >
                    <span className={isActive ? "text-[#E10600]" : "text-zinc-400"}>{item.icon}</span>
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-[#E5E5E5] bg-zinc-50 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-full bg-[#E10600] text-white flex items-center justify-center font-black text-xs uppercase tracking-wider shrink-0">
            {user?.email?.slice(0, 2) || "AD"}
          </div>
          <div className="min-w-0 text-left">
            <p className="text-xs font-black text-[#171717] truncate">Pandiyarajan</p>
            <p className="text-[10px] text-[#666666] uppercase tracking-wider font-bold">Admin</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-1.5 rounded-lg hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 transition shrink-0"
          aria-label="Logout"
          title="Sign Out"
        >
          <SignOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#171717] font-sans flex flex-col antialiased">
      
      {/* ── HEADER ── */}
      <header className="h-16 bg-white border-b border-[#E5E5E5] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowMobileSidebar(true)}
            className="md:hidden p-1.5 hover:bg-[#F5F5F5] rounded-lg transition"
            aria-label="Open navigation menu"
          >
            <List className="w-5 h-5 text-zinc-500" />
          </button>
          
          <div className="flex items-center">
            <span className="font-black text-[#E10600] text-lg tracking-tighter">CG39</span>
            <span className="h-4 w-px bg-[#E5E5E5] mx-2.5 hidden sm:inline" />
            <span className="text-[10px] text-[#666666] uppercase font-bold tracking-wider hidden sm:inline">Store Admin Console</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { refreshAllData(); toast.success("Registry records updated"); }}
            className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-900 transition flex items-center justify-center"
            title="Reload Stats"
            aria-label="Refresh Stats"
          >
            <ArrowClockwise className="w-4 h-4" />
          </button>
          <div className="h-6 w-px bg-[#E5E5E5] mx-1" />
          <div className="flex items-center gap-2 pl-1 select-none">
            <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Live System Connect</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        
        {/* Desktop Left Sticky Sidebar */}
        <aside className="hidden md:block w-60 bg-white border-r border-[#E5E5E5] sticky top-16 h-[calc(100vh-64px)] shrink-0 overflow-y-auto">
          {renderSidebarContent()}
        </aside>

        {/* ── MAIN CONTENT PANEL ── */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">
          
          {/* 1. DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-left select-none">
                <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Dashboard Overview</h1>
                <p className="text-xs text-zinc-500 mt-1">Live metrics of your CG39 catalog performance.</p>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* REVENUE */}
                <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 flex items-center justify-between shadow-xs relative overflow-hidden">
                  <div className="text-left">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Total Revenue</span>
                    {loadingStats ? (
                      <div className="h-7 w-24 bg-zinc-100 rounded animate-pulse" />
                    ) : (
                      <h3 className="text-xl font-black text-zinc-900">₹{stats.revenue.toLocaleString()}</h3>
                    )}
                    <span className="text-[10px] text-[#16A34A] font-bold mt-1.5 block">Completed Orders</span>
                  </div>
                  <div className="w-11 h-11 rounded-lg bg-green-50 text-[#16A34A] flex items-center justify-center shrink-0 border border-green-100">
                    <CurrencyCircleDollar className="w-5.5 h-5.5" />
                  </div>
                </div>

                {/* ORDERS */}
                <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 flex items-center justify-between shadow-xs relative overflow-hidden">
                  <div className="text-left">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Total Orders</span>
                    {loadingStats ? (
                      <div className="h-7 w-16 bg-zinc-100 rounded animate-pulse" />
                    ) : (
                      <h3 className="text-xl font-black text-zinc-900">{stats.orders}</h3>
                    )}
                    <span className="text-[10px] text-blue-600 font-bold mt-1.5 block">{calculatedStats.processingCount} Processing</span>
                  </div>
                  <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <Package className="w-5.5 h-5.5" />
                  </div>
                </div>

                {/* CUSTOMERS */}
                <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 flex items-center justify-between shadow-xs relative overflow-hidden">
                  <div className="text-left">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Customers</span>
                    {loadingStats ? (
                      <div className="h-7 w-16 bg-zinc-100 rounded animate-pulse" />
                    ) : (
                      <h3 className="text-xl font-black text-zinc-900">{stats.users}</h3>
                    )}
                    <span className="text-[10px] text-zinc-500 font-bold mt-1.5 block">Registered Profiles</span>
                  </div>
                  <div className="w-11 h-11 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0 border border-zinc-200">
                    <Users className="w-5.5 h-5.5" />
                  </div>
                </div>

                {/* CATALOG SIZE */}
                <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 flex items-center justify-between shadow-xs relative overflow-hidden">
                  <div className="text-left">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Active Catalog</span>
                    {loadingStats ? (
                      <div className="h-7 w-16 bg-zinc-100 rounded animate-pulse" />
                    ) : (
                      <h3 className="text-xl font-black text-zinc-900">{stats.products}</h3>
                    )}
                    <span className="text-[10px] text-zinc-500 font-bold mt-1.5 block">Games Listed</span>
                  </div>
                  <div className="w-11 h-11 rounded-lg bg-red-50 text-[#E10600] flex items-center justify-center shrink-0 border border-red-100">
                    <GameController className="w-5.5 h-5.5" />
                  </div>
                </div>
              </div>

              {/* Analytics Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Orders log overview */}
                <div className="lg:col-span-2 bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-xs flex flex-col">
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#E5E5E5] select-none">
                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800">Recent Orders</h3>
                    <button onClick={() => setActiveTab("orders")} className="text-[10px] font-bold uppercase tracking-wider text-[#E10600] hover:underline flex items-center gap-1">
                      View Log <CaretRight className="w-3 h-3" />
                    </button>
                  </div>
                  
                  {loadingOrders ? (
                    <div className="space-y-4 my-2">
                      <div className="h-10 bg-zinc-100 rounded-lg animate-pulse" />
                      <div className="h-10 bg-zinc-100 rounded-lg animate-pulse" />
                      <div className="h-10 bg-zinc-100 rounded-lg animate-pulse" />
                    </div>
                  ) : recentOrders.length === 0 ? (
                    <div className="py-12 text-center text-zinc-400 text-xs">No orders registered yet.</div>
                  ) : (
                    <div className="overflow-x-auto min-w-full">
                      <table className="min-w-full divide-y divide-zinc-100 text-left text-xs">
                        <thead>
                          <tr className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider bg-zinc-50/50">
                            <th className="py-3 px-4">Order ID</th>
                            <th className="py-3 px-4">Customer</th>
                            <th className="py-3 px-4">Amount</th>
                            <th className="py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {recentOrders.map(o => (
                            <tr key={o.id} className="hover:bg-zinc-50/60 transition duration-150">
                              <td className="py-3 px-4 font-mono text-[10px] text-zinc-500 font-medium">#{o.id.slice(0, 8)}</td>
                              <td className="py-3 px-4 font-bold text-zinc-800">{o.billing_name || o.profiles?.full_name || "Verified Customer"}</td>
                              <td className="py-3 px-4 font-black text-zinc-900">₹{o.total_price}</td>
                              <td className="py-3 px-4">{getStatusBadge(o.status)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Left side info: Recent customers & warnings */}
                <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#E5E5E5] select-none">
                      <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800">Inventory Warnings</h3>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-red-50 text-red-500 rounded-lg">{lowStockGames.length} Alerts</span>
                    </div>

                    {lowStockGames.length === 0 ? (
                      <div className="py-10 text-center text-zinc-400 text-[11px] leading-relaxed">
                        All listed catalog titles are currently marked in-stock.
                      </div>
                    ) : (
                      <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                        {lowStockGames.slice(0, 4).map(game => (
                          <div key={game.id} className="flex items-center gap-3 p-2 bg-red-50/40 border border-red-100/50 rounded-xl text-left">
                            <img src={game.image_url} alt="" className="w-10 h-7 object-cover rounded-lg bg-zinc-100 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-zinc-800 truncate">{game.title}</p>
                              <span className="text-[9px] font-black uppercase text-red-500 tracking-wider">Out of Stock</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-5 border-t border-[#E5E5E5]">
                    <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-wider mb-4 text-left">New Customers</h4>
                    {loadingUsers ? (
                      <div className="h-10 bg-zinc-100 rounded-lg animate-pulse" />
                    ) : recentCustomers.length === 0 ? (
                      <div className="text-center text-zinc-400 text-xs py-4">No users registered.</div>
                    ) : (
                      <div className="space-y-3">
                        {recentCustomers.map(cust => (
                          <div key={cust.id} className="flex items-center justify-between min-w-0">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-7 h-7 rounded-full bg-zinc-100 text-zinc-700 flex items-center justify-center font-bold text-xs shrink-0">
                                {cust.full_name?.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0 text-left">
                                <p className="text-xs font-bold text-zinc-800 truncate">{cust.full_name}</p>
                                <p className="text-[10px] text-zinc-400 truncate">{cust.email}</p>
                              </div>
                            </div>
                            <span className="text-[9px] text-zinc-400 font-bold shrink-0">{new Date(cust.created_at).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 2. ORDERS LOG */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
                <div>
                  <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Order Logs</h1>
                  <p className="text-xs text-zinc-500 mt-1">Manage payment validation and digital coordinate delivery.</p>
                </div>
              </div>

              {/* Filters Box */}
              <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between select-none">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input 
                      type="text" 
                      placeholder="Search orders, UTR, client..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg text-xs font-semibold placeholder-zinc-400 bg-[#F7F7F8] w-64 transition"
                    />
                  </div>
                  
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-3.5 py-2 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg text-xs font-bold uppercase tracking-wider bg-[#F7F7F8]"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING_PAYMENT">Pending UTR</option>
                    <option value="SUBMITTED">Submitted UTR</option>
                    <option value="PAID">Paid Only</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="DELIVERED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Sort:</span>
                  <select
                    value={orderSort}
                    onChange={(e) => setOrderSort(e.target.value)}
                    className="px-3.5 py-2 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg text-xs font-bold uppercase tracking-wider bg-[#F7F7F8]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest_value">Highest Value</option>
                    <option value="lowest_value">Lowest Value</option>
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                {loadingOrders ? (
                  <div className="py-20 flex justify-center items-center">
                    <ArrowClockwise className="w-8 h-8 text-[#E10600] animate-spin" />
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="py-20 text-center select-none text-zinc-400 text-xs">
                    No orders match current filter parameters.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#E5E5E5] text-left text-xs">
                      <thead>
                        <tr className="text-[10px] text-zinc-500 bg-zinc-50 font-black uppercase tracking-wider select-none border-b border-[#E5E5E5]">
                          <th className="py-3.5 px-6">ID</th>
                          <th className="py-3.5 px-6">Date</th>
                          <th className="py-3.5 px-6">Customer</th>
                          <th className="py-3.5 px-6">Price</th>
                          <th className="py-3.5 px-6">Payment Status</th>
                          <th className="py-3.5 px-6">Order Status</th>
                          <th className="py-3.5 px-6 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {filteredOrders.map(ord => (
                          <tr key={ord.id} className="hover:bg-zinc-50/50 transition duration-150">
                            <td className="py-4 px-6 font-mono text-[10px] text-zinc-500 font-bold">#{ord.id.slice(0, 8)}</td>
                            <td className="py-4 px-6 text-zinc-500 font-medium">
                              {new Date(ord.created_at).toLocaleDateString("en-IN", {
                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                              })}
                            </td>
                            <td className="py-4 px-6">
                              <p className="font-bold text-zinc-800">{ord.billing_name || ord.profiles?.full_name}</p>
                              <p className="text-[10px] text-zinc-400 font-medium">{ord.billing_email || ord.profiles?.email}</p>
                            </td>
                            <td className="py-4 px-6 font-black text-zinc-900 text-sm">₹{ord.total_price}</td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                ord.payment_status === "paid" 
                                  ? "bg-green-50 text-[#16A34A] border border-green-100" 
                                  : ord.payment_status === "failed" 
                                  ? "bg-red-50 text-[#DC2626] border border-red-100" 
                                  : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                              }`}>
                                {ord.payment_status || "pending"}
                              </span>
                            </td>
                            <td className="py-4 px-6">{getStatusBadge(ord.status)}</td>
                            <td className="py-4 px-6 text-center">
                              <button 
                                onClick={() => handleOpenOrderDrawer(ord)}
                                className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 rounded-lg text-[10px] font-bold uppercase tracking-wider transition inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" /> Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. GAMES CATALOG */}
          {activeTab === "products" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
                <div>
                  <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Game Catalog</h1>
                  <p className="text-xs text-zinc-500 mt-1">Manage game parameters, pricing, and stock status.</p>
                </div>
                <button
                  onClick={handleOpenAddGame}
                  className="bg-[#E10600] hover:bg-[#C80500] text-white px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-transform hover:scale-102 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Game
                </button>
              </div>

              {/* Filters Bar */}
              <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 flex flex-col lg:flex-row lg:items-center gap-4 justify-between select-none">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input 
                      type="text" 
                      placeholder="Search game catalog..."
                      value={gameSearch}
                      onChange={(e) => setGameSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg text-xs font-semibold placeholder-zinc-400 bg-[#F7F7F8] w-64 transition"
                    />
                  </div>

                  <select
                    value={gameCategoryFilter}
                    onChange={(e) => setGameCategoryFilter(e.target.value)}
                    className="px-3.5 py-2 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg text-xs font-bold uppercase tracking-wider bg-[#F7F7F8]"
                  >
                    <option value="ALL">All Genres</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id.toString()}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    value={gameStockFilter}
                    onChange={(e) => setGameStockFilter(e.target.value)}
                    className="px-3.5 py-2 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg text-xs font-bold uppercase tracking-wider bg-[#F7F7F8]"
                  >
                    <option value="ALL">All Stock Status</option>
                    <option value="IN_STOCK">In Stock Only</option>
                    <option value="OUT_OF_STOCK">Out of Stock</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Sort:</span>
                  <select
                    value={gameSort}
                    onChange={(e) => setGameSort(e.target.value)}
                    className="px-3.5 py-2 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg text-xs font-bold uppercase tracking-wider bg-[#F7F7F8]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                {loadingGames ? (
                  <div className="py-20 flex justify-center items-center">
                    <ArrowClockwise className="w-8 h-8 text-[#E10600] animate-spin" />
                  </div>
                ) : filteredGames.length === 0 ? (
                  <div className="py-20 text-center select-none text-zinc-400 text-xs">
                    No games match current filter parameters.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#E5E5E5] text-left text-xs">
                      <thead>
                        <tr className="text-[10px] text-zinc-500 bg-zinc-50 font-black uppercase tracking-wider select-none border-b border-[#E5E5E5]">
                          <th className="py-3.5 px-6">Image</th>
                          <th className="py-3.5 px-6">Game</th>
                          <th className="py-3.5 px-6">Genre</th>
                          <th className="py-3.5 px-6">Price</th>
                          <th className="py-3.5 px-6">Steam Price</th>
                          <th className="py-3.5 px-6">Stock Status</th>
                          <th className="py-3.5 px-6 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {filteredGames.map(game => {
                          const disc = game.steam_price > game.price 
                            ? Math.round(((game.steam_price - game.price) / game.steam_price) * 100) 
                            : 0;
                          return (
                            <tr key={game.id} className="hover:bg-zinc-50/50 transition duration-150">
                              <td className="py-4 px-6 shrink-0 select-none">
                                <img src={game.image_url} alt="" className="w-12 h-8.5 object-cover rounded-lg bg-zinc-100 border border-zinc-200/50" />
                              </td>
                              <td className="py-4 px-6">
                                <span className="font-bold text-zinc-800 text-sm block">{game.title}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Order: {game.display_order ?? 0}</span>
                              </td>
                              <td className="py-4 px-6 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                                {game.categories?.name || "Uncategorized"}
                              </td>
                              <td className="py-4 px-6 font-black text-zinc-900 text-sm">₹{game.price}</td>
                              <td className="py-4 px-6 text-zinc-400">
                                {game.steam_price ? (
                                  <div className="flex items-center gap-1.5">
                                    <span className="line-through">₹{game.steam_price}</span>
                                    {disc > 0 && <span className="text-red-500 font-bold">-{disc}%</span>}
                                  </div>
                                ) : "--"}
                              </td>
                              <td className="py-4 px-6">
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                  game.in_stock !== false 
                                    ? "bg-green-50 text-[#16A34A] border border-green-100" 
                                    : "bg-red-50 text-[#DC2626] border border-red-100"
                                }`}>
                                  {game.in_stock !== false ? "In Stock" : "Out of Stock"}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <div className="flex justify-center items-center gap-2">
                                  <button 
                                    onClick={() => handleEditGame(game)}
                                    className="p-2 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 rounded-lg transition"
                                    title="Edit parameters"
                                    aria-label="Edit game"
                                  >
                                    <PencilSimple className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteGame(game.id)}
                                    className="p-2 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition"
                                    title="Delete product"
                                    aria-label="Delete game"
                                  >
                                    <Trash className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. CUSTOMERS */}
          {activeTab === "users" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Customer Accounts</h1>
                <p className="text-xs text-zinc-500 mt-1">Review user accounts, sign-up records, and order transaction volumes.</p>
              </div>

              <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                {loadingUsers ? (
                  <div className="py-20 flex justify-center items-center">
                    <ArrowClockwise className="w-8 h-8 text-[#E10600] animate-spin" />
                  </div>
                ) : usersList.length === 0 ? (
                  <div className="py-20 text-center text-zinc-400 text-xs">No customer profiles registered.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#E5E5E5] text-left text-xs">
                      <thead>
                        <tr className="text-[10px] text-zinc-500 bg-zinc-50 font-black uppercase tracking-wider select-none border-b border-[#E5E5E5]">
                          <th className="py-3.5 px-6">Name</th>
                          <th className="py-3.5 px-6">Email</th>
                          <th className="py-3.5 px-6">Total Orders</th>
                          <th className="py-3.5 px-6">Total Spent</th>
                          <th className="py-3.5 px-6">Joined Date</th>
                          <th className="py-3.5 px-6">System Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {usersList.map(cust => (
                          <tr key={cust.id} className="hover:bg-zinc-50/50 transition duration-150">
                            <td className="py-4 px-6 font-bold text-zinc-800">{cust.full_name || "Verified Customer"}</td>
                            <td className="py-4 px-6 text-zinc-600 font-medium">{cust.email}</td>
                            <td className="py-4 px-6 font-semibold text-zinc-700">{cust.orders_count || 0}</td>
                            <td className="py-4 px-6 font-black text-zinc-900 text-sm">₹{cust.total_spent?.toLocaleString() || 0}</td>
                            <td className="py-4 px-6 text-zinc-500 font-medium">
                              {new Date(cust.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                cust.role === "admin" 
                                  ? "bg-red-50 text-red-600 border border-red-100" 
                                  : "bg-blue-50 text-blue-600 border border-blue-100"
                              }`}>
                                {cust.role || "user"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. CATEGORIES */}
          {activeTab === "categories" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
                <div>
                  <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Categories Management</h1>
                  <p className="text-xs text-zinc-500 mt-1">Manage game genres and categories dynamically linked to the database.</p>
                </div>
                <button
                  onClick={() => { setEditingCategory(null); setCategoryName(""); setShowCategoryModal(true); }}
                  className="bg-[#E10600] hover:bg-[#C80500] text-white px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-transform hover:scale-102 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </div>

              <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                {loadingCategories ? (
                  <div className="py-20 flex justify-center items-center">
                    <ArrowClockwise className="w-8 h-8 text-[#E10600] animate-spin" />
                  </div>
                ) : categories.length === 0 ? (
                  <div className="py-20 text-center text-zinc-400 text-xs">No product categories created yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#E5E5E5] text-left text-xs">
                      <thead>
                        <tr className="text-[10px] text-zinc-500 bg-zinc-50 font-black uppercase tracking-wider select-none border-b border-[#E5E5E5]">
                          <th className="py-3.5 px-6">ID</th>
                          <th className="py-3.5 px-6">Category Name</th>
                          <th className="py-3.5 px-6 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {categories.map(cat => (
                          <tr key={cat.id} className="hover:bg-zinc-50/50 transition duration-150">
                            <td className="py-4 px-6 font-mono text-[10px] text-zinc-400 font-bold">{cat.id}</td>
                            <td className="py-4 px-6 font-bold text-zinc-800 text-sm">{cat.name}</td>
                            <td className="py-4 px-6 text-center">
                              <div className="flex justify-center items-center gap-2">
                                <button 
                                  onClick={() => handleEditCategory(cat)}
                                  className="p-2 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 rounded-lg transition"
                                  title="Rename category"
                                  aria-label="Edit category"
                                >
                                  <PencilSimple className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteCategory(cat.id)}
                                  className="p-2 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition"
                                  title="Delete category"
                                  aria-label="Delete category"
                                >
                                  <Trash className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. PLATFORMS */}
          {activeTab === "platforms" && (
            <div className="space-y-6 animate-fade-in text-left select-none">
              <div>
                <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Platform Configurations</h1>
                <p className="text-xs text-zinc-500 mt-1">Review target game platforms available on storefront.</p>
              </div>

              <div className="bg-white border border-[#E5E5E5] rounded-xl p-8 text-center max-w-xl mx-auto shadow-xs">
                <div className="w-14 h-14 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-5 text-zinc-500">
                  <Monitor className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold uppercase mb-2 tracking-wide text-zinc-800">
                  Platforms Model Static Status
                </h3>
                <p className="text-zinc-500 text-xs mb-4 leading-relaxed max-w-sm mx-auto">
                  A backend platform database relation is not configured. Game platforms are statically listed and formatted on the client as <strong className="text-zinc-800">PC (Steam)</strong>.
                </p>
                <div className="bg-zinc-50 border border-zinc-200/80 rounded-xl p-4 text-left max-w-xs mx-auto">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-2">Statically Enabled Formats</span>
                  <ul className="space-y-1.5 text-[11px] font-semibold text-zinc-700">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" /> PC (Steam Launcher)</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" /> Epic Games (Upcoming)</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" /> Rockstar Connect (Upcoming)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 7. OFFERS & DEALS */}
          {activeTab === "offers" && (
            <div className="space-y-6 animate-fade-in text-left select-none">
              <div>
                <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Offers & Discounts</h1>
                <p className="text-xs text-zinc-500 mt-1">Review active promotional offers and storewide coupons.</p>
              </div>

              <div className="bg-white border border-[#E5E5E5] rounded-xl p-8 text-center max-w-xl mx-auto shadow-xs">
                <div className="w-14 h-14 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-5 text-zinc-500">
                  <Tag className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold uppercase mb-2 tracking-wide text-zinc-800">
                  No offer management is configured yet.
                </h3>
                <p className="text-zinc-500 text-xs leading-relaxed max-w-sm mx-auto">
                  Game-specific deals and promotional discounts are currently managed directly within the <strong className="text-zinc-800">Game Catalog</strong> parameters by updating the original Steam Price and current sale Price on each item.
                </p>
              </div>
            </div>
          )}

          {/* 8. PAYMENTS */}
          {activeTab === "payments" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Payment Registries</h1>
                <p className="text-xs text-zinc-500 mt-1">Audit customer UTR submission transaction details.</p>
              </div>

              <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                {loadingOrders ? (
                  <div className="py-20 flex justify-center items-center">
                    <ArrowClockwise className="w-8 h-8 text-[#E10600] animate-spin" />
                  </div>
                ) : verifiedPayments.length === 0 ? (
                  <div className="py-20 text-center text-zinc-400 text-xs">No transaction records found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#E5E5E5] text-left text-xs">
                      <thead>
                        <tr className="text-[10px] text-zinc-500 bg-zinc-50 font-black uppercase tracking-wider select-none border-b border-[#E5E5E5]">
                          <th className="py-3.5 px-6">Payment ID</th>
                          <th className="py-3.5 px-6">UTR / Reference No</th>
                          <th className="py-3.5 px-6">Customer</th>
                          <th className="py-3.5 px-6">Amount</th>
                          <th className="py-3.5 px-6">Method</th>
                          <th className="py-3.5 px-6">Verified status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {verifiedPayments.map(payment => (
                          <tr key={payment.id} className="hover:bg-zinc-50/50 transition duration-150">
                            <td className="py-4 px-6 font-mono text-[10px] text-zinc-500 font-bold">#{payment.id.slice(0, 8)}</td>
                            <td className="py-4 px-6 font-mono text-zinc-800 font-bold">{payment.transaction_id || "--"}</td>
                            <td className="py-4 px-6">
                              <p className="font-bold text-zinc-800">{payment.billing_name || payment.profiles?.full_name}</p>
                            </td>
                            <td className="py-4 px-6 font-black text-zinc-900 text-sm">₹{payment.total_price}</td>
                            <td className="py-4 px-6 text-zinc-500 uppercase font-black text-[9px] tracking-wider">UPI / QR</td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                payment.payment_status === "paid" 
                                  ? "bg-green-50 text-[#16A34A] border border-green-100" 
                                  : payment.payment_status === "failed" 
                                  ? "bg-red-50 text-[#DC2626] border border-red-100" 
                                  : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                              }`}>
                                {payment.payment_status || "pending"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 9. ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Store Analytics</h1>
                <p className="text-xs text-zinc-500 mt-1">Review sales stats, conversion levels, and transaction charts.</p>
              </div>

              {loadingOrders ? (
                <div className="py-20 flex justify-center items-center bg-white border border-[#E5E5E5] rounded-xl shadow-xs">
                  <ArrowClockwise className="w-8 h-8 text-[#E10600] animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white border border-[#E5E5E5] rounded-xl p-8 text-center max-w-xl mx-auto shadow-xs select-none">
                  <ChartLineUp className="w-7 h-7 text-zinc-400 mx-auto mb-4" />
                  <p className="text-zinc-500 text-xs">No analytics data available right now.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Revenue metrics */}
                  <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-xs select-none">
                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-4 border-b border-zinc-100 pb-2">Revenue Breakdown</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs font-semibold text-zinc-600">
                        <span>Today's Sales Revenue</span>
                        <span className="text-zinc-900 font-bold">₹{calculatedStats.todayRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold text-zinc-600">
                        <span>Total Lifetime Revenue</span>
                        <span className="text-zinc-900 font-bold">₹{stats.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold text-zinc-600">
                        <span>Average Order Check Size</span>
                        <span className="text-zinc-900 font-bold">
                          ₹{orders.length ? Math.round(stats.revenue / orders.length).toLocaleString() : 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Volume metrics */}
                  <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-xs select-none">
                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-4 border-b border-zinc-100 pb-2">Order Volumes</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs font-semibold text-zinc-600">
                        <span>Today's Total Orders</span>
                        <span className="text-zinc-900 font-bold">{calculatedStats.todayOrdersCount}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold text-zinc-600">
                        <span>Pending UTR Verifications</span>
                        <span className="text-zinc-900 font-bold">{calculatedStats.awaitingVerificationCount}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold text-zinc-600">
                        <span>Completed Orders</span>
                        <span className="text-zinc-900 font-bold">{calculatedStats.deliveredCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 10. SUPPORT */}
          {activeTab === "support" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Support Tickets</h1>
                <p className="text-xs text-zinc-500 mt-1">Review contact inquiries submitted by customers.</p>
              </div>

              <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                {loadingContacts ? (
                  <div className="py-20 flex justify-center items-center">
                    <ArrowClockwise className="w-8 h-8 text-[#E10600] animate-spin" />
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="py-20 text-center select-none text-zinc-400 text-xs">No support inquiries filed.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#E5E5E5] text-left text-xs">
                      <thead>
                        <tr className="text-[10px] text-zinc-500 bg-zinc-50 font-black uppercase tracking-wider select-none border-b border-[#E5E5E5]">
                          <th className="py-3.5 px-6">Name</th>
                          <th className="py-3.5 px-6">Email Address</th>
                          <th className="py-3.5 px-6">Message content</th>
                          <th className="py-3.5 px-6">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {contacts.map(msg => (
                          <tr key={msg.id} className="hover:bg-zinc-50/50 transition duration-150">
                            <td className="py-4 px-6 font-bold text-zinc-800">{msg.name}</td>
                            <td className="py-4 px-6 text-zinc-600 font-medium">{msg.email}</td>
                            <td className="py-4 px-6 text-zinc-700 max-w-xs truncate font-medium" title={msg.message}>
                              {msg.message}
                            </td>
                            <td className="py-4 px-6 text-zinc-400 font-medium">
                              {new Date(msg.created_at).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 11. SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-in text-left select-none">
              <div>
                <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">System Settings</h1>
                <p className="text-xs text-zinc-500 mt-1">Manage system parameters, admin options, and security protocols.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Store Profile settings */}
                <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-xs">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800 mb-4 border-b border-zinc-100 pb-2 flex items-center gap-1.5"><Gear className="w-4 h-4" /> Admin Account</h3>
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <span className="text-zinc-400 uppercase font-bold tracking-wider text-[9px] block mb-1">Email Account</span>
                      <p className="text-zinc-800 font-semibold">{user?.email}</p>
                    </div>
                    <div>
                      <span className="text-zinc-400 uppercase font-bold tracking-wider text-[9px] block mb-1">Role Permission</span>
                      <p className="text-[#E10600] font-bold uppercase">System Super Admin</p>
                    </div>
                  </div>
                </div>

                {/* API Info settings */}
                <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-xs">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800 mb-4 border-b border-zinc-100 pb-2 flex items-center gap-1.5"><Info className="w-4 h-4" /> Environment parameters</h3>
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <span className="text-zinc-400 uppercase font-bold tracking-wider text-[9px] block mb-1">Server Endpoint URL</span>
                      <p className="text-zinc-800 font-mono select-all bg-zinc-50 px-2.5 py-1.5 rounded-lg border border-zinc-200/50 break-all">{API}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 12. ACTIVITY LOGS */}
          {activeTab === "activity" && (
            <div className="space-y-6 animate-fade-in text-left select-none">
              <div>
                <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">System Action Logs</h1>
                <p className="text-xs text-zinc-500 mt-1">Audit trail log of modifications, deletion records, and login actions.</p>
              </div>

              <div className="bg-white border border-[#E5E5E5] rounded-xl p-8 text-center max-w-xl mx-auto shadow-xs">
                <div className="w-14 h-14 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-5 text-zinc-500">
                  <Pulse className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold uppercase mb-2 tracking-wide text-zinc-800">
                  Logs Unavailable
                </h3>
                <p className="text-zinc-500 text-xs leading-relaxed max-w-sm mx-auto">
                  System audit trailing is not enabled in this build. Action logs are managed directly in the Supabase audit logs console.
                </p>
              </div>
            </div>
          )}

          {/* 13. ADMIN USERS */}
          {activeTab === "admins" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Console Administrators</h1>
                <p className="text-xs text-zinc-500 mt-1">Review active store managers with administrative privileges.</p>
              </div>

              <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                {loadingUsers ? (
                  <div className="py-20 flex justify-center items-center">
                    <ArrowClockwise className="w-8 h-8 text-[#E10600] animate-spin" />
                  </div>
                ) : adminUsers.length === 0 ? (
                  <div className="py-20 text-center select-none text-zinc-400 text-xs">No admin accounts configured.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#E5E5E5] text-left text-xs">
                      <thead>
                        <tr className="text-[10px] text-zinc-500 bg-zinc-50 font-black uppercase tracking-wider select-none border-b border-[#E5E5E5]">
                          <th className="py-3.5 px-6">Name</th>
                          <th className="py-3.5 px-6">Email Address</th>
                          <th className="py-3.5 px-6">Permission Role</th>
                          <th className="py-3.5 px-6">Created Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {adminUsers.map(adm => (
                          <tr key={adm.id} className="hover:bg-zinc-50/50 transition duration-150">
                            <td className="py-4 px-6 font-bold text-zinc-800">{adm.full_name || "Verified Customer"}</td>
                            <td className="py-4 px-6 text-zinc-600 font-medium">{adm.email}</td>
                            <td className="py-4 px-6 text-[#E10600] font-black uppercase tracking-wider text-[10px]">
                              {adm.role || "admin"}
                            </td>
                            <td className="py-4 px-6 text-zinc-500 font-medium">
                              {new Date(adm.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── MOBILE SIDEBAR DRAWER MENU ── */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setShowMobileSidebar(false)}
          />
          <div className="relative w-64 bg-white h-full shadow-2xl flex flex-col py-0 z-10 animate-slide-in-left">
            <button 
              onClick={() => setShowMobileSidebar(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-800 transition"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* ── GAME ADD/EDIT MODAL ── */}
      {showGameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in select-none">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-xs" onClick={() => setShowGameModal(false)} />
          <div className="bg-white border border-[#E5E5E5] rounded-xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-zinc-50 text-left shrink-0">
              <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-800">
                {editingGame ? "Edit Catalog Item" : "Create Catalog Item"}
              </h3>
              <button onClick={() => setShowGameModal(false)} className="p-1 hover:bg-zinc-200 rounded-lg transition text-zinc-500 hover:text-zinc-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmitGame} className="flex-1 overflow-y-auto p-5 space-y-4 text-left text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-zinc-400 font-bold uppercase text-[9px] block mb-1">Game Title *</label>
                  <input
                    type="text"
                    required
                    value={gameFormData.title}
                    onChange={(e) => setGameFormData({ ...gameFormData, title: e.target.value })}
                    className="w-full h-10 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg px-3.5 text-zinc-800 placeholder-zinc-400 bg-white font-semibold transition"
                    placeholder="Grand Theft Auto V"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-zinc-400 font-bold uppercase text-[9px] block mb-1">Description</label>
                  <textarea
                    value={gameFormData.description}
                    onChange={(e) => setGameFormData({ ...gameFormData, description: e.target.value })}
                    className="w-full h-20 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg p-3 text-zinc-800 placeholder-zinc-400 bg-white font-semibold transition"
                    placeholder="Game summary details..."
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-bold uppercase text-[9px] block mb-1">Sale Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={gameFormData.price}
                    onChange={(e) => setGameFormData({ ...gameFormData, price: e.target.value })}
                    className="w-full h-10 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg px-3.5 text-zinc-800 bg-white font-semibold transition"
                    placeholder="99.00"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-bold uppercase text-[9px] block mb-1">Steam Price (₹) [Crossed]</label>
                  <input
                    type="number"
                    step="0.01"
                    value={gameFormData.steam_price}
                    onChange={(e) => setGameFormData({ ...gameFormData, steam_price: e.target.value })}
                    className="w-full h-10 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg px-3.5 text-zinc-800 bg-white font-semibold transition"
                    placeholder="999.00"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-bold uppercase text-[9px] block mb-1">Category / Genre *</label>
                  <select
                    required
                    value={gameFormData.category_id}
                    onChange={(e) => setGameFormData({ ...gameFormData, category_id: e.target.value })}
                    className="w-full h-10 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg px-3 text-zinc-800 bg-white font-bold uppercase tracking-wider transition"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id.toString()}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 font-bold uppercase text-[9px] block mb-1">Display Order</label>
                  <input
                    type="number"
                    value={gameFormData.display_order}
                    onChange={(e) => setGameFormData({ ...gameFormData, display_order: e.target.value })}
                    className="w-full h-10 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg px-3.5 text-zinc-800 bg-white font-semibold transition"
                    placeholder="0"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-zinc-400 font-bold uppercase text-[9px] block mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={gameFormData.image_url}
                    onChange={(e) => setGameFormData({ ...gameFormData, image_url: e.target.value })}
                    className="w-full h-10 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg px-3.5 text-zinc-800 placeholder-zinc-400 bg-white font-semibold transition"
                    placeholder="https://image-url..."
                  />
                </div>

                <div className="sm:col-span-2 flex flex-wrap gap-5 mt-2 select-none border border-zinc-100 p-3 rounded-xl bg-zinc-50/50">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={gameFormData.in_stock}
                      onChange={(e) => setGameFormData({ ...gameFormData, in_stock: e.target.checked })}
                      className="w-4 h-4 accent-[#E10600]"
                    />
                    <span className="font-bold text-zinc-700">In Stock Status</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={gameFormData.is_new}
                      onChange={(e) => setGameFormData({ ...gameFormData, is_new: e.target.checked })}
                      className="w-4 h-4 accent-[#E10600]"
                    />
                    <span className="font-bold text-zinc-700">New Release Badge</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={gameFormData.is_bundle}
                      onChange={(e) => setGameFormData({ ...gameFormData, is_bundle: e.target.checked })}
                      className="w-4 h-4 accent-[#E10600]"
                    />
                    <span className="font-bold text-zinc-700">Bundle Offer</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#E5E5E5] flex justify-end gap-3.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowGameModal(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E10600] hover:bg-[#C80500] text-white rounded-lg font-bold uppercase tracking-wider cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CATEGORY MODAL ── */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in select-none">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-xs" onClick={() => setShowCategoryModal(false)} />
          <div className="bg-white border border-[#E5E5E5] rounded-xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden text-left flex flex-col">
            <div className="px-5 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-zinc-50 shrink-0">
              <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-800">
                {editingCategory ? "Rename Category" : "Add New Category"}
              </h3>
              <button onClick={() => setShowCategoryModal(false)} className="p-1 hover:bg-zinc-200 rounded-lg transition text-zinc-500 hover:text-zinc-800">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSaveCategory} className="p-5 space-y-4">
              <div>
                <label className="text-zinc-400 font-bold uppercase text-[9px] block mb-1">Category name *</label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full h-10 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg px-3.5 text-zinc-800 placeholder-zinc-400 bg-white font-semibold transition"
                  placeholder="e.g. Action Adventure"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg font-bold uppercase tracking-wider cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingCategories}
                  className="px-5 py-2 bg-[#E10600] hover:bg-[#C80500] text-white rounded-lg font-bold uppercase tracking-wider cursor-pointer text-xs disabled:opacity-50"
                >
                  {loadingCategories ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ORDER DETAILS DRAWER ── */}
      {showOrderDrawer && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in select-none">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowOrderDrawer(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto animate-slide-in-right p-6 text-left">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-[#E5E5E5] pb-4 mb-5">
              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Order Details</span>
                <h3 className="text-sm font-bold text-zinc-800 font-mono">#{selectedOrder.id.slice(0, 8)}</h3>
              </div>
              <button 
                onClick={() => setShowOrderDrawer(false)}
                className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 flex-1 text-xs">
              {/* Customer Stats */}
              <div className="bg-zinc-50 border border-zinc-200/50 rounded-xl p-4 space-y-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Customer Info</span>
                <div className="grid grid-cols-2 gap-y-2">
                  <span className="text-zinc-500 font-bold">Billing Name:</span>
                  <span className="text-zinc-800 font-semibold">{selectedOrder.billing_name || "Verified Customer"}</span>
                  
                  <span className="text-zinc-500 font-bold">Billing Email:</span>
                  <span className="text-zinc-800 font-semibold break-all">{selectedOrder.billing_email || "Not specified"}</span>
                  
                  <span className="text-zinc-500 font-bold">Contact Phone:</span>
                  <span className="text-zinc-800 font-semibold">{selectedOrder.billing_phone || "Not specified"}</span>
                  
                  <span className="text-zinc-500 font-bold">Address / Coordinates:</span>
                  <span className="text-zinc-800 font-semibold break-all">{selectedOrder.billing_address || "None"}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block">Ordered Items</span>
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {selectedOrder.order_items?.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-2 border border-zinc-200/60 rounded-lg">
                      <div className="min-w-0">
                        <p className="font-bold text-zinc-800 truncate">{item.games?.title || "Game coordinate license"}</p>
                        <span className="text-[10px] text-zinc-400 font-semibold">Qty: {item.quantity}</span>
                      </div>
                      <span className="font-black text-zinc-900 ml-2">₹{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#E5E5E5] font-black text-sm">
                  <span className="text-zinc-800 uppercase text-xs">Total Amount</span>
                  <span className="text-zinc-900">₹{selectedOrder.total_price}</span>
                </div>
              </div>

              {/* Payment Proof verification */}
              <div className="bg-zinc-50 border border-zinc-200/50 rounded-xl p-4 space-y-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block">UTR Reference verification</span>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-bold">Reference Number:</span>
                  <span className="font-mono text-zinc-800 font-bold text-sm bg-zinc-100 px-2 py-0.5 rounded">{selectedOrder.transaction_id || "None Submitted"}</span>
                </div>

                {selectedOrder.transaction_id && selectedOrder.payment_status !== "paid" && (
                  <div className="flex gap-2.5 pt-2 select-none">
                    <button
                      onClick={() => handleVerifyPayment(selectedOrder.id)}
                      className="flex-1 py-2 bg-[#16A34A] hover:bg-green-700 text-white font-bold rounded-lg uppercase tracking-wider text-[10px] transition cursor-pointer"
                    >
                      Verify (PAID)
                    </button>
                    <button
                      onClick={() => handleRejectPayment(selectedOrder.id)}
                      className="py-2 px-3 bg-red-50 hover:bg-red-100 text-[#DC2626] font-bold rounded-lg uppercase tracking-wider text-[10px] transition cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>

              {/* Digital Activation details input */}
              {selectedOrder.payment_status === "paid" && (
                <div className="bg-zinc-50 border border-zinc-200/50 rounded-xl p-4 space-y-3 select-none">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block">Digital key coordinates delivery</span>
                  <div>
                    <label className="text-zinc-500 font-bold uppercase text-[9px] block mb-1">Delivery Channel</label>
                    <select
                      value={deliveryMethod}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="w-full h-8 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg px-2 text-zinc-800 font-semibold bg-white"
                    >
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Email">Email</option>
                      <option value="Platform Account">Direct Platform account</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-zinc-500 font-bold uppercase text-[9px] block mb-1">Activation Details / Steam Coordinates</label>
                    <textarea
                      value={deliveryDetails}
                      onChange={(e) => setDeliveryDetails(e.target.value)}
                      placeholder="Input steam credentials, activation keys or delivery messages here..."
                      className="w-full h-16 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg p-2 text-zinc-800 font-semibold bg-white"
                    />
                  </div>
                  <button
                    onClick={() => handleSaveDeliveryDetails(selectedOrder.id)}
                    className="w-full py-2 bg-[#E10600] hover:bg-[#C80500] text-white font-bold rounded-lg uppercase tracking-wider text-[10px] transition cursor-pointer"
                  >
                    Mark as Delivered & Send details
                  </button>
                </div>
              )}

              {/* Admin Notes */}
              <div className="bg-zinc-50 border border-zinc-200/50 rounded-xl p-4 space-y-2 select-none">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Private Admin Notes</label>
                <textarea
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  placeholder="Private comments, reference logs..."
                  className="w-full h-12 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg p-2 text-zinc-800 font-semibold bg-white"
                />
                <button
                  onClick={() => handleSaveAdminNotes(selectedOrder.id)}
                  className="w-full py-1.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-bold rounded-lg uppercase tracking-wider text-[9px] transition cursor-pointer"
                >
                  Save Notes
                </button>
              </div>

              {/* Destructive Actions */}
              {selectedOrder.status !== "cancelled" && selectedOrder.status !== "completed" && (
                <div className="pt-2 select-none">
                  <button
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    className="w-full py-2 bg-red-50 hover:bg-red-100 text-[#DC2626] font-bold rounded-lg uppercase tracking-wider text-[10px] transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Trash className="w-3.5 h-3.5" /> Cancel Order
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
