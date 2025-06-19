import React from "react";
import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const userData = localStorage.getItem("user");
  const parsedData = userData ? JSON.parse(userData) : null;
  const userRole = userData ? JSON.parse(userData).role : null;

  console.log("User role:", userRole); // 🔍 log this

  if (!userRole) {
    // Not logged in — redirect to login or homepage
    return <Navigate to="/" replace />;
  }

  if (
    !allowedRoles
      .map((role) => role.toLowerCase())
      .includes(userRole.toLowerCase())
  ) {
    // Logged in but not authorized
    return <Navigate to="/not-authorized" replace />;
  }

  // Authorized
  return children;
};

export default RoleBasedRoute;
