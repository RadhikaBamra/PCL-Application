import React from "react";
import "./Homepage.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../StoreContext/StoreContext";

const Homepage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const location = useLocation();

  const role = user?.role || "unknown";

  const submitPageRedirect = () => {
    navigate("/submit-sample");
  };

  return (
    <>
      <div className="homepage-container">
        <h1>You have logged in as {role}</h1>
      </div>

      <div className="homepage">
        <section className="intro">
          <h1>Understand Your Samples, Understand Your Environment</h1>
          <p>
            At EcoSample Lab, we empower individuals, researchers, and
            organizations to monitor and protect their environment by providing
            transparent, accessible, and expert-driven sample analysis services.
          </p>
          <p>
            We offer clear, easy-to-follow guides for water, air, soil, and
            waste analysis. Our platform combines reliable laboratory testing
            with a secure online portal that tracks your sample submissions,
            provides real-time updates, and delivers results straight to your
            dashboard.
          </p>
        </section>

        <section className="how-it-works">
          <h2>How It Works</h2>
          <ol>
            <li>
              <strong>Collect and Submit Your Sample:</strong> Visit any of our
              drop-off centers or schedule a pickup to submit your sample. Each
              sample is tagged and safely stored with your user ID. We support a
              wide range of testing categories — from toxic effluent analysis to
              drinking water purity.
            </li>
            <li>
              <strong>Log the Sample in Your Account:</strong> Once submitted,
              log in to your EcoSample Lab account to register your sample.
              You’ll receive a digital ID to track it through every stage of
              analysis.
            </li>
            <li>
              <strong>Track and Receive Results Online:</strong> We’ll notify
              you once your sample is received, processed, and analyzed. Get
              access to detailed reports, charts, and downloadable PDFs — all in
              your personal dashboard.
            </li>
            <li>
              <strong>Access Sample History Anytime:</strong> Whether you're a
              first-time user or a long-term researcher, your full testing
              history is securely stored and accessible anytime.
            </li>
          </ol>
          <div className="action-buttons">
            <button>Explore Sample Guides</button>
            <button onClick={submitPageRedirect}>Submit a Sample</button>
            <button>View Dashboard</button>
          </div>
        </section>

        <section className="why-choose-us">
          <h2>Why Choose Us</h2>
          <ul>
            <li>
              <strong>Environmental Impact Focused:</strong> We specialize in
              analysis for pollution control, water quality, air contamination,
              and soil health.
            </li>
            <li>
              <strong>Confidential & Secure:</strong> Your data and samples are
              handled with care and full compliance.
            </li>
            <li>
              <strong>Results You Can Use:</strong> Get clear, actionable
              insights from certified labs.
            </li>
            <li>
              <strong>Expert-Reviewed Testing Protocols:</strong> Backed by
              leading scientists and environmental experts.
            </li>
          </ul>
        </section>

        <section className="sample-types">
          <h2>Featured Sample Types</h2>
          <div className="samples">
            <div className="sample-card">
              <h3>Water Testing</h3>
              <p>From industrial discharge to groundwater safety.</p>
            </div>
            <div className="sample-card">
              <h3>Air Quality Testing</h3>
              <p>Monitor pollutants, toxins, and particulates.</p>
            </div>
            <div className="sample-card">
              <h3>Soil Testing</h3>
              <p>Detect heavy metals, fertility levels, and contaminants.</p>
            </div>
            <div className="sample-card">
              <h3>Hazardous Waste Testing</h3>
              <p>Understand what you're handling — safely and legally.</p>
            </div>
          </div>
          <button className="primary" onClick={submitPageRedirect}>
            Get Tested
          </button>
        </section>

        <section className="expert-panel">
          <h2>Expert Panel</h2>
          <p>
            Meet the environmental scientists and analysts behind your results.
          </p>
          <button>View Team</button>
        </section>

        <section className="updates">
          <h2>Latest Updates</h2>
          <ul>
            <li>
              <strong>April 2025:</strong> Microplastic levels in borewell water
              rising in 3 major cities.
            </li>
            <li>
              <strong>March 2025:</strong> Soil testing guidelines updated for
              urban green projects.
            </li>
          </ul>
          <button className="read-more-btn">Read More</button>
        </section>

        <section className="trusted-by">
          <h2>Trusted By</h2>
          <div className="partners">
            <span>NPCB</span>
            <span>State Water Boards</span>
            <span>CleanTech Labs</span>
            <span>EnviroSafe Projects</span>
          </div>
        </section>

        <section className="contact-cta">
          <h2>Still Have Questions?</h2>
          <p>
            Visit our <a href="/contact">Contact Page</a> or call our support
            team to learn more about submitting samples, understanding reports,
            and environmental compliance.
          </p>
        </section>
      </div>
    </>
  );
};

export default Homepage;
