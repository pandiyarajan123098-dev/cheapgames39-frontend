/**
 * CG39 Notification Helpers
 * Wraps Sonner's toast with standardised CG39 messaging.
 * Never expose raw API errors, Supabase messages, stack traces or tokens.
 *
 * Usage:
 *   import { notify } from '../utils/notify';
 *   notify.addedToCart(game.title);
 *   notify.error('Action failed', 'We couldn\'t process your request.');
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { CheckCircle, X, ArrowRight } from '@phosphor-icons/react';

/* ─── Durations (ms) ──────────────────────────────────────────────── */
const DUR = {
  success: 2800,
  info:    2800,
  warning: 3500,
  error:   4500,
};

const CartToast = ({ tId, title, imageUrl }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      toast.dismiss(tId);
    }, 180);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        toast.dismiss(tId);
      }, 180);
    }, 3320); // auto dismiss after 3.5s total (3320ms + 180ms exit)

    return () => clearTimeout(timer);
  }, [tId]);

  return createPortal(
    <div 
      role="status" 
      className={`cg39-custom-toast ${isExiting ? 'exit' : ''}`}
    >
      <div className="flex gap-3 items-start w-full pr-4">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title || "Game Cover"} 
            className="cg39-toast-thumbnail" 
          />
        ) : (
          <CheckCircle 
            className="cg39-toast-icon-check" 
            weight="bold" 
          />
        )}
        <div className="flex flex-col min-w-0 flex-1 leading-normal">
          <span className="cg39-toast-title">Added to cart</span>
          {title && <span className="cg39-toast-product">"{title}"</span>}
          <a 
            href="/cart" 
            className="cg39-toast-link"
            aria-label="View shopping cart"
          >
            View Cart <ArrowRight className="w-3.5 h-3.5" weight="bold" />
          </a>
        </div>
      </div>
      <button
        onClick={handleDismiss}
        className="cg39-toast-close"
        aria-label="Close cart notification"
      >
        <X className="w-3.5 h-3.5" weight="bold" />
      </button>
    </div>,
    document.body
  );
};

/* ─── Cart ────────────────────────────────────────────────────────── */
export const notify = {
  /** Game successfully added to cart */
  addedToCart: (title, imageUrl) =>
    toast.custom((tId) => (
      <CartToast tId={tId} title={title} imageUrl={imageUrl} />
    ), {
      duration: Infinity,
      id: `cart-add-${title}`,
    }),

  /** Game removed from cart */
  removedFromCart: (title) =>
    toast.info(title ? `"${title}" removed from cart.` : 'Removed from cart.', {
      duration: DUR.info,
      id: `cart-remove-${title}`,
    }),

  /** Attempt to use cart without being logged in */
  loginRequiredCart: () =>
    toast.warning('Sign in to add games to your cart.', {
      duration: DUR.warning,
      id: 'login-required-cart',
    }),

  /* ─── Wishlist ─────────────────────────────────────────────────── */

  /** Game saved to wishlist */
  addedToWishlist: (title) =>
    toast.success(title ? `"${title}" saved to wishlist.` : 'Added to wishlist.', {
      duration: DUR.success,
      id: `wishlist-add-${title}`,
    }),

  /** Game removed from wishlist */
  removedFromWishlist: (title) =>
    toast.info(title ? `"${title}" removed from wishlist.` : 'Removed from wishlist.', {
      duration: DUR.info,
      id: `wishlist-remove-${title}`,
    }),

  /** Attempt to use wishlist without being logged in */
  loginRequiredWishlist: () =>
    toast.warning('Sign in to manage your wishlist.', {
      duration: DUR.warning,
      id: 'login-required-wishlist',
    }),

  /* ─── Copy actions ─────────────────────────────────────────────── */

  /** Any clipboard copy action */
  copied: (label = 'Copied') =>
    toast.success(`${label} copied to clipboard.`, {
      duration: DUR.info,
      id: `copied-${label}`,
    }),

  /* ─── Auth ─────────────────────────────────────────────────────── */

  loginSuccess: (name) =>
    toast.success(name ? `Welcome back, ${name}!` : 'Welcome back!', {
      duration: DUR.success,
      id: 'login-success',
    }),

  logoutSuccess: () =>
    toast.success('Signed out successfully.', {
      duration: DUR.success,
      id: 'logout-success',
    }),

  signupSuccess: () =>
    toast.success('Account created successfully.', {
      duration: DUR.success,
      id: 'signup-success',
    }),

  /* ─── Order / Payment ──────────────────────────────────────────── */

  orderCreated: () =>
    toast.success('Order created. You can now submit your payment reference.', {
      duration: DUR.success,
      id: 'order-created',
    }),

  paymentSubmitted: () =>
    toast.success('Payment reference submitted. Your order is awaiting verification.', {
      duration: DUR.success + 1000,
      id: 'payment-submitted',
    }),

  /* ─── Review ───────────────────────────────────────────────────── */

  reviewSubmitted: () =>
    toast.success('Your review has been submitted for moderation.', {
      duration: DUR.success,
      id: 'review-submitted',
    }),

  /* ─── Contact form ─────────────────────────────────────────────── */

  messageSent: () =>
    toast.success('Message sent. We\'ll get back to you soon.', {
      duration: DUR.success,
      id: 'message-sent',
    }),

  /* ─── Generic success / info / warning / error ─────────────────── */

  success: (message, description) =>
    toast.success(description ? `${message}\n${description}` : message, {
      duration: DUR.success,
    }),

  info: (message) =>
    toast.info(message, { duration: DUR.info }),

  warning: (message) =>
    toast.warning(message, { duration: DUR.warning }),

  /**
   * Show a customer-safe error.
   * Never pass raw Supabase / API errors as `message`.
   */
  error: (message = 'Something went wrong. Please try again.') =>
    toast.error(message, { duration: DUR.error }),

  /** Network / connectivity failure */
  networkError: () =>
    toast.error('Connection problem. Check your internet and try again.', {
      duration: DUR.error,
      id: 'network-error',
    }),

  /** Generic API action failure */
  actionFailed: (context = 'action') =>
    toast.error(`We couldn't complete that ${context}. Please try again.`, {
      duration: DUR.error,
    }),
};

export default notify;
