import React, { useState } from "react";
import "./LoginChoice.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../StoreContext/StoreContext";

const LoginForm = ({ type }) => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    institution: "",
    rollNumber: "",
    adminKey: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    console.log("Login button clicked");

    if (!formData.email || !formData.password) {
      alert("Please fill all the fields");
      return;
    }

    console.log("Sending login request to backend with:", {
      email: formData.email,
      password: formData.password,
      role: type,
    });
    console.log("Before try/axios - about to call backend");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
          role: type,
        }
      );

      console.log("Login response:", response.data);

      if (response.data.success) {
        alert("Login successful");

        // Save token to localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("fullName", response.data.fullName);

        setUser({
          fullName: response.data.fullName,
          email: response.data.email,
          role: response.data.role,
          token: response.data.token,
          institution: response.data.institution,
          rollNumber: response.data.rollNumber,
        });

        navigate("/home");
      } else {
        alert(response.data.message || "Login failed");
      }
    } catch (error) {
      alert("Login error: " + (error.response?.data?.message || error.message));
    }
  };

  const handleSignup = async () => {
    if (
      !formData.password ||
      !formData.email ||
      !formData.fullName ||
      !formData.confirmPassword
    ) {
      alert("Please fill all the fields");
      return;
    } else if (
      (type === "User" && !formData.institution) ||
      (type === "Scientist" && !formData.rollNumber) ||
      (type === "Admin" && !formData.adminKey)
    ) {
      alert("Please fill all the fields");
      return;
    } else if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          institution: formData.institution,
          rollNumber: formData.rollNumber,
          adminKey: formData.adminKey,
          role: type,
        }
      );

      alert("Signed up successfully");
      setIsSignup(false);
    } catch (error) {
      alert(
        "Signup error: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="login-form-inner">
      {!isSignup ? (
        <>
          <input
            type="text"
            name="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <div className="form-buttons">
            <button className="login-main-btn" onClick={handleLogin}>
              Login
            </button>
            <button className="signup-btn" onClick={() => setIsSignup(true)}>
              Sign Up
            </button>
          </div>
        </>
      ) : (
        <>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />

          {type === "User" && (
            <input
              type="text"
              name="institution"
              placeholder="Name of Institution"
              value={formData.institution}
              onChange={handleInputChange}
            />
          )}
          {type === "Scientist" && (
            <input
              type="text"
              name="rollNumber"
              placeholder="Roll Number"
              value={formData.rollNumber}
              onChange={handleInputChange}
            />
          )}
          {type === "Admin" && (
            <input
              type="text"
              name="adminKey"
              placeholder="Admin Access Key"
              value={formData.adminKey}
              onChange={handleInputChange}
            />
          )}

          <div className="form-buttons">
            <button className="login-main-btn" onClick={handleSignup}>
              Sign Up
            </button>
            <button className="signup-btn" onClick={() => setIsSignup(false)}>
              Back to Login
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const LoginChoice = () => {
  const [selected, setSelected] = useState(null);

  const toggleOption = (type) => {
    setSelected((prev) => (prev === type ? null : type));
  };

  return (
    <div className="login-options-container">
      <h1 className="login-title">Choose Login Type</h1>
      <div className="login-buttons">
        {["User", "Scientist", "Admin"].map((type) => (
          <div
            key={type}
            className={`expanding-box ${selected === type ? "open" : ""}`}
          >
            <button className="login-btn" onClick={() => toggleOption(type)}>
              Login as {type}
            </button>
            <div className="expanding-content">
              {selected === type && <LoginForm type={type} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoginChoice;
