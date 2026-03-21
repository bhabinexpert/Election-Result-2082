// ----- Loading Spinner Component -----
// Displayed while data is being fetched
import { useAppSettings } from "../context/useAppSettings";

const LoadingSpinner = ({ size = "default" }) => {
  const { t } = useAppSettings();
  
  // Size configurations
  const sizeClasses = {
    small: "w-10 h-10 border-3",
    default: "w-12 h-12 sm:w-16 sm:h-16 border-3 sm:border-4",
    large: "w-16 h-16 sm:w-20 sm:h-20 border-4"
  };

  const containerHeight = {
    small: "min-h-[30vh]",
    default: "min-h-[40vh] sm:min-h-[60vh]",
    large: "min-h-[60vh] sm:min-h-[70vh]"
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerHeight[size]} w-full`}>
      <div className="bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl shadow-md border border-gray-100 dark:border-slate-800 p-6 sm:p-8 max-w-xs sm:max-w-sm w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className={`${sizeClasses[size]} border-blue-200 dark:border-slate-700 border-t-blue-600 dark:border-t-cyan-400 rounded-full animate-spin`}></div>
          </div>
          <p className="mt-4 sm:mt-6 text-gray-600 dark:text-slate-300 text-sm sm:text-base font-medium animate-pulse text-center">
            {t.common.loading}...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
