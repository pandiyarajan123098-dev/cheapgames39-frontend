import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    category: "Racing Games",
    description: "Experience high-speed racing and realistic driving physics.",
    game1: "Forza Horizon 5",
    game2: "Assetto Corsa",
    video1: "/videos/horizon5.mp4",
    video2: "/videos/ac.mp4",
  },
  {
    category: "Sports Games",
    description: "Step into the ring or dominate the cricket field.",
    game1: "WWE 2K25",
    game2: "Cricket 24",
    video1: "/videos/wwwe25.mp4",
    video2: "/videos/cricket224.mp4",
  },
  {
    category: "Action Games",
    description: "Explore huge worlds and immersive stories.",
    game1: "GTA V",
    game2: "Red Dead Redemption 2",
    video1: "/videos/gta55.mp4",
    video2: "/videos/rdr20.mp4",
  },
  {
    category: "Shooter Games",
    description: "Intense firefights and action-packed multiplayer battles.",
    game1: "Call Of Duty",
    game2: "Battlefield 2042",
    video1: "/videos/cood.mp4",
    video2: "/videos/2042aa.mp4",
  },
  {
    category: "Horror Games",
    description: "Survive terrifying adventures and horror experiences.",
    game1: "Resident Evil 4",
    game2: "Outlast",
    video1: "/videos/re4.mp4",
    video2: "/videos/outlast.mp4",
  },
];

export default function CategorySlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 11000);

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
    <section className="py-20 px-4 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto">

        {/* CATEGORY TITLE */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-bold">
            {slide.category}
          </h2>

          <p className="text-gray-400 mt-3">
            {slide.description}
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="relative bg-[#111] border border-white/10 rounded-3xl p-4 md:p-8">

          {/* LEFT BUTTON */}
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/70 p-3 rounded-full"
          >
            <ChevronLeft size={24} />
          </button>

          {/* RIGHT BUTTON */}
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/70 p-3 rounded-full"
          >
            <ChevronRight size={24} />
          </button>

          {/* VIDEOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* VIDEO 1 */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10">
              <video
                key={slide.video1}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-[250px] md:h-[420px] object-cover"
              >
                <source src={slide.video1} type="video/mp4" />
              </video>

              <div className="absolute top-4 left-4 bg-black/70 px-4 py-2 rounded-full text-sm font-semibold">
                ⭐ {slide.game1}
              </div>
            </div>

            {/* VIDEO 2 */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10">
              <video
                key={slide.video2}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-[250px] md:h-[420px] object-cover"
              >
                <source src={slide.video2} type="video/mp4" />
              </video>

              <div className="absolute top-4 left-4 bg-black/70 px-4 py-2 rounded-full text-sm font-semibold">
                ⭐ {slide.game2}
              </div>
            </div>

          </div>
        </div>

        {/* DOTS */}
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