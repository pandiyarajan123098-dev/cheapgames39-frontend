import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CaretRight as ChevronRight,
  ChatCircle as MessageCircle,
  FileText,
  ShieldCheck,
  Lock as LockKeyhole,
  Question as HelpCircle,
} from "@phosphor-icons/react";
import { Breadcrumbs } from "./Breadcrumbs";

/**
 * Shared layout wrapper for all CG39 legal / trust pages.
 *
 * Props:
 *  - breadcrumb: string — e.g. "Terms & Conditions"
 *  - icon: LucideIcon component
 *  - title: ReactNode — page heading (can include a <span> for red accent)
 *  - subtitle: string — short description shown below title
 *  - lastUpdated: string | null — "August 2026" etc., omit if not available
 *  - toc: Array<{ id: string, label: string }> — table of contents entries
 *  - children: ReactNode — the legal content
 */
const LegalLayout = ({
  breadcrumb,
  icon: Icon,
  title,
  subtitle,
  lastUpdated,
  toc = [],
  children,
}) => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const OTHER_LEGAL = [
    { label: "Terms & Conditions", to: "/terms",   icon: FileText },
    { label: "Privacy Policy",     to: "/privacy", icon: LockKeyhole },
    { label: "FAQ",                to: "/faq",     icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-[76px] md:pt-[82px] pb-20 px-4 sm:px-6 font-sans">
      <div className="max-w-[1000px] mx-auto">

        {/* BREADCRUMB */}
        <Breadcrumbs paths={[{ label: breadcrumb }]} />

        {/* PAGE HEADER */}
        <div className="mb-10">
          {Icon && (
            <div className="w-11 h-11 rounded-xl bg-[#E00000]/8 border border-[#E00000]/15 flex items-center justify-center mb-4">
              <Icon className="w-5 h-5 text-[#E00000]" />
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-tight mb-3 select-none">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xl select-none">{subtitle}</p>
          )}
          {lastUpdated && (
            <p className="text-[11px] text-zinc-600 mt-3 uppercase font-bold tracking-widest select-none">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>

        {/* LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* STICKY SIDEBAR */}
          {toc.length > 0 && (
            <aside className="lg:sticky lg:top-28 lg:w-56 shrink-0 self-start">
              <div className="bg-[#111111] border border-white/8 rounded-2xl p-5 flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 select-none">Contents</span>
                {toc.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className="flex items-center gap-2.5 text-left text-xs text-zinc-400 hover:text-white font-semibold transition py-1 group"
                  >
                    <span className="text-[10px] text-zinc-700 font-black w-5 shrink-0 select-none group-hover:text-zinc-500 transition">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Other legal links */}
              <div className="bg-[#111111] border border-white/8 rounded-2xl p-5 flex flex-col gap-2 mt-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 select-none">Legal</span>
                {OTHER_LEGAL.map(({ label, to, icon: LinkIcon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white font-semibold transition py-0.5 group"
                  >
                    <LinkIcon className="w-3 h-3 text-zinc-600 group-hover:text-[#E00000] transition shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>
            </aside>
          )}

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">

            {/* Legal content card */}
            <article className="bg-[#111111] border border-white/8 rounded-2xl p-6 sm:p-8 prose-custom">
              {children}
            </article>

            {/* SUPPORT CTA */}
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 select-none">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black uppercase tracking-tight text-white mb-1">Need Help?</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Questions about an order, policy or payment? Our support team is ready to assist.
                </p>
              </div>
              <Link
                to="/contact"
                className="flex items-center gap-2 bg-[#E00000]/8 hover:bg-[#E00000]/15 border border-[#E00000]/15 hover:border-[#E00000]/35 text-[#E00000] rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition shrink-0 min-h-[44px]"
                aria-label="Go to Contact Support page"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Support
              </Link>
            </div>

            {/* Related legal links — mobile only (sidebar handles desktop) */}
            {toc.length > 0 && (
              <div className="lg:hidden bg-[#111111] border border-white/8 rounded-2xl p-5 flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 select-none">Other Legal Pages</span>
                {OTHER_LEGAL.map(({ label, to, icon: LinkIcon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white font-semibold transition py-0.5 group"
                  >
                    <LinkIcon className="w-3 h-3 text-zinc-600 group-hover:text-[#E00000] transition shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Shared prose elements ──────────────────────────────────────── */

export const Section = ({ id, number, title, children }) => (
  <section id={id} className="scroll-mt-28 mb-8 last:mb-0">
    <h2 className="flex items-baseline gap-2 text-base sm:text-lg font-black uppercase tracking-tight text-white mb-3 pb-2 border-b border-white/5 select-none">
      {number && <span className="text-[11px] text-zinc-600 font-black">{number}</span>}
      {title}
    </h2>
    <div className="text-sm text-zinc-400 leading-relaxed flex flex-col gap-3">
      {children}
    </div>
  </section>
);

export const Callout = ({ children }) => (
  <div className="border-l-2 border-[#E00000]/40 bg-[#E00000]/4 rounded-r-xl px-4 py-3 text-sm text-zinc-300 leading-relaxed my-2">
    {children}
  </div>
);

export const InfoCard = ({ icon: Icon, label, children }) => (
  <div className="bg-[#151515] border border-white/8 rounded-xl p-4 flex flex-col gap-2 my-2">
    {(Icon || label) && (
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-zinc-500 shrink-0" />}
        {label && <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 select-none">{label}</span>}
      </div>
    )}
    <div className="text-sm text-zinc-400 leading-relaxed">{children}</div>
  </div>
);

export default LegalLayout;
