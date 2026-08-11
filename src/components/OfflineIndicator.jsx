import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";

/**
 * OfflineIndicator — shows a compact banner when browser goes offline.
 * Shows a brief "Back Online" confirmation when connection is restored.
 * Renders nothing when online and no recent change occurred.
 */
const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setShowBackOnline(false);
    };

    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowBackOnline(true);
        // Auto-hide "Back Online" after 3 seconds
        setTimeout(() => {
          setShowBackOnline(false);
          setWasOffline(false);
        }, 3000);
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [wasOffline]);

  // Nothing to show
  if (isOnline && !showBackOnline) return null;

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider shadow-xl transition-all duration-300 select-none ${
        !isOnline
          ? "bg-[#1a1a1a] border-red-500/20 text-red-400"
          : "bg-[#1a1a1a] border-emerald-500/20 text-emerald-400"
      }`}
      role="status"
      aria-live="polite"
    >
      {!isOnline ? (
        <>
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>You're offline — some features may be unavailable</span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4 shrink-0" />
          <span>Back Online</span>
        </>
      )}
    </div>
  );
};

export default OfflineIndicator;
