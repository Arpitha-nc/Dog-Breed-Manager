const LoadingSpinner = ({ message = "Loading data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div
        className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"
        data-testid="loading-spinner"
      ></div>
      <p className="mt-4 text-lg text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
