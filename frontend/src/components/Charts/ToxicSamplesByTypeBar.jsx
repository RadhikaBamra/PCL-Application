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

const ToxicSamplesByTypeBar = ({ data }) => {
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 col-span-2">
        <h3 className="text-md font-semibold mb-4 text-center">
          Toxic Samples by Type
        </h3>
        <p className="text-center text-gray-500">No data available</p>
      </div>
    );
  }

  const chartData = Object.entries(data).map(([type, count]) => ({
    type,
    count,
  }));

  return (
    <div className="bg-white rounded-xl shadow-md p-4 col-span-2">
      <h3 className="text-md font-semibold mb-4 text-center">
        Toxic Samples by Type
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ToxicSamplesByTypeBar;
