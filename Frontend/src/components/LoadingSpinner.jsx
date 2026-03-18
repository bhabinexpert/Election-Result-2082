// ----- Loading Spinner Component -----
// Displayed while data is being fetched

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-500 text-sm animate-pulse">
        Loading election data...
      </p>
    </div>
  );
};

export default LoadingSpinner;
