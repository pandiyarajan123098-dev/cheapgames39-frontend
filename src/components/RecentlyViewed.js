import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RecentlyViewed = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const recent =
      JSON.parse(localStorage.getItem("recentGames")) || [];

    setGames(recent.slice(0, 5));
  }, []);

  if (games.length === 0) return null;

  return (
    <section className="py-12 px-6 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">
          Recently Viewed
        </h2>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {games.map((game) => (
            <Link
              key={game.id}
              to={`/games/${game.id}`}
              className="min-w-[220px] bg-[#141414] rounded-xl overflow-hidden border border-white/10 hover:border-[#B50000] transition-all duration-300 hover:scale-105"
            >
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-32 object-cover"
              />

              <div className="p-3">
                <h3 className="text-white text-sm font-semibold line-clamp-2">
                  {game.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;