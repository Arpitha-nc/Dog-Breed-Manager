import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        404 - Page Not Found
      </h1>
      <p className="text-gray-500 text-lg mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium shadow transition"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
