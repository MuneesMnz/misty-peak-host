import React from "react";
import { Navigate, Route } from "react-router-dom";

const PrivateRoute = ({ component: Component, isUser, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isUser ? <Component {...props} /> : <Navigate to="/login" />
      }
    />
  );
};

export default PrivateRoute;
