import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./SubmittedPage.css";

const SubmittedPage = () => {
  const location = useLocation();
  const sampleCode = location.state?.sampleCode;

  return (
    <div className="submitted-page">
      <h2>Sample Submitted Successfully!</h2>
      <p>Your sample code is:</p>
      <h3>{sampleCode}</h3>
      <Link to="/submit-sample">Submit another sample</Link>
      <p style={{ marginTop: "20px", fontSize: "16px", color: "#1d2c4d" }}>
        To view your submitted samples,{" "}
        <Link to="/my-samples" className="samples-link">
          see your samples here
        </Link>
        .
      </p>
    </div>
  );
};

export default SubmittedPage;
