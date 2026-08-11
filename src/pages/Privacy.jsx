import React from "react";
import LegalLayout, { Section, Callout } from "../components/LegalLayout";
import { LockKeyhole } from "lucide-react";

const TOC = [
  { id: "information-collected", label: "Information We Collect" },
  { id: "how-we-use",            label: "How We Use Your Information" },
  { id: "data-protection",       label: "Data Protection" },
  { id: "contact-us",            label: "Contact Us" },
];

const Privacy = () => (
  <LegalLayout
    breadcrumb="Privacy Policy"
    icon={LockKeyhole}
    title={<>Privacy <span className="text-[#E00000]">Policy</span></>}
    subtitle="At CheapGames39 Store, we value your privacy. This Privacy Policy explains how we collect, use, and protect your information."
    lastUpdated="August 2026"
    toc={TOC}
  >
    <Section id="information-collected" number="01" title="Information We Collect">
      <p>
        We collect basic information such as name, email address, and order details
        when you register or purchase games.
      </p>
      <p>
        This may include: your display name, email address, WhatsApp number (if
        provided during checkout), and purchase history associated with your account.
      </p>
    </Section>

    <Section id="how-we-use" number="02" title="How We Use Your Information">
      <p>
        Your data is used to process orders, improve user experience, and provide
        customer support.
      </p>
      <p>
        We do not use your information for unsolicited marketing. Your contact details
        are used only to communicate about your orders and support queries.
      </p>
    </Section>

    <Section id="data-protection" number="03" title="Data Protection">
      <p>
        We implement industry-standard security measures to protect your data.
        We do not sell or share your personal information with third parties.
      </p>
      <Callout>
        Your order and payment information is securely associated with your account
        and is never exposed to unauthorized parties.
      </Callout>
    </Section>

    <Section id="contact-us" number="04" title="Contact Us">
      <p>
        For any privacy concerns, contact us through WhatsApp or Instagram.
      </p>
      <p>
        You may also use our{" "}
        <a href="/contact" className="text-[#E00000] hover:text-[#B50000] underline underline-offset-2 transition font-semibold">
          Contact page
        </a>{" "}
        to submit a written enquiry.
      </p>
    </Section>
  </LegalLayout>
);

export default Privacy;