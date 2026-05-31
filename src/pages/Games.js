import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { GameCard } from "../components/GameCard";

const API = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const Games = () => {
  const navigate = useNavigate();
const [showSuggestions, setShowSuggestions] = useState(false);
const [selectedIndex, setSelectedIndex] = useState(-1);
  const [allGames, setAllGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const limit = 8;

  /* ================= FETCH GAMES ================= */

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/api/games`);
        setAllGames(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load games");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  /* ================= FETCH CATEGORIES ================= */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API}/api/categories`);
        setCategories(res.data || []);
      } catch (err) {
        console.error("Category error:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [search, categoryFilter, sortBy]);


  const suggestions = allGames
  .filter((game) =>
    game.title?.toLowerCase().includes(search.toLowerCase())
  )
  .slice(0, 5);

  /* ================= FILTER ================= */

  const filteredGames = useMemo(() => {
    let filtered = [...allGames];

    if (search) {
      filtered = filtered.filter((game) =>
        game.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(
        (game) => String(game.category_id) === String(categoryFilter)
      );
    }

    if (sortBy === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [allGames, search, categoryFilter, sortBy]);

  const totalPages = Math.ceil(filteredGames.length / limit);

  const paginatedGames = filteredGames.slice(
    page * limit,
    page * limit + limit
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-28 pb-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl md:text-6xl font-bold uppercase mb-10 text-white">
          EXPLORE <span className="text-[#B50000]">GAMES</span>
        </h1>

        {/* Search / Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">

          <div className="relative">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

  <input
  type="text"
  placeholder="Search games..."
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  }}
  onFocus={() => setShowSuggestions(true)}
  onKeyDown={(e) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }

   if (e.key === "Enter" && selectedIndex >= 0) {
  navigate(`/games/${suggestions[selectedIndex].id}`);
  setShowSuggestions(false);
  setSearch("");
  setSelectedIndex(-1);
}
  }}
  className="w-full bg-[#141414] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-[#B50000] outline-none"
/>

  {showSuggestions && search && (
    <div className="absolute top-full left-0 w-full mt-2 bg-[#141414] border border-white/10 rounded-xl overflow-hidden z-50 shadow-xl">
      {suggestions.map((game, index) => (
        <div
          key={game.id}
       onClick={() => {
  navigate(`/games/${game.id}`);
  setSearch("");
  setShowSuggestions(false);
  setSelectedIndex(-1);
}}
          className={`flex items-center gap-3 p-3 cursor-pointer transition ${
  selectedIndex === index
    ? "bg-[#B50000]"
    : "hover:bg-[#B50000]"
}`}
        >
          <img
            src={game.image_url}
            alt={game.title}
            className="w-12 h-12 rounded object-cover"
          />

          <span className="text-white text-sm">
            {game.title}

           
          </span>
        </div>
      ))}
    </div>
  )}
</div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white"
          >
            <option value="">Sort By</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
        </div>

        {/* Loading */}
       {loading && (
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
    {[...Array(8)].map((_, index) => (
      <div
        key={index}
        className="bg-[#141414] rounded-xl overflow-hidden border border-white/10 animate-pulse"
      >
        <div className="h-52 bg-[#222]"></div>

        <div className="p-4">
          <div className="h-4 bg-[#222] rounded mb-3"></div>
          <div className="h-4 bg-[#222] rounded w-2/3 mb-4"></div>

          <div className="h-6 bg-[#222] rounded w-1/3"></div>
        </div>
      </div>
    ))}
  </div>
)}

        {/* Error */}
        {error && (
          <div className="text-center text-red-500 py-20">
            {error}
          </div>
        )}

        {/* Grid */}
        {!loading && paginatedGames.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
            {paginatedGames.map((game) => (
              <div
                key={game.id}
                onClick={() => navigate(`/games/${game.id}`)}
                className="cursor-pointer"
              >
                <GameCard game={game} />
              </div>
            ))}
          </div>
        )}

        {/* No Games */}
        {!loading && paginatedGames.length === 0 && !error && (
          <div className="text-center text-gray-400 py-20">
            No games found
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-6 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="bg-[#141414] text-white px-6 py-3 rounded-xl border border-white/10 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-gray-400">
              Page {page + 1} of {totalPages}
            </span>

            <button
              onClick={() =>
                setPage((p) => Math.min(totalPages - 1, p + 1))
              }
              disabled={page >= totalPages - 1}
              className="bg-[#141414] text-white px-6 py-3 rounded-xl border border-white/10 disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;