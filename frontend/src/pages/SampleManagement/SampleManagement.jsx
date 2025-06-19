import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SampleManagement.css";
import { assets } from "../../assets/assets";

const SampleManagement = () => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [labUpdates, setLabUpdates] = useState({});

  const navigate = useNavigate();

  const userDataRaw = localStorage.getItem("user");
  const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
  const userRole = userData?.role || "";
  const isAdmin = userRole.toLowerCase() === "admin";
  const token = userData?.token || null;

  const fetchAssignedSamples = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/samples/samples`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        const pendingSamples = data.filter(
          (sample) => sample.status?.toLowerCase() === "pending"
        );
        setSamples(pendingSamples);
      } else setError(data.message || "Failed to fetch samples");
    } catch (e) {
      setError("Network error while fetching samples");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedSamples();
  }, []);

  const deleteSample = async (sampleId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/samples/samples/${sampleId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        fetchAssignedSamples();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to delete sample");
      }
    } catch (e) {
      alert("Network error while deleting sample");
    }
  };

  const handleLabChange = (sampleId, newLab) => {
    setLabUpdates((prev) => ({ ...prev, [sampleId]: newLab }));
  };

  const updateAssignedLab = async (sampleId) => {
    const newLab = labUpdates[sampleId];

    try {
      const res = await fetch(
        `http://localhost:5000/api/samples/${sampleId}/assign-lab`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ assignedLab: newLab }),
        }
      );

      if (res.ok) {
        console.log("Updated lab successfully!");

        setLabUpdates((prev) => {
          const newUpdates = { ...prev };
          delete newUpdates[sampleId];
          return newUpdates;
        });

        fetchAssignedSamples();
      } else {
        const err = await res.json();
        console.error("Failed to update lab:", err);
        alert(err.message || "Failed to update lab");
      }
    } catch (e) {
      console.error("Network error while updating lab", e);
      alert("Network error while updating lab");
    }
  };

  if (loading)
    return <p className="loading-text">Loading assigned samples...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="sample-management-container">
      <h2 className="text-2xl font-semibold text-center my-6">
        Pending Samples
      </h2>
      {samples.length === 0 ? (
        <p>No samples assigned to you currently.</p>
      ) : (
        samples.map((sample) => (
          <div
            key={sample._id}
            className="sample-card cursor-pointer relative-position"
            onClick={() => navigate(`/sample/${sample._id}`)}
          >
            {isAdmin && (
              <img
                src={assets.trashcan_icon}
                alt="Delete Sample"
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    window.confirm(
                      "Are you sure you want to delete this sample?"
                    )
                  ) {
                    deleteSample(sample._id);
                  }
                }}
                className="trashcan-icon"
                title="Delete Sample"
              />
            )}

            <h3>{sample.sampleCode}</h3>
            <p>
              <strong>Type:</strong> {sample.type}
            </p>
            <p>
              <strong>Status:</strong> {sample.status || "pending"}
            </p>
            <p>
              <strong>Submitted By:</strong> {sample.submittedBy} ({sample.role}
              )
            </p>

            <div
              className="lab-assignment-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="lab-row">
                <label htmlFor={`lab-${sample._id}`} className="lab-label">
                  <strong>Assigned Lab:</strong>
                </label>
                <select
                  id={`lab-${sample._id}`}
                  value={labUpdates[sample._id] ?? sample.assignedLab ?? ""}
                  onChange={(e) => handleLabChange(sample._id, e.target.value)}
                  className="lab-select"
                >
                  <option value="">-- Select Lab --</option>
                  <option value="Soil Lab">Soil Lab</option>
                  <option value="Water Lab">Water Lab</option>
                  <option value="Air Lab">Air Lab</option>
                  <option value="Quarantine Lab">Quarantine Lab</option>
                </select>
              </div>

              {labUpdates[sample._id] !== undefined &&
                labUpdates[sample._id] !== sample.assignedLab && (
                  <button
                    className="update-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateAssignedLab(sample._id);
                    }}
                  >
                    Update Lab
                  </button>
                )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SampleManagement;
