import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#ffbb28", "#00c49f", "#ff8042", "#0088fe"];

const SampleStatusDonut = ({ data }) => {
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="text-md font-semibold mb-4 text-center">
          Sample Status
        </h3>
        <p className="text-center text-gray-500">No data available</p>
      </div>
    );
  }

  const chartData = Object.entries(data).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="text-md font-semibold mb-4 text-center">Sample Status</h3>
      <PieChart width={250} height={250}>
        {" "}
        {/* ✅ Replace ResponsiveContainer */}
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={70}
          fill="#82ca9d"
          label
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </div>
  );
};

export default SampleStatusDonut;
