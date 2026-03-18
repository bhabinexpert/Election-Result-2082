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

const VoteSharePieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No data available
      </div>
    );
  }

  // Top 6 parties + group rest as "Others"
  const topParties = data.slice(0, 6);
  const otherVotes = data.slice(6).reduce((sum, d) => sum + d.totalVotes, 0);
  const chartData = [
    ...topParties,
    ...(otherVotes > 0 ? [{ party: "Others", totalVotes: otherVotes }] : []),
  ];
  const grandTotal = chartData.reduce((sum, d) => sum + d.totalVotes, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Vote Share</h3>
      <ResponsiveContainer width="100%" height={380}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="totalVotes"
            nameKey="party"
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={60}
            paddingAngle={2}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} opacity={0.85} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [
              `${formatNumber(value)} (${calcPercentage(value, grandTotal)}%)`,
              "Votes",
            ]}
            contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(v) => (v.length > 20 ? v.slice(0, 20) + "…" : v)}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VoteSharePieChart;
