import React from "react";

const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-white rounded-xl shadow-md px-6 py-6 w-full max-w-xs hover:scale-105 transition-transform duration-200">
      <div className="text-blue-600 text-4xl mb-3">{icon}</div>
      <h2 className="text-sm font-medium text-gray-600">{title}</h2>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
};

export default StatsCard;
