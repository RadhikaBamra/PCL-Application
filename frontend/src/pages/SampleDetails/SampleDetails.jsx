import "./SampleDetails.css";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SampleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sample, setSample] = useState(null);
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [userRole, setUserRole] = useState(null);
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    const fetchSample = async () => {
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      setUserRole(user?.role || null);

      const res = await fetch(`http://localhost:5000/api/samples/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setSample(data);
      setForm({
        status: data.status || "pending",
        currentLab: data.currentLab || "",
        report: data.report || "",
      });
    };

    fetchSample();
  }, [id]);

  const handleSubmit = async () => {
    const body = new FormData();
    body.append("status", form.status);
    body.append("currentLab", form.currentLab);
    if (file) body.append("reportFile", file);

    const res = await fetch(`http://localhost:5000/api/samples/${id}/status`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    const result = await res.json();
    if (res.ok) {
      setMessage(
        form.status === "finished analysing"
          ? "Sample submitted!"
          : "Sample updated."
      );
      navigate("/finished-samples");
    } else {
      setMessage(result.message || "Error updating sample.");
    }
  };

  if (!sample) return <p className="loading-text">Loading sample...</p>;

  return (
    <div className="sample-details-container">
      <div className="sample-card">
        <h2 className="sample-code">{sample.sampleCode}</h2>

        <div className="fields-container">
          <div className="field status-field">
            <label>Status:</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="finished analysing">Finished Analysing</option>
            </select>
          </div>

          <div className="field inline-text">
            <label>Assigned Lab:</label>
            <p>{sample.assignedLab}</p>
          </div>

          <div className="field inline-text">
            <label>Type:</label>
            <p>{sample.type}</p>
          </div>

          <div className="field inline-text">
            <label>Location:</label>
            <p>{sample.parameters?.location}</p>
          </div>

          <div className="field inline-text">
            <label>Toxic:</label>
            <p>{sample.parameters?.isToxic ? "Yes" : "No"}</p>
          </div>

          {sample.type === "water" && (
            <>
              <div className="field inline-text">
                <label>Water Source:</label>
                <p>{sample.parameters?.source}</p>
              </div>
              <div className="field inline-text">
                <label>Collection Time:</label>
                <p>{sample.parameters?.collectionTime}</p>
              </div>
            </>
          )}

          {sample.type === "soil" && (
            <>
              <div className="field inline-text">
                <label>Soil Type:</label>
                <p>{sample.parameters?.soilType}</p>
              </div>
              <div className="field inline-text">
                <label>Organic Matter:</label>
                <p>{sample.parameters?.organicMatter}</p>
              </div>
            </>
          )}

          {sample.type === "air" && (
            <div className="field inline-text">
              <label>Collection Time:</label>
              <p>{sample.parameters?.collectionTime}</p>
            </div>
          )}

          {(userRole === "admin" || userRole === "scientist") &&
            sample.guestInfo && (
              <>
                <div className="field inline-text">
                  <label>Guest Name:</label>
                  <p>{sample.guestInfo.name}</p>
                </div>
                <div className="field inline-text">
                  <label>Guest Email:</label>
                  <p>{sample.guestInfo.email}</p>
                </div>
              </>
            )}

          <div className="field report-field">
            <label>Upload Report File:</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </div>

          {form.status === "finished analysing" && sample.report && (
            <div className="field inline-text">
              <label>Report:</label>
              <a href={sample.report} target="_blank" rel="noopener noreferrer">
                View Report
              </a>
            </div>
          )}

          {sample.parameters?.otherTags?.length > 0 && (
            <div className="field inline-text">
              <label>Other Tags:</label>
              <p>{sample.parameters.otherTags.join(", ")}</p>
            </div>
          )}
        </div>

        <button className="update-button" onClick={handleSubmit}>
          {form.status === "finished analysing" ? "Submit" : "Update"}
        </button>

        <p className="message">{message}</p>
      </div>
    </div>
  );
};

export default SampleDetails;
