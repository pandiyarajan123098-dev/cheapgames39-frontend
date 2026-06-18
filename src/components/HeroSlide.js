import { Link } from "react-router-dom";

export default function HeroSlide({ slide }) {
  const isMobile = window.innerWidth < 768;

  return (
    <div className="w-full px-4 md:px-6 pt-16 pb-8">
      <div className="relative w-full max-w-7xl mx-auto h-[500px] md:h-[650px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">

        {/* IMAGE */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${
              isMobile ? slide.mobileImage : slide.desktopImage
            })`,
          }}
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/30" />

        {/* CONTENT */}
        <div className="relative z-10 h-full flex items-end px-5 pb-10">

          <div className="w-full max-w-[320px] md:max-w-[380px] bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">

            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              {slide.title}
            </h1>

            <h2 className="text-red-600 text-3xl md:text-5xl font-bold leading-tight">
              {slide.highlight}
            </h2>

            <p className="text-white mt-4 text-lg font-bold">
              {slide.description}
            </p>

            <div className="mt-6">
              <Link to="/games">
                <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full font-semibold transition-all">
                  {slide.primaryBtn}
                </button>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}