import React from "react";
import "./IntroductionPage.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const IntroductionPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/login-choice");
  };

  return (
    <div>
      <img
        src={assets.IntroductionPageBackground}
        alt=""
        className="introPageImg"
      />
      <div className="context">
        <div className="context-left">
          <div className="logo">
            <img src={assets.logo} alt="" className="logo-img" />
            <div className="logo-text">PCB</div>
          </div>
          <div className="text">Pollution Control Lab</div>
          <div className="start">
            <button className="start-btn" onClick={handleStart}>
              Start
            </button>
          </div>
        </div>
        <div className="context-right">
          At Pollution Control Lab (PCB), we provide comprehensive environmental
          testing services to help monitor and manage pollution levels
          effectively. Simply submit your air, water, or soil samples through
          our secure platform, and our certified laboratory will analyze them
          using industry-grade methods. Once testing is complete, we deliver
          detailed reports with actionable insights — helping you stay informed
          and compliant with environmental standards.
        </div>
      </div>
    </div>
  );
};

export default IntroductionPage;
