import React from "react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-[#B50000]">
          Terms & Conditions
        </h1>

        <p className="text-gray-400 mb-6">
          By using CheapGames39 Store, you agree to the following terms and
          conditions.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">
          1. Digital Products
        </h2>
        <p className="text-gray-400">
          All products sold are digital game licenses. No physical copies are
          shipped.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">
          2. Refund Policy
        </h2>
        <p className="text-gray-400">
          Due to the nature of digital goods, refunds are not guaranteed once
          delivery is completed.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">
          3. Account Responsibility
        </h2>
        <p className="text-gray-400">
          Users are responsible for maintaining the security of their accounts.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">
          4. Policy Changes
        </h2>
        <p className="text-gray-400">
          We reserve the right to modify these terms at any time.
        </p>
      </div>
    </div>
  );
};

export default Terms;