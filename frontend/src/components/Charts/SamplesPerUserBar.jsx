import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const SamplesPerUserBar = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 col-span-2">
        <h3 className="text-md font-semibold mb-4 text-center">
          Samples Per User
        </h3>
        <p className="text-center text-gray-500">No data available</p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    email: item.email,
    count: item.count,
  }));

  return (
    <div className="bg-white rounded-xl shadow-md p-4 col-span-2">
      <h3 className="text-md font-semibold mb-4 text-center">
        Samples Per User
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 10, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="email" angle={-30} textAnchor="end" interval={0} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#60a5fa" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SamplesPerUserBar;
