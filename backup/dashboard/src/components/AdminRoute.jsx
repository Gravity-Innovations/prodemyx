import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // No token → redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Role-based redirection
  if (user.role !== "admin") {
    if (user.role === "instructor") {
      return <Navigate to="/instructor/dashboard" />;
    }
    if (user.role === "student") {
      return <Navigate to="/student/dashboard" />;
    }
    // Default redirect for any other case
    return <Navigate to="/login" />;
  }

  // Admin has access
  return children;
}
