import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    category: "Racing Games",
    games: ["Forza Horizon 5", "Assetto Corsa"],
    description:
      "Experience high-speed racing and realistic driving physics.",
    video1: "/videos/trailer1.mp4",
    video2: "/videos/trailer1.mp4",
  },
  {
    category: "Sports Games",
    games: ["WWE 2K25", "Cricket 24"],
    description:
      "Step into the ring or dominate the cricket field.",
    video1: "/videos/wwe2k25.mp4",
    video2: "/videos/cricket24.mp4",
  },
  {
    category: "Shooter Games",
    games: ["Call of Duty", "Battlefield 2042"],
    description:
      "Intense firefights and action-packed multiplayer battles.",
    video1: "/videos/cod.mp4",
    video2: "/videos/battlefield.mp4",
  },
  {
    category: "Action Games",
    games: ["GTA V", "Red Dead Redemption 2"],
    description:
      "Explore huge worlds and immersive stories.",
    video1: "/videos/gta5.mp4",
    video2: "/videos/rdr2.mp4",
  },
  {
    category: "Horror Games",
    games: ["Resident Evil 4", "Outlast"],
    description:
      "Survive terrifying adventures and horror experiences.",
    video1: "/videos/re4.mp4",
    video2: "/videos/outlast.mp4",
  },
];

export default function CategorySlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[current];
const nextSlide = () => {
  setCurrent((prev) => (prev + 1) % slides.length);
};

const prevSlide = () => {
  setCurrent(
    (prev) => (prev - 1 + slides.length) % slides.length
  );
};
  return (
    <section className="py-20 px-6 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto">

        <div className="relative rounded-3xl overflow-hidden border border-white/10">
<button
  onClick={prevSlide}
  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 p-3 rounded-full"
>
  <ChevronLeft size={24} />
</button>

<button
  onClick={nextSlide}
  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 p-3 rounded-full"
>
  <ChevronRight size={24} />
</button>
        <div className="grid md:grid-cols-2 gap-4 p-4">

  <div className="relative overflow-hidden rounded-2xl">
    <video
      key={slide.video1}
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-[250px] md:h-[450px] object-cover"
    >
      <source src={slide.video1} type="video/mp4" />
    </video>

    <div className="absolute bottom-4 left-4 bg-black/70 px-4 py-2 rounded-full">
      🔥 {slide.games[0]}
    </div>
  </div>

  <div className="relative overflow-hidden rounded-2xl">
    <video
      key={slide.video2}
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-[250px] md:h-[450px] object-cover"
    >
      <source src={slide.video2} type="video/mp4" />
    </video>

    <div className="absolute bottom-4 left-4 bg-black/70 px-4 py-2 rounded-full">
      ⭐ {slide.games[1]}
    </div>
  </div>

</div>

          <div className="absolute inset-0 bg-black/60" />

          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">

            <h2 className="text-5xl font-bold mb-4">
              {slide.category}
            </h2>

            <div className="flex gap-4 mb-4 flex-wrap justify-center">
              {slide.games.map((game) => (
                <span
                  key={game}
                  className="bg-[#B50000] px-4 py-2 rounded-full"
                >
                  {game}
                </span>
              ))}
            </div>

            <p className="text-gray-300 max-w-xl">
              {slide.description}
            </p>

          </div>
        </div>
<div className="flex justify-center gap-3 mt-6">
  {slides.map((_, index) => (
    <button
      key={index}
      onClick={() => setCurrent(index)}
      className={`w-3 h-3 rounded-full transition ${
        current === index
          ? "bg-[#B50000]"
          : "bg-gray-600"
      }`}
    />
  ))}
</div>

      </div>
    </section>
  );
}