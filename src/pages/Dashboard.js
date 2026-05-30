import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pt-28 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-[#B50000] to-[#700000] rounded-2xl p-8 mb-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-3">
            Welcome to CheapGames39 
          </h1>

          <p className="text-gray-200 text-lg">
            Thank you for creating an account with us.
          </p>

          <p className="text-gray-300 mt-3">
            We're excited to have you as part of the CheapGames39 community.
          </p>

          <p className="text-gray-300 mt-2">
            Congratulations on joining us! We hope you enjoy amazing deals,
            exciting game collections, and future purchases with CheapGames39.
          </p>

          <p className="mt-4 font-semibold text-yellow-300">
            Happy Gaming
          </p>

          <p className="text-gray-300">
            — CheapGames39 Team
          </p>
        </div>

        {/* Account Information */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8">

          <h2 className="text-3xl font-bold mb-6">
            Account Information
          </h2>

          <div className="space-y-6">

            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wider">
                Username
              </p>

              <p className="text-xl font-semibold mt-1">
                {user?.user_metadata?.full_name || "User"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wider">
                Email Address
              </p>

              <p className="text-xl font-semibold mt-1 break-all">
                {user?.email}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}