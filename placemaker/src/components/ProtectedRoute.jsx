import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // If no authenticated user → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated → render the protected page
  return children;
}
