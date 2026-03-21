// ----- TopCandidatesChart Component -----
// Clean horizontal bar chart showing top candidates by votes

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { formatNumber, formatShortNumber } from "../utils/formatters";
import { SECONDARY } from "../utils/colors";
import { useAppSettings } from "../context/useAppSettings";

const TopCandidatesTooltip = ({ active, payload, t }) => {
  if (active && payload?.[0]) {
    const d = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 text-sm">
        <p className="font-semibold text-gray-800 dark:text-slate-100">{d.fullName}</p>
        <p className="text-[#1B2A4A] dark:text-cyan-300 font-medium">{d.party}</p>
        <p className="text-gray-500 dark:text-slate-300">{d.constituency}</p>
        <p className="text-gray-500 dark:text-slate-300">
          {t.common.votes}: <span className="font-medium text-gray-800 dark:text-slate-100">{formatNumber(d.votes)}</span>
        </p>
      </div>
    );
  }
  return null;
};

const TopCandidatesChart = ({ data }) => {
  const { t } = useAppSettings();
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
          {t.common.noData}
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d.candidate_name.length > 18 ? d.candidate_name.slice(0, 18) + "..." : d.candidate_name,
    fullName: d.candidate_name,
    votes: d.votes,
    party: d.party,
    constituency: d.constituency,
  }));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5 card-3d">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-4">{t.charts.top10Candidates}</h3>
      <ResponsiveContainer width="100%" height={380}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
          <XAxis type="number" tickFormatter={formatShortNumber} tick={{ fontSize: 12, fill: "#94a3b8" }} />
          <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: "#cbd5e1" }} />
          <Tooltip content={<TopCandidatesTooltip t={t} />} />
          <Bar dataKey="votes" fill={SECONDARY} radius={[0, 4, 4, 0]} maxBarSize={24} opacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopCandidatesChart;
