import { Link } from "react-router-dom";

export default function HeroSlide({ slide }) {
  const isMobile = window.innerWidth < 768;

  return (
    <div className="w-full px-4 md:px-6 pt-16 pb-4">
      <div className="relative w-full max-w-7xl mx-auto h-[380px] md:h-[600px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">

        {/* IMAGE */}
        <div
          className="absolute inset-0 bg-cover bg-center animate-fade-in"
          style={{
            backgroundImage: `url(${
              isMobile ? slide.mobileImage : slide.desktopImage
            })`,
          }}
        />

        {/* DARK OVERLAY WITH GRADIENT FOR BETTER TEXT READABILITY */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

        {/* CONTENT */}
        <div className="relative z-10 h-full flex items-end px-6 pb-8 md:pb-12">

          <div className="w-full max-w-[320px] md:max-w-[420px] bg-black/45 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">

            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              {slide.title}
            </h1>

            <h2 className="text-red-600 text-3xl md:text-5xl font-bold leading-tight">
              {slide.highlight}
            </h2>

            <p className="text-white mt-4 text-lg font-bold">
              {slide.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link to="/games">
                <button className="bg-[#B50000] hover:bg-[#D00000] px-6 py-3 rounded-full font-bold transition-all text-sm uppercase tracking-wider shadow-lg hover:shadow-[#B50000]/20">
                  {slide.primaryBtn}
                </button>
              </Link>
              {slide.secondaryBtn && (
                <Link to="/offers">
                  <button className="bg-transparent border border-white/20 hover:border-white hover:bg-white/5 px-6 py-3 rounded-full font-bold transition-all text-sm uppercase tracking-wider">
                    {slide.secondaryBtn}
                  </button>
                </Link>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}