import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
{
category: "Racing Games",
game: "Forza Horizon 5",
description:
"Experience the ultimate open-world racing adventure.",
video: "/videos/horizon5.mp4",
},
{
category: "Sports Games",
game: "WWE 2K25",
description:
"Step into the ring with the latest WWE superstars.",
video: "/videos/wwwe25.mp4",
},
{
  category: "Action Games",
  game: "Red Dead Redemption 2",
  description:
    "Explore the Wild West in an epic open-world adventure.",
  video: "/videos/rdr20.mp4",
},
{
category: "Shooter Games",
game: "Battlefield 2042",
description:
"Massive battles and next-generation warfare.",
video: "/videos/2042.mp4",
},
{
category: "Horror Games",
game: "Resident Evil 4",
description:
"Survive one of the greatest horror experiences ever made.",
video: "/videos/RE44.mp4",
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

    {/* CATEGORY */}
    <div className="text-center mb-8">
      <h2 className="text-3xl md:text-5xl font-bold">
        {slide.category}
      </h2>

      <p className="text-gray-400 mt-3">
        {slide.description}
      </p>
    </div>

    {/* SLIDER */}
    <div className="relative">

      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 p-3 rounded-full"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 p-3 rounded-full"
      >
        <ChevronRight size={24} />
      </button>

      <div className="relative rounded-3xl overflow-hidden border border-white/10">

                <video
  key={slide.video}
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  className="w-full h-[280px] md:h-[550px] object-cover"
>

          <source src={slide.video} type="video/mp4" />
        </video>


        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 p-6 md:p-10">

          <span className="bg-[#B50000] px-4 py-2 rounded-full text-sm font-semibold">
            ⭐ Featured Game
          </span>

          <h3 className="text-3xl md:text-5xl font-bold mt-4">
            {slide.game}
          </h3>

          <p className="text-gray-300 mt-3 max-w-2xl">
            {slide.description}
          </p>

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