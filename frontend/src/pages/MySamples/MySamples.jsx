import React, { useEffect, useState } from "react";
import "./MySamples.css";

const MySamples = () => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;
        const token = user?.token || null;
        setUserRole(user?.role || null);

        const response = await fetch("http://localhost:5000/api/samples/mine", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setSamples(data || []);
        } else {
          setError(data.message || "Failed to fetch samples");
        }
      } catch (error) {
        setError("Network error while fetching samples");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSamples();
  }, []);

  return (
    <div className="my-samples-container">
      <h2>My Submitted Samples</h2>
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : samples.length === 0 ? (
        <p className="no-samples-text">No samples submitted yet.</p>
      ) : (
        <div className="samples-list">
          {samples.map((sample, index) => (
            <div className="sample-card" key={index}>
              <h3>{sample.sampleCode}</h3>
              <p>
                <strong>Type:</strong> {sample.type}
              </p>
              <p>
                <strong>Location:</strong> {sample.parameters?.location}
              </p>
              <p>
                <strong>Toxic:</strong>{" "}
                {sample.parameters?.isToxic ? "Yes" : "No"}
              </p>

              {sample.type === "water" && (
                <>
                  <p>
                    <strong>Water Source:</strong> {sample.parameters?.source}
                  </p>
                  <p>
                    <strong>Collection Time:</strong>{" "}
                    {sample.parameters?.collectionTime}
                  </p>
                </>
              )}

              {sample.type === "soil" && (
                <>
                  <p>
                    <strong>Soil Type:</strong> {sample.parameters?.soilType}
                  </p>
                  <p>
                    <strong>Organic Matter:</strong>{" "}
                    {sample.parameters?.organicMatter}
                  </p>
                </>
              )}

              {sample.type === "air" && (
                <p>
                  <strong>Collection Time:</strong>{" "}
                  {sample.parameters?.collectionTime}
                </p>
              )}

              {sample.parameters?.otherTags?.length > 0 && (
                <p>
                  <strong>Other Tags:</strong>{" "}
                  {sample.parameters.otherTags.join(", ")}
                </p>
              )}

              {(userRole === "scientist" || userRole === "admin") &&
                sample.guestInfo && (
                  <>
                    <p>
                      <strong>Guest Name:</strong> {sample.guestInfo.name}
                    </p>
                    <p>
                      <strong>Guest Email:</strong> {sample.guestInfo.email}
                    </p>
                  </>
                )}

              <p>
                <strong>Current Status:</strong>{" "}
                {sample.status || "Not updated yet"}
              </p>

              {sample.status === "Complete" && sample.report && (
                <p>
                  <strong>Report:</strong>{" "}
                  <a
                    href={sample.report}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View your report
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySamples;
