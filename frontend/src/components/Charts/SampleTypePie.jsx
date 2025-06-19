import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c"];

const SampleTypePie = ({ data }) => {
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="text-md font-semibold mb-4 text-center">
          Sample Type Breakdown
        </h3>
        <p className="text-center text-gray-500">No data available</p>
      </div>
    );
  }

  const chartData = Object.entries(data).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="text-md font-semibold mb-4 text-center">
        Sample Type Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={70}
            fill="#8884d8"
            label
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SampleTypePie;
