import React, { useEffect, useState } from "react";
import axios from "axios";
import StatsCard from "./StatsCard";
import {
  SampleTypePie,
  SampleStatusDonut,
  ToxicVsNonToxicPie,
  ToxicSamplesByTypeBar,
  SamplesPerUserBar,
} from "./Charts";

import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/samples/dashboard-stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <p className="dashboard-loading">Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard Overview</h1>

      <div className="stats-row">
        <StatsCard title="Total Samples" value={stats.totalSamples} />
        <StatsCard title="Pending Samples" value={stats.pendingSamples} />
        <StatsCard title="Finished Samples" value={stats.finishedSamples} />
        <StatsCard title="Samples Today" value={stats.samplesToday} />
      </div>

      <h2 className="dashboard-subtitle">Sample Distribution</h2>
      <div className="charts-grid">
        <div className="chart-card">
          <SampleTypePie data={stats.sampleTypeBreakdown} />
        </div>
        <div className="chart-card">
          <SampleStatusDonut data={stats.statusBreakdown} />
        </div>
        <div className="chart-card">
          <ToxicVsNonToxicPie data={stats.toxicBreakdown} />
        </div>
      </div>

      <h2 className="dashboard-subtitle">Toxicity & Contributions</h2>
      <div className="charts-grid">
        <div className="chart-card">
          <ToxicSamplesByTypeBar data={stats.toxicTypeBreakdown} />
        </div>
        <div className="chart-card">
          <SamplesPerUserBar data={stats.samplesPerUser} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
