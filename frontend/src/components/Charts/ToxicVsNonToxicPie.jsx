import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#dc2626", "#10b981"]; // Red for toxic, green for non-toxic

const ToxicVsNonToxicPie = ({ data }) => {
  if (
    !data ||
    typeof data !== "object" ||
    data.toxic === undefined ||
    data.nonToxic === undefined
  ) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="text-md font-semibold mb-4 text-center">
          Toxic vs Non-Toxic
        </h3>
        <p className="text-center text-gray-500">No data available</p>
      </div>
    );
  }

  const chartData = [
    { name: "Toxic", value: data.toxic },
    { name: "Non-Toxic", value: data.nonToxic },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="text-md font-semibold mb-4 text-center">
        Toxic vs Non-Toxic
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
            label
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ToxicVsNonToxicPie;
