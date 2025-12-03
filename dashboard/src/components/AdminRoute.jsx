import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ❌ No token → redirect to login
  if (!token) return <Navigate to="/login" />;

  // ❌ Not an admin → redirect to login
  if (user.role !== "admin") return <Navigate to="/login" />;

  // ✔ Allow access
  return children;
}
