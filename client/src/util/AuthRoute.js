import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../context/auth";

export function AuthRoute({ children }) {
  const user = useContext(AuthContext);
  return user.userData ? <Navigate to="/home" /> : children;
}

export function AuthenticatedRoute({ children }) {
  const user = useContext(AuthContext);
  return user.userData ? children : <Navigate to="/" />;
}
