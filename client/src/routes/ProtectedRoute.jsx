import {Navigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

function ProtectedRoute({children, allowedRoles}) {
  const {user, isAuthenticated} = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectPath = user.role === "MANAGER" ? "/manager-dashboard" : "/employee-dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default ProtectedRoute;