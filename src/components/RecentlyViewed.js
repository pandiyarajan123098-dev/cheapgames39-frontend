import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RecentlyViewed = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const recent =
      JSON.parse(localStorage.getItem("recentGames")) || [];

    setGames(recent.slice(0, 5));
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("recentGames");
    setGames([]);
  };

  if (games.length === 0) return null;

  return (
    <section className="py-12 px-6 bg-[#0d0d0d] border-t border-white/5">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Continue Browsing
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Pick up where you left off
            </p>
          </div>

          <button
            onClick={clearHistory}
            className="text-sm text-red-500 hover:text-red-400 transition"
          >
            Clear History
          </button>
        </div>

        {/* Games */}
        <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-2">
          {games.map((game) => (
            <Link
              key={game.id}
              to={`/games/${game.id}`}
              className="min-w-[220px] bg-[#141414] rounded-xl overflow-hidden border border-white/10 hover:border-[#B50000] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(181,0,0,0.25)]"
            >
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-32 object-cover"
              />

              <div className="p-3">
                <h3 className="text-white text-sm font-semibold line-clamp-2 min-h-[40px]">
                  {game.title}
                </h3>

                <p className="text-xs text-gray-500 mt-2">
                  Continue Playing →
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default RecentlyViewed;