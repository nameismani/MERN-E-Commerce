import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectCurrentUser } from "../redux/features/auth/authSlice";
import { useSelector } from "react-redux";

const RequireAuth = ({ roles }) => {
  const { userInfo } = useSelector(selectCurrentUser);
  const location = useLocation();
  //  console.log(user)
  return userInfo.isAdmin ? (
    <Outlet />
  ) : userInfo ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
