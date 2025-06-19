import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../StoreContext/StoreContext";
import "./SubmitSample.css";

const SubmitSample = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const location = useLocation();

  const role = user?.role || location.state?.role || "user";
  const fullName = user?.fullName || location.state?.fullName || "User";

  const [sampleType, setSampleType] = useState("");
  const [parameters, setParameters] = useState({});
  const [guestInfo, setGuestInfo] = useState({ name: "", email: "" });
  const [otherInput, setOtherInput] = useState("");
  const [otherTags, setOtherTags] = useState([]);
  const [showRequired, setShowRequired] = useState(false);

  const handleParameterChange = (field, value) => {
    setParameters((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddOtherTag = () => {
    if (otherInput.trim()) {
      const updatedTags = [...otherTags, otherInput.trim()];
      setOtherTags(updatedTags);
      setOtherInput("");
      handleParameterChange("otherTags", updatedTags);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = otherTags.filter((tag) => tag !== tagToRemove);
    setOtherTags(updatedTags);
    handleParameterChange("otherTags", updatedTags);
  };

  const generateSampleCode = () => {
    const toxicityTag = parameters.isToxic ? "Tx" : "NTx";
    const prefix = sampleType[0]?.toUpperCase() || "X";
    const dateCode = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const guestTag = role !== "user" && guestInfo.name ? "GUEST" : "SELF";
    return `${toxicityTag}-${prefix}-${dateCode}-${guestTag}`;
  };

  const Required = ({ condition }) =>
    showRequired && !condition ? (
      <span style={{ color: "red", marginLeft: "4px" }}>* (required)</span>
    ) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowRequired(true);

    const baseValid = sampleType && parameters.location;

    const waterValid = parameters.source && parameters.collectionTime;

    const soilValid = parameters.soilType && parameters.organicMatter;

    const airValid = parameters.collectionTime;

    const sampleValid =
      sampleType === "water"
        ? waterValid
        : sampleType === "soil"
        ? soilValid
        : sampleType === "air"
        ? airValid
        : false;

    const guestValid =
      role === "Scientist" || role === "Admin"
        ? guestInfo.name && guestInfo.email
        : true;

    if (!(baseValid && sampleValid && guestValid)) {
      alert("Please fill all the fields.");
      return;
    }

    const sampleCode = generateSampleCode();
    const submissionData = {
      sampleCode,
      type: sampleType,
      parameters,
      guestInfo: role !== "user" ? guestInfo : null,
      submittedBy: user.email,
      role,
    };

    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;

      const response = await fetch("http://localhost:5000/api/samples/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/submitted-page", { state: { sampleCode: data.sampleCode } });
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong.");
    }
  };

  const renderSampleSpecificFields = () => {
    switch (sampleType) {
      case "water":
        return (
          <>
            <label>
              Water Source:
              <Required condition={parameters.source} />
              <select
                onChange={(e) =>
                  handleParameterChange("source", e.target.value)
                }
              >
                <option value="">Select</option>
                <option value="river">River</option>
                <option value="well">Well</option>
                <option value="well">Lake</option>

                <option value="tap">Tap</option>
              </select>
            </label>
            <label>
              Collection Time:
              <Required condition={parameters.collectionTime} />
              <input
                type="time"
                onChange={(e) =>
                  handleParameterChange("collectionTime", e.target.value)
                }
              />
            </label>
          </>
        );
      case "soil":
        return (
          <>
            <label>
              Soil Type:
              <Required condition={parameters.soilType} />
              <select
                onChange={(e) =>
                  handleParameterChange("soilType", e.target.value)
                }
              >
                <option value="">Select</option>
                <option value="clay">Clay</option>
                <option value="sandy">Sandy</option>
                <option value="loamy">Loamy</option>
              </select>
            </label>
            <label>
              Organic Matter Present?
              <Required condition={parameters.organicMatter} />
              <select
                onChange={(e) =>
                  handleParameterChange("organicMatter", e.target.value)
                }
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
          </>
        );
      case "air":
        return (
          <label>
            Collection Time:
            <Required condition={parameters.collectionTime} />
            <input
              type="time"
              onChange={(e) =>
                handleParameterChange("collectionTime", e.target.value)
              }
            />
          </label>
        );
      default:
        return null;
    }
  };

  return (
    <div className="submit-sample-container">
      <h2>Submit a Sample ({role})</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Sample Type:
          <Required condition={sampleType} />
          <select
            value={sampleType}
            onChange={(e) => setSampleType(e.target.value)}
          >
            <option value="">Select</option>
            <option value="water">Water</option>
            <option value="soil">Soil</option>
            <option value="air">Air</option>
          </select>
        </label>

        <label>
          Location Collected:
          <Required condition={parameters.location} />
          <input
            type="text"
            onChange={(e) => handleParameterChange("location", e.target.value)}
          />
        </label>

        <label className="checkbox-label">
          <div className="custom-checkbox-container">
            <input
              type="checkbox"
              onChange={(e) =>
                handleParameterChange("isToxic", e.target.checked)
              }
            />
            <span>Is the sample toxic?</span>
          </div>
        </label>

        {renderSampleSpecificFields()}

        <label>
          Add Other Tags:
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <input
              type="text"
              value={otherInput}
              onChange={(e) => setOtherInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  const tag = otherInput.trim().replace(/,+$/, "");
                  if (tag && !otherTags.includes(tag)) {
                    const updatedTags = [...otherTags, tag];
                    setOtherTags(updatedTags);
                    setOtherInput("");
                    handleParameterChange("otherTags", updatedTags);
                  }
                }
              }}
              placeholder="Type and press Enter or comma"
            />
          </div>
        </label>

        <div className="tag-list">
          {otherTags.map((tag, idx) => (
            <span key={idx} className="tag-item">
              {tag}{" "}
              <button type="button" onClick={() => handleRemoveTag(tag)}>
                &times;
              </button>
            </span>
          ))}
        </div>

        {(role === "Scientist" || role === "Admin") && (
          <div className="guest-info">
            <h3>Guest Submission Info</h3>
            <label>
              Guest Name:
              <Required condition={guestInfo.name} />
              <input
                type="text"
                onChange={(e) =>
                  setGuestInfo({ ...guestInfo, name: e.target.value })
                }
              />
            </label>
            <label>
              Guest Email:
              <Required condition={guestInfo.email} />
              <input
                type="email"
                onChange={(e) =>
                  setGuestInfo({ ...guestInfo, email: e.target.value })
                }
              />
            </label>
          </div>
        )}

        <button type="submit">Submit Sample</button>
      </form>
    </div>
  );
};

export default SubmitSample;
