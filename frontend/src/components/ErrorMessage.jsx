import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

const ErrorMessage = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="flex justify-center items-center py-10">
      <div
        role="alert"
        className="
          relative bg-red-100 border border-red-400 bg-primary px-4 py-3 rounded-lg
          shadow-md flex items-center justify-between gap-4 w-full max-w-md
        "
      >
        <span className="block sm:inline">
          {message || "Something went wrong."}
        </span>
        <button
          onClick={() => setIsVisible(false)}
          className="
            absolute top-2 right-2 p-1 rounded-full text-red-700 hover:bg-red-200
            focus:outline-none focus:ring-2 focus:ring-red-500
          "
          aria-label="Dismiss alert"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
