import { Navigate } from "react-router-dom";
import useUserRole from "../hooks/useUserRole";
import LoadingSpinner from "../components/shared/LoadingSpinner";

const DashboardRedirect = () => {
  const { role, isLoading } = useUserRole();

  if (isLoading || !role) return <LoadingSpinner />;

  if (role === "admin") return <Navigate to="admin-home" replace />;
  if (role === "buyer") return <Navigate to="buyer-home" replace />;
  return <Navigate to="worker-home" replace />;
};

export default DashboardRedirect;