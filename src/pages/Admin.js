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
  CurrencyInr,
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
  ArrowLeft,
  CheckCircle,
  XCircle,
  Warning,
  Info,
  Clock,
  ChatCircle,
  UserGear,
  Pulse,
  CaretRight,
  List,
  Star,
  X
} from "@phosphor-icons/react";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`;

const PLATFORM_OPTIONS = [
  "Steam",
  "Epic Games",
  "PlayStation",
  "Xbox",
  "Nintendo",
  "EA",
  "Ubisoft",
  "Battle.net",
  "Rockstar Games",
  "GOG"
];

const timeAgo = (dateStr) => {
  if (!dateStr) return "Just now";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
};

const Admin = () => {
  const { user, accessToken, logout } = useAuth();
  const navigate = useNavigate();
 
  const longValueStyle = {
    overflowWrap: "anywhere",
    wordBreak: "break-word"
  };

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
 
  // Settings state
  const [storeSettings, setStoreSettings] = useState({
    store_name: "CG39 Game Store",
    whatsapp_support: "+91 6379490178",
    upi_id: "pandiyarajan39@ptyes",
    upi_qr_url: ""
  });
  const [settingsLoading, setSettingsLoading] = useState(false);

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
  const [showNotifications, setShowNotifications] = useState(false);
  const [orderActionLoading, setOrderActionLoading] = useState(false);

  // Real Order Notifications (Orders awaiting verification or with submitted UTR)
  const pendingOrders = useMemo(() => {
    return orders.filter(o => 
      o.status === "submitted" || 
      o.status === "pending_payment" || 
      o.status === "pending" ||
      o.payment_status === "verification_pending" ||
      o.payment_status === "rejected" ||
      (o.transaction_id && o.payment_status !== "paid" && o.payment_status !== "verified" && o.status !== "completed" && o.status !== "cancelled")
    );
  }, [orders]);

  const recentNewOrders = useMemo(() => {
    return orders.slice(0, 8);
  }, [orders]);

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
    platform: 'Steam',
    image_url: '',
    is_new: false,
    is_bundle: false,
    in_stock: true,
    display_order: '',
    is_structured: false,
    overview: '',
    story: '',
    gameplay: '',
    features: ['']
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

  // Live Activity Logs
  const [activityLogs, setActivityLogs] = useState([
    {
      id: "log-1",
      action: "Admin Session Initialized",
      target: "Store Console",
      user: "System Admin",
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      type: "info"
    },
    {
      id: "log-2",
      action: "Registry Synchronized",
      target: "Orders & Catalog Database",
      user: "System",
      timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      type: "success"
    }
  ]);

  const logActivity = (action, target, type = "info") => {
    const newLog = {
      id: `log-${Date.now()}`,
      action,
      target,
      user: user?.email || "Admin",
      timestamp: new Date().toISOString(),
      type
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  // Refresh all dashboard registries
  // useCallback ensures a stable reference so the auth useEffect below
  // can list it as a dependency without triggering repeated calls.
  const refreshAllData = React.useCallback(() => {
    fetchGames();
    fetchCategories();
    fetchStats();
    fetchOrders();
    fetchAdminReviews();
    fetchUsersList();
    fetchContacts();
    fetchSettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  // Verify Admin authorization on mount
  useEffect(() => {
    const ADMIN_EMAIL = "pandiyarajan007123@gmail.com";
    if (!user) {
      navigate("/");
      return;
    }
    const isAdmin = user.email?.toLowerCase() === ADMIN_EMAIL || user.user_metadata?.role === "admin";
    if (!isAdmin) {
      toast.error("Access Denied: Administrator permissions required");
      navigate("/");
      return;
    }

    refreshAllData();
  }, [user, navigate, refreshAllData]);

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
 
  const handleReviewStatusUpdate = async (reviewId, status) => {
    try {
      const rev = reviews.find(r => r.id === reviewId);
      const gameTitle = rev?.games?.title || "Game";
      const customerName = rev?.profiles?.full_name || "Customer";

      const res = await axios.put(`${API}/admin/reviews/${reviewId}/status`, { status }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.status === 200) {
        toast.success(`Review ${status} successfully`);
        logActivity(`Review status updated to ${status}`, `${gameTitle} by ${customerName}`, "success");
        fetchAdminReviews();
      }
    } catch (err) {
      console.error("Error updating review status:", err);
      toast.error(err.response?.data?.error || "Failed to update review status");
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

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API}/settings`);
      if (res.data) {
        setStoreSettings(res.data);
      }
    } catch (err) {
      console.error("Settings fetch error:", err);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSettingsLoading(true);
      await axios.put(`${API}/admin/settings`, storeSettings, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast.success("Store configurations updated successfully!");
      logActivity("Updated Settings", "Store config changes saved", "success");
    } catch (err) {
      console.error("Settings save error:", err);
      toast.error(err.response?.data?.error || "Failed to update settings");
    } finally {
      setSettingsLoading(false);
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
        logActivity("Updated Category", categoryName.trim(), "success");
      } else {
        await axios.post(`${API}/admin/categories`, { name: categoryName.trim() }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        toast.success("Category created successfully");
        logActivity("Created Category", categoryName.trim(), "success");
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
      logActivity("Deleted Category", `Category #${id}`, "warning");
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
      platform: 'Steam',
      image_url: '',
      is_new: false,
      is_bundle: false,
      in_stock: true,
      display_order: '',
      is_structured: false,
      overview: '',
      story: '',
      gameplay: '',
      features: ['']
    });
    setShowGameModal(true);
  };

  const handleEditGame = (game) => {
    setEditingGame(game);
    
    let isStructured = false;
    let overview = '';
    let story = '';
    let gameplay = '';
    let features = [''];

    if (game.description && game.description.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(game.description);
        isStructured = true;
        overview = parsed.overview || '';
        story = parsed.story || '';
        gameplay = parsed.gameplay || '';
        features = Array.isArray(parsed.features) && parsed.features.length > 0 ? parsed.features : [''];
      } catch (e) {
        // fallback
      }
    }

    setGameFormData({
      title: game.title || '',
      description: game.description || '',
      steam_price: game.steam_price?.toString() || '',
      price: game.price?.toString() || '',
      category_id: game.category_id?.toString() || '',
      platform: game.platform || 'Steam',
      image_url: game.image_url || '',
      is_new: game.is_new ?? false,
      is_bundle: game.is_bundle ?? false,
      in_stock: game.in_stock ?? true,
      display_order: game.display_order?.toString() || '',
      is_structured: isStructured,
      overview: isStructured ? overview : '',
      story: isStructured ? story : '',
      gameplay: isStructured ? gameplay : '',
      features: features
    });
    setShowGameModal(true);
  };

  const handleSubmitGame = async (e) => {
    e.preventDefault();
    if (!gameFormData.title.trim() || !gameFormData.price || !gameFormData.category_id) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (gameFormData.is_structured && !gameFormData.overview.trim()) {
      toast.error("Overview is required for structured descriptions");
      return;
    }

    try {
      let finalDescription = gameFormData.description.trim();
      if (gameFormData.is_structured) {
        const cleanedFeatures = gameFormData.features
          .map(f => f.trim())
          .filter(f => f.length > 0);

        const structuredObj = {
          overview: gameFormData.overview.trim(),
          story: gameFormData.story.trim(),
          gameplay: gameFormData.gameplay.trim(),
          features: cleanedFeatures
        };
        finalDescription = JSON.stringify(structuredObj);
      }

      const payload = {
        title: gameFormData.title.trim(),
        description: finalDescription,
        steam_price: gameFormData.steam_price ? parseFloat(gameFormData.steam_price) : null,
        price: parseFloat(gameFormData.price),
        category_id: parseInt(gameFormData.category_id),
        platform: gameFormData.platform || 'Steam',
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
        logActivity("Updated Game", payload.title, "success");
      } else {
        await axios.post(`${API}/games`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        toast.success("Game created successfully");
        logActivity("Created Game", payload.title, "success");
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
      logActivity("Deleted Game", `Game #${id}`, "warning");
      fetchGames();
      fetchStats();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete game");
    }
  };

  /* ================= ORDERS ACTIONS ================= */
  const handleUpdateOrderField = async (orderId, payload) => {
    if (orderActionLoading) return;
    try {
      setOrderActionLoading(true);
      const res = await axios.put(`${API}/admin/orders/${orderId}`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast.success("Order status updated successfully");
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({
          ...prev,
          ...res.data
        }));
      }
      await fetchOrders();
      await fetchStats();
    } catch (err) {
      console.error("Order update error:", err);
      toast.error(err.response?.data?.error || "Failed to update order details");
    } finally {
      setOrderActionLoading(false);
    }
  };

  const handleVerifyPayment = (orderId) => {
    if (!window.confirm("Verify transaction and mark order as PAID / Processing?")) return;
    handleUpdateOrderField(orderId, { payment_status: "verified", status: "processing" });
    logActivity("Verified Payment (Processing)", `Order #${orderId.slice(0,8)}`, "success");
  };

  const handleRejectPayment = (orderId) => {
    if (!window.confirm("Mark payment as REJECTED? The customer will be able to resubmit verification details.")) return;
    handleUpdateOrderField(orderId, { payment_status: "rejected", status: "created" });
    logActivity("Rejected Payment (Pending Payment)", `Order #${orderId.slice(0,8)}`, "warning");
  };

  const handleSaveDeliveryDetails = (orderId) => {
    const newStatus = selectedOrder?.status === "processing" ? "delivery" : selectedOrder?.status;
    handleUpdateOrderField(orderId, {
      status: newStatus,
      delivery_method: deliveryMethod,
      delivery_details: deliveryDetails
    });
    logActivity("Dispatched Credentials", `Order #${orderId.slice(0,8)} (${deliveryMethod})`, "success");
  };

  const handleCompleteOrder = (orderId) => {
    if (!window.confirm("Mark this order as COMPLETED?")) return;
    handleUpdateOrderField(orderId, { status: "completed" });
    logActivity("Completed Order", `Order #${orderId.slice(0,8)}`, "success");
  };

  const handleSaveAdminNotes = (orderId) => {
    handleUpdateOrderField(orderId, {
      admin_notes: tempNotes
    });
    logActivity("Saved Admin Notes", `Order #${orderId.slice(0,8)}`, "info");
  };

  const handleCancelOrder = (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    handleUpdateOrderField(orderId, { status: "cancelled" });
    logActivity("Cancelled Order", `Order #${orderId.slice(0,8)}`, "warning");
  };

  const handleOpenOrderDrawer = (order) => {
    setSelectedOrder(order);
    setTempNotes(order.admin_notes || "");
    setDeliveryMethod(order.delivery_method || "WhatsApp");
    setDeliveryDetails(order.delivery_details || "");
    setShowOrderDrawer(true);
  };

  /* ================= REVIEWS ACTIONS ================= */

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
    const awaitingVerif = orders.filter(o => o.status === 'submitted' || o.payment_status === 'submitted' || o.payment_status === 'verification_pending');
    const processing = orders.filter(o => o.status === 'processing');
    const todayCompleted = todayOrders.filter(o => ["completed", "paid", "verified", "delivered", "delivery", "processing"].includes(o.status) || ["paid", "verified"].includes(o.payment_status));
    const todayRevSum = todayCompleted.reduce((sum, o) => sum + (o.total_price || 0), 0);

    return {
      todayOrdersCount: todayOrders.length,
      awaitingVerificationCount: awaitingVerif.length,
      processingCount: processing.length,
      todayRevenue: todayRevSum
    };
  }, [orders]);

  // Dynamic Platform counts from real catalog
  const platformCounts = useMemo(() => {
    const map = {};
    PLATFORM_OPTIONS.forEach(p => { map[p] = 0; });
    games.forEach(g => {
      const p = g.platform || "Steam";
      map[p] = (map[p] || 0) + 1;
    });
    return map;
  }, [games]);

  // Dynamic Promotional Deals from real catalog
  const dealsGames = useMemo(() => {
    return games
      .filter(g => g.steam_price && g.steam_price > g.price)
      .sort((a, b) => {
        const discA = (a.steam_price - a.price) / a.steam_price;
        const discB = (b.steam_price - b.price) / b.steam_price;
        return discB - discA;
      });
  }, [games]);

  // Dynamic Best-Selling Games from real orders
  const bestSellingGames = useMemo(() => {
    const counts = {};
    orders.forEach(ord => {
      ord.order_items?.forEach(item => {
        const title = item.games?.title || "Game Title";
        const image = item.games?.image_url || "";
        if (!counts[title]) {
          counts[title] = { title, image, count: 0, revenue: 0 };
        }
        counts[title].count += item.quantity || 1;
        counts[title].revenue += (item.price || 0) * (item.quantity || 1);
      });
    });
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (orderStatusFilter !== "ALL") {
      if (orderStatusFilter === "PENDING_PAYMENT") {
        result = result.filter(o => o.status === "pending_payment" || o.payment_status === "pending");
      } else if (orderStatusFilter === "SUBMITTED") {
        result = result.filter(o => o.status === "submitted" || o.payment_status === "submitted" || o.payment_status === "verification_pending");
      } else if (orderStatusFilter === "PAID") {
        result = result.filter(o => o.payment_status === "paid" || o.payment_status === "verified");
      } else if (orderStatusFilter === "PROCESSING") {
        result = result.filter(o => o.status === "processing");
      } else if (orderStatusFilter === "DELIVERED") {
        result = result.filter(o => o.status === "completed" || o.status === "delivery" || o.status === "delivered");
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
    { id: "reviews", label: "Reviews", icon: <Star className="w-5 h-5" /> },
    { id: "users", label: "Customers", icon: <Users className="w-5 h-5" /> },
    { id: "categories", label: "Categories", icon: <Folders className="w-5 h-5" /> },
    { id: "platforms", label: "Platforms", icon: <Monitor className="w-5 h-5" /> },
    { id: "offers", label: "Offers & Deals", icon: <Tag className="w-5 h-5" /> },
    { id: "payments", label: "Payments", icon: <CurrencyInr className="w-5 h-5" /> },
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

      <div className="border-t border-[#E5E5E5] bg-zinc-50">
        {/* ── Admin Profile ── */}
        <div className="px-4 py-3 flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-[#E10600] text-white flex items-center justify-center font-black text-xs uppercase tracking-wider shrink-0">
            {user?.email?.slice(0, 2) || "AD"}
          </div>
          <div className="min-w-0 text-left">
            <p className="text-xs font-black text-[#171717] truncate">Pandiyarajan</p>
            <p className="text-[10px] text-[#666666] uppercase tracking-wider font-bold">Admin</p>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="mx-4 border-t border-[#E5E5E5]" />

        {/* ── Exit Console ── */}
        <div className="px-3 pt-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#555555] hover:bg-[#F5F5F5] hover:text-[#171717] transition duration-150 min-h-[44px]"
            aria-label="Exit Admin Console and return to storefront"
            title="Return to storefront without logging out"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            Exit Console
          </button>
        </div>

        {/* ── Divider ── */}
        <div className="mx-4 border-t border-[#E5E5E5]" />

        {/* ── Logout ── */}
        <div className="px-3 pt-2 pb-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#D00000] hover:bg-[#FFF1F1] transition duration-150 min-h-[44px]"
            aria-label="Sign out of Admin Console"
            title="Sign out"
          >
            <SignOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </div>
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
          {/* Order Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600 hover:text-zinc-900 transition relative flex items-center justify-center cursor-pointer"
              title="Order Notifications"
              aria-label="Order Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {pendingOrders.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#E10600] text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-xs animate-pulse">
                  {pendingOrders.length}
                </span>
              )}
            </button>

            {/* Notifications Popover Dropdown */}
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-black/25 backdrop-blur-xs sm:bg-transparent sm:backdrop-blur-none" 
                  onClick={() => setShowNotifications(false)} 
                />
                <div className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-[66px] sm:top-full sm:mt-2 w-auto sm:w-96 max-w-[calc(100vw-24px)] bg-white border border-[#E5E5E5] rounded-2xl sm:rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in text-left">
                  <div className="p-3.5 bg-zinc-50 border-b border-[#E5E5E5] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#E10600]" weight="bold" />
                      <span className="text-xs font-black uppercase tracking-wider text-zinc-900">Order Notifications</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-red-100 text-[#E10600] px-2.5 py-0.5 rounded-full">
                      {pendingOrders.length} Pending
                    </span>
                  </div>

                  <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto divide-y divide-zinc-100">
                    {orders.length === 0 ? (
                      <div className="p-6 text-center text-zinc-400 text-xs font-semibold">
                        No recent orders registered
                      </div>
                    ) : (
                      (pendingOrders.length > 0 ? pendingOrders : orders.slice(0, 8)).map(ord => {
                        const isPending = ord.status === "submitted" || ord.status === "pending" || ord.status === "pending_payment";
                        const customerName = ord.billing_name || ord.profiles?.full_name || "Verified Customer";
                        const gameTitle = ord.order_items?.[0]?.games?.title || (ord.order_items?.length > 1 ? `${ord.order_items[0]?.games?.title} +${ord.order_items.length - 1} more` : "Game Product");
                        const statusLabel = ord.status === "submitted" 
                          ? "Awaiting UTR" 
                          : ord.status === "pending_payment" 
                          ? "Pending Payment" 
                          : ord.status === "processing"
                          ? "Processing"
                          : (ord.status || "NEW").toUpperCase();

                        return (
                          <div
                            key={ord.id}
                            onClick={() => {
                              handleOpenOrderDrawer(ord);
                              setShowNotifications(false);
                            }}
                            className={`p-3.5 hover:bg-zinc-50 transition cursor-pointer flex items-start gap-3 ${
                              isPending ? "bg-red-50/30" : ""
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              isPending ? "bg-red-100 text-[#E10600]" : "bg-zinc-100 text-zinc-600"
                            }`}>
                              <Package className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-[#E10600]">
                                  {isPending ? "NEW ORDER" : "ORDER"}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-zinc-500">
                                  #{ord.id.substring(0, 8).toUpperCase()}
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-zinc-900 truncate">{gameTitle}</h4>
                              <p className="text-[11px] text-zinc-500 font-medium truncate">{customerName}</p>
                              <div className="flex items-center justify-between text-[11px] font-bold mt-1.5 pt-1.5 border-t border-zinc-100">
                                <span className="text-zinc-900 font-black">₹{ord.total_price}</span>
                                <span className="text-[9px] uppercase font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                  {statusLabel}
                                </span>
                                <span className="text-[10px] text-zinc-400 font-normal">
                                  {timeAgo(ord.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="p-2.5 bg-zinc-50 border-t border-[#E5E5E5] text-center">
                    <button
                      onClick={() => {
                        setActiveTab("orders");
                        setShowNotifications(false);
                      }}
                      className="w-full py-1.5 text-xs font-black uppercase tracking-wider text-[#E10600] hover:text-[#C80500] hover:underline"
                    >
                      View All Orders →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

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
                    <CurrencyInr className="w-5.5 h-5.5" />
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
                            <span className="text-[9px] text-zinc-400 font-bold shrink-0">{cust.created_at ? new Date(cust.created_at).toLocaleDateString() : "Not specified"}</span>
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
                              {cust.created_at ? new Date(cust.created_at).toLocaleDateString() : "Not specified"}
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
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Platform Configurations</h1>
                <p className="text-xs text-zinc-500 mt-1">Review active and upcoming target storefront platforms with real catalog counts.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PLATFORM_OPTIONS.map((plat) => {
                  const count = platformCounts[plat] || 0;
                  const isLive = plat === "Steam";
                  return (
                    <div key={plat} className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-xs flex flex-col justify-between select-none">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                            isLive ? "bg-red-50 text-[#E10600] border border-red-100" : "bg-zinc-100 text-zinc-500 border border-zinc-200"
                          }`}>
                            <Monitor className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-zinc-900 text-sm">{plat}</h3>
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                              {count} {count === 1 ? "Product" : "Products"}
                            </span>
                          </div>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          isLive 
                            ? "bg-green-50 text-[#16A34A] border border-green-100" 
                            : "bg-zinc-100 text-zinc-500 border border-zinc-200"
                        }`}>
                          {isLive ? "Active" : "Locked"}
                        </span>
                      </div>
                      <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                        <span className="text-zinc-500 text-[11px] font-medium">
                          {isLive ? "Live on Storefront" : "Feature Coming Soon"}
                        </span>
                        {isLive && (
                          <button 
                            onClick={() => setActiveTab("products")}
                            className="text-[#E10600] font-bold text-[10px] uppercase tracking-wider hover:underline"
                          >
                            Filter Games →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 7. OFFERS & DEALS */}
          {activeTab === "offers" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
                <div>
                  <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Active Promotional Deals</h1>
                  <p className="text-xs text-zinc-500 mt-1">Catalog titles currently featured with active discount pricing.</p>
                </div>
                <div className="bg-white border border-[#E5E5E5] px-4 py-2 rounded-lg text-xs font-bold text-zinc-700">
                  Total Active Deals: <span className="text-[#E10600] font-black">{dealsGames.length}</span>
                </div>
              </div>

              <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                {dealsGames.length === 0 ? (
                  <div className="py-20 text-center text-zinc-400 text-xs">No active discounted games.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#E5E5E5] text-left text-xs">
                      <thead>
                        <tr className="text-[10px] text-zinc-500 bg-zinc-50 font-black uppercase tracking-wider select-none border-b border-[#E5E5E5]">
                          <th className="py-3.5 px-6">Image</th>
                          <th className="py-3.5 px-6">Game Title</th>
                          <th className="py-3.5 px-6">Platform</th>
                          <th className="py-3.5 px-6">Our Price</th>
                          <th className="py-3.5 px-6">Steam Price</th>
                          <th className="py-3.5 px-6">Discount</th>
                          <th className="py-3.5 px-6 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {dealsGames.map(game => {
                          const disc = Math.round(((game.steam_price - game.price) / game.steam_price) * 100);
                          return (
                            <tr key={game.id} className="hover:bg-zinc-50/50 transition duration-150">
                              <td className="py-4 px-6 shrink-0">
                                <img src={game.image_url} alt="" className="w-12 h-8.5 object-cover rounded-lg bg-zinc-100 border border-zinc-200/50" />
                              </td>
                              <td className="py-4 px-6 font-bold text-zinc-800 text-sm">{game.title}</td>
                              <td className="py-4 px-6 text-zinc-500 font-bold uppercase text-[10px]">{game.platform || "Steam"}</td>
                              <td className="py-4 px-6 font-black text-zinc-900 text-sm">₹{game.price}</td>
                              <td className="py-4 px-6 text-zinc-400 line-through font-semibold">₹{game.steam_price}</td>
                              <td className="py-4 px-6">
                                <span className="bg-red-50 text-[#E10600] border border-red-100 px-2 py-0.5 rounded-full text-[10px] font-black">
                                  -{disc}% OFF
                                </span>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <button
                                  onClick={() => handleEditGame(game)}
                                  className="p-2 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 rounded-lg transition"
                                  title="Edit Deal Price"
                                >
                                  <PencilSimple className="w-4 h-4" />
                                </button>
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
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-xs select-none">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Lifetime Revenue</span>
                      <h3 className="text-2xl font-black text-zinc-900">₹{stats.revenue.toLocaleString()}</h3>
                      <span className="text-[10px] text-emerald-600 font-bold mt-1.5 block">Verified Orders</span>
                    </div>

                    <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-xs select-none">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Total Orders</span>
                      <h3 className="text-2xl font-black text-zinc-900">{orders.length}</h3>
                      <span className="text-[10px] text-blue-600 font-bold mt-1.5 block">{calculatedStats.processingCount} In Processing</span>
                    </div>

                    <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-xs select-none">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Average Order Value</span>
                      <h3 className="text-2xl font-black text-zinc-900">
                        ₹{orders.length ? Math.round(stats.revenue / orders.length).toLocaleString() : 0}
                      </h3>
                      <span className="text-[10px] text-zinc-500 font-bold mt-1.5 block">Per Transaction</span>
                    </div>
                  </div>

                  {/* Best Selling Games List */}
                  <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-xs select-none">
                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800 mb-4 border-b border-zinc-100 pb-2">
                      Best-Selling Games in Storefront
                    </h3>
                    {bestSellingGames.length === 0 ? (
                      <p className="text-xs text-zinc-400 py-4">No sales recorded yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {bestSellingGames.map((item, idx) => (
                          <div key={idx} className="bg-zinc-50 border border-zinc-200/60 rounded-xl p-3.5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-100 text-[#E10600] font-black text-xs flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-zinc-900 text-xs truncate">{item.title}</h4>
                              <span className="text-[10px] text-zinc-500 font-semibold mt-0.5 block">
                                {item.count} sold • ₹{item.revenue}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 10. SUPPORT */}
          {activeTab === "support" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Customer Support Inquiries</h1>
                <p className="text-xs text-zinc-500 mt-1">Review contact inquiries and connect directly with customers.</p>
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
                          <th className="py-3.5 px-6">Message Content</th>
                          <th className="py-3.5 px-6">Date</th>
                          <th className="py-3.5 px-6 text-center">Contact</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {contacts.map(msg => (
                          <tr key={msg.id} className="hover:bg-zinc-50/50 transition duration-150">
                            <td className="py-4 px-6 font-bold text-zinc-800">{msg.name}</td>
                            <td className="py-4 px-6 text-zinc-600 font-medium">{msg.email}</td>
                            <td className="py-4 px-6 text-zinc-700 max-w-xs font-medium" title={msg.message}>
                              {msg.message}
                            </td>
                            <td className="py-4 px-6 text-zinc-400 font-medium">
                              {new Date(msg.created_at).toLocaleString()}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <a
                                href={`mailto:${msg.email}?subject=CG39 Support Response`}
                                className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-md font-bold text-[10px] uppercase tracking-wider inline-block"
                              >
                                Reply Email
                              </a>
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

          {/* 10.5 REVIEWS MANAGEMENT */}
          {activeTab === "reviews" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex justify-between items-center select-none">
                <div>
                  <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Customer Reviews</h1>
                  <p className="text-xs text-zinc-500 mt-1">Approve, reject, and moderate customer reviews for your products.</p>
                </div>
                <button
                  onClick={fetchAdminReviews}
                  className="px-3 py-1.5 bg-[#E10600] hover:bg-[#C80500] text-white rounded-lg font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
                  disabled={loadingReviews}
                >
                  <ArrowClockwise className={`w-3.5 h-3.5 ${loadingReviews ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>

              <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                {loadingReviews ? (
                  <div className="py-20 flex justify-center items-center">
                    <ArrowClockwise className="w-8 h-8 text-[#E10600] animate-spin" />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="py-20 text-center select-none text-zinc-400 text-xs font-semibold">
                    No customer reviews found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#E5E5E5] text-xs text-left">
                      <thead>
                        <tr className="text-[10px] text-zinc-500 bg-zinc-50 font-black uppercase tracking-wider select-none border-b border-[#E5E5E5]">
                          <th className="py-3.5 px-6">Customer</th>
                          <th className="py-3.5 px-6">Game / Product</th>
                          <th className="py-3.5 px-6 text-center">Rating</th>
                          <th className="py-3.5 px-6">Review Comment</th>
                          <th className="py-3.5 px-6">Purchase Info</th>
                          <th className="py-3.5 px-6">Date</th>
                          <th className="py-3.5 px-6 text-center">Status</th>
                          <th className="py-3.5 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {reviews.map(rev => {
                          const customerName = rev.profiles?.full_name || "Verified Customer";
                          const customerEmail = rev.profiles?.email || "";
                          const gameTitle = rev.games?.title || "Unknown Game";
                          const ratingStars = rev.rating;
                          const purchaseOrder = rev.purchase_info;
                          const dateStr = new Date(rev.created_at).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'short', day: 'numeric'
                          });

                          return (
                            <tr key={rev.id} className="hover:bg-zinc-50/50 transition duration-150">
                              {/* Customer info */}
                              <td className="py-4 px-6">
                                <div className="font-bold text-zinc-800">{customerName}</div>
                                {customerEmail && <div className="text-[10px] text-zinc-500 font-medium mt-0.5">{customerEmail}</div>}
                              </td>

                              {/* Game info */}
                              <td className="py-4 px-6 font-bold text-zinc-800 max-w-[160px] truncate" title={gameTitle}>
                                {gameTitle}
                              </td>

                              {/* Rating */}
                              <td className="py-4 px-6 text-center">
                                <div className="flex gap-0.5 justify-center">
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                      key={star}
                                      weight="fill"
                                      className={`w-3.5 h-3.5 ${star <= ratingStars ? "text-yellow-500" : "text-zinc-200"}`}
                                    />
                                  ))}
                                </div>
                              </td>

                              {/* Review Comment */}
                              <td className="py-4 px-6 text-zinc-700 max-w-xs font-medium whitespace-pre-wrap break-words" title={rev.comment}>
                                {rev.comment}
                              </td>

                              {/* Purchase Info */}
                              <td className="py-4 px-6 font-medium">
                                {purchaseOrder ? (
                                  <div className="space-y-0.5">
                                    <span className="font-mono text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100 uppercase font-bold">
                                      #{purchaseOrder.order_id.substring(0, 8).toUpperCase()}
                                    </span>
                                    <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                                      {purchaseOrder.status}
                                    </div>
                                  </div>
                                ) : rev.is_verified ? (
                                  <span className="text-[9px] bg-green-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold uppercase">
                                    Verified
                                  </span>
                                ) : (
                                  <span className="text-[9px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded font-bold uppercase">
                                    Not Verified
                                  </span>
                                )}
                              </td>

                              {/* Date */}
                              <td className="py-4 px-6 text-zinc-400 font-medium">
                                {dateStr}
                              </td>

                              {/* Status */}
                              <td className="py-4 px-6 text-center">
                                {rev.status === "approved" ? (
                                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-green-50 text-[#16A34A] border border-green-100">Approved</span>
                                ) : rev.status === "rejected" ? (
                                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">Rejected</span>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100">Pending</span>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-6 text-right">
                                <div className="flex gap-2 justify-end">
                                  {rev.status !== "approved" && (
                                    <button
                                      onClick={() => handleReviewStatusUpdate(rev.id, "approved")}
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px] uppercase tracking-wider transition select-none cursor-pointer"
                                    >
                                      Approve
                                    </button>
                                  )}
                                  {rev.status !== "rejected" && (
                                    <button
                                      onClick={() => handleReviewStatusUpdate(rev.id, "rejected")}
                                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-[10px] uppercase tracking-wider transition select-none cursor-pointer"
                                    >
                                      Reject
                                    </button>
                                  )}
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
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800 mb-4 border-b border-zinc-100 pb-2 flex items-center gap-1.5"><Gear className="w-4 h-4" /> Store Configurations</h3>
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="text-zinc-400 uppercase font-bold tracking-wider text-[9px] block mb-1.5">Store Name</label>
                      <input 
                        type="text" 
                        value={storeSettings.store_name} 
                        onChange={(e) => setStoreSettings({ ...storeSettings, store_name: e.target.value })}
                        className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3 py-2 text-zinc-800 font-semibold focus:border-[#E10600] focus:ring-1 focus:ring-[#E10600]/30 outline-none transition" 
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 uppercase font-bold tracking-wider text-[9px] block mb-1.5">WhatsApp Customer Support</label>
                      <input 
                        type="text" 
                        value={storeSettings.whatsapp_support} 
                        onChange={(e) => setStoreSettings({ ...storeSettings, whatsapp_support: e.target.value })}
                        className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3 py-2 text-zinc-800 font-semibold focus:border-[#E10600] focus:ring-1 focus:ring-[#E10600]/30 outline-none transition" 
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 uppercase font-bold tracking-wider text-[9px] block mb-1.5">UPI Payment Address</label>
                      <input 
                        type="text" 
                        value={storeSettings.upi_id} 
                        onChange={(e) => setStoreSettings({ ...storeSettings, upi_id: e.target.value })}
                        className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg px-3 py-2 text-zinc-800 font-mono focus:border-[#E10600] focus:ring-1 focus:ring-[#E10600]/30 outline-none transition" 
                      />
                    </div>
                    
                    {/* QR Code Upload */}
                    <div>
                      <span className="text-zinc-400 uppercase font-bold tracking-wider text-[9px] block mb-1.5">UPI Payment QR Code</span>
                      
                      {storeSettings.upi_qr_url ? (
                        <div className="space-y-2 text-left">
                          <img 
                            src={storeSettings.upi_qr_url} 
                            alt="UPI QR Code Preview" 
                            className="w-32 h-32 object-contain border border-[#E5E5E5] rounded-lg p-1 bg-white" 
                          />
                          <button
                            type="button"
                            onClick={() => setStoreSettings({ ...storeSettings, upi_qr_url: "" })}
                            className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-[9px] uppercase tracking-wider transition cursor-pointer border border-red-100"
                          >
                            Delete QR Code
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                if (file.size > 200 * 1024) {
                                  toast.error("QR Code image must be smaller than 200KB");
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setStoreSettings({ ...storeSettings, upi_qr_url: reader.result });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="w-full text-zinc-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 transition cursor-pointer text-[10px]" 
                          />
                          <span className="text-[10px] text-zinc-400">Supported formats: JPG, PNG. Max size 200KB.</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={settingsLoading}
                      onClick={handleSaveSettings}
                      className="w-full py-2 bg-[#E10600] hover:bg-[#C80500] disabled:opacity-50 text-white font-bold rounded-lg uppercase tracking-wider text-[10px] transition cursor-pointer flex items-center justify-center min-h-[36px]"
                    >
                      {settingsLoading ? "Saving..." : "Save Configurations"}
                    </button>
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
                    <div>
                      <span className="text-zinc-400 uppercase font-bold tracking-wider text-[9px] block mb-1">System Status</span>
                      <span className="text-emerald-600 font-bold uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        Operational & Secure
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 12. ACTIVITY LOGS */}
          {activeTab === "activity" && (
            <div className="space-y-6 animate-fade-in text-left select-none">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">System Activity Logs</h1>
                  <p className="text-xs text-zinc-500 mt-1">Live audit trail of admin modifications, order state changes, and operations.</p>
                </div>
                <button
                  onClick={() => logActivity("Audit Trail Refreshed", "Session Log", "info")}
                  className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-xs font-bold uppercase tracking-wider transition"
                >
                  Refresh Logs
                </button>
              </div>

              <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#E5E5E5] text-left text-xs">
                    <thead>
                      <tr className="text-[10px] text-zinc-500 bg-zinc-50 font-black uppercase tracking-wider select-none border-b border-[#E5E5E5]">
                        <th className="py-3.5 px-6">Action</th>
                        <th className="py-3.5 px-6">Target Resource</th>
                        <th className="py-3.5 px-6">Operator</th>
                        <th className="py-3.5 px-6">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {activityLogs.map(log => (
                        <tr key={log.id} className="hover:bg-zinc-50/50 transition duration-150">
                          <td className="py-4 px-6 font-bold text-zinc-900">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              log.type === "success" ? "bg-emerald-500" : log.type === "warning" ? "bg-amber-500" : "bg-blue-500"
                            }`} />
                            {log.action}
                          </td>
                          <td className="py-4 px-6 text-zinc-700 font-semibold">{log.target}</td>
                          <td className="py-4 px-6 text-zinc-500 font-mono text-[11px]">{log.user}</td>
                          <td className="py-4 px-6 text-zinc-400 font-medium">{new Date(log.timestamp).toLocaleTimeString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                              {adm.created_at ? new Date(adm.created_at).toLocaleDateString() : "Not specified"}
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

                <div className="sm:col-span-2 space-y-3">
                  <div className="flex items-center justify-between bg-zinc-50 border border-[#E5E5E5] p-3 rounded-xl select-none">
                    <div>
                      <span className="text-zinc-700 font-bold block">Structured Description Details</span>
                      <span className="text-zinc-400 text-[10px] block font-medium">Toggle to write detailed Overview, Story, Gameplay, and Key Features</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGameFormData({ ...gameFormData, is_structured: !gameFormData.is_structured })}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 shrink-0 ${gameFormData.is_structured ? 'bg-[#E10600]' : 'bg-zinc-300'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${gameFormData.is_structured ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {!gameFormData.is_structured ? (
                    <div>
                      <label className="text-zinc-400 font-bold uppercase text-[9px] block mb-1">Simple Description</label>
                      <textarea
                        value={gameFormData.description}
                        onChange={(e) => setGameFormData({ ...gameFormData, description: e.target.value })}
                        className="w-full h-24 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg p-3 text-zinc-800 placeholder-zinc-400 bg-white font-semibold transition"
                        placeholder="Game summary details..."
                      />
                    </div>
                  ) : (
                    <div className="space-y-3 bg-zinc-50/50 border border-[#E5E5E5] p-4 rounded-xl">
                      <div>
                        <label className="text-zinc-400 font-bold uppercase text-[9px] block mb-1">Overview (Intro) *</label>
                        <textarea
                          required={gameFormData.is_structured}
                          value={gameFormData.overview}
                          onChange={(e) => setGameFormData({ ...gameFormData, overview: e.target.value })}
                          className="w-full h-20 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg p-3 text-zinc-800 placeholder-zinc-400 bg-white font-semibold transition"
                          placeholder="Brief 2-4 sentences explaining what the game is..."
                        />
                      </div>
                      
                      <div>
                        <label className="text-zinc-400 font-bold uppercase text-[9px] block mb-1">Story & Setting</label>
                        <textarea
                          value={gameFormData.story}
                          onChange={(e) => setGameFormData({ ...gameFormData, story: e.target.value })}
                          className="w-full h-20 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg p-3 text-zinc-800 placeholder-zinc-400 bg-white font-semibold transition"
                          placeholder="Explain the game's world, setting, and basic premise..."
                        />
                      </div>

                      <div>
                        <label className="text-zinc-400 font-bold uppercase text-[9px] block mb-1">Gameplay Experience</label>
                        <textarea
                          value={gameFormData.gameplay}
                          onChange={(e) => setGameFormData({ ...gameFormData, gameplay: e.target.value })}
                          className="w-full h-20 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg p-3 text-zinc-800 placeholder-zinc-400 bg-white font-semibold transition"
                          placeholder="Explain the core gameplay loop and mechanics..."
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-zinc-400 font-bold uppercase text-[9px] block">Key Features</label>
                          <button
                            type="button"
                            onClick={() => setGameFormData({ ...gameFormData, features: [...gameFormData.features, ''] })}
                            className="text-[10px] font-bold text-[#E10600] hover:text-[#C10500] uppercase tracking-wider transition"
                          >
                            + Add Feature
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          {gameFormData.features.map((feature, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) => {
                                  const updated = [...gameFormData.features];
                                  updated[idx] = e.target.value;
                                  setGameFormData({ ...gameFormData, features: updated });
                                }}
                                className="flex-1 h-9 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg px-3 text-zinc-800 placeholder-zinc-400 bg-white font-semibold transition"
                                placeholder={`Feature #${idx + 1}`}
                              />
                              {gameFormData.features.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = gameFormData.features.filter((_, i) => i !== idx);
                                    setGameFormData({ ...gameFormData, features: updated });
                                  }}
                                  className="px-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-lg text-[10px] font-bold transition uppercase"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
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
                  <label className="text-zinc-400 font-bold uppercase text-[9px] block mb-1">Platform *</label>
                  <select
                    required
                    value={gameFormData.platform || "Steam"}
                    onChange={(e) => setGameFormData({ ...gameFormData, platform: e.target.value })}
                    className="w-full h-10 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg px-3 text-zinc-800 bg-white font-bold uppercase tracking-wider transition"
                  >
                    {PLATFORM_OPTIONS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 font-bold uppercase text-[9px] block mb-1">
                    Display Priority <span className="text-zinc-300 normal-case font-medium">(lower = shown first, 1 = top)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="9999"
                    value={gameFormData.display_order}
                    onChange={(e) => setGameFormData({ ...gameFormData, display_order: e.target.value })}
                    className="w-full h-10 border border-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#E10600] rounded-lg px-3.5 text-zinc-800 bg-white font-semibold transition"
                    placeholder="e.g. 1 = first, 50 = popular, 200 = older"
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
              {/* Customer Info Card */}
              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-5 space-y-4 text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#666666] block border-b border-[#E5E5E5] pb-2 select-none">
                  CUSTOMER INFO
                </span>
                
                <div className="space-y-3.5 sm:space-y-0 sm:grid sm:grid-cols-[140px_1fr] sm:gap-x-4 sm:gap-y-3">
                  {/* Billing Name */}
                  <div className="flex flex-col sm:contents">
                    <span className="text-[#666666] font-medium text-xs select-none">
                      Billing Name
                    </span>
                    <span className="text-[#111111] font-semibold text-xs mt-1 sm:mt-0" style={longValueStyle}>
                      {selectedOrder.billing_name || selectedOrder.profiles?.full_name || (
                        <span className="text-[#666666]/60 italic font-normal">Not specified</span>
                      )}
                    </span>
                  </div>

                  {/* Billing Email */}
                  <div className="flex flex-col sm:contents">
                    <span className="text-[#666666] font-medium text-xs select-none">
                      Billing Email
                    </span>
                    <span className="text-[#111111] font-semibold text-xs mt-1 sm:mt-0" style={longValueStyle}>
                      {selectedOrder.billing_email || selectedOrder.profiles?.email || (
                        <span className="text-[#666666]/60 italic font-normal">Not specified</span>
                      )}
                    </span>
                  </div>

                  {/* Contact Phone */}
                  <div className="flex flex-col sm:contents">
                    <span className="text-[#666666] font-medium text-xs select-none">
                      Contact Phone
                    </span>
                    <span className="text-[#111111] font-semibold text-xs mt-1 sm:mt-0" style={longValueStyle}>
                      {selectedOrder.billing_phone || (
                        <span className="text-[#666666]/60 italic font-normal">Not specified</span>
                      )}
                    </span>
                  </div>

                  {/* Address / Coordinates */}
                  <div className="flex flex-col sm:contents">
                    <span className="text-[#666666] font-medium text-xs select-none">
                      Address / Coordinates
                    </span>
                    <span className="text-[#111111] font-semibold text-xs mt-1 sm:mt-0" style={longValueStyle}>
                      {selectedOrder.billing_address || (
                        <span className="text-[#666666]/60 italic font-normal">Not specified</span>
                      )}
                    </span>
                  </div>
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

                {selectedOrder.transaction_id && selectedOrder.payment_status !== "paid" && selectedOrder.payment_status !== "verified" && selectedOrder.status !== "cancelled" && selectedOrder.status !== "completed" && (
                  <div className="flex gap-2.5 pt-2 select-none">
                    <button
                      disabled={orderActionLoading}
                      onClick={() => handleVerifyPayment(selectedOrder.id)}
                      className="flex-1 py-2 bg-[#16A34A] hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg uppercase tracking-wider text-[10px] transition cursor-pointer"
                    >
                      {orderActionLoading ? "Processing..." : "Verify (PAID)"}
                    </button>
                    <button
                      disabled={orderActionLoading}
                      onClick={() => handleRejectPayment(selectedOrder.id)}
                      className="py-2 px-3 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed text-[#DC2626] font-bold rounded-lg uppercase tracking-wider text-[10px] transition cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>

              {/* Digital Activation details input */}
              {(selectedOrder.payment_status === "paid" || selectedOrder.payment_status === "verified" || selectedOrder.status === "processing" || selectedOrder.status === "delivery" || selectedOrder.status === "completed") && (
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
                    disabled={orderActionLoading}
                    onClick={() => handleSaveDeliveryDetails(selectedOrder.id)}
                    className="w-full py-2 bg-[#E10600] hover:bg-[#C80500] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg uppercase tracking-wider text-[10px] transition cursor-pointer"
                  >
                    {orderActionLoading 
                      ? "Updating..." 
                      : (selectedOrder.status === "completed" || selectedOrder.status === "delivery")
                        ? "Update Delivery details"
                        : "Mark as Delivered & Send details"}
                  </button>

                  {selectedOrder.status === "delivery" && (
                    <button
                      disabled={orderActionLoading}
                      onClick={() => handleCompleteOrder(selectedOrder.id)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg uppercase tracking-wider text-[10px] transition cursor-pointer mt-2"
                    >
                      {orderActionLoading ? "Processing..." : "Complete Order"}
                    </button>
                  )}
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
                  disabled={orderActionLoading}
                  onClick={() => handleSaveAdminNotes(selectedOrder.id)}
                  className="w-full py-1.5 bg-zinc-200 hover:bg-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-700 font-bold rounded-lg uppercase tracking-wider text-[9px] transition cursor-pointer"
                >
                  {orderActionLoading ? "Saving..." : "Save Notes"}
                </button>
              </div>

              {/* Destructive Actions */}
              {selectedOrder.status !== "cancelled" && selectedOrder.status !== "completed" && (
                <div className="pt-2 select-none">
                  <button
                    disabled={orderActionLoading}
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    className="w-full py-2 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed text-[#DC2626] font-bold rounded-lg uppercase tracking-wider text-[10px] transition cursor-pointer flex items-center justify-center gap-1"
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
