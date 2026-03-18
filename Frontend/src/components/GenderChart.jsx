// ----- GenderChart Component -----
// Single donut chart showing candidate count by gender + vote summary

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { formatNumber } from "../utils/formatters";
import { GENDER_COLORS } from "../utils/colors";

const GenderChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No data available
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
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 text-sm">
          <p className="font-semibold text-gray-800">{d.name}</p>
          <p className="text-gray-500">Candidates: <span className="font-medium text-gray-800">{formatNumber(d.candidates)}</span></p>
          <p className="text-gray-500">Votes: <span className="font-medium text-gray-800">{formatNumber(d.votes)}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Gender Distribution</h3>
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
