import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ChatCircle as MessageCircle,
  ShoppingBag,
  CreditCard,
  Envelope as Mail,
  Phone,
  Clock,
  PaperPlane as Send,
  CheckCircle as CheckCircle2,
  CaretDown as ChevronDown,
  CaretRight as ChevronRight,
  InstagramLogo as Instagram,
  ArrowRight,
  Package,
  SquaresFour as LayoutDashboard,
  GameController as Gamepad2,
  House as Home,
} from "@phosphor-icons/react";
import { FaWhatsapp } from "react-icons/fa";
import { Breadcrumbs } from "../components/Breadcrumbs";

const API =
  process.env.REACT_APP_BACKEND_URL ||
  "https://cheapgames39-backend-1.onrender.com";

const WHATSAPP_NUMBER = "916379490178";
const INSTAGRAM_URL = "https://instagram.com/cheapgames39.official";

/* ─── FAQ data (existing content converted to accordion) ────────── */
const FAQ_ITEMS = [
  {
    q: "How fast is delivery?",
    a: "Once your payment is verified, most orders are fulfilled within 5–30 minutes. Delivery details will appear directly in your Order Status page.",
  },
  {
    q: "Is it safe to order from CG39?",
    a: "Yes. All orders use UPI payment verification before credentials are released. Your delivery details are shown only after admin verification.",
  },
  {
    q: "What payment methods are supported?",
    a: "We accept all major UPI apps — GPay, PhonePe, Paytm and any UPI-enabled bank app.",
  },
  {
    q: "How do I check my order status?",
    a: "Visit the Order Status page and enter your Order ID. You can also find your orders in My Account after logging in.",
  },
  {
    q: "I sent payment but didn't receive my order. What do I do?",
    a: "Contact us on WhatsApp with your Order ID and UTR/transaction reference. Our team will verify and resolve it promptly.",
  },
];

/* ─── FAQ accordion item ────────────────────────────────────────── */
const FaqItem = ({ q, a, isOpen, onToggle, index }) => (
  <div className="border border-[#E5E5E5] rounded-xl overflow-hidden">
    <button
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={`faq-answer-${index}`}
      className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-[#F5F5F5] transition-colors duration-150 min-h-[52px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E00000]/50"
    >
      <span className="text-sm font-bold text-[#111111] pr-4">{q}</span>
      <ChevronDown
        className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
    <div
      id={`faq-answer-${index}`}
      className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
    >
      <p className="px-5 py-4 text-sm text-[#555555] leading-relaxed border-t border-[#E5E5E5] bg-[#F8F8F8]">
        {a}
      </p>
    </div>
  </div>
);

/* ─── Main component ─────────────────────────────────────────────── */
const Contact = () => {
  /* Form state — preserved exactly from original */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* FAQ state */
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* Submit — preserved exactly from original */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      toast.error("Unable to send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-[68px] md:pt-[74px] pb-20 font-sans animate-page-section">

      {/* ── BREADCRUMB ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-10">
        <Breadcrumbs paths={[{ label: "Support" }]} />
      </div>

      {/* ── HERO ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-12">
        <div className="max-w-xl">
          <p className="text-[10px] text-[#E00000] uppercase font-black tracking-widest mb-2 select-none">
            Customer Support
          </p>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-3 select-none">
            Need <span className="text-[#E00000]">Help?</span>
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-sm select-none">
            We're here to help with your orders, payments and purchases.
          </p>
        </div>
      </div>

      {/* ── SUPPORT OPTION CARDS ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: FaWhatsapp,
              title: "General Support",
              desc: "Get help with your account, games or any general enquiry.",
              cta: "Chat on WhatsApp",
              href: `https://wa.me/${WHATSAPP_NUMBER}`,
              external: true,
              isWhatsApp: true,
            },
            {
              icon: Package,
              title: "Order Support",
              desc: "Track or get assistance with an existing purchase or delivery.",
              cta: "View Order Status",
              href: "/order-status",
              external: false,
              isWhatsApp: false,
            },
            {
              icon: CreditCard,
              title: "Payment Help",
              desc: "Questions about UPI, transaction reference or payment verification?",
              cta: "Contact via WhatsApp",
              href: `https://wa.me/${WHATSAPP_NUMBER}`,
              external: true,
              isWhatsApp: true,
            },
          ].map(({ icon: Icon, title, desc, cta, href, external, isWhatsApp }) => (
            <div
              key={title}
              className="bg-[#111111] border border-white/8 rounded-2xl p-5 flex flex-col gap-3 hover:-translate-y-0.5 hover:border-white/15 transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[#E00000]/8 border border-[#E00000]/15">
                <Icon className="w-4 h-4 text-[#E00000]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-black uppercase tracking-wider text-white mb-1">{title}</h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed">{desc}</p>
              </div>
              {external ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#E00000] hover:text-[#B50000] transition mt-1"
                >
                  {isWhatsApp && <FaWhatsapp className="w-3.5 h-3.5" />}
                  {cta} <ArrowRight className="w-3 h-3" />
                </a>
              ) : (
                <Link
                  to={href}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#E00000] hover:text-[#B50000] transition mt-1"
                >
                  {cta} <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          ))
          }
        </div>
      </div>

      {/* ── TWO-COLUMN MAIN LAYOUT ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-6">

            {/* CONTACT INFO */}
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 flex flex-col gap-5">
              <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400 select-none">
                Contact Information
              </h2>
              <div className="flex flex-col gap-4 text-sm">
                <a
                  href="tel:+916379490178"
                  className="flex items-center gap-3 text-[#555555] hover:text-[#111111] transition group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] border border-[#E5E5E5] flex items-center justify-center shrink-0 group-hover:border-[#D4D4D4] transition">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                  <span className="font-semibold">+91 63794 90178</span>
                </a>
                <a
                  href="mailto:cg39support@gmail.com"
                  className="flex items-center gap-3 text-[#555555] hover:text-[#111111] transition group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] border border-[#E5E5E5] flex items-center justify-center shrink-0 group-hover:border-[#D4D4D4] transition">
                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                  <span className="font-semibold break-all">cg39support@gmail.com</span>
                </a>
                <div className="flex items-start gap-3 text-zinc-400">
                  <div className="w-8 h-8 rounded-lg bg-white/4 border border-white/8 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                  <div className="flex flex-col gap-1 text-[12px] font-semibold">
                    <div className="flex justify-between gap-8 text-zinc-300">
                      <span>Monday – Friday</span>
                      <span>6 AM – 11 PM</span>
                    </div>
                    <div className="flex justify-between gap-8 text-zinc-300">
                      <span>Saturday – Sunday</span>
                      <span>5 AM – 12 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WHATSAPP & INSTAGRAM DIRECT LINKS */}
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400 select-none">
                Connect Directly
              </h2>
              <p className="text-xs text-zinc-500 leading-relaxed select-none">
                For order-related assistance or quick questions, message us on WhatsApp or Instagram.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact CG39 support on WhatsApp"
                  className="flex-1 flex items-center justify-center bg-[#0d0d0d] hover:bg-[#161616] text-zinc-400 hover:text-white border border-white/8 rounded-xl p-3.5 transition hover:-translate-y-0.5 active:scale-[0.98] min-h-[48px]"
                >
                  <FaWhatsapp size={20} />
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="DM CG39 on Instagram"
                  className="flex-1 flex items-center justify-center bg-[#0d0d0d] hover:bg-[#161616] text-zinc-400 hover:text-white border border-white/8 rounded-xl p-3.5 transition hover:-translate-y-0.5 active:scale-[0.98] min-h-[48px]"
                >
                  <Instagram className="w-5 h-5 shrink-0" />
                </a>
              </div>
            </div>

            {/* QUICK HELP LINKS */}
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400 select-none">
                Quick Help
              </h2>
              <div className="flex flex-col gap-2">
                {[
                  { q: "How do I check my order?",    label: "View Order Status",  to: "/order-status",  icon: Package },
                  { q: "Where are my purchases?",     label: "My Account",         to: "/dashboard",     icon: LayoutDashboard },
                  { q: "How do I browse games?",      label: "Browse Games",        to: "/games",         icon: Gamepad2 },
                ].map(({ q, label, to, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center justify-between gap-3 bg-white hover:bg-[#F5F5F5] border border-[#E5E5E5] hover:border-[#D4D4D4] rounded-xl px-4 py-3 transition group min-h-[52px]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className="w-4 h-4 text-zinc-600 shrink-0 group-hover:text-[#E00000] transition" />
                      <div className="min-w-0">
                        <span className="text-[10px] text-zinc-600 block uppercase font-bold tracking-wider group-hover:text-zinc-500 transition">{q}</span>
                        <span className="text-xs font-bold text-[#555555] group-hover:text-[#111111] transition">{label}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0 group-hover:text-[#111111] transition group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-6">

            {/* CONTACT FORM */}
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 shadow-xl">
              <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6 select-none">
                Send a Message
              </h2>

              {/* Success banner */}
              {submitted && (
                <div className="flex items-center gap-3 bg-emerald-500/8 border border-emerald-500/15 rounded-xl px-4 py-3.5 mb-5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold">Message sent! We'll get back to you soon.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-name" className="text-[11px] font-black uppercase tracking-widest text-zinc-500 select-none">
                    Your Name <span className="text-[#E00000]">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Arun Kumar"
                    className="w-full bg-[#0d0d0d] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]/20 transition min-h-[48px]"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-email" className="text-[11px] font-black uppercase tracking-widest text-zinc-500 select-none">
                    Email Address <span className="text-[#E00000]">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. arun@email.com"
                    className="w-full bg-[#0d0d0d] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]/20 transition min-h-[48px]"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-message" className="text-[11px] font-black uppercase tracking-widest text-zinc-500 select-none">
                    Message <span className="text-[#E00000]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your issue or question in detail…"
                    className="w-full bg-[#0d0d0d] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]/20 transition resize-none min-h-[140px]"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full bg-[#E00000] hover:bg-[#F00000] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-5 py-4 rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.98] min-h-[52px] mt-1"
                  aria-label="Send your message to CG39 support"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                      Sending…
                    </>
                  ) : submitted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      Message Sent
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 shrink-0" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* FAQ ACCORDION */}
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400 select-none">
                Frequently Asked Questions
              </h2>
              <div className="flex flex-col gap-2">
                {FAQ_ITEMS.map((item, i) => (
                  <FaqItem
                    key={i}
                    index={i}
                    q={item.q}
                    a={item.a}
                    isOpen={openFaq === i}
                    onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                  />
                ))}
              </div>
              <div className="pt-2 border-t border-white/5">
                <p className="text-[10px] text-zinc-600 leading-relaxed select-none">
                  Still have questions?{" "}
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E00000] hover:text-[#B50000] transition font-bold underline underline-offset-2"
                  >
                    Contact us on WhatsApp
                  </a>
                  .
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Contact;