import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/auth" />;
  if (user?.TipoUsuario !== 1) return <Navigate to="/no-autorizado" />;

  return children;
}
