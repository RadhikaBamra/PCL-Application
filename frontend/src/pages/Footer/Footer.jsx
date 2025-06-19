import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-about">
          <h3>PCL Lab</h3>
          <p>
            Providing reliable pollution control lab services with advanced
            equipment and expert analysis. Helping you ensure environmental
            safety and compliance.
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/submit-sample">Submit Sample</Link>
            </li>
            <li>
              <Link to="/my-samples">My Samples</Link>
            </li>
            <li>
              <Link to="/explore-lab">Explore Lab</Link>
            </li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>Email: support@pcllab.com</p>
          <p>Phone: +91 1234-567890</p>
          <p>Address: 123 XYZ St., ABC City</p>
        </div>

        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#" aria-label="Facebook" className="social-icon">
              <img src={assets.facebook_icon} alt="Facebook" />
            </a>
            <a href="#" aria-label="Twitter" className="social-icon">
              <img src={assets.x_icon} alt="Twitter" />
            </a>
            <a href="#" aria-label="LinkedIn" className="social-icon">
              <img src={assets.linkedin_icon} alt="LinkedIn" />
            </a>
            <a href="#" aria-label="Instagram" className="social-icon">
              <img src={assets.instagram_icon} alt="Instagram" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} PCL Lab. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
