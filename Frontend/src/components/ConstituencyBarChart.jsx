import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatNumber, formatShortNumber } from "../utils/formatters";
import { SECONDARY } from "../utils/colors";

const ConstituencyBarChart = ({ data, title, noDataText, votesText, candidatesText }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5">
        <div className="flex items-center justify-center h-64 text-gray-400 dark:text-slate-400">
          {noDataText}
        </div>
      </div>
    );
  }

  const chartData = data.slice(0, 12);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.[0]) {
      const d = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 text-sm">
          <p className="font-semibold text-gray-800 dark:text-slate-100">{d.constituency}</p>
          <p className="text-gray-500 dark:text-slate-300">
            {votesText}:{" "}
            <span className="font-medium text-gray-800 dark:text-slate-100">
              {formatNumber(d.totalVotes)}
            </span>
          </p>
          <p className="text-gray-500 dark:text-slate-300">
            {candidatesText}:{" "}
            <span className="font-medium text-gray-800 dark:text-slate-100">
              {d.candidateCount}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={380}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
          <XAxis
            dataKey="constituency"
            tick={{ fontSize: 11, fill: "#6B7280" }}
            angle={-45}
            textAnchor="end"
            interval={0}
            height={100}
          />
          <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} tickFormatter={formatShortNumber} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="totalVotes" fill={SECONDARY} radius={[4, 4, 0, 0]} maxBarSize={40} opacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConstituencyBarChart;

