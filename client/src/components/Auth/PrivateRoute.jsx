import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Check if the user is authenticated
  const isAuthenticated = localStorage.getItem("token"); // Or use context/redux

  // If authenticated, render the component; otherwise, redirect to the signin page
  return isAuthenticated ? children : <Navigate to="/auth/signin" />;
};

export default PrivateRoute;
