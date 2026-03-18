// ----- DistrictChart Component -----
// Bar chart showing votes by district (top 15)

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { formatNumber, formatShortNumber } from "../utils/formatters";
import { SECONDARY } from "../utils/colors";

const DistrictChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No data available
      </div>
    );
  }

  // Take top 15 districts
  const chartData = data.slice(0, 15);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.[0]) {
      const d = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 text-sm">
          <p className="font-semibold text-gray-800">{d.district_name}</p>
          <p className="text-gray-400">{d.province_name}</p>
          <p className="text-gray-500">Votes: <span className="font-medium text-gray-800">{formatNumber(d.totalVotes)}</span></p>
          <p className="text-gray-500">Candidates: <span className="font-medium text-gray-800">{d.candidateCount}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Top Districts by Votes
      </h3>
      <ResponsiveContainer width="100%" height={380}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="district_name"
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

export default DistrictChart;
