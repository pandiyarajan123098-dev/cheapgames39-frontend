import React from "react";
import { House as Home, ArrowClockwise as RefreshCw, Warning as AlertCircle } from "@phosphor-icons/react";

/**
 * ErrorBoundary — catches uncaught React render/lifecycle errors.
 * Shows a customer-friendly fallback. Never exposes technical details.
 * Developer errors are logged to console only in development.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log to console in development only — never expose to user
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080808] text-white font-sans flex flex-col items-center justify-center px-4 sm:px-6 py-20 relative">

          {/* Subtle depth accent */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#E00000]/3 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 w-full max-w-md text-center">
            {/* Icon */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-[#111111] border border-white/8 flex items-center justify-center mb-7">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>

            <span className="text-[#E00000] text-xs uppercase font-black tracking-widest block mb-3 select-none">
              Unexpected Error
            </span>

            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-4">
              Something Went Wrong
            </h1>

            <p className="text-sm text-zinc-500 leading-relaxed max-w-sm mx-auto mb-10">
              The page couldn't be displayed correctly.
              Please reload the page or return to the homepage.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 bg-[#E00000] hover:bg-[#F00000] text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.98] min-h-[44px] w-full sm:w-auto justify-center"
              >
                <RefreshCw className="w-4 h-4 shrink-0" />
                Reload Page
              </button>
              <button
                onClick={this.handleHome}
                className="flex items-center gap-2 border border-white/8 hover:border-white/20 text-zinc-300 hover:text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.98] min-h-[44px] w-full sm:w-auto justify-center"
              >
                <Home className="w-4 h-4 shrink-0" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
