// ----- Loading Spinner Component -----
// Displayed while data is being fetched
import { useAppSettings } from "../context/useAppSettings";

const LoadingSpinner = () => {
  const { t } = useAppSettings();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 dark:border-slate-700 border-t-blue-600 dark:border-t-cyan-400 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-500 dark:text-slate-300 text-sm animate-pulse">
        {t.common.loading}...
      </p>
    </div>
  );
};

export default LoadingSpinner;
