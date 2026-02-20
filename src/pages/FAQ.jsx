import React from "react";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-[#B50000]">
          Frequently Asked Questions
        </h1>

        <div className="space-y-6">

          <div>
            <h3 className="text-lg font-semibold text-white">
              How do I receive my game?
            </h3>
            <p className="text-gray-400">
              After successful payment, game activation details will be sent
              instantly.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">
              Is payment secure?
            </h3>
            <p className="text-gray-400">
              Yes. All transactions are encrypted and processed securely.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">
              Do you offer refunds?
            </h3>
            <p className="text-gray-400">
              Refunds depend on specific conditions. Please contact support.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">
              How can I contact support?
            </h3>
            <p className="text-gray-400">
              You can contact us via WhatsApp or Instagram.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FAQ;