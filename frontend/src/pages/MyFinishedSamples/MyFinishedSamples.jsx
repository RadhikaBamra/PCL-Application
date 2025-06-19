import React, { useEffect, useState } from "react";
import "./MyFinishedSamples.css";
import { assets } from "../../assets/assets";

const MyFinishedSamples = () => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const token = userData.token || "";

  const fetchMyFinishedSamples = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/samples/my-finished-samples",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) setSamples(data);
      else setError(data.message || "Failed to fetch your samples");
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyFinishedSamples();
  }, []);

  if (loading)
    return <p className="loading-text">Loading your finished samples...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="my-finished-samples-container">
      <h2 className="my-finished-samples-title">My Finished Sample Reports</h2>
      {samples.length === 0 ? (
        <p className="no-samples-text">
          You don’t have any finished samples yet.
        </p>
      ) : (
        <div className="sample-grid">
          {samples.map((sample) => (
            <div key={sample._id} className="sample-card">
              <div className="sample-title">{sample.sampleCode}</div>

              <div className="sample-details">
                <p>
                  <b>Type:</b> {sample.type}
                </p>
                <p>
                  <b>Status:</b> {sample.status}
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

export default MyFinishedSamples;
