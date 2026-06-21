import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6">
      <h1 className="text-7xl font-bold text-[#B50000]">404</h1>
      <h2 className="text-3xl mt-4 font-semibold">
        Page Not Found
      </h2>
      <p className="text-gray-400 mt-3 text-center">
        The page you are looking for doesn’t exist.
      </p>

      <Link
        to="/"
        className="mt-6 bg-[#B50000] px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;