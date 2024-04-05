import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectCurrentUser } from "../redux/features/auth/authSlice";
import { useSelector } from "react-redux";

const Layout = () => {
  const { userInfo } = useSelector(selectCurrentUser);
  const location = useLocation();
  return userInfo ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default Layout;
