import { Navigate } from "react-router-dom";

export default function RoleProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  console.log("🔐 RoleProtectedRoute check:");
  console.log("Token:", token);
  console.log("Role:", role);
  console.log("Allowed Roles:", allowedRoles);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
