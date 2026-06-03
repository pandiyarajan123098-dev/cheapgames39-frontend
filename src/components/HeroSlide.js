import { Link } from "react-router-dom";

export default function HeroSlide({ slide }) {
const isMobile = window.innerWidth < 768;

const positionClass = {
  left: "items-end justify-start pb-20",
  center: "items-center justify-center",
  right: "items-end justify-end pb-20",
  "bottom-left": "items-end justify-start pb-20",
};

return (
<div className="w-full px-4 md:px-6 pt-20 pb-6">

  <div
    className="
      relative
      w-full
      max-w-7xl
      mx-auto
      h-[520px]
      md:h-[650px]
      rounded-3xl
      overflow-hidden
      border border-white/10
      shadow-2xl
    "
  >
    {/* HERO IMAGE */}

    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `url(${
          isMobile
            ? slide.mobileImage
            : slide.desktopImage
        })`,
        
      }}
    />

    {/* OVERLAY */}

    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

    {/* FLOATING CARD */}

    <div
      
    
  className={`relative z-10 h-full flex ${positionClass[slide.position]} px-4 md:px-10`}
>
  <div className="flex flex-col gap-3"></div>

        <div className="inline-block mb-4 px-4 py-2 rounded-full bg-[#B50000]/20 border border-[#B50000]/40">
  <span className="text-[#ff4d4d] text-sm font-semibold tracking-wider">
    {slide.badge}
  </span>
</div>

      <div
        className="
          w-full
          max-w-[320px]
md:max-w-md
          backdrop-blur-xl
          bg-black/40
          border border-white/10
          rounded-3xl
          p-6 md:p-8
          shadow-[0_10px_40px_rgba(0,0,0,0.45)]
        "
      >

        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
          {slide.title}
        </h1>

        <h2 className="text-[#B50000] text-3xl md:text-5xl font-bold leading-tight">
          {slide.highlight}
        </h2>

        <p className="text-gray-300 mt-4 text-sm md:text-base">
          {slide.description}
        </p>

        <div className="flex gap-3 mt-6 flex-wrap">

          <Link to="/games">
            <button className="bg-[#B50000] hover:bg-red-700 px-5 py-3 rounded-full font-semibold transition-all">
              {slide.primaryBtn}
            </button>
          </Link>

          <Link to="/offers">
            <button className="border border-white/20 hover:bg-white hover:text-black px-5 py-3 rounded-full transition-all">
              {slide.secondaryBtn}
            </button>
          </Link>

        </div>

      </div>
    </div>

  </div>

</div>


);
}