import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-900 text-white px-6">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <h2 className="text-3xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-lg mt-2 text-gray-400">
        Oops! The page you are looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-caribbeangreen-400 text-black font-semibold rounded-lg hover:bg-green-500 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
