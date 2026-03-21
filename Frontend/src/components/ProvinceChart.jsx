// ----- ProvinceChart Component -----
// Bar chart comparing total votes across provinces

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatNumber, formatShortNumber } from "../utils/formatters";
import { PROVINCE_COLORS } from "../utils/colors";
import { useAppSettings } from "../context/useAppSettings";

const ProvinceTooltip = ({ active, payload, t }) => {
  if (active && payload?.[0]) {
    const d = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 text-sm">
        <p className="font-semibold text-gray-800 dark:text-slate-100">{d.province_name}</p>
        <p className="text-gray-500 dark:text-slate-300">{t.common.votes}: <span className="font-medium text-gray-800 dark:text-slate-100">{formatNumber(d.totalVotes)}</span></p>
        <p className="text-gray-500 dark:text-slate-300">{t.common.candidates}: <span className="font-medium text-gray-800 dark:text-slate-100">{d.candidateCount}</span></p>
      </div>
    );
  }
  return null;
};

const ProvinceChart = ({ data }) => {
  const { t } = useAppSettings();
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
          {t.common.noData}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-4">
        {t.charts.votesByProvince}
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="province_name" tick={{ fontSize: 11, fill: "#6B7280" }} />
          <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} tickFormatter={formatShortNumber} />
          <Tooltip content={<ProvinceTooltip t={t} />} />
          <Bar dataKey="totalVotes" radius={[4, 4, 0, 0]} maxBarSize={50}>
            {data.map((_, index) => (
              <Cell key={index} fill={PROVINCE_COLORS[index % PROVINCE_COLORS.length]} opacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProvinceChart;
