import React from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoutes = ({ children }) => {
  const { user } = useAuthContext();
  console.log("private");
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children
};

export default PrivateRoutes;
