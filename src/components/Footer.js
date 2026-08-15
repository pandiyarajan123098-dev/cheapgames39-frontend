import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  CreditCard,
  Headset,
  EnvelopeSimple,
  ArrowRight,
  InstagramLogo,
  DiscordLogo,
} from '@phosphor-icons/react';
import logo from "../logo.png";
import { FaWhatsapp } from 'react-icons/fa';

/* ─── Design tokens ──────────────────────────────────────────────────── */
const C = {
  bgMain:       '#2B2B2D',   // main footer body
  bgStrip:      '#222223',   // newsletter top strip
  bgCard:       '#333336',   // icon bg / trust card
  border:       'rgba(255,255,255,0.10)',
  borderLight:  'rgba(255,255,255,0.07)',
  textPrimary:  '#FFFFFF',
  textSecondary:'#B8B8B8',
  textMuted:    '#888888',
  accent:       '#FF0000',
  accentHover:  '#CC0000',
};

/* ─── Tiny helpers ───────────────────────────────────────────────────── */
const NavLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      style={{ color: C.textSecondary, textDecoration: 'none', fontSize: 13, fontWeight: 500, transition: 'color 150ms' }}
      onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
      onMouseLeave={e => (e.currentTarget.style.color = C.textSecondary)}
    >
      {children}
    </Link>
  </li>
);

const ColHead = ({ children }) => (
  <h4 style={{
    color: C.textPrimary,
    fontSize: 10,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    marginBottom: 16,
    marginTop: 0,
  }}>
    {children}
  </h4>
);

export const Footer = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleLogout = async () => {
    try { await logout(); navigate('/'); }
    catch (err) { console.error(err); }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Newsletter backend not yet supported — intentionally no-op
  };

  /* ─────────────────────────────────────────────────────────────────── */
  return (
    <footer style={{ fontFamily: 'inherit', userSelect: 'none' }}>

      {/* ══ 1. NEWSLETTER STRIP ══════════════════════════════════════ */}
      <div style={{ background: C.bgStrip, borderTop: `1px solid ${C.border}` }}>
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '36px 24px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}>
          <div style={{ maxWidth: 480 }}>
            <h3 style={{
              color: C.textPrimary,
              fontSize: 22,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.3px',
              margin: '0 0 6px',
            }}>
              Get the Best Deals
            </h3>
            <p style={{ color: C.textSecondary, fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              Stay updated with new games, exclusive deals and special offers.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
          >
            {/* Email input — full width on mobile */}
            <div className="relative flex items-center w-full sm:w-[280px]">
              <EnvelopeSimple
                weight="bold"
                style={{ position: 'absolute', left: 14, width: 16, height: 16, color: C.textMuted, pointerEvents: 'none' }}
              />
              <input
                type="email"
                required
                placeholder="Email address..."
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full"
                style={{
                  height: 46,
                  paddingLeft: 40,
                  paddingRight: 16,
                  background: 'rgba(255,255,255,0.07)',
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  color: C.textPrimary,
                  fontSize: 13,
                  fontWeight: 500,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = C.accent)}
                onBlur={e => (e.target.style.borderColor = C.border)}
              />
            </div>

            {/* SIGN UP button — full width on mobile, auto on desktop */}
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2"
              style={{
                height: 46,
                padding: '0 22px',
                background: C.accent,
                border: 'none',
                borderRadius: 10,
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'background 150ms',
                flexShrink: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
              onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
            >
              Sign Up
              <ArrowRight weight="bold" style={{ width: 14, height: 14 }} />
            </button>
          </form>
        </div>
      </div>

      {/* ══ 2. MAIN BODY ═════════════════════════════════════════════ */}
      <div style={{ background: C.bgMain }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 0' }}>

          {/* ── Trust strip ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 24,
            paddingBottom: 36,
            borderBottom: `1px solid ${C.border}`,
          }}>
            {[
              { icon: ShieldCheck, title: 'Secure Checkout',   sub: 'SSL Encrypted Safe Gateways' },
              { icon: CreditCard,  title: 'UPI Payment',       sub: 'Instant Verification Transfer' },
              { icon: Headset,     title: 'Customer Support',  sub: 'Dedicated Support Helpdesk' },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon weight="bold" style={{ width: 20, height: 20, color: C.textPrimary }} />
                </div>
                <div>
                  <p style={{ color: C.textPrimary, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px' }}>
                    {title}
                  </p>
                  <p style={{ color: C.textMuted, fontSize: 12, margin: 0 }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Nav columns ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '40px 32px',
            padding: '40px 0',
            borderBottom: `1px solid ${C.border}`,
          }}>

            {/* SHOP */}
            <div>
              <ColHead>Shop</ColHead>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <NavLink to="/games">All Games</NavLink>
                <NavLink to="/offers">Best Deals</NavLink>
                <NavLink to="/games?maxPrice=49">Under ₹49</NavLink>
                <NavLink to="/games?maxPrice=99">Under ₹99</NavLink>
                <NavLink to="/games">Categories</NavLink>
              </ul>
            </div>

            {/* ACCOUNT */}
            <div>
              <ColHead>Account</ColHead>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/dashboard">Orders</NavLink>
                <NavLink to="/wishlist">Wishlist</NavLink>
                <NavLink to="/cart">Cart</NavLink>
                {user ? (
                  <li>
                    <button
                      onClick={handleLogout}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        color: C.textSecondary,
                        fontSize: 13,
                        fontWeight: 500,
                        transition: 'color 150ms',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.textSecondary)}
                    >
                      Logout
                    </button>
                  </li>
                ) : (
                  <NavLink to="/login">Login</NavLink>
                )}
              </ul>
            </div>

            {/* SUPPORT */}
            <div>
              <ColHead>Support</ColHead>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <NavLink to="/faq">FAQ</NavLink>
                <NavLink to="/contact">Contact</NavLink>
                <NavLink to="/order-status">Order Tracking</NavLink>
                <NavLink to="/contact">Email Support</NavLink>
              </ul>
            </div>

            {/* LEGAL */}
            <div>
              <ColHead>Legal</ColHead>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <NavLink to="/terms">Terms</NavLink>
                <NavLink to="/privacy">Privacy</NavLink>
                <NavLink to="/terms">Refund Policy</NavLink>
              </ul>
            </div>

          </div>

          {/* ── Brand + Trust card ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 32,
            padding: '36px 0',
            borderBottom: `1px solid ${C.border}`,
            alignItems: 'center',
          }}>
            {/* Brand */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={logo} alt="CG39 Logo" style={{ width: 32, height: 32, objectFit: 'contain', flexShrink: 0 }} />
                <span style={{ color: C.textPrimary, fontWeight: 900, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  CG39 Game Store
                </span>
              </div>
              <p style={{ color: C.accent, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                Great games. Better prices.
              </p>
              <p style={{ color: C.textSecondary, fontSize: 12, lineHeight: 1.7, margin: 0, maxWidth: 380 }}>
                Affordable digital PC gaming marketplace with simple ordering, secure payment and customer support.
              </p>

              {/* Social icons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                {[
                  {
                    href: 'https://www.instagram.com/cheapgames39.official?igsh=MTUxajEzMjNuZWY2MA==',
                    label: 'Instagram',
                    icon: InstagramLogo,
                  },
                  {
                    href: 'https://discord.gg/d9JKQgH5g',
                    label: 'Discord',
                    icon: DiscordLogo,
                  },
                ].map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: C.bgCard,
                      border: `1px solid ${C.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: C.textSecondary,
                      transition: 'background 150ms, color 150ms, border-color 150ms',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = C.accent;
                      e.currentTarget.style.borderColor = 'rgba(255,0,0,0.35)';
                      e.currentTarget.style.background = 'rgba(255,0,0,0.08)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = C.textSecondary;
                      e.currentTarget.style.borderColor = C.border;
                      e.currentTarget.style.background = C.bgCard;
                    }}
                  >
                    <Icon weight="bold" style={{ width: 18, height: 18 }} />
                  </a>
                ))}
              </div>
            </div>

            {/* Trust card */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 16,
              padding: '20px 22px',
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              maxWidth: 380,
              marginLeft: 'auto',
            }}>
              <ShieldCheck weight="bold" style={{ width: 28, height: 28, color: C.textPrimary, flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ color: C.textPrimary, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 5px' }}>
                  Secure &amp; Trusted
                </p>
                <p style={{ color: C.textSecondary, fontSize: 12, lineHeight: 1.6, margin: 0 }}>
                  Your information and transactions are handled securely.
                </p>
              </div>
            </div>
          </div>

          {/* ── Copyright bar ── */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            padding: '18px 0',
          }}>
            <p style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', margin: 0 }}>
              © 2026 CG39. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: 24 }}>
              {[
                { label: 'Terms', to: '/terms' },
                { label: 'Privacy', to: '/privacy' },
                { label: 'Refund Policy', to: '/terms' },
              ].map(({ label, to }) => (
                <Link
                  key={to + label}
                  to={to}
                  style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', textDecoration: 'none', transition: 'color 150ms' }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ══ FLOATING WHATSAPP (unchanged) ════════════════════════════ */}
      <a
        href="https://whatsapp.com/channel/0029Vb8WvNiGehEGfRVnMr2T"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        title="Contact us on WhatsApp"
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 bg-[#25D366] hover:bg-[#20ba56] text-white rounded-full w-[52px] h-[52px] md:w-[56px] md:h-[56px] flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 z-40"
      >
        <FaWhatsapp size={26} style={{ color: '#FFFFFF' }} className="shrink-0" />
      </a>
    </footer>
  );
};