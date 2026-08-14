/**
 * AddToCartButton v3 — CG39 Premium Micro-Animation
 *
 * Physical "game item enters cart" interaction.
 *
 * ARCHITECTURE:
 *  - The flying thumbnail is positioned at top:-42px (above the button).
 *  - The button has NO overflow:hidden — the GameCard's overflow:hidden
 *    provides the natural clip boundary, giving the item a full ~46px arc.
 *  - The item uses the actual game cover as background-image.
 *
 * Phases:
 * ───────────────────────────────────────────────────────
 * P1+P2  Game thumbnail appears & flies into cart    400 ms
 * P3     Cart jitters on receiving item              240 ms
 * P4     Cart → Check crossfade                      220 ms
 * P5     Check held                                  700 ms
 * P6     Check → Cart crossfade                      200 ms
 *                                           Total ~1 760 ms
 *
 * Safety guarantees:
 *  • Existing cart logic runs FIRST; animation only on success
 *  • Animation errors never break cart (full try/catch)
 *  • Rapid-click protection via isAnimating ref
 *  • All timers cleared on unmount (no memory leaks)
 *  • prefers-reduced-motion respected
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import { ShoppingCart, Check } from "@phosphor-icons/react";

// ─── Phase names ─────────────────────────────────────────────────────────────
const P = {
  IDLE:      "idle",
  FLYING:    "flying",     // thumbnail arcs into cart
  RECEIVING: "receiving",  // cart jitter / spring
  TO_CHECK:  "to-check",  // cart → check crossfade
  CHECK:     "check",     // check held
  TO_CART:   "to-cart",   // check → cart crossfade
};

// ─── Timing (ms) — must match CSS animation durations exactly ────────────────
const T = {
  FLY:       400,   // cg39-item-fly duration
  RECEIVE:   240,   // cg39-cart-receive duration
  TO_CHECK:  220,   // cg39-icon-in duration (longest of the pair)
  CHECK:     700,   // check visible hold
  TO_CART:   200,   // cg39-cart-in duration (longest of the pair)
};

/**
 * @param {Function} props.onAddToCart  Existing async cart handler. Must throw on failure.
 * @param {boolean}  props.disabled     Out-of-stock or other disabled state.
 * @param {string}   [props.gameImage]  Game cover URL — shown in the flying thumbnail.
 * @param {string}   [props.className]  Extra Tailwind/CSS classes for the button element.
 */
export const AddToCartButton = ({
  onAddToCart,
  disabled,
  gameImage,
  className = "",
}) => {
  const [phase, setPhase]          = useState(P.IDLE);
  const [localLoading, setLoading] = useState(false);

  // Guard refs — never mutated during render
  const isAnimating = useRef(false);
  const timers      = useRef([]);
  const isMounted   = useRef(true);

  // Cleanup on unmount — prevents stale setState & memory leaks
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  // Safe setState — noop when component is unmounted
  const safeSet = (fn) => {
    if (isMounted.current) fn();
  };

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const after = (fn, delay) => {
    const id = setTimeout(() => {
      if (isMounted.current) fn();
    }, delay);
    timers.current.push(id);
  };

  // Full reset to IDLE
  const reset = useCallback(() => {
    clearTimers();
    isAnimating.current = false;
    safeSet(() => {
      setPhase(P.IDLE);
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 6-phase animation orchestrator
  const runAnimation = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    try {
      safeSet(() => setPhase(P.FLYING));           // P1+P2 — thumbnail flies

      after(() => {
        safeSet(() => setPhase(P.RECEIVING));      // P3 — cart jitter

        after(() => {
          safeSet(() => setPhase(P.TO_CHECK));     // P4 — cart → check

          after(() => {
            safeSet(() => setPhase(P.CHECK));      // P5 — hold check

            after(() => {
              safeSet(() => setPhase(P.TO_CART));  // P6 — check → cart

              after(reset, T.TO_CART);             // back to IDLE
            }, T.CHECK);
          }, T.TO_CHECK);
        }, T.RECEIVE);
      }, T.FLY);

    } catch (err) {
      // Animation failure must never affect cart
      console.warn("[CG39] ATC animation error (non-critical):", err);
      reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  // Click: run cart logic first; animate only on success
  const handleClick = useCallback(async (e) => {
    e.stopPropagation();

    // Prevent animation stacking from rapid clicks
    if (isAnimating.current) return;

    try {
      safeSet(() => setLoading(true));
      await onAddToCart(e);                        // existing cart logic
      safeSet(() => setLoading(false));
      runAnimation();                              // animate ONLY on success
    } catch (err) {
      // Cart failed — no animation, clean reset
      console.error("[CG39] AddToCart error:", err);
      reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onAddToCart, runAnimation, reset]);

  // ── Icon wrapper state class ──────────────────────────────────────────────
  const wrapMod = {
    [P.RECEIVING]: "cg39-atc-icon-wrap--receiving",
    [P.TO_CHECK]:  "cg39-atc-icon-wrap--to-check",
    [P.TO_CART]:   "cg39-atc-icon-wrap--to-cart",
  }[phase] || "";

  // Which icons to render
  const showCart  = phase !== P.CHECK;
  const showCheck = [P.TO_CHECK, P.CHECK, P.TO_CART].includes(phase);
  const isFlying  = phase === P.FLYING;

  // Flying item background — real game cover image or neutral fallback
  const flyingItemStyle = gameImage
    ? { backgroundImage: `url(${gameImage})` }
    : { backgroundColor: "rgba(255,255,255,0.9)" };

  return (
    <button
      disabled={disabled || localLoading}
      onClick={handleClick}
      aria-label="Add to cart"
      className={`cg39-atc-btn ${className}`}
    >
      {/* ── Flying game-cover thumbnail ─────────────────────────────── */}
      {/* Positioned at top:-42px (ABOVE the button) via CSS.           */}
      {/* Travels ~46px downward into the cart during the FLY phase.   */}
      <span
        aria-hidden="true"
        className={`cg39-atc-item${isFlying ? " cg39-atc-item--fly" : ""}`}
        style={flyingItemStyle}
      />

      {/* ── Cart / Check icon stack ─────────────────────────────────── */}
      {/* Cart is shown in IDLE, FLYING, RECEIVING, TO_CHECK, TO_CART. */}
      {/* Check is shown in TO_CHECK, CHECK, TO_CART.                  */}
      <span className={`cg39-atc-icon-wrap ${wrapMod}`}>
        {showCart && (
          <span className="cg39-atc-icon-cart">
            <ShoppingCart className="w-4 h-4" />
          </span>
        )}
        {showCheck && (
          <span className="cg39-atc-icon-check">
            <Check className="w-4 h-4" weight="bold" />
          </span>
        )}
      </span>
    </button>
  );
};
