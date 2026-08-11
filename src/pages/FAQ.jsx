import React, { useState } from "react";
import { Link } from "react-router-dom";
import LegalLayout, { Section } from "../components/LegalLayout";
import { HelpCircle, ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "How do I receive my game?",
    a: "After successful payment, game activation details will be sent instantly. You can view your delivery details on the Order Status page once your payment has been verified.",
  },
  {
    q: "Is payment secure?",
    a: "Yes. All transactions are encrypted and processed securely. We use UPI-based payment with manual verification before any credentials are released.",
  },
  {
    q: "Do you offer refunds?",
    a: "Refunds depend on specific conditions. Please contact support. Due to the nature of digital goods, refunds are not guaranteed once delivery is completed.",
  },
  {
    q: "How can I contact support?",
    a: "You can contact us via WhatsApp or Instagram. You can also use our Contact page to send a written message.",
  },
];

const FaqAccordionItem = ({ q, a, index, isOpen, onToggle }) => (
  <div className="border border-white/8 rounded-xl overflow-hidden">
    <button
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={`faq-${index}`}
      className="w-full flex items-center justify-between px-5 py-4 text-left bg-[#151515] hover:bg-[#1a1a1a] transition-colors duration-150 min-h-[52px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E00000]/40"
    >
      <span className="text-sm font-bold text-white pr-4">{q}</span>
      <ChevronDown
        className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
    <div
      id={`faq-${index}`}
      className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
    >
      <p className="px-5 py-4 text-sm text-zinc-400 leading-relaxed border-t border-white/5 bg-[#0d0d0d]">
        {a}
      </p>
    </div>
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <LegalLayout
      breadcrumb="FAQ"
      icon={HelpCircle}
      title={<>Frequently Asked <span className="text-[#E00000]">Questions</span></>}
      subtitle="Answers to the most common questions about orders, payments and delivery."
      toc={[]}
    >
      {/* FAQ Accordion — all 4 existing questions preserved */}
      <div className="flex flex-col gap-3">
        {FAQ_ITEMS.map((item, i) => (
          <FaqAccordionItem
            key={i}
            index={i}
            q={item.q}
            a={item.a}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 text-sm text-zinc-500 leading-relaxed">
        <p>
          Didn't find your answer?{" "}
          <Link
            to="/contact"
            className="text-[#E00000] hover:text-[#B50000] underline underline-offset-2 transition font-semibold"
          >
            Contact our support team
          </Link>{" "}
          and we'll be happy to help.
        </p>
      </div>
    </LegalLayout>
  );
};

export default FAQ;