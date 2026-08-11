import React from "react";
import LegalLayout, { Section, Callout } from "../components/LegalLayout";
import { FileText } from "lucide-react";

const TOC = [
  { id: "digital-products",      label: "Digital Products" },
  { id: "refund-policy",         label: "Refund Policy" },
  { id: "account-responsibility",label: "Account Responsibility" },
  { id: "policy-changes",        label: "Policy Changes" },
];

const Terms = () => (
  <LegalLayout
    breadcrumb="Terms & Conditions"
    icon={FileText}
    title={<>Terms &amp; <span className="text-[#E00000]">Conditions</span></>}
    subtitle="By using CheapGames39 Store, you agree to the following terms and conditions."
    lastUpdated="August 2026"
    toc={TOC}
  >
    <Section id="digital-products" number="01" title="Digital Products">
      <p>
        All products sold are digital game licenses. No physical copies are shipped.
      </p>
      <Callout>
        Once a digital product has been delivered, it exists as a license key or account
        credential and cannot be returned in the traditional sense.
      </Callout>
    </Section>

    <Section id="refund-policy" number="02" title="Refund Policy">
      <p>
        Due to the nature of digital goods, refunds are not guaranteed once delivery
        is completed.
      </p>
      <p>
        If you believe you have received an incorrect or non-functional product, please
        contact our support team immediately via WhatsApp or the Contact page. Each
        case is reviewed individually.
      </p>
    </Section>

    <Section id="account-responsibility" number="03" title="Account Responsibility">
      <p>
        Users are responsible for maintaining the security of their accounts.
      </p>
      <p>
        You must not share your account credentials with third parties. CheapGames39
        is not liable for any loss resulting from unauthorized account access due to
        user negligence.
      </p>
    </Section>

    <Section id="policy-changes" number="04" title="Policy Changes">
      <p>
        We reserve the right to modify these terms at any time.
      </p>
      <p>
        Continued use of the CheapGames39 Store after any modification constitutes
        your acceptance of the updated terms. We encourage you to review this page
        periodically.
      </p>
    </Section>
  </LegalLayout>
);

export default Terms;