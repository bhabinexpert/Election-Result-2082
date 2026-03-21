// ----- StatCard Component -----
// Displays a single key metric in an attractive card (Nepal-themed palette)

import { formatNumber } from "../utils/formatters";
import { STAT_COLORS } from "../utils/colors";

const StatCard = ({ title, value, icon, color = "crimson", subtitle }) => {
  const palette = STAT_COLORS[color] || STAT_COLORS.crimson;

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-all duration-300 overflow-hidden group card-3d glossy">
      {/* Top color bar */}
      <div className={`h-1 bg-linear-to-r ${palette.gradient}`} />

      <div className="p-3 sm:p-5">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-slate-300 mb-1 truncate">{title}</p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-slate-100 break-words">
              {typeof value === "number" ? formatNumber(value) : value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-400 dark:text-slate-400 mt-1 line-clamp-2">{subtitle}</p>
            )}
          </div>
          <div
            className={`${palette.bg} p-2 sm:p-3 rounded-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
          >
            <span className={`text-lg sm:text-xl ${palette.text}`}>{icon}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
