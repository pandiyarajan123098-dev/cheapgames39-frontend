import { Link } from "react-router-dom";
import { SearchX, ArrowLeft, ArrowRight, Gamepad2, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans flex flex-col items-center justify-center px-4 sm:px-6 py-20 relative overflow-hidden">

      {/* Subtle background "404" text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span className="text-[20vw] sm:text-[18vw] font-black text-white/[0.025] leading-none tracking-tighter">
          404
        </span>
      </div>

      {/* Subtle red depth accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E00000]/3 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg text-center animate-page-section">

        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-[#111111] border border-white/8 flex items-center justify-center mb-7">
          <SearchX className="w-8 h-8 text-zinc-500" />
        </div>

        {/* Eyebrow */}
        <span className="text-[#E00000] text-xs uppercase font-black tracking-widest block mb-3 select-none">
          Error 404
        </span>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-4">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-sm text-zinc-500 leading-relaxed max-w-sm mx-auto mb-10">
          The page you're looking for doesn't exist or may have moved.
          Check the URL or return to the homepage.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 bg-[#E00000] hover:bg-[#F00000] text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.98] min-h-[44px] w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4 shrink-0" />
            Back to Home
          </Link>
          <Link
            to="/games"
            className="flex items-center gap-2 border border-[#E5E5E5] hover:border-[#D4D4D4] text-[#555555] hover:text-[#111111] hover:bg-[#F5F5F5] font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.98] min-h-[44px] w-full sm:w-auto justify-center"
          >
            <Gamepad2 className="w-4 h-4 shrink-0" />
            Browse Games
          </Link>
        </div>

        {/* Nav hint */}
        <p className="text-[10px] text-zinc-700 mt-8 select-none">
          Looking for something specific?{" "}
          <Link to="/contact" className="text-[#777777] hover:text-[#111111] transition underline underline-offset-2">
            Contact Support
          </Link>
        </p>

      </div>
    </div>
  );
};

export default NotFound;