import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FinishedSamples.css";
import { assets } from "../../assets/assets";

const FinishedSamples = () => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const token = userData.token || "";
  const isAdmin = userData.role?.toLowerCase() === "admin";

  const fetchFinishedSamples = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/samples/samples?status=finished analysing",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) setSamples(data);
      else setError(data.message || "Failed to fetch samples");
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinishedSamples();
  }, []);

  const handleDelete = async (sampleId) => {
    if (!window.confirm("Are you sure you want to delete this sample?")) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/samples/samples/${sampleId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) fetchFinishedSamples();
      else alert("Failed to delete sample");
    } catch (err) {
      alert("Network error while deleting sample");
    }
  };

  if (loading)
    return <p className="loading-text">Loading finished samples...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="finished-samples-container">
      <h2 className="finished-samples-title">Finished Sample Reports</h2>
      {samples.length === 0 ? (
        <p>No finished samples yet.</p>
      ) : (
        <div className="sample-grid">
          {samples.map((sample) => (
            <div key={sample._id} className="sample-card">
              {isAdmin && (
                <img
                  src={assets.trashcan_icon}
                  alt="Delete Sample"
                  className="trashcan-icon"
                  title="Delete Sample"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(sample._id);
                  }}
                />
              )}

              <div className="sample-title">{sample.sampleCode}</div>

              <div className="sample-details">
                <p>
                  <b>Type:</b> {sample.type}
                </p>
                <p>
                  <b>Status:</b> {sample.status}
                </p>
                <p>
                  <b>Submitted By:</b> {sample.submittedBy} ({sample.role})
                </p>
                {sample.guestInfo?.name && (
                  <p>
                    <b>Guest:</b> {sample.guestInfo.name} (
                    {sample.guestInfo.email})
                  </p>
                )}
                {sample.collectedDate && (
                  <p>
                    <b>Collected Date:</b>{" "}
                    {new Date(sample.collectedDate).toLocaleDateString()}
                  </p>
                )}
                {sample.location && (
                  <p>
                    <b>Location:</b> {sample.location}
                  </p>
                )}
                {sample.notes && (
                  <p>
                    <b>Notes:</b> {sample.notes}
                  </p>
                )}
                <p>
                  <b>Assigned Lab:</b> {sample.assignedLab}
                </p>
              </div>

              <div className="sample-actions">
                {sample.report ? (
                  <a
                    href={`http://localhost:5000/uploads/${sample.report.replace(
                      /^uploads[\\/]/,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="report-download"
                  >
                    📄 View Report File
                  </a>
                ) : (
                  <p className="no-report">No report uploaded</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinishedSamples;
