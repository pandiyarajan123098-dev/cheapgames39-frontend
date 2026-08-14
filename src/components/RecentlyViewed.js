import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Trash as Trash2 } from "@phosphor-icons/react";

const RecentlyViewed = () => {
  const { user } = useAuth();
  const [games, setGames] = useState([]);

  const getStorageKey = () => {
    return user ? `cg39_recent_${user.id}` : "cg39_guest_recent";
  };

  useEffect(() => {
    const storageKey = user ? `cg39_recent_${user.id}` : "cg39_guest_recent";
    const recent = JSON.parse(localStorage.getItem(storageKey)) || [];
    setGames(recent.slice(0, 4)); // Show 2-4 products
  }, [user]);

  const clearHistory = () => {
    const storageKey = getStorageKey();
    localStorage.removeItem(storageKey);
    setGames([]);
  };

  if (games.length === 0) return null;

  return (
    <section className="py-8 px-4 sm:px-6 bg-white border-b border-[#E5E5E5] animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-[#E5E5E5] relative select-none">
          <div>
            <span className="text-[#E10600] text-[10px] uppercase font-black tracking-widest block mb-0.5">Your History</span>
            <div className="relative inline-block">
              <h2 className="text-base md:text-lg font-black uppercase tracking-tight text-[#1A1A1A]">
                Recently Viewed
              </h2>
              <div className="absolute -bottom-[9px] left-0 w-12 h-[2px] bg-[#E10600]" />
            </div>
          </div>

          <button
            onClick={clearHistory}
            className="text-xs text-gray-500 hover:text-[#E10600] transition flex items-center gap-1 uppercase tracking-wider font-bold"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear History
          </button>
        </div>

        {/* Games Grid (responsive layout, max 4) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {games.map((game) => (
            <Link
              key={game.id}
              to={`/games/${game.id}`}
              className="bg-[#F8F8F8] rounded-2xl overflow-hidden border border-[#E5E5E5] hover:border-[#E10600]/30 hover:shadow-sm transition-all duration-200 flex flex-col hover:-translate-y-0.5 h-[220px]"
            >
              <div className="h-28 overflow-hidden bg-black/5">
                <img 
                  loading="lazy"
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-3 flex flex-col flex-1 justify-between">
                <h4 className="text-[#1A1A1A] text-[11px] font-bold line-clamp-2 leading-snug">
                  {game.title}
                </h4>

                <div className="text-[10px] text-[#E10600] font-semibold mt-1">
                  View Details →
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default RecentlyViewed;
