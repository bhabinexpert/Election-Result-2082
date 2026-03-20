// ----- VoteSharePieChart Component -----
// Pie chart showing vote share distribution among top parties

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatNumber, calcPercentage } from "../utils/formatters";
import { CHART_COLORS } from "../utils/colors";
import { useAppSettings } from "../context/AppSettingsContext";

const VoteSharePieChart = ({
  data,
  title = "Vote Share",
  valueLabel = "Votes",
  nameKey = "party",
  othersLabel = "Others",
}) => {
  const { t } = useAppSettings();
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 dark:text-slate-400">
        {t.common.noData}
      </div>
    );
  }

  // Top 6 parties + group rest as "Others"
  const topParties = data.slice(0, 6);
  const otherVotes = data.slice(6).reduce((sum, d) => sum + d.totalVotes, 0);
  const chartData = [
    ...topParties,
    ...(otherVotes > 0 ? [{ [nameKey]: othersLabel, totalVotes: otherVotes }] : []),
  ];
  const grandTotal = chartData.reduce((sum, d) => sum + d.totalVotes, 0);

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5 card-3d">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="totalVotes"
            nameKey={nameKey}
            cx="50%"
            cy="45%"
            outerRadius={105}
            innerRadius={55}
            paddingAngle={2}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} opacity={0.85} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [
              `${formatNumber(value)} (${calcPercentage(value, grandTotal)}%)`,
              valueLabel,
            ]}
            contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
          />
          <Legend
            verticalAlign="bottom"
            height={100}
            wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }}
            formatter={(v) => (v.length > 35 ? v.slice(0, 35) + "…" : v)}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VoteSharePieChart;
