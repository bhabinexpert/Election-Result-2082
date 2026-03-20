// ----- StatCard Component -----
// Displays a single key metric in an attractive card (Nepal-themed palette)

import { formatNumber } from "../utils/formatters";
import { STAT_COLORS } from "../utils/colors";

const StatCard = ({ title, value, icon, color = "crimson", subtitle }) => {
  const palette = STAT_COLORS[color] || STAT_COLORS.crimson;

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-all duration-300 overflow-hidden group card-3d glossy">
      {/* Top color bar */}
      <div className={`h-1 bg-linear-to-r ${palette.gradient}`} />

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-slate-300 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              {typeof value === "number" ? formatNumber(value) : value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-400 dark:text-slate-400 mt-1">{subtitle}</p>
            )}
          </div>
          <div
            className={`${palette.bg} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}
          >
            <span className={`text-xl ${palette.text}`}>{icon}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
