// ----- GenderChart Component -----
// Single donut chart showing candidate count by gender + vote summary

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { formatNumber } from "../utils/formatters";
import { GENDER_COLORS } from "../utils/colors";
import { useAppSettings } from "../context/AppSettingsContext";

const GenderChart = ({ data }) => {
  const { t } = useAppSettings();
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
          {t.common.noData}
      </div>
    );
  }

  const pieData = data.map((d) => ({
    name: d.gender.charAt(0).toUpperCase() + d.gender.slice(1),
    candidates: d.candidateCount,
    votes: d.totalVotes,
    color: GENDER_COLORS[d.gender] || "#9CA3AF",
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.[0]) {
      const d = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 text-sm">
          <p className="font-semibold text-gray-800 dark:text-slate-100">{d.name}</p>
          <p className="text-gray-500 dark:text-slate-300">{t.common.candidates}: <span className="font-medium text-gray-800 dark:text-slate-100">{formatNumber(d.candidates)}</span></p>
          <p className="text-gray-500 dark:text-slate-300">{t.common.votes}: <span className="font-medium text-gray-800 dark:text-slate-100">{formatNumber(d.votes)}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-4">{t.charts.genderDistribution}</h3>
      <ResponsiveContainer width="100%" height={340}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="candidates"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={110}
            innerRadius={55}
            paddingAngle={3}
          >
            {pieData.map((entry, i) => (
              <Cell key={i} fill={entry.color} opacity={0.85} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GenderChart;
